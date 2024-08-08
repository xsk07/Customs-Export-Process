/*
This javascript contains all the code used in order to display the frames
in the main page.
*/

///Hides or shows the left panel. This operations change the with of each frame. 
///The first frame is the panel, the second is the vertical toogle (bar) and the last one
//Is the main panel
function BAHideLeftPanel(bHide){    
    if (bHide){
        if (parent.document.getElementById('ToggleSidePane')) parent.document.getElementById('ToggleSidePane').cols = "0,10,*";
    }
    else{
        if(parent.document.getElementById('ToggleSidePane')) parent.document.getElementById('ToggleSidePane').cols = "200,10,*";
    }
    if (parent.VerticalToggle) parent.VerticalToggle.BAVerifyImage();
    
}
///When the user clicks a case icon, a new frame is displayed. This method
//Close the summary frame
function BACloseSummaryFrame(){
	if (parent.document.getElementById('HorizontalToggle')) parent.document.getElementById('HorizontalToggle').rows = "33,*,0";
}
//This method refresh the summary frame in the bottom of the main frame
function BARefreshSummaryFrame(){
	parent["BACaseSummary"].location =  parent["BACaseSummary"].location;
}


