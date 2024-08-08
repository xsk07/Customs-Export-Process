var canCloseMeasures = true;
var previousElement = null;
var timerCounter = 0;
var timerLimit = 1;
var timerInterval = null;


var measuresTimer = null;
var isIE = (navigator.appName == "Microsoft Internet Explorer");

var hasChanges = false;

function getFriendlyName(oldName) {
	var sParts = null;
	var sPartialDate = null;
	if (oldName.indexOf('(') > -1 && oldName.indexOf(')') > -1) {
		oldName = oldName.substring(0, oldName.length - 1);
		sParts = oldName.split("(");
		oldName = sParts[1];
	}
	else if (endsWith(oldName, '_Y')) {
		oldName = oldName.replace("_Y", "");
		sPartialDate = htResources.get("_Y");
	}
	else if (endsWith(oldName, '_Q')) {
		oldName = oldName.replace("_Q", "");
		sPartialDate = htResources.get("_Q");
	}
	else if (endsWith(oldName, '_M')) {
		oldName = oldName.replace("_M", "");
		sPartialDate = htResources.get("_M");
	}
	else if (endsWith(oldName, '_D')) {
		oldName = oldName.replace("_D", "");
		sPartialDate = htResources.get("_D");
	}

	if (htResources.get(oldName))
		oldName = htResources.get(oldName);

	if (sParts)
		oldName = sParts[0] + "(" + oldName + ")";

	if (sPartialDate)
		oldName = oldName + " (" + sPartialDate + ")";
	return oldName;
}

function endsWith(testString, endingString) {
	if (endingString.length > testString.length) return false;
	return testString.indexOf(endingString) == (testString.length - endingString.length);
}

function Dimension(columnName, dataType, filter, startDate, endDate) {
	var parts = columnName.split("|");
	if (parts.length == 2) {
		this.columnName = parts[0];
		this.columnId = parts[1];
	} else {
		this.columnName = columnName;
		this.columnId = columnName;
	}
	this.dataType = dataType;
	this.filter = filter;
	this.render = renderDimension;
	this.showFilter = dataType == "DateTime" ? showDimensionDateFilter : showDimensionFilter;
	this.startDate = startDate;
	this.endDate = endDate;
}

function Measure(displayColumnName, columnName, dataType) {
	this.columnName = columnName;
	this.displayColumnName = displayColumnName;
	this.dataType = dataType;
	this.functions = new Array();
	this.render = renderMeasure;
}

function renderDimension() {
	var li = document.createElement("li");
	var aX = document.createElement("a");
	aX.href = "javascript:removeDimension('" + this.columnId + "', true);";
	aX.className = "eliminarItem";
	aX.appendChild(document.createTextNode("&nbsp;"));

	var aNomMedida = document.createElement("a");
	aNomMedida.href = "javascript:void(0);";
	aNomMedida.className = "nomMedida";
	aNomMedida.onmouseover = "showhideinner('" + "innerTable_" + this.columnId + "',true)";
	aNomMedida.setAttribute("onmouseover", "showhideinner('" + "innerTable_" + this.columnId + "',true)");

	aNomMedida.onmouseout = "showhideinner('" + "innerTable_" + this.columnId + "',false)";
	aNomMedida.setAttribute("onmouseout", "showhideinner('" + "innerTable_" + this.columnId + "',false);");

	var sNomMedida = document.createTextNode(getFriendlyName(this.columnName));
	aNomMedida.appendChild(sNomMedida);

	var table = document.createElement("table");
	table.className = "TablaButtons";
	table.id = "innerTable_" + this.columnId;
	var tr = document.createElement("tr");
	table.appendChild(tr);

	var td = document.createElement("td");
	tr.appendChild(td);

	var ul = document.createElement("ul");
	td.appendChild(ul);

	var innerTable = document.createElement("table");
	innerTable.border = "0";
	innerTable.style.padding = "0px";
	innerTable.style.margin = "0px";
	innerTable.style.width = "50px";

	var innerTR = document.createElement("tr");

	innerTR.appendChild(createDimensionListItem(this, "filter"));
	innerTR.appendChild(createDimensionListItem(this, "down"));
	innerTR.appendChild(createDimensionListItem(this, "up"));

	innerTable.appendChild(innerTR);

	var innerLI = document.createElement("li");
	innerLI.appendChild(innerTable);
	ul.appendChild(innerLI);

	aNomMedida.appendChild(table);

	var mainTable = document.createElement("table");
	var mainTR = document.createElement("tr");
	var tdLeft = document.createElement("td");
	var tdRigth = document.createElement("td");
	tdRigth.style.valign = "middle";

	tdLeft.appendChild(aX);
	tdRigth.appendChild(aNomMedida);
	mainTR.appendChild(tdLeft);
	mainTR.appendChild(tdRigth);
	mainTable.appendChild(mainTR);
	li.appendChild(mainTable);

	//		tdLeft.appendChild(hiddenFilter);

	li.innerHTML = li.innerHTML.replace(/amp;/g, "");
	//		alert(li.outerHTML);
	return li;
}

function renderMeasure(bCounter) {
	var li = document.createElement("li");
	var aX = document.createElement("a");
	aX.href = "javascript:removeMeasure('" + this.columnName + "', true);";
	aX.className = "eliminarItem";
	aX.appendChild(document.createTextNode("&nbsp;"));

	var aNomMedida = document.createElement("a");
	aNomMedida.href = "javascript:void(0);";
	aNomMedida.className = "nomMedida";

	if (!bCounter) {
		aNomMedida.onmouseover = 'displayMeasures(true, this)';
		aNomMedida.setAttribute("onmouseover", "displayMeasures(true, this)");

		aNomMedida.onmouseout = 'setCloseMeasures(true)';
		aNomMedida.setAttribute("onmouseout", "setCloseMeasures(true)");
	}

	aNomMedida.id = "measure_" + this.columnName;

	var sNomMedida = document.createTextNode(getFriendlyName(this.displayColumnName));
	aNomMedida.appendChild(sNomMedida);

	var mainTable = document.createElement("table");
	var mainTR = document.createElement("tr");
	var tdLeft = document.createElement("td");
	var tdRigth = document.createElement("td");
	tdRigth.style.valign = "middle";

	tdLeft.appendChild(aX);
	tdRigth.appendChild(aNomMedida);
	mainTR.appendChild(tdLeft);
	mainTR.appendChild(tdRigth);
	mainTable.appendChild(mainTR);
	li.appendChild(mainTable);

	li.innerHTML = li.innerHTML.replace(/amp;/g, "");
	return li;
}

function createDimensionListItem(dimension, sAction) {
	var li = document.createElement("td");
	li.style.width = "30px";
	li.style.padding = "0px";
	li.style.margin = "0px";

	var a = document.createElement("a");
	a.id = sAction + "-" + dimension.columnName;

	var img = document.createElement("img");
	img.width = "16";
	img.height = "16";
	img.border = "0";
	a.appendChild(img);

	if (sAction == "filter") {
		a.href = "javascript:showFilter('" + dimension.columnId + "');";
		img.src = "../../img/graphicanalysis/filterIcon.gif";
	}
	else if (sAction == "down") {
		a.href = "javascript:moveDown('" + dimension.columnId + "');";
		img.src = "../../img/graphicanalysis/downitemmedida.gif";
	}
	else if (sAction == "up") {
		a.href = "javascript:moveUp('" + dimension.columnId + "');";
		img.src = "../../img/graphicanalysis/upitemmedida.gif";
	}

	switch (sAction) {
		case 'up':
			a.title = $("upValueLocalizable").innerText
			break;

		case 'down':
			a.title = $("downValueLocalizable").innerText;
			break;

		default:
			a.title = sAction;
			break;
	}

	li.appendChild(a);

	return li;
}

function createMeasureListItem(sFunction, measure) {
	var li = document.createElement("li");
	var a = document.createElement("a");
	a.id = sFunction + "-" + measure.columnName;
	a.className = measure.functions.length > 0 && measure.functions.join().indexOf(sFunction) > -1 ? sFunction + "btnActive" : sFunction + "btn";
	a.href = "javascript:changeAggregateState('" + measure.columnName + "', '" + sFunction + "');";
	a.appendChild(document.createTextNode("&nbsp;"));
	a.title = sFunction;
	li.appendChild(a);

	return li;
}

function showFilter(sColumnName) {
	var dimension = findDimensionByColumnName(sColumnName, selectedDimensions);
	var filterValue = dimension.showFilter();
}

//delegate
function showDimensionDateFilter() //dimension, startDate, endDate
{
	var selectedValue = this.filter;
	ShowBAWindowModal(getFriendlyName(this.columnName), 350, 250, "ShowDateRanges.aspx?h_dimension=" + this.columnId + "&start=" + this.startDate + "&end=" + this.endDate + "&selected=" + selectedValue);

}

//delegate
function showDimensionFilter() //dimension
{
	var selectedValue = this.filter;
	ShowBAWindowModal(getFriendlyName(this.columnName), 450, 400, 'DimensionFilter.aspx?h_Dimension=' + this.columnId);
}


//Render every one of the selected measures into the measures container
function renderMeasureContainer(selectedMeasures) {
	var measuresContainer = document.getElementById("measuresContainer");

	measuresContainer.innerHTML = "";
	if (selectedMeasures.length == 0) {
		selectedMeasures[0] = new Measure("Counter", "Counter", "Int32");
		selectedMeasures[0].functions[0] = "count";
	}

	for (var i = 0; i < selectedMeasures.length; i++) {
		var measure = selectedMeasures[i];
		if (measure) {
			var bCounter = measure.columnName == "Counter" && measure.functions.length == 1;
			measuresContainer.appendChild(measure.render(bCounter));
		}
	}
}

//Render every one of the selected measures into the measures container
function renderDimensionContainer(selectedDimensions) {
	var dimensionContainer = document.getElementById("dimensionContainer");

	dimensionContainer.innerHTML = "";

	for (var i = 0; i < selectedDimensions.length; i++) {
		var dimension = selectedDimensions[i];
		dimensionContainer.appendChild(dimension.render());
	}
	//m_debug = true;
	//debug(dimensionContainer);
}

// enable/disable a aggregation function
function changeAggregateState(sColumnName, sFunction) {
	var a = document.getElementById(sFunction + "Function");
	var measure = findMeasureByColumnName(sColumnName, selectedMeasures);
	if (!measure)
		return;

	for (var i = 0; i < measure.functions.length; i++) {
		if (sFunction == measure.functions[i]) {
			measure.functions.splice(i, 1);
			a.className = sFunction + "btn"
			//saveResource(null, true);
			hasChanges = true;
			return;
		}
	}
	measure.functions[measure.functions.length] = sFunction;
	a.className = sFunction + "btnActive";
	hasChanges = true;
	//saveResource(null, true);
}


//find a measure in the selected measures array
function findItemByColumnName(sColumnName, itemsArray) {
	for (var i = 0; i < itemsArray.length; i++) {
		if (itemsArray[i].columnName == sColumnName)
			return itemsArray[i];
	}
	return null;
}

//find a measure in the selected measures array
function findItemByColumnId(sColumnId, itemsArray) {
	for (var i = 0; i < itemsArray.length; i++) {
		if (itemsArray[i].columnId == sColumnId)
			return itemsArray[i];
	}
	return null;
}

//find a measure index in the selected measures array
function findItemIndexByColumnName(sColumnName, itemsArray) {
	for (var i = 0; i < itemsArray.length; i++) {
		if (itemsArray[i].columnName == sColumnName)
			return i;
	}
	return -1;
}

//find a measure index in the selected measures array
function findItemIndexByColumnId(sColumnName, itemsArray) {
	for (var i = 0; i < itemsArray.length; i++) {
		if (itemsArray[i].columnId == sColumnName)
			return i;
	}
	return -1;
}


//find a measure in the selected measures array
function findMeasureByColumnName(sColumnName, measuresArray) {
	return findItemByColumnName(sColumnName, measuresArray);
}

//find a measure index in the selected measures array
function findMeasureIndexByColumnName(sColumnName, measuresArray) {
	return findItemIndexByColumnName(sColumnName, measuresArray);
}

//find a dimension in the selected dimensions array
function findDimensionByColumnName(sColumnName, dimensionsArray) {  //selectedDimensions
	return findItemByColumnId(sColumnName, dimensionsArray);
}

//find a dimension in the selected dimensions array
function findDimensionIndexByColumnName(sColumnName, dimensionsArray) {
	return findItemIndexByColumnName(sColumnName, dimensionsArray);
}

//find a dimension in the selected dimensions array
function findDimensionIndexByColumnId(sColumnName, dimensionsArray) {
	return findItemIndexByColumnId(sColumnName, dimensionsArray);
}

//Move up a dimension on List
function moveUp(sColumnName) {
	var index = findDimensionIndexByColumnId(sColumnName, selectedDimensions);
	if (index > -1 && index >= 1) {
		var dimension = selectedDimensions[index];
		selectedDimensions[index] = selectedDimensions[index - 1];
		selectedDimensions[index - 1] = dimension;
		renderDimensionContainer(selectedDimensions);
		saveResource(null, true);
	}
}

//Move down a dimension on List
function moveDown(sColumnName) {
	var index = findDimensionIndexByColumnId(sColumnName, selectedDimensions);
	if (index > -1 && index < selectedDimensions.length - 1) {
		var dimension = selectedDimensions[index];
		selectedDimensions[index] = selectedDimensions[index + 1];
		selectedDimensions[index + 1] = dimension;
		renderDimensionContainer(selectedDimensions);
		saveResource(null, true);
	}
}

//Removes a dimension from selected dimensions
function removeDimension(sColumnName, doSubmit) {
	var index = findDimensionIndexByColumnId(sColumnName, selectedDimensions);
	if (index > -1 && selectedDimensions.length > 1) {
		selectedDimensions.splice(index, 1);
		renderDimensionContainer(selectedDimensions);

		if (doSubmit)
			saveResource(null, true);
	}
}

//Removes a measure from selected measures
function removeMeasure(sColumnName, doSubmit) {
	var index = findMeasureIndexByColumnName(sColumnName, selectedMeasures);
	if (index > -1 && selectedMeasures.length > 1) {
		selectedMeasures.splice(index, 1);
		renderMeasureContainer(selectedMeasures);

		if (doSubmit)
			saveResource(null, true);
	}
}

//set the canCloseMeasure variable for keep the functions menu visible
function setCloseMeasures(val) {
	canCloseMeasures = val;

	if (canCloseMeasures) {
		measuresTimer.start();
	}
	else {
		measuresTimer.stop();
	}
}

/*********	TIMER CLASS  **********/

function Timer(time, onTimerAction) {
	this.time = time;
	this.start = startTimer;
	this.stop = stopTimer;
	this.onTimerAction = onTimerAction;
	this.interval = null;
}

//timer to keep visible the functions menu
function startTimer() {
	this.interval = setInterval(this.onTimerAction, this.time);
}

//timer to keep visible the functions menu
function stopTimer() {
	if (this.interval)
		this.interval = clearInterval(this.interval);
}

//hide the functions menu
function closeMeasures() {
	if (canCloseMeasures) {
		displayMeasures(false, null);
		if (hasChanges) {
			hasChanges = false;
			saveResource(null, true);
		}
	}
}

//show or hide the functions menu
function displayMeasures(bShow, element) {
	//clearTimer();
	if (!measuresTimer)
		measuresTimer = new Timer(500, closeMeasures);

	measuresTimer.stop();
	var div = document.getElementById("measuresFunctions");
	div.style.visibility = bShow ? "visible" : "hidden";
	div.style.display = bShow ? "block" : "none";

	if (element) {
		replaceHRefAndClass(element);
		previousElement = element;
		var arrPosition = findPos(element);
		div.style.top = arrPosition[1] + "px";
		div.style.left = "175px";
	}
}

//replace the classnames and hrefs for all the buttons on menu, depending on each measure state
function replaceHRefAndClass(element) {
	var a = document.getElementById(element.id);

	if (a) {
		var sColumnName = element.id.replace("measure_", "");
		var measure = findMeasureByColumnName(sColumnName, selectedMeasures);
		if (measure) {
			var maxFunction = document.getElementById("maxFunction");
			maxFunction.href = "javascript:changeAggregateState(\"" + sColumnName + "\", \"max\");";
			maxFunction.className = measure.functions.join().indexOf('max') > -1 ? "maxbtnActive" : "maxbtn";

			var minFunction = document.getElementById("minFunction");
			minFunction.href = "javascript:changeAggregateState(\"" + sColumnName + "\", \"min\");";
			minFunction.className = measure.functions.join().indexOf('min') > -1 ? "minbtnActive" : "minbtn";

			var avgFunction = document.getElementById("avgFunction");
			avgFunction.href = "javascript:changeAggregateState(\"" + sColumnName + "\", \"avg\");";
			avgFunction.className = measure.functions.join().indexOf('avg') > -1 ? "avgbtnActive" : "avgbtn";

			var sumFunction = document.getElementById("sumFunction");
			sumFunction.href = "javascript:changeAggregateState(\"" + sColumnName + "\", \"sum\");";
			sumFunction.className = measure.functions.join().indexOf('sum') > -1 ? "sumbtnActive" : "sumbtn";

			var countFunction = document.getElementById("countFunction");
			if (countFunction) {
				countFunction.href = "javascript:changeAggregateState(\"" + sColumnName + "\", \"count\");";
				countFunction.className = measure.functions.join().indexOf('count') > -1 ? "countbtnActive" : "countbtn";
			}
		}
	}
}

//Get the total top and left of an element on the page
function findPos(obj) {
	var curleft = curtop = 0;
	if (obj.offsetParent) {
		curleft = obj.offsetLeft;
		curtop = obj.offsetTop;
		while (obj = obj.offsetParent) {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		}
	}
	return [curleft, curtop];
}

var scrollTimer;
function scroll(sContainer, direction) {
	scrollTimer = new Timer(30, "scrollStep('" + sContainer + "', '" + direction + "')");
	scrollTimer.start();
}

function scrollStep(sContainer, direction) {
	var container = document.getElementById(sContainer);

	if (!container.style.height) {
		//alert(container.offsetHeight);
		container.style.height = container.offsetHeight;
	}

	var currentTop = 0;
	if (container && container.style.top)
		currentTop = parseInt(container.style.top.replace("px", ""));

	if (direction == "down")
		currentTop -= 10;
	else
		currentTop += 10;

	//alert(container.parentNode.offsetHeight);

	if (Math.abs(currentTop) > parseInt(container.style.height.replace("px", "")) - container.parentNode.parentNode.offsetHeight + 50 || currentTop > 0) {
		scrollTimer.stop();
		return;
	}

	if (container) {
		container.style.top = currentTop + "px";
	}
}

function showhideinner(obj, show) {
	var table = document.getElementById(obj);
	if (show) {
		table.style.display = 'block';
		table.style.visibility = 'visible';
	}
	else {
		if (isIE) {
			table.style.display = 'none';
			table.style.visibility = 'hidden';
		}
		else
			setTimeout(function () { table.style.display = 'none'; table.style.visibility = 'hidden'; }, 2000);
	}
	self.status = "";
}

