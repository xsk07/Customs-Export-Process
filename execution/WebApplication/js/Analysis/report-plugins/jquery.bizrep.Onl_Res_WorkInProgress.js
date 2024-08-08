
/* Plugin BizRep_Count_Summary_Resources. 
* Draws the Summary report for all Resurces in the given activity

* Use:
----
* 1- Create an options object to customize behavior: ReportResult, ReportTemplatesDir, FlashChartsDir, HoursDay 
* 2- Apply plugin passing the options object      e.g: $(selector).Onl_Res_WorkInProgress(myOptions);
 
*/

(function ($) {

    /* File name to get report html template */
    var PLUGIN_TEMPLATE_FILE = "Rep_Tpt_UsrResourcesSummary.aspx";

    /* Report name to be shown in error messages" */
    var PLUGIN_NAME = "Onl_Res_WorkInProgress";


    $.fn.extend({


        BizRep_Onl_Res_WorkInProgress: function (options) {


            //Set default values
            var defaults = {
                ReportResult: null,
                ReportTemplatesDir: './ReportTemplates',
                FlashChartDir: './Charts',
                HoursDay: 8,
                PluginTemplateFileName: PLUGIN_TEMPLATE_FILE,
                PluginName: PLUGIN_NAME
            };


            var options = $.extend(defaults, options);


            //Main plugin container DIV. It will be created inside each match in the selector.
            var oContainer;



            //Run report for each match in the selector
            return this.each(function () {

                //Create first parameter configuration, using plugin arguments and/or default values.
                InitStatusData();

                //Create main plugin container DIV as the only control inside the given selector.
                var sTemplateUrl = options.ReportTemplatesDir + '/' + options.PluginTemplateFileName;

                //Main container will be a DIV tag
                oContainer = $("<div></div>")
                   ;

                $(this).html(oContainer);

                oContainer.load(sTemplateUrl,
                //Once loaded populate controls inside the page
                    function () {
                        InitControls();
                        RefreshReport();
                    }
                );

            });



            //---------------------------------------------- Create first parameter configuration, using plugin arguments and/or default values.
            function InitStatusData() {
                //Defaults
            }



            //---------------------------------------------- Populate container with necessary html and initialize controls
            function InitControls() {
                ApplyTooltipDescription($(".ReportHeader", oContainer));
            }



            //---------------------------------------------- Repaint report.
            function RefreshReport() {

                if (options.ReportResult == null)
                    window.alert(options.PluginName + ": ReportResult was not set. No data to show.");
                else
                    DrawReport(options.ReportResult);
            }


            //---------------------------------------------- Fill template with report result data
            function DrawReport(oJsonResult) {

                if (oJsonResult.ERROR != null) {
                    window.alert(options.PluginName + ": Server error getting report:\n" + oJsonResult.ERROR);
                    return;
                }

                try {

                    //Get result table
                    var oResultTable = oJsonResult.resultTable;


                    //Get the DOM object displaying the result table
                    var oPrintedTable = getReportTables(oResultTable, true/*Draw column names*/);

                    //Add export to Excel link    
                    var oDivReportName = $(".ReportDataExcel", oContainer);
                    applyExcelLinkWithPrintableColumns(oDivReportName, options);

                    //Get template element to be populated by report    
                    var oDivReportData = $(".ReportData", oContainer);

                    oDivReportData.html(oPrintedTable);

                }
                catch (errorMsg) {
                    window.alert(options.PluginName + ": Error displaying report:\n" + errorMsg);
                }
            }

            /*---------------------------------------------------------------------------
            // This function extends the funcionality of the GetReportTable allowing to 
            // draw diferent tables per user
            ----------------------------------------------------------------------------*/
            function getReportTables(srcTable, bDrawColumnNames) {

                var xAxisCaptionString = $("#userNameLabel").text();
                var yAxisCaptionString = $("#countCaseLabel").text();
                var tskColumnIndex = GetTableColumnIndex(srcTable, "idTask", false);
                var tskColumnName = GetTableColumnIndex(srcTable, "tskDisplayName", false);

                var usedTasks = [];
                // Create a list of users without duplicates
                $.each(srcTable.rows, function () {
                    if (usedTasks.length == 0)
                        usedTasks.push(this[tskColumnIndex].value);
                    else if ($.inArray(this[tskColumnIndex].value, usedTasks) == -1)
                        usedTasks.push(this[tskColumnIndex].value);
                });

                var maxValueInTable = getTableMaxValue(srcTable);
                srcTable = setUserNameToLongestOne(srcTable);
                //srcTable = getTableFormattedNames(srcTable);

                //Creates the Container Table for the report
                var oRow, oCell;

                //Create table structure
                var oTable = $("<table></table>");
                var oTHead = $("<thead></thead>");
                var oTBody = $("<tbody></tbody>");
                $("body").data(options.PluginName, options);

                oTable.append(oTHead);
                oTable.append(oTBody);
                oTable.css({ 'style': { 'text-align': 'left'} });

                for (var usedTaskIndex = 0; usedTaskIndex < usedTasks.length; usedTaskIndex++) {

                    oRow = $("<tr></tr>");
                    oRow.css("width", "100%");
                    oTBody.append(oRow);

                    var srcTableByUser = $.extend(true, {}, srcTable);
                    var indexesToDelete = [];
                    $.each(srcTableByUser.rows, function (index) {
                        if (srcTableByUser.rows[index][tskColumnIndex].value != usedTasks[usedTaskIndex])
                            indexesToDelete.push(index);
                    });
                    $.each(indexesToDelete, function (index, value) {
                        srcTableByUser.rows.splice(value - index, 1);
                    });

                    var oCellGraph = $("<td></td>");
                    oCellGraph.css("width", "100%");
                    var oCellGraphContent = $("<div id='" + usedTasks[usedTaskIndex] + "Graph'></div>").css({
                        'display': 'inline-block'
                    });

                    var oDivReportDataChart = $(oCellGraphContent, oContainer);
                    $("body").data(options.PluginName + usedTasks[usedTaskIndex], srcTableByUser);

                    srcTableByUser.columns[tskColumnIndex].extendedProperties = $.extend({}, srcTableByUser.columns[tskColumnIndex].extendedProperties, { 'visible': 'false' });

                    var taskDisplayName = srcTableByUser.rows[0][tskColumnName].text;

                    srcTableByUser.extendedProperties = $.extend({}, srcTableByUser.extendedProperties, { 'xAxisCaption': xAxisCaptionString });
                    srcTableByUser.extendedProperties = $.extend({}, srcTableByUser.extendedProperties, { 'yAxisCaption': yAxisCaptionString });
                    srcTableByUser.extendedProperties = $.extend({}, srcTableByUser.extendedProperties, { 'caption': taskDisplayName });
                    var numRows = srcTableByUser.rows.length;
                    var barHeight = 50;
                    var charHeight = 220 + (numRows * barHeight);

                    //Build chart options                    
                    var oChartOptions = new Object();                    
                    //oChartOptions.chartType = "stackedbar";
                    oChartOptions.chartType = "bar";
                    oChartOptions.dataTable = srcTableByUser;
                    oChartOptions.showValuesInside = true;
                    oChartOptions.showSeriesName = true;
                    oChartOptions.useCategorySeparator = true;
                    oChartOptions.width = 800;
                    oChartOptions.height = charHeight;
                    oChartOptions.chartDir = options.FlashChartDir;
                    oChartOptions.maxCategories = 15;
                    oChartOptions.actualChartName = usedTasks[usedTaskIndex];
                    //Use a function defined inside the html template as callback
                    oChartOptions.onClickJSFunctionName = "ChartClicked";
                    oChartOptions.seriesColors = ["#61B329", "#FFB00F", "#FF4040", "#FFFFFF"];
                    oChartOptions.xAxisMaxValue = maxValueInTable + 2;
                    oChartOptions.renderTo = oCellGraphContent[0];
                    oChartOptions.chartTitle = taskDisplayName;
                    oChartOptions.stackOption = 'normal';
                    oChartOptions.clickSeries = true;
                    oChartOptions.reportIndex  = -1;
                    oChartOptions.barHeight = barHeight;
                    oChartOptions.marginLeft = 150;
                    oChartOptions.marginRight = 50;


                    $(oDivReportDataChart).bizagiHighchartReport(oChartOptions);

                    oCellGraph.append(oCellGraphContent);
                    oRow.append(oCellGraph);
                }

                return oTable;
            }

            function getTableMaxValue(srcTable) {
                var acumValue = 0;
                var indexOfOverdue = GetTableColumnIndex(srcTable, "overdue", false);
                var indexOfOntime = GetTableColumnIndex(srcTable, "ontime", false);
                var indexOfOnrisk = GetTableColumnIndex(srcTable, "onrisk", false);

                $.each(srcTable.rows, function (index) {
                    var sumTotal = parseInt(srcTable.rows[index][indexOfOverdue].value) + parseInt(srcTable.rows[index][indexOfOntime].value) + parseInt(srcTable.rows[index][indexOfOnrisk].value);
                    if (sumTotal > acumValue)
                        acumValue = sumTotal;
                });
                return acumValue;
            }

            function getTableFormattedNames(srcTable) {
                var longestTaskName = 15;
                var indexOfUserName = GetTableColumnIndex(srcTable, "fullName", false);
                $.each(srcTable.rows, function (index) {
                    var splitNames = srcTable.rows[index][indexOfUserName].text.split(' ');
                    if (splitNames[0].length > 15)
                        srcTable.rows[index][indexOfUserName].text = splitNames[0].substr(0, 12) + "...";
                });
                return srcTable;
            }

            function setUserNameToLongestOne(srcTable){
                var longestTaskName = 0;
                var indexOfUserName = GetTableColumnIndex(srcTable, "fullName", false);
                longestTaskName = srcTable.rows[0][indexOfUserName].text.length;
                $.each(srcTable.rows, function (index) {
                    if (longestTaskName<srcTable.rows[index][indexOfUserName].text.length){
                        longestTaskName = srcTable.rows[index][indexOfUserName].text.length;
                    }
                });
                $.each(srcTable.rows, function (index){
                    var result = longestTaskName-srcTable.rows[index][indexOfUserName].text.length;
                    if(result > 0){
                        srcTable.rows[index][indexOfUserName].text = srcTable.rows[index][indexOfUserName].text + new Array(result).join(' ');
                        srcTable.rows[index][indexOfUserName].value = srcTable.rows[index][indexOfUserName].value + new Array(result).join(' ');
                    }
                });
                return srcTable;
            }

            function applyExcelLinkWithPrintableColumns(oDivReportName, options) {
                var resultTable = options.ReportResult.resultTable;
                var tskColumnIndex = GetTableColumnIndex(resultTable, "tskDisplayName", false);

                resultTable.columns[tskColumnIndex].extendedProperties = $.extend({}, resultTable.columns[tskColumnIndex].extendedProperties, { 'visible': 'true' });

                options.ReportResult.resultTable = resultTable;
                ApplyExcelLink(oDivReportName, options);
            }
        },

        //-------------------------------------------------------------------------------------
        //Show detail list by using options data stored by the BizRep_Count_Instances plugin
        //-------------------------------------------------------------------------------------

        BizRep_Onl_Res_WorkInProgress_ChartClick: function (clickParams  /* {reportIndex, rowClicked, colClicked} */) {


            var optionsChart = $("body").data(PLUGIN_NAME);
            var chartDataSelected = $("body").data(PLUGIN_NAME + clickParams.chartName);

            var iduserColumnIndex = GetTableColumnIndex(optionsChart.ReportResult.resultTable, "iduser", false);
            var idTaskColumnIndex = GetTableColumnIndex(optionsChart.ReportResult.resultTable, "idTask", false);
            var idTask = chartDataSelected.rows[clickParams.rowClicked][idTaskColumnIndex].value;
            var selectedUserId = chartDataSelected.rows[clickParams.rowClicked][iduserColumnIndex].value;
            var columnSelected = chartDataSelected.columns[clickParams.colClicked].columnName;

            //Create parameter object
            var oParams = {
                taskId: idTask,
                ReportId: optionsChart.ReportId,
                userFilters: optionsChart.GlobalParameters.userFiltersString,
                columnName: columnSelected,
                currentUserId: selectedUserId,
                ReportSetId: ReportSetId,
                history: 0
            };

            ShowAnalysisDetailList(oParams);
        }
    });

})(jQuery);  