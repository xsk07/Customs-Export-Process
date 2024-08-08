/*
*   Name: BizAgi Theme Builder Services
*   Author: David Niño (based on Edward Morales and Diego Parra version)
*   Comments:
*   -   This class will provide a facade to access to workportal REST services
*/

$.Class.extend("bizagi.themebuilder.services.service", {}, {
    /*
    *   Constructor
    */
    init: function (params) {
        params = typeof (params) == "object" ? params : {};

        params.proxyPrefix = "../";

        this.serviceLocator = new bizagi.themebuilder.services.context(params);
    },
    /**
    * This method will return the url defined as endPoint using the parameter "endPoint" name
    */
    getUrl: function (params) {
        var self = this;
        var url = self.serviceLocator.getUrl(params.endPoint);
        return url;
    },

    /*
    *  Get Menu Authorization
    */
    getMenuAuthorization: function () {
        var self = this;

        return $.read(
                self.serviceLocator.getUrl("getMenuAuthorization")
                );
    },

    /**
    * This service get json of theme definition
    *@return {json} theme definition
    */
    getCurrentTheme: function () {
        var self = this;
        var url = self.serviceLocator.getUrl("getCurrentTheme");

        return $.read(url).pipe(function (data) {
            return data;
        });
    },

    /**
    * Get list of defined themes
    * @return {json} object with themes definicion
    */
    getAllThemes: function () {
        var self = this;
        var url = self.serviceLocator.getUrl("getAllThemes");

        return $.read(url).pipe(function (data) {
            return data;
        });
    },

    /*
    *
    */
    createTheme: function (params) {
        var self = this;
        var url = self.serviceLocator.getUrl("createTheme");
        var data = {};
        params = params || {};

        data.json = params || "";

        return $.create(url, data);
    },

    /*
    *
    */
    publishTheme: function (params) {
        var self = this;
        var url = self.serviceLocator.getUrl("publishTheme");
        var data = {};
        params = params || {};

        data.json = params.json || "";

        return $.update(url, data);
    },

    /*
    *
    */
    updateTheme: function (params) {
        var self = this;
        var url = self.serviceLocator.getUrl("updateTheme");
        var data = {};

        url = printf(url, params.id);

        data.json = params.json || "";

        return $.update(url, data);
    },

    /*
    *
    */
    deleteTheme: function (params) {
        var self = this;
        var url = self.serviceLocator.getUrl("deleteTheme");
        var data = {};
        params = params || {};

        url = printf(url, params.id);

        return $.destroy(url);
    },
    /*
    *converts an upoloaded image into base64 format
    */
    getImageData: function (selectedFile) {
        var self = this;
        var result = {};

        var def = new $.Deferred();

        //creates a post request to send the image file
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            //parses the json returned by the service
            var response = JSON.parse(xhr.responseText);
            result.isValid = response.isValid == true;
            result.messageCode = response.messageCode;
            result.data = response.fileData;

            //resolves the deferred
            def.resolve(result);
        };

        //posts the data to the service
        var url = self.serviceLocator.getUrl("getFileData");
        xhr.open("POST", url, true);
        xhr.setRequestHeader('X-BZXSRF-TOKEN', bizagi.getXSRFToken());
        //data form with the payload
        var formData = new FormData();
        formData.append("postedFile", selectedFile);
        xhr.send(formData);

        return def.promise();
    },    /*
    *converts an upoloaded image into base64 format
    */
    getImageDataFromIframe: function ($container, $uploadIframe_) {
        var self = this;
        var result = {};
        var def = new $.Deferred();

        var $uploadIframe = $container.find('#upload-iframe')
        var $uploadForm = $container.find('#upload-form');

        //submites the fom within the iframe
        $uploadForm.submit();

        //when the iframe is loaded
        $uploadIframe.unbind('load');
        $uploadIframe.load(function () {
            var responseText = $(this).contents().find('body').text();
            if ($.trim(responseText).length > 0) {
                //parses the json returned by the service
                var response = JSON.parse(responseText);

                result.isValid = response.isValid == true;
                result.messageCode = response.messageCode;
                result.data = response.fileData;

                //resolves the deffered indicating that the data has been loaded
                def.resolve(result);
            }
        });

        return def.promise();
    },

    /**
    * Get dummy json with themes definitions
    * @return {json} object with content of the theme.dummy.json file
    */
    getDummyThemes: function () {
        return $.ajax({
            dataType: "json",
            url: "libs/js/json/theme.dummy.json.js"
        }).pipe(function (data) {
            return data;
        });
    }
});
