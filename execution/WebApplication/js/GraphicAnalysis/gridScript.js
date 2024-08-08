	var m_TableWidth = 550;
	var m_TableHeight = 400;
	var lastSelectedCell = null;
	var tableWidget_tableCounter = 0;	
	var m_DecimalPlaces = 2;
	var m_ShowAggregateComboOnFooter = false;
	var m_debug = false;
	
	
	function BizAgiGridTable(jsonData, container, dataTable, width, height, showFooter, isGrouped, complexMerge){
		this.jsonData = jsonData;
		this.container = container;
		this.dataTable = dataTable;
		this.width = width;
		this.height = height;
		this.showFooter = showFooter;
		this.isGrouped = isGrouped;
		this.render = drawDataTable;
		this.clear = clearContainer;
		this.complexMerge = complexMerge;
	}

	//init the table conversion
	function initTableWidget(objId,width,height)
	{
		width = width + '';
		height = height + '';
		
		var obj = document.getElementById(objId);
		obj.parentNode.className='gridtable';
		
		if(navigator.userAgent.indexOf('MSIE')>=0){
			obj.parentNode.style.overflowY = 'auto';
		}
		
		if(width.indexOf('%')>=0){
			obj.style.width = width;
			obj.parentNode.style.width = width;
		}else{
			obj.style.width = (width - 2) + 'px';
			obj.parentNode.style.width = width + 'px';
		}
		
		if(height.indexOf('%')>=0){
			obj.parentNode.style.height = height;
		}
		else{
			obj.parentNode.style.height = height + 'px';
		}
		obj.id = 'tableWidget' + tableWidget_tableCounter;

		obj.cellSpacing = 0;
		obj.cellPadding = 0;
		obj.className='tableWidget';
		var tHead = obj.getElementsByTagName('THEAD')[0];
		var cells = tHead.getElementsByTagName('TD');
		for(var no=0;no<cells.length;no++){
			cells[no].onselectstart = cancelTableWidgetEvent;
			if(no==cells.length-1){
				cells[no].style.borderRight = '0px';	
			}
			cells[no].style.cursor = 'default';
		}

		var tBody = obj.getElementsByTagName('TBODY')[0];

		tBody.className='scrollingContent';
		
		var cells = tBody.getElementsByTagName('TD');
		
		for(var no=0;no<cells.length;no++){
			cells[no].onmouseclick = highlightDataCell;
			cells[no].onmousedown = highlightDataCell;
			cells[no].onselectstart = cancelTableWidgetEvent;
		}
		
		tableWidget_tableCounter++;
	}
	

	function cancelTableWidgetEvent()
	{
		return false;
	}

	function highlightDataCell()
	{
		if(navigator.userAgent.indexOf('Opera')>=0)return;
	
		deHighlightDataCell(lastSelectedCell);
		lastSelectedCell = this;		
		if (this.className == 'gridcell'){
			this.className = 'gridcellselected';
		}
	}
	
	function deHighlightDataCell(selectedCell)
	{
		if(navigator.userAgent.indexOf('Opera')>=0)return;
		
		if (lastSelectedCell && selectedCell.className == 'gridcellselected')
			selectedCell.className = 'gridcell';

	}
	
	function drawDataTable(){
		var dataTable = null;
		if (/*!this.dataTable && */this.jsonData){
			this.dataTable = getDataTable(this.jsonData);
			dataTable = this.dataTable;
		}
		else if (this.dataTable)
			dataTable = this.dataTable;

		var lastSelectedDimension = dataTable.ExtendedProperties["LastSelectedDimension"] ? parseInt(dataTable.ExtendedProperties["LastSelectedDimension"]) : 0;
		var showFooterOnGrid = this.showFooter;
		this.clear();

		var table = document.createElement("table");
		var tableHeader = document.createElement("thead");
		var tableBody = document.createElement("tbody");

		var htPreviousValues = new Hashtable();
		
		//build header
		var header = document.createElement("tr");
		for(var j = 0; j < dataTable.Columns.length; j++){			
			var cell = document.createElement("td");
			//cell.className = "BizBgColor1";
			//var nobr = document.createElement("nobr");
			var text = document.createTextNode( getFriendlyName(dataTable.Columns[j].ColumnName) );
			//nobr.appendChild(text);
			//cell.appendChild(nobr);
			cell.appendChild(text);
			cell.setAttribute("align", "center");
			header.appendChild(cell);
		}
		tableHeader.appendChild(header);

		//build footer
		if (showFooterOnGrid){
			var tableFoot = document.createElement("tfoot");
			var eFooter = buildFooter(dataTable, lastSelectedDimension);
			tableFoot.appendChild(eFooter);
		}

		//build body
		for(var iRow = 0; iRow < dataTable.Rows.length; iRow++){ //rows
			var row = document.createElement("tr");

			for(var j = 0; j < dataTable.Rows[iRow].length; j++){ //columns
				var iRowCount = 1;
				var sAlign = "";
				if (dataTable.Columns[j].DataType && dataTable.Columns[j].DataType != 'String' && dataTable.Columns[j].DataType != 'Boolean'){
					sAlign = "right";
				}
				if(dataTable.Columns[j].ExtendedProperties["Merge"] && this.isGrouped){
					if( htPreviousValues[dataTable.Columns[j].ColumnName] != null &&  dataTable.Rows[iRow][j] == htPreviousValues[dataTable.Columns[j].ColumnName] )
					{
						//condition to break if previous column value changes		
						if (this.complexMerge){
							var toBreak = isPreviousColumnChange(dataTable, iRow, j);
							if (!toBreak)
								continue;
						}
						else
							continue;
					}

					for (var i = iRow + 1; i < dataTable.Rows.length; i++)
					{
						if( dataTable.Rows[i][j] == dataTable.Rows[iRow][j] ){							
							//condition to break if previous column value changes
							if (i > 0 && j > 0 && this.complexMerge){
								if(isPreviousColumnChange(dataTable, i, j))
									break;
							}
							iRowCount++;
						}
						else
							break;
					}
					var cell = buildGridCell(dataTable.Rows[iRow][j], iRowCount, sAlign);					
					cell.className = 'groupedCell';
					row.appendChild(cell);
					
				}
				else{					
					var cell = buildGridCell(dataTable.Rows[iRow][j], 1, sAlign);
					row.appendChild(cell);
				}
				
				htPreviousValues[dataTable.Columns[j].ColumnName] = dataTable.Rows[iRow][j];
			}
			row.className = "gridrow" + iRow%2;
			tableBody.appendChild(row);
		}
		tableBody.className = "scrollingContent";

		table.appendChild(tableHeader);
		if (showFooterOnGrid)
			table.appendChild(tableFoot);
		table.appendChild(tableBody);

		table.setAttribute("id", "gridtable");
	
		/*var divContainer = document.createElement("div");
		divContainer.appendChild(table);
		this.container.innerHTML = divContainer.innerHTML;*/
		this.container.appendChild(table);
		
		initTableWidget('gridtable', this.width, this.height);
		//debug(griddiv.parentNode.parentNode);
	}

	function isPreviousColumnChange(dataTable, iRow, jColumn){
		if (iRow < 1 ||  jColumn < 1)
			return false;
		
		var toBreak = false;
		for (var previousColumn = jColumn - 1; previousColumn >= 0; previousColumn--){ 
			if (dataTable.Rows[iRow][previousColumn] != dataTable.Rows[iRow - 1][previousColumn]){
				toBreak = true;
				return toBreak;
			}			
		}
		return toBreak;
	}

	function buildFooter(dataTable, lastSelectedDimension){
		var footer = document.createElement("tr");		
		for(var jColumn = 0; jColumn < dataTable.Columns.length; jColumn++){
			var cell = document.createElement("td");
			cell.align = "center";
			cell.style.valign = "middle";
			
			var footText = null;
			if (jColumn > lastSelectedDimension){
				var sAggregateFunction = "sum";
				var iParenthesisPos = dataTable.Columns[jColumn].ColumnName.indexOf('('); //ColumnName is: sum(xx), count(xx), etc
				if(iParenthesisPos > 0)
					sAggregateFunction = dataTable.Columns[jColumn].ColumnName.substr(0, iParenthesisPos);
					 
				footText = document.createTextNode( evalAggregateOnColumn( dataTable,  jColumn , sAggregateFunction, false) );

				var rightCell = document.createElement("div");

				if (m_ShowAggregateComboOnFooter){
					var leftCell = document.createElement("div");
					leftCell.innerHTML = drawFooterAggregateCombo(jColumn);
					leftCell.style.width = "60px";
					leftCell.align = "left";
					leftCell.valign = "middle";
					leftCell.style.position = "relative"
					leftCell.style.float = "left";
					cell.appendChild(leftCell);
				}

				var eSpan = document.createElement("span");
				eSpan.id = "h_gridFooterAggregateValue" + jColumn;
				eSpan.appendChild(footText);

				rightCell.appendChild(eSpan);
				rightCell.style.width = "60px";
				rightCell.align = "right";
				rightCell.valign = "middle";
				rightCell.style.position = "relative";
				rightCell.style.float = "right";
				cell.appendChild(rightCell);

				cell.innerHTML = cell.innerHTML;
			}
			else if (jColumn == lastSelectedDimension){
				footText = document.createTextNode( 'Total' );
				cell.appendChild(footText);
			}
			else{
				footText = document.createTextNode( '&nbsp;' );
				cell.appendChild(footText);
				cell.innerHTML = cell.innerHTML.replace("amp;", "");
			}
			footer.appendChild(cell);
		}
		
		return footer;
	}

	function buildGridCell(oValue, iRowSpan, sAlign){
			var cell = document.createElement("td");
			//var nobr = document.createElement("nobr");
			var text = null;
			if (!oValue){
				oValue = '&nbsp;';
			}
			text = document.createTextNode( oValue );
		
			//nobr.appendChild(text);

			//cell.appendChild(nobr);
			cell.appendChild(text);
			cell.className = "gridcell";
			
			//set cell alignment for datatype
			if (sAlign && sAlign != ""){
				cell.setAttribute("align", sAlign);
			}
			
			if (iRowSpan > 1){
				cell.rowSpan = iRowSpan;
				cell.className = 'groupedCell';
			}
			
			//remove the &amp; code
			if (oValue == '&nbsp;'){
				cell.innerHTML = cell.innerHTML.replace("amp;", "");
			}
			return cell;
	}
/******************** BEGIN Aggregates on Footer **************************/
	function changeAggregateOnColumn( dataTable,  jColumn , aggregateFunction){
		var sValue = evalAggregateOnColumn(dataTable,  jColumn , aggregateFunction, true);
		var sContainer = document.getElementById("h_gridFooterAggregateValue" + jColumn);
		if(sContainer){
			sContainer.innerHTML = sValue;
		}
		
	}
	
	function evalAggregateOnColumn( dataTable,  jColumn , aggregateFunction, fromFunctionCombo){
		if (!dataTable){
			dataTable = getDataTable();
		}
		if (aggregateFunction == 'sum' || aggregateFunction == 'avg' || (aggregateFunction == "count" && !fromFunctionCombo) ){
			var sum = 0.0;
			for(var iRow = 0; iRow < dataTable.Rows.length; iRow++){
				if (dataTable.Rows[iRow][jColumn] && !isNaN(parseFloat(dataTable.Rows[iRow][jColumn]))){
					sum = sum + parseFloat(dataTable.Rows[iRow][jColumn]);
				}
			}
			if (aggregateFunction == 'avg' && dataTable.Rows.length > 0){
				if(fromFunctionCombo) {
					var sValue = sum / dataTable.Rows.length;
					return sValue.toFixed(m_DecimalPlaces);
				} else {
					return "--";
				}
			}

			return sum.toFixed(m_DecimalPlaces);
		}
		else if (aggregateFunction == "count"){
			return dataTable.Rows.length;
		}
		else {
			var max = 0;
			var min = 0;
			for(var iRow = 0; iRow < dataTable.Rows.length; iRow++){				
				if (dataTable.Rows[iRow][jColumn] && !isNaN(parseFloat(dataTable.Rows[iRow][jColumn]))){
					var sValue = parseFloat(dataTable.Rows[iRow][jColumn]);
					if (iRow == 0){
						max = sValue;
						min = sValue;
					}
					if (sValue > max)
						max = sValue;
					if (sValue < min)
						min = sValue;
				}
			}
			if (aggregateFunction == 'min')
				return min.toFixed(m_DecimalPlaces);

			return max.toFixed(m_DecimalPlaces);
		}
	}
	
	function drawFooterAggregateCombo(jColumn){
		var eSelect = null;
		var eDiv = document.createElement("div");
		eSelect = document.createElement("select");
		eSelect.id = "h_gridFooterAggregate" + jColumn;
		eSelect.onChange = "javascript:changeAggregateOnColumn( null, " + jColumn + ", document.frm.h_gridFooterAggregate" + jColumn + ".value);";
		eSelect.style.width = "60px";
		if (eSelect){
			var eOption = document.createElement("option");
			eOption.text = "sum";
			eOption.value = "sum";
			eSelect.options[eSelect.options.length] = eOption;
			
			eOption = document.createElement("option");
			eOption.text = "count";
			eOption.value = "count";				
			eSelect.options[eSelect.options.length] = eOption;
						
			eOption = document.createElement("option");
			eOption.text ="avg";
			eOption.value = "avg";
			eSelect.options[eSelect.options.length] = eOption;
			
			eOption = document.createElement("option");
			eOption.text = "max";
			eOption.value = "max";
			eSelect.options[eSelect.options.length] = eOption;
			
			eOption = document.createElement("option");
			eOption.text = "min";
			eOption.value = "min";
			eSelect.options[eSelect.options.length] = eOption;
		}
		eDiv.appendChild(eSelect);

		return eDiv.innerHTML;
	}
/******************** END Aggregates on Footer **************************/
	
	function clearContainer(){
		if (this.container){
			this.container.innerHTML = "";	
		}
	}

	function replaceSpecialSymbols(sText){
		if (!sText)
			return sText;
		
		/*sText = sText.replace( /á/, "&aacute;");
		sText = sText.replace(/\é/g,'&eacute;');
		sText = sText.replace(/\í/g,'&iacute;');
		sText = sText.replace(/\ó/g,'&oacute;');
		sText = sText.replace(/\ú/g,'&uacute;');
		sText = sText.replace(/\Á/g,'&Aacute;');
		sText = sText.replace(/\É/g,'&Eacute;');
		sText = sText.replace(/\Í/g,'&Iacute;');
		sText = sText.replace(/\Ó/g,'&Oacute;');
		sText = sText.replace(/\Ú/g,'&Uacute;');
		sText = sText.replace(/\ñ/g,'&ntilde;');
		sText = sText.replace(/\Ú/g,'&Ntilde;');
	*/
		return sText;
	}
	
	
	//debug
	function debug(obj){
		if (!m_debug)
			return;
		var debug = document.getElementById('debug');
		if (!debug){
			debug = document.createElement("textarea");
			debug.id = "debug";
			debug.style.width = "200px";
			debug.style.height = "200px";
			document.appendChild(debug);
			//document.getElementById("xpTab1").appendChild(debug);
		}
		debug.value = obj.innerHTML;
	}

	
/*
	function ViewTableCode(griddiv){
			var tableCode = document.getElementById('tableRendered');
			tableCode.value = griddiv.innerHTML;
	}
	
	function ViewChartXML(){
			var tableCode = document.getElementById('tableRendered');
			var test = GetDataTableAsXML(getDataTable(document.frm.jsonData.value));

			var hidden = document.getElementById("h_mainchartxml");
			hidden.value = test.innerHTML;
			hidden.value = hidden.value.replace(/\"/g,'\'');
			tableCode.value = hidden.value;
	}
*/