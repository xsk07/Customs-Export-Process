$.Class.extend("bizagi.automatictesting.state", {
    
    startRecording: function () {
        sessionStorage.setItem("bizagiAutoTestingRecording", true);
    },

    isRecording: function () {
        var recording = sessionStorage.getItem("bizagiAutoTestingRecording");
        return recording === "true";
    },

    stopRecording: function () {
        sessionStorage.setItem("bizagiAutoTestingRecording", false);
    },

    setRecordedRequests: function (requests) {
        sessionStorage.setItem("bizagiAutoTestingRecordedRequests", requests);
    },

    removeRecordedRequests: function () {
        sessionStorage.removeItem("bizagiAutoTestingRecordedRequests");
    },

    getRecordedRequests: function () {
        var requests = sessionStorage.getItem("bizagiAutoTestingRecordedRequests");
        return requests == null || requests === "" ? [] : JSON.parse(requests);
    },

    isAdvancing: function () {
        var advancing = sessionStorage.getItem("bizagiAutoTestingIsAdvancing");
        return advancing === "true";
    },

    setIsAdvancing: function () {
        sessionStorage.setItem("bizagiAutoTestingIsAdvancing", true);
    },

    removeIsAdvancing: function () {
        sessionStorage.removeItem("bizagiAutoTestingIsAdvancing");
    },

    resetState: function () {
        sessionStorage.removeItem("bizagiAutoTestingRecordedRequests");
        sessionStorage.setItem("bizagiAutoTestingRecording", false);
        sessionStorage.removeItem("bizagiAutoTestingIsAdvancing");
    },

    getUser: function () {
        return sessionStorage.getItem("bizagiAutoTestingUser");
    },
    
    getPassword :function () {
        return sessionStorage.getItem("bizagiAutoTestingPassword");
    },
    
    getDomain :function () {
        return sessionStorage.getItem("bizagiAutoTestingDomain");
    },
    
    setLogin: function (user, password, domain) {
        sessionStorage.setItem("bizagiAutoTestingUser", user);
        sessionStorage.setItem("bizagiAutoTestingPassword", password);
        sessionStorage.setItem("bizagiAutoTestingDomain", domain);
    }, 

    setQuickLogin: function (user, domain) {
        sessionStorage.setItem("bizagiAutoTestingUser", user);
        sessionStorage.setItem("bizagiAutoTestingDomain", domain);
    },

    getContextObject: function() {
        var ctx = sessionStorage.getItem("bizagiAutoTestingContext") || "{}";
        var s = JSON.parse(ctx);
        return s;
    }, 

    setContextObject: function(obj) {
        sessionStorage.setItem("bizagiAutoTestingContext", JSON.stringify(obj));
    },

    getContextValue: function(name) {
        var ctx = bizagi.automatictesting.state.getContextObject();
        return ctx[name];
    },
    
    setContextValue: function (name, value) {
        var ctx = bizagi.automatictesting.state.getContextObject();
        ctx[name] = value;
        this.setContextObject(ctx);
    }, 
}, {});