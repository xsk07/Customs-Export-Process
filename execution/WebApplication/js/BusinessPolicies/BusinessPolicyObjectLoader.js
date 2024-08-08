// Loaders
var asynchCount = 0;
var bMainMethodEnded = false;
var endLoadPolicyItemCallBack;
var bUsingAsynchCount = false;

function increaseAsynchCount() {
    if (bUsingAsynchCount) {
        setTimeout(function () { increaseAsynchCount(); }, 0);
        return;
    }
    bUsingAsynchCount = true;
    asynchCount = asynchCount + 1;
    bUsingAsynchCount = false;
}

function endLoadPolicyItem(myParameter) {
    if (bUsingAsynchCount) {
        setTimeout(function () { endLoadPolicyItem(myParameter); }, 0);
        return;
    }
    bUsingAsynchCount = true;
    asynchCount = asynchCount - 1;
    if (asynchCount == 0) {
        if (endLoadPolicyItemCallBack != null) {
            endLoadPolicyItemCallBack(myParameter);
            endLoadPolicyItemCallBack = null;
        }
    }	
    bUsingAsynchCount = false;
}

function resetItemCallBack() {
    if (asynchCount == 0) {
        if (endLoadPolicyItemCallBack != null) {
            endLoadPolicyItemCallBack = null;
        }
    }
}

function loadConditionXml(conditionXml){
	var condition = null;
	
	var conditionType = conditionXml.getAttribute('conditionType') == null ? 1 : Number(conditionXml.getAttribute('conditionType'));
	
	if (conditionType == 1)
		condition = new NormalCondition();
	else
		condition = new OneParameterCondition();
	
	if (getChildNodes(conditionXml, 'argument')[0]){
		condition.argument1 = loadArgumentXml(getChildNodes(conditionXml, 'argument')[0]);
		condition.argument1.parent = condition;
	}
	if (getChildNodes(conditionXml, 'operator')){
		condition.operator = loadOperatorXml(getChildNodes(conditionXml, 'operator')[0]);
		condition.operator.parent = condition;
	}
	if (conditionType == 1) {
		if (getChildNodes(conditionXml, 'argument')[1]){
			condition.argument2 = loadArgumentXml(getChildNodes(conditionXml, 'argument')[1]);
			condition.argument2.parent = condition;
		}
		
		// Refactor this
		if (condition.argument1.idRelatedEntity > 0) {
			condition.argument2.idRelatedEntity = condition.argument1.idRelatedEntity;
		} 
		
		if (condition.argument2.idRelatedEntity > 0) {
			condition.argument1.idRelatedEntity = condition.argument2.idRelatedEntity;
		} 
	}
	
	return condition;
}

function loadExecutionStatementXml(executionStatementXml){
	var executionStatement = null
	var executionStatementType = executionStatementXml.getAttribute('executionStatementType') == null ? 1 : Number(executionStatementXml.getAttribute('executionStatementType'));
	
	if (executionStatementType == 1)
		executionStatement = new SetExecutionStatement();
	else
		executionStatement = new ActionExecutionStatement();
	
	if (executionStatementType == 1)
	{
		if (getChildNodes(executionStatementXml, 'definition')[0]){
			executionStatement.definition = loadDefinitionXml(getChildNodes(executionStatementXml, 'definition')[0]);
			executionStatement.definition.parent = executionStatement;
		}
		if (getChildNodes(executionStatementXml, 'argument')[0]){
			executionStatement.argument = loadArgumentXml(getChildNodes(executionStatementXml, 'argument')[0]);
			executionStatement.argument.parent = executionStatement;		
		}
				
		if (executionStatement.definition.idRelatedEntity > 0) {
			executionStatement.argument.idRelatedEntity = executionStatement.definition.idRelatedEntity;
		}
	} else {
		if (getChildNodes(executionStatementXml, 'function')[0]){
			executionStatement.oFunction = loadFunctionXml(getChildNodes(executionStatementXml, 'function')[0]);
			executionStatement.oFunction.parent = executionStatement;
		}
	}	
		
	return executionStatement;
}

function loadArgumentXml(argumentXml){
	var argument = new Argument();
	
	var childElement = argumentXml.firstChild;
	if (childElement){
	
		if (childElement.nodeName == 'element'){
			argument.argumentType = 1;	
			argument.element = loadArgumentConstantXml(childElement);
			
		} else if (childElement.nodeName == 'definition'){
			argument.argumentType = 2;
			argument.element = loadDefinitionXml(childElement);
			argument.idRelatedEntity = argument.element.idRelatedEntity;

		} else if (childElement.nodeName == 'function'){ 
			argument.argumentType = 3;
			argument.element = loadFunctionXml(childElement);
		} 
		argument.element.parent = argument;
	} 
	
	argument.dataType = argumentXml.getAttribute('dataType');
	argument.displayName = (argumentXml.getAttribute('displayName') == null) ? '' : argumentXml.getAttribute('displayName');
	return argument;
}

function loadFunctionXml(functionXml){
	var oFunction = new FunctionObj();
	var id = functionXml.getAttribute('id');
	
	// Do asynch load
	fillFunction(id, oFunction, functionXml);
	return oFunction;
}

function loadOperatorXml(operatorXml){
	var operator = new Operator();
	var id = (operatorXml.getAttribute('id') == null) ? 0 : operatorXml.getAttribute('id');
	
	// Do asynch load
	fillOperator(id, operator);
	return operator;
}

function loadDefinitionXml(definitionXml){
	var definition = new Definition();

	definition.id = definitionXml.getAttribute('id');
	definition.name = definitionXml.getAttribute('name');
	definition.displayName = definitionXml.getAttribute('displayName');
	definition.destinationUse = definitionXml.getAttribute('use');
	definition.dataType = definitionXml.getAttribute('dataType');
	definition.idRelatedEntity = definitionXml.getAttribute('idRelatedEntity') == null ? -1 : definitionXml.getAttribute('idRelatedEntity');
	
	return definition;
}

function getBussinesKeyValues(argumentConstantXml) {
    var res = "";
    if(argumentConstantXml.childNodes && argumentConstantXml.childNodes[0]){
        res=new XMLSerializer().serializeToString(argumentConstantXml.childNodes[0])
    }
    return  res;
}

function loadArgumentConstantXml(argumentConstantXml){
	var argumentConstant = new ArgumentConstant();	

	argumentConstant.dataType = argumentConstantXml.getAttribute('dataType');
	argumentConstant.setValue(argumentConstantXml.getAttribute('value'));
	argumentConstant.visibleValue = argumentConstantXml.getAttribute('visibleValue');
	argumentConstant.displayAttributeValue = argumentConstantXml.getAttribute('displayAttributeValue')?argumentConstantXml.getAttribute('displayAttributeValue'):"";
	argumentConstant.isBusinessKey = argumentConstantXml.getAttribute('isBusinessKey')?argumentConstantXml.getAttribute('isBusinessKey'):"";
	argumentConstant.bussinesKeyValues = getBussinesKeyValues(argumentConstantXml);
	argumentConstant.idRelatedEntity = argumentConstantXml.getAttribute('idRelatedEntity') == null ? -1 : argumentConstantXml.getAttribute('idRelatedEntity');
	return argumentConstant;
}

function loadColumn(columnXml) {
	var elementXml = columnXml.firstChild;
	
	var oElement = null;
	if (elementXml != null){
		if (elementXml.nodeName == 'definition'){
			oElement = loadDefinitionXml(elementXml);		

		} else if (elementXml.nodeName == 'function'){
			oElement = loadFunctionXml(elementXml);		
		}
	}
	
	var newColumn = columnFactory.createColumn(oElement);
	newColumn.width = (columnXml.getAttribute('width') == null) ? 0 : columnXml.getAttribute('width');
	return newColumn;
}

function loadCell(decisionTable, columnNumber, previousCell, cellXml) {
	var column = decisionTable.getColumnByNumber(columnNumber);
	var newCell = cellFactory.createCell(decisionTable, column) ;
		
	var operatorXml = getChildNodes(cellXml, 'operator')[0];
	var argumentXml = getChildNodes(cellXml, 'argument')[0];
	var functionXml = getChildNodes(cellXml, 'function')[0];
	
	if (functionXml != null) {
		var oFunction = loadFunctionXml(functionXml);
		// don't use setFunction just to keep the reference through the ajax calls
		newCell.element = oFunction;
		
	} else {
		var oOperator = loadOperatorXml(operatorXml);
		// don't use setOperator just to keep the reference through the ajax calls
		newCell.operator = oOperator;

		var oArgument = loadArgumentXml(argumentXml);
		oArgument.dataType = column.dataType;
		oArgument.element.dataType = column.dataType;
		oArgument.element.idRelatedEntity=column.idRelatedEntity;
		newCell.element.setArgumentConstant(oArgument.element);
	}

	newCell.previousCell = previousCell;
	
	var nextCellsXml = getChildNodes(cellXml, 'nextCells')[0];
	for (var i=0; i<nextCellsXml.childNodes.length; i++){
		newCell.nextCells.push( loadCell(decisionTable, columnNumber + 1, newCell, nextCellsXml.childNodes[i]));
	}
	
	return newCell;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									AJAX METHODS											  //////
////////////////////////////////////////////////////////////////////////////////////////////////////////

// OPERATOR METHODS
var fillOperator_stackRequest={};
function fillOperator(idOperator, oOperator){
	// Look up in the cache
	var cachedItem = policyObjectsCache.getElementbyKey(OPERATOR_PREFIX + idOperator)
	if (cachedItem != null){
		fillOperator_Action(oOperator, cachedItem);

	} else {
		// Do AsynchRequest
        if(fillOperator_stackRequest[idOperator]==undefined){
			increaseAsynchCount();
			fillOperator_stackRequest[idOperator]=[oOperator];
		}else{
			fillOperator_stackRequest[idOperator].push(oOperator);
			return false;
		}
		
		var GetOperatorActionURL= "App/Ajax/AJAXGateway.aspx?action=2005&idOperator="+idOperator;

		GetOperatorActionURL = PATH_TO_BASE_DIRECTORY+GetOperatorActionURL;
		callAjaxURL(GetOperatorActionURL, fillOperator_Callback, {operator: oOperator});
	}
}

function fillOperator_Callback(strData, dynamicArgument){
	var rData = eval("("+strData+")");
	
	var newOperator = new Operator();
	newOperator.id = rData.operator.id;
	newOperator.name = rData.operator.name;
	newOperator.displayName = rData.operator.displayName;
	newOperator.expression = rData.operator.expression;
	newOperator.conditionType = rData.operator.conditionType;
	
	// Adds it to the cache
	policyObjectsCache.addElement(OPERATOR_PREFIX + newOperator.id, newOperator);

	for (var i = 0; i < fillOperator_stackRequest[newOperator.id].length; i++) {
		var operator = fillOperator_stackRequest[newOperator.id][i];
		fillOperator_Action(operator, newOperator);
	}
	fillOperator_stackRequest[newOperator.id]=undefined;
	
	// Calls end function
	endLoadPolicyItem(); 
}

function fillOperator_Action(operator, newOperator){
	operator.setOperator(newOperator);
}

// FUNCTION METHODS
function fillFunction(idFunction, oFunction, functionXML){
	// Look up in the cache
	var cachedItem = policyObjectsCache.getElementbyKey(FUNCTION_PREFIX + idFunction)
	if (cachedItem != null){
		fillFunction_Action(oFunction, functionXML, cachedItem);

	} else {
	    if (idFunction != "0") {
	        // Do AsynchRequest
	        increaseAsynchCount();
	        var GetFunctionActionURL = "App/Ajax/AJAXGateway.aspx?action=2006&idFunction=" + idFunction;

	        GetFunctionActionURL = PATH_TO_BASE_DIRECTORY + GetFunctionActionURL;
	        callAjaxURL(GetFunctionActionURL, fillFunction_Callback, { oFunction: oFunction, functionXML: functionXML });
	    }
	}
}

function fillFunction_Callback(strData, dynamicArgument){
	var rData = eval("("+strData+")");
	
	var oNewFunction = new FunctionObj();
	oNewFunction.id = rData.Function.id;
	oNewFunction.name = rData.Function.name;
	oNewFunction.displayName = rData.Function.displayName;
	oNewFunction.dataType = rData.Function.dataType;
	oNewFunction.numberOfArguments = rData.Function.numberOfArguments;
	
	for (var i=0; i<oNewFunction.numberOfArguments; i++){
		var childArgument = new Argument();
		childArgument.dataType = rData.Function.arguments[i].dataType;
		childArgument.displayName = rData.Function.arguments[i].displayName;
		
		oNewFunction.alArguments.push(childArgument);
	}
	
	// Adds it to the cache
	policyObjectsCache.addElement(FUNCTION_PREFIX + oNewFunction.id, oNewFunction);
	
	fillFunction_Action(dynamicArgument.oFunction, dynamicArgument.functionXML, oNewFunction);
	
	// Calls end function
	endLoadPolicyItem(); 
}

function fillFunction_Action(oFunction, functionXML, oNewFunction){
	var oClonedFunction = new FunctionObj();
	oClonedFunction.setFunction(oNewFunction);
	
	// Add arguments 
	for (var i=0; i<oClonedFunction.numberOfArguments; i++){
		var argumentXml = getChildNodes(functionXML, 'argument')[i];
		oClonedFunction.alArguments[i] = loadArgumentXml(argumentXml);
		oClonedFunction.alArguments[i].parent = oClonedFunction;
	}
	
	oFunction.setFunction(oClonedFunction);	
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									GLOBAL LOADERS											  //////
////////////////////////////////////////////////////////////////////////////////////////////////////////

function loadPolicyRuleXml(xmlCode, callbackFunction){
	bMainMethodEnded = false;
	// set Callback Function
    if (callbackFunction != null && endLoadPolicyItemCallBack == null)
		endLoadPolicyItemCallBack = callbackFunction;
	
	// laod Policy Rule
	var policyRule = new PolicyRule();
	
	if (xmlCode != ''){
	
		var xmlDoc = getXMLDocument(xmlCode);
		var policyRuleXml = xmlDoc.firstChild;
		
		policyRule.conditionType = getChildNodes(policyRuleXml, 'conditions')[0].getAttribute('operator');
		
		var conditionsXml = policyRuleXml.getElementsByTagName('condition');
		for(var i=0; i<conditionsXml.length; i++){
			policyRule.conditions.push(loadConditionXml(conditionsXml[i]));
			
		}
		
		var thenExecutionStatementsXml = policyRuleXml.getElementsByTagName('executionStatements');
		var executionStatementsXml = thenExecutionStatementsXml[0].getElementsByTagName('executionStatement');
		for(var i=0; i<executionStatementsXml.length; i++){
			policyRule.executionStatements.push(loadExecutionStatementXml(executionStatementsXml[i]));
		}
		
		// load Else Execution Statements
		var elseExecutionStatementsXml = policyRuleXml.getElementsByTagName('else');
		if (elseExecutionStatementsXml.length > 0) {
			executionStatementsXml = elseExecutionStatementsXml[0].getElementsByTagName('executionStatement');
			for(var i=0; i<executionStatementsXml.length; i++){
				policyRule.elseExecutionStatements.push(loadExecutionStatementXml(executionStatementsXml[i]));
			} 
			
			policyRule.useElse = true;
		}
	}
	
	bMainMethodEnded = true;
	
	// Draws item if no asynch actions has been started
	if (asynchCount == 0){
	    endLoadPolicyItemCallBack(policyRule);
	    resetItemCallBack();
	}
	
	return policyRule;
}

function loadPreconditionXml(xmlCode, callbackFunction){
	bMainMethodEnded = false;
	
	// set Callback Function
    if (callbackFunction != null && endLoadPolicyItemCallBack == null)
		endLoadPolicyItemCallBack = callbackFunction;
	
	// laod Policy Rule
	var precondition = new Precondition();
	
	if (xmlCode != ''){
		var xmlDoc = getXMLDocument(xmlCode);
		var preconditionXml = xmlDoc.firstChild;
		
		precondition.conditionType = getChildNodes(preconditionXml, 'conditions')[0].getAttribute('operator');
		
		var conditionsXml = preconditionXml.getElementsByTagName('condition');
		for(var i=0; i<conditionsXml.length; i++){
			precondition.conditions.push(loadConditionXml(conditionsXml[i]));
		}
	}
	
	bMainMethodEnded = true;
	
	// Draws item if no asynch actions has been started
	if (asynchCount == 0){
		endLoadPolicyItemCallBack(precondition);
	}
	
	return precondition;
}

function loadDecisionTableFromXML(xmlCode, callbackFunction) {
	bMainMethodEnded = false;
	
	// set Callback Function
    if (callbackFunction != null && endLoadPolicyItemCallBack == null)
		endLoadPolicyItemCallBack = callbackFunction;
	
	var newDecisionTable = new DecisionTable();
	
	if (xmlCode != ''){
		var xmlDoc = getXMLDocument(xmlCode);
		var decisionTableXml = xmlDoc.firstChild;
		
		newDecisionTable.width = (decisionTableXml.getAttribute('width') == null) ? 0 : decisionTableXml.getAttribute('width');
		newDecisionTable.height = (decisionTableXml.getAttribute('height') == null) ? 0 : decisionTableXml.getAttribute('height');
		
		var columnsXml = decisionTableXml.getElementsByTagName('columns')[0];
		for(var i=0; i<columnsXml.childNodes.length; i++){
			newDecisionTable.addColumn(loadColumn(columnsXml.childNodes[i]));
		}
		
		var cellsXml = decisionTableXml.getElementsByTagName('cells')[0];
		for(var i=0; i<cellsXml.childNodes.length; i++){
			newDecisionTable.addRow(loadCell(newDecisionTable, 0, null, cellsXml.childNodes[i]));
		}
	}
	
	bMainMethodEnded = true;
	
	// Draws item if no asynch actions has been started
	if (asynchCount == 0){
		endLoadPolicyItemCallBack(newDecisionTable);
	}
	
	return newDecisionTable;
}

function loadPolicyRuleTableFromXML(xmlCode, callbackFunction) {
	bMainMethodEnded = false;
	
	// set Callback Function
    if (callbackFunction != null && endLoadPolicyItemCallBack == null)
		endLoadPolicyItemCallBack = callbackFunction;
	
	var newRuleTable = new PolicyRuleTable();
	
	if (xmlCode != ''){
	
		var xmlDoc = getXMLDocument(xmlCode);
		var ruleTableXml = xmlDoc.firstChild;
		
		newRuleTable.width = (ruleTableXml.getAttribute('width') == null) ? 0 : ruleTableXml.getAttribute('width');
		newRuleTable.height = (ruleTableXml.getAttribute('height') == null) ? 0 : ruleTableXml.getAttribute('height');
		
		var columnsXml = ruleTableXml.getElementsByTagName('columns')[0];
		for(var i=0; i<columnsXml.childNodes.length; i++){
			newRuleTable.addLoadedColumn(loadColumn(columnsXml.childNodes[i]));
		}
		
		var rulesCodeXml = ruleTableXml.getElementsByTagName('rulesCode')[0];
		for(var i=0; i<rulesCodeXml.childNodes.length; i++){
			var ruleCodeXml = "";
			var	serializer = new XMLSerializer();
			ruleCodeXml = serializer.serializeToString(rulesCodeXml.childNodes[i].firstChild);
			
			var ruleCode = loadPolicyRuleXml(ruleCodeXml);
			newRuleTable.addRuleCode(ruleCode);
		}	

		newRuleTable.buildRuleTableColumns();
	}

	bMainMethodEnded = true;
	
	// Draws item if no asynch actions has been started
	if (asynchCount == 0){
		endLoadPolicyItemCallBack(newRuleTable);
	}
	
	return newRuleTable;
}