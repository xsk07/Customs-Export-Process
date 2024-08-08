
function PhaseSelected(idPhase){
    
    var sPhaseJSONControl = "hidPhase_" + idPhase;
    var sJSON = document.getElementById(sPhaseJSONControl).value;
    var oPhase = parent.BAEval(" (" + sJSON + ")");

    parent.ShowHidePhasePanel(true);
    parent.ShowCustomPhase(oPhase);

    ChangeSelectedCellStyle(idPhase);

}


function ChangeSelectedCellStyle(phaseId){
    var tblPhases = document.getElementById("tblPhases");
    for( var iRow = 0; iRow < tblPhases.rows.length; ++iRow){
      var oCurCell = tblPhases.rows[iRow].cells[0];
      var sCurPhaseId = oCurCell.id.split("_")[1];                
      
      if(oCurCell.className == "phaseProcessCell")  
        continue;
        
      if(sCurPhaseId == phaseId)
           oCurCell.className = "phaseCellSelected";
      else
           oCurCell.className = "phaseCell";
    }
}


function SelectCurrentPhase(){
    if(parent.curPhaseObject != null){
        //Use current phase
        PhaseSelected(parent.curPhaseObject.IdCustomPhase);
    }
    else{
        //Select first phase if no selection has been made
        var tblPhases = document.getElementById("tblPhases");
        if(tblPhases.rows.length > 0){
            var oFirstCell = tblPhases.rows[1].cells[0];
            var sCurPhaseId = oFirstCell.id.split("_")[1];            
            PhaseSelected(parseInt(sCurPhaseId));
        }
        else{
            parent.ShowHidePhasePanel(false);
        }
    }    
}

function NewPhase(){
    parent.ShowHidePhasePanel(true);
    parent.NewPhase();
}