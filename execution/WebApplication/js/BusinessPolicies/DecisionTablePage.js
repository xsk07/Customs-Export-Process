var decisionTable = new DecisionTable();
var currentColumnDivision;
var currentCellRender;
var currentCellOperatorRender;
var controlsLocked = false;

function lockPageControls(){
	// Properties controls
	document.getElementById('decisionTableName').readOnly = true;
	document.getElementById('decisionTableDisplayName').readOnly = true;
	document.getElementById('decisionTableDescription').readOnly = true;
	document.getElementById('decisionTablePriority').readOnly = true;
	document.getElementsByName('decisionTableEnabled')[0].disabled = true;
	document.getElementsByName('decisionTableEnabled')[1].disabled = true;
	document.getElementById('decisionTableEnabledFromDate').readOnly = true;
	document.getElementById('decisionTableEnabledToDate').readOnly = true;
	document.getElementById('decisionTableEnabledFromDateLink').onclick = null;
	document.getElementById('decisionTableEnabledToDateLink').onclick = null;
	document.getElementById('getDefinitionCombo').readOnly = true;
	document.getElementById('setDefinitionCombo').readOnly = true;
	
	// Lock Add Column links, and add row link
	document.getElementById('addGetColumnLink').onclick = null;
	document.getElementById('addSetColumnLink').onclick = null;
	document.getElementById('addNewRowLink').onclick = null;	
	
	// Disable context menu
	document.getElementById('columnBox').oncontextmenu = null;
	document.getElementById('cellBox').oncontextmenu = null;
	
	// Lock Reload / Save buttons
	document.getElementsByName('btnReloadDT')[0].disabled = true;
	document.getElementsByName('btnSaveDT')[0].disabled = true;
	
	controlsLocked = true;
}

function disableEvents(){
	disableEventByClass('columnBox columnBoxGet', 'oncontextmenu');
	disableEventByClass('columnBox columnBoxSet', 'oncontextmenu');
	disableEventByClass('cellBox', 'ondblclick');
	disableEventByClass('cellBox', 'oncontextmenu');	
	disableEventByClass('cellDeleteBox', 'onclick');
	disableEventByClass('cellOperatorBox', 'onmouseover');
	disableEventByClass('addbtn', 'onclick');
}

function addGetColumn(){
	var combo = document.getElementById('getDefinitionCombo');
	if (combo.value == '0'){
		return;
	}
	
	var oDefinition = getDefinition(combo.value);
	var newColumn = new Column();
	
	newColumn.definition.id = oDefinition.id;
	newColumn.definition.name = oDefinition.name;
	newColumn.definition.displayName = oDefinition.displayName;
	newColumn.definition.definitionUse = oDefinition.definitionUse;
	newColumn.definition.dataType = oDefinition.dataType;
	newColumn.definition.idRelatedEntity = oDefinition.idRelatedEntity;
	
	decisionTable.addColumn(newColumn);
	
	drawDecisionTable();
}

function addSetColumn(){
	var combo = document.getElementById('setDefinitionCombo');
	if (combo.value == '0'){
		return;
	}
	
	var oDefinition = getDefinition(combo.value);
	var newColumn = new Column();
	
	newColumn.definition.id = oDefinition.id;
	newColumn.definition.name = oDefinition.name;
	newColumn.definition.displayName = oDefinition.displayName;
	newColumn.definition.definitionUse = oDefinition.definitionUse;
	newColumn.definition.dataType = oDefinition.dataType;
	newColumn.definition.idRelatedEntity = oDefinition.idRelatedEntity;
	
	decisionTable.addColumn(newColumn);
	
	drawDecisionTable();
}

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


function drawDecisionTable(){
	var decisionTableDiv = document.getElementById('decisionTableDiv');
	decisionTableDiv.innerHTML = '';
	
	var columns = decisionTable.getColumns();
	var maxY = 0;
	var maxX = 0;
	decisionTableDiv.style.width =  decisionTable.getWidth();
	for(var i=0; i<columns.length; i++){
		var newColumn = drawColumn(columns[i], 0, maxX);
		maxY = newColumn.offsetTop + getMaxChildHeight(newColumn);
		maxX += getMaxChildWidth(newColumn);
	}
	decisionTableDiv.style.width = maxX + 'px';
	
	for(var i=0; i<decisionTable.rows.length; i++){
		var newCell = drawCell(decisionTable.rows[i], maxY);
		
		if (newCell != null)
			maxY = newCell.offsetTop + getMaxChildHeight(newCell);
	}
	
	var addRowHtml = document.getElementById('addRowHtml');
	getDescendant(addRowHtml, 'addNewRowLink').style.position = 'absolute';
	getDescendant(addRowHtml, 'addNewRowLink').style.top = (maxY + 10) + 'px';
	decisionTableDiv.innerHTML += addRowHtml.innerHTML;
	
	currentCellRender = null;
	currentCellOperatorRender = null;
	
	// Lock controls for mozilla
	if (controlsLocked){
		disableEvents();
	}
}

function drawColumn(column, top, left){
	var decisionTableDiv = document.getElementById('decisionTableDiv');
	var columnTemplate = document.getElementById('column');
	
	var columnRender = document.createElement('DIV');
	columnRender.innerHTML = columnTemplate.innerHTML;
	columnRender.id = column.getControlId();
	columnRender.className = columnTemplate.className;
	
	if (column.width != 0){
		getDescendant(columnRender, 'columnBox').style.width = column.width;
	} 	
	
	insertAdjacentText(getDescendant(columnRender, 'columnBox'), column.definition.displayName);
	
	getDescendant(columnRender, 'columnBox').className = "columnBox " + (column.definition.definitionUse == 1 ?	'columnBoxGet' : 'columnBoxSet');
	getDescendant(columnRender, 'columnBox').idCM = columnRender.id;

	decisionTableDiv.appendChild(columnRender);
	
	getDescendant(columnRender, 'columnDivision').style.left = getDescendant(columnRender, 'columnBox').style.width;
	getDescendant(columnRender, 'columnDivision').style.top = getDescendant(columnRender, 'columnBox').offsetTop;
	
	columnRender.style.top = top  + 'px';
	columnRender.style.left = left + 'px';
	columnRender.style.width = getMaxChildWidth(columnRender);
	columnRender.style.height =  getMaxChildHeight(columnRender);
	
	column.width = getCurrentWidth(getDescendant(columnRender, 'columnBox'));
	column.left = columnRender.offsetLeft;
	
	return columnRender;
} 

function drawCell(cell, top){
	var decisionTableDiv = document.getElementById('decisionTableDiv');
	var cellTemplate = document.getElementById('cell');
	
	var cellRender = document.createElement('DIV');
	cellRender.innerHTML = cellTemplate.innerHTML;
	cellRender.id = cell.getControlId();
	cellRender.className = cellTemplate.className;
	
	// add element to the div
	decisionTableDiv.appendChild(cellRender);		
	
	var cellBox = getDescendant(cellRender, 'cellBox');
	var cellOperatorBox = getDescendant(cellRender, 'cellOperatorBox');
	var cellDeleteBox = getDescendant(cellRender, 'cellDeleteBox');
	
	// calculates width and left of the cellBox element given if the cell must show operator or not
	var cellWidth = 0;
	var cellLeft = 0;
	if (cell.canShowOperator()) {
		cellLeft = parseInt(getCurrentWidth( cellOperatorBox ));
		cellWidth = parseInt(cell.column.width) - cellLeft;
		
	} else {
		cellWidth = parseInt(cell.column.width);
		cellOperatorBox.style.display ='none';
	}
	
	// set element visible properties
	cellBox.style.width = cellWidth;
	cellBox.style.height = cell.getHeight();
	cellBox.style.left = cellLeft + 'px';
	//cellBox.idCM = cellRender.id;
	cellBox.setAttribute('idCM',cellRender.id);
	cellOperatorBox.style.height = cell.getHeight();
	
	// insert texts
	if (cell.element.value != null){
		var dataType = cell.column.definition.dataType;
		var value = (isText(dataType) || isDatetime(dataType)) ? quote(cell.element.visibleValue) : cell.element.visibleValue;
			
		insertAdjacentText(cellBox, value);
		
	} else {
		insertAdjacentText(cellBox, CELL_DEFAULT_VALUE);
	}
		
	insertAdjacentText(cellOperatorBox, cell.operator.expression);
	
	// set positioning properties
	cellRender.style.top = top + 'px';
	cellRender.style.left = cell.column.left + 'px';
	cellRender.style.width = parseInt(cell.column.width) + 3;
	cellRender.style.height =  cell.getHeight();
	
	if (cell.nextCells.length == 0){
		cellDeleteBox.style.display = 'inline';
		cellDeleteBox.style.left = parseInt(cellRender.style.width) - parseInt(getCurrentWidth(cellDeleteBox)) + 'px';
		cellBox.style.width = parseInt(getCurrentWidth(cellBox)) - parseInt(getCurrentWidth(cellDeleteBox)) + 'px';
	}
	
	// create next cells
	for (var i=0; i< cell.nextCells.length; i++){
		drawCell(cell.nextCells[i], top);
		top += cell.nextCells[i].getHeight();
	}
	
	return cellRender;		
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
		
		rulePreviewDiv.innerHTML = paintRule(cell.buildRule());
		
	} else {
		rulePreviewDiv.style.display = 'none';
		rulePreviewDiv.style.height = '0%';
		decisionTableOuterDiv.style.height = '100%';					
	}
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

function editCell(cellRender){
	var cell = decisionTable.getCellByControlId(cellRender.id);
		
	// Cancels if tries to edit the already editing cell
	if (currentCellRender == cellRender){
		return;
	}
	
	// If there is an editor clear it
	if (currentCellRender != null){
		assignCellValue();
	}

	var editor = getEditorControl(cell);
	editor.style.width = getDescendant(cellRender, 'cellBox').offsetWidth;
	editor.style.height = '100%';
	
	getDescendant(cellRender, 'cellBox').innerHTML = '';
	getDescendant(cellRender, 'cellBox').appendChild(editor);
	
	setEditorValue(cell, editor);
	
	currentCellRender = cellRender;
	focusEditorControl(cell, editor);
}

function getEditorControl(cell){
	var editor;
	var dataType = cell.column.definition.dataType;
	
	if (cell.column.definition.idRelatedEntity > 0) {
		// Combo control for related entities
		var comboEditorTemplate = document.getElementById('comboEditorHtml');
		editor = document.createElement('DIV');
		editor.innerHTML = comboEditorHtml.innerHTML;	
		
		var comboEditor = getDescendantByClassName(editor, 'comboEditor');
		comboEditor.style.width = '100%';
		comboEditor.style.height = '100%';
		var value = cell.element.value != null ? cell.element.value : '';
		
		// Changes the name to make it unique
		var newIdentifier = 'comboEditor' + cell.cellId;
		comboEditor.id = newIdentifier;
		comboEditor.onkeydown = endEditCell;
		
		// Get options
		getRelatedEntityValues(newIdentifier, cell.column.definition.idRelatedEntity, value);
	
	} else {	
		if (isText(dataType)) {
			var textEditorTemplate = document.getElementById('textEditorHtml');
			editor = document.createElement('DIV');
			editor.innerHTML = textEditorTemplate.innerHTML;	
			
			getDescendant(editor, 'textEditor').onkeydown = endEditCell;
			
		} else if ( isNumeric(dataType) || isMoney(dataType) ) {
			var numericEditorTemplate = document.getElementById('numericEditorHtml');
			editor = document.createElement('DIV');
			editor.innerHTML = numericEditorTemplate.innerHTML;	
			
			getDescendant(editor, 'numericEditor').preset = getNamedDataType(dataType);
			//getDescendant(editor, 'numericEditor').onblur = getNamedDataType(dataType);
			getDescendant(editor, 'numericEditor').onkeydown = endEditCell;
			
			new BABehaviorElement(getDescendant(editor, 'numericEditor'));
			
		} else if (isDatetime(dataType)) {	
			var dateTimeEditorTemplate = document.getElementById('datetimeEditorHtml');
			editor = document.createElement('DIV');
			
			var innerForm = document.createElement('FORM');
			innerForm.id= 'frmDatetime';
			innerForm.innerHTML = dateTimeEditorTemplate.innerHTML;		
			
			editor.appendChild(innerForm);		
			
			getDescendant(innerForm, 'dateTimeEditor').onkeydown = endEditCell;
			
		} else if (isBoolean(dataType)){
			var booleanEditorTemplate = document.getElementById('booleanEditorHtml');
			editor = document.createElement('DIV');
			editor.innerHTML = booleanEditorTemplate.innerHTML;	
			
			getDescendants(editor, 'booleanEditor')[0].onkeydown = endEditCell;
			getDescendants(editor, 'booleanEditor')[1].onkeydown = endEditCell;
		}
	}
	
	editor.id = 'cellEditor';
	
	return editor;
}

function focusEditorControl(cell, editor){
	var dataType = cell.column.definition.dataType;
	
	if (cell.column.definition.idRelatedEntity > 0)	{
		getDescendant(editor, 'comboEditor' + cell.cellId).focus();
	} else if (isText(dataType)){
		getDescendant(editor, 'textEditor').focus();
	} else if (isDatetime(dataType)){
		getDescendant(editor, 'dateTimeEditor').focus();
	} else if (isNumeric(dataType) || isMoney(dataType)){
		getDescendant(editor, 'numericEditor').focus();
	} else if (isBoolean(dataType)){
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

	try {
		eval("" + rData.relatedEntityComboCode + "");
	} catch(e) {}
}


function endEditCell(evt){
	var evt = getEvent(evt);
	
	if (evt.keyCode == 13){
		assignCellValue();
	}
}

function assignCellValue(){
    var cell = decisionTable.getCellByControlId(currentCellRender.id);
    var editor = getDescendant(currentCellRender, 'cellEditor');
	var value = getEditorValue(cell, editor);
	
	if (value != ''){
		cell.element.value = value;
		cell.element.visibleValue = value;
		
	} else{
		cell.element.value = null;
		cell.element.visibleValue = '';
	}
		
	if (cell.column.definition.idRelatedEntity > 0){
		var comboEditor = getDescendantByClassName(editor, 'comboEditor');
		
		if (comboEditor.value != '0'){
			cell.element.value = comboEditor.value;
			cell.element.visibleValue = comboEditor.options[comboEditor.selectedIndex].text;
		}
		
		comboEditor.id = 'comboEditor'
	} 
	
	getDescendant(currentCellRender, 'cellBox').innerHTML = '';
	
	if (cell.element.visibleValue != null)
		insertAdjacentText(getDescendant(currentCellRender, 'cellBox'), cell.element.visibleValue);
	else
		insertAdjacentText(getDescendant(currentCellRender, 'cellBox'), CELL_DEFAULT_VALUE);

	currentCellRender = null;
}


function setEditorValue(cell, editor){
	var dataType = cell.column.definition.dataType;
	var value = cell.element.value != null ? cell.element.value : '';
	
	if (cell.column.definition.idRelatedEntity > 0){
		return;
	}
	
	if (isText(dataType)){
		getDescendant(editor, 'textEditor').value = unquote(value);
	} else if (isDatetime(dataType)){
		getDescendant(editor, 'dateTimeEditor').value = unquote(value);;
	} else if (isNumeric(dataType) || isMoney(dataType)){
		getDescendant(editor, 'numericEditor').value = value;
	} else if (isBoolean(dataType)){
		if (value.toLowerCase() == 'true'){
			getDescendants(editor, 'booleanEditor')[0].checked = true;
		} else if (value.toLowerCase() == 'false'){
			getDescendants(editor, 'booleanEditor')[1].checked = true;
		}
	}
}

function getEditorValue(cell, editor){
	var dataType = cell.column.definition.dataType;
	if (cell.column.definition.idRelatedEntity > 0)	{
		return getDescendant(editor, 'comboEditor' + cell.cellId).value;
		return;
	} else if (isText(dataType)){
		return quote( getDescendant(editor, 'textEditor').value );
		
	} else if (isDatetime(dataType)){
		return quote( getDescendant(editor, 'dateTimeEditor').value );
		
	} else if (isNumeric(dataType) || isMoney(dataType)){
		getDescendant(editor, 'numericEditor').BABehavior.doBlur();
		return getDescendant(editor, 'numericEditor').value;
		
	} else if (isBoolean(dataType)){
		if (getDescendants(editor, 'booleanEditor')[0].checked) {
			return String(getDescendants(editor, 'booleanEditor')[0].value);
		} else {
			return String(getDescendants(editor, 'booleanEditor')[1].value);
		}		
	}
}

function showOperatorEditor(cellRender){
    if (currentCellOperatorRender != cellRender)
      	hideOperator();
    
    if (currentCellOperatorRender != null)
      	return;
    
    var cell = decisionTable.getCellByControlId(cellRender.id);
    var operatorEditorTemplate = document.getElementById('operatorCombo');
	var operatorEditor = document.createElement('SELECT');
	for (var i=0; i < operatorEditorTemplate.options.length; i++)
	{
		var newOption = document.createElement('OPTION');
		newOption.value = operatorEditorTemplate.options[i].value;
		newOption.text = operatorEditorTemplate.options[i].text;
		if (isIE)
			insertAdjacentText(newOption, operatorEditorTemplate.options[i].innerText);
		operatorEditor.appendChild(newOption);
	}
	
	copyEvents(operatorEditorTemplate, operatorEditor);
	copyStyle(operatorEditorTemplate, operatorEditor);
	
	operatorEditor.id = 'operatorCombo';
	operatorEditor.onchange = selectOperator;
	operatorEditor.value = cell.operator.name;
	
	getDescendant(cellRender, 'cellOperatorBox').innerHTML = '';
	getDescendant(cellRender, 'cellOperatorBox').appendChild(operatorEditor);
	currentCellOperatorRender = cellRender;
}

function selectOperator(){
    var cell = decisionTable.getCellByControlId(currentCellOperatorRender.id);
    var operatorCombo = getDescendant(currentCellOperatorRender, 'operatorCombo');
    var value = operatorCombo.options[operatorCombo.selectedIndex].text;
    
    cell.operator.name = operatorCombo.value;
    cell.operator.expression = value;
    
    getDescendant(currentCellOperatorRender, 'cellOperatorBox').innerHTML = '';
	insertAdjacentText(getDescendant(currentCellOperatorRender, 'cellOperatorBox'), value);
    
    currentCellOperatorRender = null;
}	

function hideOperator(cell){
	if (currentCellOperatorRender == null)
      	return;
	      	
    var cell = decisionTable.getCellByControlId(currentCellOperatorRender.id);
    
    getDescendant(currentCellOperatorRender, 'cellOperatorBox').innerHTML = '';
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

function focusDatetimeEditor(datetimeEditor){
	document.getElementById(datetimeEditor).focus();
}

function loadDecisionTable(sXml){
	decisionTable = loadDecisionTableFromXML(sXml);
	
	drawDecisionTable();
}

function saveDecisionTable(){
	document.getElementById('decisionTableXml').value = decisionTable.getXML();
	document.getElementById('rulesCodeXml').value = decisionTable.getRulesCode();
	document.getElementById('saveTable').value = true;

	// Validate fields
	var isValid = validateProperties();
	
	if (isValid)
		document.forms['frmDecisionTable'].submit();
}

function validateProperties(){
	if (document.getElementById('decisionTableName').value.length == 0){
		alert(BAP_NO_DECISION_TABLE_NAME)
		return false;
	}
	
	if (document.getElementById('decisionTableDisplayName').value.length == 0){
		alert(BAP_NO_DECISION_TABLE_DISPLAY_NAME)
		return false;
	}
	
	if (document.getElementById('decisionTableDescription').value.length == 0){
		alert(BAP_NO_DECISION_TABLE_DESCRIPTION)
		return false;
	}
	
	if (document.getElementById('decisionTablePriority').value.length == 0){
		alert(BAP_NO_DECISION_TABLE_PRIORITY)
		return false;
	}
	
	return decisionTable.validate();
}

function reloadDecisionTable(){
	document.getElementById('saveTable').value = false;
	
	document.forms['frmDecisionTable'].submit();
}

function beginResize(e){
	preventDefault(e);

	// Stores the current mouse position for further use.
	window.lastX=e.clientX;
	
	var element = getElementFromEvent(e);
	setCaptureForElement(element)
	
	currentColumnDivision = element;
	
	mouseevent(document, 'onmousemove' ,'doResize');     
	mouseevent(element, "onlosecapture", 'endResize');  
	mouseevent(element, 'onmouseup' ,'endResize');       
}

function doResize(e) {
	var element = getElementFromEvent(e);

   	var difX = e.clientX - window.lastX;
	var newX1 = parseInt(currentColumnDivision.style.left)+difX;

	// Sets the new position 
	currentColumnDivision.style.left = newX1+"px"; 
		    
	// Stores the current mouse position.
	window.lastX=e.clientX;
}

function endResize(e) {
	releaseCaptureForElement(currentColumnDivision);
	
	if (currentColumnDivision != null){
		var columnToResize = getDescendant(currentColumnDivision.parentNode, 'columnBox');
		var newWidth = parseInt(currentColumnDivision.style.left) +"px";
		if (parseInt(newWidth) < CELL_MINIMUM_WIDTH)
			newWidth = CELL_MINIMUM_WIDTH + 'px';
		columnToResize.style.width = newWidth;
		
		decisionTable.getColumnByControlId(columnToResize.parentNode.id).width = columnToResize.style.width;
		currentColumnDivision.style.left = '0px';
		
		drawDecisionTable();
	}
			
	mousedetach(document, 'onmousemove' ,doResize);       
	mousedetach(currentColumnDivision, "onlosecapture", endResize);  
	mousedetach(currentColumnDivision, 'onmouseup' ,endResize);
	
	currentColumnDivision = null;
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