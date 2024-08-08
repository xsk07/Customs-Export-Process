// Execute only if it is a webpart
if(typeof isWebpart != 'undefined' && isWebpart) {

    // Prefilter to add OAuth token if it is stored in session storage
    $.ajaxPrefilter(function (options, originalOptions, jqXHR) {

        // Add OAuth token if found in session storage
        if (sessionStorage.getItem('_AT_')) {
            
            var access_token = JSON.parse(decodeURIComponent(escape(window.atob(JSON.parse(sessionStorage.getItem('_AT_'))))));
            if (access_token) {
                jqXHR.setRequestHeader('Authorization', 'Bearer ' + access_token.accessToken);
            }
        }
    });

    // Prefilter to send post message to the webpart's parent when an ajax call is made within the webpart
    $.ajaxPrefilter(function (options, originalOptions, jqXHR) {
        
        // If the ajax call was successful
        jqXHR.done(function(result, status, xhr) {
            // Wait for communication between the iframe and it's parent to be established
            if (bizagi.iframeCommunicator) {
                bizagi.iframeCommunicator.trigger("ajax-call");
            }
        });
        
    });
}