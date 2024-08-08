<%@ Page Language="c#" CodeBehind="BusinessPoliciesSelector.aspx.cs" AutoEventWireup="false"
    Inherits="BizAgiBPM.App.Admin.BusinessPolicies.BusinessPoliciesSelector" %>

<%@ Register TagPrefix="UI" Namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<!DOCTYPE HTML PUBLIC "-//W3C//Dtd HTML 4.0 transitional//EN" >
<html>
<head>
    <title>Business Policies</title>
    <meta name="GENERATOR" content="Microsoft Visual Studio .NET 7.1" />
    <meta name="CODE_LANGUAGE" content="C#" />
    <meta name="vs_defaultClientScript" content="JavaScript" />
    <meta name="vs_targetSchema" content="http://schemas.microsoft.com/intellisense/ie5" />
    <link href="../../../css/Admin/Common.css" rel="stylesheet" type="text/css" />
    <link href="../../../css/estilos.css" type="text/css" rel="stylesheet" />
    <link href="../../../css/BusinessPolicies.css" type="text/css" rel="stylesheet" />
    <link href="../../../css/WorkPortal/WPPanel.css" type="text/css" rel="stylesheet" />
    <link href="../../../css/WorkPortal/WPCustomStyles.css" type="text/css" rel="stylesheet" />
    <link href="../../../css/WorkPortal/BAWindow.css" type="text/css" rel="stylesheet" />
    <link href="../../../css/WorkPortal/WPContextMenu.css" type="text/css" rel="stylesheet" />
    <%WriteHead();%>
    <script language="javascript" type="text/javascript" src="../../../js/json2.js"></script>
    <script language="javascript" type="text/javascript" src="../../../js/implementation.js"></script>
    <script language="javascript" type="text/javascript" src="../../../js/CatMenu.js"></script>
    <script language="javascript" type="text/javascript" src="../../../js/BizAgiAJAX.js"></script>
    <script language="javaScript" type="text/javascript" src="../../../js/WorkPortal/BAWindows/prototype.js"></script>
    <script language="javaScript" type="text/javascript" src="../../../js/WorkPortal/BAWindows/window.js"></script>
    <script language="javaScript" type="text/javascript" src="../../../js/WorkPortal/BAWindows/BAWindow.js"></script>
    <script language="javascript" type="text/javascript" src="../../../js/BusinessPolicies/BusinessPoliciesSelector.js"></script>
    <script language="javascript" type="text/javascript" src="../../../js/BusinessPolicies/BusinessPoliciesCommon.js"></script>
    <script language="javascript" type="text/javascript" src="../../../js/BusinessPolicies/BusinessPolicyUtil2.js"></script>

    <script type="text/javascript" language="javascript">
    var bizVersion = sessionStorage.getItem("bizVersion");
    var basePath = sessionStorage.getItem("bizBasePath");
    var pathWpTree = basePath + "js/WorkPortal/WPtree.js?build=" + bizVersion;
    var script = document.createElement('script');

    script.setAttribute('src', pathWpTree);
    document.getElementsByTagName('head')[0].appendChild(script);
    console.log("load succesfully ::::: BusinessPolices :::::");
</script>

    <script language="javascript" type="text/javascript" src="../../../js/WorkPortal/WPContextMenu.js"></script>
    <script language="javascript" type="text/javascript" src="../../../js/WorkPortal/WPFrames.js"></script>
    <script language="javascript" type="text/javascript">
        var doc = document.documentElement;
        doc.setAttribute('data-useragent', navigator.userAgent);
      
    </script>
    <style type="text/css">
        A
        {
            text-decoration: none;
        }
        A:hover
        {
            text-decoration: none;
        }
    </style>
</head>
<script language="javascript" type="text/javascript">
    var PATH_TO_BASE_DIRECTORY = '<%=PathToBaseDirectory%>';
</script>
<body ms_positioning="FlowLayout" onclick="BAonclick(event)" onload="BAonload()">
    <div class="text" id="popupcalendar" style="position: absolute">
    </div>
    <img alt="" src="../../../img/separador/plus.gif" id="imgPlus" name="imgPlus" style="display: none" />
    <img alt="" src="../../../img/separador/plusE.gif" id="imgPlusE" name="imgPlusE"
        style="display: none" />
    <img alt="" src="../../../img/separador/minus.gif" id="imgMinus" name="imgMinus"
        style="display: none" />
    <div id="messageLayer" style="visibility: hidden; display: none;">
        <div id="messageBackgroundDiv" class="messageBackgroundDiv">
        </div>
        <div id="messageDiv">
            <div id="textContainer">
                <table>
                    <tr>
                        <td>
                            <span id="messageText"></span>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
    <div id="selectorTree" class="selectorTree">
        <%=GetSelectorTreeHTML()%>
    </div>
    <div id="floatingTree" class="floatingTree" style="display: none">
        <table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0" class="bz-table-policies">
            <tr class="middle" align="left" valign="middle">
                <td bgcolor="#FFFFFF">
                    <div id="floatingContainer" style="overflow: auto">
                        <!-- Contenido Dinamico aca -->
                    </div>
                    <div id="bottomFloatingContainer" style="display: none" align="center">
                    </div>
                </td>
            </tr>
        </table>
    </div>
    <div id="documentationBox" class="documentationBox" style="display: none">
        <table width="100%" height="100%" border="0" cellspacing="0" cellpadding="0">
            <tr align="left" valign="middle">
                <td bgcolor="#FFFFFF">
                    <div id="documentationContainer" style="overflow: auto">
                        <table class='BAXPTabTable' style='border-top: 1px solid;' width='100%' cellspacing="0"
                            cellpadding="4" border="0" valign='top'>
                            <tr height="48px">
                                <td colspan="2" style="padding-left: 10px">
                                    <img alt="" src="../../../img/BusinessPolicies/Documentation.gif" align="top" style="float: right" />
                                    <strong>
                                        <UI:CLabel ID="lblDocumentation" runat="server" Text="BusinessPolicies_Documentation" />
                                    </strong>
                                </td>
                            </tr>
                            <tr height="24px">
                                <td colspan="2" style="padding-left: 40px">
                                    <a href="javascript:void(0);" onclick="ShowRTFDocument()">
                                        <UI:CLabel ID="lblRTFLink" runat="server" Text="BusinessPolicies_Documentation_RTFLink" /></a>
                                </td>
                            </tr>
                            <tr height="24px">
                                <td colspan="2" style="padding-left: 40px">
                                    <a href="javascript:void(0);" onclick="ShowItemAttachment()">
                                        <UI:CLabel ID="lblAttachmentLink" runat="server" Text="BusinessPolicies_Documentation_AttachmentLink" /></a>
                                </td>
                            </tr>
                            <tr height="24px">
                                <td colspan="2" style="padding-left: 10px">
                                    <hr />
                                </td>
                            </tr>
                            <tr height="24px">
                                <td colspan="2" align="right" valign="bottom">
                                    <UI:CWPHtmlInputButton ID="btnBack" runat="server" Value="BtnBack" onclick="cancelShowDocumentation(); " />
                                </td>
                            </tr>
                        </table>
                    </div>
                </td>
            </tr>
        </table>
    </div>
    <!-- Constant definition editor -->
    <div id="constantDefinitionTemplate" style="visibility: hidden" class="definitionEditor">
        <table class='BAXPTabTable' style='border-top: 1px solid;' width='100%' cellspacing="0"
            cellpadding="4" border="0" valign='top'>
            <tr height="10%">
                <td colspan="3" style="padding-left: 10px">
                    <strong>
                        <UI:CLabel runat="server" Text="BusinessPoliciesAdmin_EditDefinition" ID="lblEditDefinition" />
                        &nbsp;&nbsp;&nbsp; <span id="definitionDisplayName" style="text-decoration: underline">
                        </span></strong>
                </td>
            </tr>
            <tr height="10%">
                <td colspan="3" style="padding-left: 10px">
                    <UI:CLabel runat="server" Text="BusinessPoliciesAdmin_EditDefinitionDescription"
                        ID="lblEditDefinitionDescription" />
                </td>
            </tr>
            <tr height="80%">
                <td width="5%">
                </td>
                <td width="90%">
                    <!-- Text Editor --->
                    <span id="textControl" style="display: none">
                        <input id="textEditor" type="text" preset="text" class="mask BgInput" style="width: 100%"
                            align="right">
                    </span>
                    <!-- Datetime Editor -->
                    <span id="dateTimeControl" style="display: none">
                        <form id="frmDatetimeTemplate">
                        <input class="mask BgInput" id="dateTimeEditor" name="dateTimeEditor" preset="shortdate"
                            style="width: 100%" align="right">
                        <a class="so-BtnLink" onclick="showCalendar('frmDatetime','dateTimeEditor','BTN_date',false, event, null, null, null, null, null, null);return false;"
                            tabindex="-1" href="javascript:void(0);">
                            <img alt="" height="16" src="../../../img/tools/cal.gif" width="16" align="absMiddle"
                                border="0" name="BTN_date" /></a>
                        </form>
                    </span>
                    <!-- Numeric Editor -->
                    <span id="numericControl" style="display: none">
                        <input type="text" id="numericEditor" preset="number" class="mask BgInput" style="width: 100%"
                            align="right">
                    </span>
                    <!-- Boolean Editor -->
                    <span id="booleanControl" style="display: none" align="right">True &nbsp;<input type="radio"
                        name="booleanEditor" value="true">
                        &nbsp;&nbsp; False &nbsp;<input type="radio" name="booleanEditor" value="false">
                    </span>
                </td>
                <td width="5%">
                </td>
            </tr>
            <tr>
                <td colspan="3" align="right" valign="bottom">
                    <table>
                        <tr>
                            <td>
                                <UI:CWPHtmlInputButton ID="btnCancel" runat="server" Value="BtnCancel" onclick="cancelEditDefinition(); " />
                            </td>
                            <td>
                                <UI:CWPHtmlInputButton ID="btnUpdate" runat="server" Value="BtnUpdate" onclick="saveDefinition(getParentDiv(this, 'divConstantDefinition'));" />
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>
    <!-- Constant definition editor -->
    <div id="addPolicyItemsTemplate" style="visibility: hidden; display: none" class="definitionEditor">
        <div class="addItem" onclick="addPreconditionToPolicyVersion()">
            <img alt="" src="../../../img/BusinessPolicies/AddIconSmall.gif" align="top" style="float: left" />
            <img alt="" src="../../../img/BusinessPolicies/Precondition.gif" align="top" style="float: left" />
            <span style="float: left">&nbsp;&nbsp;<UI:CLabel runat="server" Text="BusinessPolicies_AddPrecondition"
                ID="lblAddPrecondition" /></span>
        </div>
        <div class="addItem" onclick="addPolicyRuleToPolicyVersion()">
            <img alt="" src="../../../img/BusinessPolicies/AddIconSmall.gif" align="top" style="float: left" />
            <img alt="" src="../../../img/BusinessPolicies/BusinessPolicyRule.gif" align="top"
                style="float: left" />
            <span style="float: left">&nbsp;&nbsp;<UI:CLabel runat="server" Text="BusinessPolicies_AddPolicyRule"
                ID="lblAddPolicyRule" /></span>
        </div>
        <div class="addItem" onclick="addDecisionTableToPolicyVersion()">
            <img alt="" src="../../../img/BusinessPolicies/AddIconSmall.gif" align="top" style="float: left" />
            <img alt="" src="../../../img/BusinessPolicies/DecisionTable.gif" align="top" style="float: left" />
            <span style="float: left">&nbsp;&nbsp;<UI:CLabel runat="server" Text="BusinessPolicies_AddDecisionTable"
                ID="lblAddDecisionTable" /></span>
        </div>
        <div class="addItem" onclick="addRuleTableToPolicyVersion()">
            <img alt="" src="../../../img/BusinessPolicies/AddIconSmall.gif" align="top" style="float: left" />
            <img alt="" src="../../../img/BusinessPolicies/BusinessRuleTable.gif" align="top"
                style="float: left" />
            <span style="float: left">&nbsp;&nbsp;<UI:CLabel runat="server" Text="BusinessPolicies_AddRuleGroup"
                ID="lblAddRuleGroup" /></span>
        </div>
    </div>
    <%=GetPreconditionContextMenu()%>
    <%=GetPolicyItemContextMenu()%>
    <%=GetPolicyContextMenu()%>

    <script>
        /** Theme Builder styles for Policies  IE10+ **/
        if (window.parent.document.getElementById('bizagi-theme')) {

            var css = window.parent.document.getElementById('bizagi-theme').innerHTML,
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet) {
                style.styleSheet.cssText = css;
            } else {
                style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);
        }

    </script>
</body>
</html>
<script language="javascript" type="text/javascript">
    var WAITING_MESSAGE = '<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("ProcessingPleaseWait") %>';

    initContextMenu();
    document.getElementById("popupPreconditionMenu").style.display = "none";
    document.getElementById("popupItemDocumentationMenu").style.display = "none";
    document.getElementById("popupPolicyDocumentationMenu").style.display = "none";

    adjustFloatingContainer();
    window.onresize = adjustFloatingContainer;
    window.onscroll = adjustFloatingContainer;
</script>
