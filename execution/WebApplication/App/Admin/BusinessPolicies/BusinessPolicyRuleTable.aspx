<%@ Page language="c#" Codebehind="BusinessPolicyRuleTable.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.Admin.BusinessPolicies.BusinessPolicyRuleTable" %>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@ Register TagPrefix="BP" TagName="PolicyItemToolbox" Src="PolicyItemToolbox.ascx" %>
<%@ Register TagPrefix="BP" TagName="MorphEditor" Src="MorphEditor.ascx" %>
<%@ Register TagPrefix="BP" TagName="RuleTableContainer" Src="RuleTableContainer.ascx" %>
<%@ Register TagPrefix="BP" TagName="RuleTableElements" Src="RuleTableElements.ascx" %>
<%@ Register TagPrefix="BP" TagName="IfThenElements" Src="IfThenElements.ascx" %>
<%@ Register TagPrefix="BP" TagName="IfThenContainer" Src="IfThenContainer.ascx" %>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" > 

<html>
  <head>
    <title>BusinessPolicyRuleTable</title>
    <meta name="GENERATOR" Content="Microsoft Visual Studio .NET 7.1">
    <meta name="CODE_LANGUAGE" Content="C#">
    <meta name=vs_defaultClientScript content="JavaScript">
    <meta name=vs_targetSchema content="http://schemas.microsoft.com/intellisense/ie5">
    <!--#include file="../../../include/BizAgiMeta.inc"-->
	<%WriteHead();%>
	<LINK href="../../../css/estilos.css" type="text/css" rel="stylesheet">
	<link href="../../../css/calendar.css" type="text/css" rel="stylesheet">
	<LINK href="../../../css/BusinessPolicies.css" type="text/css" rel="stylesheet">
	<link href="../../../css/WorkPortal/WPPanel.css" type="text/css" rel="stylesheet">
	<link href="../../../css/WorkPortal/WPCustomStyles.css" type="text/css" rel="stylesheet">
	<link href="../../../css/WorkPortal/BAWindow.css" type="text/css" rel="stylesheet">
	<link href="../../../css/WorkPortal/WPContextMenu.css" type="text/css" rel="stylesheet" >	
	
    <script type="text/javascript" language="javascript" src="../../../js/json2.js"></script>
	<script language=javascript src="../../../js/implementation.js"></script>
	<script language=javascript src="../../../js/CatMenu.js"></script>
	<script language=javascript src="../../../js/BizAgiAJAX.js"></script>
	<script language=javaScript src="../../../js/WorkPortal/BAWindows/prototype.js"></script>
	<script language=javaScript src="../../../js/WorkPortal/BAWindows/window.js"></script>
	<script language=javaScript src="../../../js/WorkPortal/BAWindows/BAWindow.js"></script>
	<script language=javascript src="../../../js/BusinessPolicies/BusinessPolicyUtil2.js"></script>
	<script language=javascript src="../../../js/BusinessPolicies/BusinessPoliciesToolbox.js"></script>
	<script language=javascript src="../../../js/BusinessPolicies/BusinessPoliciesCommon.js"></script>
	<script language=javascript src="../../../js/BusinessPolicies/BusinessPolicyObjects.js"></script>
	<script language=javascript src="../../../js/BusinessPolicies/BusinessPolicyObjectLoader.js"></script>
	<script language=javascript src="../../../js/BusinessPolicies/DecisionTableMisc.js"></script>	
	<script language=javascript src="../../../js/BusinessPolicies/BusinessPolicyRuleTable.js"></script>
	<script language=javascript src="../../../js/BusinessPolicies/MorphEditor.js"></script>
	<script language=javaScript src="../../../js/WorkPortal/WPLeftPanel.js"></script>
	<script language=javascript src="../../../js/WorkPortal/WPTree.js"></script>
	<script language=javascript src="../../../js/WorkPortal/WPContextMenu.js"></script>
	<script language=javascript src="../../../js/WorkPortal/WPFrames.js"></script>		
	<script language=javascript src="../../../js/BusinessPolicies/DragDropUtil.js"></script>
		
  </head>
	<body onload="BAonload();">
		<DIV class="text" id="popupcalendar"></DIV>
		<img src="../../../img/separador/plus.gif" id=imgPlus name=imgPlus style="display:none"/>
		<img src="../../../img/separador/plusE.gif" id=imgPlusE name=imgPlusE style="display:none"/>
		<img src="../../../img/separador/minus.gif" id=imgMinus name=imgMinus style="display:none"/>
		<div id="messageLayer" style="visibility:hidden; display:none;" >
			<div id="messageBackgroundDiv" class="messageBackgroundDiv"></div>
				<div id="messageDiv">
					<div id="textContainer">
						<table>
							<tr>
								<td>
									<span id="messageText">					
									</span>
								<td>
							</tr>
						</table>
					</div>
				</div>
			</div>
		</div>	
		<form id="frmPolicyItem" method="post" runat="server">
			<input type="hidden" name="policyItemXml" id="policyItemXml"> 
			<input type="hidden" name="selectedVocabularyContexts" id="selectedVocabularyContexts"> 
			<input type="hidden" name="bSavePolicyItem" id="bSavePolicyItem" value="false">
			<table width="100%" height="90%" id="parentContainer">
				<tr>
					<td>
						<BP:PolicyItemToolbox runat="server" ID="itemToolbox" NAME="itemToolbox" IdPolicy="<%=GetPolicyId(PolicyRuleTable)%>" />
					</td>
					<td width="100%" id="PolicyInfo">
						<div id="ruleTableView">
							<BP:RuleTableContainer runat="server" ID="ruleTableContainer" NAME="ruleTableContainer" />
							<DIV style="display:none">
								<BP:RuleTableElements runat="server" ID="ruleTableElements" NAME="ruleTableElements" />				
							</DIV>
						</div>
						<div style="display:none;height:100%" id="ruleCodeView">
							<BP:IfThenContainer runat="server" ID="ifThenContainer" NAME="ifThenContainer" ShowThenElse="true"/>
							<!-- /rule panel content-->
							<DIV style="display:none">
								<BP:IfThenElements runat="server" ID="ifThenElements" NAME="ifThenElements" />				
								<BP:MorphEditor runat="server" ID="morphEditorControls" NAME="morphEditorControls" />				
							</DIV>
						</div>
					</td>
				</tr>
				<!-- Buttons row -->
				<TR id="buttonsRow" >
					<TD colspan="2" align="right">
						<DIV id="ruleTableButtons">
						<TABLE>
							<TR>
								<TD>
									<UI:CWPHtmlInputButton id="btnReload" runat="server" Value="RuleTable_BtnReload" onclick="reloadPolicyRuleTable(); "/>
								</TD>
								<TD>

									<UI:CWPHtmlInputButton id="btnSave" runat="server" Value="RuleTable_BtnSave" onclick="savePolicyRuleTable(); "/>
								</TD>
							</TR>
						</TABLE>
						</DIV>
						<DIV style="display:none" id="ruleCodeButtons">
						<TABLE>
							<TR>														
								<TD>
									<UI:CWPHtmlInputButton id="btnDiscard" runat="server" Value="BusinessPolicy_BtnDiscard" onclick="discardRuleCode(); "/>
								</TD>
								<TD>
									<UI:CWPHtmlInputButton id="btnApply" runat="server" Value="BusinessPolicy_BtnApply" onclick="updateRuleCode(); "/>
								</TD>
							</TR>
						</TABLE>
						</DIV>

					</TD>							
				</TR>
				<!-- /Buttons row -->
			</table>		
			<%=GetArgumentContextMenu()%>	
		</form>
	</body>
</html>
<script language=javascript>
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
	loadPolicyRuleTable('<%=GetPolicyItemXML()%>');
	
	initContextMenu();
	document.getElementById("popupMenuArgument").style.display = "none";
	BAHideLeftPanel (true);
}
</script>