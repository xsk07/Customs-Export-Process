/*
*   Adds an ajax prefilter in order to record a test case
*/
// Create or define namespace
bizagi = (typeof (bizagi) !== "undefined") ? bizagi : {};
bizagi.automatictesting = (typeof (bizagi.automatictesting) !== "undefined") ? bizagi.automatictesting : {};
bizagi.automatictesting.ajax = (typeof (bizagi.automatictesting.ajax) !== "undefined") ? bizagi.automatictesting.ajax : {};

// Global variables
bizagi.automatictesting.ajax.requests = [];
bizagi.automatictesting.captureQueryFormsRequest = function (pars, options) {
    var startRecording = false;
    if (pars.h_action === "QUERYFORM") {
        if (pars.h_contexttype === "metadata") {
            bizagi.automatictesting.state.setContextValue('scenarioType', 'queryForm_Process');
            startRecording = true;
        } else if (pars.h_contexttype === "entity") {
            bizagi.automatictesting.state.setContextValue('scenarioType', 'queryForm_Entity');
            startRecording = true;
        }

        if (!startRecording) return;
        
        options.serviceType = "QUERYFORM";
        recorder.showStopPanel();
        recorder.closeMainDialog();
        recorder.closeUploadDialog();

        bizagi.automatictesting.state.startRecording();
        recorder.addQuickLoginRequest();
        
    } else if (pars.queryFormGuid && pars.queryFormGuid.length === 36) {
        options.serviceType = "QUERYFORMSEARCH";
    }
};

$.ajaxPrefilter("*", function(options, originalOptions, jqXHR) {
    var url = options.url, shouldStartRecording = false;
    var data = options.data;
    
    if (data) {
        // there is data, check whether this request is for query forms
        var pars = autotest.getParams(data);
        if (pars) bizagi.automatictesting.captureQueryFormsRequest(pars, options);
    }

    // add autotesting parameter to requests
    var reqs = [
        ["rest/handlers/render", "h_AutoTesting"],
        ["rest/cases/\\d+/summary", "isAutoTesting"],
        ["rest/cases/\\d+/events", "isAutoTesting"], 
        ["rest/cases/\\d+/workitems", "isAutoTesting"]
    ];
    for (var ind in reqs) {
        if (reqs.hasOwnProperty(ind)) {
            var exp = new RegExp(reqs[ind][0]);

            if (url.toLowerCase().search(exp) !== -1) {
                var atParameter = reqs[ind][1];
                options.data = options.data + (options.data === "" ? "": "&") + atParameter + "=true";
            }
            /*
        if (url.toLowerCase().indexOf() !== -1) {
            options.data = options.data + "&h_autoTesting=true";
        }*/
        }
    }

    switch (options.serviceType) {
        case "NEWCASE":
        case "STARTPROCESS":
            //recorder.closeNewCaseDialog();
            recorder.showStopPanel();
            recorder.closeMainDialog();
            recorder.closeUploadDialog();
            shouldStartRecording = true;
            break;
        case "CREATECASES":
            recorder.closeSOADialog();
            shouldStartRecording = true;
            break;
    }
    if (shouldStartRecording) {
        bizagi.automatictesting.state.setContextValue('scenarioType', 'process');
        bizagi.automatictesting.state.startRecording();
        recorder.addQuickLoginRequest();
    }

    // If not enabled don't do anything
    if (bizagi.automatictesting.state.isRecording() == false) { return; }
    // Don't record tmpl or resources url
    if (url.indexOf("tmpl") != -1 || url.indexOf("resources.json") != -1) { return; };

    if (!options.serviceType) { options.serviceType = "UNDEFINED"; };

    // Calculate absolute path
    if (bizagi.services.ajax.useAbsolutePath == false) {
        url = bizagi.loader.basePath + url.replaceAll("../", "");
    }

    // Log requests
    var request = {
        url: url,
        data: options.data,
        method: options.type,
        response: undefined,
        success: false,
        errorMessage: undefined,
        serviceType: options.serviceType
    };

    // Attach async handlers
    jqXHR.done(function(result, status, xhr) {
        // Save success
        var contentType = xhr.getResponseHeader("Content-Type");
        var responseText = contentType.indexOf("xml") > 0 ? xhr.responseText : result;

        request.response = bizagi.clone(responseText);
        request.success = true;

        // Add to stack
        if (request.serviceType != "UNDEFINED") {
            if (request.data.indexOf("h_propertyName=fileContent") == -1) {
                bizagi.automatictesting.ajax.requests.push(request);
            }
        }

        // queryform filters
        if (request.serviceType === "QUERYFORMSEARCH") {
            window.setTimeout(function() {
                $(".caseClicked").off(); // remove access to case from autotesting
                $("#save-queryform").remove(); // remove save button on results form
                $("#edit-stored-queryform").remove();
            }, 500);
        }

    }).fail(function(_, __, message) {
        // Save failure
        request.response = arguments[0].responseText;
        if (message.name != "SyntaxError") {
            request.errorMessage = message;
        }

        // Add to stack
        if (request.serviceType != "UNDEFINED") {
            bizagi.automatictesting.ajax.requests.push(request);
        }
    });
    return;
});