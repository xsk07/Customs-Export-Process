<%@ Page language="c#" Codebehind="DateRangesDialog.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.ListaDetalle.DateRangesDialog" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" > 
<html>	
  <head>
    <title>Filter Dialog</title>
  </head>
	<frameset rows="80%,*" framespacing="0" frameborder="NO" >
		<frame name="header" src="ShowDateRanges.aspx?<%= Request.QueryString %>" frameborder="no" scrolling="yes">
		<frame name="main" src="DateRangesAction.aspx" frameborder="no" scrolling="no">
	</frameset>
</html>
