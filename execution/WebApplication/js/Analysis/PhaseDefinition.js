var curPhaseObject = null;
var IsSilverlightReady = false;



function ShowCustomPhase(oPhase){
    
    curPhaseObject = oPhase
    
    ChangeEditMode(false);
    
    document.getElementById("txtPhaseNameShow").innerHTML = curPhaseObject.Name;    
    document.getElementById("txtPhaseDescriptionShow").innerHTML = curPhaseObject.Description;
    
    
    ShowDiagramPath();
}

function NewPhase(){
    curPhaseObject = GetEmptyPhaseObject();
    EditPhase();
}



function EditPhase(){
     
    //Paste values in edit controls
    document.getElementById("txtPhaseName").value = curPhaseObject.Name;
    document.getElementById("txtPhaseDescription").value = curPhaseObject.Description;

    try{
        document.getElementById("txtPhaseName").innerHTML = curPhaseObject.Name;
        document.getElementById("txtPhaseDescription").innerHTML = curPhaseObject.Description;
    }
    catch(ex)
    {}

    SelectWorkflowInCombo(curPhaseObject.WorkflowId);
    
    ChangeEditMode(true);
}



function ShowHidePhasePanel(bShow){
    document.getElementById("columnRightPanel").style.display= bShow ? "block" : "none";
}


function SelectWorkflowInCombo(idWorkflow){
    var objCombo = document.getElementById("ddlWorkflows");    
    for (var i=0; i < objCombo.length; i++){ 
        if(objCombo[i].value == idWorkflow){
            objCombo.selectedIndex = i;
        }
    }

}


//--------------- Phase persistence methods ---------------------//

function SavePhase(){
    if(!ValidateFields())
        return;

    curPhaseObject.Name = document.getElementById("txtPhaseName").value;
    curPhaseObject.Description = document.getElementById("txtPhaseDescription").value;
    
    var url = "../Ajax/AJAXGateway.aspx?action=1613"
            + "&IdCustomPhase=" + curPhaseObject.IdCustomPhase 
            + "&Name=" + curPhaseObject.Name
            + "&Description=" + curPhaseObject.Description
            + "&IdTaskFrom=" + curPhaseObject.IdTaskFrom
            + "&IdTaskTo=" + curPhaseObject.IdTaskTo
            + "&date=" + new Date();
            
	callAjaxURL(url, SavePhaseCallBack);
}


function SavePhaseCallBack(oResult){
    var objResult = BAEval(" (" + oResult + ")");
    if(objResult.ERROR != null){
        window.alert("Error:\n" + objResult.ERROR);
        return;
    }
    
    //Save_new_phase returns the new created phase object. Replace current.
    if(curPhaseObject.IdCustomPhase < 0)
        curPhaseObject = objResult;
        
    var listFrame         = document.getElementById("iframePhaseList");
    listFrame.contentWindow.location.reload(); 
    //ShowCustomPhase(curPhaseObject);
}

function DeletePhase(){
    
    var url = "../Ajax/AJAXGateway.aspx?action=1614"
            + "&IdCustomPhase=" + curPhaseObject.IdCustomPhase 
            + "&date=" + new Date();
            
	callAjaxURL(url, DeletePhaseCallBack);
}

function DeletePhaseCallBack(oResult){
    var objResult = BAEval(" (" + oResult + ")");
    if(objResult.ERROR != null){
        window.alert("Error:\n" + objResult.ERROR);
        return;
    }
    
    curPhaseObject = null;
    var listFrame         = document.getElementById("iframePhaseList");
    listFrame.contentWindow.location.reload(); 
    //ShowCustomPhase(curPhaseObject);
}

//--------------- End: Phase persistence methods ---------------------//

//--------------- Form Events ---------------------//

function buttonEdit_onclick(){
    EditPhase();
}
function buttonSave_onclick(){
    SavePhase();
}

function buttonDelete_onclick(){
    if(window.confirm(document.getElementById("hidMsg_ConfirmDelete").value))
        DeletePhase();
}
function WorkflowCombo_Changed(){
    curPhaseObject.IdTaskFrom = -1;
    curPhaseObject.TaskFromName = "";

    curPhaseObject.IdTaskTo = -1;
    curPhaseObject.TaskToName = "";
    
    var objCombo = document.getElementById("ddlWorkflows");    
    curPhaseObject.WorkflowId = parseInt(objCombo[objCombo.selectedIndex].value);
    EditDiagramPath();
}
//--------------- End: Form Events ---------------------//



function BAEval(oValue){
    try{
        return eval(oValue);
    }
    catch(ex){
        window.alert("ERROR evaluating JSON string:\n " + oValue);
        return null;
    }
}

function ValidateFields(){
    if(document.getElementById("txtPhaseName").value.length == 0){
        document.getElementById("txtPhaseName").focus();
        return false;
    }

    if(curPhaseObject.IdTaskFrom < 0){
        window.alert(document.getElementById("hidMsg_FillAllFields").value);
        return false;
    }

    if(curPhaseObject.IdTaskTo < 0){
        window.alert(document.getElementById("hidMsg_FillAllFields").value);
        return false;
    }

    return true;
}

function GetEmptyPhaseObject(){

    var selWorkflowId= -1;
    var objCombo = document.getElementById("ddlWorkflows");    
    if(objCombo.selectedIndex >= 0)
        selWorkflowId = parseInt(objCombo[objCombo.selectedIndex].value);

    var obj= {
        IdCustomPhase: -1,
        Name: "",
        Description: "",
        IdTaskFrom: -1,
        IdTaskTo: -1,
        TaskFromName:"",
        TaskToName: "",
        WorkflowId: selWorkflowId,
        ProcessName: ""
    }
    
    return obj;
}

//--------------- Silverlight call back methods ---------------------//
function SLDiagramNotifyLoaded(){
    IsSilverlightReady = true;
    if(curPhaseObject == null || curPhaseObject.IdCustomPhase == -1)
        EditDiagramPath();
    else
        ShowDiagramPath();
}

function SLDiagramNotifyChange(params) {
}

function SLDiagramNotifyTaskSelect(params){
    var oParams = BAEval(" (" + params + ")");
    var TaskId= oParams.TaskId;
    var Action = oParams.Action;
    
    if(curPhaseObject == null)
        return;
    
    if(Action == "PHASE_START_TASK")
        curPhaseObject.IdTaskFrom = TaskId;
    else if (Action == "PHASE_FINISH_TASK")
        curPhaseObject.IdTaskTo = TaskId;
}

//--------------- End: Silverlight call back methods ---------------------//

//--------------- Silverlight config methods ---------------------//

function EditDiagramPath(){
    if(! IsSilverlightReady)
        return;
        
    var WorkflowId= curPhaseObject.WorkflowId;
    var IdTaskFrom = curPhaseObject.IdTaskFrom;
    var IdTaskTo = curPhaseObject.IdTaskTo;        
    
    try{
        var slFrame = document.getElementById("iframeSilverlight");    
	    slFrame.contentWindow.ConfigureForPhaseDefinition(WorkflowId, IdTaskFrom, IdTaskTo)
    }catch(e){
        window.alert("Silverlight error trying to edit diagram:\n" + e.message);
    }
}


function ShowDiagramPath(){
    if(! IsSilverlightReady || curPhaseObject==null)
        return;
        
        
        
    var WorkflowId = curPhaseObject.WorkflowId;
    var IdTaskFrom = curPhaseObject.IdTaskFrom;
    var IdTaskTo = curPhaseObject.IdTaskTo;        
    
    try{
        var slFrame = document.getElementById("iframeSilverlight");    
	    slFrame.contentWindow.ConfigureForPathShow(WorkflowId, IdTaskFrom, IdTaskTo)
    }catch(e){
        window.alert("Silverlight error:\n" + e.message);
    }
}

//--------------- End: Silverlight config methods ---------------------//


function ChangeEditMode(bEdit){

    //Show/Hide divs
    document.getElementById("divDetailShow").style.display= bEdit ? "None" : "Block";
    document.getElementById("divDetailEdit").style.display= bEdit ? "Block" : "None";
    if(bEdit){
        EditDiagramPath();
    }
}

function GoToReport(){
    window.location = "./AnalyticsPhase.aspx";
}

