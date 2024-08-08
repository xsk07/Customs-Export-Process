//------------------------------- Constants ----------------------------//
var _iAjaxActionCode = "1650";
var _ajaxGatewayUrl = "../Ajax/AJAXGateway.aspx";
var _pathSelectWindowUrl = "./pathSelectWindow.aspx";
var _maxEntityPathLength = 512;

//------------------------------- Global variables ----------------------------//
var _arrDimensions = new Array();
var _curSelectedDimension = null;


//------------------------------- Startup function ----------------------------//

$(function() {

    $("#ddlProcess").change(function(){
                    $("#hidEntityPath").val("");
                    $("#txtDisplayEntityPath").val("");
                     });
    

    //Load lists
    LoadDimensionList();

    //Bind events
    BindButtonEvents();
    

    jQuery(".titleDimensionType").addClass("ui-widget ui-widget-header ui-corner-all");
    
});


//--------------------- Get a JSON dimension object based on a list item id --------------//

function GetDimensionByItemId(sItemId){
    
    for( var iDimensionIndex = 0; iDimensionIndex < _arrDimensions.length; ++iDimensionIndex ){

        var oCurDim = _arrDimensions[iDimensionIndex]; 
        var sCurItemId = (oCurDim.IsAdministrable ? "adminDimension_" : "fixedDimension_") + oCurDim.Id;              
        
        if(sCurItemId == sItemId)
            return oCurDim;
            
    }
    
    return null;        
}


//------------- Assign a response to the click events for each button --------------//

function BindButtonEvents(){
    $("#btnEdit").button();
    $("#btnEdit").click(function(){
        EditDimensionProperties(_curSelectedDimension);
    });
    
    $("#btnCancel").button();
    $("#btnCancel").click(function(){
        if(_curSelectedDimension.Id == -1)
            SelectDefaultListItem();
        else
            ShowDimensionProperties(_curSelectedDimension, true);
    });
    
    $("#btnApply").button();
    $("#btnApply").click(function(){
        SaveDimension();
    });
    
    $("#btnDelete").button();
    $("#btnDelete").click(function(){
        DeleteDimension();
    });

    $("#btnNewDimension").button();
    $("#btnNewDimension").click(function(){
        NewDimension();
    });
    $("#imgSelectPath").mousedown(function(){SelectEntityPath();});
}


//------------- Assign a response to the click events for each list item --------------//

function BindListEvents(){

    $(".selectableList li").click(function(){

        var oDimension  = GetDimensionByItemId(this.id);
        
        //Change list item selection only if edition is permited
        if( ShowDimensionProperties(oDimension, false) ){

            $(".liSelected").each(function(){
                ChangeListItemClass(this, false);
            });
            ChangeListItemClass(this, true);
            
        }
    });

}


//---------------------------
//Re-paint both lists using the global dimension array. Also bind select events.
//This occurs at initialization after dimension load, or after changing or deleting any dimension.
//---------------------------

function RefreshDimensionList(){

    //Clear both dimension lists
    $(".divDimensionGroup table").each( function(){
        while(this.rows.length > 0)
            this.deleteRow(0);
    })


    //Insert every json dimension into its containter
    for( var iDimensionIndex = 0; iDimensionIndex < _arrDimensions.length; ++iDimensionIndex ){
        
        var oCurDim = _arrDimensions[iDimensionIndex];        
        
        //Locate appropiate dimension list
        var sListId = "listDimensions_" + (oCurDim.IsAdministrable ? "Admin_Proc_" : "Fixed_Proc_") +  oCurDim.WfClassId;        
        var oList = document.getElementById(sListId);
        //Create dimension list if not exists
        if(oList == null){

            //Locate container dimension group name
            var sDivContainerName = oCurDim.IsAdministrable ?  "divUserDimensionList" : "divFixedDimensionList";
            
            //Create list into container group table
            $("#" + sDivContainerName + " table").each(function(){
                var sListTitleCell = "<div class='titleDimensionProcess'>" +  oCurDim.WfClsDisplayName + "</div>";
                var sListContentCell = "<ul class =\"selectableList\" id=\"" + sListId + "\"></ul>";

                //Insert list cells into container table
                var row1 = this.insertRow(-1); 
                row1.insertCell(0);
                //Fill cells with the item's html
                row1.cells[0].innerHTML = sListTitleCell + sListContentCell;
            })
            
            oList = document.getElementById(sListId);            
        }
        
        //Create dimension list item
        sItemId = (oCurDim.IsAdministrable ? "adminDimension_" : "fixedDimension_") + oCurDim.Id;                
        var oNewListItem = document.createElement("li");
        oNewListItem.id = sItemId;
        oNewListItem.innerHTML = oCurDim.DisplayName;
        ChangeListItemClass(oNewListItem, false);
        oList.appendChild(oNewListItem);
    }    

    BindListEvents();
    
    if(_curSelectedDimension == null && _arrDimensions.length > 0)
        SelectDefaultListItem();
}


//---------------------------
//Selects a default dimension after at screen initialization or after a deletion occurs
//This dimension could be NONE
//---------------------------

function SelectDefaultListItem(){
    
    var oDimension = _arrDimensions.length == null ? null : _arrDimensions[0];
    SelectDimensionItem(oDimension);    
}


//---------------------------
//Select the given dimension. 
//This occurs when a dimension has changed its properties, after deletion or after initialization
//---------------------------

function SelectDimensionItem(oDimension){

    //Clear list selection
    $(".liSelected").each(function(){
            ChangeListItemClass(this, false); 
        });

    //Show selected dimension in properties panel
    if(ShowDimensionProperties(oDimension, true)){

        //Select dimension list item if exists
        if(oDimension != null){    
            var sItemId = (oDimension.IsAdministrable ? "adminDimension_" : "fixedDimension_") + oDimension.Id;        
            $("#" + sItemId).each(function(){ ChangeListItemClass(this, true); });
        }
    }
}

//---------------- Changes a list item status: selected/unselected ----------------------//
function ChangeListItemClass(listItem, bSetSelected){
    if(bSetSelected)
        listItem.className= "liSelected";
    else
        listItem.className= "liUnselected";
        
    var oDimension  = GetDimensionByItemId(listItem.id);
    
    if(!oDimension.IsValid)
        jQuery(listItem).addClass("liInvalidDimension");

}


//---------------------
//Attemps to show a dimension in readonly mode. Return true unless the user rejects to lose changes.
//---------------------------

function ShowDimensionProperties(oDimension, forceShow){

    //If no dimension is sent just hide the whole right panel and return success
    if(oDimension == null){
        document.getElementById("divRightPanel").style.display = "none";
        return true;
    }
    
    //Check if there are pending changes before showing the given item
    if(IsDimensionModified() && !forceShow){
        if(window.confirm($("#hidMsgIgnoreChanges").val()) == false)
        return false;
    }
    
    //Change current dimension    
    _curSelectedDimension = oDimension;

    //Show read only panel        
    document.getElementById("divRightPanel").style.display = "block";    
    document.getElementById("divDimensionEditPanel").style.display = "none";    
    document.getElementById("divDimensionReadPanel").style.display = "inline";    
    
    //Show properties
    document.getElementById("txtIdEdit").value                      = oDimension.Id;
    document.getElementById("txtNameRead").innerHTML                = oDimension.Name;
    document.getElementById("txtDisplayNameRead").innerHTML         = oDimension.DisplayName;
    document.getElementById("txtDescriptionRead").innerHTML         = oDimension.Description;
    document.getElementById("txtProcessRead").innerHTML             = oDimension.WfClsDisplayName;
    document.getElementById("txtDisplayEntityPathRead").innerHTML   = oDimension.DisplayEntityPath;
    
    document.getElementById("btnEdit").style.display = oDimension.IsAdministrable ? "inline" : "none";
    document.getElementById("btnDelete").style.display = oDimension.IsAdministrable ? "inline" : "none";
    
    return  true;
}


//--------------------- Makes the edit panel appear ---------------------//

function EditDimensionProperties(oDimension){
    //Show edit panel        
    document.getElementById("divDimensionEditPanel").style.display = "inline";    
    document.getElementById("divDimensionReadPanel").style.display = "none";    
    
    //Show properties
    document.getElementById("txtIdEdit").value              = oDimension.Id;
    document.getElementById("txtNameEdit").value            = oDimension.Name;
    document.getElementById("txtDisplayNameEdit").value     = oDimension.DisplayName;
    document.getElementById("txtDescriptionEdit").value     = oDimension.Description;
    SelectOptionInProcessCombo(oDimension.WfClassId);
    document.getElementById("hidEntityPath").value          = oDimension.EntityPath;
    document.getElementById("txtDisplayEntityPath").value   = oDimension.IsValid ? oDimension.DisplayEntityPath : "";
}

//--------------------- set something in process combo ---------------------//
function SelectOptionInProcessCombo(optionValue){
    var oCombo = document.getElementById("ddlProcess");
    for (var i = 0; i < oCombo.options.length; ++i){
        var oWfClass =  BAEval("(" + oCombo.options[i].value + ")");
        if(oWfClass.IdWfClass == optionValue){
            oCombo.options[i].selected = "1";
        }
    }   
}

//------------ Returns an empty dimension object (for the "new dimension" command)---------//
function NewDimension(){
    
    var oSelWfClass =  BAEval("(" + jQuery("#ddlProcess").val() + ")");

    var oEmptyDimension= {
        Id: -1,
        IsAdministrable: true,
        Name: "",
        DisplayName: "",
        Description: "",
        WfClassId:  (document.getElementById("ddlProcess").options.length > 0) 
                    ? oSelWfClass.IdWfClass 
                    : -1,
        WfClassDisplayName: "",
        EntityPath: "",
        DisplayEntityPath: ""
    }
    
    SelectDimensionItem(oEmptyDimension);    

    EditDimensionProperties(oEmptyDimension);
}


//--------------------- Checks if current dimension has been modified -------------------//

function IsDimensionModified(){
    if(document.getElementById("divDimensionEditPanel").style.display == "none")
        return false;
        
    if(_curSelectedDimension != null && _curSelectedDimension.Id != -1){
        if(
                _curSelectedDimension.Name != document.getElementById("txtNameEdit").value
            ||  _curSelectedDimension.DisplayName != document.getElementById("txtDisplayNameEdit").value
            ||  _curSelectedDimension.Description != document.getElementById("txtDescriptionEdit").value 
            ||  _curSelectedDimension.EntityPath != document.getElementById("hidEntityPath").value 
        )
            return true;       
    }
    else{
        if(
                document.getElementById("txtNameEdit").value != ""
            ||  document.getElementById("txtDisplayNameEdit").value != ""
            ||  document.getElementById("txtDescriptionEdit").value != ""
            ||  document.getElementById("hidEntityPath").value != ""
        )
            return true;        
    }
    
    return false;
}


//--------------------- Checks if current entity path has been modified -------------------//

function IsEntityPathModified(){
    if(document.getElementById("divDimensionEditPanel").style.display == "none")
        return false;
        
    if(_curSelectedDimension != null && _curSelectedDimension.Id != -1){
        if(_curSelectedDimension.EntityPath != document.getElementById("hidEntityPath").value)
            return true;       
    }

    return false;
}


//--------------------- Shows the pathselect window in a modal JQuery popup ---------------------//


function SelectEntityPath(){

    var oCombo = jQuery("#ddlProcess")[0];
    
    if(oCombo.options.length == 0)
        return;
    
    var oSelWfClass =  BAEval("(" + jQuery("#ddlProcess").val() + ")");

    if(oSelWfClass.IdProcessEntity < 0){
        ShowMessageBox(jQuery("#hidMsgNoProcessEntity").val());
        return;
    }
    
    var arrButtons = [];
    arrButtons[0] = getModalWindowButton(jQuery("#hidMsgOK").val(), "EntityPathDialogOKButton();", false);
    arrButtons[1] = getModalWindowButton(jQuery("#hidMsgCancel").val(), "closeCurrentModalWindow(null);", false);
    
    var sUrl =         _pathSelectWindowUrl
                        + "?wfClassId=" + oSelWfClass.IdWfClass 
                        + "&selectedNodePath=" + jQuery("#hidEntityPath").val();
    

	openModalWindow(sUrl, 500, 320, arrButtons);

}


function EntityPathDialogOKButton(){
    var oSelected = CallInternalDialogFunction(function(){return GetSelectedNodeJSON();});

    if(oSelected != null && oSelected.nodeDisplayPath != ""){


        if(oSelected.nodePath.length > _maxEntityPathLength){
            ShowMessageBox(jQuery("#hidMsgEntityPathTooLong").val());
            return;
        }

        if(oSelected.pathNodeType == "master_entity"){
            ShowMessageBox(jQuery("#hidMsgMasterEntitiesNotAllowed").val());
            return;
        }

        //Close window
        closeCurrentModalWindow();

        //Save selected node
        jQuery("#txtDisplayEntityPath").val(oSelected.nodeDisplayPath);
        jQuery("#hidEntityPath").val(oSelected.nodePath);
        
    }
}


//--------------------- Checks fields before saving dimension ---------------------//

function ValidateFields(){
    if($.trim(document.getElementById("txtNameEdit").value) == ""){
        ShowMessageBox(document.getElementById("hidMsgFillAllFields").value + " : " + document.getElementById("lblNameEdit").innerHTML.replace(":",""));
        return false;
    }

    if($.trim(document.getElementById("txtDisplayNameEdit").value) == ""){
        ShowMessageBox(document.getElementById("hidMsgFillAllFields").value + " : " + document.getElementById("lblDisplayNameEdit").innerHTML.replace(":",""));
        return false;
    }

    if($.trim(document.getElementById("txtDisplayEntityPath").value) == ""){
        ShowMessageBox(document.getElementById("hidMsgFillAllFields").value + " : " + document.getElementById("lblEntityPathEdit").innerHTML.replace(":",""));
        return false;
    }
    
    document.getElementById("txtNameEdit").value = document.getElementById("txtNameEdit").value.toString().replace(/\"/g,"").replace(/'/g, ""); 
    document.getElementById("txtDisplayNameEdit").value = document.getElementById("txtDisplayNameEdit").value.toString().replace(/\"/g,"").replace(/'/g, ""); 
    
    return true;
}



//---------------------------------------------------
//-------------------  Ajax calls -------------------
//---------------------------------------------------

function  LoadDimensionList(){
    callAjaxMethod(_ajaxGatewayUrl + "?action=" + _iAjaxActionCode + "&op=list", LoadDimensionList_CallBack);
}

function LoadDimensionList_CallBack(result){
    var oResult = BAEval(" (" + result + ")");

    if(oResult.ERROR != null){
        window.alert("Error:\n" + oResult.ERROR);
        return;
    }
    
    _arrDimensions = oResult.Dimensions; 
    RefreshDimensionList();
}


function SaveDimension(){

    if(!ValidateFields())
        return;

    var oCombo = document.getElementById("ddlProcess");
    if(IsDimensionModified())
    {    
        //Ask for a confirmation only when entity path has changed
        if(IsEntityPathModified())
            if(!window.confirm(document.getElementById("hidMsgConfirmEdit").value))
                return;

        var oSelWfClass =  BAEval("(" + jQuery("#ddlProcess").val() + ")");
        
        var sUrl = _ajaxGatewayUrl + "?action=" + _iAjaxActionCode + "&op=save"
                    + "&dimId=" + document.getElementById("txtIdEdit").value
                    + "&dimName=" + document.getElementById("txtNameEdit").value
                    + "&dimDisplayName=" + document.getElementById("txtDisplayNameEdit").value
                    + "&dimDescription=" + document.getElementById("txtDescriptionEdit").value
                    + "&dimWfClassId=" + oSelWfClass.IdWfClass
                    + "&dimWfClsDisplayName=" + oCombo.options[oCombo.selectedIndex].text
                    + "&dimEntityPath=" + document.getElementById("hidEntityPath").value
                    + "&dimDisplayEntityPath=" + document.getElementById("txtDisplayEntityPath").value
                    ;
        
        callAjaxMethod(sUrl, SaveDimension_CallBack);
    }
    else{
        ShowMessageBox(document.getElementById("hidMsgNoChangesToSave").value);
    }
}


function SaveDimension_CallBack(result){
    var oResult = BAEval(" (" + result + ")");

    if(oResult.ERROR != null){
        window.alert("Error:\n" + oResult.ERROR);
        return;
    }

    var oSavedDimension = oResult.Dimension;
    var indexSavedDim = -1;

    for( var iDimensionIndex = 0; iDimensionIndex < _arrDimensions.length; ++iDimensionIndex ){
        
        var oCurDim = _arrDimensions[iDimensionIndex];        
        if(oCurDim.IsAdministrable && oCurDim.Id == oSavedDimension.Id){
            indexSavedDim = iDimensionIndex;
            break;
        }
    }
    
    if(indexSavedDim >= 0 ){
        //Modified dimension
        _arrDimensions[indexSavedDim] = oSavedDimension;
    }
    else{
        //New dimension
        _arrDimensions.splice(_arrDimensions.length, 0, oSavedDimension);        
    }

    RefreshDimensionList();
    SelectDimensionItem(oSavedDimension);
}

function DeleteDimension(){

    if(window.confirm(document.getElementById("hidMsgConfirmDelete").value)){
        var sUrl = _ajaxGatewayUrl + "?action=" + _iAjaxActionCode + "&op=delete"
                   + "&dimId=" + document.getElementById("txtIdEdit").value
                   ;

        callAjaxMethod(sUrl, DeleteDimension_CallBack);
    }
}

function DeleteDimension_CallBack(result){
    
    var oResult = BAEval(" (" + result + ")");

    if(oResult.ERROR != null){
        window.alert("Error:\n" + oResult.ERROR);
        return;
    }

    var idxDimensionToDelete = -1;
    for( var iDimensionIndex = 0; iDimensionIndex < _arrDimensions.length; ++iDimensionIndex ){
        
        var oCurDim = _arrDimensions[iDimensionIndex];        
        if(oCurDim.IsAdministrable && oCurDim.Id == _curSelectedDimension.Id){
            idxDimensionToDelete = iDimensionIndex;
            break;
        }
    }
    
    if(idxDimensionToDelete >= 0)
        _arrDimensions.splice(idxDimensionToDelete, 1);
    
    RefreshDimensionList();
    SelectDefaultListItem();
}

//------------------- Utils ---------------------------

function callAjaxMethod(url, successFunction) {
    $.ajax({
      url: url,
      success: successFunction,
      error : function(errData){ window.alert("Ajax failure: " +  errData); }
    });
}


function BAEval(oValue){
    try{
        return eval(oValue);
    }
    catch(ex){
        window.alert("ERROR evaluating JSON string:\n " + oValue);
        return null;
    }
}


function ShowMessageBox(msg){
    var iHeight = 200;
    var iWidth = 350;
    
    var $dialog = $("<div><div style=\"overflow: auto; height:100px;\" >" + msg + "</div></div>")
			.dialog({
				autoOpen: false,
				title: "Bizagi",
				width: iWidth,
				height: iHeight,
				modal:true,
				buttons: {
				    "Ok"    : function(){
				                $(this).dialog('close');                
				                $(this).dialog('destroy');                
				              }
				    }
			});

    $dialog.dialog('open');
}


