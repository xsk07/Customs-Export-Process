<%@ Page Language="c#" CodeBehind="BusinessPolicyPrecondition.aspx.cs" AutoEventWireup="false"
    Inherits="BizAgiBPM.App.Admin.BusinessPolicies.BusinessPolicyPrecondition" %>

<%@ Register TagPrefix="UI" Namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@ Register TagPrefix="BP" TagName="PolicyItemToolbox" Src="PolicyItemToolbox.ascx" %>
<%@ Register TagPrefix="BP" TagName="MorphEditor" Src="MorphEditor.ascx" %>
<%@ Register TagPrefix="BP" TagName="IfThenElements" Src="IfThenElements.ascx" %>
<%@ Register TagPrefix="BP" TagName="IfThenContainer" Src="IfThenContainer.ascx" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <title>Precondition</title>
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
    <script language="javascript" src="../../../js/implementation.js" type="text/javascript"></script>
    <script language="javascript" src="../../../js/CatMenu.js" type="text/javascript"></script>
    <script language="javascript" src="../../../js/BizAgiAJAX.js" type="text/javascript"></script>
    <script language="javascript" src="../../../js/WorkPortal/BAWindows/prototype.js" type="text/javascript"></script>
    <script language="javascript" src="../../../js/WorkPortal/BAWindows/window.js" type="text/javascript"></script>
    <script language="javascript" src="../../../js/WorkPortal/BAWindows/BAWindow.js" type="text/javascript"></script>
    <script language="javascript" src="../../../js/BusinessPolicies/BusinessPoliciesToolbox.js" type="text/javascript"></script>
    <script language="javascript" src="../../../js/BusinessPolicies/BusinessPoliciesCommon.js" type="text/javascript"></script>
    <script language="javascript" src="../../../js/BusinessPolicies/BusinessPolicyObjects.js" type="text/javascript"></script>
    <script language="javascript" src="../../../js/BusinessPolicies/BusinessPolicyObjectLoader.js" type="text/javascript"></script>
    <script language="javascript" src="../../../js/BusinessPolicies/BusinessPolicyUtil2.js" type="text/javascript"></script>
    <script language="javascript" src="../../../js/BusinessPolicies/BusinessPolicyPrecondition.js" type="text/javascript"></script>
    <script language="javascript" src="../../../js/BusinessPolicies/MorphEditor.js" type="text/javascript"></script>
    <script language="javascript" src="../../../js/WorkPortal/WPLeftPanel.js" type="text/javascript"></script>
    <script language="javascript" src="../../../js/WorkPortal/WPTree.js" type="text/javascript"></script>
    <script language="javascript" src="../../../js/WorkPortal/WPContextMenu.js" type="text/javascript"></script>
    <script language="javascript" src="../../../js/WorkPortal/WPFrames.js" type="text/javascript"></script>
    <script language="javascript" src="../../../js/BusinessPolicies/DragDropUtil.js" type="text/javascript"></script>
</head>
<body onload="BAonload();">
    <div class="text" id="popupcalendar">
    </div>
    <img src="../../../img/separador/plus.gif" id="imgPlus" name="imgPlus" style="display: none"
        alt="" />
    <!--<img src="../../../img/separador/plusE.gif" id=imgPlusE name=imgPlusE style="display:none"/>-->
    <img src="../../../img/separador/minus.gif" id="imgMinus" name="imgMinus" style="display: none"
        alt="" />
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
    <form id="frmPolicyItem" method="post" runat="server">
    <input type="hidden" name="policyItemXml" id="policyItemXml" />
    <input type="hidden" name="selectedVocabularyContexts" id="selectedVocabularyContexts" />
    <input type="hidden" name="bSavePolicyItem" id="bSavePolicyItem" value="false" />
    <table width="100%" style="height: 90%" id="parentContainer">
        <tr>
            <td style="width: auto">
                <BP:PolicyItemToolbox runat="server" ID="itemToolbox" name="itemToolbox" IdPolicy="<%=GetPolicyId(Precondition)%>" />
            </td>
            <td style="width: 100%">
                <BP:IfThenContainer runat="server" ID="ifThenContainer" name="ifThenElements" ShowThenElse="false" />
                <!-- /rule panel content-->
                <div style="display: none">
                    <BP:IfThenElements runat="server" ID="ifThenElements" name="ifThenElements" />
                    <BP:MorphEditor runat="server" ID="morphEditorControls" name="morphEditorControls" />
                </div>
            </td>
        </tr>
        <!-- Buttons row -->
        <tr id="buttonsRow">
            <td colspan="2" align="right">
                <table>
                    <tr>
                        <td>
                            <UI:CWPHtmlInputButton ID="btnReloadPrecondition" runat="server" Value="BusinessPolicyPrecondition_BtnReload"
                                onclick="reloadPrecondition(); " />
                        </td>
                        <td>
                            <UI:CWPHtmlInputButton ID="btnSavePrecondition" runat="server" Value="BusinessPolicyPrecondition_BtnSave"
                                onclick="savePrecondition(); " />
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
	loadPrecondition('<%=GetPolicyItemXML()%>');
	
	initContextMenu();
	document.getElementById("popupMenuArgument").style.display = "none";
	BAHideLeftPanel (true);
	
}
</script>
