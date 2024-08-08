// Init page variables
function initPolicyToolbox() {
	var oTabContents = document.getElementById("xpTab1");
	if (oTabContents != null)
		LoadTabs();
	
	BA_LPTOP = BA_LPTOP + document.getElementById("buttonsRow").offsetHeight;	
	BALPLoad();
	BAVerifyBehavior();
	BAInitCheckBoxes();
	setDraggableElements();
	
	// Set link
	// Note: Just one path back because is a relative path from WPLocationFrame.aspx
	try {
		var link = '<span style="cursor:pointer" onclick="LoadMainPage(\'../App/Admin/BusinessPolicies/BusinessPoliciesSelector.aspx\')">Business Policies</span>'
		BASetLocationFromMain(link);
	} catch(e){}
}

// Lock page controls for read only mode
function lockPageControls() {
	var processing = document.getElementById("messageLayer");
	processing.style.visibility = "visible";
	processing.style.display = "block";
	insertAdjacentText(getDescendant(processing, "messageText"), "Read Only");
	
	getDescendant(processing, "messageBackgroundDiv").className = 'readOnlyBackgroundDiv';
	getDescendant(processing, "messageDiv").className = 'readOnlyMessage';
}

function fixMessageLayer() {
    var processing = document.getElementById("messageLayer");
    processing.style.visibility = "hidden";
    processing.style.display = "none";

    var overlays = document.getElementsByClassName("customOverlay");
    var overlay;
    var i;
    for (i = 0; i < overlays.length; i++) {
        overlay = overlays.item(i);
        overlay.style.visibility = "visible";
        overlay.style.display = "block";
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									GET CONTEXT DEFINITIONS									  //////
////////////////////////////////////////////////////////////////////////////////////////////////////////
function getVocabularyContextDefinitions(element){
	startProcessing();
	
	parentElement = WPGetParentControl(element, 'A');
	if (element.getAttribute("BAChecked") == "true"){
		parentElement.className = "WPSelectedNode";
	
	} else {
		parentElement.className = "WPFolderNodeLN";
	}
	
	var selectedVocabularyContexts = getSelectedVocabularyContexts();
	var GetContextDefinitionsActionURL= "App/Ajax/AJAXGateway.aspx?action=2003&idPolicy="+BA_idPolicy+"&sVocabularyContexts="+selectedVocabularyContexts+"&sPathToBaseDirectory="+PATH_TO_BASE_DIRECTORY;
	
	GetContextDefinitionsActionURL = PATH_TO_BASE_DIRECTORY+GetContextDefinitionsActionURL;
	callAjaxURL(GetContextDefinitionsActionURL, getVocabularyContextDefinitions_Callback);
}

function getVocabularyContextDefinitions_Callback(strData) {
    var expression = new RegExp(/(\r\n|\n|\r)/gm);
    var strDataNoSpaces = strData.replace(expression, "");

    var rData = eval("(" + strDataNoSpaces + ")");
	
	document.getElementById('ifrcontextDefinitionsBar').innerHTML = rData.contextDefinitionItemsHTML;
	setDraggableElements();
	setTimeout("endProcessing()", 200);
}

function getSelectedVocabularyContexts(){
	var selectedVocabularyContexts = "";
	//get all the images
	baCheckBoxes = document.getElementsByTagName('img');

	//cycle trough the input fields
	for(var i=0; i < baCheckBoxes.length; i++) {

		//check if the input is a checkbox
		if(baCheckBoxes[i].className == 'BACheckBox' &&
		   baCheckBoxes[i].getAttribute("BAChecked") == "true" &&
		   baCheckBoxes[i].getAttribute("BA_VC_ID") != null) {
			
			selectedVocabularyContexts = selectedVocabularyContexts + baCheckBoxes[i].getAttribute("BA_VC_ID") + ",";
		}
	}
	
	if (selectedVocabularyContexts.length > 0){
		selectedVocabularyContexts = selectedVocabularyContexts.substring(0, selectedVocabularyContexts.length - 1);
	}
	
	return selectedVocabularyContexts;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									DRAG AND DROP STUFF										  //////
////////////////////////////////////////////////////////////////////////////////////////////////////////


function onDragFunction(cloneId,origId)
{
	var obj = document.getElementById(cloneId);
	obj.style.border='1px solid #BFBFBF';
}

var dragDropObj;
function setDraggableElements(){
	dragDropObj = new DHTMLgoodies_dragDrop();
	
	//get all the nodes
	draggableElements = document.getElementsByTagName('SPAN');

	//cycle trough the input fields
	for(var i=0; i < draggableElements.length; i++) {

		//check if the input is a checkbox
		if(draggableElements[i].getAttribute("BADraggable") == 'true') {
			dragDropObj.addSource(draggableElements[i].id, true, true, true, false,'onDragFunction');		
		}
	}
	
	dragDropObj.init(cloneFunction, resolveDestinationFunction); 
}

function cloneFunction(element){
	parentElement = WPGetParentControl(element, 'A');
	clonedElement = parentElement.cloneNode(true);
	clonedElement.style.background = 'white';
	clonedElement.style.opacity = 66/100;
	clonedElement.style.filter = 'alpha(opacity=' + 66 + ')';	
	getDescendantByClassName(clonedElement, 'BANodeDisplayName').style.fontWeight = 'bold';
	
	return clonedElement;
}

function resolveDestinationFunction(element){
	return BAFindDropTarget(element);
}

function BAFindDropTarget(object){
	try{
		if (object.getAttribute("BADropTarget") == 'true') {
			return object;
		}
	} catch(e) {}
	if (object.parentNode == null) {
		return null;
	}
	
	return BAFindDropTarget(object.parentNode);
 }
 
////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									MISC METHODS											  //////
////////////////////////////////////////////////////////////////////////////////////////////////////////
 
 function resizePolicyToolbox(containerDiv){
	var delta = 24 + document.getElementById("buttonsRow").offsetHeight;
	getwahas();
	
	containerDiv.style.height = winheight - delta;
	BAShowData(oBAActiveContainer.sName);

	var heightScale = 0.8;
	
	document.getElementById("bptPropertiesTab").style.height = (winheight - BA_LPTOP) * heightScale;
	document.getElementById("bptVocabularyContextsTab").style.height = (winheight - BA_LPTOP) * heightScale;
	document.getElementById("bptComponentsTab").style.height = (winheight - BA_LPTOP) * heightScale;
	
 }
 
 function validateToolboxProperties(){
	if (document.getElementById('itemToolbox_itemProperties_txtName').value.length == 0){
		showError(BAP_NO_POLICY_NAME);
		return false;
	}
	
	if (document.getElementById('itemToolbox_itemProperties_txtDisplayName').value.length == 0){
		showError(BAP_NO_POLICY_DISPLAY_NAME);
		return false;
	}
	
	if (document.getElementById('itemToolbox_itemProperties_txtDescription').value.length == 0){
		showError(BAP_NO_POLICY_DESCRIPTION);
		return false;
	}
	
	if(document.getElementById('itemToolbox_itemProperties_txtPriority')){
	    if (document.getElementById('itemToolbox_itemProperties_txtPriority').value.length == 0){
		    showError(BAP_NO_POLICY_PRIORITY)
		    return false;
	    }
	}
}