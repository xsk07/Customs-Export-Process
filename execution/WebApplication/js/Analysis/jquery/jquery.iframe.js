

(function($) {

  $.fn.callInside = function(fx, args){
        if ($(this)[0].tagName.toLowerCase() != "iframe") return null;
        // Don't execute the code when the content window is not ready yet    
        if ($(this)[0].contentWindow == null)  return null;
      	
        // Check if the iframe is cross domain
        try {
            // Evals the content
            $(this)[0].contentWindow.args = args;
        } catch (e) {
            // If an exception is thrown here this is a cross domain access
            return null;
        }

        return $(this)[0].contentWindow.eval('args = window.args;insideFunction = ' + fx.toString() + '; insideFunction(args)');
  }

})(jQuery);
