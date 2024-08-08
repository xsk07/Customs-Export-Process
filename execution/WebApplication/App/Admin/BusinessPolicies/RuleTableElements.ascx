<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@ Control Language="c#" AutoEventWireup="false" Codebehind="RuleTableElements.ascx.cs" Inherits="BizAgiBPM.App.Admin.BusinessPolicies.RuleTableElements" TargetSchema="http://schemas.microsoft.com/intellisense/ie5"%>
<DIV id="addRowHtml" style="VISIBILITY: hidden">
	<a id="addNewRowLink" href="javascript:void(0);" onclick="addNewRuleCode();" class="addbtn">
		<span><img src="../../../img/BusinessPolicies/addbtnplus.gif" width="20" height="20" border="0"
				align="absMiddle"> &nbsp;<UI:CLabel runat="server" Text="RuleTable_AddRuleCode" id="lblAddRuleCode" />&nbsp;
			<img src="../../../img/BusinessPolicies/addBtnleft.gif" width="3" height="20" border="0"
				align="absMiddle"> </span></a>
</DIV>
<DIV id="columnHtml">
	<DIV id="column" class="column">
		<DIV id="columnBox">
		</DIV>		
	</DIV>
</DIV>
<DIV id="ruleCodeHtml">
	<DIV id="ruleCode" class="ruleCode" onmouseover="selectRuleCode(this.id)" onmouseout="hidePreview()" ondblclick="editRuleCode(this.id)">
	</DIV>
</DIV>
<DIV id="cellBoxHtml">
	<SPAN id="cellBox" class="cellBox ruleTableCell">
	</SPAN>
</DIV>

<SPAN id="columnDivision" class="columnDivision" onmousedown="beginResize(event);">
</SPAN>
<SPAN id="cellDeleteBox" class="cellDeleteBox" onclick="deleteRuleCode(this.parentElement.id)">
</SPAN>
