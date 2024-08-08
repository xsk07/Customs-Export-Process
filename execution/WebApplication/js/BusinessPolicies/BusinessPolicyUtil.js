
var isIE = document.all?true:false;
var isMozilla = document.implementation.createDocument? true : false;
var _mouseX;
var _mouseY;
var actualHoveredElement = null;
var lastZIndex = 1;
var iFrameStack = new Array();

if (!isIE) document.captureEvents(Event.MOUSEMOVE);
if (isMozilla) Node.prototype.__defineGetter__("xml", _Node_getXML);

// Mozilla xml getter for the xml nodes
function _Node_getXML() {
	
	//create a new XMLSerializer
	var objXMLSerializer = new XMLSerializer;
	
	//get the XML string
	var strXML = objXMLSerializer.serializeToString(this);
	
	//return the XML string
	return strXML;
}

function getChildNodes(object, tagName){
	var childNodes = new Array();
	if (object.hasChildNodes())	{
		var children = object.childNodes;
	
		for (var i = 0; i < children.length; i++) {
	
			if (children[i].tagName == tagName){
				childNodes.push(children[i]);
			} 					
		}
	}
	
	return childNodes;
}

function getFirstElement(object){
	if (object.hasChildNodes())	{
		var children = object.childNodes;
	
		for (var i = 0; i < children.length; i++) {
	
			if (children[i].nodeType == 1){
				 return children[i];
			} 					
		}
	}
	
	return null;
}


function getDescendant(object, child){
	
	if (object.hasChildNodes())	{
		var children = object.childNodes;
	
		for (var i = 0; i < children.length; i++) {
	
			if (children[i].id == child ||
				children[i].name == child ){
				
				return children[i];
				
			} else {
				var o = getDescendant(children[i], child);
				
				if ( o != null)
					return o;
			}					
		}
	}
	
	return null;
}

function getDescendants(object, child){
	var objects = new Array();
	if (object.hasChildNodes())	{
		var children = object.childNodes;
	
		for (var i = 0; i < children.length; i++) {
	
			if (children[i].id == child ||
				children[i].name == child ){
				
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

function getDescendantsByClassName(object, className){
	var objects = new Array();
	if (object.hasChildNodes())	{
		var children = object.childNodes;
	
		for (var i = 0; i < children.length; i++) {
	
			if (children[i].className == className ){
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

function getDescendantByClassName(object, className){
	
	if (object.hasChildNodes())	{
		var children = object.childNodes;
	
		for (var i = 0; i < children.length; i++) {
	
			if (children[i].className == className ){
				return children[i];
				
			} else {
				var o = getDescendantByClassName(children[i], className);
				
				if ( o != null)
					return o;
			}					
		}
	}
	
	return null;
}

function disableEventByClass(className, sEvent){
	var objects = getDescendantsByClassName(document, className);
	
	for (var i = 0; i < objects.length; i++) {
		var str = "objects[i]." + sEvent + " = null;";

        try
        {
            eval(str);
        }
        catch(e)
        {
            // Do nothing
        }
	}
}

function hoverElement(object){
	object.className = object.className + 'Hover';
}

function unhoverElement(object){
	var i = object.className.indexOf('Hover');
	object.className = object.className.substring(0,i);
}

function hover(object){
	
	if (actualHoveredElement != null)
		return;
	
	var color = 'red';
	var style = 'solid';
	var width = '2px';
	
	object.style.borderColor = color;
	object.style.borderStyle = style;
	object.style.borderWidth = width;

	// Set the actual element to avoid more than an object to get focused at same time
	actualHoveredElement = object;
}

function unhover(object){
	var color = document.bgColor;
	var style = 'solid';
	var width = '2px';
	
	object.style.borderColor = color;
	object.style.borderStyle = style;
	object.style.borderWidth = width;
	
	// Clear the actual element to let another object to get focused
	actualHoveredElement = null;
}


function showFloatingDiv(operator, div){
	
	var newDiv = document.createElement('DIV');
	document.body.appendChild(newDiv);
	
	newDiv.innerHTML = div.innerHTML;
	copyStyle(div, newDiv);
	
	var x = findPositionX(operator);
	var y = findPositionY(operator);
	
	var left = x - (Number(newDiv.clientWidth) / 4);
	if (left < 0)
		left = 0 ;
	
	newDiv.style.left = left;
	newDiv.style.top	= y;
	newDiv.style.zIndex = lastZIndex + 2;
	newDiv.style.visibility = "visible";
	newDiv.style.position = "absolute";
	
	childDiv = getDescendantByClassName(newDiv, 'popupDiv');
	
	iFrame = document.createElement('IFRAME');
	document.body.appendChild(iFrame);
	
	iFrame.className = 'popupIFrame';
	
	if (isIE) { 
		iFrame.contentWindow.window.document.bgColor = document.body.currentStyle.backgroundColor;
	} else if (isMozilla) {
		iFrame.style.backgroundColor = document.body.bgColor;
	}
	
	iFrameStack.push(iFrame);
	
	lastZIndex += 2;
	
	//scroll the window
	window.scroll(newDiv.clientLeft + newDiv.clientWidth , newDiv.clientTop + newDiv.clientHeight);
	
	return newDiv;
}

function closePopup(div){
	div.style.visibility = "hidden";
	div.style.display = "none";
	
	var iFrame = iFrameStack.pop();
	iFrame.style.visibility = "hidden";
	iFrame.style.display = "none";
	lastZIndex -= 2;
}

//Finds out the real position of the given object
function findPositionX(obj)
{
	var curleft = 0;
	if (obj.offsetParent)
	{
		while (obj.offsetParent)
		{
			curleft += obj.offsetLeft;
			obj = obj.offsetParent;
		}
	}
	else if (obj.x)
		curleft += obj.x;
	return curleft;
}
//Finds out the real position of the given object
function findPositionY(obj)
{
	var curtop = 0;
	if (obj.offsetParent)
	{
		while (obj.offsetParent)
		{
			curtop += obj.offsetTop;
			obj = obj.offsetParent;
		}
	}
	else if (obj.y)
		curtop += obj.y;
	return curtop;
}

function quote(text){
	var quotedValue = text;
	
	if (text == null) { 
		return '';
	}
	if (text.length > 0 &&
		text.substring(0,1) != "\"")
	{
		quotedValue = "\"" + text + "\"";
	}

	return quotedValue;
}

function unquote(text){
	var unquotedValue = text;
	
	if (text == null) { 
		return '';
	}
	if (text.length > 0 &&
		text.substring(0,1) == "\"")
	{
		unquotedValue = text.substring(1, text.length - 1);
	}

	return unquotedValue;
}

function HTMLEncode(t) {
    return t.toString().replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function HTMLDecode(t) {
    return t.toString().replace("&amp;", "&").replace("&quot;", "\"").replace("&lt;", "<").replace("&gt;", ">");
}

 function copyStyle(base, targ)
 {
    var baseStyle = base.style;
    var targStyle = targ.style;
    
    targ.className = base.className;
    
    for(var prop in baseStyle)
    {
        var str = "targStyle." + prop + " = baseStyle." + prop + ";";

        try
        {
            eval(str);
        }
        catch(e)
        {
            // Do nothing
        }
    }
 }
 
 function copyEvents(base, targ)
 {
	for( var i=0; i < base.attributes.length; i++) {
		
		var prop = base.attributes[i];
		
		if (prop.name.substring(0,2) == 'on'){
			var str = "targ." + prop.name + " = base." + prop.name + ";";
			
				try
			{
				eval(str);
			}
			catch(e)
			{
				// Do nothing
			}
        }
	}
 }
 
 function getParentDiv(object, name){
	if (object.parentNode == null) {
		return null;
	}
	
	if (object.parentNode.tagName == 'DIV' &&
			( object.parentNode.name == name ||
			  object.parentNode.id == name 
			)
		) 
	{
		return object.parentNode;
	}
	
	return getParentDiv(object.parentNode);
 }
 
//Objects
function getXMLDocument(xmlCode){
	var myDocument; 

	if (document.implementation.createDocument){ 
		// Mozilla, create a new DOMParser 
		
		var parser = new DOMParser(); 
		myDocument = parser.parseFromString(xmlCode, "text/xml"); 
	} else if (window.ActiveXObject){ 
		// Internet Explorer, create a new XML document using ActiveX 
		// and use loadXML as a DOM parser. 
		myDocument = new ActiveXObject("Microsoft.XMLDOM"); 
		myDocument.async="false"; 

		myDocument.loadXML(xmlCode);
		
	}
	
	return myDocument;
}

function getRandomNumber(num)
{
    var ranNum= Math.floor(Math.random()*num);
    return ranNum;
}

function getEvent(e)
{
	if (isIE){
		return event;
	} else {		
		return e;
	}
}

function preventDefault(e)
{
	if (isIE){
		e.returnValue = false;
	} else {		
		e.preventDefault();
	}
}

function getElementFromEvent(e){

	if (isIE){
		return e.srcElement;
	} else {		
		return e.target;
	}			
}

function removeFromArray(array, element){
	var newArray = new Array();
	for(var i=0; i < array.length; i++){
		var obj = array[i];

		if (obj != element) {
			newArray.push(obj);
		}
	}		
	return newArray;
}


function setCaptureForElement(element){
	if (isIE){
		element.setCapture(false);
	}
}

function releaseCaptureForElement(element){
	if (isIE){
		element.releaseCapture();
	}
}

function mouseevent(elm, _event, _function)
{
	try{
		if (isIE){
			eval('elm.attachEvent(\'' + _event + '\',' + _function + ');');
		} else {
			eval('window.' + _event + '=' + _function + ';');
		}
	} catch(e) {
	}
}

function mousedetach(elm, _event, _function)
{
	try{
		if (isIE){
			elm.detachEvent(_event, _function, false);
		} else {
			eval('window.' + _event + '=null;');
		}
	} catch(e) {}
}

function insertAdjacentText(element, text){
	if (isIE){
		element.innerText = text;
	} else {
		element.appendChild(document.createTextNode(text));
	}
}

function getCurrentWidth(elem){
	if (isIE)
		return elem.currentStyle.width == 'auto' ? 0 : elem.currentStyle.width;
	else
		return elem.offsetWidth;
}

function getCurrentHeight(elem){
	if (isIE)
		return elem.currentStyle.height == 'auto' ? 0 : elem.currentStyle.height;
	else
		return elem.offsetHeight;
}

function getCurrentTop(elem){
	if (isIE)
		return elem.currentStyle.top == 'auto' ? 0 : elem.currentStyle.top;
	else
		return elem.offsetTop;
}

function getCurrentLeft(elem){
	if (isIE)
		return elem.currentStyle.left == 'auto' ? 0 : elem.currentStyle.left;
	else
		return elem.offsetLeft;
}

function getMaxChildWidth(object){
	var maxWidth = 0;
	if (object.hasChildNodes())	{
		var children = object.childNodes;
	
		for (var i = 0; i < children.length; i++) {
			if (children[i].style) {
				var left = getCurrentLeft(children[i]) == '' ? 0 : parseInt( getCurrentLeft(children[i]) );
				var width = getCurrentWidth(children[i])== '' ? 0 : parseInt( getCurrentWidth(children[i]) );
				var elementWidth = left + width;
				if (maxWidth < elementWidth)
					maxWidth = elementWidth;
			}
		}
	}
	
	return maxWidth;
}

function getMaxChildHeight(object){
	var maxHeight = 0;
	if (object.hasChildNodes())	{
		var children = object.childNodes;
	
		for (var i = 0; i < children.length; i++) {
			if (children[i].style){
				var top = getCurrentTop(children[i]) == '' ? 0 : parseInt( getCurrentTop(children[i]) );
				var height = getCurrentHeight(children[i]) == '' ? 0 : parseInt( getCurrentHeight(children[i]) );
				var elementHeight = top + height;
				if (maxHeight < elementHeight) 
					maxHeight = elementHeight;
			}
		}
	}
	
	return maxHeight;
}

function isBoolean(datatype){
	if (datatype == 5){
		return true;
	}
	
	return false;
}

function isText(datatype){
	if (datatype == 14 ||
		datatype == 15 ||
		datatype == 16){
		return true;
	}
	
	return false;
}

function isDatetime(datatype){
	if (datatype == 12 ||
		datatype == 13){
		return true;
	}
	
	return false;
}

function isNumeric(datatype){
	if (datatype == 1 ||
		datatype == 2 ||
		datatype == 3 ||
		datatype == 4 ||
		datatype == 6 ||
		datatype == 7 ||
		datatype == 10 ||
		datatype == 11 ){
		return true;
	}
	
	return false;
}

function isMoney(datatype){
	if (datatype == 8){
		return true;
	}
	
	return false;
}

function getNamedDataType(dataType){
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