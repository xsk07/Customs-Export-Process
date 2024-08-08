<%@ Page Language="c#" CodeBehind="BusinessDecisionTable.aspx.cs" AutoEventWireup="false"
    Inherits="BizAgiBPM.App.Admin.BusinessPolicies.BusinessDecisionTable" %>

<%@ Register TagPrefix="UI" Namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@ Register TagPrefix="BP" TagName="PolicyItemToolbox" Src="PolicyItemToolbox.ascx" %>
<%@ Register TagPrefix="BP" TagName="MorphEditor" Src="MorphEditor.ascx" %>
<%@ Register TagPrefix="BP" TagName="DecisionTableElements" Src="DecisionTableElements.ascx" %>
<%@ Register TagPrefix="BP" TagName="DecisionTableContainer" Src="DecisionTableContainer.ascx" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<html xmlns="http://www.w3.org/1999/xhtml">
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
    <script type="text/javascript" language="javascript" src="../../../js/implementation.js"></script>
    <script type="text/javascript" language="javascript" src="../../../js/CatMenu.js"></script>
    <script type="text/javascript" language="javascript" src="../../../js/BizAgiAJAX.js"></script>
    <script type="text/javascript" language="javascript" src="../../../js/WorkPortal/BAWindows/prototype.js"></script>
    <script type="text/javascript" language="javascript" src="../../../js/WorkPortal/BAWindows/window.js"></script>
    <script type="text/javascript" language="javascript" src="../../../js/WorkPortal/BAWindows/BAWindow.js"></script>
    <script type="text/javascript" language="javascript" src="../../../js/BusinessPolicies/BusinessPolicyUtil2.js"></script>
    <script type="text/javascript" language="javascript" src="../../../js/BusinessPolicies/BusinessPoliciesToolbox.js"></script>
    <script type="text/javascript" language="javascript" src="../../../js/BusinessPolicies/BusinessPoliciesCommon.js"></script>
    <script type="text/javascript" language="javascript" src="../../../js/BusinessPolicies/BusinessPolicyObjects.js"></script>
    <script type="text/javascript" language="javascript" src="../../../js/BusinessPolicies/BusinessPolicyObjectLoader.js"></script>
    <script type="text/javascript" language="javascript" src="../../../js/BusinessPolicies/DecisionTableMisc.js"></script>
    <script type="text/javascript" language="javascript" src="../../../js/BusinessPolicies/BusinessDecisionTable.js"></script>
    <script type="text/javascript" language="javascript" src="../../../js/BusinessPolicies/MorphEditor.js"></script>
    <script type="text/javascript" language="javascript" src="../../../js/WorkPortal/WPLeftPanel.js"></script>
    <script type="text/javascript" language="javascript" src="../../../js/WorkPortal/WPTree.js"></script>
    <script type="text/javascript" language="javascript" src="../../../js/WorkPortal/WPContextMenu.js"></script>
    <script type="text/javascript" language="javascript" src="../../../js/WorkPortal/WPFrames.js"></script>
    <script type="text/javascript" language="javascript" src="../../../js/BusinessPolicies/DragDropUtil.js"></script>
</head>
<body onload="BAonload();">
    <div class="text" id="popupcalendar">
    </div>
    <img src="../../../img/separador/plus.gif" id="imgPlus" style="display: none" alt="" />
    <img src="../../../img/separador/minus.gif" id="imgMinus" style="display: none" alt="" />
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
    <table width="100%" height="90%" id="parentContainer">
        <tr>
            <td width="auto" style="position:relative;">
                <div class="customOverlay" style="visibility:hidden; display:none;"></div>
                <BP:PolicyItemToolbox runat="server" ID="itemToolbox" name="itemToolbox" IdPolicy="<%=GetPolicyId(DecisionTable)%>" />
            </td>
            <td width="100%">
                <BP:DecisionTableContainer runat="server" ID="decisionTableContainer" name="decisionTableContainer" />
                <div style="display: none">
                    <BP:DecisionTableElements runat="server" ID="decisionTableElements" name="decisionTableElements" />
                    <BP:MorphEditor runat="server" ID="morphEditorControls" name="morphEditorControls" />
                </div>
            </td>
        </tr>
        <!-- Buttons row -->
        <tr id="buttonsRow">
            <td colspan="2" align="right" style="position:relative;">
                <div class="customOverlay" style="visibility:hidden; display:none;"></div>
                <table>
                    <tr>
                        <td>
                            <UI:CWPHtmlInputButton ID="btnReloadRule" runat="server" Value="DecisionTable_BtnReload"
                                onclick="reloadDecisionTable(); " />
                        </td>
                        <td>
                            <UI:CWPHtmlInputButton ID="btnSaveRule" runat="server" Value="DecisionTable_BtnSave"
                                onclick="saveDecisionTable(); " />
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <!-- /Buttons row -->
    </table>
    <!-- Context menus -->
    <%=GetColumnContextMenu()%>
    <%=GetCellContextMenu()%>
    <%=GetDuplicableCellContextMenu()%>
    </form>
</body>
</html>
<script type="text/javascript" language="javascript">
    var WAITING_MESSAGE = '<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("ProcessingPleaseWait") %>';
    // Load combos
    <%=GetOperatorComboScript("operatorCombo")%>

    function BAonload(){
        initPolicyToolbox();
        loadPageVariables();
        
        // Lock controls on read only mode
        <% if (!IsEditable()) { %>
                lockPageControls();
                fixMessageLayer();
        <% } %>
        
        // load rule code
        loadDecisionTable('<%=GetPolicyItemXML()%>');
        
        initContextMenu();
        document.getElementById("popupMenuColumn").style.display = "none";
        document.getElementById("popupMenuCell").style.display = "none";
        document.getElementById("popupMenuDuplicableCell").style.display = "none";
        
        BAHideLeftPanel (true);
        
    }
</script>