
(function ($) {
    $.fn.iframeAutoHeight = function (options) {
        // set default option values
        var options = $.extend({
            heightOffset: 50
        }, options);

        // iterate over the matched elements passed to the plugin
        $(this).each(function () {
            // Check if browser is Opera or Safari(Webkit so Chrome as well)
            if ($.browser.safari || $.browser.opera) {
                // Start timer when loaded.
                var iframe = this;
                var delayedResize = function () {
                    resizeHeight(iframe);
                };
                setTimeout(delayedResize, 0);

                // Safari and Opera need a kick-start.
                var source = $(this).attr('src');
                $(this).attr('src', '');
                $(this).attr('src', source);
            }
            else {
                resizeHeight(this);
            }

            // resizeHeight
            function resizeHeight(iframe) {
                // Set inline style to equal the body height of the iframed content plus a little
                var newHeight = iframe.contentWindow.document.body.offsetHeight + options.heightOffset;
                iframe.style.height = newHeight + 'px';
            }

        }); // end
    }
})(jQuery);