
var curFixedRangeId= "";

var sParamDateFrom;
var sParamDateTo;
var bFilterIsLoaded = false;

//var bIsFirstUpdate = true;

j$(document).ready(function () {
    CreateDateSlider();
    SelectFixedRange('FixR_YTD');
});

function ExecuteNewSearch(){
    sParamDateFrom = document.getElementById("txt_dtmFrom").value;
    sParamDateTo = document.getElementById("txt_dtmTo").value;

    bFilterIsLoaded = true;


    if(parent.ExecuteNewSearch)
        parent.ExecuteNewSearch();
}


/* Refresh reports if date range has changed */
function Query_If_RangeHasChanged(){

    var sFrom = document.getElementById("txt_dtmFrom").value;
    var sTo = document.getElementById("txt_dtmTo").value;

    if(sFrom != sParamDateFrom || sTo != sParamDateTo)
        ExecuteNewSearch();
}

/*  Force updating the slider bar (by focus-unfocus date text controls) 
    then check for range change */
function FocusBlurDateTextControls(){
    var txtDateFrom     = document.getElementById("txt_dtmFrom");    
    var txtDateTo       = document.getElementById("txt_dtmTo");    
    // Next lines avoid IE compatibility problems with readonly input items focus
    try {
        txtDateFrom.focus();
        txtDateTo.focus();
        txtDateTo.blur(); 
    } catch (e) {}
    Query_If_RangeHasChanged();
}


/*Select a fixed date range, if range is valid then invoque slider update */
function SelectFixedRange(rangeId){

    //Determine wheter to use a given userquery daterange or use the one received as parameter 
    var qryFixedDateRange = parent.document.getElementById('hidFixedDateRange').value;
    if(qryFixedDateRange != null && qryFixedDateRange != ''){
        rangeId = qryFixedDateRange;
        parent.document.getElementById('hidFixedDateRange').value = '';
    }

    //Change cur fixed range
    var prevFixedRange= document.getElementById(curFixedRangeId);
    if(prevFixedRange != null)
        prevFixedRange.className= "Analysis_CellNoSelected";
    curFixedRangeId = rangeId;


    //if a valid fixed range is given then reset search range    
    var newFixedRange= document.getElementById(rangeId);
    if(newFixedRange != null){
        newFixedRange.className= "Analysis_CellSelected";                    
        
        var txtDateFrom     = document.getElementById("txt_dtmFrom");    
        var txtDateTo       = document.getElementById("txt_dtmTo");    
        
        var hidDateFrom     = document.getElementById("Hid" + rangeId);    
        var hidDateToday    = document.getElementById("HidFixR_Today");        
        
        var sDateNewRangeFrom   = hidDateFrom.value;    
        var sParamDateToday     = hidDateToday.value;
        
        txtDateFrom.value   = sDateNewRangeFrom;
        txtDateTo.value     = sParamDateToday;  
        
        FocusBlurDateTextControls();
    }       
}

function OverFixedRange(rangeId){
    var newFixedRange= document.getElementById(rangeId);
    if(newFixedRange != null)
        newFixedRange.className= "Analysis_CellSelected";                    
}

function OutFixedRange(rangeId){
    var newFixedRange= document.getElementById(rangeId);
    if(newFixedRange != null && rangeId != curFixedRangeId)
        newFixedRange.className= "Analysis_CellNoSelected";                    
}

function UnSelectFixedRange(){
    SelectFixedRange("");
}

function EndDragSlider(){
    UnSelectFixedRange();
    Query_If_RangeHasChanged();
}

function CreateDateSlider(){
    var l_oOptions = {
        dragHandles:true,
        dragBar :true,
        dateFormat : BA_DATE_FORMAT_MASK,
        onEnd : EndDragSlider
    };
    var minSliderYear= parseInt(document.getElementById('HidMinSliderYear').value);
    var maxSliderYear= parseInt(document.getElementById('HidMaxSliderYear').value);

    //p_oDateSlider = new DateSlider('divTimeLine', '2008-May-01', '2008-May-31', 2006, 2009, l_oOptions);	
    var p_oDateSlider = new DateSlider('divTimeLine', '2008-May-01', '2008-May-31', minSliderYear, maxSliderYear, l_oOptions);
    p_oDateSlider.attachFields($('txt_dtmFrom'), $('txt_dtmTo'));


    setTimeout(function () { p_oDateSlider.setSlider($('txt_dtmFrom'), $('txt_dtmTo')); }, 1000);

}
