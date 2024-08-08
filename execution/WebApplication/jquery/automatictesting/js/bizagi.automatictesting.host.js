$.Class.extend("bizagi.automatictesting.host", {
    /*
    *   S T A T I C    M E T H O D S
    */
    /*
    *   Check if there is an available host
    */
    isHostAvailable: function() {
        return (typeof(sharedObject) !== "undefined");
    },

    getRecorderHostUrl: function () {
        if (!this.recorderHostUrl)
            this.recorderHostUrl = "http://localhost/AutoTesting.svc/Recorder";
        
        return this.recorderHostUrl;
    },

    setRecorderHostUrl: function (url) {
        this.recorderHostUrl = url;
    }, 

    /*
    *   Invokes a method in the host
    */
    invokeHost: function (method, params) {
        var defer = new $.Deferred();

        var result = sharedObject.call(method, JSON.encode(params));

        // Attempt to parse result
        try { result = JSON.parse(result); } catch (e) { bizagi.log("Could not parse result for call " + method, e.message); };

        // Resolve deferred
        defer.resolve(result);
        return defer.promise();
    },

    createCORSRequest: function (method, url) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {

            // Check if the XMLHttpRequest object has a "withCredentials" property.
            // "withCredentials" only exists on XMLHTTPRequest2 objects.
            xhr.open(method, url, true);

        } else if (typeof XDomainRequest != "undefined") {

            // Otherwise, check if XDomainRequest.
            // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
            xhr = new XDomainRequest();
            xhr.open(method, url);

        } else {

            // Otherwise, CORS is not supported by the browser.
            xhr = null;

        }
        return xhr;
    },

    getUsers: function () {
        var users;
        $.ajax({
            url: "Rest/Authentication/Users",
            type: "get",
            dataType: "json",
            async: false
        }).done(function (response) {
            if (response.users) {
                users = response.users;
            }
        }).fail(function (jqXHR, textStatus) {
            bizagi.showMessageBox(bizagi.localization.getResource("bizagi-autotesting-messages-error-users"));
            bizagi.logError("Can't get users", textStatus);
        });
        return users;
    },

    getAssignees: function (query) {
        var self = this;
        var params = self.queryStringToHash(query);
        var assignees = [];
        if (params.h_action == "LOADFORM" && params.h_idCase && params.h_idTask) {
            var restUrl = "Rest/Cases/" + params.h_idCase + "/Tasks/" + params.h_idTask + "/Assignees";
            $.ajax({
                url: restUrl,
                type: "get",
                dataType: "json"
            }).done(function (response) {
                if (response.assignees) {
                    for (var i = 0; i < response.assignees.length; i++) {
                        assignees.push(response.assignees[i].userName);
                    }
                }
            }).fail(function (jqXHR, textStatus) {
                bizagi.showMessageBox(bizagi.localization.getResource("bizagi-autotesting-messages-error-assignees"));
            });
        }
        return assignees;
    },

    /*
    *   Save the recorded data (web app)
    */
    saveTestCase: function (requests) {
        var self = this;
        var hostUrl = self.getRecorderHostUrl();
        var def = new $.Deferred();
        var state = bizagi.automatictesting.state;
        var ctx = state.getContextObject();
        var recordedRequests = state.getRecordedRequests();
        recordedRequests = recordedRequests.concat(requests);

        var data = {
            header: JSON.stringify({
                name: "TestScenario",
                type: ctx.scenarioType
            }),
            requests: JSON.stringify(recordedRequests)
        };
        
        var xhr = bizagi.automatictesting.host.createCORSRequest('POST', hostUrl + "/SendRecordedRequests");
        if (!xhr) {
            throw new Error(bizagi.localization.getResource("bizagi-autotesting-messages-error-cors"));
        }
        // Response handlers.
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                var message;
                var objResponse;
                if (window.location.protocol === "https:") {
                    if (xhr.status == 0 || xhr.status == 404)
                        message = bizagi.localization.getResource("bizagi-autotesting-messages-error-recording-https");
                    else if (xhr.status != 200 || !xhr.responseText)
                        message = bizagi.localization.getResource("bizagi-autotesting-messages-error-recording-https");
                    else {
                        objResponse = JSON.parse(xhr.responseText);
                        message = bizagi.localization.getResource("bizagi-autotesting-messages-recordingsuccessful") + objResponse.fileName;
                    }
                } else {
                    if (xhr.status == 0 || xhr.status == 404)
                        message = bizagi.localization.getResource("bizagi-autotesting-messages-error-recording-noconsole");
                    else if (xhr.status != 200 || !xhr.responseText)
                        message = bizagi.localization.getResource("bizagi-autotesting-messages-error-recording");
                    else {
                        objResponse = JSON.parse(xhr.responseText);
                        message = bizagi.localization.getResource("bizagi-autotesting-messages-recordingsuccessful") + objResponse.fileName;
                    }
                }
                $.when(bizagi.showMessageBox(message)).done(function() { def.resolve(); });
            }
        };
        xhr.onerror = function () { };
        xhr.setRequestHeader('content-type', 'application/json');
        xhr.send(JSON.stringify(data));
        bizagi.automatictesting.state.resetState();

        return def.promise();
    },

    /*
    *   Read a scenario file and run the scenario
    */
    runScenario: function (file) {
        var self = this;
        var hostUrl = self.getRecorderHostUrl();
        var oFReader = new window.FileReader();
        oFReader.onload = function(oFrEvent) {
            var fileContents = oFrEvent.target.result;
            var scenarioObject = JSON.parse(fileContents);

            scenarioObject = self.removeLastRequestIfLoad(scenarioObject);
            scenarioObject = JSON.stringify(scenarioObject);

            var data = {};
            data["scenario"] = scenarioObject;

            var xhr = bizagi.automatictesting.host.createCORSRequest('POST', hostUrl + "/RunScenario");
            if (!xhr) {
                throw new Error(bizagi.localization.getResource("bizagi-autotesting-messages-error-cors"));
            }
            // Response handlers.
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    try {
                        if (xhr.responseText !== "") {
                            var objResponse = JSON.parse(xhr.responseText);
                            if (!objResponse.idCase || objResponse.idCase <= 0) {
                                var errorMessage = bizagi.localization.getResource("bizagi-autotesting-messages-error-invalidscenario");
                                throw new Error(errorMessage);
                            }
                            self.saveExecutedScenarioData(objResponse);
                            self.advanceScenario(objResponse.idCase);
                            bizagi.automatictesting.state.startRecording();
                            recorder.flushModal();
                        }
                    } catch (e) {
                        var promise = bizagi.showMessageBox(e);
                        $.when(promise).then(function () {
                            //recorder.openNewCaseDialog();
                            recorder.flushModal();
                            recorder.showMainDialog();
                        }).fail(function () {
                            console.log("error running scenario");
                        });
                    }
                }
            };
            xhr.onerror = function () {
                var resource = xhr.status === 0 ? "bizagi-autotesting-messages-error-recording-noconsole" : "bizagi-autotesting-messages-error-advancescenario";
                var promise = bizagi.showMessageBox(bizagi.localization.getResource(resource));
                $.when(promise).then(function () {
                    //recorder.openNewCaseDialog();
                    recorder.flushModal();
                    recorder.showMainDialog();
                    
                });
            };
            xhr.setRequestHeader('content-type', 'application/json');
            xhr.send(JSON.stringify(data));
        };
        oFReader.readAsText(file);
    },

    executeSOAPRequest: function (xmlData) {
        var self = this, xml, xmlDoc;
        $(".bz-at-soap-message").html('');
        try {
            xml = $.parseXML(xmlData);
            xmlDoc = $(xml);
        } catch (e) {
            $(".bz-at-soap-message").html('Invalid XML data');
            //bizagi.showMessageBox('Invalid XML data');
            
            return false;
        }
        
        $.ajax({
            url: "WebServices/WorkflowEngineSOA",
            type: "post",
            dataType: "xml",
            async: false,
            data: xmlData,
            serviceType: "CREATECASES",
            beforeSend: function (xhr) {
                if (!xmlDoc) return;

                var docNode = xmlDoc[0];
                if (!docNode || !docNode.childNodes) return;

                var firstNode = docNode.childNodes[0];
                if (!firstNode || !firstNode.attributes) return;

                $.each(firstNode.attributes, function (i, attrib) {
                    if (attrib.value === "http://schemas.xmlsoap.org/soap/envelope/") {
                        //SOAP 1.1
                        xhr.setRequestHeader("SOAPAction", "http://tempuri.org/createCases");
                        xhr.setRequestHeader("content-type", "text/xml");
                    }
                    else if (attrib.value === "http://www.w3.org/2003/05/soap-envelope") {
                        //SOAP 1.2
                        xhr.setRequestHeader("content-type", "application/soap+xml");
                    }
                });
            }
        }).done(function (response) {
            var processId = $(response).find('processId');
            if (processId && processId.length > 0) {
                bizagi.automatictesting.state.setRecordedRequests(JSON.stringify(bizagi.automatictesting.ajax.requests));
                self.advanceScenario(processId[0].textContent);
                recorder.flushModal();
            } else {
                var promise = bizagi.showMessageBox(bizagi.localization.getResource("bizagi-autotesting-messages-error-soap"));
                $.when(promise).then(function () {
                    // recorder.openNewCaseDialog();
                    recorder.flushModal();
                    recorder.showMainDialog();
                });
            }
        }).fail(function (xhr, textStatus) {
            var promise = bizagi.showMessageBox(bizagi.localization.getResource("bizagi-autotesting-messages-error-soap"));
            $.when(promise).then(function () {
                // recorder.openNewCaseDialog();
                recorder.flushModal();
                recorder.showMainDialog();
            });
        });
    },

    /*
    *   Save the recorded requests to storage
    */
    saveExecutedScenarioData: function (data) {
        try {
            if (data.requests) {
                bizagi.automatictesting.state.setRecordedRequests(data.requests);
            }
        } catch (e) {
            bizagi.logError("Error: " + e.message, e);
            throw bizagi.localization.getResource("bizagi-autotesting-messages-error-savescenario");
        }
    },

    /*
    *   Advance an scenario to the last activity of the case 
    */
    advanceScenario: function (idCase) {
        try {
            var cleanUri = location.protocol + "//" + location.host + location.pathname;
            window.location = cleanUri + "?widget=activityform&idCase=" + idCase;
            bizagi.automatictesting.state.setIsAdvancing();
        } catch (e) {
            bizagi.logError("Error: " + e.message, e);
            throw new Error(bizagi.localization.getResource("bizagi-autotesting-messages-error-advancescenario") + " Error: " + e.message);
        }
    },

    /*
    *   Stops the recording and remove thedata from storage
    */
    resetRecording: function () {
        var vars = this.getQueryStringParams();
        if (vars["widget"] == undefined && vars["idCase"] == undefined) {
            bizagi.automatictesting.state.resetState();
        } else if (bizagi.automatictesting.state.isAdvancing()) {
            bizagi.automatictesting.state.removeIsAdvancing();
        } else {
            bizagi.automatictesting.state.resetState();
            bizagi.automatictesting.host.resetUrl();
        }
    },

    /*
    *   Reset the url to remove querystring parameters
    */
    resetUrl: function () {
        var queryParams = this.getQueryStringParams();
        var url = "";
        var loginInfo = "";
        if (queryParams.length > 0)
            url = location.protocol + "//" + location.host + location.pathname;

        if (queryParams["userName"] != undefined) {
            if (loginInfo.length > 0) loginInfo += "&";
            loginInfo += "userName=" + queryParams["userName"];
        }
        if (queryParams["password"] != undefined) {
            if (loginInfo.length > 0) loginInfo += "&";
            loginInfo += "password=" + queryParams["password"];
        }
        if (queryParams["domain"] != undefined) {
            if (loginInfo.length > 0) loginInfo += "&";
            loginInfo += "domain=" + queryParams["domain"];
        }

        if (loginInfo.length > 0) {
            window.location = url + "?" + loginInfo;
        }
        else {
            window.location = url;
        }
    },

    /*
    *   Get the querystring parameters of the current url
    */
    getQueryStringParams: function () {
        var vars = [], hash;
        var q = document.URL.split('?')[1];
        if (q != undefined) {
            q = q.split('&');
            for (var i = 0; i < q.length; i++) {
                hash = q[i].split('=');
                vars.push(hash[1]);
                vars[hash[0]] = hash[1];
            }
        }
        return vars;
    },

    queryStringToHash: function (query) {

        if (query == '') return null;

        var hash = {};

        var vars = query.split("&");

        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            var k = decodeURIComponent(pair[0]);
            var v = decodeURIComponent(pair[1]);

            // If it is the first entry with this name
            if (typeof hash[k] === "undefined") {

                if (k.substr(k.length - 2) != '[]')  // not end with []. cannot use negative index as IE doesn't understand it
                    hash[k] = v;
                else
                    hash[k] = [v];

                // If subsequent entry with this name and not array
            } else if (typeof hash[k] === "string") {
                hash[k] = v; // replace it

                // If subsequent entry with this name and is array
            } else {
                hash[k].push(v);
            }
        }
        return hash;
    },
    /*
    *   Removes the last request from scenario if its action is load. Needed when recording scenario from
    *   a previous scenario whose last action is a load in order to avoid to repeat the last load action.
    */
    removeLastRequestIfLoad: function (scenarioObject) {
        // remove last request (should be a loadform) in order to avoid to repeat the user interaction scenario request.
        var lastRequest = scenarioObject.requests[scenarioObject.requests.length - 1];
        if (lastRequest.action === "LOAD") {
            scenarioObject.requests.pop();
        }
        return scenarioObject;
    },
    /*
    *   Tests the recorder service
    */
    testService: function() {
        var self = this;
        var hostUrl = self.getRecorderHostUrl();
        var def = new $.Deferred();
        var data = {
            input: "ok"
        };

        var xhr = bizagi.automatictesting.host.createCORSRequest('POST', hostUrl + "/TestService");
        if (!xhr) {
            throw new Error(bizagi.localization.getResource("bizagi-autotesting-messages-error-cors"));
        }
        // Response handlers.
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                var message;
                var objResponse;
                if (window.location.protocol === "https:") {
                    if (xhr.status == 0 || xhr.status == 404)
                        message = bizagi.localization.getResource("bizagi-autotesting-messages-error-recording-https");
                    else if (xhr.status != 200 || !xhr.responseText)
                        message = bizagi.localization.getResource("bizagi-autotesting-messages-error-recording-https");
                    else {
                        objResponse = JSON.parse(xhr.responseText);
                        if (objResponse.result !== "ok") {
                            message = bizagi.localization.getResource("bizagi-autotesting-messages-error-recording-https");
                        } else {
                            message = "";
                        }
                    }
                } else {
                    if (xhr.status == 0 || xhr.status == 404)
                        message = bizagi.localization.getResource("bizagi-autotesting-messages-error-recording-noconsole");
                    else if (xhr.status != 200 || !xhr.responseText)
                        message = bizagi.localization.getResource("bizagi-autotesting-messages-error-recording");
                    else {
                        objResponse = JSON.parse(xhr.responseText);
                        if (objResponse.result !== "ok") {
                            message = bizagi.localization.getResource("bizagi-autotesting-messages-error-recording");
                        } else {
                            message = "";
                        }
                    }
                }

                if (message !== "") {
                    $.when(bizagi.showMessageBox(message)).done(function() {
                        def.resolve(false); 
                        throw new Error(message);
                    });
                } else {
                    def.resolve(true);
                }
            }
        };

        xhr.onerror = function () { };
        xhr.setRequestHeader('content-type', 'application/json');
        xhr.send(JSON.stringify(data));

        return def.promise();
    }

}, {});

