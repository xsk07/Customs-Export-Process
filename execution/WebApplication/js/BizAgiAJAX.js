//Calls bizagi AJAX URL. When the http result is loaded, then
//the call back function is executed with the http returned data
function callAjaxURL(url,callBackFunction,dynamicArgument) {
        var http_request = false;

		if (window.XMLHttpRequest) { // Mozilla, Safari,...
			http_request = new XMLHttpRequest();
			if (http_request.overrideMimeType) {
				http_request.overrideMimeType('text/xml');
			}
		} else if (window.ActiveXObject) { // IE
			try {
				http_request = new ActiveXObject("Msxml2.XMLHTTP");
			} catch (e) {
				try {
				http_request = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (e) {}
			}
		}

		if (!http_request) {
			alert('Giving up :( Cannot create an XMLHTTP instance');
			return false;
		}
		
		var readyStateChange = function() { 
				if (http_request.readyState==4) {
						//alert(http_request.responseText);
						if (callBackFunction)
							callBackFunction( http_request.responseText, dynamicArgument);
				}
		 };

		 if (callBackFunction) {
		     if (isFirefox && firefoxVersion > 3) {
		         http_request.onload = readyStateChange;
		     } else {
		         http_request.onreadystatechange = readyStateChange;
		     }
		 }
		 
		 var parameters = null;
		 if (url.indexOf("?") > -1){
			parameters = url.substring(url.indexOf("?") + 1);
			url = url.substring(0, url.indexOf("?"));
		}
		 //alert(url);
		 //alert(parameters);
		http_request.open('POST', url, true);
		//http_request.setRequestHeader("Content-type", "text/xml");
		http_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		//http_request.setRequestHeader("Content-length", parameters.length);
		//http_request.setRequestHeader("Connection", "close");
		http_request.send(parameters);
}

function callAjaxURL_NonAsynch(url) {
		var http_request = false;

		if (window.XMLHttpRequest) { // Mozilla, Safari,...
			http_request = new XMLHttpRequest();
			if (http_request.overrideMimeType) {
				http_request.overrideMimeType('text/xml');
			}
		} else if (window.ActiveXObject) { // IE
			try {
				http_request = new ActiveXObject("Msxml2.XMLHTTP");
			} catch (e) {
				try {
				http_request = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (e) {}
			}
		}

		if (!http_request) {
			alert('Giving up :( Cannot create an XMLHTTP instance');
			return false;
		}
		
		 
		 var parameters = null;
		 if (url.indexOf("?") > -1){
			parameters = url.substring(url.indexOf("?") + 1);
			url = url.substring(0, url.indexOf("?"));
		}
		 //alert(url);
		 //alert(parameters);
		http_request.open('POST', url, false);
		http_request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		http_request.setRequestHeader("Content-length", parameters.length);
		http_request.send(parameters);
}
