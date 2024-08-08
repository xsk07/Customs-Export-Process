

/* Plugin BizRep_AbsoluteCount_Instances. 
 * Draws the Counters Instances report for all counters in the given process

 * Use:
   ----
 * 1- Create an options object to customize behavior: ReportResult, ReportTemplatesDir, FlashChartsDir, HoursDay 
 * 2- Apply plugin passing the options object      e.g: $(selector).BizRep_AbsoluteCount_Instances(myOptions);
 
 */


(function ($) {

    /* File name to get report html template */
    var PLUGIN_TEMPLATE_FILE = "Rep_Tpt_CounterInstances.aspx?absolute=1";

    /* Report name to be shown in error messages" */
    var PLUGIN_NAME = "Count_Instances_Absolute";

    $.fn.extend({


        BizRep_AbsoluteCount_Instances: function (options) {


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

                    //Get template element to be populated by report    
                    var oDivReportData = $(".ReportData", oContainer);

                    //Store options for use outside the plugin by the fusioncharts chart
                    $("body").data(options.PluginName, options);
                    
                    oResultTable = getFixedResultTable(oResultTable);

                    //Build chart options                    
                    var oChartOptions = new Object();
                    oChartOptions.chartType = "columns";
                    oChartOptions.dataTable = oResultTable;
                    oChartOptions.showValuesInside = true;
                    oChartOptions.width = 750;
                    oChartOptions.height = 270;
                    oChartOptions.chartDir = options.FlashChartDir;
                    oChartOptions.maxCategories = 15;


                    //Use a function defined inside the html template as callback
                    oChartOptions.onClickJSFunctionName = "ChartClicked_Absolute";

                    $(oDivReportData).bizagireportchart(oChartOptions);
                }
                catch (errorMsg) {
                    window.alert(options.PluginName + ": Error displaying report:\n" + errorMsg);
                }
            }

            function getFixedResultTable(oResultTable) {
                var oResult = oResultTable;
                for (var i = 0; i < oResult.rows.length; i++) {
                    oResult.rows[i].splice(0, 1);
                }
                oResult.columns.splice(0, 1);
                return oResult;
            }


        }
        ,


        //-------------------------------------------------------------------------------------
        //Show detail list by using options data stored by the BizRep_Count_Instances plugin
        //-------------------------------------------------------------------------------------

        BizRep_AbsoluteCount_Instances_ChartClick: function (clickParams  /* {reportIndex, rowClicked, colClicked} */) {


            var options = $("body").data(PLUGIN_NAME);

            var idCounter = options.ReportResult.resultTable.rows[clickParams.rowClicked][0].value;

            //Create parameter object
            var oParams = {
                counterId: idCounter,
                ReportId: options.ReportId,
                userFilters: options.GlobalParameters.userFiltersString,
                dtFrom: options.GlobalParameters.dateFrom,
                dtTo: options.GlobalParameters.dateTo,
                history: 1
            };

            ShowAnalysisDetailList(oParams);
        }


    });

})(jQuery);  


