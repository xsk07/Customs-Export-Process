

/* Plugin BizRep_Count_Summary. 
 * Draws the Counters Summary report for all counters in the given process

 * Use:
   ----
 * 1- Create an options object to customize behavior: ReportResult, ReportTemplatesDir, FlashChartsDir, HoursDay 
 * 2- Apply plugin passing the options object      e.g: $(selector).BizRep_Count_Summary(myOptions);
 
 */


(function($){   
  
    /* File name to get report html template */        
    var PLUGIN_TEMPLATE_FILE = "Rep_Tpt_CounterSummary.aspx";

    /* Report name to be shown in error messages" */
    var PLUGIN_NAME = "Count_Summary";


    $.fn.extend({    
           
        
        BizRep_Count_Summary: function(options) {   
            
            
            //Set default values
            var defaults = { 
                    ReportResult : null,
                    ReportTemplatesDir : './ReportTemplates',
                    FlashChartDir : './Charts',
                    HoursDay : 8,
                    PluginTemplateFileName: PLUGIN_TEMPLATE_FILE,
                    PluginName: PLUGIN_NAME
                };   


            var options =  $.extend(defaults, options);   


            //Main plugin container DIV. It will be created inside each match in the selector.
            var oContainer;            
                        
                        
                        
            //Run report for each match in the selector
            return this.each(function(){

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
                    function (){
                        InitControls(); 
                        RefreshReport();
                    } 
                );                                        

            });
            
            
            
            //---------------------------------------------- Create first parameter configuration, using plugin arguments and/or default values.
            function InitStatusData(){
                //Defaults
            }
            
            
            
            //---------------------------------------------- Populate container with necessary html and initialize controls
            function InitControls(){
                ApplyTooltipDescription($(".ReportHeader", oContainer));
            }
            
                        
            
            //---------------------------------------------- Repaint report.
            function RefreshReport(){

                if(options.ReportResult == null)
                    window.alert(options.PluginName + ": ReportResult was not set. No data to show.");
                else
                    DrawReport(options.ReportResult);
            }
            
                
            //---------------------------------------------- Fill template with report result data
            function DrawReport(oJsonResult){
           
                if(oJsonResult.ERROR != null){
                    window.alert(options.PluginName + ": Server error getting report:\n" + oJsonResult.ERROR);
                    return;
                }
                                
                try{
                
                    //Get result table
                    var oResultTable = oJsonResult.resultTable;
                    
                    //Add "total cases" to description
                    FixDescription(oResultTable);
                    
                    //Format columns
                    FormatDurationColumns(oResultTable);

                    //Get the DOM object displaying the result table
                    var oPrintedTable = GetReportTable(oResultTable, true/*Draw column names*/);
                    
                    //Add detail links and drill-down links to printed table
                    AddTableDetailLinks(oResultTable, oPrintedTable);
                    
                    //Add export to Excel link    
                    var oDivReportName = $(".reportTitleBar", oContainer);
                    ApplyExcelLink(oDivReportName, options);
                    
                    //Get template element to be populated by report    
                    var oDivReportData = $(".ReportData", oContainer);

                    oDivReportData.html(oPrintedTable); 

                }
                catch(errorMsg){
                    window.alert(options.PluginName + ": Error displaying report:\n" + errorMsg);
                }
            } 
            
            //---------------------------------------------- Display Total cases properly
            
            function FixDescription(oResultTable){

                var iTotalCases     = parseInt(oResultTable.extendedProperties.totalCases);
                var sTotalCases     = $(".lblTotalCases", oContainer).html() + ": <b>" + iTotalCases + "</b>";
                
                $(".lblTotalCases", oContainer).html(sTotalCases);                
            }
            
            
            //---------------------------------------------- Format columns
            
            function FormatDurationColumns(oResultTable){
                
                //Duration columns                
                var iColumnPercent = GetTableColumnIndex(oResultTable, "percentFromTotalCases", false);
                
                
                //Apply format for all rows
                for (iRow=0; iRow < oResultTable.rows.length; iRow++)
                {
                    var iFraction   = parseFloat(oResultTable.rows[iRow][iColumnPercent].value);
                    var iPercentage = 100 * iFraction;
                    oResultTable.rows[iRow][iColumnPercent].text = iPercentage.toFixed(0) + "%";
                }                    
            }
            
            //---------------------------------------------- Add links to table
            
            function AddTableDetailLinks(oResultTable, oPrintedTable){ 

                //Detail list columns
                var idColumnIndex_Id        = GetTableColumnIndex(oResultTable, "counter", false /*count only visible columns*/);
                var idColumnIndex_Cases     = GetTableColumnIndex(oResultTable, "cases", true /*count only visible columns*/);
                

                               
                $("tr", oPrintedTable).each(function(index, oRow) {
                    if(index > 0 /* no link in column headers */){
                        
                        //Current stopwatch
                        var idCounter = parseInt(oResultTable.rows[index-1][idColumnIndex_Id].value);
                                                                        
                        //Create links
                        var oImgInstances = $("<div class='iconDetail'></div>");
                        
                        //Bind detail list function to the links          
                        oImgInstances.click(function(){ShowInstancesDetailList(idCounter);});
                        
                        $(oRow.cells[idColumnIndex_Cases]).append(oImgInstances);

                        //Drill down link
                        $(oRow.cells[idColumnIndex_Id]).click(function(){ DrillDown(idCounter); });
                        $(oRow.cells[idColumnIndex_Id]).addClass("linkText");
                    }    
                });
            }
            
            function DrillDown(sensorId){
                SelectSensorFromNodeId("node_counter_" + sensorId);
            }
            
            function ShowInstancesDetailList(idCounter){
                //Create parameter object
                var oParams =  { 
                                     counterId : idCounter,
                                     ReportId : options.ReportId,
                                     userFilters: options.GlobalParameters.userFiltersString,
                                     dtFrom: options.GlobalParameters.dateFrom,
                                     dtTo: options.GlobalParameters.dateTo,
                                     history:1
                                };
                                
                ShowAnalysisDetailList(oParams);
            }
            

        }   
    });   
       
})(jQuery);  

