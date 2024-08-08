/*
*   Name: BizAgi Workportal new case button Webpart Override
*   Author: Diego Parra
*   Comments:
*   -   This script will define a base class to all widgets 
*/
bizagi.workportal.webparts.newCaseButton.extend("bizagi.workportal.webparts.newCaseButton", {}, {

    /*
    *   Creates a new case based on the selected process 
    */
//    createNewCase: function (idWfClass) {
//        return this._super(idWfClass);
//    },
    /*
    *   Renders the content for the current controller
    */
//    renderContent: function (params) {
//        var self = this;
//        var sessionHandlerURL = "/SessionHandler.ashx";
//        return $.when(bizagi.sessionhelper.populateSessionValues(params.privileges, sessionHandlerURL))
//                .pipe(function (modifiedPrivileges) {
//                    if (modifiedPrivileges.length == 2 && bizagi.util.parseBoolean(modifiedPrivileges[0].isPrivileged)) {

//                        //if meet autorization values, the system load the template

//                        var template = self.getTemplate("newCaseButton");
//                        return $.tmpl(template, { idWorkflow: params.idWorkflow, buttonName: params.buttonName });
//                    }
//                    return "";
//                });
//    }



});

