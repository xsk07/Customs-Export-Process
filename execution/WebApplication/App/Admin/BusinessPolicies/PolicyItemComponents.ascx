<%@ Control Language="c#" AutoEventWireup="false" Codebehind="PolicyItemComponents.ascx.cs" Inherits="BizAgiBPM.App.Admin.BusinessPolicies.PolicyItemComponents" TargetSchema="http://schemas.microsoft.com/intellisense/ie5"%>
<%@ Register TagPrefix="BP" NameSpace="BizAgi.UI.BusinessPolicies.Control" Assembly="BizAgi.UI" %>
<img src="../../../img/WorkPortal/Frames/HeaderUp.gif" id="imgUp" name="imgUp" style="DISPLAY:none">
<img src="../../../img/WorkPortal/Frames/HeaderDown.gif" id="imgDown" name="imgDown"
	style="DISPLAY:none">
<div id="bptComponentsTab">
	<TABLE class='BAXPTabTable' cellSpacing="0" cellPadding="4" width='100%' height="100%"
		valign='top'>
		<tr>
			<td valign="top">
				<!-- Internal info -->
				<table border="0" width="100%" height="100%" id="BALPMainTable" cellpadding="0" cellspacing="0">
					<BP:PolicyItemComponent runat="server" ID="definitionsItemBar" NAME="definitionsItemBar" BAName="definitionItemBar"
						BADisplayName="BusinessPolicies_Toolbox_Components_Definitions" BAImageName="DefinitionGroup.gif">
						<%=GetDefinitionsTree()%>
					</BP:PolicyItemComponent>
					<BP:PolicyItemComponent runat="server" ID="contextDefinitionsBar" NAME="contextDefinitionsBar" BAName="contextDefinitionsBar"
						BADisplayName="BusinessPolicies_Toolbox_Components_ContextDefinitions" BAImageName="Vocabulary.gif">
						<%=GetContextDefinitionsTree()%>
					</BP:PolicyItemComponent>
					<BP:PolicyItemComponent runat="server" ID="operatorsBar" NAME="operatorsBar" BAName="operatorsBar" BADisplayName="BusinessPolicies_Toolbox_Components_Operators"
						BAImageName="OperatorGroup.gif">
						<%=GetOperatorsTree()%>
					</BP:PolicyItemComponent>
					<BP:PolicyItemComponent runat="server" ID="functionsBar" NAME="functionsBar" BAName="functionsBar" BADisplayName="BusinessPolicies_Toolbox_Components_Functions"
						BAImageName="Function.gif">
						<%=GetFunctionsTree()%>
					</BP:PolicyItemComponent>
				</table>
				<!-- -->
			</td>
		</tr>
	</TABLE>
</div>
