/*
*   Name: BizAgi Workportal QueryCases Webpart
*   Author: Raghuveer Jagirdar
*   Comments:
*   -   This script will define the methods to handle the visibility of the actions.
*/


bizagi.workportal.webparts.querycases.extend("bizagi.workportal.webparts.querycases", {}, {

    changeHeader: function (data) {
        $.each(data.columns, function (key, column) {
            if (column.name == "CAFRequest.AssetInfo.AssetType.Description") {
                column.displayName = "Asset Type";
            }
            else if (column.name == "CAFRequest.AssetInfo.Discipline.Description") {
                column.displayName = "Discipline";
            }
            else if (column.name == "CAFRequest.AssetInfo.SportsCategory.Description") {
                column.displayName = "Sports Category";
            }

            else if (column.dataType == "DateTime") {
                column.displayName = column.displayName + "(dd/mm/yyyy)";
            }
            else if (column.name == "CAFRequest.FinancialInfo.TotalConValueEUR") {
                column.displayName = "Total Contract Value EUR";
            }
        });
        return data;
    },

    getYear: function (date) {
        var year = new Date(date).getYear();
        if (year > 1000)
            return year;
        else
            return 1900 + year;
    },

    getMonth: function (date) {
        var month = new Date(date).getMonth() + 1;
        if (month < 10)
            return "0" + month;
        else
            return month;
    },

    getDate: function (date) {
        var date = new Date(date).getDate();
        if (date < 10)
            return "0" + date;
        else
            return date;
    },

    cropTime: function (data) {
        var columnsIndex = [];
        var self = this;
        $.each(data.columns, function (key, column) {
            if (column.dataType == "DateTime") {
                columnsIndex.push(key);
            }
        });

        if (columnsIndex.length != 0) {
            $.each(data.rows, function (key, row) {
                $.each(columnsIndex, function (i, currentKey) {
                    var value = row[currentKey];
                    if (value != null && value != "") {
                        var dateParts = row[currentKey].split(" ");
                        if (dateParts.length > 1) {
                            var tempValue = dateParts[0];
                            var date = new Date(tempValue);
                            var date_Temp = self.getDate(tempValue) + "/" + (self.getMonth(tempValue)) + "/" + self.getYear(tempValue);
                            value = date_Temp;
                        }
                    }
                    row[currentKey] = value;
                });
            });
        }

        return data;
    },

    TrimDecimal: function (data) {
        var columnsIndex = [];
        var self = this;
        $.each(data.columns, function (key, column) {
            if (column.dataType == "Money") {
                columnsIndex.push(key);
            }
        });

        if (columnsIndex.length != 0) {
            $.each(data.rows, function (key, row) {
                $.each(columnsIndex, function (i, currentKey) {
                    var value = row[currentKey];
                    if (value != "") {
                        value = parseFloat(value).toFixed(0);
                    }
                    row[currentKey] = value;
                });
            });
        }
        return data;
    },
    formatNumber: function (data) {
        var columnsIndex = [];
        var self = this;
        $.each(data.columns, function (key, column) {
            if (column.dataType == "Money") {
                columnsIndex.push(key);
            }
        });

        if (columnsIndex.length != 0) {
            $.each(data.rows, function (key, row) {
                $.each(columnsIndex, function (i, currentKey) {
                    var value = row[currentKey];
                    if (value != "") {

                        value += '';
                        var splitStr = value.split('.');
                        var splitLeft = splitStr[0];
                        var splitRight = splitStr.length > 1 ? '.' + splitStr[1] : '';
                        var regx = /(\d+)(\d{3})/;
                        while (regx.test(splitLeft)) {
                            splitLeft = splitLeft.replace(regx, '$1' + ',' + '$2');
                        }
                        value = splitLeft + splitRight;
                    }
                    row[currentKey] = value;
                });
            });
        }
        return data;
    },

    handleComments: function (params) {
        var self = this;
        var options = {
            url: '/CAF/_layouts/adidas.SPOMA.CAF/COMMENTS.aspx?idCase=' + params.idCase,
            title: 'User Comments',
            width: 670,
            height: 250,
            dialogReturnValueCallback: self.ShowStatus

        };
        SP.UI.ModalDialog.showModalDialog(options);

    },

    ShowStatus: function () {
        SP.UI.Notify.addNotification("Operation Completed");
    },

    checkAccessPrivileges: function (params) {
        /*Method to evaluate the access privileges of the logged in user*/
        var show = true;
        return show;
    },

    buildPrivilegeObject: function (isVisible, idWorkitem, actionName) {
        var obj = {};
        obj["isVisible"] = isVisible;
        obj["idWorkitem"] = idWorkitem;
        obj["actionName"] = actionName;
        return obj;
    },

    postProcessData: function (data, actions, view) {

        var self = this;
        data = self.cropTime(data);
        data = self.TrimDecimal(data);
        data = self.formatNumber(data);
        data = self.helper.hideCasesColumn(data, "CAFRequest.CAFStatus");
        data = self.helper.hideCasesColumn(data, "CAFRequest.CAFStatus.StatusID");
        data = self.helper.hideCasesColumn(data, "CAFRequest.ContractID");
        data = self.helper.hideCasesColumn(data, "CAFRequest.AssetInfo.AssetImageSAN");
        data = self.changeHeader(data);
        if (view == "thumbnails") {
            self.helper.hideCasesColumn(data, "CAFRequest.AssetInfo.NickName");
            //self.helper.hideCasesColumn(data,"CAFRequest.AssetInfo.SportsCategory.Description");
            //self.helper.hideCasesColumn(data,"CAFRequest.AssetInfo.Discipline.Description");
            self.helper.hideCasesColumn(data, "CAFRequest.AssetInfo.AssetType.Description");
            self.helper.hideCasesColumn(data, "CAFRequest.SubmissionDate");
            self.helper.hideCasesColumn(data, "CAFRequest.FinalApprovalDate");
            self.helper.hideCasesColumn(data, "CAFRequest.FinancialInfo.TotalConValueEUR");
            self.helper.hideCasesColumn(data, "CAFRequest.FinancialInfo.ContractDuration");
            self.helper.hideCasesColumn(data, "CAFRequest.FinalApprovalDate");
            self.helper.hideCasesColumn(data, "CAFRequest.ApproverName");
            self.helper.hideCasesColumn(data, "CAFRequest.SPApproverName");
            data = self.helper.hideCasesColumn(data, "CAFRequest.CAFNumber");
        }
        var defer = new $.Deferred();
        var promises = [];


        $.each(data.rows, function (key, row) {
            promises.push(self.handleActions(row, actions));
        });

        $.when.apply($, promises).done(function () {
            for (var i = 0; i < arguments.length; i++) {
                data.rows[i].push(arguments[i]);
            }
            defer.resolve(data);
        });
        return defer.promise();
    },

    buildAsyncObject: function (isVisible, idWorkitem, actionName) {
        var defer = new $.Deferred();
        var self = this;

        $.when(self.buildPrivilegeObject(isVisible, idWorkitem, actionName))
        .done(function (privilegeObj) {
            defer.resolve(privilegeObj);
        });

        return defer.promise();
    },

    handleActions: function (row, actions) {
        var self = this;
        var defer = new $.Deferred();
        var privileges = {};
        var promises = [];
        var idCase = row[0];

        $.each(actions, function (key, action) {

            var actionName = action.name;
            var idTaskCollection = action.TaskID;
            var isVisible = bizagi.util.parseBoolean(action.isVisible);

            if (actionName == "updateCAF") {
                if (isVisible) {
                    promises.push(self.checkWorkitems(idCase, idTaskCollection, actionName));
                }
                else {
                    promises.push(self.buildAsyncObject(false, null));
                }
            }
            else if (actionName == "approve") {
                if (isVisible) {
                    promises.push(self.checkWorkitems(idCase, idTaskCollection, actionName));
                }
                else {
                    promises.push(self.buildAsyncObject(false, null));
                }
            }
            else if (actionName == "draft") {
                if (isVisible) {
                    promises.push(self.checkWorkitems(idCase, idTaskCollection, actionName));
                }
                else {
                    promises.push(self.buildAsyncObject(false, null));
                }
            }
            else if (actionName == "deleteCAF" || actionName == "cancelCAF") {
                if (isVisible) {
                    promises.push(self.checkEvents(idCase, idTaskCollection, actionName));
                }
                else {
                    promises.push(self.buildAsyncObject(false, null, actionName));
                }
            }
            else if (actionName == "viewCAF") {
                promises.push(self.buildAsyncObject(false, null, actionName));
            }
            else if (actionName == "reviseCAF") {
                if (isVisible) {
                    //promises.push(self.buildAsyncObject(true, null, actionName));   
                    // To enure the requestor can revise only his own CAF.
                    promises.push(self.checkEvents(idCase, idTaskCollection, actionName));
                }
                else {
                    promises.push(self.buildAsyncObject(false, null, actionName));
                }
            }
            else if (actionName == "reuseCAF") {
                if (isVisible) {
                    promises.push(self.buildAsyncObject(true, null, actionName));
                }
                else {
                    promises.push(self.buildAsyncObject(false, null, actionName));
                }
            }
            else if (actionName == "caf") {
                if (isVisible) {
                    promises.push(self.buildAsyncObject(true, null, actionName));
                }
                else {
                    promises.push(self.buildAsyncObject(false, null, actionName));
                }
            }
            else if (actionName == "reviseDraftCAF") {
                if (isVisible) {
                    promises.push(self.buildAsyncObject(true, null, actionName));
                }
                else {
                    promises.push(self.buildAsyncObject(false, null, actionName));
                }
            }
            else if (actionName == "contract") {
                if (isVisible) {
                    if (row[row.length - 4] != "") {
                        promises.push(self.buildAsyncObject(true, null, actionName));
                    }
                    else {
                        promises.push(self.buildAsyncObject(false, null, actionName));
                    }
                }
                else {
                    promises.push(self.buildAsyncObject(false, null, actionName));
                }
            }
        });

        $.when.apply($, promises).done(function () {

            $.each(arguments, function (key, argument) {
                var actionName = argument.actionName;
                privileges[actionName] = argument;
            });

            defer.resolve(privileges);
        });

        return defer.promise();
    },

    checkWorkitems: function (idCase, idTaskColl, actionName) {
        var self = this;
        var idWorkitem = null;
        var status = false;
        var defer = new $.Deferred();
        var privilegeObj = null;
        idTaskColl = JSON.parse(idTaskColl);
        $.when(self.getWorkItems(idCase))
                .pipe(function (workitemsData) {
                    for (var i = 0; i < workitemsData.workItems.length; i++) {
                        for (var t = 0; t < idTaskColl.length; t++) {
                            var idTask = idTaskColl[t];
                            if (idTask == null || workitemsData.workItems[i].idTask == idTask) {
                                idWorkitem = workitemsData.workItems[i].idWorkItem;
                                break;
                            }
                        }
                    }

                    if (idWorkitem != null) {
                        privilegeObj = self.buildPrivilegeObject(true, idWorkitem, actionName);
                    }
                    else if (idWorkitem == null) {
                        privilegeObj = self.buildPrivilegeObject(false, null, actionName);
                    }
                    return privilegeObj;
                })
                .done(function (privilegeObj) {
                    defer.resolve(privilegeObj);
                });
        return defer.promise();
    },

    checkEvents: function (idCase, idTask, actionName) {
        var idWorkitem = null;
        var self = this;
        var defer = new $.Deferred();
        $.when(self.getEvents(idCase))
                .pipe(function (eventsData) {
                    if (eventsData.events.length != 0) {
                        for (var i = 0; i < eventsData.events.length; i++) {
                            $.each(eventsData.events[i], function (key, eventInfo) {
                                if (idTask == null || eventInfo.idTask == idTask) {
                                    idWorkitem = eventInfo.idWorkitem;
                                }
                            }
                            )
                            if (idWorkitem != null) {
                                break;
                            }
                        }
                    }
                    if (idWorkitem != null) {
                        privilegeObj = self.buildPrivilegeObject(true, idWorkitem, actionName);
                    }
                    else if (idWorkitem == null) {
                        privilegeObj = self.buildPrivilegeObject(false, null, actionName);
                    }
                    return privilegeObj;
                }).done(function (privilegeObj) {
                    defer.resolve(privilegeObj);
                });
        return defer.promise();
    },

    filterRows: function (rows, filters, title) {
        var self = this;
        var tempArray = [];

        $.each(rows, function (key, row) {
            var permissions = row[row.length - 2];
            tempArray.push(row);
            if (self.isDraft(filters)) {
                if (!permissions.draft.isVisible) {
                    tempArray.pop();
                }
            }
            else if (self.isPendingForMyApproval(title)) {
                if (!permissions.approve.isVisible) {
                    tempArray.pop();
                }
            }
        });

        return tempArray;
    },

    isDraft: function (filters) {
        var show = false;
        if (typeof (filters) != "object") {
            filters = JSON.parse(filters);
        }
        $.each(filters, function (key, filter) {
            if (filter) {
                var xpath = filter.xpath;
                if (xpath == "CAFRequest.CAFStatus") {
                    if (filter.value == 1) {
                        show = true;
                        return false; // CHECK : Draft will always be invisible
                    }
                }
            }
        });

        return show;
    },

    isRejectedCancelled: function (filters) {
        var show = false;
        if (typeof (filters) != 'object') {
            filters = JSON.parse(filters);
        }

        $.each(filters, function (key, filter) {
            if (filter) {
                var xpath = filter.xpath;
                if (xpath == "CAFRequest.RejectedCancelled") {
                    show = true;
                    return false;
                }
            }
        });

        return show;
    },

    isPendingForMyApproval: function (title) {
        var show = false;
        if (title == "CAFs WAITING FOR MY APPROVAL") {
            show = true;
        }
        return show;
    },

    isApprovedCAFs: function (title) {
        var show = false;
        if (title == "APPROVED CAFs") {
            show = true;
        }
        return show;
    },


    /* This method adds custom functions used by the template in order to resolve information */
    addCustomHelperFunctions: function (data) {
        return $.extend(data, {

            showGrid: function (rows) {
                if (rows.length > 0)
                    return true;
                else
                    return false;
            },

            showComments: function (filters) {
                var show = false;
                $.each(filters, function (key, filter) {
                    var xpath = filter.xpath;
                    if (xpath == "CAFRequest.RejectedCancelled") {
                        if (filter.value == 1) {
                            show = true;
                        }
                    }
                });
                return show;
            },

            getToolTipValue: function (row) {
                return (row[1] + ", " + row[2] + " - " + row[3]);
            },
            getDispayValue: function (row) {
                if (row[row.length - 1] == "False") {
                    return false;
                }
                else {
                    return true;
                }
            },

            getWFProgressURL: function (row) {
                return ("http://deheremap4565/contractapprovalform/App/Cockpit/graphicquery.aspx?analysisType=2&CaseId=" + row[0]);
            },

            findColumnIndex: function (columnXpath) {
                var index = -1;
                $.each(data.columns, function (key, column) {
                    if (column.name == columnXpath) {
                        index = key;
                        return false;
                    }

                });
                return index;
            },

            showButtonA: function (row, actionName) {
                var show = false;
                var cafStatusID = row[data.findColumnIndex("CAFRequest.CAFStatus.StatusID")];
                var privileges = row[data.findColumnIndex("permissions")][actionName];
                if (privileges != null) {
                    if (actionName == "reuseCAF") {
                        if (privileges.isVisible) {
                            // Advait : Reuse only when Cancelled
                            //show = true;
                            if (cafStatusID == "2") {
                                show = true;
                            }
                            else {

                                show = false;
                            }
                        }
                        else {
                            show = false;
                        }
                    }
                    else if (actionName == "reviseCAF") {
                        if (privileges.isVisible) {
                            // Advait : Revise only when Rejected
                            //show = true;

                            if (cafStatusID == "5") {
                                show = true;
                            }
                            else {

                                show = false;
                            }
                        }
                        else {
                            show = false;
                        }
                    }
                    else if (actionName == "deleteCAF") {
                        if (privileges.isVisible) {
                            show = true;
                        }
                        else
                            show = false;
                    }
                    else if (actionName == "updateCAF") {
                        if (privileges.isVisible) {
                            show = true;
                        }
                        else
                            show = false;
                    }
                    else if (actionName = "cancelCAF") {
                        if (privileges.isVisible) {
                            show = true;
                        }
                        else
                            show = false;
                    }
                    else if (actionName == "viewCAF") {
                        if (privileges.isVisible) {
                            show = true;
                        }
                        else
                            show = false;
                    }
                    else if (actionName == "draft") {
                        if (privileges.isVisible) {
                            show = true;
                        }
                        else
                            show = false;
                    }
                    else if (actionName == "approve") {
                        if (privileges.isVisible) {
                            show = true;
                        }
                        else
                            show = false;
                    }

                }
                return show;
            },

            getWorkitem: function (row, actionName) {
                var idWorkitem = null;
                var privilegeObj = row[row.length - 2][actionName];
                if (privilegeObj.isVisible) {
                    idWorkitem = privilegeObj.idWorkitem;
                }

                return idWorkitem;
            },
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
            isFieldVisible: function (field, columnName, dataType, visible) {
                if (dataType != "imageLabel" && dataType != "upload" && dataType != "permissions"  && visible == true && columnName != "CAFRequest.AssetInfo.AssetImageSAN" && field && field.length > 0) {
                    return true;
                }
                else { return false; }
            }
        });
    },

    /*
    *   Executes a preconfigured action
    *   Any action used must bed here in order to add behavioure defin
    */
    executeAction: function (params) {
        var self = this;
        var idCase = params.idCase;
        var idWorkitem = params.idWorkitem;

        if (params.action == "updateCAF" || params.action == "draft" || params.action == "approve") {
            window.location = "/CAF/Pages/Render.aspx?idCase=" + idCase + "&idWorkitem=" + idWorkitem;
        }
        else if (params.action == "cancelCAF" || params.action == "deleteCAF") {
            self.handleEvent(idCase, idWorkitem, params.action);
        }

        else if (params.action == "reviseCAF") {
            self.createNewCase(1, params);
        }
        else if (params.action == "reviseDraftCAF") {
            self.createNewCase(1, params);
        }
        else if (params.action == "reuseCAF") {
            self.createNewCase(1, params);
        }
        else if (params.action == "caf") {
            window.location = "/CAF/Pages/Render.aspx?idCase=" + params.idCase;
        }
        else if (params.action == "contract") {
            self.displayContract(6, params);
        }
    },

    handleEvent: function (idCase, idWorkitem, actionName) {
        var self = this;
        var options = SP.UI.$create_DialogOptions();

        if (actionName == "cancelCAF")
            options.title = "Cancel CAF";
        else if (actionName == "deleteCAF")
            options.title = "Delete CAF";

        options.width = 670;
        options.height = 400;
        //options.url = "/CAF/Pages/Render.aspx?environment=debug&idCase="+idCase+"&idWorkitem="+idWorkItem;
        options.url = "/CAF/Pages/Render.aspx?isEvent=true&idCase=" + idCase + "&idWorkitem=" + idWorkitem;
        options.dialogReturnValueCallback = self.handleCallback;
        SP.UI.ModalDialog.showModalDialog(options);
    },

    handleCallback: function (params) {
        SP.UI.ModalDialog.RefreshPage(SP.UI.DialogResult.OK)
    },

    /* View Contract*/
    displayContract: function (idWF, params) {
        var self = this;
        var defer = new $.Deferred();

        //Find the row
        var contractID = null;
        var contractColumnPosition = 10;
        for (var index = 0; index < self.data.rows.length; index++) {
            if (self.data.rows[index][0] == params.idCase) {
                contractID = self.data.rows[index][contractColumnPosition];
                break;
            }
        }
        if (contractID) {
            var caseData = [];
            caseData.push({
                'xpath': 'ViewContract.CAFRequest.ContractID',
                'value': +contractID
            });

            $.when(self.dataService.createNewCase({
                idWfClass: idWF,
                caseData: caseData
            })).done(function (data) {
                defer.resolve(data);
                window.location = "/CAF/Pages/Render.aspx?idCase=" + data.idCase + "&idWorkitem=" + data.workItems[0].idWorkItem;

            }).fail(function (msg) {
                self.manageError(msg, defer);
            });
        }
        else {
            alert("Contract not found in AMS");
        }
        return defer.promise();
    },


    /*
    *      Create New Asset.
    */
    createNewCase: function (idWF, params) {
        var self = this;
        var def = new $.Deferred();
        var caseData = [];
        if (params.action == 'reuseCAF') {
            caseData.push({
                'xpath': 'CAFRequest.ActionType',
                'value': 'Reuse'
            });
        }
        else if (params.action == 'reviseCAF') {
            caseData.push({
                'xpath': 'CAFRequest.ActionType',
                'value': 'Revise'
            });
        }
        else if (params.action == 'reviseDraftCAF') {
            caseData.push({
                'xpath': 'CAFRequest.ActionType',
                'value': 'Revise'
            });
        }
        caseData.push({
            'xpath': 'CAFRequest.ParentCAFID',
            'value': "'" + params.idCase + "'"
        });
        $.when(self.dataService.createNewCase({
            idWfClass: idWF,
            caseData: caseData
        })).done(function (data) {
            def.resolve(data);
            window.location = "/CAF/Pages/Render.aspx?idCase=" + data.idCase + "&idWorkitem=" + data.workItems[0].idWorkItem;

        }).fail(function (msg) {
            self.manageError(msg, defer);
        });
        return def.promise();

    }


});