//------------------------------- Constants ----------------------------//
var ReportSetId = 6;
var _bamResourceMonitor_ProcessIcon_Class = 'process-icon-class';
var _bamResourceMonitor_AjaxGatewayUrl = "../Ajax/AJAXGateway.aspx";
var _bamResourceMonitor_AjaxActionCode = "1616";

//----------------------------- Globals ---------------------------------//
var _isDiagramLoaded = 0;
var _boolPendingLoads = 2;
var _curSelectedProcess = null;
var _curSelectedTask = null;
var _arrTasks = new Array();
var _oParams = null;
var _minHeight = 250;
var _minWidth = 300;
var _lastTaskSelected = -1;
var _resultTemporal = null;
var _selectedReport = 0;
var _isUserRoleFilterSelected = true;
var _defaultSlicerPanelForMyTeam = "[]";
var _generalContext = $("#FormBamResourceMonitor");
var _panelFilterContext = $("#panelFilters");
var _divProcessFilterWfClassContext = $("#panelFilters");
var _analysisNavigationMenuBack = $("#Analysis_NavigationMenuBack");
var _taskValuesPanelContext = $("#taskValuesPanel");
//------------------------------------------------------------------------ 
//Startup function
//------------------------------------------------------------------------

jQuery(document).ready(function () {
    CheckIfProcessListIsLoaded();
    CheckAllLoaded();
    ShowHideLoadingMsg(false);
    BindDDLEvents();
    BindButtonsEvents();
    var objSelectedMenues = [$("#cellWorkInProgress"),
        $("#cellLoadAnalysis", _analysisNavigationMenuBack), 
        $("#cellMyTeam", _analysisNavigationMenuBack)];
    BindEventsToMenu(objSelectedMenues);
    if ($("#selectedWorkflowId").val() == "-1" &&
        $("#selectedTaskId").val() == "-1" &&
        $("#isQueryLoaded").val() == "true") 
            ShowTab(1);
    else ShowTab(0);
});

//------------------------------------------------------------------------ 
// Load Functions
//------------------------------------------------------------------------

function CheckIfProcessListIsLoaded() {
    if (GetWfListSize() > 0) {
        ApplySelectmenuPlugin();
    }
    else {
        $("#divProcessFilterPanel *").hide();
    }
    _boolPendingLoads--;
}

function CheckAllLoaded() {
    if (_boolPendingLoads != 0)
        return;
    AllLoaded();
}

function BindDDLEvents() {
    $("#ddlWorkflows").change(ExecuteActionsAfterChangeIndexInDDL);
}

function BindButtonsEvents() {
    $("#cellWorkInProgress").click(function () { ShowTab(0); });
    $("#cellLoadAnalysis").click(function () { ShowTab(1); });
    $("#cellMyTeam").click(function () { ShowTab(2); });
    $("#SaveQueryButton").click(function () { prepareDataToSaveQuery(); });
}

function prepareDataToSaveQuery() {
    if (_selectedReport != 0) SaveQuery(true);
    else SaveQuery();
}

function BindEventsToMenu(objectSelectedMenues) {
    $.each(objectSelectedMenues, function (index) {
        BindEventToLabel(objectSelectedMenues[index]);
    });
}

function BindEventToLabel(objectSelector) {
    objectSelector.mouseover(function () {
        if (objectSelector.attr("class") != "Analysis_NavigationMenuItem_Selected") objectSelector.removeClass().addClass("Analysis_NavigationMenuItem_hover");
    });
    objectSelector.mouseout(function () {
        if (objectSelector.attr("class") != "Analysis_NavigationMenuItem_Selected") objectSelector.removeClass().addClass("Analysis_NavigationMenuItem");
    });
}

function ExecuteActionsAfterChangeIndexInDDL() {
    ClearSlicerPanel();
    ExecuteNewSearch();
    CleanReportAreas();
}

function GetWfListSize() {
    return $("#ddlWorkflows > option").length;
}

function ApplySelectmenuPlugin() {
    $("#ddlWorkflows").selectmenu("destroy");
    $("#ddlWorkflows").selectmenu({
        style: 'dropdown',
        icons: [{ find: "*", icon: _bamResourceMonitor_ProcessIcon_Class}],
        width: 250
    });
}

function AllLoaded() {
    if ($("#ddlWorkflows option").length == 0)
        return;

}

function ExecuteNewSearch() {
    SLC_InitSlicerPanel();
    ShowHidePanel(false, $("#divResourceUserMessage"));
    ShowHidePanel(false, $("#labelResourceEmptyMessage"));
    ShowHideLoadingMsg(true);
    _oParams = GetReportParameters();
    CallAjaxQuery(_oParams);
    _isUserRoleFilterSelected = CheckUserFilterTypeLoaded(_oParams);
    if (_selectedReport == 1 || _selectedReport == 2) ShowHidePanel(!_isUserRoleFilterSelected, $("#divResourceUserMessage"));
    else {
        ShowHidePanel(false, $("#divResourceUserMessage"));
        LoadSLDiagram();
    }
    ShowHideLoadingMsg(false);
}

/*-----------------------------------
Silverlight methods
------------------------------------*/

function SLDiagramDetailList(params) {

}

function SLDiagramNotifyLoaded() {
    _isDiagramLoaded = 1;
    LoadSLDiagram();
}

function SLDiagramNotifyChange(params) {
}

function LoadSLDiagram() {

    if (_isDiagramLoaded == 1 /* Must wait until Silverlight is loaded before invoke Configure */) {
        var oParams = GetReportParameters();
        oParams.workflowId = _selectedReport == 0 ? ((_curSelectedProcess != "-1") ? _curSelectedProcess : oParams.workflowId) : oParams.workflowId;
        if (oParams.workflowId.length == 0)
            return;

        try {
            var slFrame = document.getElementById("iframeSilverlight");
            slFrame.contentWindow.ConfigureForTaskSelect(oParams.workflowId, _lastTaskSelected);
            return 1;
        } catch (e) {
            window.alert("Silverlight error:\n" + e.message);
            return 0;
        }
    }
}


/*-----------------------------------
Utils
------------------------------------*/

function SLDiagramNotifyTaskSelect(params) {
    ShowHideLoadingMsg(true);
    var jSONParamms = BAEval(" (" + params + ")");

    CallAjaxQuery(jSONParamms);
}

function CallAjaxQuery(params) {
    _oParams = GetReportParameters();

    if (_selectedReport == 0) {
        _lastTaskSelected = params.taskId || params.TaskId;
        _curSelectedTask = _oParams.taskId;
    }
    else {
        _lastTaskSelected = -1;
        _curSelectedTask = -1;
    }
    $("#selectedTaskId").val(_lastTaskSelected);
    _oParams = GetReportParameters();
    _oParams.workflowId = _selectedReport == 0 ? ((_curSelectedProcess != "-1") ? _curSelectedProcess : _oParams.workflowId) : "-1";
    var url = _bamResourceMonitor_AjaxGatewayUrl + "?action=" + _bamResourceMonitor_AjaxActionCode + "&ReportSetId=" + ReportSetId + "&date=" + new Date()
        + "&idWorkflow=" + _oParams.workflowId
        + "&idWfClass=" + _oParams.wfclassId
        + "&userFilters=" + _oParams.userFiltersString
        + "&idTask=" + _oParams.taskId;

    if (_oParams.dateFrom != "") {
        url += "&dtmFrom=" + _oParams.dateFrom
            + "&dtmTo=" + _oParams.dateTo;
    }

    callAjaxForReports(url, UpdateProcessCharts);
}

function ShouldShowTaskProperties(oTask) {
    return oTask.idTaskType && (
        oTask.idTaskType == 2 //ManualState
        || oTask.idTaskType == 7 //SubProcess
        || oTask.idTaskType == 14 //SubProcessMultiInstance
        || oTask.idTaskType == 21 //Singleton
        || oTask.idTaskType == 38 //ReceiveTask
        || oTask.idTaskType == 39 //ManualTask
        || oTask.idTaskType == 41 //DataObject
    );
}

function BAEval(oValue) {
    try {
        return eval(oValue);
    }
    catch (ex) {
        window.alert("ERROR evaluating JSON string:\n " + oValue);
        return null;
    }
}

function UpdateProcessCharts(oResult) {

    ShowHideLoadingMsg(false);

    //Get result data
    _resultTemporal = oResult;
    CleanReportAreas();
    //Check for errors in the result
    if (_resultTemporal.ERROR != null) {
        window.alert("Error:\n" + _resultTemporal.ERROR);
        return;
    }
    var posResult = -1;

    switch (_selectedReport) {
        case 0:
            posResult = indexOfResult(_resultTemporal.Results, "Onl_Res_WorkInProgressByUserMyTeam");
            if (posResult > -1) _defaultSlicerPanelForMyTeam = _resultTemporal.Results[posResult].resultTable.rows[0][0].text;
            posResult = indexOfResult(_resultTemporal.Results, "Onl_Res_WorkInProgress");
            if (posResult == -1) return;
            if (EmptyReportMessage(_resultTemporal.Results[posResult].resultTable.rows.length)) return;
            RenderReportFromName(_resultTemporal, "Onl_Res_WorkInProgress", "divResourceManagerTable");
            break;
        case 1:
            posResult = indexOfResult(_resultTemporal.Results, "Onl_Res_WorkInProgressByUser");
            if (posResult == -1) return;
            if (!_isUserRoleFilterSelected) return;
            if (EmptyReportMessage(_resultTemporal.Results[posResult].resultTable.rows.length)) return;
            RenderReportFromName(_resultTemporal, "Onl_Res_WorkInProgressByUser", "divResourceManagerTable");
            break;
        case 2:
            posResult = indexOfResult(_resultTemporal.Results, "Onl_Res_WorkInProgressByUserMyTeam");
            if (posResult == -1) return;
            posResult = indexOfResult(_resultTemporal.Results, "Onl_Res_WorkInProgressByUser");
            if (posResult == -1) return;
            if (!_isUserRoleFilterSelected) return;
            if (EmptyReportMessage(_resultTemporal.Results[posResult].resultTable.rows.length)) return;
            RenderReportFromName(_resultTemporal, "Onl_Res_WorkInProgressByUser", "divResourceManagerTable");
            break;
        default:
            break;
    }
    if (_defaultSlicerPanelForMyTeam == "[]") $("#cellMyTeam").hide();
    else $("#cellMyTeam").show();
}

function indexOfResult(results, reportName) {
    for (var i = 0; i < results.length; i++) {
        if (results[i].ResultName == reportName)
            return i;
    }
    return -1;
}

function RenderReportsFromName(resultSet, reportName, indexForProcess) {
    var listUsers = GetListUsers(resultSet.Results[indexForProcess].resultTable);
    $.each(listUsers, function (index, value) {
        RenderReportFromName(resultSet, reportName, value + "Graphic");
    });
}

function GetListUsers(sourceTable) {
    var userNameColumnIndex = GetTableColumnIndex(sourceTable, "username", true);
    var listUsers = [];
    // Create a list of users without duplicates
    $.each(sourceTable.rows, function () {
        if (listUsers.length == 0)
            listUsers.push(this[userNameColumnIndex].value);
        else if ($.inArray(this[userNameColumnIndex].value, listUsers) == -1)
            listUsers.push(this[userNameColumnIndex].value);
    });
    return listUsers;
}

function CleanReportAreas() {
    $("#divResourceManagerTable").html("");
}

function EmptyReportMessage(reportLength) {
    if (reportLength == 0) {
        ShowHidePanel(true, $("#labelResourceEmptyMessage"));
        return true;
    }
    return false;
}

function ShowTab(index) {
    switch (index) {
        case 0:
            $("#divSlicers").unbind("SlicerMyTeamHideClose");
            LoadSLDiagram();
            ShowHidePanel(true, $("#divLoadAnalysis"));
            ShowHidePanel(true, $("#divProcessFilterPanel"));
            ShowHidePanel(false, $("#divResourceUserMessage"));
            _curSelectedTask = $("#selectedTaskId").val();
            _lastTaskSelected = $("#selectedTaskId").val();
            _curSelectedProcess = $("#selectedWorkflowId").val();
            ClearSlicerPanel();
            _selectedReport = 0;
            CleanReportAreas();
            $("#cellWorkInProgress").removeClass().addClass("Analysis_NavigationMenuItem_Selected");
            $("#cellLoadAnalysis").removeClass().addClass("Analysis_NavigationMenuItem");
            $("#cellMyTeam").removeClass().addClass("Analysis_NavigationMenuItem");
            $("#ddlWorkflows", _divProcessFilterWfClassContext).val("-1");
            $("#divSlicers > table tbody > tr :first-child > table  tbody > tr #RemoveSlicerItem").show();
            ExecuteNewSearch();
            break;
        case 1:
            $("#divSlicers").unbind("SlicerMyTeamHideClose");
            ShowHidePanel(false, $("#divLoadAnalysis"));
            ShowHidePanel(false, $("#divProcessFilterPanel"));
            ShowHidePanel(true, $("#divResourceUserMessage"));
            _curSelectedTask = -1;
            _lastTaskSelected = -1;
            _curSelectedProcess = -1;
            ClearSlicerPanel();
            SLC_InitSlicerPanel();
            _selectedReport = 1;
            CleanReportAreas();
            $("#cellWorkInProgress").removeClass().addClass("Analysis_NavigationMenuItem");
            $("#cellLoadAnalysis").removeClass().addClass("Analysis_NavigationMenuItem_Selected");
            $("#cellMyTeam").removeClass().addClass("Analysis_NavigationMenuItem");
            $("#ddlWorkflows").val("-1");
            $("#divSlicers > table tbody > tr :first-child > table  tbody > tr #RemoveSlicerItem").show();
            ExecuteNewSearch();
            break;
        case 2:
            ShowHidePanel(false, $("#divLoadAnalysis"));
            ShowHidePanel(false, $("#divProcessFilterPanel"));
            ShowHidePanel(true, $("#divResourceUserMessage"));
            _curSelectedTask = -1;
            _lastTaskSelected = -1;
            _curSelectedProcess = -1;
            ClearSlicerPanel(); //Then it should automatically upload my team
            _selectedReport = 2;
            CleanReportAreas();
            $("#cellWorkInProgress").removeClass().addClass("Analysis_NavigationMenuItem");
            $("#cellLoadAnalysis").removeClass().addClass("Analysis_NavigationMenuItem");
            $("#cellMyTeam").removeClass().addClass("Analysis_NavigationMenuItem_Selected");
            $("#hidUserQuerySlicers").val(_defaultSlicerPanelForMyTeam);
            SLC_InitSlicerPanel();
            ExecuteNewSearch();
            $("#hidUserQuerySlicers").val("[]");
            $("#divSlicers").bind("SlicerMyTeamHideClose", function () {
                SlicerMyTeamHideClose();
            });
            SlicerMyTeamHideClose();
            break;
        default:
            break;

    }
}

function ShowHidePanel(canShow, selector) {
    if (canShow)
        selector.show();
    else
        selector.hide();
}

function CheckUserFilterTypeLoaded(params) {
    var paramsUser = jQuery.parseJSON(params.userFiltersString);
    var isPresent = false;
    if (paramsUser.Slicers.length > 0) {
        $.each(paramsUser.Slicers, function (index) {
            if (paramsUser.Slicers[index].DimensionId == 4 || paramsUser.Slicers[index].DimensionId == 6 || paramsUser.Slicers[index].DimensionId == 7) {
                isPresent = true;
            }
        });
    }
    return isPresent;
}

function SlicerMyTeamHideClose() {
    $("#divSlicers > table tbody > tr :first-child > table  tbody > tr #RemoveSlicerItem").hide();
}


