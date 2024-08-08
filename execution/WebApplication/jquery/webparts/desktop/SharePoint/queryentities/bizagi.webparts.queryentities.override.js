/*
*   Name: BizAgi Workportal Query Entities Override Webpart
*   Author: Diego Parra
*   Comments:
*   -   This script will define a base class to all widgets
*/
bizagi.workportal.webparts.queryentities.extend("bizagi.workportal.webparts.queryentities", {}, {
    /*
    *   Executes a preconfigured action
    *   Any action used must be defined here in order to add behaviour
    */
    executeAction: function (params) {
        var self = this;
        if (params.action == "createCAF") {
            self.createNewAssetCase(1, params.idEntity);
        }
        else if (params.action == "viewLatestCAF") {
            self.showLastCAF(params.idEntity);
        }
    },
    /*
    *   Queries the server to get data for the webpart
    */
    fetchcCasesData: function (AssetInfoId) {
        var self = this;
        var params = {};
        var refreshData = params.refreshData;

        if (refreshData == false && self.data != null) {
            params.refreshData = true;
            return self.data;
        };
        var order = params.order || params.defaultOrder;
        var filter = '[{ "xpath":"I_IDWFCLASS", "value":"1"}, {"xpath":   "I_ProcessState", "value": "Running"},{"xpath": "CAFRequest.AssetInfo", "value": "' + AssetInfoId + '"}]';


        return self.dataService.queryCases({
            // Base params
            idWorkflow: 1,
            idTask: params.idTask,
            filter: filter,
            outputxpath: '["CAFRequest.AssetInfo.FirstName","RadNumber","CasCreationDate","CasSolutionDate","CAFRequest.AssetInfo.ProfilePicture"]',
            outputInternalColumns: params.outputInternalColumns,

            // Filter by favorites  only when we are searching all processes and favorites
            onlyFavorites: false,

            // Sort and order parameters
            order: order,
            orderType: (params.orderType || "0"),
            page: (params.page || 1)
        });
    },
    /*
    *   Creates a new case based on the selected process
    */
    showLastCAF: function (AssetInfoId) {
        var self = this;
        // Creates a new case
        $.when(self.fetchcCasesData(AssetInfoId)).done(function (data) {
            var idCase = null;
            var idWorkItem = null;
            if (data.cases.rows && data.cases.rows.length > 0) {
                idCase = data.cases.rows[0].id;
                if (data.cases.rows[0].fields[data.cases.rows[0].fields.length - 1].workitems.length > 0) {
                    idWorkItem = data.cases.rows[0].fields[data.cases.rows[0].fields.length - 1].workitems[0].idWorkItem;
                }
            }
            if (idCase && idWorkItem) {
                // Publish the event so any other webpart could react to that
                self.publish("ui-bizagi-process-newcase", { "idCase": data.idCase, "data": data });
                //Post is not working, just make a redirection using the querystring
                window.location = "RenderCAF.aspx?idCase=" + idCase + "&idWorkitem=" + idWorkItem;
                //console.log("The case has been created");
            }
        }).fail(function (msg) {
            self.manageError(msg, defer);
        });
    },

    addCustomHelperFunctions: function (data) {
        return $.extend(data, {

            isImage: function (field, columnName) {
                if (columnName == "CAFRequest.AssetInfo.AssetImageSAN" && field && field.length > 0) {
                    return true;
                }
                else { return false; }
            },
            isImageLabel: function (field, columnName) {
                if (columnName == "CAFRequest.AssetInfo.AssetType.Description" && field && field.length > 0) {
                    return true;
                }
                else { return false; }
            },
            isGridColumnVisible: function (columnName) {
                if (columnName != "CAFRequest.AssetInfo.AssetImageSAN") {
                    return true;
                }
                else { return false; }
            },
            isFieldVisible: function (field, columnName, dataType, visible) {
                if (dataType != "imageLabel" && dataType != "upload" && visible == true && columnName != "CAFRequest.AssetInfo.AssetImageSAN" && field && field.length > 0) {
                    return true;
                }
                else { return false; }
            }
        });
    },

    /*
    *   Creates a new case based on the selected process
    */
    createNewAssetCase: function (idWfClass, AssetInfoId) {
        var self = this;
        var def = new $.Deferred();
        var caseData = [];
        caseData.push({
            'xpath': 'CAFRequest.AssetInfo',
            'value': AssetInfoId
        });
        // Creates a new case
        $.when(self.dataService.createNewCase({
            idWfClass: idWfClass,
            caseData: caseData
        })).done(function (data) {
            def.resolve(data);
            // Then we call the routing action
            /* self.publish("executeAction", {
            action: bizagi.workportal.actions.action.BIZAGI_WORKPORTAL_ACTION_ROUTING,
            idCase: data.idCase
            });*/

            // Publish the event so any other webpart could react to that
            self.publish("ui-bizagi-process-newcase", { "idCase": data.idCase, "data": data });
            //Post is not working, just make a redirection using the querystring
            window.location = "RenderCAF.aspx?idCase=" + data.idCase + "&idWorkitem=" + data.workItems[0].idWorkItem;
            //console.log("The case has been created");
        }).fail(function (msg) {
            self.manageError(msg, defer);
        }); 
        return def.promise();
    }
});
