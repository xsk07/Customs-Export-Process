
/* Plugin BizRep_Sw_CycleTimeSummary. 
 * Draws the Cycle_Time_Summary report for all stopwatches in the given process

 * Use:
   ----
 * 1- Create an options object to customize behavior: ReportResult, ReportTemplatesDir, FlashChartsDir, HoursDay 
 * 2- Apply plugin passing the options object      e.g: $(selector).BizRep_Sw_CycleTimeSummary(myOptions);
 
 */


(function($){   
  
    /* File name to get report html template */        
    var PLUGIN_TEMPLATE_FILE = "RepTpt_SwCycleTimeSummary.aspx";

    /* Report name to be shown in error messages" */
    var PLUGIN_NAME = "Sw_CycleTimeSummary";


    $.fn.extend({    
           
        
        BizRep_Sw_CycleTimeSummary: function(options) {   
            
            
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
            
            
            function FormatColumns(oResultTable){
            
                //Duration columns                
                var iColumnSLA    = GetTableColumnIndex(oResultTable, "SLA", false /*count only visible columns*/);
                var iColumnMinDur = GetTableColumnIndex(oResultTable, "mindur", false);
                var iColumnAvgDur = GetTableColumnIndex(oResultTable, "avgdur", false);
                var iColumnMaxDur = GetTableColumnIndex(oResultTable, "maxdur", false);
                var iColumnStDev  = GetTableColumnIndex(oResultTable, "stdev", false);

                var iColumnInstances = GetTableColumnIndex(oResultTable, "instances", false /*count only visible columns*/);
                var iColumnOntime    = GetTableColumnIndex(oResultTable, "ontime", false);
                var iColumnOverdue   = GetTableColumnIndex(oResultTable, "overdue", false);
                
                
                //Apply format for all rows
                for (iRow=0; iRow < oResultTable.rows.length; iRow++)
                {
                    //Format Duration columns
                    var iSLA    = parseInt(oResultTable.rows[iRow][iColumnSLA].value);
                    var iMinDur = parseInt(oResultTable.rows[iRow][iColumnMinDur].value);
                    var iMaxDur = parseInt(oResultTable.rows[iRow][iColumnMaxDur].value);
                    var iAvgDur = parseInt(oResultTable.rows[iRow][iColumnAvgDur].value);
                    var iStDev  = parseFloat(oResultTable.rows[iRow][iColumnStDev].value);
                    
                    oResultTable.rows[iRow][iColumnSLA].text    = GetDurationStringFromMinutes(iSLA, options.HoursDay);
                    oResultTable.rows[iRow][iColumnMinDur].text = GetDurationStringFromMinutes(iMinDur, options.HoursDay);
                    oResultTable.rows[iRow][iColumnAvgDur].text = GetDurationStringFromMinutes(iAvgDur, options.HoursDay);
                    oResultTable.rows[iRow][iColumnMaxDur].text = GetDurationStringFromMinutes(iMaxDur, options.HoursDay);


                    //Show percentages in ontime and overdue
                    var iTotalInstances = parseInt(oResultTable.rows[iRow][iColumnInstances].value);
                    var iOntime     = parseInt(oResultTable.rows[iRow][iColumnOntime].value);
                    var iOverdue    = parseInt(oResultTable.rows[iRow][iColumnOverdue].value);
                    
                    var iPercOntime     = iTotalInstances == 0 ? 0 : (iOntime / iTotalInstances * 100).toFixed(1);
                    var iPercOverdue    = iTotalInstances == 0 ? 0 : (iOverdue / iTotalInstances * 100).toFixed(1);
                        
                    
                    oResultTable.rows[iRow][iColumnOntime].text = iPercOntime + "%";
                    oResultTable.rows[iRow][iColumnOverdue].text = iPercOverdue + "%";


                    
                    //Stdev column in days
                    oResultTable.rows[iRow][iColumnStDev].text =  GetStDevInDays(iStDev).toFixed(4);
                }                    
            }
            
            
            
            //---------------------------------------------- Add links to table
            
            function AddTableDetailLinks(oResultTable, oPrintedTable){ 

                //Detail list columns
                var idColumnIndex_Id        = GetTableColumnIndex(oResultTable, "stopwatch", false /*count only visible columns*/);
                var idColumnIndex_Instances = GetTableColumnIndex(oResultTable, "instances", true /*count only visible columns*/);
                var idColumnIndex_Ontime    = GetTableColumnIndex(oResultTable, "ontime", true);
                var idColumnIndex_Overdue   = GetTableColumnIndex(oResultTable, "overdue", true);
                
                

                               
                $("tr", oPrintedTable).each(function(index, oRow) {
                    if(index > 0 /* no link in column headers */){
                        
                        //Current stopwatch
                        var idStopwatch = parseInt(oResultTable.rows[index-1][idColumnIndex_Id].value);
                                                                        
                        //Create links
                        var oImgInstances = $("<div class='iconDetail'></div>");
                        var oImgOntime = $("<div class='iconDetail'></div>");
                        var oImgOverdue = $("<div class='iconDetail'></div>");
                        
                        //Bind detail list function to the links          
                        oImgInstances.click(function(){ShowCycleTimeDetailList(idStopwatch, "instances");});
                        oImgOntime.click(function(){ShowCycleTimeDetailList(idStopwatch, "ontime");});
                        oImgOverdue.click(function(){ShowCycleTimeDetailList(idStopwatch, "overdue");});
                        
                        $(oRow.cells[idColumnIndex_Instances]).append(oImgInstances);
                        $(oRow.cells[idColumnIndex_Ontime]).append(oImgOntime);
                        $(oRow.cells[idColumnIndex_Overdue]).append(oImgOverdue);

                        //Drill down link
                        $(oRow.cells[idColumnIndex_Id]).click(function(){ DrillDown(idStopwatch); });
                        $(oRow.cells[idColumnIndex_Id]).addClass("linkText");
                    }    
                });
                
                
                
            }
            

            
            function DrillDown(sensorId){
                SelectSensorFromNodeId("node_stopwatch_" + sensorId);
            }
            
            function ShowCycleTimeDetailList(idStopwatch, columnName){
                //Create parameter object
                var oParams =  { 
                                     stopwatchId : idStopwatch,
                                     ReportId : options.ReportId,
                                     columnName : columnName,
                                     userFilters: options.GlobalParameters.userFiltersString,
                                     dtFrom: options.GlobalParameters.dateFrom,
                                     dtTo: options.GlobalParameters.dateTo,
                                     history:1
                                };
                                
                ShowAnalysisDetailList(oParams);
            }
            
            function GetStDevInDays(stDevInMinutes){
                var hoursDay = parseInt(options.HoursDay);
                var minutesDay = hoursDay * 60;
                
                var totalDays = stDevInMinutes / minutesDay;
                return totalDays;
            }


        }   
    });   
       
})(jQuery);  

