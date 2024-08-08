

/* Plugin BizRep_Sw_DurationTrend_Single. 
 * Draws the Duration Trend report for the selcted stopwatch 

 * Use:
   ----
 * 1- Create an options object to customize behavior: ReportResult, ReportTemplatesDir, FlashChartsDir
 * 2- Apply plugin passing the options object      e.g: $(selector).BizRep_Sw_DurationTrend_Single(myOptions);
 
 */


(function($){   
  
    /* File name to get report html template */        
    var PLUGIN_TEMPLATE_FILE = "RepTpt_SwDurationTrend.aspx";

    /* Report name to be shown in error messages" */
    var PLUGIN_NAME = "Sw_DurationTrend_Single";


    $.fn.extend({    
           
        
        BizRep_Sw_DurationTrend_Single: function(options) {   
            
            
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
                    
                    //Convert duration minutes to working days
                    ConvertDurationUnits(oResultTable);
                    
                    //Get template element to be populated by report    
                    var oDivReportData = $(".ReportData", oContainer);

                    //Build chart options                    
                    var oChartOptions               = new Object();
                    oChartOptions.chartType         = "lines";
                    oChartOptions.dataTable         = oResultTable;
                    oChartOptions.showValuesInside  = true;
                    oChartOptions.width             = 750;
                    oChartOptions.height            = 270;
                    oChartOptions.chartDir          = options.FlashChartDir;
                    oChartOptions.maxCategories     = 15;
                    
                    
                    $(oDivReportData).bizagireportchart(oChartOptions);
                    
                }
                catch(errorMsg){
                    window.alert(options.PluginName + ": Error displaying report:\n" + errorMsg);
                }
            } 
            
            function ConvertDurationUnits(oResultTable){
                for(var iRow in oResultTable.rows){
                
                    var iDuration = parseInt(oResultTable.rows[iRow][1].value);
                    var iDuration_In_Days = iDuration /(60 * options.HoursDay);
                    iDuration_In_Days = iDuration_In_Days.toFixed(2);
                    oResultTable.rows[iRow][1].text = String(iDuration_In_Days);
                    oResultTable.rows[iRow][1].value = String(iDuration_In_Days);
                }
            }

        }   
    });   
       
})(jQuery);  

