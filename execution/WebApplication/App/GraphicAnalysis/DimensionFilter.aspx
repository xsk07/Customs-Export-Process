<%@ Page language="c#" Codebehind="DimensionFilter.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.GraphicAnalysis.DimensionFilter" %>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<HTML>
	<HEAD>
		<title>Guardar Consulta</title>
		<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
		<meta http-equiv="expires" content="Wed, 26 Feb 1997 08:00:00 GMT">
		<META http-equiv="Pragma" content="no-cache">
		<link rel="stylesheet" href="../../css/WorkPortal/WPCustomStyles.css" type="text/css">
		<LINK href="../../css/estilos.css" type="text/css" rel="stylesheet">
		<script language="JavaScript" src="../../js/WMask.js"></script>
		<script language="JavaScript" src="../../Localization/LocalizationEN.js"></script>
		<script language="JavaScript" src="../../js/scripts.js"></script>
		<script language="JavaScript" src="../../js/wizard.js"></script>
		<script language="JavaScript" src="../../js/WPSettings.js"></script>
		<script language="JavaScript" src="../../js/BizAgiAJAX.js"></script>
		<LINK href="../../css/BAWindow.css" type="text/css" rel="stylesheet">
		<script language="javascript">

	function addItem(allElements, selectedElements) {
		var fl = 0;//allElements.length -1;
		var au = selectedElements.length -1;

		var items = "x";

		//build array of items
		for (au; au > -1; au--) {
			items = items + "," + selectedElements.options[au].value + ","
		}

		//Pull selected allElements and add them to list of selectedElements
		for (fl = 0; fl < allElements.length; fl++) {
			if (allElements.options[fl].selected && items.indexOf( "," + allElements.options[fl].value + "," ) == -1) {
				t = selectedElements.length
				opt = new Option( allElements.options[fl].text, allElements.options[fl].value);
				selectedElements.options[t] = opt;
			}
		}
	}


	//Copy all items from a select to another
	function addAllItems(allElements, selectedElements) {
		var fl = 0;//allElements.length -1;
		var au = selectedElements.length -1;

		var items = "x";

		//build array of items
		for (au; au > -1; au--) {
			items = items + "," + selectedElements.options[au].value + ","
		}

		//Pull selected allElements and add them to list of selectedElements
		for (fl = 0; fl < allElements.length; fl++) {
			if (items.indexOf( "," + allElements.options[fl].value + "," ) == -1) {
				t = selectedElements.length
				opt = new Option( allElements.options[fl].text, allElements.options[fl].value);
				selectedElements.options[t] = opt;
			}
		}
	}

	//Add a new option into a select
	function addOption(selectedElements, value, name) {
		var fl = 0;//allElements.length -1;
		var au = selectedElements.length -1;

		var items = "x";

		//build array of items
		for (au; au > -1; au--) {
			items = items + "," + selectedElements.options[au].value + ","
		}

		var opt = new Option( name, value );
		//Pull selected allElements and add them to list of selectedElements

		if (items.indexOf( "," + value + "," ) == -1) {
			t = selectedElements.length
			selectedElements.options[t] = opt;
		}
	}

	//removes all options from a select
	function clearOptions(selectedElements){
		var fl = selectedElements.length -1;
		for (fl; fl > -1; fl--) {
			selectedElements.options[fl] = null;
		}
	}

	//removes the selected options from a select
	function removeItem(selectedElements) {
		fl = selectedElements.length -1;
		for (fl; fl > -1; fl--) {
			if (selectedElements.options[fl].selected)
			{
				var selValue = selectedElements.options[fl].value;			
				var re = ".*("+selValue+"=[0-9]*;).*";
				selectedElements.options[fl] = null;
			}
		}
	}


	function saveResource(form) {
		var sDimension = form.h_Dimension.value;
		var fl = form.h_itemsselected.length -1;
		ha = form.h_FinalItems;
		ha.value = "";
		for (fl; fl > -1; fl--){
			ha.value = ha.value +","+ form.h_itemsselected.options[fl].value;
		}

		//var elem = parent.document.getElementById("h_dimensionfilter_" + sDimension);
		//elem.value = form.h_FinalItems.value;
		var dimension = parent.findDimensionByColumnName(sDimension, parent.selectedDimensions);
		dimension.filter = form.h_FinalItems.value;
		parent.setTimeout("saveResource(null, true)", 300);
		
		parent.CloseCurrentWindow(null);
	}

    function renderContents(http_request) {
		var oDiv = document.getElementById("h_allitems");
		var data = eval(" (" + http_request + ")");
		var i = 0;
		var selectedElements = document.getElementById("h_allitems");

		clearOptions(selectedElements);
		
		for (i = 0; i < data.dimensionValues.length; i++){
			addOption(selectedElements, data.dimensionValues[i],  data.dimensionValues[i]);
		}
		loadItems();
    }

    //preload all items
    function preLoadItems(){
		var sPath = location.pathname.split('/');
		var sURL = '../Ajax/AJAXGateway.aspx?action=2&h_Dimension=' + document.frm.h_Dimension.value + '&h_CacheKey=' + parent.document.getElementById('frm').h_CacheKey.value;
		callAjaxURL(sURL, renderContents);
    }
    
    
    function loadItems(){
		var sDimension = document.frm.h_Dimension.value;
    	//var elem = parent.document.getElementById("h_dimensionfilter_" + sDimension);
    	//document.frm.h_FinalItems.value = elem.value;
    	
    	var dimension = parent.findDimensionByColumnName(sDimension, parent.selectedDimensions);		
		document.frm.h_FinalItems.value = dimension.filter;

		var items = document.frm.h_FinalItems.value.split(",");
		
		for(var i = items.length; i >= 0; i--){
			if (items[i] && items[i].length > 0){
				var itemName = "";
				for (var j = 0; j < document.frm.h_allitems.length; j++){
					if (document.frm.h_allitems.options[j].value == items[i]){
						itemName = document.frm.h_allitems.options[j].text;
						break;
					}
				}
				
				addOption(document.frm.h_itemsselected, items[i],  itemName);
			}
		}
    }
    
		</script>
	</HEAD>
	<body onload="BAonload();" MS_POSITIONING="FlowLayout">
		<form id="frm" name="frm" action="" method="post">
	
			<TABLE cellSpacing="0" cellPadding="0" width="100%" border="0">
				<TR>
					<TD style="HEIGHT: 16px"><SPAN id="TabHTML"></SPAN></TD>
				</TR>
				<SCRIPT language="JavaScript">
					var DefaultTab = 0;
					var CurrentTab = 0;
					var TabNames = new Array();
					TabNames[0]='Filter';
				</SCRIPT>
				<TR>
					<TD bgColor="#ffffff">
						<DIV id="xpTab1" style="HEIGHT: 280px">
							<table id="Table2" style="BORDER-RIGHT: #d8d2bd 1px solid; BORDER-LEFT: #d8d2bd 1px solid; BORDER-BOTTOM: #d8d2bd 1px solid; HEIGHT: 245px" cellSpacing="0" cellPadding="4" width="100%" border="0" valign="top">
								<tr height="16px"><td></td></tr>
								<!--TR>
									<TD><table><tr><td width="50%"><b>Value Like</b></td><td><input type="text"></td></tr></table></TD>
								</TR-->
								<TR valign="top">
									<TD height="189">
										<TABLE id="Table4" cellSpacing="1" cellPadding="1" width="400px" border="0">
											<TR>
												<TD>
													<TABLE id="Table5" cellSpacing="1" cellPadding="1" width="100%" border="0">
														<TR>
															<TD colspan="3">
																<TABLE width="100%" height="91" border="0" cellPadding="1" cellSpacing="1" id="Table3">
																	<TR>
																		<TD height="35" colSpan="3" class="header"><p><span id="SpanReassign4"></span><br>
																				<B><span><% Response.Write(CResourceManager.RM.GetString("GA_Values")); %></span></B></p>
																		</TD>
																	</TR>
																	<TR>
																		<TD colSpan="3" style="HEIGHT: 4px"></TD>
																	</TR>
																	<TR valign="top">
																		<TD align="center">
																			<table border="0" cellpadding="4" cellspacing="0" class="std">
																				<tr>
																					<td valign="top" align="left" width="100">
																						<table cellspacing="0" cellpadding="2" border="0">
																							<tr>
																								<td><% Response.Write(CResourceManager.RM.GetString("GA_AllValues")); %>:</td>
																								<td></td>
																								<td><% Response.Write(CResourceManager.RM.GetString("GA_ValuesSelected")); %>:</td>
																							</tr>
																							<tr>
																								<td>
																									<select name="h_allitems" id="h_allitems" style="WIDTH:170px" size="10" class="text" multiple>
																									</select>
																								</td>
																								<td>
																									<table border="0">
																										<tr>
																											<td align="right"><input type="button" class="button" value=">" onClick="javascript:addItem(document.frm.h_allitems, document.frm.h_itemsselected);"></td>
																										</tr>
																										<tr>
																											<td align="left"><input type="button" class="button" value="<" onClick="javascript:removeItem(document.frm.h_itemsselected);"></td>
																										</tr>
																									</table>
																								</td>
																								<td>
																									<select name="h_itemsselected" style="WIDTH:170px" size="10" class="text" multiple>
																									</select>
																								</td>
																							</tr>
																							<tr>
																								<td colspan="3" align="center">
																								</td>
																							</tr>
																						</table>
																					</td>
																				</tr>
																			</table>
																		</TD>
																	</TR>
																</TABLE>
															</TD>
														</TR>
													</TABLE>
												</TD>
											</TR>
											<TR>
												<TD></TD>
											</TR>
										</TABLE>
									</TD>
								</TR>
							</table>
						</DIV>
					</TD>
				</TR>
				<tr>
					<td></td>
				</tr>
				<TR>
					<td align="center">
						<table><tr><td>
						<% H.WPButton("button","btnFilter",BizAgi.UI.WFBase.CResourceManager.RM.GetString("GA_FilterButton"), BizAgi.UI.WFBase.CResourceManager.RM.GetString("GA_FilterButton"),"sbttn","onclick=\"saveResource(document.frm);\""); %>
						</td><td>&nbsp;&nbsp;</td><td>
						<% H.WPButton("button","btnCancel",BizAgi.UI.WFBase.CResourceManager.RM.GetString("GA_FilterCancelButton"), BizAgi.UI.WFBase.CResourceManager.RM.GetString("GA_FilterCancelButton"),"sbttn","onclick=\"parent.CloseCurrentWindow(null);\""); %>
						</td></tr></table>
					</td>
				</TR>
			</TABLE>
			<input id="h_Tab" style="VISIBILITY: hidden" type="text" value="0" name="h_Tab">
			<input id="h_FinalItems" type="hidden" value="" name="h_FinalItems">
			<input type="hidden" name="h_Dimension" value="<%= GetDimension() %>">
			<script language="javascript">
				 preLoadItems();
			</script>
			
		</form>
	</body>
</HTML>
