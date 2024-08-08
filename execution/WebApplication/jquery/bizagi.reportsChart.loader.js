// Create or Define Bizagi namespace
var params = this.args;
bizagi = (typeof (bizagi) !== "undefined") ? bizagi : {};

var BIZAGI_DEFAULT_DEVICE = params.bizagiConfig.defaultDevice;
var BIZAGI_ENVIRONMENT = params.bizagiConfig.environment;
var BIZAGI_PATH_TO_BASE = params.bizagiConfig.PathToBase;
var BIZAGI_LOCAL_RESOURCES = params.bizagiConfig.localResources;
var BIZAGI_USE_ABSOLUTE_PATH = params.bizagiConfig.absolutePath;
var BIZAGI_DEFAULT_CURRENCY_INFO = params.bizagiConfig.currencyInfo;
var BIZAGI_SETTINGS = params.bizagiConfig.settings;
var BIZAGI_LANGUAGE = params.bizagiConfig.language;
var BIZAGI_PROXY_PREFIX = params.bizagiConfig.proxyPrefix;
var BIZAGI_AUTH_TYPE = params.bizagiConfig.authType;

var reportLoader = {
    initialize: function(params) {
        var self = this;
        params = params || {};

        self.context = params.context;

        self.report = params.reporting.report;
        self.info = params.reporting.info;
        self.components = params.reporting.components;
        self.endPoint = params.reporting.endPoint;
        self.filters = params.reporting.filters;
        self.myTeam = params.reporting.myTeam;
        self.height = params.height;

        bizagi.currentUser = self.context.currentUser;

        this.initReports();
    },

    initReports: function() {
        var self = this;        
        var intervalTime = 500;

        var intervalAction = setInterval(function() {
            var loader = bizagi.loader;
            if (loader) {
                clearInterval(intervalAction);
                self.startReports(loader);
            }
        }, intervalTime);
    },

    startReports: function(loader) {
        var self = this;
        var bizagiConfig = {};

        bizagiConfig.environment = BIZAGI_ENVIRONMENT;
        bizagiConfig.pathToBase = BIZAGI_PATH_TO_BASE || "../../";
        bizagiConfig.defaultLanguage = BIZAGI_LANGUAGE || "en";
        bizagiConfig.log = false;
        bizagiConfig.uploadMaxFileSize = BIZAGI_SETTINGS.UploadMaxFileSize || "1048576";

        loader.preInit(["bizagiDefault", bizagiConfig.environment, undefined, bizagiConfig.pathToBase], [
            bizagiConfig.defaultLanguage, bizagiConfig.log, bizagi.override.Inbox_RowsPerPage || "",
            [
                bizagi.currentUser.symbol || "$", bizagi.currentUser.decimalSeparator || ",", bizagi.currentUser
                .groupSeparator || ".", bizagi.currentUser.decimalDigits || "2"
            ],
            [
                bizagi.currentUser.shortDateFormat || "dd/MM/yyyy", bizagi.currentUser.timeFormat || "H:mm",
                bizagi.currentUser.longDateFormat || "dddd, dd' de 'MMMM' de 'yyyy"
            ],
            [bizagiConfig.uploadMaxFileSize], "", "ASP.NET_SessionId"
        ]);

        var urlDefinition = "/jquery/bizagi.module.definition.json.txt";
        if (BIZAGI_DEFAULT_DEVICE === "tablet_android") {
            urlDefinition = "jquery/bizagi.module.definition.json.txt";
        }
        if(typeof (cordova) === "undefined" && bizagiConfig.environment === "release"){
           urlDefinition = "jquery/production/bizagi.module.definition.json.txt";
        }

        loader.init({
            url: urlDefinition,
            callback: function() {

                loader.start("workportal").then(function() {

                    var workportal = new bizagi.workportal.facade({ proxyPrefix: BIZAGI_PROXY_PREFIX });

                    bizagi.util.smartphone.startLoading();

                    loader.start("reporting").then(function() {

                        var reportingModule = new bizagi.reporting.facade({
                            proxyPrefix: (typeof (bizagi.proxyPrefix) !== "undefined") ? bizagi.proxyPrefix : ""
                        });

                        $.when(reportingModule.render({
                            canvas: $("#reports-canvas"),
                            report: self.report,
                            info: self.info,
                            components: self.components,
                            filters: self.filters,
                            myTeam: self.myTeam
                        })).then(function(reportResult) {
                            $("#bizagi-reporting-wrapper").outerHeight(self.height);
                            self.attachReportEvents(reportResult);
                        });

                        bizagi.util.smartphone.stopLoading();
                    });
                });
            }
        });
    },

    /*
    * Attach events for reports object
    */
    attachReportEvents: function(report) {

        var self = this;

        report.bindWindowResize();

        report.subscribe("filterChange", function(event, filters) {
            self.filters = filters;
        });

        report.subscribe("opencase", function(event, data) {

            event.preventDefault();
            event.stopPropagation();


            //            self.publish("executeAction", {
            //                action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
            //                idCase: data.caseData.idCase,
            //                idWorkItem: data.caseData.idWorkItem,
            //                idTask: data.caseData.idTask
            //            });

            var data = {
                'idCase': data.caseData.idCase,
                'idWorkitem': data.caseData.idWorkItem || "",
                'idTask': data.caseData.idTask || ""
            };

            console.log("opencase: " + JSON.stringify(data));
            //bizagi.webpart.publish("render-case", data);
            return;

        });
    }
};

// Loading Reporting
reportLoader.initialize(params);