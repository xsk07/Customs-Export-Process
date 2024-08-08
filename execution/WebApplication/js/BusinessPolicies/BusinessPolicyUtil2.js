// Replaces all instances of the given substring.
String.prototype.replaceAll = function (strTarget, // The substring you want to replace
	strSubString // The string you want to replace in.
) {
	var strText = this;

	if (strTarget == strSubString)
		return strText;

	var intIndexOfMatch = strText.indexOf(strTarget);

	// Keep looping while an instance of the target string
	// still exists in the string.
	while (intIndexOfMatch != -1) {
		// Relace out the current instance.
		strText = strText.replace(strTarget, strSubString)


		// Get the index of any next matching substring.
		intIndexOfMatch = strText.indexOf(strTarget);
	}


	// Return the updated string with ALL the target strings
	// replaced out with the new substring.
	return (strText);
}

function measureWidth(text, className) {
	var span = document.createElement('SPAN');
	insertAdjacentText(span, text);
	span.className = className;
	span.style.position = 'absolute';

	document.body.appendChild(span);
	var estimatedWidth = span.offsetWidth + 30;

	document.body.removeChild(span);
	return estimatedWidth;
}

function measureHeight(text, className) {
	var span = document.createElement('SPAN');
	insertAdjacentText(span, text);
	span.className = className;
	span.style.position = 'absolute';

	document.body.appendChild(span);
	var estimatedHeight = span.offsetHeight;

	document.body.removeChild(span);
	return estimatedHeight;
}


function getParentDiv(object, name) {
	if (object.parentNode == null) {
		return null;
	}

	if (object.parentNode.tagName == 'DIV' &&
		(object.parentNode.name == name ||
			object.parentNode.id == name
		)
	) {
		return object.parentNode;
	}

	return getParentDiv(object.parentNode);
}

function getDescendant(object, child) {

	if (object.hasChildNodes()) {
		var children = object.childNodes;

		for (var i = 0; i < children.length; i++) {

			if (children[i].id == child ||
				children[i].name == child) {

				return children[i];

			} else {
				var o = getDescendant(children[i], child);

				if (o != null)
					return o;
			}
		}
	}

	return null;
}

function getDescendants(object, child) {
	var objects = new Array();
	if (object.hasChildNodes()) {
		var children = object.childNodes;

		for (var i = 0; i < children.length; i++) {

			if (children[i].id == child ||
				children[i].name == child) {

				objects.push(children[i]);

			} else {
				var childObjects = getDescendants(children[i], child);

				for (var j = 0; j < childObjects.length; j++) {
					objects.push(childObjects[j]);
				}
			}
		}
	}

	return objects;
}

function getDescendantByClassName(object, className) {

	if (object.hasChildNodes()) {
		var children = object.childNodes;

		var classList, result;

		var j, result = true;

		for (var i = 0; i < children.length; i++) {

			classList = [].concat(className.split(' '));
			j = classList.length;
			result = true;

			//Finds if the className is in the desired children
			while (j-- > 0) {
				result = hasClass(children[i], classList[j]);
			}

			if (result)
				return children[i];
			else {
				var o = getDescendantByClassName(children[i], className);

				if (o != null)
					return o;
			}
		}
	}

	return null;
}

function hasClass(element, cls) {
	return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function getDescendantsByClassName(object, className) {
	var objects = new Array();
	if (object.hasChildNodes()) {
		var children = object.childNodes;

		for (var i = 0; i < children.length; i++) {

			if (children[i].className == className) {
				objects.push(children[i]);

			} else {
				var childObjects = getDescendantsByClassName(children[i], className);

				for (var j = 0; j < childObjects.length; j++) {
					objects.push(childObjects[j]);
				}
			}
		}
	}

	return objects;
}

function getChildNodes(object, tagName) {
	var childNodes = new Array();
	if (object.hasChildNodes()) {
		var children = object.childNodes;

		for (var i = 0; i < children.length; i++) {

			if (children[i].tagName == tagName) {
				childNodes.push(children[i]);
			}
		}
	}

	return childNodes;
}

function getFirstElement(object) {
	if (object.hasChildNodes()) {
		var children = object.childNodes;

		for (var i = 0; i < children.length; i++) {

			if (children[i].nodeType == 1) {
				return children[i];
			}
		}
	}

	return null;
}

//Objects
function getXMLDocument(xmlCode) {
	var myDocument;

	if (document.implementation.createDocument) {
		// Mozilla, create a new DOMParser 

		var parser = new DOMParser();
		myDocument = parser.parseFromString(xmlCode, "text/xml");
	} else if (window.ActiveXObject) {
		// Internet Explorer, create a new XML document using ActiveX 
		// and use loadXML as a DOM parser. 
		myDocument = new ActiveXObject("Microsoft.XMLDOM");
		myDocument.async = "false";

		myDocument.loadXML(xmlCode);

	}

	return myDocument;
}

function getRandomNumber(num) {
	var ranNum = Math.floor(Math.random() * num);
	return ranNum;
}

function removeFromArray(array, element) {
	var newArray = new Array();
	for (var i = 0; i < array.length; i++) {
		var obj = array[i];

		if (obj != element) {
			newArray.push(obj);
		}
	}
	return newArray;
}

function hoverElement(object) {
	object.className = object.className + 'Hover';
}

function unhoverElement(object) {
	var i = object.className.indexOf('Hover');
	object.className = object.className.substring(0, i);
}

function isBoolean(datatype) {
	if (datatype == 5) {
		return true;
	}

	return false;
}

function isText(datatype) {
	if (datatype == 14 ||
		datatype == 15 ||
		datatype == 16) {
		return true;
	}

	return false;
}

function isDatetime(datatype) {
	if (datatype == 12 ||
		datatype == 13) {
		return true;
	}

	return false;
}

function isNumeric(datatype) {
	if (datatype == 1 ||
		datatype == 2 ||
		datatype == 3 ||
		datatype == 4 ||
		datatype == 6 ||
		datatype == 7 ||
		datatype == 10 ||
		datatype == 11) {
		return true;
	}

	return false;
}

function isDecimal(datatype) {
	if (datatype == 6 ||
		datatype == 8 ||
		datatype == 10 ||
		datatype == 11) {
		return true;
	}

	return false;
}

function isMoney(datatype) {
	if (datatype == 8) {
		return true;
	}

	return false;
}

function getNamedDataType(dataType) {
	if (dataType == 1)
		return "bigint";
	if (dataType == 2)
		return "int";
	if (dataType == 3)
		return "smallint";
	if (dataType == 4)
		return "tinyint";
	if (dataType == 5)
		return "boolean";
	if (dataType == 6)
		return "decimal";
	if (dataType == 7)
		return "numeric";
	if (dataType == 8)
		return "currency";
	if (dataType == 10)
		return "float";
	if (dataType == 11)
		return "real";
	if (dataType == 12)
		return "datetime";
	if (dataType == 13)
		return "smalldatetime";
	if (dataType == 14)
		return "char";
	if (dataType == 15)
		return "varchar";
	if (dataType == 16)
		return "text";
	if (dataType == 17)
		return "binary";
	if (dataType == 18)
		return "varbinary";
	if (dataType == 19)
		return "image";
	if (dataType == 2)
		return "guid";
}

function checkDataType(dataType, otherDataType) {
	var namedDataType = getNamedDataType(dataType);
	if (otherDataType == 0 || dataType == 0)
		return true;

	if (namedDataType == 'bigint' ||
		namedDataType == 'decimal' ||
		namedDataType == 'float' ||
		namedDataType == 'int' ||
		namedDataType == 'numeric' ||
		namedDataType == 'real' ||
		namedDataType == 'smallint' ||
		namedDataType == 'tinyint') {

		if (isNumeric(otherDataType) || isMoney(otherDataType))
			return true;

	} else if (namedDataType == 'boolean') {

		if (isBoolean(otherDataType))
			return true;

	} else if (namedDataType == 'datetime' ||
		namedDataType == 'smalldatetime') {

		if (isDatetime(otherDataType))
			return true;

	} else if (namedDataType == 'currency') {

		if (isNumeric(otherDataType) || isMoney(otherDataType))
			return true;
	} else {

		if (isText(otherDataType))
			return true;
	}

	return false;
}

function getEvent(e) {
	if (isIE) {
		return event;
	} else {
		return e;
	}
}

function quote(text) {
	var quotedValue = text;

	if (text == null) {
		return '';
	}
	if (text.length > 0 &&
		text.substring(0, 1) != "\"") {
		quotedValue = "\"" + text + "\"";
	}

	return quotedValue;
}

function unquote(text) {
	var unquotedValue = text;

	if (text == null) {
		return '';
	}
	if (text.length > 0 &&
		text.substring(0, 1) == "\"") {
		unquotedValue = text.substring(1, text.length - 1);
	}

	return unquotedValue;
}

function clone(obj) {
	if (obj == null || typeof (obj) != 'object')
		return obj;

	var temp = {};
	for (var key in obj) {
		try {
			temp[key] = clone(obj[key]);
		} catch (e) { }
	}
	return temp;
}

function copyPrototype(descendant, parent) {
	var sConstructor = parent.toString();
	var aMatch = sConstructor.match(/\s*function (.*)\s*\(/);

	var sConstructor = parent.toString();
	var aMatch = sConstructor.match(/\s*function (.*)\(/);
	if (aMatch != null) { descendant.prototype[aMatch[1].replace(/^\s*|\s*$/g, "")] = parent; }
	descendant.prototype[aMatch[1]] = parent;
	for (var m in parent.prototype)
		descendant.prototype[m] = parent.prototype[m];
}


function HTMLEncode(t) {
	return t.toString().replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function HTMLDecode(t) {
	return t.toString().replace("&amp;", "&").replace("&quot;", "\"").replace("&lt;", "<").replace("&gt;", ">");
}

// For Decision Tables
function insertAdjacentText(element, text) {
	if (isIE) {
		element.innerText = text;
	} else {
		element.innerHTML = '';
		element.appendChild(document.createTextNode(text));
	}
}

function getMaxChildWidth(object) {
	var maxWidth = 0;
	if (object.hasChildNodes()) {
		var children = object.childNodes;

		for (var i = 0; i < children.length; i++) {
			if (children[i].style) {
				var left = getCurrentLeft(children[i]) == '' ? 0 : parseInt(getCurrentLeft(children[i]));
				var width = getCurrentWidth(children[i]) == '' ? 0 : parseInt(getCurrentWidth(children[i]));
				var elementWidth = left + width;
				if (maxWidth < elementWidth)
					maxWidth = elementWidth;
			}
		}
	}

	return maxWidth;
}

function getMaxChildHeight(object) {
	var maxHeight = 0;
	if (object.hasChildNodes()) {
		var children = object.childNodes;

		for (var i = 0; i < children.length; i++) {
			if (children[i].style) {
				var top = getCurrentTop(children[i]) == '' ? 0 : parseInt(getCurrentTop(children[i]));
				var height = getCurrentHeight(children[i]) == '' ? 0 : parseInt(getCurrentHeight(children[i]));
				var elementHeight = top + height;
				if (maxHeight < elementHeight)
					maxHeight = elementHeight;
			}
		}
	}

	return maxHeight;
}

function getCurrentWidth(elem) {
	if (isIE)
		return elem.currentStyle.width == 'auto' ? 0 : elem.currentStyle.width;
	else
		return elem.offsetWidth;
}

function getCurrentHeight(elem) {
	if (isIE)
		return elem.currentStyle.height == 'auto' ? 0 : elem.currentStyle.height;
	else
		return elem.offsetHeight;
}

function getCurrentTop(elem) {
	if (isIE)
		return elem.currentStyle.top == 'auto' ? 0 : elem.currentStyle.top;
	else
		return elem.offsetTop;
}

function getCurrentLeft(elem) {
	if (isIE)
		return elem.currentStyle.left == 'auto' ? 0 : elem.currentStyle.left;
	else
		return elem.offsetLeft;
}

// For decision Tables column resizing
function preventDefault(e) {
	if (isIE) {
		e.returnValue = false;
	} else {
		e.preventDefault();
	}
}

function getElementFromEvent(e) {

	if (isIE) {
		return e.srcElement;
	} else {
		return e.target;
	}
}

function setCaptureForElement(element) {
	if (isIE) {
		element.setCapture(false);
	}
}

function releaseCaptureForElement(element) {
	if (isIE) {
		element.releaseCapture();
	}
}

function mouseevent(elm, _event, _function) {
	try {
		if (isIE) {
			eval('elm.attachEvent(\'' + _event + '\',' + _function + ');');
		} else {
			eval('window.' + _event + '=' + _function + ';');
		}
	} catch (e) {
	}
}

function mousedetach(elm, _event, _function) {
	try {
		if (isIE) {
			elm.detachEvent(_event, _function, false);
		} else {
			eval('window.' + _event + '=null;');
		}
	} catch (e) { }
}



// Check box methods
function BACheckBoxClick(element, onClickSentence) {
	if (element.getAttribute("BAChecked") == "true" || element.getAttribute("BAChecked") == true)
		element.setAttribute("BAChecked", "false");
	else
		element.setAttribute("BAChecked", "true");

	BASetCheckBoxImage(element);

	if (onClickSentence != null)
		onClickSentence(element);
}

function BASetCheckBoxImage(element) {

	if (element.getAttribute("BAChecked") == "true" ||
		element.getAttribute("BAChecked") == true) {
		element.src = document.getElementById('BACheckedImage').src;

	} else {
		element.src = document.getElementById('BAUncheckedImage').src;
	}
}

function BAInitCheckBoxes() {
	//get all the images
	baCheckBoxes = document.getElementsByTagName('img');

	//cycle trough the input fields
	for (var i = 0; i < baCheckBoxes.length; i++) {

		//check if the input is a checkbox
		if (baCheckBoxes[i].className == 'BACheckBox') {

			BASetCheckBoxImage(baCheckBoxes[i]);
		}
	}
}

function startProcessing() {
	var processing = document.getElementById("messageLayer");
	processing.style.visibility = "";
	processing.style.display = "";
	insertAdjacentText(getDescendant(processing, "messageText"), WAITING_MESSAGE);
	getDescendant(processing, "messageDiv").className = 'waitMessage';
}

function endProcessing() {
	endShowMessage();
}

function showInfo(message) {
	var processing = document.getElementById("messageLayer");
	processing.style.visibility = "visible";
	processing.style.display = "block";
	insertAdjacentText(getDescendant(processing, "messageText"), message);
	getDescendant(processing, "messageDiv").className = 'infoMessage';

	setTimeout('endShowMessage()', 2000);
}

function showError(message) {
	var processing = document.getElementById("messageLayer");
	processing.style.visibility = "visible";
	processing.style.display = "block";
	insertAdjacentText(getDescendant(processing, "messageText"), message);
	getDescendant(processing, "messageDiv").className = 'errorMessage';

	setTimeout('endShowMessage()', 2000);
}

function endShowMessage() {
	var processing = document.getElementById("messageLayer");
	processing.style.visibility = "hidden";
	processing.style.display = "none";
}


var INT_TAG = 'int:';
var DEC_TAG = ',dec:';

function deserializeDecimalValue(sValue) {
	var sNewValue = sValue;
	if (sValue.indexOf(INT_TAG) != -1 && sValue.indexOf(DEC_TAG) != -1) {
		var iIndex = sValue.indexOf(DEC_TAG);
		sNewValue = sValue.substring(INT_TAG.length, iIndex);
		sNewValue += BA_DECIMAL_SEPARATOR;

		sNewValue += sValue.substring(iIndex + DEC_TAG.length, sValue.length);
	}

	return sNewValue;
}

function serializeDecimalValue(dValue) {
	// Take out miles separator
	dValue = dValue.replaceAll(BA_GROUP_SEPARATOR, '');
	// Replace decimal separator with dots
	dValue = dValue.replaceAll(BA_DECIMAL_SEPARATOR, '.');
	// Parse number
	dValue = parseFloat(dValue);
	var intPart = Math.floor(dValue);
	var decimalPart = String(dValue - intPart);

	return INT_TAG + intPart + DEC_TAG + decimalPart.substring(2, decimalPart.length);
}

function deserializeDateValue(sValue) {
	var sNewValue = sValue;

	if (sValue.length > 0 && sValue.indexOf("#", 0) > -1) {
		var year = sNewValue.substring(0, 4);
		var month = sNewValue.substring(5, 7);
		var day = sNewValue.substring(8, 10);

		sNewValue = getDateFormat(year, month, day);
	}

	return sNewValue;
}

function serializeDateValue(sValue) {
	// For format yyyy-MM-dd.*
	if (sValue.match(/^\d{4}-\d{2}-\d{2}.*$/)) return serializeDateValueInvariant(sValue);

	var sFormat = BA_DATE_FORMAT_MASK.toLowerCase();
	var sSeparator = getDateSeparator(sFormat);
	var data = sValue.split(sSeparator);
	var dataFormat = sFormat.split(sSeparator);
	var year = "";
	var month = "";
	var day = "";

	for (var i = 0; i < 3; i++) {
		if (dataFormat[i].indexOf("y", 0) > -1)
			year = data[i];
		else if (dataFormat[i].indexOf("m", 0) > -1)
			month = data[i].length == 1 ? "0" + data[i] : data[i];
		else
			day = data[i].length == 1 ? "0" + data[i] : data[i];
	}

	//return year + "#" + month + "#" + day + "#12#00#00";
	return year + "#" + month + "#" + day + "#00#00#00";
}


function serializeDateValueInvariant(sValue) {
	var sFormat = "yyyy-MM-dd".toLowerCase(); //The format sent by server is yyyy-MM-ddTHH:mm:sszzz, but here the hour won't be taken into account
	var sSeparator = getDateSeparator(sFormat);
	var data = sValue.split(sSeparator);
	var dataFormat = sFormat.split(sSeparator);
	var year = "";
	var month = "";
	var day = "";

	for (var i = 0; i < 3; i++) {
		if (dataFormat[i].indexOf("y", 0) > -1) {
			year = data[i];
		}
		else if (dataFormat[i].indexOf("m", 0) > -1) {
			month = data[i].length == 1 ? "0" + data[i] : data[i];
		}
		else if (dataFormat[i].indexOf("d", 0) > -1) {
			var dayData = data[i].split("T")[0];
			day = dayData.length == 1 ? "0" + dayData : dayData;
		}
	}

	//return year + "#" + month + "#" + day + "#12#00#00";
	return year + "#" + month + "#" + day + "#00#00#00";
}

function getDateFormat(year, month, day) {
	var sValue = "";
	var sFormat = BA_DATE_FORMAT_MASK.toLowerCase();
	var hasDotAtTheEnd = false;
	var hasRAtTheEnd = false;
	if (sFormat.slice(-1) == ".") { //For the format date: yyyy.MM.dd.
		hasDotAtTheEnd = true;
	}
	if (sFormat.indexOf("'г.'", 0) > -1) { //For the format date dd.M.yyyy 'г.'
		hasRAtTheEnd = true;
	}
	var sSeparator = getDateSeparator(sFormat);
	var data = sFormat.split(sSeparator);

	for (var i = 0; i < data.length; i++) {
		if (data[i].indexOf("d", 0) > -1) {

			if (data[i].length == 2 && day.toString().length == 1) {
				day = "0" + day;
			}

			sValue += i == 0 ? day : sSeparator + day;
		}
		else if (data[i].indexOf("m", 0) > -1) {

			if (data[i].indexOf("y", 0) > -1) { //For the format date: dd/mm yyyy

				var secondSeparator = getDateSeparator(data[i]);
				var dataMonthAndYear = data[i].split(secondSeparator);

				month = this.getMonth(dataMonthAndYear[0], month);
				year = this.getYear(dataMonthAndYear[1], year);

				month = month + secondSeparator + year;

			} else {
				month = this.getMonth(data[i], month);
			}

			sValue += i == 0 ? month : sSeparator + month;

		}
		else if (data[i].indexOf("y", 0) > -1) {
			year = this.getYear(data[i], year);
			sValue += i == 0 ? year : sSeparator + year;
		}

	}

	if (hasDotAtTheEnd) {
		sValue += ".";
	}
	if (hasRAtTheEnd) {
		sValue += " г.";
	}

	return sValue;
}

function getMonth(dataMonth, month) {
	if (dataMonth.length == 2 && month.toString().length == 1) {
		month = "0" + month;
	}
	return month;
}

function getYear(dataYear, year) {
	if (dataYear.length == 2) {
		year = year.toString().slice(-2);
	}
	return year;
}

function getDateSeparator(format) {
	var sSeparator = "";

	for (var i = 0; i < format.length; i++) {
		var sChar = format.substring(i, i + 1);

		if (sChar != "d" && sChar != "m" && sChar != "y") {
			if (sChar == "." && format.substring(i + 1, i + 2) == " ") {
				sSeparator = sChar + " ";
			} else {
				sSeparator = sChar;
			}
			break;
		}
	}

	return sSeparator;
}



// Random number generator
var randomElementIds = new Array();
function getRandomID() {
	var maxNumberOfIds = 10000;

	if (randomElementIds.length >= maxNumberOfIds) {
		showError("Too many elements");
		throw "Too many elements";
	}

	var number = getRandomNumber(maxNumberOfIds);

	for (var i = 0; i < randomElementIds.length; i++) {
		if (number == randomElementIds[i]) {
			// Gets another cell id because it is used
			return getRandomID();
		}
	}

	// the number is not used so return it
	this.randomElementIds.push(number);
	return number;
}