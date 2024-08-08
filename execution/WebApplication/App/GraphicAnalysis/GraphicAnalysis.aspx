<%@ Import Namespace="BizAgi.Render.Controls" %>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@ Page language="c#" Codebehind="GraphicAnalysis.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.ListaDetalle.GraphicAnalysis" enableViewState="False" %>
<html>
<head>

<title>Graphical Analysis</title>
	
    <link rel="stylesheet" href="../../css/estilos.css" type="text/css" />
    <link rel="stylesheet" href="../../css/GraphicAnalysis/graphicAnalysis.css"  type="text/css" />
    <link rel="stylesheet" href="../../css/WorkPortal/WPCustomStyles.css" type="text/css" />
    <link rel="stylesheet" href="../../css/GraphicAnalysis/estilosGrid.css" type="text/css" />
    <link rel="stylesheet" href="../../css/WorkPortal/BAWindow.css" type="text/css" />
	
	<script language="javascript" type="text/javascript" src="../../js/amcharts4/core.js"></script>
	<script language="javascript" type="text/javascript" src="../../js/amcharts4/charts.js"></script>
	<script language="javascript" type="text/javascript" src="../../js/amcharts4/themes/material.js"></script>
	
	<script language="javascript" type="text/javascript" src="../../js/GraphicAnalysis/overrides.js"></script>
	<script language="javascript" type="text/javascript" src="../../js/GraphicAnalysis/wizardScript.js"></script>
	<script language="javascript" type="text/javascript" src="../../js/GraphicAnalysis/graphicalAnalysisScript.js"></script>
	<script language="javascript" type="text/javascript" src="../../js/GraphicAnalysis/gridScript.js"></script>

	<script language="javascript" type="text/javascript" src="../../js/GraphicAnalysis/DataAdapter.js"></script>
	<script language="javascript" type="text/javascript" src="../../js/GraphicAnalysis/ChartBuilderPie.js"></script>
	<script language="javascript" type="text/javascript" src="../../js/GraphicAnalysis/ChartBuilderLineBar.js"></script>
	<script language="javascript" type="text/javascript" src="../../js/GraphicAnalysis/chartScript.js"></script>
	<script language="javascript" type="text/javascript" src="../../js/GraphicAnalysis/containerScript.js"></script>
	<script language="javascript" type="text/javascript" src="../../js/GraphicAnalysis/hashTable.js"></script>
	<script language="javascript" type="text/javascript" src="../../js/BizAgiAJAX.js"></script>
	<script language="javascript" type="text/javascript" src="../../js/GraphicAnalysis/drag-drop-custom.js"></script>

	<script language="javascript" type="text/javascript" src="../../Localization/LocalizationEN.js"></script>
	<script language="javascript" type="text/javascript" src="../../js/scripts.js"></script>
	<script language="javascript" type="text/javascript" src="../../js/WorkPortal/WPFrames.js"></script>
	<script language="javascript" type="text/javascript" src="../../js/wizard.js"></script>

	<script language="javascript" type="text/javascript" src="../../js/WorkPortal/BAWindows/prototype.js"></script>
	<script language="javascript" type="text/javascript" src="../../js/WorkPortal/BAWindows/window.js"></script>
	<script language="javascript" type="text/javascript" src="../../js/WorkPortal/BAWindows/BAWindow.js"></script>
   

<script language="javascript" type="text/javascript">
	var bLoadComplete = false;
	var DefaultTab = 0;
	var CurrentTab = 0;
	var mainTable = null;
	var secondaryTable = null;
	var bShowSeparator = false;
	
	var m_containerWidth;
	var m_containerHeight;

	var TabNames = new Array();
	TabNames[0]='<% Response.Write(GetResource("GA_ChartTab")); %>';
	TabNames[1]='<% Response.Write(GetResource("GA_MeasureDetailTab")); %>';
	TabNames[2]='<% Response.Write(GetResource("GA_DataTab")); %>';

	var htResources = new Hashtable();
	htResources.put("CASCREATIONDATE", '<% Response.Write(GetResource("ColHeader_CASCREATIONDATE")); %>');
	htResources.put("CASSOLUTIONDATE", '<% Response.Write(GetResource("ColHeader_CASSOLUTIONDATE")); %>');
	htResources.put("CATDISPLAYNAME", '<% Response.Write(GetResource("ColHeader_CATDISPLAYNAME")); %>');
	htResources.put("WFCLSDISPLAYNAME", '<% Response.Write(GetResource("ColHeader_WFCLSDISPLAYNAME")); %>');
	htResources.put("CREATOR", '<% Response.Write(GetResource("ColHeader_CREATOR")); %>');
	htResources.put("CREATORFULLNAME", '<% Response.Write(GetResource("ColHeader_CREATORFULLNAME")); %>');
	htResources.put("CREATORUSERNAME", '<% Response.Write(GetResource("ColHeader_CREATORUSERNAME")); %>');
	htResources.put("CREATORPOSITION", '<% Response.Write(GetResource("ColHeader_CREATORPOSITION")); %>');
	htResources.put("IDCASESTATE", '<% Response.Write(GetResource("ColHeader_CASESTATE")); %>');
	htResources.put("AMOUNT", '<% Response.Write(GetResource("ColHeader_AMOUNT")); %>');
	htResources.put("CASEPATH", '<% Response.Write(GetResource("ColHeader_FINALSTATE")); %>');
	htResources.put("_Y", '<% Response.Write(GetResource("GA_YEAR")); %>');
	htResources.put("_Q", '<% Response.Write(GetResource("GA_QUART")); %>');
	htResources.put("_M", '<% Response.Write(GetResource("GA_MONTH")); %>');
	htResources.put("_D", '<% Response.Write(GetResource("GA_DAY")); %>');
	htResources.put("MONTH1", '<%= System.Threading.Thread.CurrentThread.CurrentUICulture.DateTimeFormat.GetMonthName(1) %>');
	htResources.put("MONTH2", '<%= System.Threading.Thread.CurrentThread.CurrentUICulture.DateTimeFormat.GetMonthName(2) %>');
	htResources.put("MONTH3", '<%= System.Threading.Thread.CurrentThread.CurrentUICulture.DateTimeFormat.GetMonthName(3) %>');
	htResources.put("MONTH4", '<%= System.Threading.Thread.CurrentThread.CurrentUICulture.DateTimeFormat.GetMonthName(4) %>');
	htResources.put("MONTH5", '<%= System.Threading.Thread.CurrentThread.CurrentUICulture.DateTimeFormat.GetMonthName(5) %>');
	htResources.put("MONTH6", '<%= System.Threading.Thread.CurrentThread.CurrentUICulture.DateTimeFormat.GetMonthName(6) %>');
	htResources.put("MONTH7", '<%= System.Threading.Thread.CurrentThread.CurrentUICulture.DateTimeFormat.GetMonthName(7) %>');
	htResources.put("MONTH8", '<%= System.Threading.Thread.CurrentThread.CurrentUICulture.DateTimeFormat.GetMonthName(8) %>');
	htResources.put("MONTH9", '<%= System.Threading.Thread.CurrentThread.CurrentUICulture.DateTimeFormat.GetMonthName(9) %>');
	htResources.put("MONTH10", '<%= System.Threading.Thread.CurrentThread.CurrentUICulture.DateTimeFormat.GetMonthName(10) %>');
	htResources.put("MONTH11", '<%= System.Threading.Thread.CurrentThread.CurrentUICulture.DateTimeFormat.GetMonthName(11) %>');
	htResources.put("MONTH12", '<%= System.Threading.Thread.CurrentThread.CurrentUICulture.DateTimeFormat.GetMonthName(12) %>');
	htResources.put("FunctionMax", '<% Response.Write(GetResource("GA_Function_Max")); %>');
	htResources.put("FunctionMin", '<% Response.Write(GetResource("GA_Function_Min")); %>');
	htResources.put("FunctionAvg", '<% Response.Write(GetResource("GA_Function_Avg")); %>');
	htResources.put("FunctionSum", '<% Response.Write(GetResource("GA_Function_Sum")); %>');
	htResources.put("FunctionCount", '<% Response.Write(GetResource("GA_Function_Count")); %>');
	htResources.put("Counter", '<% Response.Write(GetResource("GA_Counter")); %>');
	htResources.put("noDataToDisplay", '<% Response.Write(GetResource("workportal-graphical-analysis-no-data-to-display")); %>');
	htResources.put("LimitResults", '<% Response.Write(GetResource("workportal-graphical-analysis-limit-results")); %>');
	htResources.put("ClickToLoadChart", '<% Response.Write(GetResource("workportal-graphical-analysis-click-to-load-chart")); %>');

	<%= RenderExtendedResources() %>	

	function BAonload(){
		
		if (selectedMeasures.length == 0 && selectedDimensions.length == 0){
			//document.location = "GraphicAnalysis.aspx?" + saveResource(null, false);
		}
		else{		
			startProcessing();
			var oTabContents = document.getElementById("xpTab1");
			if (oTabContents != null)
				LoadTabs();
			
			renderMeasureContainer(selectedMeasures);
			renderDimensionContainer(selectedDimensions);
			
			mainTable = new BizAgiGridTable(document.getElementById("h_jsondata").value, document.getElementById("griddiv"), null, 0, 0, true, true, true);
		
			resizeContainers(false);
			
			renderContents();
		}
		bLoadComplete = true;
		
		window.onresize = resizeContainers;
	}

</script>

<!-- dimensions -->
<%= RenderDimensions() %>

<!-- measures -->
<%= RenderMeasures() %>


</head>

<body class="contentBkgorund"  onload="BAonload();" >

<form id="frm" name="frm" method="post">

	<table width="100%">
		<tr valign="top">
			<td width="180">
				<div id="MediWidget">
					<div class="topWidget">
						<strong><% Response.Write(CResourceManager.RM.GetString("GA_Measures")); %></strong>
					</div>
					<ul id="listaMedidas">
						<li>
							<a href="javascript:ShowBADialog('<% Response.Write(CResourceManager.RM.GetString("GA_MeasuresDialogTitle")); %>', 'addMeasureDialog', 360, 360, null);" class="addToList">
								<span class="colorGris"><% Response.Write(CResourceManager.RM.GetString("BtnAdd")); %></span>
							</a>
						</li>
						<li>
							<a href="javascript:scroll('measuresContainer', 'up');" class="upList">
								&nbsp;
							</a>
						</li>
						<li class="clipingList" id="measuresClipingList">
								<div id="measuresScrollingList" style="position:relative;">
									<ul id="measuresContainer" style="position:absolute;">
										<!-- MEASURES CONTAINER  -->
									</ul>
								</div>
						</li>
						<li>
							<a href="javascript:scroll('measuresContainer', 'down');" class="downList">
								&nbsp;
							</a>
						</li>
					</ul>
					<div class="downWidget">
							&nbsp;
					</div>
				</div>
				<div id="DimenWidget">
					<div class="topWidget">
						<strong><% Response.Write(CResourceManager.RM.GetString("GA_Dimensions")); %></strong>
					</div>
					<ul id="listaDimen">
						<li>
							<a href="javascript:ShowBADialog('<% Response.Write(CResourceManager.RM.GetString("GA_DimensionsDialogTitle")); %>', 'addDimensionsDialog', 360, 360,  null);" class="addToList">
								<span class="colorGris"><% Response.Write(CResourceManager.RM.GetString("BtnAdd")); %></span>
							</a>
						</li>
						<li>
							<a href="javascript:scroll('dimensionContainer', 'up');" class="upList" id="upArrow">
								&nbsp;
							</a>
						</li>
						<li class="clipingList" id="dimensionsClipingList">
							<div id="dimensionsScrollingList" style="position:relative;">
								<ul id="dimensionContainer" style="position:absolute;">
									<!-- DIMENSIONS CONTAINER  -->
								</ul>
							</div>
						</li>
						<li>
							<a href="javascript:scroll('dimensionContainer', 'down');" class="downList" id="downArrow">
								&nbsp;
							</a>
						</li>
					</ul>
					<div class="downWidget">
							&nbsp;
					</div>
				</div>

				<!-- Measures -->

				<div class="submenuFunciones" id="measuresFunctions" onMouseOver="setCloseMeasures(false);" onmouseout="setCloseMeasures(true);" style="z-index:100; display:none; left:160px; top:0px; visibility:hidden; position:absolute;" >
					<table cellspacing="0">
					<tr>
						<td>
							<a href="javascript;:void(0);" id="maxFunction" onMouseOver="setCloseMeasures(false);" class="maxbtn"><% Response.Write(CResourceManager.RM.GetString("GA_Function_Max")); %></a>
						</td>
					</tr>
					<tr>
						<td>
							<a href="javascript;:void(0);" id="minFunction" onMouseOver="setCloseMeasures(false);" class="minbtn"><% Response.Write(CResourceManager.RM.GetString("GA_Function_Min")); %></a>
						</td>
					</tr>
					<tr>
						<td>
							<a href="javascript;:void(0);" id="avgFunction" onMouseOver="setCloseMeasures(false);" class="avgbtn"><% Response.Write(CResourceManager.RM.GetString("GA_Function_Avg")); %></a>
						</td>
					</tr>
					<tr>
						<td>
							<a href="javascript;:void(0);" id="sumFunction" onMouseOver="setCloseMeasures(false);" class="sumbtn"><% Response.Write(CResourceManager.RM.GetString("GA_Function_Sum")); %></a>
						</td>
					</tr>
					<!--tr>
						<td>
							<a href="javascript;:void(0);" id="countFunction" onMouseOver="setCloseMeasures(false);"class="countbtn"><% Response.Write(CResourceManager.RM.GetString("GA_Function_Count")); %></a>
						</td>
					</tr-->
				</table>
				</div>

			</td>
			<td>

			<table  border="0" cellpadding="0" cellspacing="0" id="contenedor">
				<tr align="left" valign="top">
					<td width="10"><img src="../../img/graphicanalysis/marc_Sup_izq.gif" width="10" height="10"></td>
					<td width="100%" background="../../img/graphicanalysis/marc_sup_cent.gif"><img src="../../img/graphicanalysis/shim.gif" width="5" height="5"></td>
					<td width="10"><img src="../../img/graphicanalysis/marc_Sup_der.gif" width="10" height="10"></td>
				</tr>
				<tr align="left" valign="middle">
					<td width="10" background="../../img/graphicanalysis/marc_left_Cent.gif"><img src="../../img/graphicanalysis/shim.gif" width="5" height="5"></td>
					<td width="100%" bgcolor="#FFFFFF">

					<div id="GraphicsToolBar">
						<ul>
							<li>
								<a href="javascript:showHideChartType();" class="Switchbtn" id="maxLeft" title="<% Response.Write(CResourceManager.RM.GetString("GA_ChartType")); %>"></a>
							</li>
							<li>
								<a href="javascript:showSeparator();" class="Viewbtn" title="<% Response.Write(CResourceManager.RM.GetString("GA_ViewChartAndData")); %>">&nbsp;</a>
							</li>
							<li>
								<a href="javascript:exportToExcel();" class="Exportbtn" title="<% Response.Write(CResourceManager.RM.GetString("LnkExportToExcel")); %>">&nbsp;</a>
							</li>
							<li>
								<a href="javascript:saveGraphicAnalysis('<%=BAURLEncoded%>');" class="Savebtn" title="<% Response.Write(CResourceManager.RM.GetString("GA_SaveGraphicAnalysis")); %>">&nbsp;</a>
							</li>
						</ul>
					</div>

					<div id="chartTypeDiv" onMouseOver="javascript:chartTypeTimer.stop();" onMouseOut="javascript:chartTypeTimer.start();" style="height:50px;	width:66px; visibility:hidden; display:none;">
						<table id="optionsToolbar">
							<tr>
								<td><a href="javascript:changeLineChartType(TYPE_OF_CHARTS.lineSeries);" class="linesbtn" title='<% Response.Write(CResourceManager.RM.GetString("GA_ChartType_Line")); %>'>&nbsp;</a></td>
								<td><a href="javascript:changeLineChartType(TYPE_OF_CHARTS.columnSeries);" class="bars2dbtn" title='<% Response.Write(CResourceManager.RM.GetString("GA_ChartType_Columns")); %>'>&nbsp;</a></td>
								<td><a href="javascript:changeLineChartType(TYPE_OF_CHARTS.coneSeries);" class="stacked2dbtn" title='<% Response.Write(CResourceManager.RM.GetString("GA_ChartType_Stacked")); %>'>&nbsp;</a></td>
							</tr>
							<tr>
								<td><a href="javascript:changeLineChartType(TYPE_OF_CHARTS.lineSeries, true);" class="areasbtn" title='<% Response.Write(CResourceManager.RM.GetString("GA_ChartType_Area")); %>'>&nbsp;</a></td>
								<td><a href="javascript:changePieChartType(TYPE_OF_CHARTS.pieSeries);" class="piebtn" title='<% Response.Write(CResourceManager.RM.GetString("GA_ChartType_Pie")); %> 2D'>&nbsp;</a></td>
								<td><a href="javascript:changePieChartType(TYPE_OF_CHARTS.pieSeries3D);" class="pie3dbtn" title='<% Response.Write(CResourceManager.RM.GetString("GA_ChartType_Pie")); %> 3D'>&nbsp;</a></td>
							</tr>
						</table>
				    </div>

					<div id="separatorDiv" style="visibility:hidden; display:none; height:25px; width:280px;">
						<table border="0">
							<tr vAlign="middle">
								<td><span id="chartseparatorcolumnslabel" style="height:20px;font:10px verdana;"><% Response.Write(CResourceManager.RM.GetString("GA_GroupChartBy")); %>:</span></td>
								<td><select name="h_chartseparatorcolumns" id="h_chartseparatorcolumns" onChange="changeSeparatorColumns();" style="height:18px; WIDTH:150px;"><option value="0">------------</option></select></td>
							</tr>
						</table>
					</div>

						<div id="ContenedorGraficas">
							<span id="TabHTML"></span>
							<div id="xpTab1" style="display: none;" class="tabContent">
								<div class="limit-results">
									<img class="warning-icon" src="../../img/graphicanalysis/warning-16x.png" alt="Warning" />
									<span class="limit-results-message"></span>
									<button type="button" class="close-button" onclick="document.getElementsByClassName('limit-results')[0].style.display = 'none';return false;">
										<img src="../../img/graphicanalysis/close-12x.png" alt="Close" />
									</button>
								</div>
								<div id="mainchartdiv" style ="width: 99%; height: 99%; overflow:auto;"></div>
								<div id="mainchartdivgrid" style="display:none;visibility:hidden;overflow:auto;"></div>
							</div>
							<div id="xpTab2" style="display: none;" class="tabContent">
								<div id="piechartdiv" style ="width: 99%; height: 99%; overflow:auto;"></div>
							</div>
							<div id="xpTab3" style="display: none;" class="tabContent">
								<div id="gridContainer" style="overflow:hidden;  margin-top: 1px">
									<div id="griddiv" style="overflow:auto;"></div>
								</div>
							</div>
						</div>
					</td>
					<td width="10" background="../../img/graphicanalysis/marc_der_cent.gif"><img src="../../img/graphicanalysis/shim.gif" width="5" height="5"></td>
				</tr>
				<tr align="left" valign="bottom">
					<td width="10"><img src="../../img/graphicanalysis/marc_Inf_izq.gif" width="10" height="10"></td>
					<td width="100%" background="../../img/graphicanalysis/marc_inf_cent.gif"><img src="../../img/graphicanalysis/shim.gif" width="5" height="5"></td>
					<td width="10"><img src="../../img/graphicanalysis/marc_Inf_der.gif" width="10" height="10"></td>
				</tr>
				</table>
			</td>
		</tr>
	</table>
<%=GetHiddens()%>
<input type="hidden" name="h_mainchartXML" id="h_mainchartXML" value="">
<input type="hidden" name="h_jsondata" id="h_jsondata" value="<%=GetJSONData()%>">
<div id="piedatadiv" style="display:none; visibility:hidden;"></div>

<div id="addDimensionsDialog" style="display:none; visibility:hidden; width:0px; height:0px;">
		<ul>
			<li class="ListTitle">
				<% Response.Write(CResourceManager.RM.GetString("GA_DimensionsDialogText")); %> 
			</li>
			<li id="iconoBig">
				<img src="../../img/graphicanalysis/IconoDimensiones.gif" width="48" height="48">
			</li>
			<li>
				<a href="javascript:checkAll('addDimensionsContainer');" class="addAllBtn"><img src="../../img/graphicanalysis/SelectAll.gif" width="16" height="16" hspace="3" vspace="3" border="0" align="absmiddle"> <% Response.Write(CResourceManager.RM.GetString("GA_CheckAll")); %></a>
			</li>
			<li>
				<dl  id="addDimensionsContainer" class="dlAddDialog">
				</dl>
			</li>
			<li>
				<table style="width:310px;" border="0">
					<tr>
						<td align="right">
							<%H.WPButton("button","btnAdd",BizAgi.UI.WFBase.CResourceManager.RM.GetString("BtnAdd"),BizAgi.UI.WFBase.CResourceManager.RM.GetString("BtnAdd"),"sbttn","onclick='javascript:addDimensions();'");%>
						</td>
						<td>&nbsp;</td>
						<td align="left">
							<%H.WPButton("button","btnCancel",BizAgi.UI.WFBase.CResourceManager.RM.GetString("GA_FilterCancelButton"), BizAgi.UI.WFBase.CResourceManager.RM.GetString("GA_FilterCancelButton"),"sbttn","onclick='javascript:Windows.close(\"window_idaddDimensionsDialog\");'");%>
						</td>
					</tr>
				</table>
			</li>
		</ul>
</div>

<div id="addMeasureDialog" style="display:none; visibility:hidden; width:0px; height:0px;">
	<ul>
		<li class="ListTitle">
			<% Response.Write(CResourceManager.RM.GetString("GA_MeasuresDialogText")); %> 
		</li>
		<li id="iconoBig">
			<img src="../../img/graphicanalysis/Iconomedidas.gif" width="48" height="48">
		</li>
		<li>
			<a href="javascript:checkAll('addMeasuresContainer');" class="addAllBtn"><img src="../../img/graphicanalysis/SelectAll.gif" width="16" height="16" hspace="3" vspace="3" border="0" align="absmiddle"> <% Response.Write(CResourceManager.RM.GetString("GA_CheckAll")); %></a>
		</li>
		<li class="dlAddDialog">
				<div style="overflow-y:auto;overflow-x:hidden;height: 260px;width:100%">
					<table id="listContainer" width="100%" border="0" cellpadding="0" cellspacing="0">
						<tbody>
						<tr>
							<td width="3%" valign="top" align="center"></td><td width="97%"></td>
						</tr>
						</tbody>
					</table>
				</div>
			<!--dl id="addMeasuresContainer" class="dlAddDialog">
			</dl-->
		</li>
		<li>
				<table style="width:310px;" border="0">
					<tr>
						<td align="right">
							<%H.WPButton("button","btnRefresh",BizAgi.UI.WFBase.CResourceManager.RM.GetString("BtnAdd"),BizAgi.UI.WFBase.CResourceManager.RM.GetString("BtnAdd"),"sbttn","onclick='javascript:addMeasures();'");%>
						</td>
						<td>&nbsp;</td>
						<td align="left">
							<%H.WPButton("button","btnCancel",BizAgi.UI.WFBase.CResourceManager.RM.GetString("GA_FilterCancelButton"), BizAgi.UI.WFBase.CResourceManager.RM.GetString("GA_FilterCancelButton"),"sbttn","onclick='javascript:Windows.close(\"window_idaddMeasureDialog\");'");%>
						</td>
					</tr>
				</table>
		</li>
	</ul>
</div>

<div id="processing" style="visibility:hidden; display:none;">
	<div id="waitingBackgroundDiv"></div>
	<div id="waitingDiv">
		<div id="textContainer">
			<table>
				<tr>
					<td><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("ProcessingPleaseWait") %></td>
				</tr>
			</table>
		</div>
	</div>
</div>
<asp:label id="upValueLocalizable" runat="server" style="display: none" Text="Up label"></asp:label>
<asp:label id="downValueLocalizable" runat="server" style="display: none" Text="Down label"></asp:label>

</form>
</body>
</html>
