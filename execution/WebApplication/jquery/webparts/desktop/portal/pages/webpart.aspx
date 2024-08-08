<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="webpart.aspx.cs" Inherits="BizAgiBPM.jquery.webparts.desktop.portal.pages.webpart" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
    <title></title>
    <style type="text/css">
        body
        {
            margin: 0px;
        }
    </style>
</head>
<body>
    <div id="contracapprovalform">
        <div id="render" class="bz-webpart ui-bizagi-sharepoint-render ui-bizagi-sharepoint-webpart-parentdiv">
            <script type="text/javascript" language="javascript">

            </script>
            <script src='../../../../bizagi.configuration.js' type='text/javascript'></script>
            <script src="../../../../bizagi.loader.js" type="text/javascript"></script>
            <script src="../../../../steal.js" type="text/javascript"></script>
            <script src="../common/js/bizagi.loader.portal.js" type="text/javascript"></script>
            <script src="../common/js/bizagi.postmessage.js" type="text/javascript"></script>
            <script type="text/javascript" language="javascript">

                //var BIZAGI_PATH_TO_BASE = "../../../../../";

                //Code from default.aspx
                var loader = bizagi.loader;
                loader.preInit(["bizagiDefault", "<%= base.BizAgiEnvironment %>", undefined, "../../../../../"], [
                    "<%= base.CurrentUICulture.Name %>", "<%= base.BizAgiEnvironment %>" == "debug", "<%= base.InboxRowsPerPage %>",
                    ["<%= base.CurrencyCulture.NumberFormat.CurrencySymbol %>", "<%= base.CurrencyCulture.NumberFormat.NumberDecimalSeparator %>", "<%= base.CurrencyCulture.NumberFormat.NumberGroupSeparator %>", "<%= base.CurrencyCulture.NumberFormat.CurrencyDecimalDigits %>"],
                    ["<%= base.CurrencyCulture.DateTimeFormat.ShortDatePattern %>", "<%= base.CurrencyCulture.DateTimeFormat.ShortTimePattern %>", "<%= base.CurrencyCulture.DateTimeFormat.LongDatePattern %>", "<%= base.CurrencyCulture.Calendar.TwoDigitYearMax %>", "<%= base.CurrencyCulture.Calendar.TwoDigitYearMax - System.DateTime.Now.Year %>"],
                    ["<%= base.ReadAppSettings("UploadMaxFileSize", "1048576") %>", "<%= base.ReadAppSettings("SkipSubprocessGlobalForm", "true") %>"], "<%= base.UserPreferencesPage %>",
                    "ASP.NET_SessionId", false
                ]);
                
                //Code webparts
                //BIZAGI_PATH_TO_BASE = "../../../../../";
                var webpartObject;

                bizagi.addLoadHandlers(function () {
                    bizagi.initializeWorkportal({
                        project: "bizagiTest",
                        whenInitialized: function (workportal) {
                            var qs = bizagi.util.getQueryString();
                            var typeContract = qs["type"] || "";

                            var idCase = qs["idCase"];
                            var idWorkitem = qs["idWorkitem"];
                            var idWfClass = qs["idWfClass"] || "";
                            var buttonName = qs["buttonName"] || "";

                            var view = qs["DefaultView"] || "details";
                            var showViewToggler = qs["showViewToggler"] || "True";
                            var pageSize = qs["pageSize"] || qs["CasesByPage"] || 17;


                            var renderBehavior = qs["renderBehavior"] || 'PopUp';
                            var renderPageUrl = qs["renderPageUrl"] || '';
                            var summaryBehavior = qs["summaryBehavior"] || 'PopUp';
                            var summaryPageUrl = qs["summaryPageUrl"] || '';
                            var idWorkflow = qs["idWorkflow"] || 0;
                            var cookieName = qs["cookieName"] || 'webpart' + typeContract;

                            var remoteServer = qs["remoteServer"];
                            var iframename = qs["iframename"];
                            var adjustButtonsToContent = qs["adjustButtonsToContent"];

                            window.BIZAGI_IFRAME_IDENTIFIER = iframename;

                            switch (typeContract) {
                                case 'casesummary':
                                    if (idWfClass) {
                                        workportal.executeWebpart({
                                            webpart: "caseSummary",
                                            canvas: $("#render"),
                                            renderBehavior: renderBehavior,
                                            renderPageUrl: renderPageUrl,
                                            idWfClass: idWfClass,
                                            remoteServer: remoteServer
                                        }).done(function (result) {
                                            webpartObject = result.webpart;
                                        });
                                    } else if (idCase && idWorkitem) {
                                        workportal.executeWebpart({
                                            webpart: "caseSummary",
                                            canvas: $("#render"),
                                            renderBehavior: renderBehavior,
                                            renderPageUrl: renderPageUrl,
                                            idCase: idCase,
                                            idWorkitem: idWorkitem,
                                            remoteServer: remoteServer

                                        }).done(function (result) {
                                            webpartObject = result.webpart;
                                        });
                                    }
                                    else if (idCase) {
                                        workportal.executeWebpart({
                                            webpart: "caseSummary",
                                            canvas: $("#render"),
                                            renderBehavior: renderBehavior,
                                            renderPageUrl: renderPageUrl,
                                            idCase: idCase,
                                            remoteServer: remoteServer
                                        }).done(function (result) {
                                            webpartObject = result.webpart;
                                        });
                                    }
                                    else {
                                        workportal.executeWebpart({
                                            webpart: "caseSummary",
                                            canvas: $("#render"),
                                            renderBehavior: renderBehavior,
                                            renderPageUrl: renderPageUrl,
                                            remoteServer: remoteServer
                                        }).done(function (result) {
                                            webpartObject = result.webpart;
                                        });
                                    }

                                    break;

                                case 'caseSummaryAndRenderComplete':
                                    if (idWfClass) {
                                        workportal.executeWebpart({
                                            webpart: "caseSummaryAndRenderComplete",
                                            canvas: $("#render"),
                                            idWfClass: idWfClass,
                                            remoteServer: remoteServer
                                        }).done(function (result) {
                                            webpartObject = result.webpart;
                                        });
                                    } else if (idCase && idWorkitem) {
                                        workportal.executeWebpart({
                                            webpart: "caseSummaryAndRenderComplete",
                                            canvas: $("#render"),
                                            idCase: idCase,
                                            idWorkitem: idWorkitem,
                                            remoteServer: remoteServer

                                        }).done(function (result) {
                                            webpartObject = result.webpart;
                                        });
                                    }
                                    else if (idCase) {
                                        workportal.executeWebpart({
                                            webpart: "caseSummaryAndRenderComplete",
                                            canvas: $("#render"),
                                            idCase: idCase,
                                            remoteServer: remoteServer
                                        }).done(function (result) {
                                            webpartObject = result.webpart;
                                        });
                                    }
                                    else {
                                        workportal.executeWebpart({
                                            webpart: "caseSummaryAndRenderComplete",
                                            canvas: $("#render"),
                                            remoteServer: remoteServer
                                        }).done(function (result) {
                                            webpartObject = result.webpart;
                                        });
                                    }

                                    break;

                                case 'newCaseButton':
                                    workportal.executeWebpart({
                                        webpart: "newCaseButton",
                                        canvas: $("#render"),
                                        idWorkflow: idWorkflow,
                                        buttonName: buttonName,
                                        renderPageUrl: renderPageUrl,
                                        renderBehavior: renderBehavior
                                    }).done(function (result) {
                                        webpartObject = result.webpart;
                                    });

                                    break;

                                case 'newcaselist':
                                    workportal.executeWebpart({
                                        webpart: "newcaselist",
                                        canvas: $("#render"),
                                        renderBehavior: renderBehavior,
                                        buttonName: buttonName,
                                        remoteServer: remoteServer,
                                        renderPageUrl: renderPageUrl
                                    }).done(function (result) {
                                        webpartObject = result.webpart;
                                    });
                                    break;

                                case 'workportal':
                                    workportal.executeWebpart({
                                        webpart: "workportalComplete",
                                        canvas: $("#render"),
                                        view: view,
                                        cookieName: cookieName,
                                        showViewToggler: showViewToggler,
                                        pageSize: pageSize,
                                        remoteServer: remoteServer

                                    }).done(function (result) {
                                        webpartObject = result.webpart;
                                    });
                                    break;
                                case 'processes':
                                    workportal.executeWebpart({
                                        webpart: "processes",
                                        canvas: $("#render"),
                                        remoteServer: remoteServer
                                    }).done(function (result) {
                                        webpartObject = result.webpart;
                                    });
                                    break;

                                case 'cases':

                                    workportal.executeWebpart({
                                        webpart: "cases",
                                        canvas: $("#render"),
                                        renderBehavior: renderBehavior,
                                        renderPageUrl: renderPageUrl,
                                        summaryBehavior: summaryBehavior,
                                        summaryPageUrl: summaryPageUrl,
                                        idWorkflow: "",
                                        view: view,
                                        showViewToggler: "false",
                                        cookieName: cookieName,
                                        pageSize: pageSize,
                                        remoteServer: remoteServer
                                    }).done(function (result) {
                                        webpartObject = result.webpart;
                                    });

                                    break;

                                case 'newCase': //render
                                    if (qs["idWfClass"]) {
                                        workportal.executeWebpart({
                                            webpart: "renderComplete",
                                            canvas: $("#render"),
                                            idWfClass: idWfClass,
                                            remoteServer: remoteServer

                                        }).done(function (result) {
                                            webpartObject = result.webpart;
                                        });
                                    }
                                    break;
                                case 'activityForm':
                                case 'renderComplete': //render
                                    if (qs["idWfClass"]) {
                                        workportal.executeWebpart({
                                            webpart: "renderComplete",
                                            canvas: $("#render"),
                                            idWfClass: idWfClass,
                                            adjustButtonsToContent: adjustButtonsToContent,
                                            remoteServer: remoteServer

                                        }).done(function (result) {
                                            webpartObject = result.webpart;
                                        });
                                    } else if (qs["idCase"] && qs["idWorkitem"]) {
                                        workportal.executeWebpart({
                                            webpart: "renderComplete",
                                            canvas: $("#render"),
                                            idCase: idCase,
                                            idWorkitem: idWorkitem,
                                            adjustButtonsToContent: adjustButtonsToContent,
                                            remoteServer: remoteServer
                                        }).done(function (result) {
                                            webpartObject = result.webpart;
                                        });
                                    }
                                    else if (qs["idCase"]) {
                                        workportal.executeWebpart({
                                            webpart: "renderComplete",
                                            canvas: $("#render"),
                                            idCase: idCase,
                                            adjustButtonsToContent: adjustButtonsToContent,
                                            remoteServer: remoteServer
                                        }).done(function (result) {
                                            webpartObject = result.webpart;
                                        });
                                    }
                                    else {
                                        workportal.createWebpart({
                                            webpart: "renderComplete",
                                            canvas: $("#render"),
                                            adjustButtonsToContent: adjustButtonsToContent,
                                            remoteServer: remoteServer
                                        }).done(function (result) {
                                            webpartObject = result.webpart;
                                            result.webpart.endWaiting();
                                        });
                                    }
                                    break;
                                default:
                                    $("#render").html("<div>invalid contract</div>")
                                    break;
                            }
                        }
                    });
                });

            </script>
        </div>
    </div>
</body>
</html>
