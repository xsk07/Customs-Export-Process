<%@ Control Language="c#" AutoEventWireup="false" Codebehind="PolicyItemProperties.ascx.cs" Inherits="BizAgiBPM.App.Admin.BusinessPolicies.PolicyItemProperties" TargetSchema="http://schemas.microsoft.com/intellisense/ie5"%>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<div id="bptPropertiesTab" style="OVERFLOW:auto">
	<TABLE class="BAXPTabTable" height="100%" cellSpacing="0" cellPadding="4" width="100%"
		border="0" valign="top">
		<tr style="HEIGHT: 20px">
			<TD></TD>
		</tr>
		<tr class="itemPropertyRow">
			<TD>
				<div class="itemPropertyLabel"><UI:CLabel id="lblName" runat="server" text="BusinessPolicies_Toolbox_Properties_Name" />:
				</div>
				<div class="itemPropertyValue"><asp:textbox id="txtName" preset="texto" runat="server" maxlength="26" CssClass="mask BgInput itemPropertyExtendable"></asp:textbox></div>
			</TD>
		</tr>
		<tr class="itemPropertyRow">
			<TD>
				<div class="itemPropertyLabel"><UI:CLabel id="lblDisplayName" runat="server" text="BusinessPolicies_Toolbox_Properties_DisplayName" />:
				</div>
				<div class="itemPropertyValue"><asp:textbox id="txtDisplayName" preset="texto" runat="server" maxlength="40" CssClass="mask BgInput itemPropertyExtendable"></asp:textbox></div>
			</TD>
		</tr>
		<tr class="itemPropertyRow">
			<TD>
				<div class="itemPropertyLabel"><UI:CLabel id="lblDescription" runat="server" text="BusinessPolicies_Toolbox_Properties_Description" />:
				</div>
				<div class="itemPropertyValue"><asp:textbox id="txtDescription" preset="texto" runat="server" maxlength="100" CssClass="mask BgInput itemPropertyExtendable"></asp:textbox></div>
			</TD>
		</tr>
		<tr class="itemPropertyRow">
			<TD>
				<div class="itemPropertyLabel"><UI:CLabel id="lblPriority" runat="server" text="BusinessPolicies_Toolbox_Properties_Priority" />:
				</div>
				<div class="itemPropertyValue"><asp:textbox id="txtPriority" preset="int" retype="false" runat="server" CssClass="mask BgInput itemPropertyExtendable"></asp:textbox></div>
			</TD>
		</tr>
		<%if(!IsPrecondition()){%>
		<tr class="itemPropertyRow">
			<TD>
				<div class="itemPropertyLabel"><UI:CLabel id="lblEnabled" runat="server" text="BusinessPolicies_Toolbox_Properties_Enabled" />:
				</div>
				<div class="itemPropertyValue"><asp:radiobuttonlist id="optEnabled" runat="server" RepeatDirection="Horizontal">
						<asp:ListItem Value="true">True</asp:ListItem>
						<asp:ListItem Value="false">False</asp:ListItem>
					</asp:radiobuttonlist></div>
			</TD>
		</tr>
		<tr class="itemPropertyRow">
			<td>
				<div class="itemPropertyLabel"><UI:CLabel id="lblEnabledFrom" runat="server" text="BusinessPolicies_Toolbox_Properties_EnabledFrom" />:
				</div>
				<div class="itemPropertyValue"><asp:textbox id="txtEnabledFromDate" preset="shortdate" runat="server" CssClass="mask BgInput"></asp:textbox><A class="so-BtnLink" id="policyRuleEnabledFromDateLink" onclick="showCalendar('frmPolicyItem',getDescendantByClassName(this.parentElement, 'mask BgInput').id,'BTN_date',false, event, null, null, null, null, null, null);return false;"
						tabIndex="-1" href="javascript:void(0);" name="policyRuleEnabledFromDateLink"><IMG height="16" src="../../../img/tools/cal.gif" width="16" align="absMiddle" border="0"
							name="BTN_date"></A>
				</div>
			</td>
		</tr>
		<tr class="itemPropertyRow">
			<TD>
				<div class="itemPropertyLabel"><UI:CLabel id="lblEnabledTo" runat="server" text="BusinessPolicies_Toolbox_Properties_EnabledTo" />:
				</div>
				<div class="itemPropertyValue"><asp:textbox id="txtEnabledToDate" preset="shortdate" runat="server" CssClass="mask BgInput"></asp:textbox><A class="so-BtnLink" id="policyRuleEnabledToDateLink" onclick="showCalendar('frmPolicyItem',getDescendantByClassName(this.parentElement, 'mask BgInput').id,'BTN_date',false, event, null, null, null, null, null, null);return false;"
						tabIndex="-1" href="javascript:void(0);" name="policyRuleEnabledToDateLink"><IMG height="16" src="../../../img/tools/cal.gif" width="16" align="absMiddle" border="0"
							name="BTN_date"></A>&nbsp;
				</div>
			</TD>
		</tr>
		<%}%>
		<tr style="HEIGHT: 100%">
			<TD></TD>
		</tr>
	</TABLE>
</div>
