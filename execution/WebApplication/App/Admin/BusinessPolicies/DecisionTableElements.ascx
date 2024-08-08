<%@ Control Language="c#" AutoEventWireup="false" Codebehind="DecisionTableElements.ascx.cs" Inherits="BizAgiBPM.App.Admin.BusinessPolicies.DecisionTableElements" TargetSchema="http://schemas.microsoft.com/intellisense/ie5"%>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<DIV id="addRowHtml" style="VISIBILITY: hidden">
	<a id="addNewRowLink" href="javascript:void(0);" onclick="addNewRow();" class="addbtn">
		<span><img src="../../../img/BusinessPolicies/addbtnplus.gif" width="20" height="20" border="0"
				align="absMiddle"> &nbsp;<UI:CLabel runat="server" Text="DecisionTable_AddRow" id="lblAddRow" />&nbsp;
			<img src="../../../img/BusinessPolicies/addBtnleft.gif" width="3" height="20" border="0"
				align="absMiddle"> </span></a>
</DIV>
<DIV id="columnHtml">
	<DIV id="column" class="column">
		<DIV id="columnBox" oncontextmenu="return BAShowContextMenu(event,'popupMenuColumn',this);"
			idCM="columnBox">
		</DIV>		
	</DIV>
</DIV>
<DIV id="cellHtml">
	<DIV id="cell" class="cell">
		<DIV id="cellBox" class="cellBox" oncontextmenu="return BAShowContextMenu(event, getPopupMenu(this),this);"
			idCM="cellBox" onmouseover="hideOperator(this.parentNode);"
			onclick="selectRow(this.parentNode);">
		</DIV>		
	</DIV>
</DIV>
<SPAN id="operatorComboHtml">
	<SELECT id="operatorCombo" style="WIDTH: 120px; HEIGHT: 100%">
	</SELECT>
</SPAN>
<SPAN id="columnDivision" class="columnDivision" onmousedown="beginResize(event);">
</SPAN>
<SPAN id="cellOperatorBox" class="cellOperatorBox" onmouseover="showOperatorEditor(this.parentNode);">
</SPAN>
<SPAN id="cellDeleteBox" class="cellDeleteBox" onclick="deleteCellByButton(this.parentNode)">
</SPAN>
		
		