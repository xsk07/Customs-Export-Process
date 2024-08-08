var CELL_HEIGHT = 16;
var CELL_MINIMUM_WIDTH = 48;
var CELL_DEFAULT_VALUE = '<Inserte un valor aqui>';
	
function ColumnDefinition(){
	this.id = 0;
	this.name = '';
	this.displayName = '';
	this.definitionUse = 0;
	this.dataType = 0;
	this.idRelatedEntity = 0;
}

function CellElement(){
	this.value = null;
	this.visibleValue =  '';
	this.dataType = 0;
}

function CellOperator(xmlCode){
	this.id = 1;
	this.name = 'is equal to;'
	this.expression = '=';
}

function Column(){
	this.definition = new ColumnDefinition();
	
	this.decisionTable = null;
	
	this.width = 200;
	this.left = 0;
	
	this.getControlId = function() {
		return 'column' + this.definition.name.replace(' ', '_');
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
	
	this.getXML = function () {
		var sXML = "<column order=\"" + this.getColumnNumber() + "\">";

		// Definition
		sXML += "<definition id=\"" + this.definition.id + "\" " + 
							"name=\"" + this.definition.name + "\" " + 
							"displayName=\"" + this.definition.displayName + "\" " + 
					        "dataType=\""	+  this.definition.dataType + "\" " + 
							"use=\"" + this.definition.definitionUse + "\" " +
							"idRelatedEntity=\"" + this.definition.idRelatedEntity + "\" >" +
				"</definition>";

		sXML += "</column>";

		return sXML;
	}
}

function Cell(decisionTable, column){
	this.element = new CellElement();
	this.operator = new CellOperator();
	this.nextCells = new Array();
	this.previousCell = null;
	
	this.column = column;
	this.decisionTable = decisionTable;
	
	this.cellId = this.decisionTable.getNewCellId();
	
	this.createNextCell = function(columnNumber){
		var column = this.decisionTable.getColumnByNumber(columnNumber);
		var newCell = new Cell(decisionTable, column);
		
		newCell.previousCell = this;
		this.nextCells.push(newCell);
		
		if (decisionTable.getColumns().length > columnNumber + 1){
			newCell.createNextCell(columnNumber + 1);
		}
	}
	
	this.isDuplicable = function(){
		if (this.previousCell != null &&
			this.column.definition.definitionUse == 1) {
			
			return true;
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
	
	this.canShowOperator = function(){
		if (column.definition.idRelatedEntity > 0)
		{
				return false;
		}
		
		if (this.column.definition.definitionUse == 1) {
			if ( isDatetime(column.definition.dataType) ||
				isNumeric(column.definition.dataType) ||
				isMoney(column.definition.dataType) ){
				
				return true;
			}
		}		
		
		return false;
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
	
	this.getXML = function () {
		var sXML = "<cell>";

		sXML += "<operator name=\"" + this.operator.name + "\" " + 
						  "expression=\"" + HTMLEncode(this.operator.expression) + "\" >" +
				"</operator>" + "";
			
		sXML += "<element value=\"" + HTMLEncode(unquote(this.element.value)) + "\" " + 
  					   	 "dataType=\""	+  this.column.definition.dataType + "\" " +
  					   	 "visibleValue=\"" + HTMLEncode(unquote(this.element.visibleValue)) + "\" >" +
				"</element>" + "";

		sXML += "<nextCells>";
		
		for(var i=0; i < this.nextCells.length; i++){
			sXML += this.nextCells[i].getXML();
		}		
		
		sXML += "</nextCells>";

		sXML += "</cell>";

		return sXML;
	}
	
	this.validate = function(){
		if (this.element.value == null)
		{
			alert( BAP_NO_VALID_CELL );
			return false;
		}
	
		for(var i=0; i < this.nextCells.length; i++){
			var isValid = this.nextCells[i].validate();
			
			if (!isValid) 
				return false;
		}		
		
		return true;
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

function DecisionTable(){
	this.columns_Get = new Array();
	this.columns_Set = new Array();
	this.rows = new Array();
	this.randomIds = new Array();	
	this.highlightedCells = new Array();
	
	this.addColumn = function(newColumn){ 
	
		newColumn.decisionTable = this;
		
		if (newColumn.definition.definitionUse == 1 && this.columns_Get.length > 0){
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
	
		if (newColumn.definition.definitionUse == 1){
			this.columns_Get.push(newColumn);
		} else {
			this.columns_Set.push(newColumn);
		}	
	}
	
	this.deleteColumn = function(columnToDelete){
		if (this.rows.length > 0) {
			alert( BAP_CANT_DELETE_COLUMN );
			return;
		}	
	
		if (columnToDelete.definition.definitionUse == 1) {
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
	
	this.addNewRow = function(){
		if (this.columns_Get.length == 0 || this.columns_Set.length == 0)
		{
			alert( BAP_CANT_ADD_ROW );
			return;	
		}
		
		var columns = this.getColumns();
		
		var newCell = new Cell(this, columns[0]);
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
			alert("Too many cells");
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
	
	this.getXML = function () {
		var sXML = "<decisionTable>";

		// Columns
		sXML += "<columns>";

		var columns = this.getColumns();
		for (var i=0; i < columns.length; i++){
			sXML += columns[i].getXML();
		}
				
		sXML += "</columns>";

		// Cells
		sXML += "<cells>";
		for (var i=0; i < this.rows.length; i++){
			sXML += this.rows[i].getXML();
		}

		sXML += "</cells>";

		sXML += "</decisionTable>";
		return sXML;	
	}
	
	this.validate = function(){
		if (this.rows.length == 0)
		{
			alert( BAP_NO_ROWS );
			return false;
		}
		
		for (var i=0; i < this.rows.length; i++) {
			var isValid = this.rows[i].validate();
			
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
}
