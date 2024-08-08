//------------------------------- Constants ----------------------------//
var _sensorEdit_AjaxGatewayUrl  = "../Ajax/AJAXGateway.aspx";
var _sensorEdit_BackToReportsUrl  = "./AnalyticsSensor.aspx";
var _sensorEdit_AjaxActionCode = "1617";

//----------------------------- Globals ---------------------------------//
var _sensorEdit_ProcessIcon_Class = 'process-icon-class';
var _sensorEdit_SensorsModel = [];
var _sensorEdit_PendingLoads = 2; //document and Silverlight object 
var _sensorEdit_CurSelectedTaskId = -1;
var _sensorEdit_CurSelectedTaskFromId = -1;
var _sensorEdit_CurSelectedTaskToId = -1;



//------------------------------------------------------------------------ 
//Startup function
//----------------

$(function () {
    
        //Layout in main screen
        var layoutOptions = {
            "west" :{
                "size": 300,
                "resizable": false,
                "closable": false,
                "spacing_open": 5,
                "spacing_closed": 5
            }
        };
        $('#panelMain').layout(layoutOptions);
        
        //Fill workflow from sensor model
        _sensorEdit_SensorsModel = GetSensorsModel();
        if(_sensorEdit_SensorsModel.length == 0)
            return;
        
        FillProcessComboFromSensorsModel();
        $("#cmbWorkflows").change(OnProcessComboChange);
        
        //Apply select plugin to workflows combo
        $("#cmbWorkflows").selectmenu({
            style: 'dropdown',
            icons: [ {find: "*", icon : _sensorEdit_ProcessIcon_Class} ]
        });
        
        //Apply button plugin and configure all buttons
        BindButtonEvents();
        
        --_sensorEdit_PendingLoads;
        CheckAllLoaded();

});

//--------------------- Call initialize methods if all needed objects have been loaded --------------//

function CheckAllLoaded(){
    if(_sensorEdit_PendingLoads != 0)
        return;
    
    AllLoaded();
}

//--------------------- Perform initializations once everything has been loaded --------------//

function AllLoaded(){

    if($("#cmbWorkflows option").length == 0)
        return;
    
    //Update screen with the current process in combo
    OnProcessComboChange();
}

//--------------------- Apply style and define call backs for buttons --------------//
function BindButtonEvents(){

    $("#btnNewStopwatch").button();
    $("#btnNewStopwatch").click(function(){ SelectSensorItem(null); ShowStopwatchProperties_Edit(); });
    
    $("#btnNewCounter").button();
    $("#btnNewCounter").click(function(){ SelectSensorItem(null); ShowCounterProperties_Edit(); });
    
    
    
    $("#btnEditStopwatch").button();
    $("#btnEditStopwatch").click(function(){ ShowStopwatchProperties_Edit(GetSelectedSensorCopy()); });
    
    $("#btnSaveStopwatch").button();
    $("#btnSaveStopwatch").click(function(){ SaveStopwatch(); });
    
    $("#btnCancelEditStopwatch").button();
    $("#btnCancelEditStopwatch").click(function(){ CancelEdit(); });

    $("#btnDeleteStopwatch").button();
    $("#btnDeleteStopwatch").click(function(){ DeleteSensor(); });
    
    
    
    $("#btnEditCounter").button();
    $("#btnEditCounter").click(function(){ ShowCounterProperties_Edit(GetSelectedSensorCopy()); });
    
    $("#btnSaveCounter").button();
    $("#btnSaveCounter").click(function(){ SaveCounter(); });

    $("#btnCancelEditCounter").button();
    $("#btnCancelEditCounter").click(function(){ CancelEdit(); });
    
    $("#btnDeleteCounter").button();
    $("#btnDeleteCounter").click(function(){ DeleteSensor(); });

    
    $(".daysInput").focusout(function(){ CorrectIntegerInInput($(this), 0, 1000, 0); });
    $(".hoursInput").focusout(function(){ CorrectIntegerInInput($(this), 0, 23, 0); });
    $(".minutesInput").focusout(function(){ CorrectIntegerInInput($(this), 0, 59, 0);});
    

    $("textarea").keyup(function (){ ValidateMultlineChar(this, 200);} );
    $("textarea").change(function (){ ValidateMultlineChar(this, 200);} );
}

function CancelEdit(){
    var oSensor = GetSelectedSensorCopy();

    if(oSensor == null)
        ShowDiagram_ForProcessView();
        
    RefreshSensorPropertiesPanel();
}

//---------------------------- Process combo change method -----------------------------//
function OnProcessComboChange(){
    RefreshSensorList();
    RefreshSensorPropertiesPanel();
    ShowDiagram_ForProcessView();
}

//----------------------------- Go to Sensor reports page ----------------------------------//

function BackToReports(){
    window.location = _sensorEdit_BackToReportsUrl;
}


//------------------------------- Get sensor model from page: processes and sensors ----------------------------//

function GetSensorsModel(){
    var sModel = $("#hidSensorModel").val();
    var oModel = BAEval("(" + sModel + ")");
    return oModel;
}

//-------------------------------------------------------------------------
//Uses the sensor model to re-build process combo options 
//---------------------------

function FillProcessComboFromSensorsModel(){

    $("#cmbWorkflows").empty();
     
    for (var iProcessModel in _sensorEdit_SensorsModel){
        
        var oProcessModel = _sensorEdit_SensorsModel[iProcessModel];
        
        var oProcessNode = $("<option value ='" + oProcessModel.id + "'>" + oProcessModel.name + "</option>");
        
        $("#cmbWorkflows").append(oProcessNode);
    }    
}

//-----------------------------------------------------------------------
// Rebuild current sensor list based on the current selected process
//-----------------------------------
function RefreshSensorList(){
    
    $("#divSensorList ul").empty();
    
    var idComboProcess = parseInt($("#cmbWorkflows").val());
    
    if(idComboProcess == null)
        return;
        
    for (var iProcessModel in _sensorEdit_SensorsModel){
        
        var oProcessModel = _sensorEdit_SensorsModel[iProcessModel];
        
        if(oProcessModel.id != idComboProcess)
            continue;
            
        //Add stopwatches as list items
        for(var iStopwatchModel in oProcessModel.stopwatches){
            
            var oStopwatchModel= oProcessModel.stopwatches[iStopwatchModel];
            
            var oListItem = $("<li>" + oStopwatchModel.name + "</li>");
        
            oStopwatchModel.nodeType = "stopwatch";

            jQuery.data(oListItem[0], "model", oStopwatchModel);
            
            oListItem.addClass("liSensorUnselected liSensorStopwatch");
            oListItem.click(SensorItemClick);
            
            $("#divSensorList ul").append(oListItem);
        }        
        
        //Add counters as list items
        for(var iCounterModel in oProcessModel.counters){
            
            var oCounterModel= oProcessModel.counters[iCounterModel];
            
            var oListItem = $("<li>" + oCounterModel.name + "</li>");
        
            oCounterModel.nodeType = "counter";

            jQuery.data(oListItem[0], "model", oCounterModel);

            oListItem.addClass("liSensorUnselected liSensorCounter");
            oListItem.click(SensorItemClick);
            
            $("#divSensorList ul").append(oListItem);
        }
    }        
}


//-------------------------------------------------------------------------------- 
//Handles click event on a sensor item. 
//First selects that item, then shows the respective sensor properties for read.
//If null value is sent, simply deselect everything
//----------------------------------------------------------

function SensorItemClick(item){
    
    //All selected items change to unselected
    $("#divSensorList .liSensorSelected").toggleClass("liSensorSelected liSensorUnselected");

    if(item == null)
        return;
        
    //Determine which li will be selected
    var oTarget = item.target ? item.target : item;
    
    if($(oTarget).hasClass("liSensorSelected"))
        return;
    
    
    //Target item changes to selected
    $(oTarget).toggleClass("liSensorSelected liSensorUnselected");
    
    //Show properties for read
    RefreshSensorPropertiesPanel();
}


//--------------------------------------------------------------------------------------------------------------
// Gets a copy of the sensor object contained by the current selected list item, or null if no sensor is selected. 
//---------------------------------

function GetSelectedSensorCopy(){
    var oSelectedNode = $("#divSensorList .liSensorSelected");

    if(oSelectedNode.length == 0)
        return null;
        
        
    return jQuery.data(oSelectedNode[0], "model");
}


//------------------------------------------------------------------------------------------------ 
//Select the list item that matches the given sensor by invoking the click method on that item 
//--------------------------------------

function SelectSensorItem(oSensor){

    //Deselect current
    SensorItemClick(null);
    
    if(oSensor == null)
        return;

    //Select the given sensor    
    $("#divSensorList li").each(function(){
        var oCurLiSensor = jQuery.data(this, "model");
        if(oCurLiSensor.nodeType == oSensor.nodeType && oCurLiSensor.id == oSensor.id){
            SensorItemClick(this);
            return;
        }
    });
}

//----------------------------------------------------------------------- 
//Display or hide stopwatch/counter properties acording to the current selection 
///---------------------

function RefreshSensorPropertiesPanel(){

    //Hide all property panels
    $(".panelSensorProperties").css("display", "none");

    var oSelectedSensor = GetSelectedSensorCopy();
    
    if(oSelectedSensor == null)
        return;
    
    //Show stopwatch or counter according to nodeType
    if(oSelectedSensor.nodeType == "stopwatch")
        ShowStopwatchProperties_Read(oSelectedSensor);        
    else if(oSelectedSensor.nodeType == "counter")
        ShowCounterProperties_Read(oSelectedSensor);
        
}

//-------------------Show stopwatch for read ----------------//
function ShowStopwatchProperties_Read(oStopwatch){
   $("#panelStopwatchRead").css("display", "block");
   $("#txtStopwatchRead_Name").html(bizagi.util.sanitizeHTML(oStopwatch.name));
    $("#txtStopwatchRead_DisplayName").html(bizagi.util.sanitizeHTML(oStopwatch.displayName));
   $("#txtStopwatchRead_Description").val(oStopwatch.description);
   var sDuration =  GetDurationStringFromMinutes(oStopwatch.SLA);
   $("#txtStopwatchRead_SLA").html(sDuration);
   
   ShowDiagram_ForSensorView();
}

//-------------------Show counter for read ----------------//
function ShowCounterProperties_Read(oCounter){
   $("#panelCounterRead").css("display", "block");
    $("#txtCounterRead_Name").html(bizagi.util.sanitizeHTML(oCounter.name));
    $("#txtCounterRead_DisplayName").html(bizagi.util.sanitizeHTML(oCounter.displayName));
   $("#txtCounterRead_Description").val(oCounter.description);

   ShowDiagram_ForSensorView();
}

//-------------------Show stopwatch for edit ----------------//
function ShowStopwatchProperties_Edit(oStopwatch){

    //If no sensor is received create a default one
    if(oStopwatch == null)
        oStopwatch = { name:"", displayName: "", description:"", SLA: 0, idTaskFrom: -1, idTaskTo: -1 };
    
    //Show edit panel only
    $(".panelSensorProperties").css("display", "none");
    $("#panelStopwatchEdit").css("display", "block");    
    
    //Put sensor text in all boxes
    $("#txtStopwatchEdit_Name").val(oStopwatch.name);
    $("#txtStopwatchEdit_DisplayName").val(oStopwatch.displayName);
    $("#txtStopwatchEdit_Description").val(oStopwatch.description);

    var arrDuration = GetTimeArrayFromMinutes(oStopwatch.SLA);
    $("#txtStopwatchEdit_SLA_Days").val(arrDuration[0]);
    $("#txtStopwatchEdit_SLA_Hours").val(arrDuration[1]);
    $("#txtStopwatchEdit_SLA_Minutes").val(arrDuration[2]);
    
    //Show stopwatch tasks in diagram
    ShowDiagram_ForStopwatchEdit();
}

//-------------------Show counter for edit ----------------//
function ShowCounterProperties_Edit(oCounter){

    //If no sensor is received create a default one
    if(oCounter == null)
        oCounter = { name:"", displayName: "", description:"", idTask: -1 };
    
    //Show edit panel only
    $(".panelSensorProperties").css("display", "none");
    $("#panelCounterEdit").css("display", "block");    
    
    //Put sensor text in all boxes
    $("#txtCounterEdit_Name").val(oCounter.name);
    $("#txtCounterEdit_DisplayName").val(oCounter.displayName);
    $("#txtCounterEdit_Description").val(oCounter.description);

    //Show counter task in diagram
    ShowDiagram_ForCounterEdit();
}

//--------------------- Gets a duration string (h/m/s) from a given number of minutes --------------//

function GetDurationStringFromMinutes(minutes){
    var arrDuration = GetTimeArrayFromMinutes(minutes);
    var sDuration = arrDuration[0] + "d  " + arrDuration[1] + "h:" + arrDuration[2] + "m";
    return sDuration;
}

//--------------------- Divide a given number of minutes in three values: days, hours and minutes --------------//

function GetTimeArrayFromMinutes(minutes){
    minutes = TryParseInt(minutes, 0);

    var hoursDay = parseInt($("#hidHoursDay").val());
    var minutesDay = hoursDay * 60;

    var rDays = (minutes / minutesDay) | 0;
    var rHours = ((minutes % minutesDay) / 60) | 0;
    var rMins =  (minutes % 60);
    
    var arr = [rDays, rHours, rMins];
    return arr;
}

//--------------------- Calculate number of minutes based on an array containing days, hous and minutes --------------//

function GetMinutesFromTimeUnits(days, hours, minutes){
    var hoursDay = parseInt($("#hidHoursDay").val());
    var minutesDay = hoursDay * 60;
    
    var rMinutes =   parseInt(days) * minutesDay
                  + parseInt(hours) * 60
                  + parseInt(minutes);
                    
    return rMinutes;
}

//--------------------- TryParseInt javascript version ------------------//

function TryParseInt(str, defaultValue){
    var retValue = defaultValue;
    if(str != null){
        if(jQuery.trim(new String(str)).length > 0){
            if (!isNaN(str)){
                retValue = parseInt(str);
            }
        }
    }     
    return retValue; 
}

//--------------------- Fix input value if outside the specified range ------------------//

function CorrectIntegerInInput(objInput, minValue, maxValue, defaultValue){

    var iNewValue = TryParseInt(objInput.val(), defaultValue);

    if(iNewValue < minValue)
        objInput.val(minValue);
    else if(iNewValue > maxValue)
        objInput.val(maxValue);
    else
        objInput.val(iNewValue);
}

//--------------------- Controls the length of the text in textarea controls ---------------------//

function ValidateMultlineChar(textControl, textLength){
    var maxlength = new Number(textLength); 

    if(textControl.value.length > maxlength){
        textControl.value = textControl.value.substring(0, maxlength);
    }
}

//--------------------------------------------------------------------
//Invoke ajax method to delete the selected sensor
//---------------------------------------------

function DeleteSensor(){

    if(!window.confirm(document.getElementById("hidMsgConfirmDelete").value))
        return;
    
    //Prepare call url
    var idComboProcess = parseInt($("#cmbWorkflows").val());
    var sUrl = _sensorEdit_AjaxGatewayUrl 
                    + "?action=" + _sensorEdit_AjaxActionCode 
                    + "&idWorkflow=" + idComboProcess
                    + "&op=delete";

    //All sensor object members are atached to the url
    var oSensorToDelete = GetSelectedSensorCopy();
    jQuery.each(oSensorToDelete, function(keyName, keyValue) {
                sUrl += "&" + keyName + "=" + keyValue;
    });
    
    callAjaxMethod(sUrl, DeleteSensor_CallBack);
}

//--------------- Callback for delete operation ---------------------------//

function DeleteSensor_CallBack(result){
    var oResult = BAEval(" (" + result + ")");

    //Check for server errors
    if(oResult.ERROR != null){
        window.alert("Error:\n" + oResult.ERROR);
        return;
    }
    
    //Apply changes in local model
    var oSensorToDelete = GetSelectedSensorCopy();
    var idComboProcess = parseInt($("#cmbWorkflows").val());

    for (var iProcessModel in _sensorEdit_SensorsModel){

        var oProcessModel = _sensorEdit_SensorsModel[iProcessModel];
        
        //Find the selected workflow
        if(oProcessModel.id != idComboProcess)
            continue;
        
        //Determine which collection will be modified: stopwatches or counters
        var arrSensors = oSensorToDelete.nodeType == "stopwatch" ? oProcessModel.stopwatches : oProcessModel.counters;
        
        var iFoundSensorPosition = -1;

        for(var iSensorModel in arrSensors){
        
            var oCurSensor = arrSensors[iSensorModel];
            if(oCurSensor.id == oSensorToDelete.id){
                iFoundSensorPosition = iSensorModel;
                break;
            }            
        }

        if(iFoundSensorPosition >= 0){
            //Delete sensor if exists
            arrSensors.splice(iFoundSensorPosition, 1);
        }

        break;        
     }

     //Refresh process view
     OnProcessComboChange();
}

//------------------------------------------------------------------------------------------- 
//Build a temp stopwatch object using the values typed by the user, then invokes save method 
//------------------------

function SaveStopwatch(){

    //Get object to save
    var oSensor = GetSelectedSensorCopy();
    if(oSensor == null){
        oSensor = new Object();
        oSensor.id = -1;
        oSensor.nodeType = "stopwatch";
    }
    
    //Get edited values
    oSensor.name = $("#txtStopwatchEdit_Name").val();
    oSensor.displayName = $("#txtStopwatchEdit_DisplayName").val();
    oSensor.description = $("#txtStopwatchEdit_Description").val();
    oSensor.idTaskFrom = _sensorEdit_CurSelectedTaskFromId;
    oSensor.idTaskTo = _sensorEdit_CurSelectedTaskToId;

    var iNewDuration = GetMinutesFromTimeUnits( $("#txtStopwatchEdit_SLA_Days").val(),
                        $("#txtStopwatchEdit_SLA_Hours").val(),
                        $("#txtStopwatchEdit_SLA_Minutes").val());
    oSensor.SLA = iNewDuration;
    
    //Validations
    if(oSensor.idTaskFrom <= 0 || oSensor.idTaskTo <= 0){
        window.alert($("#hidMsgMustSelectStopwatchLimits").val());
        return;
    }

    if(jQuery.trim(new String(oSensor.name)).length == 0 ||  jQuery.trim(new String(oSensor.displayName)).length == 0){
        window.alert($("#hidMsgMustEnterNameAndDisplayName").val());
        return;
    }

    
    SaveSensor(oSensor);
}

//------------------------------------------------------------------------------------------ 
//Build a temp counter object using the values typed by the user, then invokes save method
//------------------------

function SaveCounter(){

    //Get object to save
    var oSensor = GetSelectedSensorCopy();
    if(oSensor == null){
        oSensor = new Object();
        oSensor.id = -1;
        oSensor.nodeType = "counter";
    }
    
    //Get edited values
    oSensor.name = $("#txtCounterEdit_Name").val();
    oSensor.displayName = $("#txtCounterEdit_DisplayName").val();
    oSensor.description = $("#txtCounterEdit_Description").val();
    oSensor.idTask = _sensorEdit_CurSelectedTaskId;

    //Validations
    if(oSensor.idTask <= 0){
        window.alert($("#hidMsgMustSelectCounterTask").val());
        return;
    }
    
    if(jQuery.trim(new String(oSensor.name)).length == 0 ||  jQuery.trim(new String(oSensor.displayName)).length == 0){
        window.alert($("#hidMsgMustEnterNameAndDisplayName").val());
        return;
    }

    return SaveSensor(oSensor);
}


//--------------------------------------------------------------------
//Invoke ajax method to save the edited sensor
//---------------------------------------------
function SaveSensor(oSensor){    
    
    //Prepare call url
    var idComboProcess = parseInt($("#cmbWorkflows").val());
    var sUrl = _sensorEdit_AjaxGatewayUrl 
                    + "?action=" + _sensorEdit_AjaxActionCode 
                    + "&idWorkflow=" + idComboProcess
                    + "&op=save";


    //All sensor object members are atached to the url
    jQuery.each(oSensor, function(keyName, keyValue) {
                sUrl += "&" + keyName + "=" + keyValue;
    });
    
    callAjaxMethod(sUrl, SaveSensor_CallBack);
}

//--------------- Callback for save operation ---------------------------//

function SaveSensor_CallBack(result){

    var oResult = BAEval(" (" + result + ")");

    //Check for server errors
    if(oResult.ERROR != null){
        window.alert("Error:\n" + oResult.ERROR);
        return;
    }
    

    //Apply changes in local model

    var oModifiedSensor = oResult.sensor;

    var idComboProcess = parseInt($("#cmbWorkflows").val());

    for (var iProcessModel in _sensorEdit_SensorsModel){

        var oProcessModel = _sensorEdit_SensorsModel[iProcessModel];
        
        //Find the selected workflow
        if(oProcessModel.id != idComboProcess)
            continue;
        
        //Determine which collection will be modified: stopwatches or counters
        var arrSensors = oModifiedSensor.nodeType == "stopwatch" ? oProcessModel.stopwatches : oProcessModel.counters;
        
        var bSensorFound = false;

        for(var iSensorModel in arrSensors){
        
            var oCurSensor = arrSensors[iSensorModel];
            if(oCurSensor.id == oModifiedSensor.id){
                //Replace sensor 
                arrSensors[iSensorModel] = oModifiedSensor;
                bSensorFound = true;
                break;
            }            
        }
        
        //New sensor. Add to current selected process
        if(!bSensorFound)
            arrSensors.push(oModifiedSensor);
            
        break;        
     }
     
     
     //Refresh list items
     RefreshSensorList();
     SelectSensorItem(oModifiedSensor); 
}



//--------------------- Cal Ajax ---------------------//

function callAjaxMethod(url, successFunction) {
    $.ajax({
      url: url,
      success: successFunction,
      error : function(errData){ window.alert("Ajax failure: " +  errData); }
    });
}









//--------------- Silverlight call back methods ---------------------//

function SLDiagramNotifyLoaded(){
    --_sensorEdit_PendingLoads;
    CheckAllLoaded();
}

function SLDiagramNotifyChange(params) {
}

function SLDiagramNotifyTaskSelect(params){

    var oParams = BAEval(" (" + params + ")");
    var TaskId= oParams.TaskId;
    var Action = oParams.Action;
    
    if(Action == "PHASE_START_TASK")
        _sensorEdit_CurSelectedTaskFromId = TaskId;
    else if (Action == "PHASE_FINISH_TASK")
        _sensorEdit_CurSelectedTaskToId = TaskId;
    else
        _sensorEdit_CurSelectedTaskId = TaskId;
        
}

//------------------------ 
function ShowDiagram_ForProcessView(){
    
    var idComboProcess = parseInt($("#cmbWorkflows").val());
    
    var slFrame    = document.getElementById("iframeSilverlight");
        
    slFrame.contentWindow.ConfigureForShow(idComboProcess);   
}

function ShowDiagram_ForSensorView(){

    var idComboProcess = parseInt($("#cmbWorkflows").val());
    
    var oSensor = GetSelectedSensorCopy();
        
    var slFrame    = document.getElementById("iframeSilverlight");
    
    if(oSensor.nodeType == "stopwatch")
        slFrame.contentWindow.ConfigureForStopwatchShow(idComboProcess, oSensor.idTaskFrom, oSensor.idTaskTo)
    else
        slFrame.contentWindow.ConfigureForTaskShow(idComboProcess, oSensor.idTask)
}


function ShowDiagram_ForStopwatchEdit(){

    var idComboProcess = parseInt($("#cmbWorkflows").val());
    
    var oSensor = GetSelectedSensorCopy();
        
    var slFrame    = document.getElementById("iframeSilverlight");
    
    if(oSensor != null){
        _sensorEdit_CurSelectedTaskFromId = oSensor.idTaskFrom;
        _sensorEdit_CurSelectedTaskToId = oSensor.idTaskTo;
    
        slFrame.contentWindow.ConfigureForStopwatchEdit(idComboProcess, oSensor.idTaskFrom, oSensor.idTaskTo)
    }
    else{
        _sensorEdit_CurSelectedTaskFromId = -1;
        _sensorEdit_CurSelectedTaskToId = -1;

        slFrame.contentWindow.ConfigureForStopwatchEdit(idComboProcess, -1, -1)
    }
}


function ShowDiagram_ForCounterEdit(){

    var idComboProcess = parseInt($("#cmbWorkflows").val());
    
    var oSensor = GetSelectedSensorCopy();
        
    var slFrame    = document.getElementById("iframeSilverlight");
    
    if(oSensor != null){
        
        _sensorEdit_CurSelectedTaskId = oSensor.idTask;
        
        slFrame.contentWindow.ConfigureForTaskSelect(idComboProcess, oSensor.idTask)
    }
    else{
        _sensorEdit_CurSelectedTaskId = -1;
        
        slFrame.contentWindow.ConfigureForTaskSelect(idComboProcess, -1)
    }
}