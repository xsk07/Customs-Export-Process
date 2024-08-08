
/* Plugin bizagireportchart. 
* Draws a graphic report inside the objects returned by the selector.

* Use:
----
* 1- Create an options object and customize it according to your needs (chartType, dataTable, width, height, etc...)
Modify only what you need to be different, look at the ChartOptionsObject() function below
* 2- Apply plugin passing the options object      e.g: $(selector).bizagireportchart(myOptions);
 
 
* Note for plugin development:
---------------------------
*   Only pie charts are drawn using a single-series XML, so it's not necessary to specify if it's single or multi-series in the options object.
*/




(function ($) {


    $.fn.extend({


        bizagireportchart: function (options) {


            //Default configuration
            function ChartOptionsObject() {

                this.reportIndex = -1;          //Index to be packaged and sent to the chart click function
                this.chartType = "Pie";         //Case insensitive: "bars", "columns", "lines", "pie", "scrollColumns" or "area"
                this.dataTable = null;          //Datasource (Check analysis-util-table.js file)
                this.width = 250;               //Chart width
                this.height = 250;              //Chart height

                this.chartFileFunction = GetChartFileFromName; //(Opt) function to find chart file name (eg."Column2D.swf"). Function must receive chartType string.
                this.chartDir = "Charts";               //Chart files location (eg."./charts/Column2D.swf"). 

                this.showValuesInside = false;          //Show values inside chart
                this.showSeriesName = false;            //Show series name
                this.useCategorySeparator = false;      //Use vertical line between categories in non-pie charts

                this.maxCategories = -1;        //(Opt) Limit the number of categories displayed. "labelStep" is used to reduce category label count.
                this.catNameColumnIndex = 0;    //Column index in datatable to be used as category captions column
                this.catValueColumnIndex = 1;    //Column index in datatable to be used as category values column


                //JavaScript interaction
                this.onClickJSFunctionName = null; //(Opt)Function to call when chart is clicked. A JSON object with click information is sent to the function.

                //StackBar specific properties
                this.xAxisMaxValue = 10;

                //Pie specific properties
                this.pieRadius = -1;                //(Opt) Pie radius
                this.pieLabelDistance = -1;         //(Opt) Distance from pie center to each label
                this.pieShowPercentValues = true;   //Use smart algorithm for label positions
                this.pieUseSmartLabels = true;      //Use smart algorithm for label positions

                //Collections
                this.trendLines = [];       // [ {"lineCaption": "xxx", "lineValue":##},... ]. Horizontal lines in non-pie charts
                this.verticalLines = [];    // [ {"linePosition":##, "lineColor": "xxx", "lineThickness": ## },... ]. Vertical lines in non-pie charts
                this.seriesColors = [];     // [ "0a0a0a", ...]. Color string for each series in non-pie charts
                this.categoryColors = [];   // [ "0a0a0a", ...]. Color string for each category in non-pie charts , or colors for each pie slice in pie charts}

                //ChartName
                this.actualChartName = -1;
            }




            //Get flash file to be user
            function GetChartFileFromName(chartType) {

                switch (String(chartType).toLowerCase()) {
                    case "bars":
                        return "MSBar2D.swf";
                    case "columns":
                        return "ScrollColumn2D.swf";
                    case "lines":
                        return "MSLine.swf";
                    case "pie":
                        return "Pie3D.swf";
                    case "scrollColumns":
                        return "ScrollColumn2D.swf";
                    case "area":
                        return "MSArea.swf";
                    case "stackedbar":
                        return "StackedBar2D.swf";
                    default:
                        return "MSColumn3D.swf";
                }
            }


            //Set the default values
            var defaults = new ChartOptionsObject();
            var options = $.extend(defaults, options);


            //Main plugin container DIV. It will be created inside each match in the selector.
            var oContainer;
            var now = new Date();
            
    
            //Run report for each match in the selector
            return this.each(function () {
                var ticks = now.getTime();
                //Create main plugin container DIV as the only control inside the given selector.
                oContainer = $("<div id='"+options.actualChartName+"' class = 'BAChartDiv'> </div>");
                $(this).html(oContainer);

                //Draw
                DrawChart(oContainer);
            });



            //Draw FusionCharts
            function DrawChart(oContainer) {

                //Get draw parameters
                var sDir = options.chartDir;
                var sFile = options.chartFileFunction(options.chartType);
                var width = options.width;
                var height = options.height;

                //Remove (/) char at the end of chartDir, then append it only once
                while (sDir.lastIndexOf("/") == sDir.length - 1)
                    sDir = sDir.substring(sDir.length - 1);
                sDir += "/";

                //Draw 
                var sChartLocation = sDir + sFile;
                var oChart = new FusionCharts(sChartLocation, 'FusionCharts_' + oContainer.attr("id"), width, height, '0', '0');
                var sChartXML = GetChartXML().replace(/\"/g, "'");

                oChart.setDataXML(sChartXML);
                oChart.render(oContainer[0]);
            }



            //Generates XML for FusionCharts based on the "options" object values.
            //Pie charts use single series XML, other charts use multi-series XML.
            function GetChartXML() {

                var oDataTable = options.dataTable;

                if (!oDataTable)
                    throw ("datatable not supplied");

                var oChart = $("<chart></chart>");


                //Chart title
                if (oDataTable.extendedProperties && oDataTable.extendedProperties["caption"])
                    oChart.attr("caption", oDataTable.extendedProperties["caption"]);

                //Chart type
                var sChartType = options.chartType.toLowerCase();


                if (sChartType == "pie") {
                    //-------- pie chart specific configuration                 
                    ConfigurePieChartNode(oChart);
                    SetDataToPieChartNode(oChart);

                }
                else {
                    //-------- non-pie chart specific configuration 
                    ConfigureNonPieChartNode(oChart);
                    SetDataToNonPieChartNode(oChart);
                }


                var oReturnDiv = $("<div></div>");
                oReturnDiv.append(oChart);

                return oReturnDiv.html();
            }


            function ConfigurePieChartNode(oChart) {

                //First slice starts at 80º
                oChart.attr("startingAngle", '80');


                //By default do not use smart labels (save chart space)
                if (!options.pieUseSmartLabels)
                    oChart.attr("enableSmartLabels", '0');


                //Show percent values                        
                oChart.attr("showPercentValues", options.pieShowPercentValues ? '1' : '0');
                oChart.attr("showPercentInToolTip", options.pieShowPercentValues ? '0' : '1');


                //Label distance
                if (options.pieLabelDistance >= 0)
                    oChart.attr("labelDistance", options.pieLabelDistance);


                //Pie radius
                if (options.pieRadius >= 0)
                    oChart.attr("pieRadius", options.pieRadius);

            }

            function ConfigureNonPieChartNode(oChart) {

                var oDataTable = options.dataTable;

                //Adjust label-step if category count is too high
                if (options.maxCategories > 0) {
                    var nCategories = oDataTable.rows.length;
                    if (nCategories > options.maxCategories) {
                        var labelStep = nCategories / options.maxCategories;
                        labelStep = nCategories % options.maxCategories == 0 ? labelStep : labelStep + 1;
                        oChart.attr("labelStep", String(labelStep));
                    }
                }


                //Rounded edges for column/bar charts
                if (options.chartType == "scrollcolumns" || options.chartType == "columns" || options.chartType == "bars" || options.chartType == "stackedbar")
                    oChart.attr("useRoundEdges", "1");

                //Show x-axis label                     
                if (oDataTable.extendedProperties && oDataTable.extendedProperties["xAxisCaption"])
                    oChart.attr("xAxisName", oDataTable.extendedProperties["xAxisCaption"]);


                //Show y-axis label
                if (oDataTable.extendedProperties && oDataTable.extendedProperties["yAxisCaption"])
                    oChart.attr("yAxisName", oDataTable.extendedProperties["yAxisCaption"]);

                //Rotate labels when too many categories according to chart with
                if (oDataTable.rows.length > 0 && options.width / oDataTable.rows.length < 60) {
                    oChart.attr("labelDisplay", "Rotate");
                    oChart.attr("slantLabels", "1");
                }

                if (options.chartType == "stackedbar") {
                    oChart.attr("maxLabelWidthPercent", "20");
                    oChart.attr("adjustDiv", "0");
                    oChart.attr("showPercentInToolTip", "1");
                    oChart.attr("yAxisMinValue", "0");
                    oChart.attr("yAxisMaxValue", options.xAxisMaxValue);
                    oChart.attr("showLimits", "1");
                    oChart.attr("labelPadding", "20");
                    oChart.attr("showYAxisValues", "0");
                    oChart.attr("outCnvBaseFontSize", "12");
                    oChart.attr("canvasLeftMargin", "160");
                }


                //Enlarge right margin to avoid label trimming
                if (options.chartType == "lines" || options.chartType == "columns")
                    oChart.attr("chartRightMargin", "50");


                //Do not show value labels inside graph area
                if (!options.showValuesInside)
                    oChart.attr("showValues", "0");

            }



            function SetDataToPieChartNode(oChart) {

                var oDataTable = options.dataTable;

                for (var iRow = 0; iRow < oDataTable.rows.length; ++iRow) {
                    var dr = oDataTable.rows[iRow];

                    var oSet = $("<set/>");
                    oChart.append(oSet);

                    //Label, Value
                    oSet.attr("label", dr[options.catNameColumnIndex].text);
                    oSet.attr("value", dr[options.catValueColumnIndex].value);


                    //Color
                    if (options.categoryColors.length > 0)
                        oSet.attr("color", options.categoryColors[iRow % options.categoryColors.length]);


                    //Onclick javascript link
                    if (options.onClickJSFunctionName) {
                        var oClickParams = "{reportIndex : " + options.reportIndex + ", rowClicked : " + iRow + "}";
                        oSet.attr("link", "JavaScript:" + options.onClickJSFunctionName + "(" + oClickParams + ");");
                    }
                }
            }

            function SetDataToNonPieChartNode(oChart) {

                var oDataTable = options.dataTable;

                //Categories
                var oCategories = $("<categories></categories>");
                oChart.append(oCategories);

                var iCatNumber = 0;
                for (iCatNumber = 0; iCatNumber < oDataTable.rows.length; ++iCatNumber) {
                    var dr = oDataTable.rows[iCatNumber];

                    //Explicit vLines 
                    for (var iLineNumber = 0; iLineNumber < options.verticalLines.length; ++iLineNumber) {
                        if (options.verticalLines[iLineNumber].linePosition == iCatNumber) {
                            var oLine = $("<vLine dashed  ='1' dashLen = '10' dashGap = '5'/>");
                            oLine.attr("color", options.verticalLines[iLineNumber].lineColor);
                            oLine.attr("thickness", options.verticalLines[iLineNumber].lineThickness);
                            oCategories.append(oLine);
                        }
                    }

                    //Category separator vlines
                    if (iCatNumber > 0 && options.useCategorySeparator)
                        oCategories.append($("<vLine color='C6C6C6' thickness='1'/>"));


                    var oCat = $("<category/>");
                    categoryName = parseInvalidXmlCharacters(dr[options.catNameColumnIndex].text);
                    oCat.attr("label", categoryName);
                    oCategories.append(oCat);
                }


                //Final explicit vLines
                for (var iLineNumber = 0; iLineNumber < options.verticalLines.length; ++iLineNumber) {
                    if (options.verticalLines[iLineNumber].linePosition == iCatNumber) {
                        var oLine = $("<vLine dashed  ='1' dashLen = '10' dashGap = '5'/>");
                        oLine.attr("color", options.verticalLines[iLineNumber].lineColor);
                        oLine.attr("thickness", options.verticalLines[iLineNumber].lineThickness);
                        oCategories.append(oLine);
                    }
                }



                //Datasets                
                for (var iCol = 0; iCol < oDataTable.columns.length; ++iCol) {

                    // Don't draw invisible tables
                    if (oDataTable.columns[iCol].extendedProperties && oDataTable.columns[iCol].extendedProperties.visible && oDataTable.columns[iCol].extendedProperties.visible.toLowerCase() == "false")
                        continue;

                    //Do not use label column as data
                    if (iCol == options.catNameColumnIndex)
                        continue;

                    //DataSet (all row values for the iCol-th column)
                    var dc = oDataTable.columns[iCol];


                    var oDataSet = $("<dataset></dataset>");
                    oChart.append(oDataSet);


                    //Show series name (measure name)
                    if (options.showSeriesName)
                        oDataSet.attr("SeriesName", dc.caption.replace(/_/g, ' '));


                    //Show custom colors
                    if (options.seriesColors.length > 0)
                        oDataSet.attr("color", options.seriesColors[iCol % options.seriesColors.length]);

                    //Values for each member
                    for (var iRow = 0; iRow < oDataTable.rows.length; ++iRow) {
                        var dr = oDataTable.rows[iRow];
                        var oSet = $("<set/>");
                        oDataSet.append(oSet);


                        //Value
                        if (options.chartType == "stackedbar" && dr[iCol].value == '0') oSet.attr("value", "");
                        else oSet.attr("value", dr[iCol].value);

                        //Display Value
                        if (options.chartType == "stackedbar" && dr[iCol].text == '0') oSet.attr("displayValue", "");
                        else oSet.attr("displayValue", dr[iCol].text);

                        //Color
                        if (options.categoryColors.length > 0)
                            oSet.attr("color", options.categoryColors[iRow % options.categoryColors.length]);


                        //Onclick javascript link
                        if (options.onClickJSFunctionName) {
                            var oClickParams = "{reportIndex : " + options.reportIndex + ", rowClicked : " + iRow + ", colClicked:" + iCol + ", chartName:" + options.actualChartName + "}";
                            oSet.attr("link", "JavaScript:" + options.onClickJSFunctionName + "(" + oClickParams + ");");
                        }
                    }
                }
            } //End method

            //This function verifies that the name in the categories have no invalid chars like & or > or <
            function parseInvalidXmlCharacters(text){
                text = text.replace("&","and");
                text = text.replace("<"," ");
                text = text.replace(">"," ");
                text = text.replace("'"," ");
                return text;
            }

        } //End Plugin
    });

})(jQuery);  