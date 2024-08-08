<%@ Page Language="c#" CodeBehind="BusinessPolicyRule.aspx.cs" AutoEventWireup="false"
    Inherits="BizAgiBPM.App.Admin.BusinessPolicies.BusinessPolicyRule" %>

<%@ Register TagPrefix="UI" Namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@ Register TagPrefix="BP" TagName="PolicyItemToolbox" Src="PolicyItemToolbox.ascx" %>
<%@ Register TagPrefix="BP" TagName="MorphEditor" Src="MorphEditor.ascx" %>
<%@ Register TagPrefix="BP" TagName="IfThenElements" Src="IfThenElements.ascx" %>
<%@ Register TagPrefix="BP" TagName="IfThenContainer" Src="IfThenContainer.ascx" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<html>
<head>
    <title>BusinessPolicyRule</title>
    <meta name="GENERATOR" content="Microsoft Visual Studio .NET 7.1" />
    <meta name="CODE_LANGUAGE" content="C#" />
    <meta name="vs_defaultClientScript" content="JavaScript" />
    <meta name="vs_targetSchema" content="http://schemas.microsoft.com/intellisense/ie5" />
    <%WriteHead();%>
    <link href="../../../css/Admin/Common.css" rel="stylesheet" type="text/css" />
    <link href="../../../css/estilos.css" type="text/css" rel="stylesheet" />
    <link href="../../../css/calendar.css" type="text/css" rel="stylesheet" />
    <link href="../../../css/BusinessPolicies.css" type="text/css" rel="stylesheet" />
    <link href="../../../css/WorkPortal/WPPanel.css" type="text/css" rel="stylesheet" />
    <link href="../../../css/WorkPortal/WPCustomStyles.css" type="text/css" rel="stylesheet" />
    <link href="../../../css/WorkPortal/BAWindow.css" type="text/css" rel="stylesheet" />
    <link href="../../../css/WorkPortal/WPContextMenu.css" type="text/css" rel="stylesheet" />
    <script type="text/javascript" language="javascript" src="../../../js/json2.js"></script>
    <script language="javascript" type="text/javascript" src="../../../js/implementation.js"></script>
    <script language="javascript" type="text/javascript" src="../../../js/CatMenu.js"></script>
    <script language="javascript" type="text/javascript" src="../../../js/BizAgiAJAX.js"></script>
    <script language="javaScript" type="text/javascript" src="../../../js/WorkPortal/BAWindows/prototype.js"></script>
    <script language="javaScript" type="text/javascript" src="../../../js/WorkPortal/BAWindows/window.js"></script>
    <script language="javaScript" type="text/javascript" src="../../../js/WorkPortal/BAWindows/BAWindow.js"></script>
    <script language="javascript" type="text/javascript" src="../../../js/BusinessPolicies/BusinessPoliciesToolbox.js"></script>
    <script language="javascript" type="text/javascript" src="../../../js/BusinessPolicies/BusinessPoliciesCommon.js"></script>
    <script language="javascript" type="text/javascript" src="../../../js/BusinessPolicies/BusinessPolicyObjects.js"></script>
    <script language="javascript" type="text/javascript" src="../../../js/BusinessPolicies/BusinessPolicyObjectLoader.js"></script>
    <script language="javascript" type="text/javascript" src="../../../js/BusinessPolicies/BusinessPolicyUtil2.js"></script>
    <script language="javascript" type="text/javascript" src="../../../js/BusinessPolicies/BusinessPolicyRule2.js"></script>
    <script language="javascript" type="text/javascript" src="../../../js/BusinessPolicies/MorphEditor.js"></script>
    <script language="javaScript" type="text/javascript" src="../../../js/WorkPortal/WPLeftPanel.js"></script>
    <script language="javascript" type="text/javascript" src="../../../js/WorkPortal/WPTree.js"></script>
    <script language="javascript" type="text/javascript" src="../../../js/WorkPortal/WPContextMenu.js"></script>
    <script language="javascript" type="text/javascript" src="../../../js/WorkPortal/WPFrames.js"></script>
    <script language="javascript" type="text/javascript" src="../../../js/BusinessPolicies/DragDropUtil.js"></script>
</head>
<body onload="BAonload();">
    <div class="text" id="popupcalendar">
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
                            <td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
    <form id="frmPolicyItem" method="post" runat="server">
    <input type="hidden" name="policyItemXml" id="policyItemXml" />
    <input type="hidden" name="selectedVocabularyContexts" id="selectedVocabularyContexts" />
    <input type="hidden" name="bSavePolicyItem" id="bSavePolicyItem" value="false" />
    <table width="100%" height="90%" id="parentContainer">
        <tr>
            <td width="auto">
                <BP:PolicyItemToolbox runat="server" ID="itemToolbox" NAME="itemToolbox" IdPolicy="<%=GetPolicyId(PolicyRule)%>" />
            </td>
            <td width="100%">
                <BP:IfThenContainer runat="server" ID="ifThenContainer" NAME="ifThenContainer" ShowThenElse="true" />
                <!-- /rule panel content-->
                <div style="display: none">
                    <BP:IfThenElements runat="server" ID="ifThenElements" NAME="ifThenElements" />
                    <BP:MorphEditor runat="server" ID="morphEditorControls" NAME="morphEditorControls" />
                </div>
            </td>
        </tr>
        <!-- Buttons row -->
        <tr id="buttonsRow">
            <td colspan="2" align="right">
                <table>
                    <tr>
                        <td>
                            <UI:CWPHtmlInputButton ID="btnReloadRule" runat="server" Value="BusinessPolicyRule_BtnReload"
                                onclick="reloadPolicyRule(); " />
                        </td>
                        <td>
                            <UI:CWPHtmlInputButton ID="btnSaveRule" runat="server" Value="BusinessPolicyRule_BtnSave"
                                onclick="savePolicyRule(); " />
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <!-- /Buttons row -->
    </table>
    <%=GetArgumentContextMenu()%>
    </form>
</body>
</html>
<script language="javascript" type="text/javascript">
var WAITING_MESSAGE = '<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("ProcessingPleaseWait") %>';
// Load combos
<%=GetOperatorComboScript("operatorCombo")%>

function BAonload(){
	initPolicyToolbox();
	loadPageVariables();
	
	// Lock controls on read only mode
	<% if (!IsEditable()) { %>
		lockPageControls();
	<% } %>
	
	// load rule code
	loadPolicyRule('<%=GetPolicyItemXML()%>');
	
	initContextMenu();
	document.getElementById("popupMenuArgument").style.display = "none";
	BAHideLeftPanel (true);
	
}
</script>
