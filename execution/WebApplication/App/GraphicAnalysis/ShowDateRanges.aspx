<%@ Page language="c#" Codebehind="ShowDateRanges.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.ListaDetalle.ShowDateRanges" %>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN" >
<HTML>
  <HEAD>
    <title>ShowDateRanges</title>

    <link rel="stylesheet" href="../../css/estilos.css" type="text/css">
    <script language="JavaScript" src="../../js/WorkPortal/WPToolBarMenu.js"></script>	
	<script language="JavaScript" src="../../Localization/LocalizationEN.js"></script>
    <script language="JavaScript" src="../../js/scripts.js"></script>	
	<script language=javascript src="../../js/WorkPortal/WPTree.js"></script>
	<script language=javascript src="../../js/WorkPortal/WPContextMenu.js"></script>
	
	<link rel="stylesheet" href="../../css/WorkPortal/WPCustomStyles.css" type="text/css">
	<link rel="stylesheet" href="../../css/WorkPortal/WPPanel.css" type="text/css">
	<link rel="stylesheet" href="../../css/WorkPortal/WPContextMenu.css" type="text/css">


	<script language="javascript">
		function saveResource(form) {
			var sDimension = form.h_Dimension.value;
			var sSelectedvalue =   document.getElementById( 'h_SelectedValue' ).value;

			//var elem = parent.document.getElementById("h_dimensionfilter_" + sDimension);
			var dimension = parent.findDimensionByColumnName(sDimension, parent.selectedDimensions);
			dimension.filter = sSelectedvalue;
			//elem.value = sSelectedvalue;

			parent.setTimeout("saveResource(null, true)", 300);
			parent.CloseCurrentWindow(null);
		}
		
		function selectNode(node){
			var value = node.getAttribute("idNode");
			unSelectNode();
			//alert(value);
			if (value != null && value.length > 0){
				node = document.getElementById(value);
				node.previousSibling.style.background = '#E8EFF6'; //'#F2BFBF'
				node.previousSibling.style.border = '1px solid #F2BFBF';

			}
			document.getElementById( 'h_SelectedValue' ).value = value;
		}
		
		function unSelectNode(){
			var selected = document.getElementById("h_SelectedValue");
	
			if (selected == null || selected.value == null || selected.value.length == 0)
				return;
				
			selected = document.getElementById(selected.value);
			selected.previousSibling.style.background = '';
			selected.previousSibling.style.border = '';
		}
		
		function findNodeToExpand(){
			var selected = document.getElementById("h_SelectedValue");
			
			if (selected == null || selected.value == null || selected.value.length == 0)
				return;
				
			selected = document.getElementById(selected.value);

			WPExpandSelectedNode(selected);
		}


function EndWPToggleNode(){
	if (BAcurrentImage != null){
		BAcurrentImage.src = imgPlusE.src;
		BAcurrentImage = null;
	}
}

		//Changes the image  to plus or minus
		function WPtoggleNodeToExpand(node, selected){
			BAcurrentImage = null;
			/*if (BAcurrentImage){
				return;
			}*/

			getImageValues();
			if (!imgPlus || !imgMinus){
				alert ('debe incluir las imagenes para el arbol');
			}

			if (selected){
				//node.previousSibling.style.border = '1px red solid';
				node.previousSibling.style.background = '#E8EFF6';
				node.previousSibling.style.border = '1px solid #F2BFBF';
			}

			WPInnerControl = node;
			if (!WPInnerControl){
				return;
			}
			
			// Unfold the branch if it isn't visible
			if (WPInnerControl.style.display == 'none')
			{
				// Change the image (if there is an image)
				if (WPInnerControl.innerHTML.length > 0)
				{
					node.src = imgMinus.src;
					BAcurrentImage = node;
					window.setTimeout("EndWPToggleNode();",60);
					
				}
				WPInnerControl.style.display = 'block';
			}
			// Collapse the branch if it IS visible
			else
			{
				// Change the image (if there is an image)
				if (WPInnerControl.innerHTML.length > 0)
				{
					node.src = imgPlus.src;			
				}

				WPInnerControl.style.display = 'none';
			}	
		}

		//Gets the parent element that has the given tag Name
		function GetParentNode(node, parentTagName){
			while (node != null){
				node = node.parentNode;
				if (node != null && node.tagName != null && node.tagName.toUpperCase() == parentTagName){
					return node;
				}
			}
			return null;
		}

		function WPExpandSelectedNode(node){	
			var selectedNode = node;
			WPtoggleNodeToExpand(selectedNode, true);

			while (node != null){
				node = GetParentNode(node, "DIV");		
				if (node.id == "ContentTree" || node.id == "treecontainer"){
					break;
				}
				if (node != null && node.id != null){
					//alert(node.tagName + ": " + node.id);
					WPtoggleNodeToExpand(node, false);
				}
			}
		}
	</script>
</HEAD>
  <body MS_POSITIONING="FlowLayout" onload="findNodeToExpand();">
    <form id="Filter_Tree" name="Filter_Tree" method="post" runat="server">		
			<table align="left" cellSpacing="0" cellPadding="0" border="0" width="100%">
				<tr valign="top">
					<TD>
						<div id="treecontainer" align="left" style="{width:325px;height:190px;border:1px solid gray; background-color:white; margin-left:10px;margin-right:10px;margin-top:10px;margin-bottom:10px;overflow-y:scroll;}">
							<%=TreePageHTML%>
							<%=TreePageContextMenu%>
							    <img src="../../img/separador/plus.gif" id=imgPlus name=imgPlus style="display:none"/>
								<img src="../../img/separador/plusE.gif" id=imgPlusE name=imgPlusE style="display:none"/>
								<img src="../../img/separador/minus.gif" id=imgMinus name=imgMinus style="display:none"/>
						</div>
					</TD>
				</tr>
				<tr>
					<td align="center">
						<table><tr><td>
						<% H.WPButton("button","btnFilter",BizAgi.UI.WFBase.CResourceManager.RM.GetString("GA_FilterButton"), BizAgi.UI.WFBase.CResourceManager.RM.GetString("GA_FilterButton"),"sbttn","onclick=\"saveResource(document.getElementById('Filter_Tree'));\""); %>
						</td><td>&nbsp;&nbsp;</td><td>
						<% H.WPButton("button","btnCancel",BizAgi.UI.WFBase.CResourceManager.RM.GetString("GA_FilterCancelButton"), BizAgi.UI.WFBase.CResourceManager.RM.GetString("GA_FilterCancelButton"),"sbttn","onclick=\"parent.CloseCurrentWindow(null);\""); %>
						</td></tr></table>
					</td>
				</tr>
			</table>
			<input type="hidden" name="h_Dimension" id="h_Dimension"value="<%= BizAgi.Util.SecurityUtils.sanitizeData(Request.QueryString["h_dimension"]) %>">
			<input type="hidden" name="h_SelectedValue" id="h_SelectedValue" value="<%= GetSelectedValue() %>">
    </form>
  </body>
</HTML>