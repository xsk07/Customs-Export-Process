<%@ Page Language="c#" CodeBehind="QueryForm.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.ListaDetalle.QueryForm" %>

<html>
<head>
    <title>Búsqueda</title>
    <link rel="stylesheet" href="../../css/estilos.css" type="text/css" />
    <link rel="stylesheet" href="../../css/calendar.css" type="text/css" />
    <link rel="stylesheet" href="../../css/WorkPortal/BAWindow.css" type="text/css" />
    <%WriteHead();%>
    <script language="javaScript" type="text/javascript" src="../../js/implementation.js"></script>
    <script language="javaScript" type="text/javascript" src="../../js/WorkPortal/BAWindows/prototype.js"></script>
    <script language="javaScript" type="text/javascript" src="../../js/WorkPortal/BAWindows/window.js"></script>
    <script language="javaScript" type="text/javascript" src="../../js/WorkPortal/BAWindows/BAWindow.js"></script>
    <script language="javaScript" type="text/javascript">
        function IsAnyChecked() {
            var bAnyChecked = false;
            var checkTags = document.getElementsByTagName('input');
            for (var i = 0; i < checkTags.length; i++) {
                if (document.getElementsByTagName("input")[i].type == "checkbox") {
                    if (document.getElementsByTagName("input")[i].checked == true)
                        bAnyChecked = true;
                }
            }
            return bAnyChecked;
        }

        function CheckAll() {
            var checkTags = document.getElementsByTagName('input');
            for (var i = 0; i < checkTags.length; i++) {
                if (document.getElementsByTagName("input")[i].type == "checkbox") {
                    document.getElementsByTagName("input")[i].checked = true;
                }
            }
            return false;
        }

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
    </script>
</head>
<body onclick="BAonclick(event)" onload="BAonload()">
    <p>
        <span id="SpanHeader" runat="server"></span>
    </p>
    <table width="90%" border="0" cellspacing="2" cellpadding="2" align="center">
        <tr>
            <td align="center">
                <span id="SpanQueryForm" runat="server"></span>
            </td>
        </tr>
    </table>
    <div class="text" id="popupcalendar">
    </div>
    <div id="oBAContextMenu" class="BAContextMenu">
    </div>
</body>
</html>
