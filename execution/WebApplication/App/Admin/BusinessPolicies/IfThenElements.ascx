<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@ Control Language="c#" AutoEventWireup="false" Codebehind="IfThenElements.ascx.cs" Inherits="BizAgiBPM.App.Admin.BusinessPolicies.IfThenElements" TargetSchema="http://schemas.microsoft.com/intellisense/ie5"%>

<!-- hidden operator control -->
<DIV id="argumentHtml" style="VISIBILITY: hidden">
	<SPAN id="argument" 
			idCM="argument"
			oncontextmenu="return BAShowContextMenu(event, 'popupMenuArgument',this);" 
			BADropTarget="true" 
			BAElementType="argument" 
			onmouseover="hoverElement(this)" 
			class="argument"
			onmouseout="unhoverElement(this)">
		<SPAN id="argument_value" class="argumentValue">
		</SPAN>
	</SPAN>
</DIV>
<DIV id="functionHtml" style="VISIBILITY: hidden">
	<SPAN id="function" onmouseover="hoverElement(this)" class="function"
		onmouseout="unhoverElement(this)">
	</SPAN>
</DIV>
<!-- hidden operator control -->
<DIV id="operatorHtml" style="VISIBILITY: hidden">
	<SPAN id="operator" BADropTarget="true" BAElementType="operator" onmouseover="hoverElement(this)" class="operator" 
		onmouseout="unhoverElement(this)">
		<SPAN id="operator_value" class="operatorValue"></SPAN> 
	</SPAN>
</DIV>
<!-- hidden operator combo control -->
<DIV id="operatorComboHtml" style="VISIBILITY: hidden">
	<SELECT id="operatorCombo" onchange="editOperator(this.value)">
		<OPTION value="0" selected>---------------</OPTION>
	</SELECT>
</DIV>
<!-- hidden set definition control -->
<DIV id="setDefinitionHtml" style="VISIBILITY: hidden">
	<SPAN id="setDefinition" BADropTarget="true" BAElementType="setDefinition" onmouseover="hoverElement(this)" class="setDefinition"
		onmouseout="unhoverElement(this)">
		<SPAN id="setDefinition_value" class="setDefinitionValue"></SPAN>
	</SPAN>
</DIV>
<!-- hidden condition control -->
<DIV id="conditionHtml" style="VISIBILITY: hidden">
	<DIV id="condition" class="condition" >
		<IMG class="rowArrow" src="../../../img/BusinessPolicies/arrowindicator.gif" width="16" height="16" align="absMiddle">
		<A href="javascript:void(0);" onclick="deleteCondition(this.parentNode)" id="imgDeleteCondition"  class="deleteRow">&nbsp;</A>
	</DIV>
</DIV>
<DIV id="addConditionHtml" style="VISIBILITY: hidden">
	<BR>
	<a d="btnAddCondition" href="javascript:void(0);" onclick="addCondition();" class="addbtn">
		<span>
			<img src="../../../img/BusinessPolicies/addbtnplus.gif" width="20" height="20" border="0" align="absMiddle">
			&nbsp;<UI:CLabel runat="server" Text="BusinessPolicyRule_AddCondition" id="lblAddCondition" />&nbsp;
			<img src="../../../img/BusinessPolicies/addBtnleft.gif" width="3" height="20" border="0" align="absMiddle">
		</span>
	</a>
</DIV>
<!-- hidden execution statement control -->
<DIV id="executionStatementHtml" style="VISIBILITY: hidden">
	<DIV id="executionStatement" class="executionStatement" >
		<IMG class="rowArrow" src="../../../img/BusinessPolicies/arrowindicator.gif" width="16" height="16" align="absMiddle">
		<A href="javascript:void(0);" onclick="deleteExecutionStatement(this.parentNode)" id="imgDeleteExecutionStatement"  class="deleteRow">&nbsp;</A>
	</DIV>
</DIV>
<DIV id="addExecutionStatementHtml" style="VISIBILITY: hidden">
	<BR>
	<a id="btnAddExecutionStatement" href="javascript:void(0);" onclick="addExecutionStatement(false);" class="addbtn">
		<span style="HEIGHT:20px">
			<img src="../../../img/BusinessPolicies/addbtnplus.gif" width="20" height="20" border="0" align="absMiddle">
			&nbsp;<UI:CLabel runat="server" Text="BusinessPolicyRule_AddExecutionStatement" id="lblAddExecutionStatement" />&nbsp;
			<img src="../../../img/BusinessPolicies/addBtnleft.gif" width="3" height="20" border="0" align="absMiddle">
		</span>
	</a>
</DIV>
