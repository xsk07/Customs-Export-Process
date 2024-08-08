<%@ Page language="c#" Codebehind="SaveQuery.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.ListaDetalle.Forms.SaveQuery" %>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<html>
<head>
<title>Guardar Consulta</title>
<!--#include file="../../include/BizAgiMeta.inc"-->
<link rel="stylesheet" href="../../css/estilos.css" type="text/css">
<link rel="stylesheet" href="../../css/calendar.css" type="text/css">
<%WriteHead();%>
<script language="JavaScript" src="../../js/implementation.js"></script>



<!--  Add this to have a specific theme-->
<script language="JavaScript" src="../../js/WorkPortal/BAWindows/prototype.js"></script>
<script language="JavaScript" src="../../js/WorkPortal/BAWindows/window.js"></script>
<script language="JavaScript" src="../../js/WorkPortal/BAWindows/BAWindow.js"></script>
<LINK href="../../css/WorkPortal/BAWindow.css" type="text/css" rel="stylesheet">




<script language="JavaScript">
    function checkAll(ele) {
        var checkboxes = document.getElementsByTagName('input');
        var checked = true;
        if (!ele.checked) checked = false;
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].type == 'checkbox') {
                checkboxes[i].checked = checked;
            }
        }
    }
    function VerifyForm() {
        /*if (document.frm.sv_Name.value.length == 0) {
            setHelp("<%= sHelpTitle %>", "<%= sNoNameMsg %>", 3);
            return false;
        }*/
        if (document.getElementsByName('sv_Name').value.length == 0) {
            setHelp("<%= sHelpTitle %>", "<%= sNoNameMsg %>", 3);
            return false;
        }

        return true;
    }

    function modalWindow(sURL, iWidth, iHeight){
	    ShowBAWindowModal('<% Response.Write(CResourceManager.RM.GetString("SaveQuery_Users")); %>',iWidth,iHeight, sURL);
    }

    function refreshMenu() {
        if (parent != null && parent.BALeftPanel != null) {
            parent.BALeftPanel.BARefreshData('BAQuery');
        }
    }

    function returnToGraphicAnalysis(retunrURL) {
        document.getElementById("frm").setAttribute("action", "../GraphicAnalysis/GraphicAnalysis.aspx");
        document.getElementById("frm").submit();
    }
</script>
</head>
<body  onclick="BAonclick(event)" onload="BAonload()" onUnload="refreshMenu()">
<P><span id="SpanHeader" runat="server"></span></P>

<table width="90%" border="0" cellspacing="2" cellpadding="2" align="center">
	<tr>
		<td align="center">
			<span id="SpanQueryForm" runat="server"></span>
		</td>
	</tr>
</table>

<DIV class=text id=popupcalendar></DIV>
<div id="oBAContextMenu" class="BAContextMenu"></div>

</body>
</html>
