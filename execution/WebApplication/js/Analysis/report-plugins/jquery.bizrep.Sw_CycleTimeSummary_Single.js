

/* Plugin BizRep_Sw_CycleTimeSummary_Single. 
 * Draws the Cycle_Time_Summary report for the selected stopwatch only.
 
 * - The PluginTemplateFileName and ReportName params are modified, then BizRep_Sw_CycleTimeSummary plugin is applied

 * Use:
   ----
 * 1- Create an options object to customize behavior: ReportResult, ReportTemplatesDir, FlashChartsDir, HoursDay 
 * 2- Apply plugin passing the options object      e.g: $(selector).BizRep_Sw_CycleTimeSummary_Single(myOptions);
 
 */

(function($){   
  
    /* File name to get report html template */        
    var PLUGIN_TEMPLATE_FILE = "RepTpt_SwCycleTimeSummary.aspx?single=1";

    /* Report name to be shown in error messages" */
    var PLUGIN_NAME = "Sw_CycleTimeSummary_Single";


    $.fn.extend({    
           
        
        BizRep_Sw_CycleTimeSummary_Single: function(options) {   
            
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

            return $(this).BizRep_Sw_CycleTimeSummary(options);
        }   
    });   
       
})(jQuery);  

