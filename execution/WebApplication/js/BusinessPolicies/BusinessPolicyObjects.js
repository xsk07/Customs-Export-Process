var DEFAULT_ARGUMENT_MESSAGE = BAP_DEFAULT_ARGUMENT_MESSAGE;
var DEFAULT_OPERATOR_MESSAGE = BAP_DEFAULT_OPERATOR_MESSAGE;
var CELL_HEIGHT = 24;
var CELL_MINIMUM_WIDTH = 32;
var CELL_DEFAULT_VALUE = '<Insert a value here>';
var BP_RENDERING_TYPE = 1; // 1 - RuleCode, 2 - Table
		
function ArgumentConstant(xmlCode){
	this.value = '';
	this.isBusinessKey = '';
	this.dataType = 15;
	this.visibleValue =  '';
	this.displayAttributeValue =  '';
	this.bussinesKeyValues =  '';
	this.idRelatedEntity =  '';
	
	this.cssClass = 'argumentConstant';
	this.className = 'ArgumentConstant';
	this.parent = null;
	
	// Normal edition method
	this.onClickMethod = 'editConstantArgument';
	this.useDoubleClick = false;
	
	this.htmlValue = function(bRenderEvents){
		if (typeof(bRenderEvents) == 'undefined')
			bRenderEvents = true;
			
		if (this.visibleValue == ''){ 
			this.visibleValue = this.value;
		}
		this.displayAttributeValue=this.displayAttributeValue?HTMLEncode(this.displayAttributeValue):"";
		var sHtmlValue = this.visibleValue != '' ? HTMLEncode(this.visibleValue) : DEFAULT_ARGUMENT_MESSAGE;
		var sHtmlTitle = this.displayAttributeValue != '' ? 'title=\''+this.displayAttributeValue+'\'' :"";
		var eventSentence = this.useDoubleClick ? 'ondblclick' : 'onclick';
		var onClickSentence = (this.onClickMethod != '' && bRenderEvents) ?  eventSentence + '=\'' + this.onClickMethod + '("' + this.parent.controlId + '")\'' : '';
		var style = BP_RENDERING_TYPE == 2 ? ' style="height:auto" ' : '';
		return  '<SPAN class=\'' + this.cssClass + '\' ' + onClickSentence +' ' +  style +  ' '+sHtmlTitle+'>' + sHtmlValue + '</SPAN>';
	}	
	
	this.setValue = function(oValue) {

	    this.value = oValue;

	    if (isDecimal(this.dataType)) {
            this.value = deserializeDecimalValue(oValue);
	    }
	    if(isDatetime(this.dataType)){
	        this.value = deserializeDateValue(oValue);
	    }
	}
	
	this.getXml = function(){
	    
	    var constantValue = HTMLEncode(unquote(this.value));
	    
	    if (isDecimal(this.dataType)) {
	        constantValue = serializeDecimalValue(constantValue);
	    }
	    if(isDatetime(this.dataType) && constantValue != ""){
	        constantValue = serializeDateValue(constantValue);
	    }
	    if (!this.idRelatedEntity && this.parent && this.parent.idRelatedEntity)
	        this.idRelatedEntity = this.parent.idRelatedEntity
		
		var attr_displayAttributeValue=this.displayAttributeValue!=""?' displayAttributeValue="'+this.displayAttributeValue+'" ':"";
		var attr_isBusinessKey=this.isBusinessKey!=""?' isBusinessKey="'+this.isBusinessKey+'" ':"";	    
		return	'<element idRelatedEntity="'+this.idRelatedEntity+'" value="' + constantValue + '" ' +
						 'visibleValue="' + HTMLEncode(unquote(this.visibleValue)) + '" ' +
						 'dataType="' + this.dataType + '" '+attr_displayAttributeValue+' '+attr_isBusinessKey+' >' +
						 this.bussinesKeyValues
				+'</element>';
	}
	
	this.isValid = function() {
		if (this.value == ''){
			showError('The element cannot be empty');
			return false;
		}
		
		return true;
	}
	
	this.setArgumentConstant = function(oArgumentConstant){
		this.dataType = oArgumentConstant.dataType;
		this.setValue(oArgumentConstant.value);
		this.visibleValue = oArgumentConstant.visibleValue;
		this.displayAttributeValue = oArgumentConstant.displayAttributeValue;
		this.isBusinessKey = oArgumentConstant.isBusinessKey;
		this.bussinesKeyValues = oArgumentConstant.bussinesKeyValues;
		this.idRelatedEntity = oArgumentConstant.idRelatedEntity;
	}
	/**
	 * let Set the idRelatedEntity to the element, used when it's new row in policy
	 */
	this.setIdRelatedEntity = function(idRelatedEntity){
		this.idRelatedEntity = idRelatedEntity;
	}
}

function Definition(){
	this.id = '';
	this.name = '';
	this.displayName = '';
	this.destinationUse = 0;
	this.dataType = 15;
	this.idRelatedEntity = 0;
	
	this.cssClass = 'definition';
	this.className = 'Definition';
	this.parent = null;
	this.internalId = getRandomID();
	this.controlId = 'definition' + this.internalId;
	
	this.htmlValue = function(){
		var sDisplayName = this.displayName;
		var sHtmlValue = this.displayName != '' ? sDisplayName : DEFAULT_ARGUMENT_MESSAGE;
		var style = BP_RENDERING_TYPE == 2 ? ' style="height:auto" ' : '';
		return  '<SPAN class=\'' + this.cssClass + '\' ' +  style +  '>' + sHtmlValue + '</SPAN>';
	}
	
	this.isValid = function() {
		/*if (this.id == 0)
		{
			showError( BAP_NO_VALID_DEFINITION );
			return false;
		}*/
		
		return true;
	}
	
	this.getXml = function(){
		return		'<definition id="' + this.id + '" ' +
							'name="' + this.name + '" '+
							'displayName="' + this.displayName + '" '+
							'dataType="' + this.dataType + '" ' +
							'use="' + this.destinationUse + '" ' + 
							'idRelatedEntity="' + this.idRelatedEntity + '" >' +
					'</definition>'
	}
	
	this.setDefinition = function(oDefinition){
		
		this.id = oDefinition.id;
		this.name = oDefinition.name;
		this.displayName = oDefinition.displayName;
		this.destinationUse = oDefinition.destinationUse;
		this.dataType = oDefinition.dataType;
		this.idRelatedEntity = oDefinition.idRelatedEntity;
	}
}

function Operator(){
	this.id = 0;
	this.name = '';
	this.displayName = '';
	this.expression = '';
	this.conditionType = 0;
	
	this.cssClass = 'operator';
	this.className = 'Operator';
	this.parent = null;
	this.internalId = getRandomID();
	this.controlId = 'operator' + this.internalId;
	
	this.htmlValue = function(bRenderEvents){
		if (typeof(bRenderEvents) == 'undefined')
			bRenderEvents = true;
			
		var sHtmlValue = this.displayName != '' ? this.displayName : DEFAULT_OPERATOR_MESSAGE;
		var onClickSentence = (bRenderEvents) ?  'onclick=\'editOperator("' + this.controlId + '")\'' : '';
		var style = BP_RENDERING_TYPE == 2 ? ' style="height:auto" ' : '';
		return  '<SPAN class=\'' + this.cssClass + '\' ' + onClickSentence + ' ' +  style +  '>' + sHtmlValue + '</SPAN>';
	}
	
	this.isValid = function(){
		if (this.id == 0 || this.id == undefined) {
			showError( BAP_NO_VALID_OPERATOR );
			return false;
		}	
		
		return true;
	}
	
	this.getXml = function(){
		return  '<operator id="'+ this.id + '" ' +
						  'name="' + this.name  + '" ' +
						  'expression="' + HTMLEncode(unquote(this.expression)) + '">' + 							
				'</operator>';
	}
	
	this.setOperator = function(newOperator){
		this.id = newOperator.id;
		this.name = newOperator.name;
		this.displayName = newOperator.displayName;
		this.expression = newOperator.expression;
		this.conditionType = newOperator.conditionType ;
	}
}

function FunctionObj(){
	this.id = 0;
	this.name = '';
	this.displayName = '';
	this.dataType = 15;
	this.numberOfArguments = 0;
	this.alArguments = new Array();
	
	this.cssClass = 'function';
	this.className = 'FunctionObj';
	this.parent = null;
	
	this.getComboId = function(){ 
		var comboId = this.name + "-" + this.numberOfArguments + "-" + this.dataType;
		
		for(var i=0; i < this.numberOfArguments; i++){
			comboId += "-" + this.alArguments[i].dataType;
		}
		
		return comboId;
	} 
	
	this.htmlValue = function(bRenderEvents){
		if (typeof(bRenderEvents) == 'undefined')
			bRenderEvents = true;
			
		var sHtmlValue = '<STRONG>' + this.displayName + '(</STRONG>';
		for(var i=0; i < this.numberOfArguments; i++){
			if (i>0)
				sHtmlValue += "<STRONG>,</STRONG>";
				
			sHtmlValue +=  this.alArguments[i].htmlValue(bRenderEvents);
		}
		
		sHtmlValue += '<STRONG>)</STRONG>';
		
		return 	sHtmlValue;
	}
	
	this.getXml = function(){
		var xmlCode = '<function id="'+ this.id + '" ' +
								'name="' + this.name + '" ' +
							    'dataType="' + this.dataType + '" ' +
							    'numberOfArguments="' + this.numberOfArguments + '" >';
		
		for(var i=0; i < this.numberOfArguments; i++){
			xmlCode +=  this.alArguments[i].getXml();
		} 
		
		xmlCode +=	  '</function>';
		
		return xmlCode;					
	}
	
	this.getArgumentByControlId = function(controlId) {
		
		for(var i=0; i< this.alArguments.length; i++){
			var obj;
			obj = this.alArguments[i].getArgumentByControlId(controlId);
			if (obj != null) {
				return obj;
			}
		}
	}
	
	this.isValid = function(){
		if (this.id == 0){
			showError(BAP_POLICY_NOVALIDFUNCTION);
			return false;
		}
		
		for(var i=0; i< this.alArguments.length; i++){
			if (this.alArguments[i].isValid() == false) {
				return false;
			}
		}
			
		return true;
	}
	
	this.setFunction = function(oFunction) {
		
		this.id = oFunction.id;
		this.name = oFunction.name;
		this.displayName = oFunction.displayName;
		this.dataType = oFunction.dataType;
		this.numberOfArguments = oFunction.numberOfArguments;
		this.alArguments = new Array();
		
		for(var i=0; i < oFunction.numberOfArguments; i++){
			var childArgument = new Argument();
			
			childArgument.parent = this;
			childArgument.setArgument(oFunction.alArguments[i]);
			this.alArguments.push(childArgument);
		}		
	}
}

function Argument(){
	this.internalId = 0;
	this.argumentType = 0;	
	
	this.element = new ArgumentConstant();
	this.element.parent = this;
	this.dataType = 0;
	this.idRelatedEntity = 0;
	
	// Just for Decision Tables
	this.displayName = '';
	this.width = 0;
	
	this.className = 'Argument';
	this.parent = null;
	this.internalId = getRandomID();
	this.controlId = 'argument' + this.internalId;
	this.oldElement = this.element;
	
	this.htmlValue = function(bRenderEvents){
		if (typeof(bRenderEvents) == 'undefined')
			bRenderEvents = true;
			
		return this.element.htmlValue(bRenderEvents);
	}
	
	this.resetArgument = function(){
		this.argumentType = 0;
		this.element = new ArgumentConstant();
		this.element.parent = this;
	}
	
	this.isEmpty = function() {
		if (this.argumentType == 0) {	
			return true;
		}
		
		if (this.argumentType == 1 &&
		    this.element.value == '') {	
			return true;
		}
		
		return false;
	}
	
	this.setArgument = function(oArgument){
		this.dataType = oArgument.dataType;
		this.idRelatedEntity = oArgument.idRelatedEntity;
		this.width = oArgument.width;
		this.displayName = oArgument.displayName;
		//this.controlId = 'argument' + this.internalId;
		this.argumentType = oArgument.argumentType;

		if (oArgument.argumentType == 1){
			this.setArgumentConstant(oArgument.element);
			
		} else if (oArgument.argumentType == 2){
			this.setDefinition(oArgument.element);
		
		} else if (oArgument.argumentType == 3){
			this.setFunction(oArgument.element);	
		}
	}
	
	this.setFunction = function(oFunction) {
		this.element = new FunctionObj();
		this.element.parent = this;
		this.element.setFunction(oFunction);
		
		// change datatype
		this.dataType = this.setArgumentDataTypeByFuntionDataType(this.element.dataType);
	}
	/*
		/* Rules DataType
		Object = 1,
        Int = 2,
        String = 3,
        Double = 4,
        DateTime = 5,
		Boolean = 6,
		*/
		/////////////////
		/* Types Defined in Backend
		* None = 0,BigInt = 1,Int = 2,SmallInt = 3,TinyInt = 4,Boolean = 5,Decimal = 6,Numeric = 7,Money = 8,Float = 10,Real = 11,DateTime = 12,SmallDateTime = 13,
		Char = 14,VarChar = 15,Text = 16,Binary = 17,VarBinary = 18,Image = 19,Guid = 20,NChar = 21,NVarChar = 22,NText = 23,MxMBidirectionalRelationship = 24,
		MxMUnidirectionalRelationship = 25,EntityDisabled = 26,UserAuth = 27,MxMUnidirectionalRelationshipWithoutFilter = 28,OracleNumber = 29,
		Stakeholder = 30,ActivityItems = 31
		*/
	this.setArgumentDataTypeByFuntionDataType = function (RuleDataType){
		var resp;
		switch (RuleDataType) {
			case 6:
				resp = 5;
				break;
			case 5:
				resp = 12;
				break;
			case 3:
				resp = 15;
				break;
			case 4:
				resp = 10;
				break;
			default: 
				resp = RuleDataType;
		}
		return resp;
	}
	
	this.setArgumentConstant = function(oArgumentConstant) {
		this.element = new ArgumentConstant();
		this.element.setArgumentConstant(oArgumentConstant)
		this.element.parent = this;
		
		// change datatype
		this.dataType = this.element.dataType;
	}	
	
	this.setDefinition = function(oDefinition){
		this.element = new Definition();
		this.element.parent = this;
		
		this.element.setDefinition(oDefinition);
		
		// change datatype
		this.dataType = this.element.dataType;
		this.idRelatedEntity = this.element.idRelatedEntity;
	}
	
	this.getArgumentByControlId = function(controlId) {
		
		if (this.controlId == controlId)
			return this;
		
		if (this.element.className == 'FunctionObj'){
			return this.element.getArgumentByControlId(controlId)
		}		
	}
	
	this.checkDataType = function (newElementDataType){
	
		if (this.dataType == 0){
			return true;
		}
	
		if ( isNumeric(this.dataType) ){
			if ( isNumeric(newElementDataType) || isMoney(newElementDataType) ) {
				return true;
			}
		}
		
		if ( isMoney(this.dataType) ){
			if ( isNumeric(newElementDataType) || isMoney(newElementDataType) ) {
				return true;
			}
		}
		
		if ( isDatetime(this.dataType) ){
			if ( isDatetime(newElementDataType)) {
				return true;
			}
		}
		
		if ( isBoolean(this.dataType) ){
			if ( isBoolean(newElementDataType)) {
				return true;
			}
		}
		
		if ( isText(this.dataType) ){
			if ( isText(newElementDataType)) {
				return true;
			}
		}
		
		return false;
	}
	
	this.isValid = function(){
		if (this.argumentType == 0){
			showError( BAP_NO_VALID_ARGUMENT );
			return false;
		}
		
		if (this.element.isValid() == false) {
			return false;
		}		
			
		return true;
	}
	
	this.getXml = function(){
		return '<argument dataType="' + this.dataType + '" displayName="' + this.displayName + '" >' +
					this.element.getXml() +
				'</argument>';
	}
	
	// Just for Decision Tables
	this.calculateMinWidth = function() {
		return measureWidth(this.displayName, 'columnBox');
	}
	
	this.setDataType = function(newDataType) {
	    this.dataType = newDataType;
	    if (this.element.className == 'ArgumentConstant')
	    {
	        this.element.dataType = newDataType;
	    }
	}
}

function NormalCondition(){
	this.argument1 = new Argument();
	this.operator = new Operator();
	this.argument2 = new Argument();
	
	// For new elements chain
	this.argument1.parent = this;
	this.operator.parent = this;
	this.argument2.parent = this;
	
	this.className = 'NormalCondition';
	
	this.internalId = getRandomID();
	this.controlId = 'condition' + this.internalId;
	
	this.isValid = function(){
		if (this.argument1.isValid() == false)
			return false;
			
		if (this.operator.isValid() == false)
			return false;
		
		if (this.argument2.isValid() == false)
			return false;
		
		return true;
	}
	
	this.getXml = function(){
		return  '<condition conditionType="1">' + 
					this.argument1.getXml() + 
					this.operator.getXml() +
					this.argument2.getXml() +
				'</condition>';
	}
}

function OneParameterCondition(){
	this.argument1 = new Argument();
	this.operator = new Operator();
	
	// For new elements chain
	this.argument1.parent = this;
	this.operator.parent = this;
	
	this.className = 'OneParameterCondition';
	
	this.internalId = getRandomID();
	this.controlId = 'condition' + this.internalId;
	
	this.isValid = function(){
		if (this.argument1.isValid() == false)
			return false;
			
		if (this.operator.isValid() == false)
			return false;
		
		return true;
	}
	
	this.getXml = function(){
		return  '<condition conditionType="2">' + 
					this.argument1.getXml() + 
					this.operator.getXml() +
				'</condition>';
	}
}

this.createCondition = function(conditionType) {
		if (conditionType == 1) {
			return new NormalCondition();
		} else if (conditionType == 2){
			return new OneParameterCondition();
		}
		
		return new NormalCondition();
	} 
	
function ConditionFactory(){
	this.createCondition = function(conditionType) {
		if (conditionType == 1) {
			return new NormalCondition();
		} else if (conditionType == 2){
			return new OneParameterCondition();
		}
		
		return new NormalCondition();
	} 
}
var conditionFactory = new ConditionFactory();

function SetExecutionStatement(xmlCode){
	this.definition = new Definition();
	this.argument = new Argument();
	
	// For new elements chain
	this.definition.parent = this;
	this.argument.parent = this;
	
	this.className = 'SetExecutionStatement';
	
	this.internalId = getRandomID();
	this.controlId = 'executionStatement' + this.internalId;
	
	this.isValid = function(){
		if (this.definition.isValid() == false)
			return false;
		
		if (this.argument.isValid() == false)
			return false;
		
		return true;
	}
	
	this.htmlValue = function(bRenderEvents) {
		if (typeof(bRenderEvents) == 'undefined')
			bRenderEvents = true;
			
		return this.definition.htmlValue(bRenderEvents) + '&nbsp;&nbsp;=&nbsp;&nbsp;' + this.argument.htmlValue(bRenderEvents);
	}
	
	this.getXml = function(){
		return  '<executionStatement executionStatementType="1">' + 
					this.definition.getXml() + 
					this.argument.getXml() +
				'</executionStatement>';
	}
}

function ActionExecutionStatement(xmlCode){
	this.oFunction = new FunctionObj();
	
	// For new elements chain
	this.oFunction.parent = this;
	
	this.className = 'ActionExecutionStatement';
	
	this.internalId = getRandomID();
	this.controlId = 'executionStatement' + this.internalId;
	
	this.isValid = function(){
		if (this.oFunction.isValid() == false)
			return false;
		
		return true;
	}
	
	this.htmlValue = function(bRenderEvents) {
		if (typeof(bRenderEvents) == 'undefined')
			bRenderEvents = true;
			
		return this.oFunction.htmlValue(bRenderEvents);
	}
	
	this.getXml = function(){
		return  '<executionStatement executionStatementType="2">' + 
					this.oFunction.getXml() + 
				'</executionStatement>';
	}
}

function ExecutionStatementFactory(){
	this.createExecutionStatement = function(executionStatementType) {
		if (executionStatementType == 1) {
			return new SetExecutionStatement();
		} else if (executionStatementType == 2) {
			return new ActionExecutionStatement();
		}
		
		return new SetExecutionStatement();
	} 
}
var executionStatementFactory = new ExecutionStatementFactory();

function GenericColumn(){
	this.element = null;
	
	this.destinationUse = 0;
	this.dataType = 0;
	this.idRelatedEntity = 0;
	
	this.width = 0;
	this.left = 0;
	
	this.getXml = function() {
		var sXML = "<column order=\"" + this.getColumnNumber() + "\" width=\"" + this.width + "\" >";

		// Element
		sXML += this.element.getXml();
		sXML += "</column>";

		return sXML;
	}
}

function Column(){
	this.definition = new Definition();
	this.element = this.definition;
	this.className = "Column";
	this.minWidth = '80px';
	this.decisionTable = null;
	
	this.getControlId = function() {
		return 'column' + this.element.name.replace(' ', '_');
	}
	
	this.setDefinition = function(definition) {
		this.element = definition;
		this.definition = definition;
		this.destinationUse = this.definition.destinationUse;
		this.dataType = definition.dataType;
		this.idRelatedEntity = definition.idRelatedEntity;
		this.minWidth = measureWidth(this.definition.displayName, 'columnBox');
	}
	
	this.calculateMinWidth = function() {
		this.minWidth = measureWidth(this.definition.displayName, 'columnBox');
		return this.minWidth;
	}
	
	this.getColumnHTML = function(){
		var sClassName = "columnBox " + (this.destinationUse == 1 ?	'columnBoxGet' : 'columnBoxSet');
		var sHTML =	'<div style="height:100%" class="' + sClassName + '">';
		sHTML +=		this.definition.displayName;
		sHTML +=	'</div>';
		return 	sHTML;
	}
	
	this.getColumnNumber = function()	{
		var columns = this.decisionTable.getColumns();
		
		for(var i=0; i<columns.length; i++){
			if (columns[i] == this){
				return i;
			}
		}	
		
		return -1;
	}
}
Column.prototype = new GenericColumn;

function FunctionColumn(){ // Extends Generic Column
	this.functionObj = new FunctionObj();
	this.element = this.functionObj;
	this.destinationUse = 2;
	this.idRelatedEntity = 0;
	this.className = "FunctionColumn";
	this.minWidth = '80px';
	this.decisionTable = null;
		
	this.getControlId = function() {
		return 'column' + this.element.name.replace(' ', '_');
	}
	
	this.setFunction = function(oFunction) {
		this.element = oFunction;
		this.functionObj = oFunction;
		this.dataType = oFunction.dataType;
		this.calculateMinWidth();
	}
	
	this.calculateMinWidth = function() {
		this.minWidth = 0;
		
		for (i=0; i < this.functionObj.numberOfArguments; i++) {
			var minArgumentWidth = measureWidth(this.functionObj.alArguments[i].displayName, 'functionColumnBox') + 15;
			var iWidth = this.functionObj.alArguments[i].width == 0 ? minArgumentWidth : this.functionObj.alArguments[i].width;
			this.minWidth += iWidth;
		}
		
		
		var minFunctionWidth = measureWidth(this.functionObj.displayName, 'columnBox');
		this.minWidth = this.minWidth < minFunctionWidth ? minFunctionWidth : this.minWidth;
		this.minWidth = this.minWidth + 'px';
		return this.minWidth;
	}
	
	this.getColumnHTML = function(){
		var columnBoxDivisionHTML =  document.getElementById('columnDivision').outerHTML;
		
		this.calculateMinWidth();
		
		var sHTML =	'<div style="height:48px;width:100%">';
		sHTML +=	'<div style="height:24px;width:100%" class="columnBox columnBoxSet">';
		sHTML +=		this.functionObj.displayName;
		sHTML +=	'</div>';
		sHTML +=	'<div style="height:24px;overflow:hidden">';
		
		for(var i=0; i < this.functionObj.numberOfArguments; i++){
			var minArgumentWidth = measureWidth(this.functionObj.alArguments[i].displayName, 'functionColumnBox') + 15;
			var width = this.functionObj.alArguments[i].width == 0 ? minArgumentWidth : this.functionObj.alArguments[i].width;
			var style = 'style="float:left;width:' + width + 'px"';
			
			if(i=0){
				var style = 'style="float:left;width:' + 180 + 'px"';
			}

			if (i == (this.functionObj.numberOfArguments - 1))
				style = '';
			
			var columnArgumentId = this.getControlId() + "_" + i;
			sHTML +=	'<div '  + style + ' class="columnArgumentBox columnBoxSet" id="' + columnArgumentId + '" >';
			
			
			// Don't column division for last column
			if (i != (this.functionObj.numberOfArguments - 1))
				sHTML +=		columnBoxDivisionHTML;
			
			sHTML +=		'<div class="columnArgumentBox columnBoxSet">';
			sHTML +=			this.functionObj.alArguments[i].displayName;
			sHTML +=		'</div>';
			
			sHTML +=	'</div>';
			
			// Set width in the object
			this.functionObj.alArguments[i].width = width;
		}
		sHTML +=	'</div>';
		sHTML +=	'</div>';
		return 	sHTML;	
	}
	
	this.getColumnNumber = function()	{
		var columns = this.decisionTable.getColumns();
		
		for(var i=0; i<columns.length; i++){
			if (columns[i] == this){
				return i;
			}
		}	
		
		return -1;
	}
}
FunctionColumn.prototype = new GenericColumn;

function RuleTableColumn(ruleTable, sColumnName, columnType){ // Extends Generic Column
	this.element = sColumnName;
	this.columnType = columnType;
	this.className = "RuleTableColumn";
	this.minWidth = '80px';
	this.ruleTable = ruleTable;
	this.cssClass = '';
	
	if (columnType == 1) {
		this.cssClass = 'ruleTableColumnIf';	
	} else if (columnType == 2){
		this.cssClass = 'ruleTableColumnThen';
	} else if (columnType == 3){
		this.cssClass = 'ruleTableColumnElse';
	}
	
	
	this.getControlId = function() {
		return 'column' + this.element.replace(' ', '_');
	}

	this.calculateMinWidth = function() {
		this.minWidth = measureWidth(this.element, 'columnBox');
		return this.minWidth;
	}
	
	this.getColumnHTML = function(){
		var sClassName = "columnBox " + this.cssClass;
		var sHTML =	'<div style="height:100%" class="' + sClassName + '">';
		sHTML +=		this.element;
		sHTML +=	'</div>';
		return 	sHTML;
	}
	
	this.getColumnNumber = function()	{
		var columns = this.ruleTable.getColumns();
		
		for(var i=0; i<columns.length; i++){
			if (columns[i] == this){
				return i;
			}
		}	
		
		return -1;
	}
	
	this.getXml = function() {
		var sXML = "<column order=\"" + this.getColumnNumber() + "\" width=\"" + this.width + "\" >";
		sXML += "</column>";

		return sXML;
	}
}
RuleTableColumn.prototype = new GenericColumn;
 
function ColumnFactory(){
	this.createColumn = function(oElement) {
		var newColumn;
		
		if (oElement == null) {
			return new RuleTableColumn();
		}
		
		if (oElement.className == 'Definition' )  {
			newColumn = new Column();
			newColumn.setDefinition(oElement);
		} else if (oElement.className == 'FunctionObj' )  {
			newColumn = new FunctionColumn();
			newColumn.setFunction(oElement);
		}
		
		return newColumn;
	}
}
var columnFactory = new ColumnFactory();

function GenericCell(decisionTable, column){
	this.nextCells = new Array();
	this.previousCell = null;
	
	this.column = column;
	this.decisionTable = decisionTable;
	this.cellId = null;
	
	this.createNextCell = function(columnNumber){
		var column = this.decisionTable.getColumnByNumber(columnNumber);
		var newCell = cellFactory.createCell(this.decisionTable, column);
		
		newCell.previousCell = this;
		this.nextCells.push(newCell);
		
		if (this.decisionTable.getColumns().length > columnNumber + 1){
			newCell.createNextCell(columnNumber + 1);
		}
	}
	
	this.isDuplicable = function(){
		if (this.previousCell != null &&
			this.column.destinationUse == 1) {
			
			return true;
		}
		
		return false;
	}
	
	this.canShowOperator = function(){
		if (this.column.idRelatedEntity > 0) {
				return false;
		}
		
		if (this.column.destinationUse == 1) {
			if ( isDatetime(this.column.dataType) ||
				isNumeric(this.column.dataType) ||
				isMoney(this.column.dataType) ){
				
				return true;
			}
		}		
		
		return false;
	}	
	
	this.getControlId = function() {
		return 'cell' + this.cellId;
	}
	
	this.getCellByControlId = function(cellId){
		for(var i=0; i<this.nextCells.length; i++){
			var cell = this.nextCells[i];
			
			if (cell.getControlId() == cellId){
				return cell;
				
			} else {
				var findedCell = cell.getCellByControlId(cellId);
				if (findedCell != null)	{
					return findedCell;
				}				
			}
		}	
		
		return null;
	}
	
	this.getCellArgumentById = function(argumentId){
		for(var i=0; i<this.nextCells.length; i++){
			var cell = this.nextCells[i];
			
			if (cell.className == 'FunctionCell' ){
				
				for(var i=0; i < cell.element.numberOfArguments; i++){
					var argument = cell.element.alArguments[i];
					
					if (argument.controlId == argumentId){
						return argument;
					}
				}
			} 
			
			var foundArgument = cell.getCellArgumentById(argumentId);
			if (foundArgument != null)	{
				return foundArgument;
			}				
		}	
		
		return null;
	}
	
	this.getHeight = function(){
		if (this.nextCells.length == 0){
			return CELL_HEIGHT;
			
		} else {
			
			var height = 0;
			for(var i=0; i<this.nextCells.length; i++){
				var cell = this.nextCells[i];
				height += cell.getHeight();
			}	
			
			return height;
		}
	}
	
	this.highlight = function() {
		var cellRender = document.getElementById(this.getControlId());
		cellRender.className = 'selectedCell';
		
		this.decisionTable.highlightedCells.push(this);
	}
	
	this.highlightNextCells = function() {
		for(var i=0; i<this.nextCells.length; i++){
			var cell = this.nextCells[i];
			cell.highlight();
			cell.highlightNextCells();
		}		
	}
	
	this.highlightPreviousCells = function() {
		if (this.previousCell != null){
			this.previousCell.highlight();
			this.previousCell.highlightPreviousCells();
		}
	}
	
	this.restore = function() {
		var cellRender = document.getElementById(this.getControlId());
		cellRender.className = 'cell';
	}	
	
	this.deleteCell = function() {
		if (this.previousCell != null && this.previousCell.nextCells.length == 1) {
			this.previousCell.deleteCell();
			
		} else {
			this.deleteNextCells();
		}
	}	
	
	this.deleteNextCells = function() {
		for(var i=0; i < this.nextCells.length; i++){
			var cell = this.nextCells[i];
			cell.deleteNextCells();
		}		

		if (this.previousCell != null)
		{
			this.previousCell.nextCells = removeFromArray(this.previousCell.nextCells, this);
		}
		else
		{
			this.decisionTable.rows = removeFromArray(this.decisionTable.rows, this);
		}
		
		this.decisionTable.highlightedCells = removeFromArray(this.decisionTable.highlightedCells, this);
	}
	
	this.getRuleCells = function(ruleCells){
	
		ruleCells.push(this);
		if (this.previousCell != null)
			return this.previousCell.getRuleCells(ruleCells);
			
		return ruleCells;
	}
	
	this.buildRule = function() {
		return createRuleCode(this.getRuleCells(new Array()));
	}
	
	this.getRulesCode = function() {
		var rulesCode = new Array();
		
		if (this.nextCells.length == 0) {
			rulesCode.push(this.buildRule());
		}
		
		for (var i=0 ; i < this.nextCells.length; i++){ 
			var rowRulesCode = this.nextCells[i].getRulesCode();
			
			for (j=0; j < rowRulesCode.length; j++) {
				rulesCode.push(rowRulesCode[j]);
			}
		}
		
		return rulesCode;
	}
	
	this.getCellsAtColumn = function(columnId){
		var cellsAtColumn = new Array();
		for (var i=0 ; i < this.nextCells.length; i++){ 
			var tempArray = this.nextCells[i].getCellsAtColumn(columnId);
			for (var j=0; j < tempArray.length; j++){
				cellsAtColumn.push(tempArray[j]);	
			}
		}

		if (columnId == this.column.getColumnNumber()) {
			cellsAtColumn.push(this);
		}

		return cellsAtColumn;
	}
}

function Cell(decisionTable, column) {
	this.element = new ArgumentConstant();
	this.element.setIdRelatedEntity(column.idRelatedEntity);
	this.element.parent = this;
	this.element.useDoubleClick = true;
	this.element.cssClass = 'argumentConstant cellArgument';
	this.element.onClickMethod = 'editCell';
	this.element.dataType = column.dataType;
	
	this.operator = new Operator();
	this.operator.id = 1;
    this.operator.expression = '=';
	
	this.nextCells = new Array();
	this.previousCell = null;
	
	this.column = column;
	this.decisionTable = decisionTable;
	
	this.className = "Cell";
	this.cellId = this.decisionTable.getNewCellId();
	this.controlId = this.getControlId();
			
	this.isValid = function(){
		if (this.element.value == null ||
			this.element.value == '')
		{
			showError( BAP_NO_VALID_CELL );
			return false;
		}
	
		for(var i=0; i < this.nextCells.length; i++){
			var isValid = this.nextCells[i].isValid();
			
			if (!isValid) 
				return false;
		}		
		
		return true;
	}	
	
	this.getXmlCodeForRule = function() {
		if (this.column.destinationUse == 1) {
			var tmpCondition = conditionFactory.createCondition(this.operator.conditionType);
			tmpCondition.operator = this.operator;
			tmpCondition.argument1  = new Argument();
			tmpCondition.argument1.element = new Definition()
			tmpCondition.argument1.element.setDefinition(this.column.definition);
			
			if (tmpCondition.className == 'NormalCondition') {
				tmpCondition.argument2  = new Argument();
				tmpCondition.argument2.element = new ArgumentConstant()
				tmpCondition.argument2.element.setArgumentConstant(this.element);
			}
			
			return 	tmpCondition.getXml();
			
		} else {
			var tmpExecutionStatement = executionStatementFactory.createExecutionStatement(1);
			tmpExecutionStatement.definition.setDefinition(this.column.definition);
			tmpExecutionStatement.argument.element = new ArgumentConstant()
			tmpExecutionStatement.argument.element.setArgumentConstant(this.element);
			
			return tmpExecutionStatement.getXml();
		}		
	}
	
	this.getXml = function () {
		var sXML = "<cell>";

		sXML += this.operator.getXml();
		
		var oTmpArgument = new Argument();
		oTmpArgument.setArgumentConstant(this.element);
		sXML += oTmpArgument.getXml();
					
		sXML += "<nextCells>";
		
		for(var i=0; i < this.nextCells.length; i++){
			sXML += this.nextCells[i].getXml();
		}		
		
		sXML += "</nextCells>";

		sXML += "</cell>";

		return sXML;
	}
	
	this.getCellHTML = function() {
		var sHTML =	'<div style="height:100%">';
		// add some properties to the style to adjust to cell
		sHTML +=		this.element.htmlValue();
		sHTML +=	'</div>';
		return 	sHTML;
	}
}
Cell.prototype = new GenericCell;

function FunctionCell(decisionTable, column) {
	this.element = new FunctionObj();
	this.element.parent = this;
	this.element.setFunction(column.element);
	
	this.nextCells = new Array();
	this.previousCell = null;
	
	this.column = column;
	this.decisionTable = decisionTable;
	
	this.className = "FunctionCell";
	this.cellId = this.decisionTable.getNewCellId();
	
	this.isValid = function(){
	
		for(var i=0; i < this.element.numberOfArguments; i++){
			var argument = this.element.alArguments[i];
			
			if (argument.element.value == null  ||
				argument.element.value == '')
			{
				showError( BAP_NO_VALID_CELL );
				return false;
			}			
		}
			
		for(var i=0; i < this.nextCells.length; i++){
			var isValid = this.nextCells[i].isValid();
			
			if (!isValid) 
				return false;
		}		
		
		return true;
	}	
	
	this.getXmlCodeForRule = function() {
		var tmpExecutionStatement = executionStatementFactory.createExecutionStatement(2);
		tmpExecutionStatement.oFunction.setFunction(this.element);
		
		return tmpExecutionStatement.getXml();
	}
	
	this.getXml = function () {
		var sXML = "<cell>";

		sXML += this.element.getXml();
		
		sXML += "<nextCells>";
		
		for(var i=0; i < this.nextCells.length; i++){
			sXML += this.nextCells[i].getXml();
		}		
		
		sXML += "</nextCells>";

		sXML += "</cell>";

		return sXML;
	}
	
	this.getCellHTML = function() {
		var sHTML =	'<div style="height:100%;width:100%">';
		for(var i=0; i < this.element.numberOfArguments; i++){
			
			var argument = this.element.alArguments[i];
			var width = this.column.functionObj.alArguments[i].width;
			var style = 'style="float:left;height:100%;width:' + width + 'px"';
			
			if (i == (this.element.numberOfArguments - 1))
				style = '';
			
			sHTML += '<div ' + style + ' id=\'' + argument.controlId + '\' >';
			
			// Prepare argument html
			//argument.element.parent = argument;
			argument.element.useDoubleClick = true;
			argument.element.cssClass = 'argumentConstant cellArgument';
			argument.element.onClickMethod = 'editCell';
			
			sHTML +=	argument.htmlValue();
			
			sHTML += '</div>';
		}
		sHTML +=	'</div>';
		return 	sHTML;
	}
}
FunctionCell.prototype = new GenericCell;

function CellFactory(){
	this.createCell = function(oDecisionTable, oColumn) {
		var newCell;
		if (oColumn.className == 'Column' )  {
			newCell = new Cell(oDecisionTable, oColumn);
		} else if (oColumn.className == 'FunctionColumn' )  {
			newCell = new FunctionCell(oDecisionTable, oColumn);
		}
		return newCell;
	}
}
var cellFactory = new CellFactory();

/// Global Objects
function PolicyRule(){
	this.className = "PolicyRule";
	this.conditionType = 1;
	this.useElse = false;
	this.conditions = new Array();
	this.executionStatements = new Array();
	this.elseExecutionStatements = new Array();
	this.conditionsHeaderHtml = "<div class=\"panelHeader\">" + BAP_CONDITION_HEADER_MESSAGE + "</div>";
	this.executionStatementsHeaderHtml = "<div class=\"panelHeader\">" + BAP_EXECUTIONSTATEMENT_HEADER_MESSAGE + "</div>";
	this.elseExecutionStatementsHeaderHtml = "<div class=\"panelHeader\">" + BAP_EXECUTIONSTATEMENT_HEADER_MESSAGE + "</div>";
	
	// for Policy Rule Table
	this.ruleTableRowId = getRandomID();
	this.getControlId = function(){
		return "ruleCode" + this.ruleTableRowId;
	}
	
	this.getConditionByControlId = function(controlId) {
		for(var i=0; i< this.conditions.length; i++){
			if (this.conditions[i].controlId == controlId){
				return this.conditions[i];
			}
		}			
	}
	
	this.getExecutionStatementByControlId = function(controlId) {
		for(var i=0; i< this.executionStatements.length; i++){
			if (this.executionStatements[i].controlId == controlId){
				return this.executionStatements[i];
			}
		}			
	
		for(var i=0; i< this.elseExecutionStatements.length; i++){
			if (this.elseExecutionStatements[i].controlId == controlId){
				return this.elseExecutionStatements[i];
			}
		}			
	}
	
	this.getOperatorByControlId = function(controlId) {
		for(var i=0; i< this.conditions.length; i++){
			if (this.conditions[i].operator.controlId == controlId){
				return this.conditions[i].operator;
			}
		}			
	}
	
	this.getSetDefinitionByControlId = function(controlId) {
		for(var i=0; i< this.executionStatements.length; i++){
			if (this.executionStatements[i].className == 'SetExecutionStatement') {
				if (this.executionStatements[i].definition.controlId == controlId){
					return this.executionStatements[i].definition;
				}
			}
		}			
		
		for(var i=0; i< this.elseExecutionStatements.length; i++){
			if (this.elseExecutionStatements[i].className == 'SetExecutionStatement') {
				if (this.elseExecutionStatements[i].definition.controlId == controlId){
					return this.elseExecutionStatements[i].definition;
				}
			}
		}
	}
	
	this.getArgumentByControlId = function(controlId) {
		for(var i=0; i< this.conditions.length; i++){
			var obj;
			obj = this.conditions[i].argument1.getArgumentByControlId(controlId);
			if (obj != null) 
				return obj;

			if (this.conditions[i].className == 'NormalCondition' ) {
				obj = this.conditions[i].argument2.getArgumentByControlId(controlId);
				if (obj != null) 
					return obj;
			}
		}		
		
		for(var i=0; i< this.executionStatements.length; i++){
			if (this.executionStatements[i].className == 'SetExecutionStatement') {
				obj = this.executionStatements[i].argument.getArgumentByControlId(controlId);
				if (obj != null) 
					return obj;
			}
			
			if (this.executionStatements[i].className == 'ActionExecutionStatement') {
				obj = this.executionStatements[i].oFunction.getArgumentByControlId(controlId);
				if (obj != null) 
					return obj;
			}			
		}
					
		for(var i=0; i< this.elseExecutionStatements.length; i++){
			if (this.elseExecutionStatements[i].className == 'SetExecutionStatement') {
				obj = this.elseExecutionStatements[i].argument.getArgumentByControlId(controlId);
				if (obj != null) 
					return obj;
			}
			
			if (this.elseExecutionStatements[i].className == 'ActionExecutionStatement') {
				obj = this.elseExecutionStatements[i].oFunction.getArgumentByControlId(controlId);
				if (obj != null) 
					return obj;
			}
			
		}				
	}
	
	this.deleteCondition = function(condition) {
		this.conditions = removeFromArray(this.conditions, condition);
	}
	
	this.deleteExecutionStatement = function(executionStatement) {
		this.executionStatements = removeFromArray(this.executionStatements, executionStatement);
		this.elseExecutionStatements = removeFromArray(this.elseExecutionStatements, executionStatement);
	}
	
	this.changeOtherArgument = function(element){
		
		if (element.parent.className == 'SetExecutionStatement') {
			var executionStatement = element.parent;
			executionStatement.argument.dataType = element.dataType;
			executionStatement.argument.idRelatedEntity = element.idRelatedEntity;
			
		} else if (element.parent.className == 'NormalCondition'){
			var condition = element.parent;
			var otherArgument = element == condition.argument1 ? condition.argument2 : condition.argument1;
			
			//otherArgument.dataType = element.dataType;
			otherArgument.setDataType(element.dataType);
			otherArgument.idRelatedEntity = element.idRelatedEntity;
		}
	}
	
	this.getOtherArgument = function(element){
		
		if (element.parent.className == 'NormalCondition'){
			var condition = element.parent;
			var otherArgument = element == condition.argument1 ? condition.argument2 : condition.argument1;
			
			return otherArgument;
		}
	}
	
    this.getOtherArgument = function(element){
		
		if (element.parent.className == 'NormalCondition'){
			var condition = element.parent;
			var otherArgument = element == condition.argument1 ? condition.argument2 : condition.argument1;
			
			return otherArgument;
		}
	}
	
	this.isValid = function(){
		if (this.conditions.length == 0){
			showError( BAP_NO_CONDITIONS );
			return false;
		}
		for (var i=0; i < this.conditions.length; i++ ) {
			var bValidated = this.conditions[i].isValid();
			
			if (bValidated == false)
				return false;
		}	
		
		if (this.executionStatements.length == 0){
			showError( BAP_NO_EXECUTIONSTATEMENTS );
			return false;
		}
		for (var i=0; i < this.executionStatements.length; i++ ) {
			var bValidated = this.executionStatements[i].isValid();
			
			if (bValidated == false)
				return false;
		}
		
		if (this.useElse){
			if (this.elseExecutionStatements.length == 0){
				showError( 'Else -->' + BAP_NO_EXECUTIONSTATEMENTS );
				return false;
			}
			for (var i=0; i < this.elseExecutionStatements.length; i++ ) {
				var bValidated = this.elseExecutionStatements[i].isValid();
				
				if (bValidated == false)
					return false;
			}
		}
		
		return true;
	}
	
	this.getXml = function(){
		var xmlCode;
		
		xmlCode = '<policyRule>';
					
		// Get xml code from all the if conditions
		xmlCode +=	'<conditions operator=\"' + this.conditionType + '\" >'; 
		
		for (var i=0; i < this.conditions.length; i++ ) {
			xmlCode += this.conditions[i].getXml();
		}
		xmlCode +=	'</conditions>';
		
		// get xml code from all the execution statements
		xmlCode +=	'<executionStatements>'; 
		
		for (var i=0; i < this.executionStatements.length; i++ ) {
			xmlCode += this.executionStatements[i].getXml();
		}
		xmlCode +=	'</executionStatements>';
		
		if (this.useElse){
			xmlCode +=	'<else>'; 
			
			// get xml code from all the else execution statements
			xmlCode +=	'<executionStatements>'; 
			
			for (var i=0; i < this.elseExecutionStatements.length; i++ ) {
				xmlCode += this.elseExecutionStatements[i].getXml();
			}
			xmlCode +=	'</executionStatements>';
		
			xmlCode +=	'</else>'; 
		}
		
		xmlCode += '</policyRule>';				
		return xmlCode;
	}
	
	this.createCondition = function(conditionType) {
		return conditionFactory.createCondition(conditionType);
	} 
	
	this.createExecutionStatement = function(executionStatementType) {
		return executionStatementFactory.createExecutionStatement(executionStatementType);
	} 
	
	this.changeOperator = function(oldOperator, newOperator) {
		var oldCondition = oldOperator.parent;
		
		if (oldOperator.conditionType ==  newOperator.conditionType){
			oldCondition.operator.setOperator(newOperator);
			return;
		}
		
		var newCondition = this.createCondition(newOperator.conditionType);
		
		if (newCondition.className == 'NormalCondition') {

			newCondition.argument1 = oldCondition.argument1;
			newCondition.operator = newOperator;
			
			if (oldCondition.className == 'NormalCondition')
			    newCondition.argument2 = oldCondition.argument2;
			else
			{
			    newCondition.argument2 = new Argument();
			    newCondition.argument2.dataType = newCondition.argument1.dataType;
			    newCondition.argument2.element.dataType = newCondition.argument1.element.dataType;
			}
			    
			newCondition.argument1.parent = newCondition;
			newCondition.operator.parent = newCondition;
			newCondition.argument2.parent = newCondition;
		
		} else {
			newCondition.argument1 = oldCondition.argument1;
			newCondition.operator = newOperator;
			newCondition.argument1.parent = newCondition;
			newCondition.operator.parent = newCondition;
		}
		
		// Replace condition
		for(var i=0; i< this.conditions.length; i++){
			if (this.conditions[i].controlId == oldCondition.controlId){
				this.conditions[i] = newCondition;
			}
		}			
	}
}

function Precondition(){
	this.className = "Precondition";
	this.conditionType = 1;
	this.conditions = new Array();
	this.conditionsHeaderHtml = "<div class=\"panelHeader\">" + BAP_CONDITION_HEADER_MESSAGE + "</div>";
	
	this.getConditionByControlId = function(controlId) {
		for(var i=0; i< this.conditions.length; i++){
			if (this.conditions[i].controlId == controlId){
				return this.conditions[i];
			}
		}			
	}
	
	this.getOperatorByControlId = function(controlId) {
		for(var i=0; i< this.conditions.length; i++){
			if (this.conditions[i].operator.controlId == controlId){
				return this.conditions[i].operator;
			}
		}			
	}
	
	this.getArgumentByControlId = function(controlId) {
		for(var i=0; i< this.conditions.length; i++){
			var obj;
			obj = this.conditions[i].argument1.getArgumentByControlId(controlId);
			if (obj != null) 
				return obj;

			if (this.conditions[i].className == 'NormalCondition' ) {
				obj = this.conditions[i].argument2.getArgumentByControlId(controlId);
				if (obj != null) 
					return obj;
			}
		}		
	}
	
	this.deleteCondition = function(condition) {
		this.conditions = removeFromArray(this.conditions, condition);
	}
	
	this.changeOtherArgument = function(element){
		
		if (element.parent.className == 'NormalCondition'){
			var condition = element.parent;
			var otherArgument = element == condition.argument1 ? condition.argument2 : condition.argument1;
			
			otherArgument.dataType = element.dataType;
			otherArgument.element.dataType = element.dataType;
			otherArgument.idRelatedEntity = element.idRelatedEntity;
		}
	}
	
	this.getOtherArgument = function(element){
		
		if (element.parent.className == 'NormalCondition'){
			var condition = element.parent;
			var otherArgument = element == condition.argument1 ? condition.argument2 : condition.argument1;
			
			return otherArgument;
		}
	}
	
	this.isValid = function(){
		if (this.conditions.length == 0){
			showError( BAP_NO_CONDITIONS );
			return false;
		}
		for (var i=0; i < this.conditions.length; i++ ) {
			var bValidated = this.conditions[i].isValid();
			
			if (bValidated == false)
				return false;
		}	
		
		return true;
	}
	
	this.getXml = function(){
		var xmlCode;
		
		xmlCode = '<policyRule>';
					
		// Get xml code from all the if conditions
		xmlCode +=	'<conditions operator=\"' + this.conditionType + '\" >'; 
		
		for (var i=0; i < this.conditions.length; i++ ) {
			xmlCode += this.conditions[i].getXml();
		}
		xmlCode +=	'</conditions>';
		
		xmlCode += '</policyRule>';				
		return xmlCode;
	}
	
	this.createCondition = function(conditionType) {
		return conditionFactory.createCondition(conditionType);
	} 
	
	this.changeOperator = function(oldOperator, newOperator) {
		var oldCondition = oldOperator.parent;
		
		if (oldOperator.conditionType ==  newOperator.conditionType){
			oldCondition.operator.setOperator(newOperator);
			return;
		}
		
		var newCondition = this.createCondition(newOperator.conditionType);
		
		if (newCondition.className == 'NormalCondition') {

			newCondition.argument1 = oldCondition.argument1;
			newCondition.operator = newOperator;
			
			if (oldCondition.className == 'NormalCondition') 
			    newCondition.argument2 = oldCondition.argument2;
			else
			{
			    newCondition.argument2 = new Argument();
			    newCondition.argument2.dataType = newCondition.argument1.dataType;
			    newCondition.argument2.element.dataType = newCondition.argument1.element.dataType;
			}
			    
			newCondition.argument1.parent = newCondition;
			newCondition.operator.parent = newCondition;
			newCondition.argument2.parent = newCondition;
		
		} else {
			newCondition.argument1 = oldCondition.argument1;
			newCondition.operator = newOperator;
			newCondition.argument1.parent = newCondition;
			newCondition.operator.parent = newCondition;
		}
		
		// Replace condition
		for(var i=0; i< this.conditions.length; i++){
			if (this.conditions[i].controlId == oldCondition.controlId){
				this.conditions[i] = newCondition;
			}
		}			
	}
}

function DecisionTable(){
	this.className = "DecisionTable";
	this.columns_Get = new Array();
	this.columns_Set = new Array();
	this.rows = new Array();
	this.randomIds = new Array();	
	this.highlightedCells = new Array();
	
	// to keep BAS properties
	this.height = 0;
	this.width = 0;
	
	this.addColumn = function(newColumn){ 
	
		newColumn.decisionTable = this;
		
		if (newColumn.destinationUse == 1 && this.columns_Get.length > 0){
			var index = this.columns_Get.length;
			var cellsAtColumn = this.getCellsAtColumn(index - 1);
			this.internalAddColumn(newColumn);
			
			for (var i=0; i < cellsAtColumn.length; i++){
				var cell = cellsAtColumn[i];
				var newCell = new Cell(this, newColumn);
				newCell.previousCell = cell;
				
				for (var j=0; j< cell.nextCells.length; j++){
					var nextCell = cell.nextCells[j];
					newCell.nextCells.push(nextCell);
					nextCell.previousCell = newCell;
				}
				
				cell.nextCells = new Array();;
				cell.nextCells.push(newCell);
			}
		
		} else {
			var index = this.getColumns().length;
			var cellsAtColumn = this.getCellsAtColumn(index - 1);
			this.internalAddColumn(newColumn);
			
			for (var i=0; i < cellsAtColumn.length; i++){
				var cell = cellsAtColumn[i];
				var newCell = new Cell(this, newColumn);
				newCell.previousCell = cell;
				
				cell.nextCells.push(newCell);
			}
		}		
	}
	
	this.internalAddColumn = function(newColumn) {
		newColumn.decisionTable = this;
	
		if (newColumn.destinationUse == 1){
			this.columns_Get.push(newColumn);
		} else {
			this.columns_Set.push(newColumn);
		}	
	}
	
	this.deleteColumn = function(columnToDelete){
		if (this.rows.length > 0) {
			showError( BAP_CANT_DELETE_COLUMN );
			return;
		}	
	
		if (columnToDelete.destinationUse == 1) {
			this.columns_Get = removeFromArray(this.columns_Get, columnToDelete);
		
		} else {
			this.columns_Set = removeFromArray(this.columns_Set, columnToDelete);
			
		}
	}
	
	this.getColumns = function(){
		var newArray = new Array();
		
		for(var i=0; i<this.columns_Get.length; i++){
			newArray.push(this.columns_Get[i]);
		}	
		for(var i=0; i<this.columns_Set.length; i++){
			newArray.push(this.columns_Set[i]);
		}	
		
		return newArray;
	}
	
	this.getColumnByControlId = function(columnId){
		var columns = this.getColumns();
		
		for(var i=0; i<columns.length; i++){
			if (columns[i].getControlId() == columnId){
				return columns[i];
			}
		}	
		
		return null;
	}
	
	this.getColumnArgumentById = function(columnId){
		var columns = this.getColumns();
		
		for(var i=0; i<columns.length; i++){
			if (columns[i].className == 'FunctionColumn') {
				for (var j=0; j<columns[i].functionObj.numberOfArguments; j++) {
					var argument = columns[i].functionObj.alArguments[j];
					var argumentId = columns[i].getControlId() + "_" + j;
					
					if (argumentId == columnId) {
						return argument;
					}
				}
			}
		}
		
		return null;
	}
	
	this.getColumnByNumber = function(columnNumber){
		var columns = this.getColumns();
		
		return columns[columnNumber];
	}
	
	this.getCellByControlId = function(cellId){
		for(var i=0; i<this.rows.length; i++){
			var cell = this.rows[i];
			
			if (cell.getControlId() == cellId){
				return cell;
				
			} else {
				var foundCell = cell.getCellByControlId(cellId);
				if (foundCell != null)	{
					return foundCell;
				}				
			}
		}	
		
		return null;
	}
	
	this.getCellArgumentById = function(argumentId){
		for(var i=0; i<this.rows.length; i++){
			var cell = this.rows[i];
			
			if (cell.className == 'FunctionCell' ){
				
				for(var i=0; i < cell.element.numberOfArguments; i++){
					var argument = cell.element.alArguments[i];
					
					if (argument.controlId == argumentId){
						return argument;
					}
				}
			} 
			
			var foundArgument = cell.getCellArgumentById(argumentId);
			if (foundArgument != null)	{
				return foundArgument;
			}				
		}	
		
		return null;
	}
		
	this.addNewRow = function(){
		if (this.columns_Get.length == 0 || this.columns_Set.length == 0)
		{
			showError( BAP_CANT_ADD_ROW );
			return;	
		}
		
		var columns = this.getColumns();
		
		var newCell = cellFactory.createCell(this, columns[0]);
		this.rows.push(newCell);
		
		if (columns.length > 1){
			newCell.createNextCell(1);
		}
	}
	
	this.addRow = function(newCell){
		this.rows.push(newCell);
	}
	
	this.getCellsAtColumn = function(columnId){
		var cellsAtColumn =  new Array();
		
		for (var i=0; i < this.rows.length; i++){
			var tempArray = this.rows[i].getCellsAtColumn(columnId);

			for (var j=0; j < tempArray.length; j++){
				cellsAtColumn.push(tempArray[j]);	
			}				
		}		
		
		return cellsAtColumn;
	}
	
	this.getNewCellId = function() {
		var maxNumberOfCells = 10000;
		
		if (this.randomIds.length >= maxNumberOfCells){
			showError("Too many cells");
			throw "Too many cells";
		}
		
		var number = getRandomNumber(maxNumberOfCells);
		
		for (var i=0; i < this.randomIds.length; i++){
			if (number == this.randomIds[i] ){
				// Gets another cell id because it is used
				return this.getNewCellId();
			}
		}
		
		// the number is not used so return it
		this.randomIds.push(number);
		return number;
	}
	
	this.restoreCells = function(){
		for (var i=0; i < this.highlightedCells.length; i++){
			this.highlightedCells[i].restore();
		}
	} 	
	
	this.getWidth = function() {
		var columns = this.getColumns();
		var width = 0;
		for(var i=0; i<columns.length; i++){
			width += parseInt(columns[i].width) + 7;
		}	
		
		return width;
	}
	
	this.getXml = function () {
		var sXML = "<decisionTable width=\"" + this.width + "\" height=\"" + this.height + "\">";

		// Columns
		sXML += "<columns>";

		var columns = this.getColumns();
		for (var i=0; i < columns.length; i++){
			sXML += columns[i].getXml();
		}
				
		sXML += "</columns>";

		// Cells
		sXML += "<cells>";
		for (var i=0; i < this.rows.length; i++){
			sXML += this.rows[i].getXml();
		}

		sXML += "</cells>";

		sXML += "</decisionTable>";
		return sXML;	
	}
	
	this.isValid = function(){
		if (this.rows.length == 0)
		{
			showError( BAP_NO_ROWS );
			return false;
		}
		
		for (var i=0; i < this.rows.length; i++) {
			var isValid = this.rows[i].isValid();
			
			if (!isValid) 
				return false;
		}
		
		return true;
	}
	
	this.getRulesCode = function() {
		var rulesCode = new Array();
		for (var i=0 ; i < this.rows.length; i++){ 
			var rowRulesCode = this.rows[i].getRulesCode();
			
			for (j=0; j < rowRulesCode.length; j++) {
				rulesCode.push(rowRulesCode[j]);
			}
		}
		
		var sXmlRules = '<rulesCode>';
		for (var i=0; i < rulesCode.length; i++){
			sXmlRules += '<ruleCode>' +  rulesCode[i] + '</ruleCode>';
		}
		sXmlRules += '</rulesCode>';
		
		return sXmlRules;
	}
	
	this.calculateColumnHeight = function() {
		var columns = this.getColumns();
		for (var i=0; i < columns.length; i++){
			if (columns[i].className == "FunctionColumn")
				return '48px';
		}
		
		return '24px';
	}
	
	this.calculateColumnsWidth = function() {
		var columns = this.getColumns();
		var iWidth = 0;
		for (var i=0; i < columns.length; i++){
			if (i != (columns.length - 1) &&
				columns[i].width != 0) {
				
				iWidth += parseInt(columns[i].width);
			} else {
			
				iWidth += parseInt(columns[i].minWidth);
			}
		}		
		
		return iWidth;
	}
}

function PolicyRuleTable(){
	this.className = "PolicyRuleTable";
	this.columns = new Array();
	this.rulesCode = new Array();
	
	// to keep BAS properties
	this.height = 0;
	this.width = 0;
	
	//used just to save widths
	this.internalColumns = new Array();
	
	// column counters
	this.iThenColumns = 0;
	this.iElseColumns = 0;
	this.iNormalColumns = 4;
	
	this.addLoadedColumn = function(column){
		this.internalColumns.push(column);
	}
		
	this.buildRuleTableColumns = function() {
		this.iThenColumns = 0;
		this.iElseColumns = 0;
		
		this.columns = new Array();
		
		//Add basic columns
		this.columns.push(new RuleTableColumn(this, "Argument 1", 1));
		this.columns.push(new RuleTableColumn(this, "Operator", 1));
		this.columns.push(new RuleTableColumn(this, "Argument 2", 1));
		this.columns.push(new RuleTableColumn(this, "And/Or", 1));
		
		for (var i=0; i<this.rulesCode.length; i++){
			var ruleCode = this.rulesCode[i];
			this.iThenColumns = this.iThenColumns < ruleCode.executionStatements.length ? ruleCode.executionStatements.length : this.iThenColumns;
			this.iElseColumns = this.iElseColumns < ruleCode.elseExecutionStatements.length ? ruleCode.elseExecutionStatements.length : this.iElseColumns;
		}
		
		for (var i=1; i<=this.iThenColumns; i++){
			this.columns.push(new RuleTableColumn(this, "Then Action " + i, 2));
		}
		
		for (var i=1; i<=this.iElseColumns; i++){
			this.columns.push(new RuleTableColumn(this, "Else Action " + i, 3));
		}
		
		// Adjust widths
		for (var i=0; i<this.columns.length; i++){
			if (this.internalColumns[i] != null)
				this.columns[i].width = this.internalColumns[i].width;
		}
	}
	this.buildRuleTableColumns();
	
	this.addRuleCode = function(ruleCode){
		this.rulesCode.push(ruleCode);
		this.buildRuleTableColumns();
	}
	
	this.getColumns = function() {
		return this.columns;
	}
	
	this.getColumnByControlId = function(columnId){
		for(var i=0; i<this.columns.length; i++){
			if (this.columns[i].getControlId() == columnId){
				return this.columns[i];
			}
		}	
		
		return null;
	}
	
	this.getRuleCodeByControlId = function(controlId) {
		for (var i=0; i< this.rulesCode.length; i++){
			if (this.rulesCode[i].getControlId() == controlId)
				return this.rulesCode[i];
		}
		
		return null;
	}
	
	this.setRuleCodeByControlId = function(controlId, newRuleCode) {
		for (var i=0; i< this.rulesCode.length; i++){
			if (this.rulesCode[i].getControlId() == controlId)
				this.rulesCode[i] = newRuleCode;
		}
		
		this.buildRuleTableColumns();
	}
	
	this.deleteRuleCodeByControlId = function(ruleCode) {
		this.rulesCode = removeFromArray(this.rulesCode, ruleCode);
		this.buildRuleTableColumns();
	}
	
	this.restore = function() {
		for (var i=0; i< this.rulesCode.length; i++){
			var ruleCodeControl = document.getElementById(this.rulesCode[i].getControlId());
			ruleCodeControl.className = 'ruleCode';
		}
	}
	
	this.highlightRuleCode = function(ruleCode) {
		var ruleCodeControl = document.getElementById(ruleCode.getControlId());
		ruleCodeControl.className = 'selectedRuleCode';
	}
	
	this.isValid = function(){
		if (this.rulesCode.length == 0)
		{
			showError(BAP_POLICY_NORULECODES);
			return false;
		}
		
		for (var i=0; i < this.rulesCode.length; i++) {
			var isValid = this.rulesCode[i].isValid();
			
			if (!isValid) 
				return false;
		}
		
		return true;
	}
	
	this.getXml = function () {
		var sXML = "<ruleTable width=\"" + this.width + "\" height=\"" + this.height + "\">";

		// Columns
		sXML += "<columns>";

		var columns = this.getColumns();
		for (var i=0; i < columns.length; i++){
			sXML += columns[i].getXml();
		}
				
		sXML += "</columns>";

		// Rules Code
		sXML += "<rulesCode>";
		for (var i=0; i < this.rulesCode.length; i++){
			sXML += "<ruleCode>";
			sXML += this.rulesCode[i].getXml();
			sXML += "</ruleCode>";
		}

		sXML += "</rulesCode>";

		sXML += "</ruleTable>";
		return sXML;	
	}
	
	this.calculateColumnHeight = function() {
		return '24px';
	}
	
	this.calculateColumnsWidth = function() {
		var iWidth = 0;
		for (var i=0; i < this.columns.length; i++){
			if (i != (this.columns.length - 1) &&
				this.columns[i].width != 0) {
				
				iWidth += parseInt(this.columns[i].width);
			} else {
			
				iWidth += parseInt(this.columns[i].minWidth);
			}
		}		
		
		return iWidth;
	}
}

// Cache
function PolicyObjectCacheItem(key, element){
	this.key = key;
	this.element = element;
}

function PolicyObjectsCache(){
	this.elements = new Array();
	
	this.addElement = function(key, element){
		var newCacheItem = new PolicyObjectCacheItem(key, element);
		this.elements.push(newCacheItem);
	}
	
	this.getElementbyKey = function(key){
		for (var i=0; i<this.elements.length; i++){
			if (this.elements[i].key == key)
				return this.elements[i].element;
		}
		
		return null;
	}
}
var policyObjectsCache = new PolicyObjectsCache();
var DEFINITION_PREFIX = 'DEF';
var OPERATOR_PREFIX = 'OPE';
var FUNCTION_PREFIX = 'FUN';