var argumentHtml;
var argumentTemplateHtml;
var operatorHtml;
var operatorComboTemplate;
var functionHtml;
var setDefinitionHtml;
var conditionHtml;
var addConditionHtml;

// Set variables to work with common functions
var policyItem = new Precondition();
var drawPolicyItemFunction = drawPrecondition;
var iPanelWidth;
var Heights;

function loadPageVariables(){
	argumentHtml = document.getElementById('argumentHtml').innerHTML;
	argumentTemplateHtml = document.getElementById('argument').innerHTML;
	operatorHtml = document.getElementById('operatorHtml').innerHTML;
	operatorComboTemplate = document.getElementById('operatorComboHtml');
	functionHtml = document.getElementById('functionHtml').innerHTML;
	setDefinitionHtml = document.getElementById('setDefinitionHtml').innerHTML;
	
	getDescendant(document.getElementById('conditionHtml'), 'condition').innerHTML += argumentHtml + operatorHtml + argumentHtml; 
	conditionHtml = document.getElementById('conditionHtml').innerHTML;
	addConditionHtml = document.getElementById('addConditionHtml').innerHTML;

	// Add global drop targets
	dragDropObj.addTarget('divIf' ,'pnlConditionDrop'); 	
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									ADD/DELETE METHODS										  //////
////////////////////////////////////////////////////////////////////////////////////////////////////////

// Adds a condition
function addCondition(newCondition){
	if (newCondition == null)
		newCondition = policyItem.createCondition(1);

	// Add the condition in the object
	policyItem.conditions.push(newCondition);
	
	// Redraw the policy rule
	drawPolicyItem();
}

// Deletes a condition
function  deleteCondition(conditionControl){
	var condition = policyItem.getConditionByControlId( conditionControl.id );
	policyItem.deleteCondition(condition);
	
	// Redraw the policy rule
	drawPolicyItem();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									DRAW METHODS									  //////
////////////////////////////////////////////////////////////////////////////////////////////////////////

function drawPrecondition(paramPolicyItem){
	// Do nothing if rule is not fully loaded
	if (bMainMethodEnded == false) {
		return;
	}
	
	// Assign parameter to global variable
	if (typeof(paramPolicyItem) != 'undefined' &&
		paramPolicyItem.className == 'Precondition')
		policyItem = paramPolicyItem;
	
	// Clear panels
	clearPanels();
	// Calculate max width
	iPanelWidth = calculatePanelWidth();
	
	var value = getDescendant(conditionType, 'conditionType_value').value;
	
	if (policyItem.conditionType != value){
		changeConditionType(policyItem.conditionType);
	}
	
	// Clear if panel
	document.getElementById("divIf").innerHTML = policyItem.conditionsHeaderHtml;
	for (var i=0; i < policyItem.conditions.length; i++){
		
		drawCondition(policyItem.conditions[i]);
	}
	document.getElementById("divIf").innerHTML += addConditionHtml;
	
	resizePanels();
}

function calculatePanelWidth(){
	if (document.getElementById("ruleDesignContent").clientWidth == 0)
		return 0;
	
	return document.getElementById("ruleDesignContent").clientWidth - 95;
}

function clearPanels() {
	document.getElementById("divIf").innerHTML = '';
	
	document.getElementById("divIf").style.width = 'auto';
}

function resizePanels(){
	resizePolicyToolbox(document.getElementById("ruleDesignContent"));
	
	// Adjust internal panels
	iPanelWidth = (iPanelWidth == 0) ? (calculatePanelWidth()) : iPanelWidth;
	iPanelWidth = iPanelWidth + "px";
	var panelHeight = '100%';
	Heights = document.getElementById("ifRow").offsetHeight <= 500 ? 500 : document.getElementById("ifRow").offsetHeight;

	document.getElementById("divIf").style.height = 0;
	document.getElementById("ifRow").style.height = panelHeight;

	document.getElementById("divIf").style.width = iPanelWidth;
	document.getElementById("divIf").style.height = Heights - 60 + "px";

}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									LOAD / SAVE METHODS									      //////
////////////////////////////////////////////////////////////////////////////////////////////////////////

// Load the xml into the javascript object
function loadPrecondition(xmlCode){
	policyItem = loadPreconditionXml(xmlCode, drawPolicyItem);
	window.onresize = drawPrecondition;
}

function savePrecondition(){
	document.getElementById('policyItemXml').value = policyItem.getXml();
	document.getElementById('bSavePolicyItem').value = true;
	
	var bValidated = validateProperties();
	
	if (bValidated)
		document.forms['frmPolicyItem'].submit();
}

function validateProperties(){
	if (validateToolboxProperties() == false){
		return false;
	}
	
	return  policyItem.isValid();
}

function reloadPrecondition(){
	document.getElementById('bSavePolicyItem').value = false;
	
	document.forms['frmPolicyItem'].submit();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									MISC METHODS											  //////
////////////////////////////////////////////////////////////////////////////////////////////////////////
// Changes the condition type when the user presses the link
function changeConditionType(newValue){
	var conditionType = document.getElementById('conditionType');
	var value = newValue;
	
	if (value == 1){  // switch to or
		getDescendant(conditionType, 'andLabel').style.display =  'inline';
		getDescendant(conditionType, 'orLabel').style.display =  'none';
		getDescendant(conditionType, 'conditionType_value').value = 1;
		getDescendants(document.getElementById('ruleDesignContent'), 'conditionTypeOption')[0].checked = true;
		policyItem.conditionType = 1;
	
	} else { // switch to and
		getDescendant(conditionType, 'orLabel').style.display =  'inline';
		getDescendant(conditionType, 'andLabel').style.display =  'none';
		getDescendant(conditionType, 'conditionType_value').value = 2;
		getDescendants(document.getElementById('ruleDesignContent'), 'conditionTypeOption')[1].checked = true;
		policyItem.conditionType = 2;		
	}	
}