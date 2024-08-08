<%@ Control Language="c#" AutoEventWireup="false" Codebehind="RuleTableContainer.ascx.cs" Inherits="BizAgiBPM.App.Admin.BusinessPolicies.RuleTableContainer" TargetSchema="http://schemas.microsoft.com/intellisense/ie5"%>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<DIV id="ruleTableContent" style="width:100%;" >
	<!-- decision table full container -->
	<DIV id="ruleTableOuterDiv"class="ruleTablePanel" ms_positioning="GridLayout" >
		<DIV id="ruleTableDiv" style="overflow:auto;position:relative;height:100%;width:100%" BADropTarget="true" BAElementType="panel" >
			<DIV id="ruleTableColumns" style="height:24px;width:100%;overflow:hidden">
			</DIV>
			<DIV id="ruleTableCells" style="height:auto;overflow:hidden">
			</DIV>
			<DIV id="ruleTableAddRow" style="height:32px; bottom: 0px;">
			</DIV>
		</DIV>
	</DIV>
	<DIV id="rulePreviewDiv" class="rulePreviewPanel" style="DISPLAY: none; HEIGHT: 0%" ms_positioning="FlowLayout">
	</DIV>
</DIV>
