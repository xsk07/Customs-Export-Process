$.Class.extend("bizagi.webpart.services.iframeCommunicator", {}, {

    init: function (webpartContext) {
        this.webpartContext = webpartContext;
    },
    addCommListeners: function(iframeCommunicationListeners, applyExternalStyle, externalThemeCssUrl) {
        var self = this;

        if(applyExternalStyle){
            self.externalThemeCssUrl = externalThemeCssUrl;
            iframeCommunicationListeners["theme-initialize"] = {
                runBefore: function() {
                    bizagi.iframeCommunicator.trigger("awaiting-theme");
                },
                then: self.loadExternalThemeStyles
            };
        }

        $.each(iframeCommunicationListeners, function(key, value) {
            self.addIframeCommunicationListener(key, {
                runBefore: (value.runBefore ? value.runBefore : undefined),
                then: (value.then ? value.then : function(){})
            });
        });
    },
    addIframeCommunicationListener: function (eventName, callbacks) {
        var self = this;
        if (callbacks.runBefore) {
            callbacks.runBefore();
        }
        if (!bizagi.iframeCommunicator.subscribers[eventName]) {
            bizagi.iframeCommunicator.subscribe(eventName, function (params) {
                if (params.sitesEl) {
                    $.ajaxSetup({
                        headers: {
                            'Authorization': location.search.match(/sitesEl=([^&]*)/) ? "Bearer " + ((location.search.match(/sitesEl=([^&]*)/))[0].split("="))[1] : ''
                        }
                    });
                }

                var thenCallback = params.event === "theme-initialize" ? callbacks.then.bind(self) : callbacks.then.bind(self.webpartContext);
                thenCallback(params);
            });
        } 
    },
    loadExternalThemeStyles: function (e) {
        var self = this;
        self.externalStyle = e.message;
        self.readExternalTheme(e.message);
    },
    readExternalTheme: function (theme) {
        var self = this;

        // Apply external styles to custom override theme
        $.ajax({ url: self.externalThemeCssUrl, dataType: "text" })
            .done(function (text) {
                var processedVars = ""
                for (name in theme) {
                    processedVars += ((name.slice(0, 1) === '@') ? '' : '@') + name + ': ' +
                        ((theme[name].slice(-1) === ';') ? theme[name] : theme[name] + ';');
                }
                less.render(text + processedVars, function(err, processedCss) {
                    if (!err) {
                        self.createDynamicStyleSheet(processedCss.css);
                    }
                });
            });
    },
    createDynamicStyleSheet: function (styles) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = styles;
        document.getElementsByTagName('head')[0].appendChild(style);
    }
});