<%@ Control Language="c#" AutoEventWireup="false" Codebehind="PolicyItemVocabularyContext.ascx.cs" Inherits="BizAgiBPM.App.Admin.BusinessPolicies.PolicyItemVocabularyContext" TargetSchema="http://schemas.microsoft.com/intellisense/ie5"%>
<div style="display:none">
	<img id="BACheckedImage" name="BACheckedImage" src="<%=PathToBaseDirectory%>img/WorkPortal/BAChecked.gif"/>
	<img id="BAUncheckedImage" name="BAUncheckedImage" src="<%=PathToBaseDirectory%>img/WorkPortal/BAUnchecked.gif" />
</div>
<div>
	<TABLE class='BAXPTabTable' cellSpacing=0 cellPadding=4 width='100%' height="100%" border=0 valign='top'>
		<tr>
		<td valign="top">
			<div id="bptVocabularyContextsTab" style="overflow:auto">
				<%=GetVocabularyContextTree()%>
			</div>		
		</td>
		</tr>
	</table>
</div>
