/*
*   Name: BizAgi Workportal HelloWorld Overrides Webpart
*   Author: Diego Parra
*   Comments:
*   -   This script will define a base class to all widgets
*   -   This webpart comes from adidas and has not been eliminated
*/
bizagi.workportal.webparts.helloWorld.extend("bizagi.workportal.webparts.helloWorld", {}, {
    /*
    *   Creates a new case based on the selected process
    */
    createNewCase: function (idWfClass) {
        return this._super(idWfClass);
    }
});
