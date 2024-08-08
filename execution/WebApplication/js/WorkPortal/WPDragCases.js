//Script for drag and drop cases
var P0 = null;
var clickedItem = null;
//Assign the ddevents for IE or Mozilla
function BAInitDD(e){
	if (document.all){
		e = event;
	}
	clickedItem = null;
	oPoint = BAGetMouseCoords(e);
	if (parent.parent.BAInitCaseDaD){
		parent.parent.BAInitCaseDaD(e.srcElement.attributes["radNumber"].value,e.srcElement.attributes["idCase"].value,oPoint.x,oPoint.y);
	}	

}
function BADDEvents(e,oBAElement){	
	var oImageName = oBAElement.style.backgroundImage;
	oImageName = oImageName.substring(10,oImageName.length-1);
	if (parent.parent.BAPrepareDD){
		parent.parent.BAPrepareDD(oImageName);
	}	
	//alert (oBAElement.style.backgroundImage);
	if (typeof(oBAElement.onselectstart) != 'undefined'){
		if (oBAElement.onselectstart == null){
			oBAElement.onselectstart  = BAInitDD;
		}
	}
	else{
		if(document.all) {
			e = event;
		}
		BADDItemMouseDown(e,oBAElement);
	}
	return false;
}
function BADDItemMouseDown(e,caseImage){
	clickedItem = caseImage;	
	P0 = BAGetMouseCoords(e);
}
function BADDMouseOut(){
	clickedItem = null;
}
function BADDItemMouseMove(e,caseImage){
	if (clickedItem != null && caseImage == clickedItem){
		//Only for mozilla
		if(document.all) {
			e = event;
		}
		var P1 = BAGetMouseCoords(e);		
		if (((P1.x-P0.x)*(P1.x-P0.x)+(P1.y-P0.y)*(P1.y-P0.y))>9){
			clickedItem = null;
			if (parent.parent.BAInitCaseDaD){
				parent.parent.BAInitCaseDaD(caseImage.attributes["radNumber"].value,caseImage.attributes["idCase"].value,P1.x,P1.y);
			}			
		}	
	}  
}

function BALoaDDPage(){
	document.body.onselectstart = cancelEvent;
	document.body.ondragstart = cancelEvent;
}
