var argumentHtml;
var argumentTemplateHtml;
var operatorHtml;
var setDefinitionHtml;
var controlStack;
var conditionHtml;
var addConditionHtml;
var addExecutionStatementHtml;
var executionStatementHtml;
var policyRule = new PolicyRule();
var controlsLocked = false;

function lockPageControls(){
	// Properties controls
	document.getElementById('policyRuleName').readOnly = true;
	document.getElementById('policyRuleDisplayName').readOnly = true;
	document.getElementById('policyRuleDescription').readOnly = true;
	document.getElementById('policyRulePriority').readOnly = true;
	document.getElementsByName('policyRuleEnabled')[0].disabled = true;
	document.getElementsByName('policyRuleEnabled')[1].disabled = true;
	document.getElementById('policyRuleEnabledFromDate').readOnly = true;
	document.getElementById('policyRuleEnabledToDate').readOnly = true;
	document.getElementById('policyRuleEnabledFromDateLink').onclick = null;
	document.getElementById('policyRuleEnabledToDateLink').onclick = null;
	
	// Lock AND / OR link
	document.getElementsByName('conditionTypeOption')[0].disabled = true;
	document.getElementsByName('conditionTypeOption')[1].disabled = true;
	
	// Lock Reload Rule / Save Rule buttons
	document.getElementsByName('btnReloadRule')[0].disabled = true;
	document.getElementsByName('btnSaveRule')[0].disabled = true;
	
	controlsLocked = true;
}

function disableEvents(){
	disableEventByClass('definition', 'onclick');
	disableEventByClass('argumentConstant', 'onclick');
	disableEventByClass('function', 'onclick');
	disableEventByClass('operator', 'onclick');
	disableEventByClass('setDefinition', 'onclick');
	disableEventByClass('deleteRow', 'onclick');
	disableEventByClass('addbtn', 'onclick');
}

function loadPageVariables(){
	argumentHtml = document.getElementById('argumentHtml').innerHTML;
	argumentTemplateHtml = document.getElementById('argument').innerHTML;
	operatorHtml = document.getElementById('operatorHtml').innerHTML;
	setDefinitionHtml = document.getElementById('setDefinitionHtml').innerHTML;
	controlStack = new Array();

	getDescendant(document.getElementById('conditionHtml'), 'condition').innerHTML += argumentHtml + operatorHtml + argumentHtml; 
	conditionHtml = document.getElementById('conditionHtml').innerHTML;
	addConditionHtml = document.getElementById('addConditionHtml').innerHTML;

	getDescendant(document.getElementById('executionStatementHtml'), 'executionStatement').innerHTML += setDefinitionHtml + argumentHtml; 
	executionStatementHtml = document.getElementById('executionStatementHtml').innerHTML;
	addExecutionStatementHtml = document.getElementById('addExecutionStatementHtml').innerHTML;
}

// Adds a condition
function addCondition(){
	// Add the condition in the object
	policyRule.conditions.push(new Condition());
	
	// Redraw the policy rule
	drawPolicyRule();
}

// Deletes a condition
function  deleteCondition(conditionControl){
	var condition = policyRule.getConditionByControlId( conditionControl.id );
	policyRule.deleteCondition(condition);
	
	// Redraw the policy rule
	drawPolicyRule();
}

// Adds an execution statement
function  addExecutionStatement(){
	// Add the condition in the object
	policyRule.executionStatements.push(new ExecutionStatement());
	
	// Redraw the policy rule
	drawPolicyRule();
}

// Deletes a condition
function  deleteExecutionStatement(executionStatementControl){
	var executionStatement = policyRule.getExecutionStatementByControlId( executionStatementControl.id );
	policyRule.deleteExecutionStatement(executionStatement);
	
	// Redraw the policy rule
	drawPolicyRule();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									DRAW METHODS									  //////
////////////////////////////////////////////////////////////////////////////////////////////////////////

// Draw the visual elements according the policyRule object
function drawPolicyRule(){
	var value = getDescendant(conditionType, 'conditionType_value').value;
	
	if (policyRule.conditionType != value){
		changeConditionType(policyRule.conditionType);
	}
	
	// Clear if panel
	document.getElementById("divIf").innerHTML = policyRule.conditionsHeaderHtml;
	for (var i=0; i < policyRule.conditions.length; i++){
		
		drawCondition(policyRule.conditions[i]);
	}
	document.getElementById("divIf").innerHTML += addConditionHtml;
	
	// Clear then panel
	document.getElementById("divThen").innerHTML = policyRule.executionStatementsHeaderHtml;
	for (var i=0; i < policyRule.executionStatements.length; i++){
		
		drawExecutionStatement(policyRule.executionStatements[i]);
	}
	document.getElementById("divThen").innerHTML += addExecutionStatementHtml;
	
	
	// Lock controls for mozilla
	if (controlsLocked){
		disableEvents();
	}
}

function drawCondition(oCondition) {
	try {
		document.getElementById('divIf').innerHTML += conditionHtml;
	
		var conditions = getDescendantsByClassName(document.getElementById('divIf'), 'condition');
		var newCondition = conditions[conditions.length - 1];
		
		// Set element id
		newCondition.id = oCondition.controlId;
		
		// Load child elements
		var argument1 = getDescendantsByClassName(newCondition, 'argument')[0];
		var operator = getDescendantByClassName(newCondition, 'operator');
		var argument2 = getDescendantsByClassName(newCondition, 'argument')[1];
		drawArgument(argument1, oCondition.argument1);
		drawOperator(operator, oCondition.operator);
		drawArgument(argument2, oCondition.argument2);
	}catch(e){}
}

function drawExecutionStatement(oExecutionStatement){
	try {
		document.getElementById('divThen').innerHTML += executionStatementHtml;
		
		var executionStatements = getDescendantsByClassName(document.getElementById('divThen'), 'executionStatement');
		var newExecutionStatement = executionStatements[executionStatements.length - 1];
		
		// Set element id
		newExecutionStatement.id = oExecutionStatement.controlId;

		var setDefinition = getDescendant(newExecutionStatement, 'setDefinition');
		var argument = getDescendant(newExecutionStatement, 'argument');
		drawSetDefinition(setDefinition, oExecutionStatement.definition);
		drawArgument(argument, oExecutionStatement.argument);
	}catch(e){}
}

function drawArgument(argumentControl, oArgument){
	getDescendant(argumentControl, 'argument_value').innerHTML	= oArgument.htmlValue();
	
	// Set element id
	argumentControl.id = oArgument.controlId;
	argumentControl.className = oArgument.element.cssClass;
}

function drawOperator(operatorControl, oOperator){
	getDescendant(operatorControl, 'operator_value').innerHTML	= oOperator.htmlValue();
	
	// Set element id
	operatorControl.id = oOperator.controlId;
}

function drawSetDefinition(setDefinitionControl, oSetDefinition){
	getDescendant(setDefinitionControl, 'setDefinition_value').innerHTML = oSetDefinition.htmlValue();
	
	// Set element id
	setDefinitionControl.id = oSetDefinition.controlId;
}

function drawFunction(functionControl, oFunction){
	var i = 0;
	
	// Create inner controls
	functionControl.innerHTML ='';
	functionControl.appendChild(document.createTextNode(oFunction.displayName + '('));
	for (i=0; i< oFunction.numberOfArguments; i++){
		if (i>0)
			functionControl.appendChild(document.createTextNode(','));
		
		var newArgumentControl = document.createElement('SPAN');
		var argumentTemplate = getDescendant(document.getElementById('argumentHtml'), 'argument');
		
		// Set properties
		newArgumentControl.innerHTML = argumentTemplateHtml;
		copyStyle(argumentTemplate, newArgumentControl);	
		copyEvents(argumentTemplate, newArgumentControl);
		
		drawArgument(newArgumentControl, oFunction.arguments[i]);
		
		// Add control
		functionControl.appendChild(newArgumentControl);
	}
	functionControl.appendChild(document.createTextNode(')'));
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									OPERATOR EDITION METHODS								  //////
////////////////////////////////////////////////////////////////////////////////////////////////////////

// Fired when the user clicks the operator area, and shows a popup to edit the field
function editOperator(operatorControl){
	var div = showFloatingDiv(operatorControl, document.getElementById('divEditOperator'));
	var operatorCombo = getDescendant(div, 'editOperatorCombo');
	var oOperator = policyRule.getOperatorByControlId(operatorControl.id);
	
	operatorCombo.value = oOperator.id;
	controlStack.push(operatorControl);
}

// Updates the selected value on the operator
function selectOperator(div){
	var operatorControl = controlStack.pop();
	var operatorId = getDescendant(div, 'editOperatorCombo').value;
	var oOperator = policyRule.getOperatorByControlId(operatorControl.id);
	
	if (operatorId != '0')	{
		var selectedOperator = getOperator(operatorId);
		
		// Copy values from the selected operator
		oOperator.id = selectedOperator.id;
		oOperator.name = selectedOperator.name;
		oOperator.displayName = selectedOperator.displayName;
		oOperator.expression = selectedOperator.expression;
		
	} else {
		oOperator.reset();
	}
	
	closePopup(div);
	
	// Redraw the policy rule
	drawPolicyRule();	
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									SET DEFINITION EDITION METHODS							  //////
////////////////////////////////////////////////////////////////////////////////////////////////////////


// Fired when the user clicks the set definition area, and shows a popup to edit the field
function editSetDefinition(setDefinitionControl){
	var div = showFloatingDiv(setDefinitionControl, document.getElementById('divEditDefinition'));
	var setDefinitionCombo = getDescendant(div, 'setDefinitionCombo');
	var oDefinition = policyRule.getSetDefinitionByControlId(setDefinitionControl.id);
	
	setDefinitionCombo.value = oDefinition.id;
	controlStack.push(setDefinitionControl);
}

// Updates the selected value on the definition
function selectDefinition(div){
	var setDefinitionControl = controlStack.pop();
	var definitionId = getDescendant(div, 'setDefinitionCombo').value;
	var oDefinition = policyRule.getSetDefinitionByControlId(setDefinitionControl.id);
	
	if (definitionId != '0'){
		var selectedDefinition = getDefinition(definitionId);
		
		// Copy values from the selected operator
		oDefinition.id = selectedDefinition.id;
		
		oDefinition.name = selectedDefinition.name;
		oDefinition.displayName = selectedDefinition.displayName;
		oDefinition.definitionUse = selectedDefinition.definitionUse;
		oDefinition.dataType = selectedDefinition.dataType;
		oDefinition.idRelatedEntity = selectedDefinition.idRelatedEntity;
				
		// Changes data type of the argument	
		policyRule.changeOtherArgument(oDefinition);
	
	} else {
		oDefinition.reset();
	}
			
	closePopup(div);
	
	// Redraw the policy rule
	drawPolicyRule();	
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									ARGUMENT EDITION METHODS								  //////
////////////////////////////////////////////////////////////////////////////////////////////////////////
function editArgument(argumentControl){
	var div = showFloatingDiv(argumentControl, document.getElementById('divEditArgument'));
	var oArgument = policyRule.getArgumentByControlId(argumentControl.id);
	var argumentType = oArgument.argumentType;
	
	// Makes a backup of the element
	oArgument.oldElement = oArgument.element;
	
	// Push the control in the satck
	controlStack.push(argumentControl);
	
	// Clear controls
	resetEditArgumentControls(div);
	hideEditArgumentControls(div);
	
	if (argumentType != null) { // if there is an argument type, emulates an argument combo changed event
		getDescendant(div, 'argumentTypeCombo').value = argumentType;
		selectArgumentType(getDescendant(div, 'argumentTypeCombo'));
	}
}


// Method that updates the argument with the changes
function selectArgument(div){
	var argumentControl = controlStack[controlStack.length - 1];
	var argumentTypeCombo = getDescendant(div, 'argumentTypeCombo');
	var argumentType = argumentTypeCombo.value;
	var oArgument = policyRule.getArgumentByControlId(argumentControl.id);
	
	if (argumentType == 1){
		var value = getConstantValue(div, oArgument.dataType);
		
		if (value == '' && oArgument.idRelatedEntity <= 0){
			alert (BAP_NO_CONSTANT_VALUE);
			return;
		}
		
		var argumentConstant = new ArgumentConstant()
		argumentConstant.value = value;
		argumentConstant.dataType = oArgument.dataType;
		argumentConstant.visibleValue = value;
		
		if (oArgument.idRelatedEntity > 0){
			var comboEditor = getDescendantByClassName(div, 'comboEditor');
			
			if (comboEditor.value != '0'){
				argumentConstant.value = comboEditor.value;
				argumentConstant.visibleValue = comboEditor.options[comboEditor.selectedIndex].text;
			}
			
			comboEditor.id = 'comboEditor'
		}		
		
		oArgument.argumentType = 1;
		oArgument.setArgumentConstant(argumentConstant);
		
	} else if (argumentType == 2){
		var definitionId = getDescendant(div, 'getDefinitionCombo').value;
		var oDefinition = getDefinition(definitionId);
		
		if (oDefinition == null){
			alert (BAP_NO_DEFINITION_SELECTED);
			return;
		}
		
		if (oArgument.checkDataType(oDefinition.dataType) == false){
			alert (BAP_DEFINITION_DATATYPE_DOESNT_MATCH);
			return;
		}
		
		oArgument.argumentType = 2;
		oArgument.setDefinition(oDefinition);				
		
	} else if (argumentType == 3) {
		// At this point the child arguments of the function must have been created already
		// Must check if the inner arguments are filled}
		var oFunction = oArgument.element;
		for (var i=0; i<oFunction.numberOfArguments; i++) {
			
			if (oFunction.arguments[i].isEmpty()) {
				alert (BAP_FUNCTION_ARGUMENTS_MUST_BE_FILLED);
				return;
			}
		}
	}	
	
	// Change other argument dataType
	policyRule.changeOtherArgument(oArgument);
	
	controlStack.pop();
	closePopup(div);
	
	// Redraw the policy rule
	if (controlStack.length == 0) {
		drawPolicyRule();
	} else {
		// Redraw the parent function control
		var parentDiv = getParentDiv(argumentControl, 'divEditArgument');
		var parentFunctionControl = getDescendant(parentDiv, 'function');
		var parentFunction = oArgument.parent;
		
		drawFunction(parentFunctionControl, parentFunction);
	}
}

// Cancels a popup window
function cancelEditArgument(div){
	// Cancels the element in th stack
	var argumentControl = controlStack.pop();
	var oArgument = policyRule.getArgumentByControlId(argumentControl.id);
	
	// Restores backup of the element
	oArgument.element = oArgument.oldElement;
	
	// Closes the popup
	closePopup(div);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									LOAD / SAVE METHODS									      //////
////////////////////////////////////////////////////////////////////////////////////////////////////////

// Load the xml into the javascript object
function loadPolicyRule(xmlCode){
	policyRule = loadPolicyRuleXml(xmlCode);
	
	// Redraw the policy rule
	drawPolicyRule();
}

function savePolicyRule(){
	document.getElementById('policyRuleXml').value = policyRule.getXml();
	document.getElementById('saveRule').value = true;
	
	var bValidated = validateProperties();
	
	if (bValidated)
		document.forms['frmPolicyRule'].submit();
}

function validateProperties(){
	if (document.getElementById('policyRuleName').value.length == 0){
		alert(BAP_NO_POLICY_NAME);
		return false;
	}
	
	if (document.getElementById('policyRuleDisplayName').value.length == 0){
		alert(BAP_NO_POLICY_DISPLAY_NAME);
		return false;
	}
	
	if (document.getElementById('policyRuleDescription').value.length == 0){
		alert(BAP_NO_POLICY_DESCRIPTION);
		return false;
	}
	
	if (document.getElementById('policyRulePriority').value.length == 0){
		alert(BAP_NO_POLICY_PRIORITY)
		return false;
	}
	
	return  policyRule.isValid();
}

function reloadPolicyRule(){
	document.getElementById('saveRule').value = false;
	
	document.forms['frmPolicyRule'].submit();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									MISCELANEOUS METHODS									  //////
////////////////////////////////////////////////////////////////////////////////////////////////////////

// Cancels a popup window
function cancelPopup(div){
	// Cancels the element in th stack
	controlStack.pop();
	
	// Closes the popup
	closePopup(div);
}

// Changes the condition type when the user presses the link
function changeConditionType(newValue){
	var conditionType = document.getElementById('conditionType');
	var value = newValue;
	
	if (value == 1){  // switch to or
		getDescendant(conditionType, 'andLabel').style.display =  'inline';
		getDescendant(conditionType, 'orLabel').style.display =  'none';
		getDescendant(conditionType, 'conditionType_value').value = 1;
		getDescendants(document.body, 'conditionTypeOption')[0].checked = true;
		policyRule.conditionType = 1;
	
	} else { // switch to and
		getDescendant(conditionType, 'orLabel').style.display =  'inline';
		getDescendant(conditionType, 'andLabel').style.display =  'none';
		getDescendant(conditionType, 'conditionType_value').value = 2;
		getDescendants(document.body, 'conditionTypeOption')[1].checked = true;
		policyRule.conditionType = 2;		
	}	
}

// Show the constant control in the edit argument div
function showConstantControl(div, oArgumentConstant){
	var dataType = oArgumentConstant.parent.dataType;
	var value = oArgumentConstant.className == 'ArgumentConstant' ? oArgumentConstant.value : '';
	var idRelatedEntity = oArgumentConstant.parent.idRelatedEntity;
	
	if (idRelatedEntity > 0) {
		// Combo control for related entities
		getDescendant(div, 'comboControl').style.display = "inline";
		var comboEditor = getDescendantByClassName(div, 'comboEditor');
		
		// Changes the name to make it unique
		var newIdentifier = 'comboEditor' + oArgumentConstant.internalId;
		comboEditor.id = newIdentifier;
		
		// Get options
		getRelatedEntityValues(newIdentifier, idRelatedEntity, value) ;
	
	} else {
		if (isDatetime(dataType)){ // Datetime editor
			getDescendant(div, 'frmDatetimeTemplate').id = "frmDatetime";
			getDescendant(div, 'dateTimeControl').style.display = "inline";
			getDescendant(div, 'dateTimeEditor').value = unquote(value);
			
		} else if (isNumeric(dataType) || isMoney(dataType)  ){ // Currency editor
			getDescendant(div, 'numericControl').style.display = "inline";
			getDescendant(div, 'numericEditor').value = value;
			getDescendant(div, 'numericEditor').preset = getNamedDataType(dataType);
			
			new BABehaviorElement(getDescendant(div, 'numericEditor'));
			
		} else if (isBoolean(dataType)){ // Boolean editor
			getDescendant(div, 'booleanControl').style.display = "inline";
			if (value == 'true'){
				getDescendants(div, 'booleanEditor')[0].checked = true;
			} else if (value == 'false'){
				getDescendants(div, 'booleanEditor')[1].checked = true;
			}			
		} else { // Text editor by default
			getDescendant(div, 'textControl').style.display = "inline";
			getDescendant(div, 'textEditor').value = unquote(value);
		} 
	}
}

// Ajax method to fill the combo values
function getRelatedEntityValues(comboName, idRelatedEntity, value){
	var getRelatedEntityValuesURL= "App/Ajax/AJAXGateway.aspx?action=10&comboName=" + comboName + "&idRelatedEntity=" + idRelatedEntity + "&value=" + value;
	getRelatedEntityValuesURL = "../../"+getRelatedEntityValuesURL;
	
	callAjaxURL(getRelatedEntityValuesURL,getRelatedEntityValuesCallback);
}

// Ajax method to fill the combo values (Callback)
function getRelatedEntityValuesCallback(strData){
	var rData = eval("("+strData+")");

	eval("" + rData.relatedEntityComboCode + "");
}

// Show the definition control in the edit argument div
function showDefinitionControl(div, oDefinition){
	getDescendant(div, 'getDefinitionCombo').value = oDefinition.id;
}

// Show the function control in the edit argument div
function showFunctionControl(div, oFunction){
	getDescendant(div, 'selectFunctionCombo').value = oFunction.id; 

	// Draw the function
	var functionControl = getDescendant(div, 'function');
	drawFunction(functionControl, oFunction);		
}

// Changes the editor given the argument type
function selectArgumentType(argumentTypeCombo) {
	// Gets argument control
	var argumentControl = controlStack[controlStack.length - 1];
	
	var oArgument = policyRule.getArgumentByControlId(argumentControl.id);
	var div = getParentDiv(argumentTypeCombo, 'divEditArgument');
	var argumentType = 0;
	
	// Hide elements
	hideEditArgumentControls(div);
	
	if (argumentTypeCombo.selectedIndex != -1){
		argumentType = argumentTypeCombo.options[argumentTypeCombo.selectedIndex].value;
	}
	
	// Show the appropiate control given the argument type
	if (argumentType == 1){
		getDescendant(div, 'constantRow').className = "visibleRow";
		showConstantControl(div, oArgument.element);
		
	} else if (argumentType == 2){
		getDescendant(div, 'definitionRow').className = "visibleRow";
		showDefinitionControl(div, oArgument.element);

	} else if (argumentType == 3){
		if (oArgument.element.id > 0)
			getDescendant(div, 'functionDrawingRow').className = "visibleRow";
		
		getDescendant(div, 'functionRow').className = "visibleRow";
		showFunctionControl(div, oArgument.element)	

	} else {
		getDescendant(div, 'emptyRow').className = "visibleRow";
	}		
}

// Changes the function control accorsing the selected function in the combo
function selectFunction(functionCombo){
	var functionId = functionCombo.value;
	var oFunction = getFunction(functionId);
	var div = getParentDiv(functionCombo, 'divSelectArgument')
	var oFunctionControl = getDescendant(div, 'function');
	
	if (oFunction == null){
		getDescendant(div, 'functionDrawingRow').className = "hiddenRow";
		return;
	}
	
	// Gets argument control
	var argumentControl = controlStack[controlStack.length - 1];
	var oArgument = policyRule.getArgumentByControlId(argumentControl.id);
	
	if (oArgument.checkDataType(oFunction.dataType) == false){
		alert ('The data type of the function is not valid');
		functionCombo.value = 0 ;
		return;
	}
	
	// Shows function drawing
	getDescendant(div, 'functionDrawingRow').className = "visibleRow";
	
	// Copy Values
	oArgument.setFunction(oFunction);
	oArgument.argumentType = 3;
	var currentFunction = oArgument.element;
	
	// Draw the component	
	drawFunction(oFunctionControl, currentFunction);
}

// Method that gets the internal value of the controls
function getConstantValue(div, dataType) {
	if (isDatetime(dataType)){
		return quote( getDescendant(div, 'dateTimeEditor').value );
	} else if (isNumeric(dataType) || isMoney(dataType)){
		return getDescendant(div, 'numericEditor').value;
	} else if (isBoolean(dataType)){
		return String(getDescendants(div, 'booleanEditor')[0].checked);
	} else {  // Text
		return quote( getDescendant(div, 'textEditor').value );
	}
}

// Clear all controls in the edit argument div
function resetEditArgumentControls(div){
	// Reset internal values
	getDescendant(div, 'argumentTypeCombo').value = '0';
	getDescendant(div, 'getDefinitionCombo').value = '0';
	getDescendant(div, 'selectFunctionCombo').value = '0';
	getDescendant(div, 'textEditor').value = '';
	getDescendant(div, 'dateTimeEditor').value = '';
	getDescendant(div, 'numericEditor').value = '';
	getDescendant(div, 'booleanEditor').checked = false;
	getDescendant(div, 'comboEditor').value = '0';
}
	
// hide all controls in the edit argument div
function hideEditArgumentControls(div){	
	// Hide controls
	getDescendant(div, 'constantRow').className = "hiddenRow";
	getDescendant(div, 'definitionRow').className = "hiddenRow";
	getDescendant(div, 'functionRow').className = "hiddenRow";
	getDescendant(div, 'functionDrawingRow').className = "hiddenRow";	
	getDescendant(div, 'emptyRow').className = "hiddenRow";
	getDescendant(div, 'textControl').style.display = "none";
	getDescendant(div, 'dateTimeControl').style.display = "none";
	getDescendant(div, 'numericControl').style.display = "none";
	getDescendant(div, 'booleanControl').style.display = "none";
}
