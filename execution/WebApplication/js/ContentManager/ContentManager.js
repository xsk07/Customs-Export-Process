/*
*Script related with content manager actions
*/
var I_cell_State            = 0;
var I_cell_Name             = 1;
var I_cell_sep1             = 2;
var I_cell_View             = 3;
var I_cell_sep2             = 4;
var I_cell_Edit             = 5;
var I_cell_sep3             = 6;
var I_cell_UpdateMetadata   = 7;
var I_cell_sep4             = 8;
var I_cell_UpdateData       = 9;
var I_cell_sep5             = 10;
var I_cell_CheckOut         = 11;
var I_cell_sep6             = 12;
var I_cell_CancelChekOut    = 13;
var I_cell_sep7             = 14;
var I_cell_Delete           = 15;
var I_cell_IdFileUpload     = 16;

var I_RowCount              = 17;

var bProcessingContentManager = false;


//Get Localized Messagges
var VDeleteConfirm;
var VTextShowAdded;
var VTextShowPersistedLocked;
var VTextShowPersistedUnLocked;
var VUpdateMetadataToolTip;
var VDeleteToolTip;
var VEditToolTip;
var VUpdateFileToolTip;
var VCheckOutToolTip;
var VCancelCheckOutToolTip;


//Get Action's Names
var VA_CancelCheckOut;
var VA_CheckOut;
var VA_UpdateContent;
var VA_Edit;
var VA_Delete;
var VA_UpdateMetadata;
var VA_ViewFile;
var VA_UploadFile;


/* 
 *Script related with content manager actions
 */
/**
 * Calls the ajax action
 */
function CallContentManagerAction(parameters){
    var url = "../Ajax/AJAXGateway.aspx?" + parameters;
    if (bProcessingContentManager){
        alert(BA_PROCESSING);
        return;
    }
    callAjaxURL(url, UpdateECMFileCallBack);
    bProcessingContentManager = true;
}
/**
* Updates the ECM file with the ajax response
*/
function UpdateECMFileCallBack(oResult){
    bProcessingContentManager = false;
    var oJsonResult = BAEval(" (" + oResult + ")");
    UpdateECMFile(oJsonResult);
}

/**
* Updates the ECM file with the ajax response
*/
function UpdateECMFile(oJsonResult){
    //Get result data
    if(oJsonResult.ERROR != null){
        window.open("../../ECMSimpleError.aspx?ErrorMessage=" + oJsonResult.ERROR,'mywindow','width=360,height=140,resizable=yes,scrollbars=yes');
        return;
    }
    else{
        //Update the ECM object:
        if (oJsonResult.openWindowURL != null){
            window.open(oJsonResult.openWindowURL,500,100, true,true,false);
        }
        
        BAECMPostProcessAction(oJsonResult);
        //Actualizar el registro
        BAProcessFileRow(oJsonResult);
    }
}

/**
*Verifies if the user is able to upload more files.
*/
function BAValidateUploadButtonVisibility(renderName){
    var counter = parseInt(GetValue("h_BAC_"+renderName));
    var max = parseInt(GetValue("h_BAM_"+renderName));
    var sendMail = GetValue("h_sendMail_"+renderName);
    
    if( counter >= max && max != 0) {
        if(sendMail == "True") {
            var oTd = document.getElementById("tdh_BAUC_"+renderName);
            oTd.style.visibility = "hidden";
            
            var oTdM = document.getElementById("tdMh_BAUC_"+renderName);
            oTdM.style.visibility = "hidden";
        }
        else
            GetObject("h_BAUC_"+renderName).style.visibility = "hidden";
    }
    else {
        GetObject("h_BAUC_"+renderName).style.visibility = "";
        var oTd = document.getElementById("tdh_BAUC_"+renderName);
        oTd.style.visibility = "";
        
        var oTdM = document.getElementById("tdMh_BAUC_"+renderName);
        oTdM.style.visibility = "";
    }    
}
/**
* Updates custom status acoording to action
*/
function BAECMPostProcessAction(jsonResult){
    
    VA_UploadFile = document.getElementById("A_UploadFile").value;
    VA_Delete = document.getElementById("A_Delete").value;
    
    var action = jsonResult.currentAction;
    
    if (action == VA_Delete){
        //Subtract 1 to file counter:
        var renderName = jsonResult.renderName;
        var counter = parseInt(GetValue("h_BAC_"+renderName));
        if (counter > 0){
            counter = counter -1;
        }
        else{
            counter = 0;
        }
        SetValue("h_BAC_"+renderName,counter);
        BAValidateUploadButtonVisibility(renderName);
    }
    else if (action == VA_UploadFile){
         //Add 1 to file counter
        var renderName = jsonResult.renderName;
        var counter = parseInt(GetValue("h_BAC_"+renderName));
        if (counter > 0){
            counter = counter +1;
        }
        else{
            counter = 1;
        }
        SetValue("h_BAC_"+renderName,counter);
        BAValidateUploadButtonVisibility(renderName);
    }
}

/**
* This method is called by main upload page. It performs operations
* over the opener window, using the information  in oResult json.
* It closes the current window
*/
function ProcessControllerResponse(oResult){
                window.parent.CloseControllerResponse(oResult);

}
function CloseControllerResponse(oResult){
                CloseCurrentWindow();
                UpdateECMFile (oResult);
}
window.CloseControllerResponse = CloseControllerResponse;

/*-----------------------------------
    Utils
------------------------------------*/

function BAEval(oValue){
    try{
        return eval(oValue);
    }
    catch(ex){
        window.alert("ERROR evaluating JSON string:\n " + oValue);
        return null;
    }
}
/**
* Process an action over a file upload record.
* fileInfoResponse contains JSON object
*/
function BAProcessFileRow(fileInfo){

    var idFileUpload  = fileInfo.idFileUpload;
    var idAttrib = fileInfo.idAttrib;
    var idScope = fileInfo.idScope;
    var xpath = fileInfo.xpath;
    var idRender = fileInfo.idRender;
    var xpathContext = fileInfo.xpathContext;
    var fileName = fileInfo.fileName;
    var idWorkItem = fileInfo.idWorkItem;
    var isVisible = fileInfo.isVisible;
    var allowUpdateMetadata = fileInfo.allowUpdateMetadata;
    var allowView = fileInfo.allowView;
    var allowDelete = fileInfo.allowDelete;
    var allowEdit = fileInfo.allowEdit;
    var allowUpdateContent = fileInfo.allowUpdateContent;
    var allowCheckOut = fileInfo.allowCheckOut;
    var allowCancelCheckOut = fileInfo.allowCancelCheckOut;
    var renderName = fileInfo.renderName;
    var ecmStatus = fileInfo.ecmStatus;
        
    VDeleteConfirm = document.getElementById("CDeleteConfirm").value;
    VTextShowAdded  = document.getElementById("CTextShowAdded ").value;
    VTextShowPersistedLocked = document.getElementById("CTextShowPersistedLocked").value;
    VTextShowPersistedUnLocked = document.getElementById("CTextShowPersistedUnLocked").value;
    VUpdateMetadataToolTip = document.getElementById("CUpdateMetadataToolTip").value;
    VDeleteToolTip = document.getElementById("CDeleteToolTip").value;
    VEditToolTip = document.getElementById("CEditToolTip").value;
    VUpdateFileToolTip = document.getElementById("CUpdateFileToolTip").value;
    VCheckOutToolTip = document.getElementById("CCheckOutToolTip").value;
    VCancelCheckOutToolTip = document.getElementById("CCancelCheckOutToolTip").value;
    
    //Get Action's Names
    VA_CancelCheckOut = document.getElementById("A_CancelCheckOut").value;
    VA_CheckOut = document.getElementById("A_CheckOut").value;
    VA_UpdateContent = document.getElementById("A_UpdateContent").value;
    VA_Edit = document.getElementById("A_Edit").value;
    VA_Delete = document.getElementById("A_Delete").value;
    VA_UpdateMetadata = document.getElementById("A_UpdateMetadata").value;
    VA_ViewFile = document.getElementById("A_ViewFile").value;
    VA_UploadFile = document.getElementById("A_UploadFile").value;

    //Get Table and Create Row
    var oTable = document.getElementById("UploadList__"+renderName);
    var iLastRow = oTable.rows.length;
    var oRow;
    var exists = false;
    var allowBizagiDelete;
    allowBizagiDelete = oTable.AllowBizAgiDelete;
    
    if(typeof(allowBizagiDelete) == 'undefined'){
        allowBizagiDelete = AllowBizAgiDelete;
    }
    
    if(iLastRow > 0){
        //Clear All Rows of Table to Repaint
        for( var  index = 0; index < iLastRow; index++){
            if(oTable.rows[index].cells[I_cell_IdFileUpload].innerHTML == idFileUpload){
                oRow = oTable.rows[index];
                exists = true;
                break;
            }
        }
    }

    if(!exists){
        //Is New Row (new file)
        oRow = oTable.insertRow(iLastRow);
        //Create Columns
        for( var i= 0; i < I_RowCount; ++i)
            oRow.insertCell(i);

        oRow.cells[I_cell_sep1].width = "3";
        oRow.cells[I_cell_sep2].width = "3";
        oRow.cells[I_cell_sep3].width = "3";
        oRow.cells[I_cell_sep4].width = "3";
        oRow.cells[I_cell_sep5].width = "3";
        oRow.cells[I_cell_sep6].width = "3";
        oRow.cells[I_cell_sep7].width = "3";
    }
    if(!isVisible)
    {
        //Hide the current row:
        oRow.style.display='none';
        return;
    }
    
    var OnClik = "";
    var vAction = "";
    var ShowText = "";
    var Ref = "";
    var Reference = "";

    var DeleteConfirm = "if(window.confirm('" + VDeleteConfirm + "'))";
    
    var Parameters = "&h_idattrib=" + idAttrib
    + "&h_idScope=" + idScope
    + "&h_attribXpath=" + xpath
    + "&h_idRender=" + idRender
    + "&h_xpathContext=" + xpathContext
    + "&h_fileName=" + fileName
    + "&h_idWorkItem=" + idWorkItem
    + "&h_idFileUpload="+idFileUpload
    + "&h_renderName="+renderName
    + "&h_ecmStatus="+ecmStatus;
    
    var sOnClickWindow = "ShowBAWindowModal('Bizagi',500,350,'../Upload/FrmUploadECM.aspx?";
                        
    var sOnClickAjax = "CallContentManagerAction('";
                        
    var sOnClickOpenWindow = "window.open('../Upload/FrmUploadECM.aspx?";
    
    //Validate Icon to Show
    var ImageShow;
    var TextShow;
    
    var Status_LOCAL = 1;
    var Status_PERSISTED = 2;
    var Status_READONLY = 4;
    var Status_CHECKEDOUT = 5;
    
    if(ecmStatus == Status_LOCAL){
        TextShow = VTextShowAdded;
        ImageShow = "added.png";
    }
    else if(ecmStatus == Status_PERSISTED){
        TextShow = VTextShowPersistedUnLocked;
        ImageShow = "unlock.png";
    }
    else if(ecmStatus == Status_READONLY){
        ImageShow = "ReadOnly.png";
    }
    else if(ecmStatus == Status_CHECKEDOUT){
        TextShow = VTextShowPersistedLocked;
        ImageShow = "lock.png";
    }
    
    var par = "<img src= \"../../img/ECM/" + ImageShow +"\"" + " title=\"" + TextShow + "\"></img>";
    
    oRow.cells[I_cell_State].innerHTML = par;

    oRow.cells[I_cell_IdFileUpload].innerHTML = idFileUpload;
    oRow.cells[I_cell_IdFileUpload].style.display='none';
    
    //Validate Each Operation
    if(allowView) //Always view
    {
        vAction = VA_ViewFile;
        ShowText = fileName;
        OnClik = getsOnClickOpenWindowEvent(Parameters, vAction, sOnClickOpenWindow);
        Ref = "<a href = \"javascript:void(0)\" onclick =\"" + OnClik + "\">" + ShowText + "</a>";
        Reference = Ref;
        oRow.cells[I_cell_View].innerHTML = Reference;
    }

    if(allowUpdateMetadata)
    {
        oRow.cells[I_cell_UpdateMetadata].style.display='';
        oRow.cells[I_cell_sep4].style.display='';
        
        vAction = VA_UpdateMetadata;
        ShowText = VUpdateMetadataToolTip;
        OnClik = getsOnClickWindowEvent(Parameters, vAction, sOnClickWindow);
        Ref = getLink(OnClik, ShowText, vAction);
        Reference = Ref;
        oRow.cells[I_cell_UpdateMetadata].innerHTML = Reference;
    }
    else{
        oRow.cells[I_cell_UpdateMetadata].style.display='none';
        oRow.cells[I_cell_sep4].style.display='none';
    }
    
    if(allowBizagiDelete == "True" && allowDelete)
    {
        oRow.cells[I_cell_Delete].style.display='';
                
        vAction = VA_Delete;
        ShowText = VDeleteToolTip;
        OnClik = getsOnClickAjaxEvent(Parameters, vAction, DeleteConfirm + sOnClickAjax);
        Ref = getLink(OnClik, ShowText, vAction);
        Reference = Ref;
        oRow.cells[I_cell_Delete].innerHTML = Reference;
    }
    else{
        oRow.cells[I_cell_Delete].style.display='none';
    }

    if(allowEdit)
    {
        oRow.cells[I_cell_Edit].style.display='';
        oRow.cells[I_cell_sep3].style.display='';
        
        vAction = VA_Edit;
        ShowText = VEditToolTip;
        OnClik = getsOnClickAjaxEvent(Parameters, vAction, sOnClickAjax);
        Ref = getLink(OnClik, ShowText, vAction);
        Reference = Ref;
        oRow.cells[I_cell_Edit].innerHTML = Reference;
    }
    else{
        oRow.cells[I_cell_Edit].style.display='none';
        oRow.cells[I_cell_sep3].style.display='none';
    }

    if(allowUpdateContent)
    {
        oRow.cells[I_cell_UpdateData].style.display='';
        oRow.cells[I_cell_sep5].style.display='';
        
        vAction = VA_UpdateContent;
        ShowText = VUpdateFileToolTip;
        OnClik = getsOnClickWindowEvent(Parameters, vAction, sOnClickWindow);
        Ref = getLink(OnClik, ShowText, vAction);
        Reference = Ref;
        oRow.cells[I_cell_UpdateData].innerHTML = Reference;
    }
    else{
        oRow.cells[I_cell_UpdateData].style.display='none';
        oRow.cells[I_cell_sep5].style.display='none';
    }

    if(allowCheckOut)
    {
        oRow.cells[I_cell_CheckOut].style.display='';
        oRow.cells[I_cell_sep6].style.display='';
        
        vAction = VA_CheckOut;
        ShowText = VCheckOutToolTip;
        OnClik = getsOnClickAjaxEvent(Parameters, vAction, sOnClickAjax);
        Ref = getLink(OnClik, ShowText, vAction);
        Reference = Ref;
        oRow.cells[I_cell_CheckOut].innerHTML = Reference;
    }
    else{
        oRow.cells[I_cell_CheckOut].style.display='none';
        oRow.cells[I_cell_sep6].style.display='none';
    }

    if(allowCancelCheckOut)
    {
        oRow.cells[I_cell_CancelChekOut].style.display='';
        oRow.cells[I_cell_sep7].style.display='';
        
        vAction = VA_CancelCheckOut;
        ShowText = VCancelCheckOutToolTip;
        OnClik = getsOnClickAjaxEvent(Parameters, vAction, sOnClickAjax);
        Ref = getLink(OnClik, ShowText, vAction);
        Reference = Ref;
        oRow.cells[I_cell_CancelChekOut].innerHTML = Reference;
        oRow.cells[I_cell_CancelChekOut].style.display='';
    }
    else{
        oRow.cells[I_cell_CancelChekOut].style.display='none';
        oRow.cells[I_cell_sep7].style.display='none';
    }
}

//Build Click Event to Show Upload and Metadata Form
function getsOnClickWindowEvent(Parameter, vAction, sOnClickWindow){
    var par = "h_action=" + vAction + Parameter;
    return sOnClickWindow +  par + "');";
}

//Build Click Event to Call Ajax Event
function getsOnClickAjaxEvent(Parameter, vAction, sOnClickAjax){
    var par = "action=" + vAction + Parameter;
    return sOnClickAjax +  par + "');";
}

//Build Click Event to Show Open Window Form (View Action)
function getsOnClickOpenWindowEvent(Parameter, vAction, sOnClickOpenWindow){
    var par = "h_action=" + vAction + Parameter;
    return sOnClickOpenWindow +  par + "', null);";
}

//Build Link
function getLink(OnClick, ShowText, vAction){
    var par = "<a href = \"javascript:void(0)\" onclick =\"" + OnClick + "\">" + getIcon(ShowText, vAction) + "</a>";
    return par;
}

//Get Operation Icon
function getIcon(ShowText, vAction)
{
    var imageName = "";
    
    switch(vAction)
    {
        case VA_CancelCheckOut: //CancelCheckOut
            imageName = "cancelcheckout.png";
        break;
        
        case VA_CheckOut: //CheckOut
            imageName = "checkout.png";
        break;
        
        case VA_Delete: //Delete
            imageName = "delete.png";
        break;
        
        case VA_Edit: //Edit
            imageName = "edit.png";
        break;
        
        case VA_UpdateContent: //Update File Bytes
            imageName = "update_bytes.png";
        break;
        
        case VA_UpdateMetadata: //Update Metadata File
            imageName = "update_metadata.png";
        break;
    }
    
    var par = "<img src= \"../../img/ECM/" + imageName + "\"" + " title=\"" + ShowText + "\"></img>";
    return par;
}
