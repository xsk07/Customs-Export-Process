var mainDialog = null;
var queryStringParams = bizagi.automatictesting.host.getQueryStringParams();
var recorderOptions = {
    userName: queryStringParams["userName"], 
    domain: queryStringParams["domain"], 
    allowQueryForms: queryStringParams["allowQF"] === "true",
    widget: queryStringParams["widget"],

};

if (window.location.protocol === "https:")
    bizagi.automatictesting.host.setRecorderHostUrl("https://localhost:8096/AutoTesting.svc/Recorder");
else
    bizagi.automatictesting.host.setRecorderHostUrl("http://localhost/AutoTesting.svc/Recorder");

var autotest = {};
autotest.getParams = function (input) {
    var i, pos, name, value,
        pairs = input.split("&"),
        l = pairs.length,
        result = {};

    for (i = 0; i < l; i++) {
        pos = pairs[i].indexOf("=");
        if (pos === -1) continue;

        name = pairs[i].substring(0, pos);
        value = pairs[i].substring(pos + 1);
        result[name] = unescape(value);
    }
    return result;
};

var recorder = new bizagi.automatictesting.recorder(recorderOptions);

function initAutoTesting(recorder) {
    recorder.render();

    /**
     * QAF-5129: Workaround for reloading recorder if 
     * there is no user activity after resetting web server.
     * The timeout waits 15 seconds and then tries to reload recorder
     */

    $(function () {
        var isVisible = function () {
            return $(".ui-dialog-titlebar span.ui-dialog-title:contains('Quick Login')").is(":visible");
        };
        var reloadIfNotVisible = function () {
            if (recorder.widget !== undefined) return;

            var quickLoginVisible = isVisible();
            if (!recorder.userActivityDetected && !quickLoginVisible) {
                console.log("No user response... Reloading");
                //window.location.reload();

                $("div#dialog-login").remove();
                $("div#dialog-upload").remove();
                $("div#dialog-soa").remove();
                $("div.bz-at-init-panel").remove();
                $("div.bz-at-recorder").remove();
                recorder.render();
                quickLoginVisible = isVisible();
                if (!quickLoginVisible)
                    $("#dialog-login").dialog("open");
            }
        };

        setTimeout(reloadIfNotVisible, 15000);
    });
};

bizagi.automatictesting.host.testService().done(function (result) { if (result) initAutoTesting(recorder); });
