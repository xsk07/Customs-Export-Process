/**
 * Set default options for performance
 */
am4core.options.autoDispose = true;

	var m_ChartWidth = 550;
	var m_ChartHeight = 400;
	var m_PieWidth = 300;
	var m_PieHeight = 300;
	var m_PiesPerRow = 3;
	var m_UseGrid = false;
	var m_dataTable = null;
	var TYPE_OF_CHARTS = {
		columnSeries3D: "ColumnSeries3D",
		columnSeries: "ColumnSeries",
		coneSeries: 'ConeSeries',
		lineSeries: 'LineSeries',
		pieSeries: 'PieSeries',	
		pieSeries3D: 'PieSeries3D'
	}
	var m_DefaultChartType = TYPE_OF_CHARTS.columnSeries;
	var m_SeparatorColumns = 0;
	var m_ChartType = null;//'MSColumn3D';
	var m_PieChartType = TYPE_OF_CHARTS.pieSeries;
	var m_data;
	var ZOOM_DIV = "zoomdiv_";

	am4core.useTheme(am4themes_material);

	//Replace month names for every column of type month if any
	function replaceMonthNames(dataTable){
		for (var jColumn = 0; jColumn < dataTable.Columns.length; jColumn++){
			var sColumnName = dataTable.Columns[jColumn].ColumnName;
			if (sColumnName.indexOf('_Y') > -1 || sColumnName.indexOf('_Q') > -1 || sColumnName.indexOf('_M') > -1 || sColumnName.indexOf('_D') > -1){
				dataTable.Columns[jColumn].DataType = "String";
				
				if (sColumnName.indexOf('_M') > -1)
					for(var iRow = 0; iRow < dataTable.Rows.length; iRow++){
						dataTable.Rows[iRow][jColumn] = htResources.get("MONTH" + dataTable.Rows[iRow][jColumn]);
					}
			}
		}
		//m_dataTable = dataTable;
		return dataTable;
	}

	//javascript doesn't understand the comma symbol
	function replaceDecimalPoint(dataTable){
		for (var jColumn = dataTable.ExtendedProperties["LastSelectedDimension"]; jColumn < dataTable.Columns.length; jColumn++){
			if (dataTable.Columns[jColumn].DataType == "Double")
				for(var iRow = 0; iRow < dataTable.Rows.length; iRow++){
					if (dataTable.Rows[iRow][jColumn].indexOf(',') > -1)
						dataTable.Rows[iRow][jColumn] = dataTable.Rows[iRow][jColumn].replace(',', '.');
				}
		}
		
		return dataTable;
	}

	
        
// get the datatable like an xml document for fusioncharts input in MultiSeries charts
function GetDataTableAsXML(dataTable)
{
    try
    {
        var div = document.createElement("div");
        
        //Generate the XML data for it
        var chart = document.createElement("chart");
        var lastSelectedDimensionColumn = parseInt(dataTable.ExtendedProperties["LastSelectedDimension"]);

        //Build Categories
        var categories = document.createElement("categories");
        for (var iRow = 0; iRow < dataTable.Rows.length; iRow++){
            
            //Show vLines
            if (bShowSeparator){
                if (!m_SeparatorColumns)
                    m_SeparatorColumns = 2;
                for(var jColumn = 0; jColumn < m_SeparatorColumns/*lastSelectedDimensionColumn*/; jColumn++){					
                    if (iRow > 0){
                        var iColor = 200 * (jColumn  / lastSelectedDimensionColumn);
                        if (dataTable.Rows[iRow][jColumn] != dataTable.Rows[iRow - 1][jColumn]){
                            var vLine = document.createElement("vLine");
                            vLine.setAttribute("color",getAColor(0, 0, 0));

                            if (jColumn > 0){
                                vLine.setAttribute("dashed" , "1");
                                vLine.setAttribute("dashLen" , jColumn  * 8);
                                vLine.setAttribute("dashGap" ,  jColumn * 5);
                                vLine.setAttribute("alpha" ,  30 + 100 - (jColumn * 100 / lastSelectedDimensionColumn));
                            }
                            vLine.setAttribute("thickness" , (m_SeparatorColumns - jColumn));
                            categories.appendChild(vLine);
                            break;
                        }
                    }
                }
            }

            var category = document.createElement("category");
            if (dataTable.Rows[iRow][lastSelectedDimensionColumn]){
                category.setAttribute("name", dataTable.Rows[iRow][lastSelectedDimensionColumn]);
                category.setAttribute("hoverText", dataTable.Rows[iRow][lastSelectedDimensionColumn]);
            }
            else{
                category.setAttribute("name", ' ');
            }
            categories.appendChild(category);
        }
        //alert(categories.outerHTML);
        chart.appendChild(categories);

        //Build Datasets, every measure column
        for (var jColumn = lastSelectedDimensionColumn+1; jColumn < dataTable.Columns.length; jColumn++){
            var dataset = document.createElement("dataset");		
            dataset.setAttribute("seriesname", getFriendlyName(dataTable.Columns[jColumn].ColumnName) );
            dataset.setAttribute("showValue", "1");
            //var iColor = 256 * jColumn/lastSelectedDimensionColumn;
            //dataset.setAttribute("color", getAColor(iColor, iColor, iColor));
            
            for (var iRow = 0; iRow < dataTable.Rows.length; iRow++){
                var setvalue = document.createElement("set");
                if (dataTable.Rows[iRow][jColumn]){
                    //setvalue.setAttribute("value", dataTable.Rows[iRow][jColumn]);
                    var sValue = dataTable.Rows[iRow][jColumn];
                    sValue = sValue.replace(',', '.');
                    setvalue.setAttribute("value", sValue);
                }
                else
                    setvalue.setAttribute("value", ' ');
                setvalue.setAttribute("link", "javascript:zoom(" + jColumn + ");");
                
                var sTip = getFullName(dataTable, lastSelectedDimensionColumn, jColumn, iRow);
                setvalue.setAttribute("toolText" , sTip);
                
                dataset.appendChild(setvalue);
            }
            chart.appendChild(dataset);
        }
                                
        var caption = getFullTitle(dataTable, lastSelectedDimensionColumn, ' - '); //+ getFriendlyName(dataTable.Columns[dataTable.ExtendedProperties["LastSelectedDimension"]].ColumnName);
        if(dataTable.ExtendedProperties["QFCaption"].length > 0)
            chart.setAttribute("caption", dataTable.ExtendedProperties["QFCaption"]);
        chart.setAttribute("subcaption", caption);
        

        chart.setAttribute("showValues", "0");
        chart.setAttribute("palette", "1");
        chart.setAttribute("bgColor", "FFFFFF,FFFFFF");
        chart.setAttribute("canvasBgColor", "FFFFFF,FFFFFF");
        chart.setAttribute("canvasBaseColor", "FFFFFF,FFFFFF");

        chart.setAttribute("legendBgColor", "FFFFFF");
        chart.setAttribute("useRoundEdges", "1");
        chart.setAttribute("legendBorderAlpha", "0");
        

        chart.setAttribute('numVDivlines', dataTable.Rows.length - 1);
        chart.setAttribute('lineThickness', '2');
         chart.setAttribute('xAxisName', getFriendlyName(dataTable.Columns[dataTable.ExtendedProperties["LastSelectedDimension"]].ColumnName));
        
        
        
        //fix for displaying labels
        if (dataTable.Rows.length > 10 && dataTable.Rows.length <= 30){ //labelDisplay='ROTATE' - 'Stagger'   slantLabels='1' 
            chart.setAttribute("labelDisplay", "ROTATE");
            chart.setAttribute("slantLabels", "1");
        }

        div.appendChild(chart);
        div.setAttribute("id", "mainchartXML");
        return div;
    }
    catch (Exception)
    {
        return "";
    }
}

// get the datatable like an xml document for fusioncharts input in  Single Series charts
function GetDataColumnAsXML(dataTable, column)
{
    try
    {
        var div = document.createElement("div");

        //Generate the XML data for it
        var chart = document.createElement("chart");
        var lastSelectedDimensionColumn = parseInt(dataTable.ExtendedProperties["LastSelectedDimension"]);

        var fSum = 0.0;
        for (var iRow = 0; iRow < dataTable.Rows.length; iRow++){
            if (!isNaN(parseFloat(dataTable.Rows[iRow][column])))
                fSum = fSum + parseFloat(dataTable.Rows[iRow][column]);
        }

        //Build Dataset, for the measure 
        for (var iRow = 0; iRow < dataTable.Rows.length; iRow++){
            var setvalue = document.createElement("set");
        
            if (dataTable.Rows[iRow][column]){
                //setvalue.setAttribute("value", dataTable.Rows[iRow][column]);					
                var sValue = dataTable.Rows[iRow][column];
                sValue = sValue.replace(',', '.');
                setvalue.setAttribute("value", sValue);
                
                if (dataTable.Rows[iRow][lastSelectedDimensionColumn]){
                    setvalue.setAttribute("label", dataTable.Rows[iRow][lastSelectedDimensionColumn] );
                }
                else
                    setvalue.setAttribute("label", ' ');
                
                var sTip = getFullName(dataTable, lastSelectedDimensionColumn, column, iRow);
                if (!isNaN(parseFloat(dataTable.Rows[iRow][column])))
                    sTip = sTip + "\n" + (parseFloat(dataTable.Rows[iRow][column]) * 100 / fSum).toFixed(2) + " %25";
                    
                setvalue.setAttribute("toolText", sTip );
            }
            
            chart.appendChild(setvalue);
        }
        //chart.setAttribute("caption", getFriendlyName( dataTable.Columns[column].ColumnName ));
        var sTitle = getFullTitle(dataTable, lastSelectedDimensionColumn) + "\n" + getFriendlyName( dataTable.Columns[column].ColumnName );
        chart.setAttribute("caption", sTitle);
        
        chart.setAttribute("palette", "1");
        chart.setAttribute("bgColor", "EBEBEB");
        chart.setAttribute("showPercentageValues", "1");
        chart.setAttribute("showPercentInToolTip", "1");
        chart.setAttribute("animation", "1");
        chart.setAttribute("formatNumberScale", "0");
        chart.setAttribute("pieSliceDepth", "10");
        chart.setAttribute("enableSmartLabels", "1");
        chart.setAttribute("use3DLighting", "1");
    
        //return chart;
        div.appendChild(chart);
        return div;
    }
    catch (Exception)
    {
        return "";
    }
}

function getFullName(dataTable, lastSelectedDimensionColumn, jColumn, iRow){
    var sFullName = "";
    for (var iColumn = 0; iColumn <= lastSelectedDimensionColumn; iColumn++){
        sFullName = sFullName + getFriendlyName(dataTable.Columns[iColumn].ColumnName) + ": " + dataTable.Rows[iRow][iColumn] + "\n";
    }
    sFullName = sFullName + getFriendlyName(dataTable.Columns[jColumn].ColumnName) +": " + dataTable.Rows[iRow][jColumn];
    return sFullName;
}

function getFullTitle(dataTable, lastSelectedDimensionColumn, sSeparator){
    var sFullTitle = "";
    if (!sSeparator)
        sSeparator = "\n";
    for (var iColumn = 0; iColumn <= lastSelectedDimensionColumn; iColumn++){
        sFullTitle = sFullTitle + getFriendlyName(dataTable.Columns[iColumn].ColumnName)  
        if (iColumn < lastSelectedDimensionColumn)
            sFullTitle = sFullTitle + sSeparator;
    }
    return sFullTitle;
}
	//Clicking on a column a new modal window is displayed to show the pie for the given column
	function zoom(column){
		var frm = document.getElementById("mainchartdiv");
		var div = document.getElementById(ZOOM_DIV + column);
		if (div){
			//check if window already exists
			var win = document.getElementById('window_id' + column);
			if (win)
				return;
			else{
				div.style.visibility = "hidden";
				div.style.display = "none";
			}
		}
		else{
			div = document.createElement("div");
			div.id = ZOOM_DIV + column;
			div.style.overflow="hidden";
			div.style.backgroundColor="#F0F0F0";
		}
		
		div.innerHTML = "";
		div.style.height = m_PieHeight + 100 + "px";
		div.style.width = m_PieWidth + 100 + "px";
		div.style.zIndex = 100;
		div.style.visibility = "visible";
		div.style.display = "block";
		frm.appendChild(div);

		var dataTable = getDataTable();
		var sTitle = column;

		ChartBuilderPie(dataTable).buildPie(div.id, sTitle, -20, false, true);
		
		ShowBAZoomWindow(sTitle , column, m_PieWidth + 100, m_PieHeight + 100);
	}

	//creates a new modal window to display the pie
	function ShowBAZoomWindow(sWindowTitle, iColumn, sWidth, sHeight, oAsyncMethod)
	{
			BADialog = new Window('window_id' + iColumn, { title: sWindowTitle, width:sWidth, height:sHeight , resizable: false, hideEffect:Element.hide, showEffect:Element.show, destroyOnClose: true});
			BADialog.setContent(ZOOM_DIV + iColumn, true, true);
			BADialog.showCenter(false);
			if (!addedObserver){
				addOnDestroyObserver();
				addedObserver = true;
			}
	}

	var addedObserver = false;
	function addOnDestroyObserver(){
				myObserver = {
					onDestroy: function(eventName, win) {
						var id = win.getId().replace(/window_id/,"");
						var div = document.getElementById(ZOOM_DIV + id);
						if (div){
							div.style.visibility = "hidden";
							div.style.display = "none";
							var objects = div.getElementsByTagName("OBJECT");
							for (var i=0; i < objects.length; i++) {
								objects[i].style.display = 'none';
								for (var x in objects[i]) {
									if (typeof objects[i][x] == 'function') {
										objects[i][x] = function(){};
									}
								}
							}
							div.innerHTML = "";
						}
					},
					onMaximize: function(eventName, self) {
						var id = self.element.id.replace(/window_id/,"");
						var chart = document.getElementById(ZOOM_DIV+id)
						chart.style.width = "100%";
						chart.style.height = "100%";
					}
				}
				Windows.addObserver(myObserver);
	}

	//if the last selected dimension is of the datetime type, then the default chart type must be set to line, for any other type it is set to Column3D
	function setDefaultChartType(){
		var dataTable = getDataTable();
		var sColumnName = dataTable.Columns[dataTable.ExtendedProperties["LastSelectedDimension"]].ColumnName;

		if (sColumnName.indexOf('_Y') > -1 || sColumnName.indexOf('_Q') > -1 || sColumnName.indexOf('_M') > -1 || sColumnName.indexOf('_D') > -1){
				m_DefaultChartType = TYPE_OF_CHARTS.lineSeries;
		}
		else{
				m_DefaultChartType = TYPE_OF_CHARTS.columnSeries;
		}
		
		
	}
	function getBarChart() {
		return m_ChartType ? m_ChartType : m_DefaultChartType;
	}
	function getPieChart() {
		return m_PieChartType;
	}
	
	/**
	 * Create a new chart with the default type
	 */
	function createChart(){
		setDefaultChartType();
		var data = JSON.parse(JSON.stringify(getDataTable()));
        var _chartType = getBarChart(),
            _fillArea= false;
		ChartBuilderLine(_chartType, _fillArea).buildChart(data);		
	}

	function createPieChart(){
		var data = JSON.parse(JSON.stringify(getDataTable()));
		var chartBuilderPie = ChartBuilderPie(data);			
		chartBuilderPie.buildCharts();	
	}

	function getDataTable(sData){
		if (!m_dataTable){
			m_dataTable = getNewDataTable(sData);
		}
		return m_dataTable;
	}

	function getNewDataTable(sData) {
		var dataTable = null;
	
		var expression = new RegExp(/(\r\n|\n|\r)/gm);
		var strDataNoSpaces = sData.replace(expression, "");
	
		dataTable = eval(" (" + strDataNoSpaces + ")");
		dataTable = replaceMonthNames(dataTable);
		dataTable = replaceDecimalPoint(dataTable);
		return dataTable;
	}

	//Change from a chart type to another
	function changeChartType(chartType, isArea){
		ChangeTab(0);
			
		if (!chartType)
			chartType = m_ChartType ? m_ChartType : m_DefaultChartType;
		else if (m_ChartType == chartType)
			return;
		m_ChartType = chartType;
		ChartBuilderLine(chartType, isArea).buildChart(getDataTable());
	}

	function changeLineChartType(chartType, isArea){
		ChangeTab(0);
		m_ChartType = chartType;
		ChartBuilderLine(chartType, isArea).buildChart(getDataTable());
	}

	//Change from a chart type to another
	function changePieChartType(chartType){
		ChangeTab(1);
		if (m_PieChartType == chartType)
			return;
		m_PieChartType = chartType;
		createPieChart();
	}

	//Creates a new pie chart for every column.

	//clear the container div
	function clearDiv(div){
		if (div){
			div.innerHTML = "";	
		}
	}

	//Builds the main chart XML
	function fillChartXML(iSeparatorColumns){
		//var xml = document.getElementById('debug');
		
		if(iSeparatorColumns)
			m_SeparatorColumns = iSeparatorColumns;

		var dataTable = getDataTable(document.frm.h_jsondata.value);
		var chartXML = GetDataTableAsXML(dataTable);

		var hidden = document.getElementById("h_mainchartXML");
		hidden.value = chartXML.innerHTML;
		hidden.value = hidden.value.replace(/\"/g,'\'');
		hidden.value = hidden.value.replace(/stylexx/g, "style");
		hidden.value = hidden.value.replace(/&amp;/g,'');
		

	}

	//Create the pie's xml for rendering on detail or zoom
	function fillPieChartsXML(){
			
		var dataTable = getDataTable(document.frm.h_jsondata.value);
		var lastSelectedDimension = parseInt(dataTable.ExtendedProperties["LastSelectedDimension"]);

		var dataContainer = document.getElementById("piedatadiv");
		clearDiv(dataContainer);
		
		
		for (var jColumn = lastSelectedDimension + 1; jColumn < dataTable.Columns.length; jColumn++){
			var measureData = GetDataColumnAsXML(dataTable, jColumn);

			var hiddenData = getOrCreateHidden("h_pie" + jColumn);
			hiddenData.value = measureData.innerHTML.replace(/\"/g,'\'');
			
			//The pie chart does not support this special characters
			hiddenData.value = hiddenData.value.replace(/Á/g,'');
			hiddenData.value = hiddenData.value.replace(/É/g,'');
			hiddenData.value = hiddenData.value.replace(/Í/g,'');
			hiddenData.value = hiddenData.value.replace(/Ó/g,'');
			hiddenData.value = hiddenData.value.replace(/Ú/g,'');
			hiddenData.value = hiddenData.value.replace(/Ã/g,'');
			hiddenData.value = hiddenData.value.replace(/Õ/g,'');
			hiddenData.value = hiddenData.value.replace(/Ç/g,'');
			hiddenData.value = hiddenData.value.replace(/&(?!#)/g, '');
			
			hiddenData.value = hiddenData.value.replace(/á/g,'');
			hiddenData.value = hiddenData.value.replace(/é/g,'');
			hiddenData.value = hiddenData.value.replace(/í/g,'');
			hiddenData.value = hiddenData.value.replace(/ó/g,'');
			hiddenData.value = hiddenData.value.replace(/ú/g,'');
			hiddenData.value = hiddenData.value.replace(/ã/g,'');
			hiddenData.value = hiddenData.value.replace(/õ/g,'');
			hiddenData.value = hiddenData.value.replace(/ç/g,'');

			dataContainer.appendChild(hiddenData);
		}

	}

	//for debugging purposes only
	function viewTableCode(griddiv){
			var tableCode = document.getElementById('tableRendered');
			tableCode.value = griddiv.innerHTML;
	}
	
	//for debugging purposes only
	function viewChartXML(){
			var tableCode = document.getElementById('tableRendered');
			var test = GetDataTableAsXML(getDataTable(document.frm.h_jsondata.value));

			var hidden = document.getElementById("h_mainchartXML");
			hidden.value = test.innerHTML;
			hidden.value = hidden.value.replace(/\"/g,'\'');
			tableCode.value = hidden.value;
	}

	function getOrCreateHidden(name){
		var hiddenData = document.getElementById(name);
		if (!hiddenData){
			hiddenData = document.createElement("input");
			hiddenData.type = "hidden";
			hiddenData.name = name;
			hiddenData.id = name;
			hiddenData.setAttribute("name", name);
			hiddenData.setAttribute("id", name);
		}
		return hiddenData;
	}

	//for debugging purposes only
	function viewPieChartsXML(){
			
		var dataTable = getDataTable(document.frm.h_jsondata.value);
		var lastSelectedDimension = parseInt(dataTable.ExtendedProperties["LastSelectedDimension"]);
				
		var dataContainer = document.getElementById("piedatadiv");
		clearDiv(dataContainer);
		
		
		for (var jColumn = lastSelectedDimension + 1; jColumn < dataTable.Columns.length; jColumn++){
			var measureData = GetDataColumnAsXML(dataTable, jColumn);

			var hiddenData = getOrCreateHidden("h_pie" + jColumn);
			hiddenData.value = measureData.innerHTML.replace(/\"/g,'\'');
			dataContainer.appendChild(hiddenData);				
		}
		
		//debug
		var tableCode = document.getElementById('tableRendered');
		tableCode.value = dataContainer.innerHTML;			
		//alert(dataContainer.innerHTML);
	}
	
	//gets a Color
	function getAColor(bg_red, bg_green, bg_blue){
		bg_RGB=NumToHexString(bg_red);
		bg_RGB+=NumToHexString(bg_green);
		bg_RGB+=NumToHexString(bg_blue);

		return bg_RGB;
	}
	
	//gets a Random Color
	function getColor(){
		var bg_red=Math.floor(256*Math.random());
		var bg_green=Math.floor(256*Math.random());
		var bg_blue=Math.floor(256*Math.random());

		bg_RGB=NumToHexString(bg_red);
		bg_RGB+=NumToHexString(bg_green);
		bg_RGB+=NumToHexString(bg_blue);

		return bg_RGB;
	}
	
	//converts a int number into his hex number representation
	function NumToHexString(hexnumber) {
		// takes a number as sole argument, returns the hex value.
		// the return value at leats two places long by adding zero
		//  NumToHexString(10)="0a".
		var hexstring="";
		var hexchar;
		var hexones;
		var i=0;

		hexnumber=Math.floor(hexnumber);
		while (hexnumber != 0) {
			i++;
			hexones=hexnumber % 16;
			hexnumber -= hexones;
			hexnumber /= 16;

			if (hexones>9) {
			if (hexones==10) hexchar="a";
			if (hexones==11) hexchar="b";
			if (hexones==12) hexchar="c";
			if (hexones==13) hexchar="d";
			if (hexones==14) hexchar="e";
			if (hexones==15) hexchar="f";
			}
			else hexchar=hexones;

			hexstring = hexchar + hexstring;
		}

		for (;i<2;i++) {
			hexstring="0"+hexstring;
		}

		return hexstring;
	}

	/**
	 * Add title to a chart
	 * @param {*} chart 
	 * @param {*} name 
	 */
	var _formatTitle = function(chart, name) {
		var title = chart.titles.create();
		title.align = "center";
        title.text = "[bold]" + name + "[/]";
		title.fontSize = 12;
		title.marginTop = 10;
	};
	
	var _formatSubTitle = function (chart, name) {
		var subTitle = chart.chartContainer.createChild(am4core.Label);
		subTitle.text = "[bold]" + name + "[/]";
		subTitle.fontSize = 12;
		subTitle.align = "center";
	}