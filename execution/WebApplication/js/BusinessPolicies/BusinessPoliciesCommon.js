////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									ACTION METHODS											  //////
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

// Adds an execution statement
function addExecutionStatement(bElse, newExecutionStatement){

	if (newExecutionStatement == null)
		newExecutionStatement = policyItem.createExecutionStatement(1);
	
	// Add the execution statement in the object
	if (!bElse){
		policyItem.executionStatements.push(newExecutionStatement);
	
	} else {
		policyItem.elseExecutionStatements.push(newExecutionStatement);
	}
	
	// Redraw the policy rule
	drawPolicyItem();
}

// Deletes a condition
function  deleteExecutionStatement(executionStatementControl){
	var executionStatement = policyItem.getExecutionStatementByControlId( executionStatementControl.id );
	policyItem.deleteExecutionStatement(executionStatement);
	
	// Redraw the policy rule
	drawPolicyItem();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									DRAW METHODS									  //////
////////////////////////////////////////////////////////////////////////////////////////////////////////

function drawPolicyItem(){
	if (drawPolicyItemFunction != null)
		drawPolicyItemFunction();
}



function validateTypes(oCondition){
	if(oCondition.argument2){
		oCondition.argument1 = validateType(oCondition.argument2, oCondition.argument1);
		oCondition.argument2 = validateType(oCondition.argument1, oCondition.argument2);
	}
	return oCondition;
}
function validateType(firstElement, secondElement) {
	if(firstElement.element.className == "FunctionObj" && secondElement.element.className == "ArgumentConstant" && secondElement.dataType == 0){
		secondElement.dataType = firstElement.dataType;
	}
	return secondElement;
}

function drawCondition(oCondition) {
	try {
		document.getElementById('divIf').innerHTML += conditionHtml;

		oCondition = validateTypes(oCondition);
		var conditions = getDescendantsByClassName(document.getElementById('divIf'), 'condition');
		var newCondition = conditions[conditions.length - 1];
		
		// Set element id
		newCondition.id = oCondition.controlId;
		
		// Load child elements
		var argument1 = getDescendantsByClassName(newCondition, 'argument')[0];
		var operator = getDescendantByClassName(newCondition, 'operator');
		
		var argument2 = null;
		if (oCondition.className == 'NormalCondition') {
			argument2 = getDescendantsByClassName(newCondition, 'argument')[1];
		}		
		
		drawArgument(argument1, oCondition.argument1);
		drawOperator(operator, oCondition.operator);
		
		if (oCondition.className == 'NormalCondition') {
			drawArgument(argument2, oCondition.argument2);
		}		
		
	}catch(e){}
}

function drawExecutionStatement(div, oExecutionStatement){
	try {
		div.innerHTML += executionStatementHtml;
		
		var executionStatements = getDescendantsByClassName(div, 'executionStatement');
		var newExecutionStatement = executionStatements[executionStatements.length - 1];
		
		// Set element id
		newExecutionStatement.id = oExecutionStatement.controlId;

		if (oExecutionStatement.className == 'SetExecutionStatement') {
			var setDefinition = getDescendant(newExecutionStatement, 'setDefinition');
			var argument = getDescendant(newExecutionStatement, 'argument');
			drawSetDefinition(setDefinition, oExecutionStatement.definition);
			drawArgument(argument, oExecutionStatement.argument);
		
		} else {
			var setDefinition = getDescendant(newExecutionStatement, 'setDefinition').style.display = "none";
			var oFunction = getDescendant(newExecutionStatement, 'argument');
			oFunction.setAttribute("idCM", '');
			oFunction.oncontextmenu = null;
			drawFunction(oFunction, oExecutionStatement.oFunction);
		}
		
	}catch(e){}
}


function drawArgument(argumentControl, oArgument){
	if (oArgument.element.className != 'FunctionObj'){
	
		getDescendant(argumentControl, 'argument_value').innerHTML	= oArgument.htmlValue();
		
		// Set element id
		argumentControl.id = oArgument.controlId;
		argumentControl.setAttribute("idCM", oArgument.controlId);
		argumentControl.className = oArgument.element.cssClass;
		
		// Add drag drop stuff
		dragDropObj.addTarget(argumentControl.id  ,'argument_Drop'); 		
	} else {
	
		drawFunction(getDescendant(argumentControl, 'argument_value'), oArgument.element);
	}	
}

function drawOperator(operatorControl, oOperator){
	getDescendant(operatorControl, 'operator_value').innerHTML	= oOperator.htmlValue();
	
	// Set element id
	operatorControl.id = oOperator.controlId;
	
	// Add drag drop stuff
	dragDropObj.addTarget(operatorControl.id  ,'operator_Drop');
}

function drawSetDefinition(setDefinitionControl, oSetDefinition){
	getDescendant(setDefinitionControl, 'setDefinition_value').innerHTML = oSetDefinition.htmlValue();
	
	// Set element id
	setDefinitionControl.id = oSetDefinition.controlId;
	
	// Add drag drop stuff
	dragDropObj.addTarget(setDefinitionControl.id  ,'setDefinition_Drop'); 
}

function drawFunction(functionContainer, oFunction){
	var i = 0;
	
	// Create inner controls
	functionContainer.innerHTML = functionHtml;
	functionControl = getDescendant(functionContainer, "function");
	functionControl.appendChild(document.createTextNode(oFunction.displayName + '('));
	for (i=0; i< oFunction.numberOfArguments; i++){
		if (i>0)
			functionControl.appendChild(document.createTextNode(','));
		
		var newArgumentControl = document.createElement('SPAN');
		var argumentTemplate = getDescendant(document.getElementById('argumentHtml'), 'argument');
		
		// Set properties
		newArgumentControl.innerHTML = argumentTemplate.outerHTML;
		newArgumentControl.firstChild.setAttribute("BADropTarget", argumentTemplate.getAttribute("BADropTarget"));
		newArgumentControl.firstChild.setAttribute("BAElementType", argumentTemplate.getAttribute("BAElementType"));
		
		// Add control
		functionControl.appendChild(newArgumentControl);
		
		drawArgument(newArgumentControl.firstChild, oFunction.alArguments[i]);		
	}
	
	functionControl.appendChild(document.createTextNode(')'));
}


////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									BOX EDIT METHODS	 									  //////	
////////////////////////////////////////////////////////////////////////////////////////////////////////

var morphEditor = null;
function editConstantArgument(controlId){
	var oArgument = policyItem.getArgumentByControlId(controlId);
	var oArgumentControl = document.getElementById(controlId);
	var oArgumentConstant = getDescendantByClassName(oArgumentControl, 'argumentConstant');
	
	// Cancels if tries to edit the already editing cell
	if (morphEditor != null  && morphEditor.currentEditableElement == oArgumentControl){
		return;
	}
	
	// If there is an operator editor clear it
	if (currentEditingOperator != null){
	    
		endEditOperator();
		return;
	}
	
	// If there is an editor clear it
	if (morphEditor != null  && morphEditor.currentEditableElement != null){
	    
		endEditConstantArgument();
		return;
	}
	
	oArgumentConstant.innerHTML = '';
	
	morphEditor = new MorphEditor(endEditConstantArgument);
	morphEditor.currentEditableElement = oArgumentControl;
	morphEditor.parentElement = oArgumentConstant;
	morphEditor.dataType = oArgument.dataType;
	morphEditor.idRelatedEntity = oArgument.idRelatedEntity;
	morphEditor.value = oArgument.element.value;
	morphEditor.internalControlWidth = '190px';
	
	var editor = morphEditor.getEditorControl();
	
	oArgumentConstant.appendChild(editor);
	oArgumentConstant.style.width = '200px';
	
	morphEditor.setEditorValue();
	morphEditor.focusEditorControl();
}

function endEditConstantArgument(){
	var oArgumentControl = morphEditor.currentEditableElement;
	var oArgument = policyItem.getArgumentByControlId(oArgumentControl.id);
	var oArgumentConstant = getDescendantByClassName(oArgumentControl, 'argumentConstant');
	
	var value = ''; 
	
	try {
		value = morphEditor.getEditorValue();
		oArgument.argumentType = 1;
		oArgument.element.setValue(value);
		oArgument.element.visibleValue = morphEditor.getEditorDisplayValue();
		oArgument.element.displayAttributeValue = morphEditor.getDisplayAttributeValue();
		
	} catch (e) {
		if (oArgument != null && oArgument.element != null) {
			oArgument.argumentType = 0;
			//oArgument.element.setValue('');
			oArgument.element.visibleValue = '';
		}
	}
	
	morphEditor = null;
	
	drawPolicyItem();
}

function resetArgument(element){
	var oArgument = policyItem.getArgumentByControlId(idCM);
	
	if (oArgument != null) {
		oArgument.resetArgument();
		drawPolicyItem();
	}
}

var currentEditingOperator = null;
function editOperator(operatorId){

	// Cancels if tries to edit the already editing operator
	if (currentEditingOperator == operatorId){
		return;
	}
	
	// If there is an editor clear it
	if (currentEditingOperator != null){
	    
		endEditOperator();
		return;
	}
	
	// If there is an argument editor clear it
	if (morphEditor != null  && morphEditor.currentEditableElement != null){
	    
		endEditConstantArgument();
		return;
	}

	currentEditingOperator = operatorId;
	var oOperator = policyItem.getOperatorByControlId(operatorId);
	var oOperatorControl = document.getElementById(operatorId);
	
	var operatorEditor = document.createElement('SPAN');
	operatorEditor.innerHTML = operatorComboTemplate.innerHTML;	
	
	var comboEditor = getDescendant(operatorEditor, 'operatorCombo');
	comboEditor.style.width = 'auto';
	comboEditor.style.height = '100%';
	comboEditor.onkeydown = endEditOperator;
	comboEditor.value = oOperator.id;	
	
	var oOperatorValue = getDescendant(oOperatorControl, 'operator_value');
	oOperatorValue.innerHTML = '';
	oOperatorValue.appendChild(operatorEditor);
	oOperatorValue.style.width = '200px';
	
	comboEditor.focus();
}

function endEditOperator(){
	var oOperatorControl = document.getElementById(currentEditingOperator);
	
	if (oOperatorControl != null)
	{
	    var oOperator = policyItem.getOperatorByControlId(currentEditingOperator);
	    var comboEditor = getDescendant(oOperatorControl, 'operatorCombo');
    	
    	if(comboEditor != null)
	        getOperator(document.getElementById(currentEditingOperator), comboEditor.value);
	}
	currentEditingOperator = null;
	
	drawPolicyItem();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									DRAG DROP METHODS										  //////
////////////////////////////////////////////////////////////////////////////////////////////////////////

function argument_Drop(idOfDraggedItem,targetId,x,y)
{
	var type = idOfDraggedItem.substring(0, 3);
	var id = idOfDraggedItem.substring(4, idOfDraggedItem.length);
		
	if (type == 'DEF')
	{
		getDefinition(document.getElementById(targetId), id);
	
	} else if (type == 'FUN') {
		getFunction(document.getElementById(targetId), id);	
	}
}

function setDefinition_Drop(idOfDraggedItem,targetId,x,y)
{
	var type = idOfDraggedItem.substring(0, 3);
	
	if (type == 'DEF')
	{
		var id = idOfDraggedItem.substring(4, idOfDraggedItem.length);
		getDefinition(document.getElementById(targetId), id);
	}
}

function operator_Drop(idOfDraggedItem,targetId,x,y)
{
	var type = idOfDraggedItem.substring(0, 3);
	
	if (type == 'OPE')
	{
		var id = idOfDraggedItem.substring(4, idOfDraggedItem.length);
		getOperator(document.getElementById(targetId), id);
	}
}

function pnlConditionDrop(idOfDraggedItem,targetId,x,y)
{
	var type = idOfDraggedItem.substring(0, 3);
	
	if (type == 'OPE')
	{
		var id = idOfDraggedItem.substring(4, idOfDraggedItem.length);
		getOperator(document.getElementById(targetId), id);
	}
}

function pnlThenElseDrop(idOfDraggedItem,targetId,x,y)
{
	var type = idOfDraggedItem.substring(0, 3);
	
	var id = idOfDraggedItem.substring(4, idOfDraggedItem.length);
		
	if (type == 'DEF')
	{
		getDefinition(document.getElementById(targetId), id);
	
	} else if (type == 'FUN') {
		getFunction(document.getElementById(targetId), id);	
	}
}

function addDefinition(targetElement, definition){
	if (targetElement.getAttribute("BAElementType") == "argument" &&  definition.destinationUse == 1){
		var oArgument = policyItem.getArgumentByControlId(lastDropTarget.id);
		oArgument.argumentType = 2;
		
		// Check datatype
		var oOtherArgument = policyItem.getOtherArgument(oArgument);
		if (oOtherArgument != null && oOtherArgument.element.value != null)
		{
		    if(oOtherArgument.element.value.length > 0)
		    {
		        if (!checkDataType(oArgument.dataType, definition.dataType)) {
			        showError(BAP_POLICY_DATADOESNOTMATCH);
			        return;
		        }
		    }		       
		}	
		
		oArgument.setDefinition(definition);
		// Changes data type of the argument	
		policyItem.changeOtherArgument(oArgument);
			
		drawPolicyItem();
	
	} else if (targetElement.getAttribute("BAElementType") == "setDefinition" &&  definition.destinationUse == 2){
		var oDefinition = policyItem.getSetDefinitionByControlId(lastDropTarget.id);
		oDefinition.setDefinition(definition);
		policyItem.changeOtherArgument(oDefinition);
			
		drawPolicyItem();
		
	} else if (targetElement.getAttribute("BAElementType") == "panel"  &&  definition.destinationUse == 2){
		var newExecutionStatement = policyItem.createExecutionStatement(1);
		newExecutionStatement.definition.setDefinition(definition);
		policyItem.changeOtherArgument(newExecutionStatement.definition);
		
		var useElse = (targetElement.id == 'divElse') ? true : false;
		
		addExecutionStatement(useElse, newExecutionStatement);
	}
}

function addOperator(targetElement, operator){
	if (targetElement.getAttribute("BAElementType") == "operator"){
		var oOperator = policyItem.getOperatorByControlId(targetElement.id);
		policyItem.changeOperator(oOperator, operator);
			
		drawPolicyItem();
		
	} else if (targetElement.getAttribute("BAElementType") == "panel"){
		var newCondition = policyItem.createCondition(operator.conditionType);
		newCondition.operator.setOperator(operator);
		
		addCondition(newCondition);
	}
}

function addFunction(targetElement, oFunction){
	if (targetElement.getAttribute("BAElementType") == "argument"){
		var oArgument = policyItem.getArgumentByControlId(lastDropTarget.id);
		
		// Convert dataType
		funtionDataType = oArgument.setArgumentDataTypeByFuntionDataType(oFunction.dataType);
		
		
		// Check datatype
		if (!checkDataType(oArgument.dataType, funtionDataType)) {
			showError(decodeHtml(BAP_POLICY_DATADOESNOTMATCH));
			return;
		}	
		
		if (oFunction.dataType == 1){ // object 
			showError(decodeHtml(BAP_POLICY_OBJECTRETURNINGFUNCTIONFORBIDDEN));
			return;
		}
		
		oArgument.argumentType = 2;
		oArgument.setFunction(oFunction);
			
		drawPolicyItem();
	
	} else if (targetElement.getAttribute("BAElementType") == "panel"){
		var newExecutionStatement = policyItem.createExecutionStatement(2);
		newExecutionStatement.oFunction = oFunction;
		
		var useElse = (targetElement.id == 'divElse') ? true : false;
		
		addExecutionStatement(useElse, newExecutionStatement);
	}
}

function decodeHtml(html) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									AJAX METHODS											  //////
////////////////////////////////////////////////////////////////////////////////////////////////////////

var lastDropTarget = null;
// DEFINITION METHODS
function getDefinition(dropTarget, idDefinition){
	lastDropTarget = dropTarget;
	
	// Look up in the cache
	var cachedItem = policyObjectsCache.getElementbyKey(DEFINITION_PREFIX + idDefinition)
	if (cachedItem != null){
		getDefinition_Action(cachedItem);

	} else {
		// Do AsynchRequest
		startProcessing();
		var GetDefinitionActionURL= "App/Ajax/AJAXGateway.aspx?action=2004&idDefinition="+idDefinition;
		
		GetDefinitionActionURL = PATH_TO_BASE_DIRECTORY+GetDefinitionActionURL;
		callAjaxURL(GetDefinitionActionURL, getDefinition_Callback);
	}
}

function getDefinition_Callback(strData){
	var rData = eval("("+strData+")");
	
	var definition = new Definition();
	definition.id = rData.definition.id;
	definition.name = rData.definition.name;
	definition.displayName = rData.definition.displayName;
	definition.destinationUse = rData.definition.destinationUse;
	definition.dataType = rData.definition.dataType;
	definition.idRelatedEntity = rData.definition.idRelatedEntity;
	
	// Adds it to the cache
	policyObjectsCache.addElement(DEFINITION_PREFIX + definition.id, definition);
	
	getDefinition_Action(definition);
	setTimeout("endProcessing()", 100);
}

function getDefinition_Action(definition){
	addDefinition(lastDropTarget, definition);
	lastDropTarget = null;
}

// OPERATOR METHODS
function getOperator(dropTarget, idOperator){
	lastDropTarget = dropTarget;
	
	// Look up in the cache
	var cachedItem = policyObjectsCache.getElementbyKey(OPERATOR_PREFIX + idOperator)
	if (cachedItem != null){
	    
		getOperator_Action(cachedItem);

	} else {
	    
		// Do AsynchRequest
		startProcessing();
		var GetOperatorActionURL= "App/Ajax/AJAXGateway.aspx?action=2005&idOperator="+idOperator;

		GetOperatorActionURL = PATH_TO_BASE_DIRECTORY+GetOperatorActionURL;
		callAjaxURL(GetOperatorActionURL, getOperator_Callback);
	}
}

function getOperator_Callback(strData){
	var rData = eval("("+strData+")");
	
	var operator = new Operator();
	operator.id = rData.operator.id;
	operator.name = rData.operator.name;
	operator.displayName = rData.operator.displayName;
	operator.expression = rData.operator.expression;
	operator.conditionType = rData.operator.conditionType;
	
	// Adds it to the cache
	policyObjectsCache.addElement(OPERATOR_PREFIX + operator.id, operator);
	
	getOperator_Action(operator);
	setTimeout("endProcessing()", 100);
}

function getOperator_Action(operator){
	var newOperator = new Operator();
	newOperator.setOperator(operator);
	addOperator(lastDropTarget, newOperator);
	
	lastDropTarget = null;
}

// FUNCTION METHODS
function getFunction(dropTarget, idFunction){
	lastDropTarget = dropTarget;
	
	// Look up in the cache
	var cachedItem = policyObjectsCache.getElementbyKey(FUNCTION_PREFIX + idFunction)
	if (cachedItem != null){
		getFunction_Action(cachedItem);

	} else {
		// Do AsynchRequest
		startProcessing();
		var GetFunctionActionURL= "App/Ajax/AJAXGateway.aspx?action=2006&idFunction="+idFunction;
	
		GetFunctionActionURL = PATH_TO_BASE_DIRECTORY+GetFunctionActionURL;
		callAjaxURL(GetFunctionActionURL, getFunction_Callback);
	}
}

function getFunction_Callback(strData){
	var rData = eval("("+strData+")");
	
	var oFunction = new FunctionObj();
	oFunction.id = rData.Function.id;
	oFunction.name = rData.Function.name;
	oFunction.displayName = rData.Function.displayName;
	oFunction.dataType = rData.Function.dataType;
	oFunction.numberOfArguments = rData.Function.numberOfArguments;
	
	for (var i=0; i<oFunction.numberOfArguments; i++){
		var childArgument = new Argument();
		childArgument.dataType = rData.Function.arguments[i].dataType;
		childArgument.displayName = rData.Function.arguments[i].displayName;
		
		oFunction.alArguments.push(childArgument);
	}
	
	// Adds it to the cache
	policyObjectsCache.addElement(FUNCTION_PREFIX + oFunction.id, oFunction);

	getFunction_Action(oFunction);
	setTimeout("endProcessing()", 100);
}

function getFunction_Action(oFunction){
	var newFunction = new FunctionObj();
	newFunction.setFunction(oFunction);
	addFunction(lastDropTarget, newFunction);
	
	lastDropTarget = null;
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

function showHideElse(element){
	if (element.getAttribute("BAChecked") == "true" ||
		element.getAttribute("BAChecked") == true){
		policyItem.useElse = true;
	} else {
		policyItem.useElse = false;
	}
	
	// Redraw the policy rule
	drawPolicyItem();
}