/*
This script file contains the logic used to hide and show the nodes in a Work Portal Bizagi tree..
*/

//Gets the parent element that has the given tag Name
function WPGetParentControl(node, parentTagName){
	while (node != null){
		if (node.tagName != null && node.tagName.toUpperCase() == parentTagName){
			return node;
		}
		node = node.parentNode;		
	}
	return null;
}
//Gets the next div to the given element
function WPGetInnerControl(node){
	
	//Find the parent anchor of the image:
	node = WPGetParentControl(node,"A");
    while (node != null)
    {     
		if (node.tagName != null && node.tagName.toUpperCase()== "DIV"){
			return node;
		}
		node = node.nextSibling;
		
    }	        
    return null;
}
var imgPlus = null;
var imgMinus = null;
var imgPlusE = null;

var BAcurrentImage = null;
function EndWPToggleNode(){
	BAcurrentImage.src = imgPlusE.src;
	BAcurrentImage = null;
}

function getImageValues(){
	if (imgPlus == null){
		imgPlus = document.getElementById("imgPlus");
		imgMinus = document.getElementById("imgMinus");
		imgPlusE = document.getElementById("imgPlusE");
	}
}

// load asynchronous
function GetElementTree(control, type, id) {
    var anchor = closest(control, "a");
    if (anchor) {
        var div = anchor.nextSibling;
        if (!div.innerHTML) {
            ajaxCall(type, id, control, showResult);
        }
    }
}

function showResult(control, data) {
    var anchor = closest(control, "a");
    if (anchor) {
        var div = anchor.nextSibling;
        var parent = div.parentNode;
        var p = document.createElement("p");
        p.innerHTML = stripScripts(data);
        var newDiv = p.firstChild;
        parent.replaceChild(newDiv, div);
    }
}

/**
 * Clean script tags for prevent XSS
 * @param {String} s 
 */
function stripScripts(s) {
    var div = document.createElement('div');
    div.innerHTML = s;
    var scripts = div.getElementsByTagName('script');
    var i = scripts.length;
    while (i--) {
      scripts[i].parentNode.removeChild(scripts[i]);
    }
    return div.innerHTML;
}

function closest(element, selector) {
    selector = selector.toLowerCase();
    var result;
    do {
        if (element.nodeName.toLowerCase() === selector) {
            return element;
        }
    } while (element = element.parentNode);

    return null;
}

// for tree
function ajaxCall(type, id, control, callback) {
	startProcessing();
	var xhr;
	if (window.XMLHttpRequest) {
		xhr = new XMLHttpRequest();
	} else if (window.ActiveXObject) {
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
	}

	xhr.open('get', location.protocol + "//" + location.hostname + getPort() + getPathName() + "/BusinessPoliciesLoader.aspx?nodeType=" + type + "&nodeId=" + id);
	xhr.setRequestHeader('cache-control', 'no-cache');
	xhr.setRequestHeader('pragma', 'no-cache');
	// Assign a handler for the response
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			if (xhr.responseText) {
				if (callback) {
					if (xhr.responseText) {
						setTimeout("endProcessing()", 200);
						callback(control, xhr.responseText);
					}
				} else {
					setTimeout("endProcessing()", 200);
					return xhr.response;
				}
			}
		}
	};

	// Actually send the request to the server
	xhr.send(null);
}

function getPort() {
	return (location.port ? (":" + location.port) : "");
}

function getPathName() {
	var bizagiConfig = JSON.parse(sessionStorage.BizagiConfiguration);
	if (bizagiConfig && bizagiConfig.useEmptyAppName.IsValueCreated && bizagiConfig.useEmptyAppName.Value)
		return ""
	else if (bizagiConfig.app_name)
		return ("/" + bizagiConfig.app_name);
	else
		return ("/" + location.pathname.split("/")[1]);
}

//Changes the image  to plus or minus
function WPtoggleNode(imgControl){ //, useBAcurrentImage){
//	if (!useBAcurrentImage)
//		useBAcurrentImage = false;
	if (BAcurrentImage){// && !useBAcurrentImage){
		return;
	}
	
	getImageValues();
	if (!imgPlus || !imgMinus){
		alert ('debe incluir las imagenes para el arbol');
	}
	WPInnerControl = WPGetInnerControl (imgControl);
	if (!WPInnerControl){
		return;
	}
	// Unfold the branch if it isn't visible
	if (WPInnerControl.style.display == 'none')
	{
		// Change the image (if there is an image)
		if (WPInnerControl.innerHTML.length > 0)
		{				
			imgControl.src = imgMinus.src;
			BAcurrentImage = imgControl;
//			if (!useBAcurrentImage)
				window.setTimeout("EndWPToggleNode();",600);
		}
		WPInnerControl.style.display = 'block';
	}
	// Collapse the branch if it IS visible
	else
	{
		// Change the image (if there is an image)
		if (WPInnerControl.innerHTML.length > 0)
		{
			imgControl.src = imgPlus.src;			
		}

		WPInnerControl.style.display = 'none';
	}	
	
	var controlA = WPGetParentControl(imgControl, 'A');
	var idFolder = null;
	if (controlA.attributes["idFolder"]){
		idFolder = controlA.attributes["idFolder"].value;
	}
	if (idFolder){
		Set_Cookie('idFolder'+idFolder , WPInnerControl.style.display, 10000);
	}
}

	function Get_Cookie(name) { 
	   var start = document.cookie.indexOf(name+"="); 
	   var len = start+name.length+1; 
	   if ((!start) && (name != document.cookie.substring(0,name.length))) return null; 
	   if (start == -1) return null; 
	   var end = document.cookie.indexOf(";",len); 
	   if (end == -1) end = document.cookie.length; 
	   return unescape(document.cookie.substring(len,end)); 
	} 
	// This function has been slightly modified
	function Set_Cookie(name,value,expires,path,domain,secure) { 
		expires = expires * 60*60*24*1000;
		var today = new Date();
		var expires_date = new Date( today.getTime() + (expires) );
	    var cookieString = name + "=" +escape(value) + 
	       ( (expires) ? ";expires=" + expires_date.toGMTString() : "") + 
	       ( (path) ? ";path=" + path : "") + 
	       ( (domain) ? ";domain=" + domain : "") + 
	       ( (secure) ? ";secure" : ""); 
	    document.cookie = cookieString; 
	}

function WPtoggleInternalNode(imgControl){
		getImageValues();
		if (!imgPlus || !imgMinus){
			alert ('debe incluir las imagenes para el arbol');
		}

		WPInnerControl = WPGetInnerControl (imgControl);
		if (!WPInnerControl){
			return;
		}

		// Unfold the branch if it isn't visible
		if (WPInnerControl.style.display == 'none')
		{			
			imgControl.src = imgPlusE.src;
			// Change the image (if there is an image)
			if (WPInnerControl.innerHTML.length > 0)
			{				
				imgControl.src = imgPlusE.src;
			}
			WPInnerControl.style.display = 'block';
		}
	}
    
    function expandTree(){
		var imgTags = document.getElementsByTagName("img");
		for (var i = 0; i < imgTags.length ; i++)
		{
			var idFolder = null;
			if (imgTags[i].attributes["idFolder"]){
				idFolder = imgTags[i].attributes["idFolder"].value;
			}
			
			if (idFolder){
				var cookie = Get_Cookie('idFolder'+idFolder);
				if (cookie && cookie == "block"){
					WPtoggleInternalNode(imgTags[i]);
				}
			}
		}
	}