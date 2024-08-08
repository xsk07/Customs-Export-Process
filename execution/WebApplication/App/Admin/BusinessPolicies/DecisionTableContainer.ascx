<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@ Control Language="c#" AutoEventWireup="false" Codebehind="DecisionTableContainer.ascx.cs" Inherits="BizAgiBPM.App.Admin.BusinessPolicies.DecisionTableContainer" TargetSchema="http://schemas.microsoft.com/intellisense/ie5"%>
<DIV id="decisionTableContent" style="position:relative;">
	<!-- decision table full container -->
    <div class="customOverlay" style="visibility:hidden; display:none;"></div>
	<TABLE class="decisionTable" cellspacing="1" cellpadding="1" border="0">
		<TR>
			<TD colspan="4" >
				<DIV id="decisionTableOuterDiv"class="decisionTablePanel" ms_positioning="GridLayout">
					<DIV id="decisionTableDiv" style="position:relative; width:100%" BADropTarget="true" BAElementType="panel" >
						<DIV id="decisionTableColumns" style="height:24px;width:100%;overflow:hidden">
						</DIV>
						<DIV id="decisionTableCells">
						</DIV>
						<DIV id="decisionTableAddRow" style="height:32px">
						</DIV>
					</DIV>
				</DIV>
				<DIV id="rulePreviewDiv" class="rulePreviewPanel" ms_positioning="FlowLayout">
				</DIV>
			</TD>
		</TR>
	</TABLE>
</DIV>