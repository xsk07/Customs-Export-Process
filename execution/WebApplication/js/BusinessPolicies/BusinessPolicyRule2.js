var argumentHtml;
var argumentTemplateHtml;
var operatorHtml;
var operatorComboTemplate;
var functionHtml;
var setDefinitionHtml;
var conditionHtml;
var addConditionHtml;
var addExecutionStatementHtml;
var addElseExecutionStatementHtml;
var executionStatementHtml;

// Set variables to work with common functions
var policyItem = new PolicyRule();
var drawPolicyItemFunction = drawPolicyRule;
var iPanelWidth;

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

	getDescendant(document.getElementById('executionStatementHtml'), 'executionStatement').innerHTML += setDefinitionHtml + argumentHtml; 
	executionStatementHtml = document.getElementById('executionStatementHtml').innerHTML;
	addExecutionStatementHtml = document.getElementById('addExecutionStatementHtml').innerHTML;
	
	var tmpControl = document.getElementById('addExecutionStatementHtml');
	getDescendant(tmpControl, "btnAddExecutionStatement").onclick = "addExecutionStatement(true);";

	if (!isIE)
	    tmpControl.innerHTML = tmpControl.innerHTML.replace('addExecutionStatement(false);', 'addExecutionStatement(true);');

	addElseExecutionStatementHtml = tmpControl.innerHTML;
	
	// Add global drop targets
	dragDropObj.addTarget('divIf' ,'pnlConditionDrop'); 	
	dragDropObj.addTarget('divThen' ,'pnlThenElseDrop'); 	
	dragDropObj.addTarget('divElse' ,'pnlThenElseDrop'); 	
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									DRAW METHODS									  //////
////////////////////////////////////////////////////////////////////////////////////////////////////////

function drawPolicyRule(paramPolicyItem){
	// Do nothing if rule is not fully loaded
	if (bMainMethodEnded == false) {
		return;
	}
	
	// Assign parameter to global variable
	if (typeof(paramPolicyItem) != 'undefined' &&
		paramPolicyItem.className == 'PolicyRule')
		policyItem = paramPolicyItem;
	
	// set Else
	document.getElementById("chkElse").setAttribute("BAChecked", policyItem.useElse);
	BASetCheckBoxImage(document.getElementById("chkElse"));
	
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
	
	// Clear then panel
	var currDiv = document.getElementById("divThen");
	currDiv.innerHTML = policyItem.executionStatementsHeaderHtml;
	for (var i=0; i < policyItem.executionStatements.length; i++){
		
		drawExecutionStatement(currDiv, policyItem.executionStatements[i]);
	}
	currDiv.innerHTML += addExecutionStatementHtml;
	
	if (policyItem.useElse)	{
		// Clear else panel
		var currDiv = document.getElementById("divElse");
		currDiv.innerHTML = policyItem.executionStatementsHeaderHtml;
		for (var i=0; i < policyItem.elseExecutionStatements.length; i++){
			
			drawExecutionStatement(currDiv, policyItem.elseExecutionStatements[i]);
		}
		currDiv.innerHTML += addElseExecutionStatementHtml;
		document.getElementById("elseRow").style.display = "";
	
	} else {
		document.getElementById("elseRow").style.display = "none";
	}
	
	resizePanels();
}

function calculatePanelWidth(){
	if (document.getElementById("ruleDesignContent").clientWidth == 0)
		return 0;
	
	return document.getElementById("ruleDesignContent").clientWidth - 95;
}

function clearPanels() {
	document.getElementById("divIf").innerHTML = '';
	document.getElementById("divThen").innerHTML = '';
	document.getElementById("divElse").innerHTML = '';
	
	document.getElementById("divIf").style.width = 'auto';
	document.getElementById("divThen").style.width = 'auto';
	document.getElementById("divElse").style.width = 'auto';
}

function resizePanels(){
	resizePolicyToolbox(document.getElementById("ruleDesignContent"));
	
	// Adjust internal panels
	iPanelWidth = (iPanelWidth == 0) ? (calculatePanelWidth()) : iPanelWidth;
	iPanelWidth = iPanelWidth + "px";
	var panelHeight = policyItem.useElse ? '33%' : '50%';
	
	document.getElementById("divIf").style.height = 0;
	document.getElementById("divThen").style.height = 0; 
	document.getElementById("divElse").style.height = 0;
	
	document.getElementById("ifRow").style.height = panelHeight;
	document.getElementById("thenRow").style.height = panelHeight;
	document.getElementById("elseRow").style.height = panelHeight;
	
	document.getElementById("divIf").style.width = iPanelWidth;
	document.getElementById("divThen").style.width = iPanelWidth;
	document.getElementById("divElse").style.width = iPanelWidth;

	if (isIE && (document.getElementById("ifRow").offsetHeight - 60) < 150)
	    document.getElementById("divIf").style.height = "150px";
	else
	    document.getElementById("divIf").style.height = document.getElementById("ifRow").offsetHeight - 60 + "px";

	if (isIE && (document.getElementById("thenRow").offsetHeight - 70) < 150)
	    document.getElementById("divThen").style.height = "150px";
	else
	    document.getElementById("divThen").style.height = document.getElementById("thenRow").offsetHeight - 70 + "px";
	
	if (policyItem.useElse) 	{
	    document.getElementById("divElse").style.height = document.getElementById("elseRow").offsetHeight - 70 + "px";
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									LOAD / SAVE METHODS									      //////
////////////////////////////////////////////////////////////////////////////////////////////////////////

// Load the xml into the javascript object
function loadPolicyRule(xmlCode){
	policyItem = loadPolicyRuleXml(xmlCode, drawPolicyItem);
	window.onresize = drawPolicyRule;
}

function savePolicyRule() {
    startProcessing();
	document.getElementById('policyItemXml').value = policyItem.getXml();
	document.getElementById('selectedVocabularyContexts').value = getSelectedVocabularyContexts();
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

function reloadPolicyRule(){
	document.getElementById('bSavePolicyItem').value = false;
	
	document.forms['frmPolicyItem'].submit();
}