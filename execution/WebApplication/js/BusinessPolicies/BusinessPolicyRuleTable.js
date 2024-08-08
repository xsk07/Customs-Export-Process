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
var principalwidth;
// Object that represents the full table (rule table view)
var policyRuleTable = new PolicyRuleTable();
// Object that represents the current rule code (rule code view)
var policyItem = null;
var editingRuleCodeId = 0; 
var drawPolicyItemFunction = drawRuleCodeView;
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
	
	// Set rendering type to Table
	BP_RENDERING_TYPE = 2;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									LOAD/ SAVE METHODS										  //////
////////////////////////////////////////////////////////////////////////////////////////////////////////

// Load the xml into the javascript object
function loadPolicyRuleTable(sXml){
	policyRuleTable = loadPolicyRuleTableFromXML(sXml, drawRuleTableView);
	//window.onresize = drawContent;
	drawContent();
}

function reloadPolicyRuleTable(){
	document.getElementById('bSavePolicyItem').value = false;
	
	document.forms['frmPolicyItem'].submit();
}

function savePolicyRuleTable(){
	document.getElementById('policyItemXml').value = policyRuleTable.getXml();
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
	
	return  policyRuleTable.isValid();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									RESIZING METHODS										  //////
////////////////////////////////////////////////////////////////////////////////////////////////////////

function calculatePanelWidth(){
	var panelId = BP_RENDERING_TYPE == 1 ? 'ruleDesignContent' : 'ruleTableContent';
	var panelDelta = BP_RENDERING_TYPE == 1 ? 95 : 8;

	if (document.getElementById(panelId).offsetWidth == 0)
		return 0;
	
	return document.getElementById(panelId).offsetWidth - panelDelta -17;
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
    iPanelWidth = (iPanelWidth == 0) ? (calculatePanelWidth()) : iPanelWidth;
    iPanelWidth = iPanelWidth + "px";
	resizePolicyToolbox(document.getElementById("ruleTableContent"));

	if (BP_RENDERING_TYPE == 1){
		// Adjust internal panels
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

		document.getElementById("divIf").style.height = document.getElementById("ifRow").offsetHeight + 150 + "px";
		document.getElementById("divThen").style.height = document.getElementById("thenRow").offsetHeight + 150 + "px";
		
		if (policyItem.useElse) {
		    document.getElementById("divElse").style.height = document.getElementById("elseRow").offsetHeight + 150 + "px";
		}
	
	} else {
	    document.getElementById('ruleTableDiv').style.width = 'auto';
	    document.getElementById('ruleTableDiv').style.width = document.getElementById('ruleTableDiv').offsetWidth;
        document.getElementById('ruleTableDiv').style.paddingRight = 17;
		document.getElementById('rulePreviewDiv').style.width = iPanelWidth;
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									ACTION METHODS											  //////
////////////////////////////////////////////////////////////////////////////////////////////////////////

function addNewRuleCode(){
	policyItem = new PolicyRule();
	
	// Set -1 to add
	editingRuleCodeId = -1;

	// Draw the editing item
	switchToRuleCodeView();
	drawRuleCodeView();
}

function deleteRuleCode(idRuleCode){
	var ruleCode = policyRuleTable.getRuleCodeByControlId(idRuleCode);
	policyRuleTable.deleteRuleCodeByControlId(ruleCode);
	
	// Redraw item
	drawRuleTableView();
}
function selectRuleCode(idRuleCode){
    var reference;
    this.rules = this.rules || {};

    // restore elements
	policyRuleTable.restore();
	
	if (this.rules[idRuleCode]) {
	    var rulePreviewDiv = document.getElementById('rulePreviewDiv');
	    var ruleTableDiv = document.getElementById('ruleTableDiv');
	    var ruleTableOuterDiv = document.getElementById('ruleTableOuterDiv');
	    rulePreviewDiv.style.display = '';
	    rulePreviewDiv.style.height = '40%';
	    rulePreviewDiv.style.width = '100%';
	    ruleTableOuterDiv.style.height = '60%';

	    reference = this.rules[idRuleCode];
	    policyRuleTable.highlightRuleCode(reference.ruleCode);
	    reference.fnGenerator(reference.policyRule);
	} else {

	    var ruleCode = policyRuleTable.getRuleCodeByControlId(idRuleCode);
	    policyRuleTable.highlightRuleCode(ruleCode);

	    reference = paintPreview(ruleCode);
	    reference.ruleCode = ruleCode;

	    this.rules[idRuleCode] = reference;
	}
}
function editRuleCode(idRuleCode){
	var editingRuleCode = policyRuleTable.getRuleCodeByControlId(idRuleCode);
	editingRuleCodeId = idRuleCode;
	
	policyItem = loadPolicyRuleXml(editingRuleCode.getXml(), editRuleCode_CallBack);
}
function editRuleCode_CallBack(paramRuleCode){
	// Assign parameter to global variable
	if (typeof(paramRuleCode) != 'undefined' &&
		paramRuleCode.className == 'PolicyRule')
		policyItem = paramRuleCode;

	// Draw the editing item
	switchToRuleCodeView();
	drawRuleCodeView();
}

function discardRuleCode(){
	policyItem = null;
	switchToRuleTableView();
	drawRuleTableView();
}

function validateRuleCode(){
	return policyItem.isValid();
}

function updateRuleCode(){
	// Check if the rule code is valid	
	if (validateRuleCode()){
		if (editingRuleCodeId != -1) {	// Update 
			policyRuleTable.setRuleCodeByControlId(editingRuleCodeId, policyItem);
		
		} else {						//Add
			policyRuleTable.addRuleCode(policyItem);
		}
		
		policyItem = null;
		switchToRuleTableView();
		drawRuleTableView();
	}
}

function switchToRuleCodeView(){
	var ruleTableView = document.getElementById('ruleTableView');
	var ruleCodeView = document.getElementById('ruleCodeView');
	var ruleTableButtons = document.getElementById('ruleTableButtons');
	var ruleCodeButtons = document.getElementById('ruleCodeButtons');
	
	ruleTableView.style.display = 'none';
	ruleCodeView.style.display = 'block';
	ruleTableButtons.style.display = 'none';
	ruleCodeButtons.style.display = 'block';
	
	// Set rendering type to RuleCode
	BP_RENDERING_TYPE = 1;
}

function switchToRuleTableView(){
	var ruleTableView = document.getElementById('ruleTableView');
	var ruleCodeView = document.getElementById('ruleCodeView');
	var ruleTableButtons = document.getElementById('ruleTableButtons');
	var ruleCodeButtons = document.getElementById('ruleCodeButtons');
	
	ruleTableView.style.display = 'block';
	ruleCodeView.style.display = 'none';
	ruleTableButtons.style.display = 'block';
	ruleCodeButtons.style.display = 'none';
	
	// Set rendering type to Table
	BP_RENDERING_TYPE = 2;
}

function paintPreview(ruleCode) {
	var rulePreviewDiv = document.getElementById('rulePreviewDiv');
	var ruleTableDiv = document.getElementById('ruleTableDiv');
	var ruleTableOuterDiv = document.getElementById('ruleTableOuterDiv');
	rulePreviewDiv.style.display = '';
	rulePreviewDiv.style.height = '40%';
	rulePreviewDiv.style.width = '100%';
	ruleTableOuterDiv.style.height = '60%';
	
	// Paint the preview
	return paintRule(ruleCode.getXml(), rulePreviewDiv);
}

function hidePreview() {
	var rulePreviewDiv = document.getElementById('rulePreviewDiv');
	var ruleTableOuterDiv = document.getElementById('ruleTableOuterDiv');
	rulePreviewDiv.style.display = 'none';
	rulePreviewDiv.style.height = 'auto';
	rulePreviewDiv.style.width = '0px';
	rulePreviewDiv.innerHTML = '';
	
	ruleTableOuterDiv.style.height = '';					
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									DRAW METHODS									  //////
////////////////////////////////////////////////////////////////////////////////////////////////////////
function drawContent(){
	if (BP_RENDERING_TYPE == 1){
		drawRuleCodeView();
	} else {
		drawRuleTableView();		
	}
}

function drawRuleTableView(paramRuleTable){
	// Do nothing if rule is not fully loaded
	if (bMainMethodEnded == false) {
		return;
	}
	
	// Assign parameter to global variable
	if (typeof(paramRuleTable) != 'undefined' &&
		paramRuleTable.className == 'PolicyRuleTable')
		policyRuleTable = paramRuleTable;
	
	// Set shorcut objects
	var ruleTableDiv = document.getElementById('ruleTableDiv');
	var ruleTableColumnsDiv = document.getElementById('ruleTableColumns');
	var ruleTableCellsDiv = document.getElementById('ruleTableCells');
	var ruleTableAddRowDiv = document.getElementById('ruleTableAddRow');	
	
	// Clear all elements
	ruleTableColumnsDiv.innerHTML = '';
	ruleTableCellsDiv.innerHTML = '';
	ruleTableAddRowDiv.innerHTML = '';
	ruleTableDiv.style.width = '0px';
	
	// Hide preview
	hidePreview();
	
	iPanelWidth = calculatePanelWidth();
	
	// Draw columns
	var columns = policyRuleTable.getColumns();
	//set first column size
	columns[0].width ="190"

	for(var i=0; i<columns.length; i++){
		var bLastElement = (i == (columns.length - 1));
		var newColumn = drawColumn(columns[i], bLastElement);
	}
	
	// Adjust column bar
	var estimatedDecisiontableWidth = policyRuleTable.calculateColumnsWidth();
	ruleTableColumnsDiv.style.height = policyRuleTable.calculateColumnHeight();
	
	// Draw Rule Code
	for(var i=0; i<policyRuleTable.rulesCode.length; i++){
		drawRuleCode(policyRuleTable.rulesCode[i],policyRuleTable);
	}
	/*
	if (estimatedDecisiontableWidth > iPanelWidth ){
		ruleTableColumnsDiv.style.width = estimatedDecisiontableWidth;
		ruleTableCellsDiv.style.width = estimatedDecisiontableWidth;
	} else {
		ruleTableColumnsDiv.style.width = iPanelWidth;
		ruleTableCellsDiv.style.width = iPanelWidth;		
	}*/	
	
	// Add the add rule code buttton
	var addRowHtml = document.getElementById('addRowHtml');
	ruleTableAddRowDiv.innerHTML += addRowHtml.innerHTML;
	
	// Rearrange elements
	resizePanels();
}

function drawColumn(column, bLastElement){
	var ruleTableColumnsDiv = document.getElementById('ruleTableColumns');
	var columnTemplate = document.getElementById('column');
	
	// Set new column properties
	var columnRender = document.createElement('DIV');
	columnRender.innerHTML = columnTemplate.innerHTML;
	columnRender.id = column.getControlId();
	columnRender.className = columnTemplate.className;
	
	// Set Column Size
	if (column.width != 0){
		columnRender.style.width = column.width;
	} else {
		columnRender.style.width = column.calculateMinWidth();
	}	
	columnRender.style.height = policyRuleTable.calculateColumnHeight();
	
	// Draw column content
	var columnBox = getDescendant(columnRender, 'columnBox');
	columnBox.innerHTML = column.getColumnHTML();
	columnBox.idCM = columnRender.id;
	columnBox.style.width = 'auto';
	columnBox.style.height = columnRender.style.height;
	
	// Add element to decision table render
	ruleTableColumnsDiv.appendChild(columnRender);
	
	if (!bLastElement){
		// Add column division
		var columnBoxDivisionHTML =  document.getElementById('columnDivision').outerHTML;
		columnRender.innerHTML = columnBoxDivisionHTML + columnRender.innerHTML;
		getDescendant(columnRender, 'columnDivision').style.height = columnRender.style.height;
		
		// Align the element to the left
		columnRender.style.styleFloat = 'left';
		columnRender.style.cssFloat = 'left';  // For mozilla
		column.width = parseInt(columnRender.style.width);

	} else {
		columnRender.style.width = 'auto';
		column.width = 0;
	}
	
	// Save property in object
	column.left = columnRender.clientLeft;
	return columnRender;
}

function drawRuleCode(ruleCode,policyRuleTable){
	var cell;
	var iCount = 4;
	var firstCellsHeight = 24;
	var lastCellsHeight = ruleCode.conditions.length * firstCellsHeight;
	var ruleTableCellsDiv = document.getElementById('ruleTableCells');
    var ruleCodeTemplate = document.getElementById('ruleCodeHtml');
    var fixFloat = '<div style="clear:both"></div>';
	
    var containerDiv = document.createElement('DIV');
    containerDiv.innerHTML = ruleCodeTemplate.innerHTML + fixFloat;
	
	var ruleCodeDiv = getDescendant(containerDiv, 'ruleCode');
	ruleCodeDiv.id = ruleCode.getControlId();
	
	

	var sHTML = drawDeleteBox(lastCellsHeight).outerHTML;
	var columnwidth;
	var nameofcolumn;

	//create css
	for(var i = 0; i<policyRuleTable.columns.length;i++){
	 policyRuleTable.columns[i].className = policyRuleTable.columns[i].getControlId();
	 
		//change de widths
		nameofcolumn = policyRuleTable.columns[i].getControlId();
		columnwidth = document.getElementById(nameofcolumn).offsetWidth;
		policyRuleTable.columns[i].width = columnwidth;

		if(i = policyRuleTable.columns.length-1){
			policyRuleTable.columns[i].className= "";
		}

	}
	//modify css
	/*
	for(var i = 0; i<policyRuleTable.columns.length;i++){
		var classname = policyRuleTable.columns[i].className;
		document.getElementsByClassName('someclass').width= columnwidth;
	}
	*/
	nameofcolumn = policyRuleTable.columns[0].getControlId();
	columnwidth = document.getElementById(nameofcolumn).offsetWidth;
	

	
	for(var i=0;i<ruleCode.conditions.length; i++) {
		var condition = ruleCode.conditions[i];


		sHTML += '<div style="clear:left" ruleCodeId="' + i + '">';
		// Draw Argument 1
		cell = drawCell(condition.argument1.htmlValue(false), policyRuleTable.columns[0], firstCellsHeight);
		sHTML += cell.outerHTML;
		
		// Draw Operator

		cell = drawCell(condition.operator.htmlValue(false), policyRuleTable.columns[1], firstCellsHeight);
		sHTML += cell.outerHTML;
		
		// Draw Argument 2

		if (condition.className == 'NormalCondition')
			cell = drawCell(condition.argument2.htmlValue(false), policyRuleTable.columns[2], firstCellsHeight);
		else
			cell = drawCell('', policyRuleTable.columns[2], firstCellsHeight);
		sHTML += cell.outerHTML;
		
		sHTML += '</div>';
			
	}
	
	// Draw AND / OR cell
	var sAndOrHTML = '<span class="operator">';
	sAndOrHTML += ruleCode.conditionType == 1 ? 'AND': 'OR';
	sAndOrHTML += '</span>';
	
	cell = drawCell(sAndOrHTML, policyRuleTable.columns[3], lastCellsHeight);
	sHTML += cell.outerHTML;	
	
	// Draw then cells
	for(var i=0;i<policyRuleTable.iThenColumns; i++) {
		if (i <ruleCode.executionStatements.length) {
			var executionStatement = ruleCode.executionStatements[i];
			cell = drawCell(executionStatement.htmlValue(false), policyRuleTable.columns[iCount], lastCellsHeight);
			
		} else {	
			cell = drawCell('', policyRuleTable.columns[iCount], lastCellsHeight);
		}
		sHTML += cell.outerHTML;
		iCount++;
	}
	
	// Draw else cells
	for(var i=0;i<policyRuleTable.iElseColumns; i++) {
		if (i <ruleCode.elseExecutionStatements.length) {
			var executionStatement = ruleCode.elseExecutionStatements[i];

			cell = drawCell(executionStatement.htmlValue(false), policyRuleTable.columns[iCount], lastCellsHeight);
			
		} else {	
			cell = drawCell('', policyRuleTable.columns[iCount], lastCellsHeight);
		}
		sHTML += cell.outerHTML;
		iCount++;
		
	}
	ruleCodeDiv.innerHTML = sHTML;
	
	// Add to HTML
	ruleTableCellsDiv.innerHTML += containerDiv.innerHTML;
} 

function drawCell(cellHTML, column, height){
	var cellTemplate = document.getElementById('cellBoxHtml');
	
	// Set new cell properties
	var cellRender = document.createElement('DIV');
	cellRender.innerHTML = cellTemplate.innerHTML;
	cellRender.style.width = column.width;
	cellRender.style.height = height;
	cellRender.id =column.element;
	
	var cellBox = getDescendant(cellRender, 'cellBox');
	// Adds a vertical align effect
	cellBox.style.paddingTop = '4px';
	
	// Set element visible properties
	cellBox.innerHTML = cellHTML;
	if (column.width != 0){
		cellRender.style.styleFloat = 'left';
		cellRender.style.cssFloat = 'left'; // For mozilla
	}else {
		cellRender.style.width = 'auto';
		// Fix for mozilla
		if (!isIE)
			getDescendant(cellRender, 'cellBox').style.width = 'auto';
	}
	//the last div
	if(column)
		
	return cellRender;		
}

function drawDeleteBox(height) {
	
	var cellDeleteBox = document.createElement('DIV');
	var cellDeleteBoxHTML = document.getElementById('cellDeleteBox').outerHTML;
	cellDeleteBox.innerHTML = cellDeleteBoxHTML;
	
	// Set properties
	getDescendant(cellDeleteBox, 'cellDeleteBox').style.display = 'inline';
	getDescendant(cellDeleteBox, 'cellDeleteBox').style.height = height;
	
	return cellDeleteBox.firstChild;
}

// Rule Code View
function drawRuleCodeView(paramRuleCode){
	// Do nothing if rule is not fully loaded
	if (bMainMethodEnded == false) {
		return;
	}
	
	// Assign parameter to global variable
	if (typeof(paramRuleCode) != 'undefined' &&
		paramRuleCode.className == 'PolicyRule')
		policyItem = paramRuleCode;
		
	// Set else check
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

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									COLUMN RESIZE METHODS									  //////
////////////////////////////////////////////////////////////////////////////////////////////////////////

function beginResize(e){
	preventDefault(e);

	// Stores the current mouse position for further use.
	window.lastX=e.clientX;
	
	var element = getElementFromEvent(e);
	setCaptureForElement(element)
	
	// Set element to check in the other events
	currentColumnDivision = element;
	var columnToResize = currentColumnDivision.parentNode;
	columnToResize.style.zIndex = 999;
	
	// Attack mouse events
	mouseevent(document, 'onmousemove' ,'doResize');     
	mouseevent(element, "onlosecapture", 'endResize');  
	mouseevent(element, 'onmouseup' ,'endResize');       
}

function doResize(e) {
	var element = getElementFromEvent(e);
	var columnToResize = currentColumnDivision.parentNode;
	
	try {
   		var difX = e.clientX - window.lastX;
		var newX1 = parseInt(columnToResize.style.width)+difX;
		
		var columnObj = policyRuleTable.getColumnByControlId(columnToResize.id);
		
		// Sets the new position 
		if (newX1 < parseInt(columnObj.calculateMinWidth())){
			columnToResize.style.width = columnObj.calculateMinWidth(); 
		} else {
			columnToResize.style.width = newX1+"px"; 
		}
	} catch(e){}
		   
	// Stores the current mouse position.
	window.lastX=e.clientX;
}

function endResize(e) {
	releaseCaptureForElement(currentColumnDivision);
	
	if (currentColumnDivision != null){
	
		// Get the objects
 		var columnToResize = currentColumnDivision.parentNode;
		var columnObj = policyRuleTable.getColumnByControlId(columnToResize.id);

		// Calculate new width
		var newWidth = parseInt(columnToResize.style.width) +"px";
		
		// Set values
		columnObj.width = parseInt(newWidth);
		columnToResize.style.width = newWidth;
		currentColumnDivision.style.left = '0px';
		
		// Redraw decision table
		drawRuleTableView();
	}
			
	// Detach events
	mousedetach(document, 'onmousemove' ,doResize);       
	mousedetach(currentColumnDivision, "onlosecapture", endResize);  
	mousedetach(currentColumnDivision, 'onmouseup' ,endResize);
	
	currentColumnDivision = null;
}