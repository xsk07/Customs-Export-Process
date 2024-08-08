<%@ Control Language="c#" AutoEventWireup="false" Codebehind="SelectCategoryItem.ascx.cs" Inherits="BizAgiBPM.App.WorkPortal.SelectCategoryItem" TargetSchema="http://schemas.microsoft.com/intellisense/ie5"%>
<style>
a{
	text-decoration:none;
}
</style>
<table border="0" cellpadding="0" cellspacing="0">
	<tr>
		<td><a href="javascript:WPCatSelectAllApp(true);"><img id="imgAllApp" src="../../img/WorkPortal/Menu/RedLittleArrow.gif" align="top"><%=BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPCategorySearchAllApp")%></a></td>
		<td width="30px">&nbsp;</td>
		<td><a href="javascript:WPCatSelectAllApp(false);"><img id="imgSelectApp" src="../../img/WorkPortal/Menu/RedLittleArrow.gif" align="top" style="visibility:hidden"><%=BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPCategorySearchSelectApp")%></a></td>
	</tr>
	<tr id="RDiv1">
		<td colspan="3" class="header">&nbsp;
		</td>
	</tr>
	<tr>
		<td colspan="3">
		<div style="width:100%; height:10px" id="CategoryMainContainer">
		<%= GetCategoryContainers()%>
		</div>
		</td>
	</tr>
	<tr id="RDiv2">
		<td colspan="3" class="header">&nbsp;
		</td>
	</tr>
	<tr>
		<td colspan="3" ><b><%=BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPCategorySearch")%></b>&nbsp;
	<span id="spanSearchTitle"><%=BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPCategorySearchAllApp")%></span>
	<input id="I_idWFClass" name="I_idWFClass" value="" type="hidden"> 
	<input id="I_idCategory" name="I_idCategory" value="" type="hidden"> 
	<input id="I_idApplication" name="I_idApplication" value="" type="hidden"> 
	<input id="h_idWFClassAuth" name="h_idWFClassAuth" value="<%=strIdWfClassAuth%>" type="hidden"> 
		</td>
	</tr>
</table>
<script language="javascript">
var sAllAppText = '<%=BizAgi.UI.WFBase.CResourceManager.RM.GetString("WPCategorySearchAllApp")%>';
WPCatSelectAllApp(true);

</script>

