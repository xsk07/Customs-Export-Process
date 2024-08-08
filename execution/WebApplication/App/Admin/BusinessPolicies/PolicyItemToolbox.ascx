<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@ Register TagPrefix="BP" TagName="PolicyItemProperties" Src="PolicyItemProperties.ascx" %>
<%@ Register TagPrefix="BP" TagName="PolicyItemVocabularyContext" Src="PolicyItemVocabularyContext.ascx" %>
<%@ Register TagPrefix="BP" TagName="PolicyItemComponents" Src="PolicyItemComponents.ascx" %>
<%@ Control Language="c#" AutoEventWireup="false" Codebehind="PolicyItemToolbox.ascx.cs" Inherits="BizAgiBPM.App.Admin.BusinessPolicies.PolicyItemToolbox" TargetSchema="http://schemas.microsoft.com/intellisense/ie5"%>
<script language="javascript">
	var BA_LPTOP = 48;
	var BA_idPolicy = '<%=GetPolicyId(PolicyItem)%>';
	var PATH_TO_BASE_DIRECTORY = '<%=PathToBaseDirectory%>';
	var DefaultTab = 0;
	var CurrentTab = 0;
	var TabNames = new Array();
	/*
	TabNames[0]='<img src="' + PATH_TO_BASE_DIRECTORY + 'img/BusinessPolicies/PropertiesTab.gif"/>&nbsp;&nbsp;&nbsp;Properties';
	TabNames[1]='<img src="' + PATH_TO_BASE_DIRECTORY + 'img/BusinessPolicies/VocabularyContextTab.gif"/>&nbsp;&nbsp;&nbsp;Vocabulary Contexts';
	TabNames[2]='<img src="' + PATH_TO_BASE_DIRECTORY + 'img/BusinessPolicies/ComponentsTab.gif"/>&nbsp;&nbsp;&nbsp;Components';
	*/
	<%=GetTabNames()%>
</script>

<TABLE height="100%" cellSpacing="2" cellPadding="2" border="0">
	<TR>
		<TD vAlign="top" align="center">
			<div style="POSITION: relative" align="center">
				<TABLE height="100%" cellSpacing="0" cellPadding="0" width="100%" border="0">
					<TR>
						<TD style="HEIGHT: 16px"><SPAN id="TabHTML"></SPAN></TD>
					</TR>
					<TR>
						<TD bgColor="#ffffff">
							<DIV class="tabContent" id="xpTab1">
								<BP:POLICYITEMPROPERTIES id="itemProperties" NAME="itemProperties" runat="server"></BP:POLICYITEMPROPERTIES>
							</DIV>
							<DIV class="tabContent" id="xpTab2">
								<BP:POLICYITEMVOCABULARYCONTEXT id="itemVocabularyContext" NAME="itemVocabularyContext" runat="server"></BP:POLICYITEMVOCABULARYCONTEXT>
							</DIV>
							<DIV class="tabContent" id="xpTab3">
								<BP:POLICYITEMCOMPONENTS id="itemComponents" NAME="itemComponents" runat="server"></BP:POLICYITEMCOMPONENTS>
							</DIV>
						</TD>
					</TR>
				</TABLE>
			</div>
		</TD>
	</TR>
</TABLE>
