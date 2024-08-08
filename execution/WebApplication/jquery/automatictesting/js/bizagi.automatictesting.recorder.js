$.Class.extend("bizagi.automatictesting.recorder", {}, {

    init: function (options) {
        var self = this;
        var dataService;
        self.widget = options.widget;
        var userActivityDetected = false;

        // apply pre-conditions
        bizagi.referrerParams = bizagi.referrerParams || {};
        bizagi.override.disableFrankensteinQueryForms = true;
        
        $(document).ready(function () {
            if (!bizagi.automatictesting.state.isRecording()) {
                if (options.userName != undefined && options.domain != undefined) {
                    bizagi.automatictesting.state.setQuickLogin(options.userName, options.domain);
                } else {
                    bizagi.automatictesting.state.setQuickLogin(undefined, undefined);
                }

                this.allowQueryForms = options.allowQueryForms;
            } else {
                recorder.addQuickLoginRequest();
            }
            window.setTimeout(function () { recorder.openQuickLoginDialog(); }, 1000);
        });
    },

    openNewCaseDialog: function () {
        var self = this;
        $.when(workportal.ready())
        .done(function () {
            window.mainDialog = workportal.getMainController().showDialogWidget({
                widgetName: "newCase",
                dialogClass: "no-close",
                closeVisible: false,
                closeOnEscape: false,
                modalParameters: { title: bizagi.localization.getResource("bizagi-autotesting-recorder-title"), width: "600", height: "600" },
                buttons: [
                    {
                        text: bizagi.localization.getResource("bizagi-autotesting-recorder-soabased"),
                        click: function() {
                            mainDialog.dialogBox.dialog('close');
                            self.openSOADialog();
                        }
                    },
                    {
                        text: bizagi.localization.getResource("bizagi-autotesting-recorder-continuefromexisting"),
                        click: function() {
                            mainDialog.dialogBox.dialog('close');
                            self.openUploadDialog();
                        }
                    },
                    {
                        text: bizagi.localization.getResource("bizagi-autotesting-recorder-changeuser"),
                        click: function() {
                            self.logout();
                        }
                    }
                ]
            });
        });
    },

    openQueryFormDialog: function () {
        //var self = this;
        $.when(workportal.ready())
            .done(function () {
                window.mainDialog = workportal.getMainController().showDialogWidget({
                    widgetName: "queryform",
                    dialogClass: "no-close",
                    closeVisible: false,
                    closeOnEscape: false,
                    modalParameters: { title: bizagi.localization.getResource("bizagi-autotesting-recorder-title"), width: "600", height: "550" }
                });
            });
    },

    loadUsers: function () {
        var userlist = $("#cbUsers");
        var users = bizagi.automatictesting.host.getUsers();
        if (users) {
            for (var i = 0; i < users.length; i++) {
                userlist.append('<option>' + users[i].name + '</option>');
            }
        }
    },

    closeNewCaseDialog: function () {
        mainDialog.dialogBox.dialog('close');
    },

    flushModal: function () {
        $('.ui-widget-overlay').hide();
    },

    blockBackground: function () {
        $('.ui-widget-overlay').show();
    },
    
    showStopPanel: function() {
        $(".bz-at-recorder").zIndex($(".ui-widget-overlay.ui-front:last").zIndex() + 1).show();
    },

    hideStopPanel: function () {
        $(".bz-at-recorder").hide();
    },

    loadNewCaseWidget: function (dataService) {
        var newCaseWidget = new bizagi.workportal.widgets.newCase(desktopFacade, dataService, {
            "max-height": "746",
            height: "550",
            width: "339",
            offset: "18 -4", //x y
            activeScroll: false
        });

        $.when(newCaseWidget.render()).done(function(html) {
            var canvasNewCase = $(".bz-at-tab-process-widget");
            canvasNewCase.empty();
            canvasNewCase.append(html);
            newCaseWidget.postRender();
        });
    },

    loadQueryFormWidget: function (dataService) {
        // ReSharper disable once InconsistentNaming
        var queryWidget = new bizagi.workportal.widgets.queries.defAT(desktopFacade, dataService, {
            widgetName: "queriesDefinition"
    });
        $.when(queryWidget.render()).done(function (html) {
            var canvasQueryForm = $(".bz-at-tab-queryforms-widget");
            canvasQueryForm.empty();
            canvasQueryForm.append(html);
            queryWidget.postRender();
        });
    },

    setupMainTemplate: function (content) {
        var self = this;

        // set button labels
        $(".bz-at-btn-soa", content)
            .text(bizagi.localization.getResource("bizagi-autotesting-recorder-soabased"))
            .parent()
            .click(function () {
                self.closeMainDialog();
                self.openSOADialog();
            });
        $(".bz-at-btn-continue", content)
            .text(bizagi.localization.getResource("bizagi-autotesting-recorder-continuefromexisting"))
            .parent()
            .click(function () {
                self.closeMainDialog();
                self.openUploadDialog();
            });
        $(".bz-at-btn-change-user", content)
            .text(bizagi.localization.getResource("bizagi-autotesting-recorder-changeuser"))
            .parent()
            .click(function() {
                self.logout();
            });

        $(".bz-at-tab-container", content).tabs();
        if (recorder.allowQueryForms !== true)
            $('[href="#bz-at-tab-queryforms"]').closest('li').hide();

        $(".bz-at-init-panel").dialog({
            title: "AutoTesting",
            autoOpen: false,
            height: 700,
            width: 600,
            modal: false,
            closeVisible: false,
            closeOnEscape: false,
            dialogClass: "no-close",
            close: function() {
                //self.showMainDialog();
            }
        }).hide();

    },

    showMainDialog: function () {
        $(".bz-at-init-panel").dialog("open");




        $('.ui-widget-overlay:not(.modalNewCaseOverlay)').show();
        this.hideStopPanel();
    },

    closeMainDialog: function () {
        $('.ui-widget-overlay').hide();
        $(".bz-at-init-panel").dialog('close');
    },
    
    loadMainTemplate: function () {
        return bizagi.templateService.getTemplateWebpart("jquery/automatictesting/tmpl/main.tmpl.html");
    },

    loadRecorderTemplate: function () {
        return bizagi.templateService.getTemplateWebpart("jquery/automatictesting/tmpl/recorder.tmpl.html");
    },

    loadUploadTemplate: function () {
        return bizagi.templateService.getTemplateWebpart("jquery/automatictesting/tmpl/uploadTemplate.tmpl.html");
    },

    loadLoginTemplate: function () {
        return bizagi.templateService.getTemplateWebpart("jquery/automatictesting/tmpl/login.tmpl.html");
    },

    loadQuickLoginTemplate: function () {
        return bizagi.templateService.getTemplateWebpart("jquery/automatictesting/tmpl/quickLogin.tmpl.html");
    },

    loadSOATemplate: function () {
        return bizagi.templateService.getTemplateWebpart("jquery/automatictesting/tmpl/soa.tmpl.html");
    },

    loadWaitingTemplate: function () {
        return bizagi.templateService.getTemplateWebpart("jquery/automatictesting/tmpl/waiting.tmpl.html");
    },

    openUploadDialog: function () {
        $('.ui-widget-overlay').show();
        $("#dialog-upload").dialog("open");
    },

    closeUploadDialog: function () {
        $('.ui-widget-overlay').hide();
        $("#dialog-upload").dialog("close");
    },

    openSOADialog: function () {
        $('.ui-widget-overlay').show();
        $("#dialog-soa").dialog("open");
    },

    closeSOADialog: function () {
        $('.ui-widget-overlay').hide();
        $("#dialog-soa").dialog("close");
    },

    closeWaitingOverlay: function () {
        $('.bz-at-loading-container').remove();
    },

    closeLoginDialog: function () {
        //$('.ui-widget-overlay').hide();
        $("#dialog-login").dialog("close");
    },

    openDownload: function (response) {
        if (response.location) {
            $.fileDownload(location);
        }
    },

    openLoginDialog: function () {
        var userName = bizagi.automatictesting.state.getUser();
        var password = bizagi.automatictesting.state.getPassword();
        var domain = bizagi.automatictesting.state.getDomain();
        if (userName != "undefined" && password != "undefined" && domain != "undefined") {
            recorder.login(userName, password, domain);
        } else {
            $('.ui-widget-overlay').show();
            $("#dialog-login").dialog("open");
        }
    },

    openQuickLoginDialog: function () {
        var user = bizagi.automatictesting.state.getUser();
        var domain = bizagi.automatictesting.state.getDomain();
        if (user !== "undefined") {
            recorder.quickLogin(user, domain);
        } else {
            $('.ui-widget-overlay').show();
            $("#dialog-login").dialog("open");
        }
    },

    login: function (userName, password, domain) {
        var self = this;
        $.ajax({
            url: "Rest/Users/UserAuthentication?userName=" + userName + "&password=" + password + "&domain=" + domain,
            type: "GET",
            dataType: "json"
        }).done(function (response) {
            if (response.isAuthenticate == "true") {
                bizagi.automatictesting.state.setLogin(userName, password, domain);
                window.workportal = new bizagi.workportal.facade();
                window.workportal.execute();
                self.showStopPanel();
                $.when(workportal.ready())
                        .done(function () {
                            if (!bizagi.automatictesting.state.isRecording()) {
                                recorder.showMainDialog();
                                recorder.closeLoginDialog();
                            }
                            else {
                                recorder.flushModal();
                            }
                        });

            }
            else {
                bizagi.showMessageBox(bizagi.localization.getResource("bizagi-autotesting-messages-error-login"));
            }
        }).fail(function (/*jqXHR, textStatus*/) {
            bizagi.showMessageBox(bizagi.localization.getResource("bizagi-autotesting-messages-error-loginfields"));
        });
    },

    quickLogin: function (user, domain) {
        var self = this;
        var userData = { user: user, domain: domain, loginOption: "AutoTestingMode" };

        $.ajax({
            url: "Api/Authentication/User",
            type: "POST",
            data: userData,
            dataType: "json"
        }).done(function (response) {
            if (response.isAuthenticate === "true") {               

                $.ajax({
                    url: "Api/Authentication/BizagiConfig",
                    type: "GET"
                }).done(function(response){
                    var XSRFToken = response.XSRFToken;                   
                    
                    $.ajaxSetup({
                        headers: {
                            'X-BZXSRF-TOKEN': XSRFToken
                        }
                    });

                    if(window.sessionStorage && XSRFToken) {
                        window.sessionStorage.setItem("XSRFToken", XSRFToken);
                    }

                    bizagi.automatictesting.state.setQuickLogin(user, domain);
                    // ReSharper disable once InconsistentNaming
                    dataService = new bizagi.workportal.services.service();
                    // ReSharper disable once InconsistentNaming
                    dataService.routing = new bizagi.workportal.services.routing({ dataService: dataService });
    
                    var pars = {
                        widget: "queryform",
                        queryType: 0,
                        queryFormAction: "renderQueryForm",
                        notMigratedUrl: "",
                        paramsStoredQuery: {}
                    };
                    window.desktopFacade = new bizagi.workportal.desktop.facade(null, dataService);
                    window.workportal = new bizagi.workportal.facade(pars);
                    window.workportal.execute();
                    $.when(workportal.ready()).done(function () {
                        $.when(desktopFacade.initAsyncStuff(true)).done(function () {
                            self.showStopPanel();
                            if (!bizagi.automatictesting.state.isRecording()) {
                                recorder.loadNewCaseWidget(dataService);
                                recorder.loadQueryFormWidget(dataService);
                                recorder.closeLoginDialog();
                                recorder.showMainDialog();
                            } else {
                                recorder.flushModal();
                            }
                        });
                    });
                });
            }
            else {
                bizagi.showMessageBox(bizagi.localization.getResource("bizagi-autotesting-messages-error-login"));
            }
        }).fail(function (/*jqXHR, textStatus*/) {
            bizagi.showMessageBox(bizagi.localization.getResource("bizagi-autotesting-messages-error-login"));
        });
    },

    logout: function () {
        $.ajax({
            url: "Rest/Authentication",
            type: "DELETE",
            dataType: "json"
        }).done(function () {
            window.location = location.protocol + "//" + location.host + location.pathname;
        }).fail(function (/*jqXHR, textStatus*/) {
            window.location = location.protocol + "//" + location.host + location.pathname;
        });
    },

    render: function () {
        var self = this;
        $.when(self.loadRecorderTemplate())
            .done(function (template) {
                var content = $.tmpl(template);
                content.appendTo("body");
                $(".bz-at-recorder-stop", content).click(function () {
                    self.stop();
                });
                self.hideStopPanel();
            });

        $.when(self.loadMainTemplate())
            .done(function(template) {
                var content = $.tmpl(template);
                content.appendTo("body");

                self.setupMainTemplate(content);
            });

        $.when(self.loadSOATemplate())
            .done(function (template) {
                var content = $.tmpl(template);
                $.when(content.appendTo("body"))
                    .done(function() {
                        var fileInput = $(".bz-at-soap-upload");
                        var xmlText = $(".bz-at-soap-xml");
                        fileInput.bind('change', function( /*e*/) {
                            if (fileInput.length === 0 || fileInput[fileInput.length - 1].files.length === 0) {
                                bizagi.showMessageBox(bizagi.localization.getResource("bizagi-autotesting-messages-error-scenariofile"));
                                return;
                            }
                            var file = fileInput[0].files[0];
                            var textType = /text.*/;
                            if (textType.test(file.type)) {
                                var reader = new FileReader();
                                reader.onload = function(oFrEvent) {
                                    xmlText[0].innerText = oFrEvent.target.result;
                                };
                                reader.readAsText(file);
                            } else {
                                //bizagi.showMessageBox("File not supported");
                                $(".bz-at-soap-message").html("File not supported");
                            }
                        });
                    })
                    .done($("#dialog-soa").dialog({
                        title: bizagi.localization.getResource("bizagi-autotesting-recorder-soa-title"),
                        autoOpen: false,
                        height: 480,
                        width: 480,
                        modal: false,
                        closeVisible: false,
                        closeOnEscape: false,
                        buttons: [
                            {
                                text: bizagi.localization.getResource("bizagi-autotesting-recorder-continue"),
                                click: function() {
                                    self.closeSOADialog();
                                    self.closeMainDialog();
                                    self.blockBackground();
                                    bizagi.automatictesting.host.executeSOAPRequest($(".bz-at-soap-xml")[0].value);
                                }
                            },
                            {
                                text: bizagi.localization.getResource("bizagi-autotesting-recorder-cancel"),
                                click: function() {
                                    self.closeSOADialog();
                                    self.showMainDialog();
                                }
                            }],
                        close: function() {
                            self.closeSOADialog();
                            self.showMainDialog();
                        }
                    }));
            });

        $.when(self.loadUploadTemplate())
            .done(function (template) {
                var content = $.tmpl(template);
                $.when(content.appendTo("body"))
                    .done($("#dialog-upload").dialog({
                        title: bizagi.localization.getResource("bizagi-autotesting-recorder-upload-title"),
                        autoOpen: false,
                        height: 480,
                        width: 480,
                        modal: false,
                        closeVisible: false,
                        closeOnEscape: false,
                        buttons: [{
                            text: bizagi.localization.getResource("bizagi-autotesting-recorder-continue"),
                            click: function () {
                                var file = $(".bz-at-scenario-upload");
                                if (file.length === 0 || file[file.length - 1].files.length === 0) {
                                    bizagi.showMessageBox(bizagi.localization.getResource("bizagi-autotesting-messages-error-scenariofile"));
                                    return;
                                }
                                self.userActivityDetected = true;
                                self.closeUploadDialog();
                                self.closeMainDialog();
                                self.blockBackground();
                                bizagi.automatictesting.host.runScenario(file[file.length - 1].files[0]);
                            }
                        }, {
                            text: bizagi.localization.getResource("bizagi-autotesting-recorder-cancel"),
                            click: function () {
                                self.closeUploadDialog();
                                self.showMainDialog();
                            }
                        }],
                        close: function () {
                            self.closeUploadDialog();
                            self.showMainDialog();
                        }
                    }));
            });
        $.when(self.loadQuickLoginTemplate())
            .done(function (template) {
                var content = $.tmpl(template);
                $.when(content.appendTo("body"))
                    .done(self.loadUsers())
                    .done(function () {
                        $("#dialog-login").dialog({
                            autoOpen: false,
                            width: 250,
                            modal: false,
                            closeVisible: false,
                            closeOnEscape: false,
                            dialogClass: "no-close",
                            resizable: false,
                            buttons: [{
                                text: bizagi.localization.getResource("bizagi-autotesting-recorder-login"),
                                click: function () {
                                    self.userActivityDetected = true;
                                    var userInput = $("#cbUsers").val();
                                    var domain = userInput.split("\\")[0];
                                    var user = userInput.split("\\")[1];
                                    self.quickLogin(user, domain);
                                }
                            }],
                            close: function () {
                            }
                        });
                        $("#dialog-login input").on("keydown", function (e) {
                            if (e.keyCode == 13) {
                                var buttons = $("#dialog-login").dialog("option", "buttons");
                                buttons[0].click();
                            }
                        });
                    });
            });
        return;
    },

    stop: function () {
        var self = this;
        // Disable logging, and fetch recorded messages
        var requests = bizagi.automatictesting.ajax.requests;
        bizagi.log("Requests recorded", requests);
        bizagi.automatictesting.ajax.requests = [];

        // Save information externally
        self.blockBackground();
        $.when(self.loadWaitingTemplate()).done(function(template) {
            var content = $.tmpl(template);
            $.when(content.appendTo("body")).done(function() {
                $.when(bizagi.automatictesting.host.saveTestCase(requests)).done(function () {
                    self.hideStopPanel();
                    self.flushModal();
                    self.cleanDocument();
                    $(".ui-dialog").hide();
                    $(".ui-widget-overlay.ui-front").show();
                    self.closeWaitingOverlay();
                    self.loadNewCaseWidget(dataService);
                    self.showMainDialog();
                });
            });
        });
    },

    cleanDocument: function () {
        $(".ui-widget-overlay.ui-front:gt(0)").next().remove();
        $(".ui-widget-overlay.ui-front:gt(0)").remove();
        $("div#query-form-wrapper:last").remove();
        $("div[class='']").remove();
        $("#contentFramework").empty();
    },
    
    addLoginRequest: function () {
        var request = {
            url: "Rest/Users/UserAuthentication",
            data: "userName=" + bizagi.automatictesting.state.getUser() + "&password=" + bizagi.automatictesting.state.getPassword() + "&domain=" + bizagi.automatictesting.state.getDomain(),
            method: "GET",
            response: "{}",
            success: false,
            errorMessage: undefined,
            serviceType: "LOGIN"
        };
        bizagi.automatictesting.ajax.requests.push(request);
    },

    addQuickLoginRequest: function () {
        if (this.countRequestByServiceType('QUICKLOGIN') > 0) return;
        
        var request = {
            url: "Api/Authentication/User",
            data: "user=" + bizagi.automatictesting.state.getUser() + "&domain=" + bizagi.automatictesting.state.getDomain(),
            method: "POST",
            response: "{}",
            success: false,
            errorMessage: undefined,
            serviceType: "QUICKLOGIN"
        };
        bizagi.automatictesting.ajax.requests.push(request);
    },
    
    countRequestByServiceType: function(search) {
        var i, count = 0;
        for (i in bizagi.automatictesting.ajax.requests) {
            var req = bizagi.automatictesting.ajax.requests[i];
            if (req.serviceType === search) count++;
        }
        return count;
    }

});
