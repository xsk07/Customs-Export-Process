// XML creation functions
function createRuleCode(ruleCells){
	var bThenFound = false;
	var sXml = "<policyRule>" + "";
	// Add AND operator
	sXml += "<conditions operator=\"1\" >" + "";

	while (ruleCells.length > 0) {
		var cell = ruleCells.pop();
				
		if ( cell.column.definitionUse == 1) {
			sXml += cell.getXmlCodeForRule();
			
		} else {
			if (!bThenFound) {
				sXml += "</conditions>" + "";
				sXml += "<executionStatements>" + "";
				bThenFound = true;
			} 
		
			sXml += cell.getXmlCodeForRule();
		}
	}
		
	sXml += "</executionStatements>" + "";
	sXml += "</policyRule>" + "";
			
	return sXml;
}

// Preview rule functions
var previewPolicyRule = null;
var previerPolicyRuleDiv = null;
function paintRule(ruleCode, div){ 
	previerPolicyRuleDiv = div;
	previewPolicyRule = loadPolicyRuleXml(ruleCode, paintPreviewRuleCode);
	return {
	    policyRule: previewPolicyRule,
	    fnGenerator: paintPreviewRuleCode
	};
}

function paintPreviewRuleCode(paramRuleCode){
	// Assign parameter to global variable
	if (typeof(paramRuleCode) != 'undefined' &&
		paramRuleCode.className == 'PolicyRule')
		previewPolicyRule = paramRuleCode;
		
	var sHtml = '<table width="auto"  border="0" cellspacing="0" cellpadding="0">';
	
	// Draw If
	sHtml += '<tr>';
	sHtml += '	<td colspan="2" align="left" valign="top">';
	sHtml += '		<SPAN class="ifThenLabelSmall">' + BAP_POLICYRULE_IF + '</SPAN>';
	
	// Draw Condition Operator
	var conditionOperator = previewPolicyRule.conditionType == 1 ? BAP_POLICYRULE_ANDMESSAGE : BAP_POLICYRULE_ORMESSAGE;
	sHtml += '&nbsp;' + conditionOperator;
	sHtml += '	</td>';
	sHtml += '</tr>';

	// Draw Conditions
	
	sHtml += '<tr>';
    sHtml += '	<td width="10%">&nbsp;</td>';
    sHtml += '	<td width="90%">';
	sHtml += '		<table width="100%"  border="0" cellspacing="1" cellpadding="0">';
	
	for (var i=0; i < previewPolicyRule.conditions.length; i++){
		sHtml += paintCondition(previewPolicyRule.conditions[i]);
	}
	
	sHtml += '		</table>';
    sHtml += '	</td>';
    sHtml += '</tr>';
				
	// Draw Then
	sHtml += '<tr>';
    sHtml += '	<td colspan="2">';
    sHtml += '		<SPAN class="ifThenLabelSmall">' + BAP_POLICYRULE_THEN + '</SPAN>';
    sHtml += '	</td>';
    sHtml += '</tr>';

	// Draw Execution Statements
	sHtml += '<tr>';
    sHtml += '	<td>&nbsp;</td>';
    sHtml += '	<td>';
	sHtml += '		<table width="100%"  border="0" cellspacing="1" cellpadding="0">';
	
	for (var i=0; i < previewPolicyRule.executionStatements.length; i++){
		sHtml += paintExecutionStatement(previewPolicyRule.executionStatements[i]);
	}
	
	sHtml += '		</table>';
    sHtml += '	</td>';
    sHtml += '</tr>';
    
    if (previewPolicyRule.useElse){
		// Draw Else
		sHtml += '<tr>';
		sHtml += '	<td colspan="2">';
		sHtml += '		<SPAN class="ifThenLabelSmall">' + BAP_POLICY_ELSE + '</SPAN>';
		sHtml += '	</td>';
		sHtml += '</tr>';
	    
		// Draw Else Execution Statements
		sHtml += '<tr>';
		sHtml += '	<td>&nbsp;</td>';
		sHtml += '	<td>';
		sHtml += '		<table width="100%"  border="0" cellspacing="1" cellpadding="0">';
		
		for (var i=0; i < previewPolicyRule.elseExecutionStatements.length; i++){
			sHtml += paintExecutionStatement(previewPolicyRule.elseExecutionStatements[i]);
		}
		
		sHtml += '		</table>';
		sHtml += '	</td>';
		sHtml += '</tr>';
    }
	
	sHtml += '</table>';
	previerPolicyRuleDiv.innerHTML = sHtml;

	return sHtml;
}

function paintCondition(condition) {
	var sHtml = '<tr>';
	sHtml += '	<td class="condition">';
			
	// Draw definition
	sHtml += condition.argument1.htmlValue(false);
	// Draw operator
	if (condition.operator.id > 0)
		sHtml += condition.operator.htmlValue(false);
	
	if (condition.className == 'NormalCondition'){
		// Draw Argument
		sHtml += condition.argument2.htmlValue(false);
	}
	
	sHtml += '	</td>';
	sHtml += '</tr>';
	
	return sHtml;
}

function paintExecutionStatement(executionStatement) {
	var sHtml = '<tr>';
	sHtml += '	<td class="executionStatement">';
	sHtml += executionStatement.htmlValue(false);

	sHtml += '	</td>';
	sHtml += '</tr>';
			
	return sHtml;
}
