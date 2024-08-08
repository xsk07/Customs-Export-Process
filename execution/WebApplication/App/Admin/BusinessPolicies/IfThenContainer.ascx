<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@ Control Language="c#" AutoEventWireup="false" Codebehind="IfThenContainer.ascx.cs" Inherits="BizAgiBPM.App.Admin.BusinessPolicies.IfThenContainer" TargetSchema="http://schemas.microsoft.com/intellisense/ie5"%>
<!-- rule panel content-->
<DIV id="ruleDesignContent">
	<!-- rule full container -->
	<TABLE class="policyRule" cellspacing="1" cellpadding="1" width="100%" height="100%" border="0">
		<!-- if container -->
		<TR id="ifRow">
			<TD align="left" valign="top" colspan="3">
				<TABLE width="100%" height="50" border="0" cellpadding="0" cellspacing="0">
					<TR height="50">
						<TD  width="81px"> 
							<SPAN class="ifThenLabel">
								<UI:CLabel runat="server" Text="BusinessPolicies_If" id="lblIf" />
							</SPAN>
						</TD>
						<TD width="*">
							<SPAN style="float:left">
								<INPUT type="radio" class="conditionType" name="conditionTypeOption" onclick="changeConditionType(this.value)"
										value="1" checked>
									<UI:CLabel runat="server" Text="BusinessPolicyRule_AndLabel" id="lblAndOption" />
								<BR>
								<INPUT type="radio" class="conditionType" name="conditionTypeOption" onclick="changeConditionType(this.value)"
										value="2">
									<UI:CLabel runat="server" Text="BusinessPolicyRule_OrLabel" id="lblOrOption" />
							</SPAN>
							<% if (ShowThenElse){%>
							<SPAN class="elseCheckContainer"><img id="chkElse" class="BACheckBox" BAChecked="{0}" src="../../../img/WorkPortal/BAUnchecked.gif"
									onclick="BACheckBoxClick(this, showHideElse)"> <SPAN>&nbsp;&nbsp;Use Else </SPAN>
							</SPAN>
							<%}%>
						</TD>						
					</TR>
					<TR>
						<TD width="81px" class="fondAndOrLabel" valign="top">
							<SPAN id="conditionType">
								<b id="andLabel" class="andOrLabel">
										<UI:CLabel runat="server" Text="BusinessPolicies_And" id="lblAnd" />
								</b>
								<b id="orLabel" class="andOrLabel" style="DISPLAY:none">
										<UI:CLabel runat="server" Text="BusinessPolicies_Or" id="lblOr" />
								</b>
								<INPUT type="hidden" id="conditionType_value" name="conditionType_value" value="1">
							</SPAN>
						</TD>
						<TD colspan="2">
							<DIV id="divIf" BADropTarget="true" BAElementType="panel" class="ifThenBox" ms_positioning="FlowLayout"><BR>
							</DIV>
						</TD>
					</TR>
				</TABLE>
			</TD>
		</TR>
		<!-- /if container -->
		<% if (ShowThenElse){%>
		<!-- then container -->
		<TR id="thenRow">
			<TD>
				<TABLE height="100%" cellspacing="1" cellpadding="1" width="100%" border="0">
					<TR height="50">
						<TD align="left" valign="top" colspan="2">
							<SPAN class="ifThenLabel">
								<UI:CLabel runat="server" Text="BusinessPolicies_Then" id="lblThen" />
							</SPAN>
						</TD>
					</TR>
					<TR>
						<TD width="81">&nbsp;</TD>
						<TD>
							<DIV id="divThen" BADropTarget="true" BAElementType="panel" class="ifThenBox" ms_positioning="FlowLayout"><BR>
							</DIV>
						</TD>
					</TR>
				</TABLE>
			</TD>
		</TR>
		<!-- /then container -->
		<!-- else container -->
		<TR id="elseRow">
			<TD>
				<TABLE height="100%" cellspacing="1" cellpadding="1" width="100%" border="0">
					<TR height="50">
						<TD align="left" valign="top" colspan="2">
							<SPAN class="ifThenLabel"><UI:CLabel id="lblElse" runat="server" text="BusinessPolicies_Else" />
						    </SPAN>
						</TD>
					</TR>
					<TR>
						<TD width="81">&nbsp;</TD>
						<TD>
							<DIV id="divElse" BADropTarget="true" BAElementType="panel" class="ifThenBox" ms_positioning="FlowLayout"><BR>
							</DIV>
						</TD>
					</TR>
				</TABLE>
			</TD>
		</TR>
		<!-- /else container -->
		<%}%>
	</TABLE>
	<!-- /rule full container -->
</DIV>
