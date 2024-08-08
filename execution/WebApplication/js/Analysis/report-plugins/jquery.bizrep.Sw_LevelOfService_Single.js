
/* Plugin BizRep_Sw_LevelOfService_Single. 
 * Draws the LevelOfService report for the selected stopwatch only.
 
 * - The PluginTemplateFileName and ReportName params are modified, then BizRep_Sw_LevelOfService plugin is applied

 * Use:
   ----
 * 1- Create an options object to customize behavior: ReportResult, ReportTemplatesDir, FlashChartsDir, HoursDay 
 * 2- Apply plugin passing the options object      e.g: $(selector).BizRep_Sw_LevelOfService_Single(myOptions);
 
 */

(function($){   
  
    /* File name to get report html template */        
    var PLUGIN_TEMPLATE_FILE = "RepTpt_SwLevelOfService.aspx?single=1";

    /* Report name to be shown in error messages" */
    var PLUGIN_NAME = "SwLevelOfService_Single";


    $.fn.extend({    
           
        
        BizRep_Sw_LevelOfService_Single: function(options) {   
            
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

            return $(this).BizRep_Sw_LevelOfService(options);
        }   
    });   
       
})(jQuery);  

