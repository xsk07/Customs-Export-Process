<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@ Control Language="c#" AutoEventWireup="false" Codebehind="MorphEditor.ascx.cs" Inherits="BizAgiBPM.App.Admin.BusinessPolicies.MorphEditor" TargetSchema="http://schemas.microsoft.com/intellisense/ie5"%>
<DIV id="datetimeEditorHtml">
	<INPUT class="mask BgInput" id="dateTimeEditor" name="dateTimeEditor" preset="shortdate">
	<A	class="so-BtnLink" 
		onclick="showCalendar('frmDatetime','dateTimeEditor','BTN_date',false, event, null, null, null, null, null, null, 'focusDatetimeEditor(\'dateTimeEditor\');');return false;"
		tabIndex="-1" 
		href="javascript:void(0);">
		<IMG height="16" src="../../../img/tools/cal.gif" width="16" align="absMiddle" border="0" name="BTN_date">
	</A>
</DIV>
<DIV id="textEditorHtml">
	<input id="textEditor" preset="text" CLASS="mask BgInput" type="text" style="HEIGHT:100%;" onblur="editConstantArgument(this.id)">
</DIV>
<DIV id="numericEditorHtml">
	<input type="text" id="numericEditor" preset="number" CLASS="mask BgInput" style="HEIGHT:100%" onblur="editConstantArgument(this.id)">
</DIV>
<DIV id="booleanEditorHtml">
	<UI:CLabel runat="server" Text="BusinessPolicies_True" id="lblConstantTrue" /> &nbsp;<input type="radio" id="booleanEditor" name="booleanEditor" value="True">
	&nbsp;&nbsp; 
	<UI:CLabel runat="server" Text="BusinessPolicies_False" id="lblConstantFalse" /> &nbsp;<input type="radio" id="booleanEditor" name="booleanEditor" value="False">
</DIV>
<DIV id="comboEditorHtml">
	<SELECT id="comboEditor" class="comboEditor" onblur="editConstantArgument(this.id)">
			<OPTION value="0" selected>---------------</OPTION>
	</SELECT>							
</DIV>
