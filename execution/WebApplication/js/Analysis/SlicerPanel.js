var _arrSlicers = [];


//------------- Refreshes everything about filters in the given container. ----------------------//
function SLC_InitSlicerPanel() {

    var sStoredQuery = jQuery("#hidUserQuerySlicers").val();

    if (sStoredQuery != null && sStoredQuery != '') {

        var oStoredSlicers = _SLC_Eval("(" + sStoredQuery + ")");

        if (oStoredSlicers.ERROR != null) {
            //Do not use stored slicers if an error is detected in any dimension
            window.alert(oStoredSlicers.ERROR);
        }
        else {
            //Use stored slicers

            var arrStoredList;

            if (oStoredSlicers.Slicers != null)
            //Old minified format is used
                arrStoredList = oStoredSlicers.Slicers;
            else
            //New enlarged format is used
                arrStoredList = oStoredSlicers;

            for (var iSlc = 0; iSlc < arrStoredList.length; ++iSlc)
                _arrSlicers[iSlc] = GetNewFilterObject(arrStoredList[iSlc], iSlc);
        }

    }

    SLC_RefreshSlicerDisplay();
}



//------------- ReDraws the slicer array ----------------------//
function SLC_RefreshSlicerDisplay() {
    var sNewContent = '<table><tr>';

    for (var i = 0; i < _arrSlicers.length; ++i) {
        sNewContent += "<td>";
        sNewContent += SLC_GetSlicerHtml(i, _arrSlicers[i]);
        sNewContent += "</td>";
    }
    sNewContent += "<td>";
    sNewContent += SLC_GetAddSlicerHtml();
    sNewContent += "</td>";
    sNewContent += "</tr></table>";

    jQuery("#divSlicers").each(function () { this.innerHTML = sNewContent; });
    $("#divSlicers").trigger("SlicerMyTeamHideClose");
}

//------------- Generates html for add slicer button  ----------------------//
function SLC_GetAddSlicerHtml() {
    var sHtml = '';
    sHtml += "<table cellpadding='2' cellspacing='0' style='width:18px; border:solid 1px #DDDDDD'>";
    sHtml += "<tr height= '42px'>";
    sHtml += "<td onclick='SLC_ShowSlicerForm(-1);' style='cursor:pointer; border-right:solid 1px #DDDDDD; width:18px; background:#E6E9EA'><img alt='Add filter...' src='../../img/analysis/funnel_add.png'/></td>";
    sHtml += "</tr>";
    sHtml += "</table>";
    return sHtml;
}


//------------- Generates html for a single slicer ----------------------//
function SLC_GetSlicerHtml(slicerIndex, slicer) {

    
    var curSlicer = GetNewFilterObject(slicer);
    
    var sPoints = curSlicer.values.length > 1 ? "(...)" : "";

    var sDimensionName = curSlicer.dimension.text;
    var sFilterText = curSlicer.values[0].text;

    var sMaxLength = 16;
    var nameDimensionWithoutSpaces = SLC_FixDisplayStr(sDimensionName).replace(/ /g, "_");

    var sHtml = '';
    sHtml += "<table cellpadding='2' cellspacing='0' style='width:160px; border:solid 1px #DDDDDD'>";
    sHtml += "   <tr>";
    sHtml += "       <td rowspan='2' onclick='SLC_ShowSlicerForm(" + slicerIndex + ");' style='cursor:pointer; border-right:solid 1px #DDDDDD; width:18px; background:#E6E9EA'><img alt='Edit filter...' src='../../img/analysis/funnel.png'/></td>";
    sHtml += "       <td> <div id ='slicerName'" + nameDimensionWithoutSpaces + "'  style=\"overflow:hidden;height:16px;\">" + SLC_FixDisplayStr(sDimensionName) + "</div></td>";
    sHtml += "       <td id='RemoveSlicerItem' ><a href='javascript:SLC_DeleteSlicer(" + slicerIndex + ");'><img alt='Remove filter' src='../../img/analysis/deleteFilter.png' /></a></td>";
    sHtml += "   </tr>";
    sHtml += "   <tr style='background:#E6E9EA'>";
    sHtml += "       <td ><div style=\"overflow:hidden;height:19px;\">" + SLC_FixDisplayStr(sFilterText) + "</div></td>";
    sHtml += "       <td>" + sPoints + "</td>";
    sHtml += "   </tr>";
    sHtml += "</table>";
    return sHtml;
}


//------------- corrects a string before displaying in on the screen ----------------------//
function SLC_FixDisplayStr(str) {
    var sNewString = str.replace(/>/g, "_").replace(/</g, "_").replace(/\"/g, "_").replace(/\'/g, "_");
    return sNewString;
}


//------------- Deletes the given slicer from its container ----------------------//
function SLC_DeleteSlicer(slicerIndex) {
    _arrSlicers.splice(slicerIndex, 1);
    SLC_RefreshSlicerDisplay();
    SLC_UpdateCharts();
}


function ClearSlicerPanel() {
    _arrSlicers = new Array();
    SLC_RefreshSlicerDisplay();
}

function SLC_UpdateCharts() {
    ExecuteNewSearch();
}


//----------------------------------------------------------------------//
// Converts a slicer object into its minified version 
//----------------------------------------------------------------------//
function GetOldFormatFilter(newFilterObject) {

    var oOldFilter = new Object();

    //Dimension data
    oOldFilter.DimensionId = newFilterObject.dimension.id;
    oOldFilter.DimensionName = "";
    oOldFilter.IsAdministrable = newFilterObject.dimension.isAdministrable;

    //Members
    oOldFilter.MemberIdArray = [];
    for (var i = 0; i < newFilterObject.values.length; ++i) {
        oOldFilter.MemberIdArray[i] = newFilterObject.values[i].id == 0 ? "NULL" : newFilterObject.values[i].id.toString();
    }

    //Filter text         
    oOldFilter.Text = "";

    return oOldFilter;
}


//----------------------------------------------------------------------//
// Converts all the slicer array to its minified version and then to a 
// JSON formatted string, in order to send it as a report url  parameter
// to the server
//----------------------------------------------------------------------//
function GetEncodedFilterSet_ShortFormat() {
    var oSlicerSet = new Object();
    oSlicerSet.Slicers = [];

    //Populate array
    for (var i = 0; i < _arrSlicers.length; ++i) {
        oSlicerSet.Slicers.push(GetOldFormatFilter(_arrSlicers[i]));
    }


    return JSON.encode(oSlicerSet);
}

//----------------------------------------------------------------------//
// Converts all the slicer array to its enlarged version and then to a 
// JSON formatted string, in order to save the query values.
//----------------------------------------------------------------------//
function GetEncodedFilterSet_LongFormat() {
    return JSON.encode(_arrSlicers);
}

//------ Ensures backwards compatibility with old format slicer objects -------//
function GetNewFilterObject(oldFilterObject, slicerIndex) {

    if (oldFilterObject.dimension) {
        //Already in new format, attach index and return the same object
        oldFilterObject.index = slicerIndex;
        return oldFilterObject;
    }

    var oNewFilter = new Object();

    oNewFilter.index = slicerIndex;
    oNewFilter.type = "tree";

    //Dimension data 
    oNewFilter.dimension = new Object();
    oNewFilter.dimension.id = oldFilterObject.DimensionId;
    oNewFilter.dimension.text = oldFilterObject.DimensionName;
    oNewFilter.dimension.isAdministrable = false;

    //Members
    oNewFilter.values = [];

    for (var i = 0; i < oldFilterObject.MemberIdArray.length; ++i) {
        var newItem;
        newItem = { id: oldFilterObject.MemberIdArray[i], text: "member_" + i + "_name", path: oldFilterObject.MemberIdArray[i] };
        oNewFilter.values.push(newItem);
    }

    return oNewFilter;
}


//------ Shows the filter window to edit a specific slicer or create a new one ---------//
function SLC_ShowSlicerForm(slicerIndex) {

    //Find WorkflowId and WFClassId
    var oParameters = GetReportParameters();

    if (oParameters.wfclassId < 0 && oParameters.workflowId < 0 && oParameters.counterId < 0 && oParameters.stopwatchId < 0)
        return;

    //Show filter window
    if (slicerIndex >= 0) {
        var oNewFormatFilter = GetNewFilterObject(_arrSlicers[slicerIndex], slicerIndex);
        openFilterDetail(oParameters.workflowId, oParameters.wfclassId, oParameters.reportSetId, oNewFormatFilter);
    }
    else
        openFilterDetail(oParameters.workflowId, oParameters.wfclassId, oParameters.reportSetId);
}

//----------------------- Evaluate and show exception message ------------------------//

function _SLC_Eval(oValue) {
    try {
        return eval(oValue);
    }
    catch (ex) {
        window.alert("ERROR evaluating JSON string:\n " + oValue);
        return null;
    }
}



//---------- Function to be called from inside filter edition dialog ----------------//
function SaveFilter(oFilter) {

    var iNewSlicerIndex = oFilter.index;

    //Add or replace slicer
    if (iNewSlicerIndex < 0) {
        oFilter.index = 0;
        _arrSlicers.splice(_arrSlicers.length, 0, oFilter);
    }
    else
        _arrSlicers[iNewSlicerIndex] = oFilter;

    //Draw!
    SLC_RefreshSlicerDisplay();
    SLC_UpdateCharts();
}