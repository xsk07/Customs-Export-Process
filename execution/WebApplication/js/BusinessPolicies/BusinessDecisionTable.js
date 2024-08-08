var decisionTable = new DecisionTable();

function loadPageVariables(){
	// Add global drop targets
	dragDropObj.addTarget('decisionTableDiv' ,'pnlDecisionTableDrop'); 
}

function resizePanels(){
	var decisionTableDiv = document.getElementById('decisionTableDiv');
	
	resizePolicyToolbox(document.getElementById("decisionTableContent"));
	decisionTableDiv.style.width = document.getElementById("decisionTableContent").clientWidth - 20;


	var decisionTableContent = document.getElementById("decisionTableContent");

	var scaleFactor = 0.75;
	var calcHeight = parseInt(decisionTableContent.style.height.replace("px","")) * scaleFactor;
	
	decisionTableDiv.style.height = (calcHeight) + "px";
	decisionTableContent.style.height = (calcHeight) + "px";
	decisionTableContent.parentElement.style.height = 1;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									LOAD/ SAVE METHODS										  //////
////////////////////////////////////////////////////////////////////////////////////////////////////////

// Load the xml into the javascript object
function loadDecisionTable(sXml){
	decisionTable = loadDecisionTableFromXML(sXml, drawDecisionTable);
	window.onresize = resizePanels;
	resizePanels();
}

function saveDecisionTable(){
	document.getElementById('policyItemXml').value = decisionTable.getXml();
	document.getElementById('selectedVocabularyContexts').value = getSelectedVocabularyContexts();
	document.getElementById('bSavePolicyItem').value = true;

	// Validate fields
	var isValid = validateProperties();
	
	if (isValid)
		document.forms['frmPolicyItem'].submit();
}

function validateProperties(){
	if (validateToolboxProperties() == false){
		return false;
	}
	
	return decisionTable.isValid();
}

function reloadDecisionTable(){
	document.getElementById('bSavePolicyItem').value = false;
	
	document.forms['frmPolicyItem'].submit();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									ACTION METHODS											  //////
////////////////////////////////////////////////////////////////////////////////////////////////////////

function addNewRow(){
	decisionTable.addNewRow();
	
	drawDecisionTable();
}

function deleteColumn(){
	var column = decisionTable.getColumnByControlId(idCM);
	decisionTable.deleteColumn(column);
	
	BAHideContextMenu();
	drawDecisionTable();
}

function deleteCell(){
	var cell = decisionTable.getCellByControlId(idCM);
	cell.deleteCell();
	
	drawDecisionTable();
}

function deleteCellByButton(cellRender){
	var cell = decisionTable.getCellByControlId(cellRender.id);
	cell.deleteCell();
	
	drawDecisionTable();
}

function duplicateCell(){
	var cell = decisionTable.getCellByControlId(idCM);
	var columnNumber = cell.column.getColumnNumber();
	
	cell.previousCell.createNextCell(columnNumber);
	
	drawDecisionTable();
}

function selectRow(cellRender){
	decisionTable.restoreCells();
	
	var cell = decisionTable.getCellByControlId(cellRender.id);
	cell.highlight();
	cell.highlightNextCells();
	cell.highlightPreviousCells();
	
	var rulePreviewDiv = document.getElementById('rulePreviewDiv');
	var decisionTableOuterDiv = document.getElementById('decisionTableOuterDiv');
	if (cell.nextCells.length == 0) {
		rulePreviewDiv.style.display = '';
		rulePreviewDiv.style.height = '40%';
		decisionTableOuterDiv.style.height = '60%';
		
		// Paint the preview
		paintRule(cell.buildRule(), rulePreviewDiv);
		
	} else {
		rulePreviewDiv.style.display = 'none';
		rulePreviewDiv.style.height = '0%';
		decisionTableOuterDiv.style.height = '100%';					
	}
}

function cellMenuHandler(cellRender){
	var cell = decisionTable.getCellByControlId(cellRender.id);
	selectRow(cellRender);
	
	if (cell.isDuplicable())
		document.getElementById('menuAddNewCell').style.display = '';
	else
		document.getElementById('menuAddNewCell').style.display = 'none';
}

function getPopupMenu(cellBox){
	var cellRender = cellBox.parentNode;
	var cell = decisionTable.getCellByControlId(cellRender.id);
	
	if (cell.isDuplicable()) {
		return 'popupMenuDuplicableCell';
	} else {
		return 'popupMenuCell';
	}
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									DRAW METHODS									  //////
////////////////////////////////////////////////////////////////////////////////////////////////////////
function drawDecisionTable(paramDecisionTable){
	// Do nothing if rule is not fully loaded
	if (bMainMethodEnded == false) {
		return;
	}
	
	// Assign parameter to global variable
	if (typeof(paramDecisionTable) != 'undefined' &&
		paramDecisionTable.className == 'DecisionTable')
		decisionTable = paramDecisionTable;
	
	// Set shorcut objects
	var decisionTableDiv = document.getElementById('decisionTableDiv');
	var decisionTableColumnsDiv = document.getElementById('decisionTableColumns');
	var decisionTableCellsDiv = document.getElementById('decisionTableCells');
	var decisionTableAddRowDiv = document.getElementById('decisionTableAddRow');	
	
	// Clear all elements
	decisionTableColumnsDiv.innerHTML = '';
	decisionTableCellsDiv.innerHTML = '';
	decisionTableAddRowDiv.innerHTML = '';
	
	// Draw columns
	var columns = decisionTable.getColumns();
	for(var i=0; i<columns.length; i++){
		var bLastElement = (i == (columns.length - 1));
		var newColumn = drawColumn(columns[i], bLastElement);
	}
	
	// Adjust column bar
	var estimatedDecisiontableWidth = decisionTable.calculateColumnsWidth();
	if (estimatedDecisiontableWidth > parseInt(decisionTableDiv.style.width) ){
		decisionTableColumnsDiv.style.width = estimatedDecisiontableWidth;
	} else {
		decisionTableColumnsDiv.style.width = decisionTableDiv.style.width;
	}
	decisionTableColumnsDiv.style.height = decisionTable.calculateColumnHeight();
	
	// Allocate space for cells
	decisionTableCellsDiv.style.width = decisionTableColumnsDiv.style.width;
	
	// Draw cells
	for(var i=0; i<decisionTable.rows.length; i++){
		var newCell = drawCell(decisionTable.rows[i]);
	}
	
	// Add New Row Button
	if (columns.length > 0) {
		var addRowHtml = document.getElementById('addRowHtml');
		decisionTableAddRowDiv.innerHTML += addRowHtml.innerHTML;
	}
	
	// Adjust vars
	currentCellRender = null;
	currentCellOperatorRender = null;
	
	// Rearrange elements
	resizePanels();
}

function drawColumn(column, bLastElement){
	var decisionTableColumnsDiv = document.getElementById('decisionTableColumns');
	var columnTemplate = document.getElementById('column');
	
	// Set new column properties
	var columnRender = document.createElement('DIV');
	columnRender.innerHTML = columnTemplate.innerHTML;
	columnRender.id = column.getControlId();
	columnRender.className = columnTemplate.className;
	
	// Set Column Size
	if (column.width != 0){
		columnRender.style.width = column.width < 180 ? 180 : column.width;
	} else {
	    var iColumnWidth = column.calculateMinWidth();
		columnRender.style.width = iColumnWidth < 180 ? 180 : iColumnWidth;
	}	
	columnRender.style.height = decisionTable.calculateColumnHeight();
	
	// Draw column content
	var columnBox = getDescendant(columnRender, 'columnBox');
	columnBox.innerHTML = column.getColumnHTML();
	columnBox.setAttribute("idCM", columnRender.id);
	columnBox.style.width = 'auto';
	columnBox.style.height = columnRender.style.height;
	
	// Add element to decision table render
	decisionTableColumnsDiv.appendChild(columnRender);
	
	if (!bLastElement){
		// Add column division
		var columnBoxDivisionHTML =  document.getElementById('columnDivision').outerHTML;
		columnRender.innerHTML = columnBoxDivisionHTML + columnRender.innerHTML;
		getDescendant(columnRender, 'columnDivision').style.height = columnRender.style.height;
		
		// Align the element to the left
		columnRender.style.styleFloat = 'left';
		columnRender.style.cssFloat = 'left'; // For mozilla
		column.width = parseInt(columnRender.style.width);

	} else {
		columnRender.style.width = 'auto';
		column.width = 0;
	}
	
	// Save property in object
	column.left = columnRender.clientLeft;
	
	return columnRender;
} 

function drawCell(cell){
	var decisionTableCellsDiv = document.getElementById('decisionTableCells');
	var cellTemplate = document.getElementById('cell');
	
	// Set new cell properties
	var cellRender = document.createElement('DIV');
	cellRender.innerHTML = cellTemplate.innerHTML;
	cellRender.id = cell.getControlId();
	cellRender.className = cellTemplate.className;
	cellRender.style.width = cell.column.width;
	cellRender.style.height = cell.getHeight();
	
	// add element to the div
	decisionTableCellsDiv.appendChild(cellRender);		
	
	var cellBox = getDescendant(cellRender, 'cellBox');
	
	// Set element visible properties
	cellBox.setAttribute('idCM',cellRender.id);
	cellBox.innerHTML = cell.getCellHTML();	
	
	// Does a vertical align - center
	var elementHeight =  measureHeight(cell.element.value, 'argumentConstant');
	var estimatedPaddding = (cell.getHeight() - elementHeight) / 2;
	cellBox.style.paddingTop = estimatedPaddding;
	
	// If must show operator adds the HTML
	if (cell.canShowOperator())	{
		var cellOperatorBoxHTML = document.getElementById('cellOperatorBox').outerHTML;
		cellRender.innerHTML = cellOperatorBoxHTML + cellRender.innerHTML;
		
		var cellOperatorBox = getDescendant(cellRender, 'cellOperatorBox');
		insertAdjacentText(cellOperatorBox, cell.operator.expression);
		
		if (cell.operator.conditionType == 2) {
			cellOperatorBox.style.width = '100%';
			getDescendant(cellRender, 'cellBox').style.display = 'none';
		} else {
			cellBox.style.width = 'auto';
		}
	}	
	
	if (cell.nextCells.length > 0) {
		// create next cells
		for (var i=0; i< cell.nextCells.length; i++){
			drawCell(cell.nextCells[i]);
		}
		cellRender.style.styleFloat = 'left';
		cellRender.style.cssFloat = 'left';
	} 
	else {
		cellRender.style.width = 'auto';
		
		// Add delete box
		var cellDeleteBoxHTML = document.getElementById('cellDeleteBox').outerHTML;
		cellRender.innerHTML = cellDeleteBoxHTML + cellRender.innerHTML;
		getDescendant(cellRender, 'cellDeleteBox').style.display = 'inline';
	}
	
	return cellRender;		
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									BOX EDIT METHODS	 									  //////	
////////////////////////////////////////////////////////////////////////////////////////////////////////

var morphEditor = null;
function editCell(renderId){
	var render = document.getElementById(renderId);
	var cell = null;
	var renderBox = null;
	var dataType = null;
	var idRelatedEntity = -1;
	var value = null;
	
	// Try to obtain the cell, else there is a function cell argument
	cell = decisionTable.getCellByControlId(render.id);
	
	if (cell == null) { // Cell Argument editing
		var argument = decisionTable.getCellArgumentById(render.id);
		renderBox = render;
		dataType = argument.element.dataType;		
		value = argument.element.value;
		
	} else { // Cell Editing
		renderBox = getDescendant(render, 'cellBox');		
		dataType = cell.column.dataType;
		idRelatedEntity = cell.column.idRelatedEntity;
		value = cell.element.value;
	}
		
	// Cancels if tries to edit the already editing cell
	if (morphEditor != null  && morphEditor.currentEditableElement == render){
		return;
	}
	// If there is an editor clear it
	if (morphEditor != null  && morphEditor.currentEditableElement != null){
		endEditCell();
		return;
	}
	
	renderBox.innerHTML = '';
	
	// Create the morph editor
	morphEditor = new MorphEditor(endEditCell);
	
	// Set properties
	morphEditor.currentEditableElement = render;
	morphEditor.parentElement = renderBox;
	morphEditor.dataType = dataType;
	morphEditor.idRelatedEntity = idRelatedEntity;
	morphEditor.value = value;	
	morphEditor.useDefaultComboWidth = false;
	morphEditor.internalControlWidth = '90%';
	morphEditor.internalControlHeight = '80%';
	
	// Adjust morph editor into the container
	var editor = morphEditor.getEditorControl();
	editor.style.width = '100%';
	editor.style.height = '100%';
	
	renderBox.style.paddingTop = '0px';
	renderBox.style.paddingLeft = '0px';
	renderBox.style.paddingBottom = '0px';
	renderBox.style.paddingRight = '0px';
	renderBox.appendChild(editor);
	
	morphEditor.setEditorValue();
	
	setTimeout("morphEditor.focusEditorControl()", 500);
}

function endEditCell(){
	var render = morphEditor.currentEditableElement;
	var cell = null;
	var argumentConstant = null;
	
	// Gets the object in the decision table
	cell = decisionTable.getCellByControlId(render.id);
	if (cell == null) { // Cell Argument editing
		argumentConstant = decisionTable.getCellArgumentById(render.id).element;
		
	} else { // Cell Editing
		argumentConstant = cell.element;
	}
	
	// Obtains the value
	var value = ''; 
	try {
		value = morphEditor.getEditorValue();
		argumentConstant.value = value;
		var select=morphEditor.editor.childNodes[1];
        var optionSel=null;
        if(select && select.childNodes){
            for (var i = 0; i < select.childNodes.length; i++) {
                if(select.childNodes[i].value==select.value){
                    optionSel=select.childNodes[i];
                    break;
                }
            }
        }
        argumentConstant.displayAttributeValue = optionSel == null || (optionSel.getAttribute === null || optionSel.getAttribute === undefined ) ? "" : optionSel.getAttribute("title");
		argumentConstant.visibleValue = morphEditor.getEditorDisplayValue();
		
	} catch (e) {
		if (argumentConstant != null) {
			argumentConstant.value = '';
			argumentConstant.displayAttributeValue = '';
			argumentConstant.visibleValue = '';
		}
	}
	
	// Refresh the decision table
	morphEditor = null;
	drawDecisionTable();
}
////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									DRAG DROP METHODS										  //////
////////////////////////////////////////////////////////////////////////////////////////////////////////

function pnlDecisionTableDrop(idOfDraggedItem,targetId,x,y)
{
	var type = idOfDraggedItem.substring(0, 3);
	
	if (type == 'DEF')
	{
		var id = idOfDraggedItem.substring(4, idOfDraggedItem.length);
		getDefinition(document.getElementById(targetId), id);
	} else if (type == 'FUN')
	{
		var id = idOfDraggedItem.substring(4, idOfDraggedItem.length);
		getFunction(document.getElementById(targetId), id);
	}
}

function addDefinition(targetElement, definition){
	if (targetElement.getAttribute("BAElementType") == "panel"){
		addColumn(definition);
	}
}

function addFunction(targetElement, oFunction){
	if (targetElement.getAttribute("BAElementType") == "panel"){
		addColumn(oFunction);
	}
}

function addColumn(oElement){
	var newColumn = columnFactory.createColumn(oElement);
	
	decisionTable.addColumn(newColumn);
	drawDecisionTable();
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
		childArgument.argumentType = 1;
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
		
		var columnObj = decisionTable.getColumnByControlId(columnToResize.id);
		if (columnObj == null) {
			columnObj = decisionTable.getColumnArgumentById(columnToResize.id);
		}
		
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
		var columnObj = decisionTable.getColumnByControlId(columnToResize.id);
		if (columnObj == null) {
			columnObj = decisionTable.getColumnArgumentById(columnToResize.id);
		}

		// Calculate new width
		var newWidth = parseInt(columnToResize.style.width) +"px";
		
		// Set values
		columnObj.width = parseInt(newWidth);
		columnToResize.style.width = newWidth;
		currentColumnDivision.style.left = '0px';
		
		// Redraw decision table
		drawDecisionTable();
	}
			
	// Detach events
	mousedetach(document, 'onmousemove' ,doResize);       
	mousedetach(currentColumnDivision, "onlosecapture", endResize);  
	mousedetach(currentColumnDivision, 'onmouseup' ,endResize);
	
	currentColumnDivision = null;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									OPERATOR EDITION METHODS								  //////
////////////////////////////////////////////////////////////////////////////////////////////////////////

function showOperatorEditor(cellRender){
    if (currentCellOperatorRender != cellRender)
      	hideOperator();
    
    if (currentCellOperatorRender != null)
      	return;
    
    var cell = decisionTable.getCellByControlId(cellRender.id);
   	
   	var operatorEditor = document.createElement('SPAN');
   	var operatorComboTemplate = document.getElementById('operatorComboHtml');
	operatorEditor.innerHTML = operatorComboTemplate.innerHTML;	
	var comboEditor = getDescendant(operatorEditor, 'operatorCombo');
	
    comboEditor.id = 'operatorCombo';
	comboEditor.onchange = selectOperator;
	comboEditor.value = cell.operator.id;
	
	getDescendant(cellRender, 'cellOperatorBox').innerHTML = '';
	getDescendant(cellRender, 'cellOperatorBox').style.width = '120px';
	getDescendant(cellRender, 'cellOperatorBox').appendChild(operatorEditor);
	currentCellOperatorRender = cellRender;
}

function selectOperator(){
    var cell = decisionTable.getCellByControlId(currentCellOperatorRender.id);
    var operatorCombo = getDescendant(currentCellOperatorRender, 'operatorCombo');
    var value = operatorCombo.options[operatorCombo.selectedIndex].value;
    
    endLoadPolicyItemCallBack = drawDecisionTable;
    var oOperator = fillOperator(value, cell.operator);
    
    if (asynchCount == 0){
		drawDecisionTable();
    }
        
    currentCellOperatorRender = null;
}	

function hideOperator(cell){
	if (currentCellOperatorRender == null)
      	return;
	      	
    var cell = decisionTable.getCellByControlId(currentCellOperatorRender.id);
    
    getDescendant(currentCellOperatorRender, 'cellOperatorBox').innerHTML = '';
    getDescendant(currentCellOperatorRender, 'cellOperatorBox').style.width = '';
	insertAdjacentText(getDescendant(currentCellOperatorRender, 'cellOperatorBox'), cell.operator.expression);
    
    currentCellOperatorRender = null;    
}      		

function cellMenuHandler(cellRender){
	var cell = decisionTable.getCellByControlId(cellRender.id);
	selectRow(cellRender);
	
	if (cell.isDuplicable())
		document.getElementById('menuAddNewCell').style.display = '';
	else
		document.getElementById('menuAddNewCell').style.display = 'none';
}