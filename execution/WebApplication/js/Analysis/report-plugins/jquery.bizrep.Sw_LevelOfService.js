/* Plugin BizRep_Sw_LevelOfServices. 
 * Draws the Level of Services report for all stopwatches in the given process

 * Use:
   ----
 * 1- Create an options object to customize behavior: ReportResult, ReportTemplatesDir, FlashChartsDir
 * 2- Apply plugin passing the options object      e.g: $(selector).BizRep_Sw_LevelOfService(myOptions);
 
 */


(function($){   
  
    /* File name to get report html template */        
    var PLUGIN_TEMPLATE_FILE = "RepTpt_SwLevelOfService.aspx";

    /* Report name to be shown in error messages" */
    var PLUGIN_NAME = "Sw_LevelOfServices";


    $.fn.extend({    
           
        
        BizRep_Sw_LevelOfService: function(options) {   
            
            
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
                    
                    //Format columns
                    FormatColumns(oResultTable);

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
            
            
            
            //---------------------------------------------- Format columns

            function FormatColumns(oResultTable){
                
                //Apply format for all rows
                for (iRow=0; iRow < oResultTable.rows.length; iRow++)
                {   
                    var iSum = 0;

                    //Obtain total instances per row
                    for(iCol = 0; iCol < oResultTable.columns.length; ++iCol){
                        if(oResultTable.columns[iCol].extendedProperties && oResultTable.columns[iCol].extendedProperties.units)
                            iSum += parseInt(oResultTable.rows[iRow][iCol].value);
                    }
                    
                    //assign percentages to cell text
                    for(iCol = 0; iCol < oResultTable.columns.length; ++iCol){
                        if(oResultTable.columns[iCol].extendedProperties && oResultTable.columns[iCol].extendedProperties.units){
                            var iPercent = iSum == 0 ? 0 : (parseInt(oResultTable.rows[iRow][iCol].value) / iSum * 100.0).toFixed(0);
                            oResultTable.rows[iRow][iCol].text = iPercent + "%";                            
                        }
                    }
                }               
            }
            
            //---------------------------------------------- Add links to table
            
            function AddTableDetailLinks(oResultTable, oPrintedTable){ 
                
                //Detail list columns
                var idColumnIndex = GetTableColumnIndex(oResultTable, "stopwatch", false /*count only visible columns*/);

                //Iterate over printed table rows
                $("tr", oPrintedTable).each(function(index, oRow) {
                    if(index > 0 /* no link in column headers */){

                        var idStopwatch = parseInt(oResultTable.rows[index-1][idColumnIndex].value);
                        
                        //Bind each cell in the row
                        $.each(oResultTable.columns, function(iCol, value) { 

                            if(oResultTable.columns[iCol].extendedProperties && oResultTable.columns[iCol].extendedProperties.units){
                                
                                var iUnits = parseInt(oResultTable.columns[iCol].extendedProperties.units);
                                
                                var iPrintedColumnIndex = GetPrintedTableColumnIndex(oResultTable, iCol);
                                
                                var oImgInstances = $("<div class='iconDetail'></div>");
                                oImgInstances.click(function(){ 
                                    ShowLevelOfServiceDetailList(idStopwatch, iUnits);
                                });

                                $(oRow.cells[iPrintedColumnIndex]).append(oImgInstances);                                
                            }
                            else{
                                //Drill down link
                                $(oRow.cells[idColumnIndex]).click(function(){ DrillDown(idStopwatch); });
                                $(oRow.cells[idColumnIndex]).addClass("linkText");
                            }                            
                        });

                    }    
                });
            }
            
            function DrillDown(sensorId){
                SelectSensorFromNodeId("node_stopwatch_" + sensorId);
            }

            function ShowLevelOfServiceDetailList(idStopwatch, iUnits){
                //Create parameter object
                var oParams =  { 
                                     stopwatchId : idStopwatch,
                                     ReportId : options.ReportId,
                                     units : iUnits,
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


