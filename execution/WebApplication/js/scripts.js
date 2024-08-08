//script determine if smartphone or desktop
var fileref = document.createElement("link");
fileref.setAttribute("rel", "stylesheet");
fileref.setAttribute("type", "text/css");

 if (/Android|webOS|iPhone|iPod|iPad|BlackBerry/i.test(navigator.userAgent))
 {

     if (navigator.userAgent.indexOf("iPad") >= 0)
     fileref.setAttribute("href", "../../css/defaultTablet.css");  
     else
     fileref.setAttribute("href", "../../css/defaultMobile.css");
     document.getElementsByTagName("head")[0].appendChild(fileref);
 }
 else 
 {
     fileref.setAttribute("href", "../../css/default.css");
     document.getElementsByTagName("head")[0].appendChild(fileref);
     
 } 


 function processExpression(expression) {
     var result = null;

     try {
         result = eval(expression);
     } catch (e) {
         console.log(e.toString());
     }

     return result;
 }


// *** Browser Type Detection
var isNav, isIE, isFirefox, firefoxVersion;
if (checkIsIE())
    isIE = true;
else
    isNav = true;

/*
* Method to detect IE visitors
*/
function checkIsIE() {
    var result = (navigator.appName.indexOf("Internet Explorer") > 0) ? true : ( checkIsIE11() ? true : false);
    return result;
};

/*
* Method to detect IE11 visitors
*/
function checkIsIE11() {
    return !!navigator.userAgent.match(/Trident\/7.0/) && !navigator.userAgent.match(/MSIE/i);
};

/*
* Returns ie version number, if is not, return -1
*/
function getIEVersion() {
    var result;

    if (checkIsIE()) {
        if (checkIsIE11())
            result = 11;
        else    
            result = Number(document.documentMode);
    }
    else
        result = -1;

    return result;
}

if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)){ //test for Firefox/x.x or Firefox x.x (ignoring remaining digits);
     firefoxVersion=new Number(RegExp.$1) // capture x.x portion and store as a number
     isFirefox = true;
}

// *** END Browser Type Detection

var bHideDropDowns = (getIEVersion() < 7) //true, for IE 6

// *** Disable right click script
/*
function clickIE()
{
	if (document.all)
		return false;
}

function clickNS(e)
{
	if (document.layers || (document.getElementById && !document.all))
		if (e.which == 2 || e.which == 3)
			return false;
}

if (document.layers)
{
	document.captureEvents(Event.MOUSEDOWN);
	document.onmousedown = clickNS;
}
else
{
	document.onmouseup = clickNS;
	document.oncontextmenu = clickIE;
}

document.oncontextmenu = new Function("return false")
*/
// *** END Disable right click script

if (history.length>0)
	history.go(+1);

/// *** Swap image functions
function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=[];
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}

function MM_findObj(n, d) { //v4.0
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && document.getElementById) x=document.getElementById(n); return x;
}

function MM_swapImage() { //v3.0
  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}

function MM_validateForm() { //v4.0
  var i,p,q,nm,test,num,min,max,errors='',args=MM_validateForm.arguments;
  for (i=0; i<(args.length-2); i+=3) { test=args[i+2]; val=MM_findObj(args[i]);
    if (val) { nm=val.name; if ((val=val.value)!="") {
      if (test.indexOf('isEmail')!=-1) { p=val.indexOf('@');
        if (p<1 || p==(val.length-1)) errors+='- '+nm+' debe contener una direccion de e-mail.\n';
      } else if (test!='R') {
        if (isNaN(val)) errors+='- '+nm+' debe contener un numero.\n';
        if (test.indexOf('inRange') != -1) { p=test.indexOf(':');
          min=test.substring(8,p); max=test.substring(p+1);
          if (val<min || max<val) errors+='- '+nm+' debe contener un numero entre '+min+' y '+max+'.\n';
    } } } else if (test.charAt(0) == 'R') errors += '- '+nm+' es requerido.\n'; }
  } if (errors) alert('Los siguientes errores ocurrieron:\n'+errors);
  document.MM_returnValue = (errors == '');
}

function MM_reloadPage(init) {  //reloads the window if Nav4 resized
  if (init==true) with (navigator) {if ((appName=="Netscape")&&(parseInt(appVersion)==4)) {
    document.MM_pgW=innerWidth; document.MM_pgH=innerHeight; onresize=MM_reloadPage; }}
  else if (innerWidth!=document.MM_pgW || innerHeight!=document.MM_pgH) location.reload();
}

/// ***** Dynamic Combo *****
// New R6
var CDidEnt = 0;
var CDidEntSK = 0;
var CDsParent = '';
var CDsChild = '';
var CDsFilter = '';
var CDsDisplayAttrib = '';
var CDsScope = 0;

function FillCD(CDData)
{
	combodata = GetObject(CDsChild);
	for (i=0; i<CDData.length; i++)
		combodata.options[combodata.length] = new Option(CDData[i][1], CDData[i][0]);
}

function changeCD(idEnt, sParent, sChild, sFilter, sDisplayAttrib, idScope)
{
	CDidEnt		        = idEnt;
	CDidEntSK	        = GetObject(sParent).options[GetObject(sParent).selectedIndex].value;
	CDsParent	        = sParent;
	CDsChild	        = sChild;
	CDsFilter	        = sFilter;
	CDsDisplayAttrib    = sDisplayAttrib;
	CDsScope            = idScope;

	if( isIE == true)
		document.frames["frcdload"].history.go(0);
	else
	{
		document.getElementById('frcdload').src = document.getElementById('frcdload').src;
	}

}

// Previous Functionality

/*
IsNumber

Purpose:
	Checks if the string is a number into the range specified.
	(used by date fields)
Parameters:
	objField: Form object (text) to be checked
	iMin: Min value
	iMax: Max value
	iNumDec: Number of decimal places accepted
	strFieldName: Friendly name of the field, used in the alert
		If objField is empty, uses strFieldName as the string to verify
Return data:
	True if the string is valid, False if not
*/
function IsNumber(objField,iMin,iMax,iNumDec,strFieldName)
{
	var strTest,strAlert;
	if (objField != "")
		strTest = new String(objField.value);
	else
		strTest = new String(strFieldName);

	if ((strTest == null) || (strTest.length == 0))
	    return false;

	var i = 0;
	var bResult = true;

	// Regular expression to check if the number is valid
	var strNumberPattern = /^([0-9]+)((\.|,)[0-9]+)*$/;
	var matchArray = strTest.match(strNumberPattern);

	if (matchArray == null)
	{
		strAlert = "El campo \"" + strFieldName + "\" es numerico. Por favor escriba el numero correctamente."
		bResult = false;
	}

	if (bResult)
	{
		// Checks decimal places
		iDot = strTest.indexOf(".");
		if (iDot > 0)
		{
			if (iNumDec > 0)
			{

				if (iDot < (strTest.length - iNumDec - 1))
				{
					// Too much decimal places
					strAlert = "El campo \"" + strFieldName + "\" solo acepta hasta " + iNumDec + " decimales.";
					bResult = false;
				}
				else
				{
					iTest = parseFloat(strTest);
				}
			}
			else
			{
				// No decimal places
				strAlert = "El campo \"" + strFieldName + "\" no acepta decimales.";
				bResult = false;
			}
		}
		else
		{
			// Trim leading zeroes
			if (strTest.length > 1 && strTest.charAt(0) == '0')
				strTest = strTest.substr(1,strTest.length);

			// Convert from string to integer
			iTest=parseInt(strTest);
		}
	}

	if (bResult && ((iTest < iMin) || (iTest > iMax)))
	{
		strAlert = "El numero escrito en el campo \"" + strFieldName + "\" debe estar entre " + iMin + " y " + iMax + ".";
		bResult = false;
	}

	// If objField is empty, don't display message
	if (!bResult && objField != "")
	{
		alert(strAlert);
		objField.focus();
		objField.select();
	}

	return bResult;
}

/*
changeOption

Purpose:
	Cambia los elementos de una lista dependiente
Parameters:
	sSrcList: Nombre de la lista origen
	sDestList: Nombre de la lista destino
	iFormIndex: Indice de la forma en la pagina
Return data:
	nada
Notes:
	Para que funcione correctamente es preciso construir la lista con el metodo RSDepListBox de la clase HTML
*/
function changeOption(sSrcList, sDestList, iFormIndex) {
	//Encontrar la longitud de los arreglos
    var iSrcArrLen = processExpression("arr" + sSrcList + ".length");
    var iDestArrLen = processExpression("arr" + sDestList + ".length");
	var iListLen = 0;

	//Encontramos el valor del elemento seleccionado
	var iSelValue = processExpression("document.forms[" + iFormIndex + "]." + sSrcList + ".options[document.forms[" + iFormIndex + "]." + sSrcList + ".selectedIndex].value")

	//Reiniciamos la longitud de la lista destino
	processExpression("document.forms[" + iFormIndex + "]." + sDestList + ".options.length = 0");

	//Recorremos el arreglo destino
	for (var i = 0; i < iDestArrLen; i++) {

		//Ubicar el campo deseado en el arreglo destino
	    if ((processExpression("arr" + sDestList + "[i][2] == '" + iSelValue + "'")) || (processExpression("arr" + sDestList + "[i][2] == '" + "'"))) {
	        processExpression("document.forms[" + iFormIndex + "]." + sDestList + ".options[iListLen] = new Option(" + "arr" + sDestList + "[i][0], " + "arr" + sDestList + "[i][1])");
			iListLen = iListLen + 1;
		}
	}

	//Si se creo la lista destino, seleccionamos el primer elemento
	if (iListLen > 0) {
	    processExpression("document.forms[" + iFormIndex + "]." + sDestList + ".options[0].selected = true");
	}
}

/**
* La misma funcion de arriba pero se puede escoger el campo por el cual comparar
**/
function changeOption2(sSrcList, sDestList, iFormIndex, iSrcComp, iDestComp) {
	//Encontrar la longitud de los arreglos
    var iSrcArrLen = processExpression("arr" + sSrcList + ".length");
    var iDestArrLen = processExpression("arr" + sDestList + ".length");
	var iListLen = 0;

	//Encontramos el indice del elemento seleccionado
	var iSelIndex = processExpression("document.forms[" + iFormIndex + "]." + sSrcList + ".selectedIndex")

	//Reiniciamos la longitud de la lista destino
	processExpression("document.forms[" + iFormIndex + "]." + sDestList + ".options.length = 0");

	//Recorremos el arreglo destino
	for (var i = 0; i < iDestArrLen; i++) {

		//Ubicar el campo deseado en el arreglo destino
	    if ((processExpression("arr" + sDestList + "[i][" + iDestComp + "] == arr" + sSrcList + "[" + iSelIndex + "][" + iSrcComp + "]")) || (processExpression("arr" + sDestList + "[i][" + iDestComp + "] == '" + "'"))) {
	        processExpression("document.forms[" + iFormIndex + "]." + sDestList + ".options[iListLen] = new Option(" + "arr" + sDestList + "[i][0], " + "arr" + sDestList + "[i][1])");
			iListLen = iListLen + 1;
		}
	}

	//Si se creo la lista destino, seleccionamos el primer elemento
	if (iListLen > 0) {
	    processExpression("document.forms[" + iFormIndex + "]." + sDestList + ".options[0].selected = true");
	}
}

/* Funcion que despliega una ventana de confirmacion */
function confirmWindow(mensaje) {
	document.returnValue = confirm(mensaje);
}

/* Funcion que envia una forma */
function sendForm(intNumForma) {
	document.forms[intNumForma].submit();
}

/* Funcion que limpia una forma */
function resetForm(intNumForma) {
	document.forms[intNumForma].reset();
}

/* Funcion que despliega una ventana */
function openWindow(url, w, h, scrollbar, menubar, toolbar) {
	var iMyWidth;
	var iMyHeight;
	iMyWidth = (window.screen.width/2) - ((w/2) + 5);
	iMyHeight = (window.screen.height/2) - (h/2);
	var win2 = window.open(url,'Bancafe','scrollbars=' + scrollbar + ',menubar=' + menubar + ',toolbar=' + toolbar + ',status=0,height=' + h + ',width=' + w + ',resizable=no,left=' + iMyWidth + ',top=' + iMyHeight + ',screenX=' + iMyWidth + ',screenY=' + iMyHeight);
	win2.focus();
}

/* Funcion que despliega una ventana Modal */
function openWindowModal(url, w, h, scrollbar, menubar, toolbar) {
	var iMyWidth;
	var iMyHeight;
	iMyWidth = (window.screen.width/2) - ((w/2) + 5);
	iMyHeight = (window.screen.height/2) - (h/2);
	var win2 = null;
	var result = null;
	if (isIE){
		result = window.showModalDialog(url,window,'dialogHeight:'+h+'px;dialogWidth:'+w+'px;scroll:'+scrollbar+';status:0;');
	}
	else{
		win2 = window.open(url,'Bizagi','scroll:' + scrollbar + ';menubar:' + menubar + ';toolbar:' + toolbar + ';status:0;dialogHeight:' + h + ';dialogWidth:' + w + ';resizable:no;left=' + iMyWidth + ',top=' + iMyHeight + ',screenX=' + iMyWidth + ',screenY=' + iMyHeight);
	}
	if (win2 != null && typeof(win2) != 'undefined'){
		win2.focus();
	}
	return result;
}

/* Funciones usadas en las mascaras de los elementos en las formas */
function mOvr(src,clrOver) {
  if (!src.contains(event.fromElement)) {
    src.style.cursor = 'hand';
    src.bgColor = clrOver;
  }
}
function mOut(src,clrIn) {
  if (!src.contains(event.toElement)) {
    src.style.cursor = 'default';
    src.bgColor = clrIn;
  }
}
function mClk(src) {
  if(event.srcElement.tagName=='TD'){
    src.children.tags('A')[0].click();
  }
}

// selecciona el elemento de una lista correspondiente a un valor determinado
function combosearch(oSource, oTarget) {
	for (var i = 0; i < oTarget.options.length; i++) {
		if (oTarget.options[i].value == oSource.value) {
			oTarget.selectedIndex = i;
			break;
		}
	}
}

/* Funciones usadas para manejar la validacion de la forma magica*/
function GetValue(strField)
{
   	var arrElements = document.getElementsByName(strField);
	if (arrElements.length > 0) {
		if (arrElements.length > 1 && arrElements.item(0).type == "radio") {
			// Radio button: loop to return checked element's value
			for (elemIdx = 0; elemIdx < arrElements.length; elemIdx++)
				if (arrElements.item(elemIdx).checked)
					return arrElements.item(elemIdx).value;

			// No one is checked
			return "";
		} else {
			// Any other element
			return arrElements.item(0).value;
		}
	}

	var arrayH = document.getElementsByName("h_" + strField);
    if (arrayH.length > 0)
            return arrayH.item(0).value;

	var arrayT = document.getElementsByName("T_" + strField);
	if (arrayT.length > 0)
        return arrayT.item(0).value;


	var arrayJsf = document.getElementsByClassName("jsf" + strField);
	if (arrayJsf.length > 0)
		return arrayJsf.item(0).value;

	return "0";
}

/* Obtiene la representacion String de un objeto tipo Date. Necesario para comparaciones entre fechas */
function getDateString(bUseHour){
	var dateStr;
	if (bUseHour == null){
	    bUseHour= true;
	}
	if(isNaN(this.getDate()))
		dateStr = "000000000000";
	else
	{
		dateStr = "" + this.getFullYear();
		if (this.getMonth() < 9)
			dateStr += "0";
		dateStr +=  (this.getMonth() + 1);
		if (this.getDate() < 10)
			dateStr += "0";
		dateStr += this.getDate();
		if (bUseHour){
			if (this.getHours() <10)
				dateStr += "0";
			dateStr += this.getHours();
		}
		else{
			dateStr +="00";
		}
		if (bUseHour){
			if (this.getMinutes() <10)
				dateStr += "0";
			dateStr += this.getMinutes();
		}
		else{
			dateStr +="00";
		}

	}
	return dateStr;
}

// Registra la funcion getDateString como metodo del tipo Date
Date.prototype.getDateString = getDateString;




function GetTypedValue(strField)
{
	var obj = GetObject(strField);
	var oValue;

	if (obj != null && obj.value != null)
	{
	    oValue = obj.value;
	}
	else
	{
	    oValue  = GetValue(strField);
	}

	if (obj && obj.getAttribute)
	{
	    preset = obj.getAttribute("preset");
	}
	else if (obj && obj.length)
	{
	    //It mus be an array
	    preset = obj[0].getAttribute("preset");
	}
	else
	{
	    // not found
	    return oValue;
	}
	return FormatValue(oValue, preset);
}

function FormatValue(oValue, strType)
{
	switch (strType)
	{
		case "shortdate":
			if(oValue == "") {
			    oDate = new Date(oValue);
			} else{
				oValue = oValue.toString().replace("a.m.", "AM"); //a.m. format is not allowed in VBScript
				oValue = oValue.toString().replace("p.m.", "PM");

				oDate = getDateFromFormat(oValue, BA_DATE_FORMAT_MASK, false);
			}
			if (oDate.getDateString){
				return oDate.getDateString();
			}
			else{
			    // Try with date + time format
			    oDate = getDateFromFormat(oValue, BA_DATE_FORMAT_MASK + " " + BA_TIME_FORMAT_MASK, true);
			    if (oDate.getDateString){
				    return oDate.getDateString(false);
			    }
			    else {
				    return "";
				}
			}

		case "shortdatetime":
			if(oValue == "")
				oDate = new Date(oValue);
			else{
				oValue = oValue.toString().replace("a.m.", "AM"); //a.m. format is not allowed in VBScript
				oValue = oValue.toString().replace("p.m.", "PM");

				oDate = getDateFromFormat(oValue, BA_DATE_FORMAT_MASK + " " + BA_TIME_FORMAT_MASK);
			}
			return oDate.getDateString();

		case "bigint":
		case "int":
		case "smallint":
		case "tinyint":
			return parseInt(oValue);

		case "decimal":
		case "numeric":
		case "float":
		case "real":
		case "number":
			// replaces commas in string so values are good
			return oValue != null ? parseFloat(oValue.replace(new RegExp(",", "g"), ".")) : NaN;

		case "currency":
			if(oValue != null)
			{
				//eliminates group separator
				var grpSep = BA_GROUP_SEPARATOR.toString() == "." ? /\./g : new RegExp(BA_GROUP_SEPARATOR.toString(), "g") ;
				var oValue1 = oValue.toString().replace(grpSep, "");

				// replaces commas in string so values are good
				return parseFloat(oValue1.replace(new RegExp(",", "g"), "."));
			}
			else
				return NaN;

		default:
			return oValue != null ? oValue.toString() : null;
	}
}

function SetValue(strField, strValue)
{
	if (document.getElementsByName(strField).length > 0)
		document.getElementsByName(strField).item(0).value = strValue;

	else if (document.getElementsByName("T_" + strField).length > 0)
		document.getElementsByName("T_" + strField).item(0).value = strValue;

	else
		alert("SetValue Error, Field '" + strField + "' not found.")

	return;
}

//Used only by combo
function ForceSetValue(strField, strValue)
{
    var bElementExist = false;
    
    for(i=0;i<document.getElementsByName(strField).item(0).length;i++)
    {
        if(document.getElementsByName(strField).item(0).options(i).value == strValue)
        {
            bElementExist = true;
            break;
        }
    }
    
	if (bElementExist)
		SetValue(strField, strValue);
	else
	{
	    var elOptNew = document.createElement('option');
        elOptNew.text = "";
        elOptNew.value = strValue;
        var elSel = document.getElementsByName(strField).item(0);

        try {
            elSel.add(elOptNew, null); // standards compliant; doesn't work in IE
        }
        catch(ex) {
            elSel.add(elOptNew); // IE only
        }
        
	    SetValue(strField, strValue);
	}	

	return;
}

function SetFocus(obj)
{
	objFocus = GetObject(obj);
	if (objFocus.length > 1)
	{
		objFocus = objFocus[0];
	}

	if ((objFocus.style.display == "block" || objFocus.style.display == "") && objFocus.type != "hidden")
	{
		objFocus.focus();
	}

	return;
}

function GetCheckObject(obj)
{
	var oElem = null;

	if (document.getElementsByName(obj).length > 0) {
		oElem = document.getElementsByName(obj);
		if (oElem.length == 1)
			return oElem.item(0);

		else
			for (var i = 0; i < oElem.length; i++) {
				if(oElem.item(i).type == "checkbox")
					return oElem.item(i);
			}
	}
}

function GetObject(obj)
{
	var oElem = null;

	if (document.getElementsByName("T_" + obj).length > 0) {
		oElem = document.getElementsByName("T_" + obj);
		if (oElem.length > 1)
			return oElem;
		else
			return oElem.item(0);

	} else if (document.getElementsByName(obj).length > 0) {
		oElem = document.getElementsByName(obj);
		if (oElem.length > 1)
			return oElem;
		else
			return oElem.item(0);
	} else if (document.getElementsByName("h_" + obj).length > 0) {
		oElem = document.getElementsByName("h_" + obj);
		if (oElem.length > 0)
			return oElem.item(0);
		else
			return oElem;
	} else if (document.getElementById("T_" + obj)) {
		oElem = document.getElementById("T_" + obj);
		return oElem;

	} else if (document.getElementById(obj)) {
		oElem = document.getElementById(obj);
		return oElem;

	} else if (document.getElementById("h_" + obj)) {
		oElem = document.getElementById("h_" + obj);
		return oElem;

	} else if (document.getElementById("h_JSDD_" + obj)) {
		oElem = document.getElementById("h_JSDD_" + obj);
		return oElem;

	} else if (document.getElementById("h_BAC_" + obj)) {
		oElem = document.getElementById("h_BAC_" + obj);
		return oElem;

    }
    /* 
    else if (document.getElementsByClassName != null && document.getElementsByClassName("jsf" + obj).length > 0) {
        oElem = document.getElementsByClassName("jsf" + obj);
		if (oElem.length > 1)
			return oElem;
		else
			return oElem[0];
	}
	*/ 
	else {
		return oElem;
	}
}

function SetErrorMsg(str)
{
	EnableWizzard(true);
	setHelp(document.sDefHelpTitle, str, 3);
	return;
}

// ***** Group Functions ******
var garrLayoutParts = [];
var arrParts = new Array("HPFrameDL");
var blnBorder = false;
var bImgCurve = false;

function showHideContent(id, event)
{

	var bOn = false;
	var bMO = false;
	var oContent = document.getElementById(id + "Content");

	var oImage   = document.getElementById(id + "Tab1");

	if (!oContent || !oImage) return;

	bOn = (oContent.style.display.toLowerCase() == "none");

	if (bOn == false)
	{
		oContent.style.display = "none";
		oContent.className = "groupHidden";
	}
	else
	{
		oContent.style.display = "";
		oContent.className = "";
	}

	for (var i = 0; i < garrLayoutParts.length; i++)
	{
		if (id == garrLayoutParts[i].name)
			garrLayoutParts[i].state = bOn ? "EXPAND" : "COLLAPSE";
	}
}

function setBorder(id,bOn)
{
    var oRightImg   = document.getElementById(id + "Tab1");
    var oBorder = document.getElementById(id + "Content");

    if (!oRightImg || !oBorder){
        return;
    }
    var isCollapsed = oBorder.style.display == "none";
    if (bOn)
	{
	    if (!isCollapsed){
		    oRightImg.src    = "../../img/WorkPortal/RightGroupExpOver.jpg";
		}
		else{
		    oRightImg.src    = "../../img/WorkPortal/RightGroupOver.jpg";
		}
	}
	else{
	    if (!isCollapsed){
		    oRightImg.src    = "../../img/WorkPortal/RightGroupExp.jpg";
		}
		else{
		    oRightImg.src    = "../../img/WorkPortal/RightGroup.jpg";
		}

	}
    return;
	var oTab    = document.getElementById(id + "Tab");
	var oTab1   = document.getElementById(id + "Tab1");
	var oTab2   = document.getElementById(id + "Tab2");
	var oTab3   = document.getElementById(id + "Tab3");
	var oBorder = document.getElementById(id + "Content");

	if (!oTab || !oTab1 || !oTab2 || !oTab3 || !oBorder)
		return;

	if (bOn)
	{
		oTab.className = "PropGroupMO";
		oTab2.className = "PropGroupMO";
		oTab1.src    = "../../img/separador/curve_mo.gif";
		if (oBorder.style.display == "none")
			oTab3.src = "../../img/separador/expand_mo.gif";
		else
			oTab3.src = "../../img/separador/collapse_mo.gif";
	}
	else
	{
		oTab.className = "PropGroup";
		oTab2.className = "PropGroup";
		oTab1.src	 = "../../img/separador/curve.gif";

		if (oBorder.style.display == "none")
			oTab3.src = "../../img/separador/expand.gif";
		else
			oTab3.src = "../../img/separador/collapse.gif";
	}
}
function BAHideGroup(id)
{
	var oTab = document.getElementById(id + "Tab");
	var oContent = document.getElementById(id + "Content");
	if (oTab && oContent) {
	    oTab.style.display = "none";
	    oContent.style.display = "none";
	    oContent.className = "groupHidden";

	    //When the group is hidden, the render are not required
	    var oTable = oContent.childNodes[0];
	    if(oContent.childNodes.length > 1)
	        oTable = oContent.childNodes[0].childNodes[0];
	     	    
	    for (var i=0; i<oTable.rows.length; i++){
		    if (typeof(oTable.rows[i].name) != "undefined"){
			    SetRenderAppearanceByElement(oTable.rows[i],false,false,"");			    
		    }
	    }
	}
}

function BAShowGroup(id)
{
	var oTab = document.getElementById(id + "Tab");
	var oContent = document.getElementById(id + "Content");
	if (oTab && oContent) {
	    oTab.style.display = "";
	    oContent.style.display = "";
	    oContent.className = "";

	    //reset the apparience of the group
	    var oTable = oContent.childNodes[0];
	    if(oTable.childNodes.length > 1)
	        oTable = oTable.childNodes[1].childNodes[0].childNodes[0].childNodes[0];

	    for (var i=0; i<oTable.rows.length; i++){
		    if (typeof(oTable.rows[i].name) != "undefined"){
			    ResetRenderAppearance(oTable.rows[i].name.substring(3));
		    }
	    }
	}
}

function BAExpandGroup(id)
{
	var oContent = document.getElementById(id + "Content");
	if (oContent && oContent.style.display.toLowerCase() == "none")
	{
		showHideContent(id);
	}
}

function BACollapseGroup(id)
{
	var oContent = document.getElementById(id + "Content");
	if (oContent && oContent.style.display.toLowerCase() != "none")
	{
		showHideContent(id);
	}
}

function fieldFocus(){
	BASetFocus("BAFocus");
}

// Flag used to check if page already finished loading
var bLoadComplete = false;

function BAonload()
{
	initFloaters();

	BAonloadNoWizard();
}

function BAonloadNoWizard()
{
	if (document.getElementById('BackgroundTxt') != null)
		document.getElementById('BackgroundTxt').style.visibility = 'visible';
	if (document.getElementById('BackgroundImg') != null)
		document.getElementById('BackgroundImg').style.visibility = 'visible';

	var oTabContents = document.getElementById("xpTab1");
	if (oTabContents != null)
		LoadTabs();

	BAVerifyBehavior();

	// Calls script code for behaviours and actions
	if (window.BAExecuteBehavioursAndActions)
	{
		BAExecuteBehavioursAndActions();
	}

	bLoadComplete = true;

	setTimeout(fieldFocus, 200);
}

function BASetFocus(Element)
{
	var divElementChild = GetObject(Element);

	if (!divElementChild)
		return;

	if (divElementChild.length > 1)
		divElementChild = divElementChild[0];

	if ((divElementChild.style.display == "block" || divElementChild.style.display == "") && divElementChild.type != "hidden")
	{
		var divElement = divElementChild.parentNode;
		var tabHidden = false;
		var tabName = "";
		var groupHidden = false;
		var groupName = "";
		while (divElement != null  && (divElement.style.visibility == "inherit" ||divElement.style.visibility == "") && !tabHidden && !groupHidden)
		{
			if(divElement.id.toString().indexOf("xpTab") == 0)
			{
				tabName = divElement.id.toString();
			}
			if(divElement.className.toString() == "groupHidden")
			{
				groupHidden = true;
				groupName = divElement.id.toString();
			}
			divElementChild = divElement;
			divElement = divElement.parentNode;
			if (typeof(divElement.id) == "undefined"){
				break;
			}

		}
		// Tab
		if (document.getElementById("xpTab1") != null){
			var iTab = 0;
			if (tabName != null && tabName.length > 0)
				iTab = tabName.substr(5)-1;

			ChangeTab(iTab);
		}
		// Group
		if (groupHidden)
			document.getElementById(groupName).style.display = "";

		// Element
		SetFocus(Element);
	}
}

function BAIsBlank(Element)
{
	var oValue = GetValue(Element);
	return oValue == null || oValue.toString().length == 0;
}
function BAIsInvalidEmail(Element){
    var strMail = GetValue(Element);
	if (strMail == '' || /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(strMail))
		return false;
    else
		return true;
}
function BAContainsString(Element, searchString)
{
	var oValue = GetValue(Element)
	if (oValue != null && searchString != null)	{
		return oValue.toString().indexOf(searchString) >= 0;
	} else {
		return false;
	}
}

function BABeginString(Element, searchString)
{
	var oValue = GetValue(Element)
	if (oValue != null && searchString != null)	{
		return oValue.toString().substr(0, searchString.length) == searchString;
	} else {
		return false;
	}
}

function BAIsChecked(Element)
{
	return GetObject(Element).value == 1;
}

function BAYesSelected(Element)
{
	arrElements = document.getElementsByName(Element);
	if (arrElements.length == 2 && arrElements.item(0).type == "radio") {
		return arrElements.item(0).checked;
	} else {
		return GetObject(Element).value == 'True';
	}
}

function BANoSelected(Element)
{
	arrElements = document.getElementsByName(Element);
	if (arrElements.length == 2 && arrElements.item(0).type == "radio") {
		return arrElements.item(1).checked;
	} else {
		return GetObject(Element).value == 'False';
	}
}

function BAIsTrue(Element)
{
	var oValue = GetValue(Element);
	return (oValue != null && (oValue == "1" || oValue == "True"));
}

function BAIsFalse(Element)
{
	var oValue = GetValue(Element);
	return (oValue != null && (oValue == "0" || oValue == "False"));
}

function BAFileUploaded(Element)
{
	return GetValue("h_BAC_" + Element) > 0;
}

function BALetterEdited(Element) {
    var letterCache = GetValueOnCache("h_LP_" + Element);
    var result;

    if ((letterCache != null) && (letterCache == '1')) {
        result = true;
    }
    else {
        result = GetValue("h_LP_" + Element) > 0;
    }

    return result;
}

function BANow(bUseHour)
{
	if (bUseHour == null){
	   bUseHour = false;
	}
	return new Date().getDateString(bUseHour);
}

function BADate(year, month, day)
{
    var oDate = new Date();
    oDate.setFullYear(year);
    oDate.setMonth(month - 1);
    oDate.setDate(day);
    oDate.setHours(0);
    oDate.setMinutes(0);
    oDate.setSeconds(0);
    oDate.setMilliseconds(0);

	return oDate.getDateString();
}

function BAonclick(event)
{
}

function SetRenderAppearance(sElement, bShow, bBold, color)
{
	SetRenderAppearance(sElement, bShow, bBold, color, false)
}

function ResetRenderAppearance(sElement)
{
	SetRenderAppearance(sElement, null, null, null, true)
}

function SetRenderAppearance(sElement, bShow, bBold, color, bReset)
{
    arrElements = document.getElementsByName("RR_" + sElement);
    SetRenderAppearanceByElement(arrElements, bShow, bBold, color, bReset);
}

function SetRenderAppearanceByElement(arrElements, bShow, bBold, color, bReset)
{
	for (iElemIdx = 0; iElemIdx < arrElements.length; iElemIdx++)
	{
		element = arrElements.item(iElemIdx);

		if (!bReset)
		{
			element.style.display = bShow ? "" : "none";
		}
		else
		{
			element.style.display = "";
		}

		switch (element.tagName)
		{
			case "TR":
				for (iCellIdx = 0; iCellIdx < element.cells.length; iCellIdx++)
				{
					cell = element.cells.item(iCellIdx);
					SetElementAppearance(cell, bBold, color, bReset);
					SetChildrenAppearance(cell, bBold, color, bReset, true);
				}

				break;

			case "TD":
				SetElementAppearance(element, bBold, color, bReset);
				SetChildrenAppearance(element, bBold, color, bReset);

				break;
		}
	}
}

function SetChildrenAppearance(element, bBold, color, bReset)
{
    SetChildrenAppearance(element, bBold, color, bReset, false);
}

function SetChildrenAppearance(element, bBold, color, bReset, bRecursive)
{
	for (var iChildrenIdx = 0; iChildrenIdx < element.childNodes.length; iChildrenIdx++)
	{
		SetElementAppearance(element.childNodes[iChildrenIdx], bBold, color, bReset)
		if(bRecursive)
            SetChildrenAppearance(element.childNodes[iChildrenIdx], bBold, color, bReset, true);
	}
}

function SetElementAppearance(element, bBold, color, bReset)
{
	// Changes color
	if(element.style)
		element.style.color = !bReset ? color : "";


	if (IsInputElement(element))
	{
		if (!bReset)
		{
			// Sets required property
			// On validation, this property is reviewed in order to perform validation
			//if(element.BARequired)
				element.BARequired = bBold;

		}
		else
		{
			// When resetting, clears property
			if(element.BARequired)
				element.BARequired = null;

		}
	}
	else
	{
		if (!bReset)
		{
			// Sets bold property (for labels)
			if(element.style)
				element.style.fontWeight = bBold ? "bold" : "normal";
		}
		else
		{
			// Resets bold property
			if(element.style)
				element.style.fontWeight = "";
		}
	}
}

function IsInputElement(element)
{
	// Checks if element is input that can be validated
	return	element.type == "text"  || element.type == "textarea" || element.type == "select-one" ||
			element.type == "radio" || element.type == "checkbox" || element.type == "hidden";


}

function SetGroupAppearance(sGroup, bShow, bCollapse)
{
	if (bShow)
	{
		BAShowGroup(sGroup);

		if (bCollapse)
		{
			BACollapseGroup(sGroup);
		}
		else
		{
			BAExpandGroup(sGroup);
		}
	}
	else
	{
		BAHideGroup(sGroup);
	}
}


function ResetGroupAppearance(sGroup)
{
	SetGroupAppearance(sGroup, true, false);
}

function BARequiredBvrAct(sElement, bRequiredInForm)
{
	var element = GetObject(sElement);
	//Radio renders (including Yes-No)
	if (element.tagName == null && element.length > 1 && element[0].type == "radio")
	{
		element = element[0];
	}
	if (element.BARequired == null)
	{
		// property not set
		return bRequiredInForm;
	}
	else
	{
		// returns value of property (dinamically added in SetElementAppearance())
		return element.BARequired == true;
	}
}

// Function called when render value changes (for behaviours and actions)
function BARenderValueChanged()
{
	if (!bLoadComplete)
		return;

	if (
			event.propertyName == "value" ||
			(
				event.srcElement.type == "radio" &&
				event.propertyName == "checked" &&
				event.srcElement.checked
			)
		)
	{
		// Calls script code for behaviours and actions
		if (window.BAExecuteBehavioursAndActions)
		{
			BAExecuteBehavioursAndActions();
		}
	}
}

// XPTabs
var TabTableStart, TabTableEnd, TabActiveLeftSingle, TabActiveRightSingle, TabActiveLeftCouple, TabActiveRightCouple, TabInactiveLeft, TabInactiveRight, TabActiveLabelPart1, TabActiveLabelPart2, TabInactiveLabelPart1, TabInactiveLabelPart2, TabInactiveLabelPart3;
function LoadVars() {
	var sPathToBase = "../../";

	if (typeof(BA_PATH_TO_BASE) != 'undefined')
		sPathToBase = BA_PATH_TO_BASE;

	TabTableStart = "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td class=\"old-render-tab start-tab\" width=\"5\"><img src=\"" + sPathToBase + "img/xp/tabs/tab_tile.gif\" width=\"5\" height=\"27\" border=\"0\"></td>\n";
	TabTableEnd = "<td class=\"old-render-tab end-tab\" width=\"100%\" background=\"" + sPathToBase + "img/xp/tabs/tab_tile.gif\"><img src=\"" + sPathToBase + "img/xp/tabs/tab_tile.gif\" width=\"1\" height=\"27\" border=\"0\"></td></tr></table>\n";

	TabActiveLeftSingle = "<td class=\"old-render-tab\" width=\"5\"><img src=\"" + sPathToBase + "img/xp/tabs/tab_active_left_single.gif\" width=\"5\" height=\"27\" border=\"0\"></td>\n";
	TabActiveRightSingle = "<td class=\"old-render-tab\" width=\"5\"><img src=\"" + sPathToBase + "img/xp/tabs/tab_active_right_single.gif\" width=\"5\" height=\"27\" border=\"0\"></td>\n";
	TabActiveLeftCouple = "<td class=\"old-render-tab\" width=\"5\"><img src=\"" + sPathToBase + "img/xp/tabs/tab_active_left_couple.gif\" width=\"5\" height=\"27\" border=\"0\"></td>\n";
	TabActiveRightCouple = "<td class=\"old-render-tab\" width=\"5\"><img src=\"" + sPathToBase + "img/xp/tabs/tab_active_right_couple.gif\" width=\"5\" height=\"27\" border=\"0\"></td>\n";

	TabInactiveLeft = "<td class=\"old-render-tab inactive-tab\" width=\"4\"><img src=\"" + sPathToBase + "img/xp/tabs/tab_inactive_left.gif\" width=\"4\" height=\"27\" border=\"0\"></td>\n";
	TabInactiveRight = "<td class=\"old-render-tab inactive-tab\" width=\"4\"><img src=\"" + sPathToBase + "img/xp/tabs/tab_inactive_right.gif\" width=\"4\" height=\"27\" border=\"0\"></td>\n";

	TabActiveLabelPart1 = "<td class=\"old-render-tab\" style=\"cursor:pointer;\" background=\"" + sPathToBase + "img/xp/tabs/tab_active_tile.gif\"><img src=\"" + sPathToBase + "img/xp/shim.gif\" width=\"1\" height=\"5\" border=\"0\"><small><font color=\"#282211\"><nobr>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
	TabActiveLabelPart2 = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</nobr></font></small></td>\n";

	TabInactiveLabelPart1 = "<td class=\"old-render-tab inactive-tab\" style=\"cursor:pointer;\" onclick=\"ChangeTab(";
	TabInactiveLabelPart2 = ")\" background=\"" + sPathToBase + "img/xp/tabs/tab_inactive_tile.gif\"><img src=\"" + sPathToBase + "img/xp/shim.gif\" width=\"1\" height=\"7\" border=\"0\"><small><font color=\"#5C584A\"><nobr>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
	TabInactiveLabelPart3 = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</nobr></font></small></td>\n";
}

var TabHTMLString = TabTableStart;
var BAUseDefaultBizagiTab = false;

function DrawTabs() {
	if (!BAUseDefaultBizagiTab){
		for (var i=0;i<TabNames.length;i++) {
			var TabNum = i - 0;
			if (TabNum == CurrentTab) {
				if ((TabNum + 1) == CurrentTab) {
					TabHTMLString += TabActiveLeftSingle;
				} else {
					if (TabNum == 0) {
						TabHTMLString += TabActiveLeftSingle;
					} else {
						TabHTMLString += TabActiveLeftCouple;
					}
				}
				TabHTMLString +=  TabActiveLabelPart1 + TabNames[i] + TabActiveLabelPart2;
				if ((TabNum - 1) == CurrentTab) {
					TabHTMLString += TabActiveRightSingle;
				} else {
					if (TabNum == (TabNames.length - 1)) {
						TabHTMLString += TabActiveRightSingle;
					} else {
						TabHTMLString += TabActiveRightCouple;
					}
				}
			} else {
				if ((TabNum - 1) != CurrentTab) {
					TabHTMLString += TabInactiveLeft;
				}
				TabHTMLString += TabInactiveLabelPart1 + i + TabInactiveLabelPart2 + TabNames[i] + TabInactiveLabelPart3;
				if ((TabNum + 1) != CurrentTab) {
					TabHTMLString += TabInactiveRight ;
				}
			}
		}
		TabHTMLString += TabTableEnd;
		TabHTML.innerHTML = TabHTMLString;
	}
}

function getCurrentTab(){
	return CurrentTab;
}
function ChangeTab(TabNum) {
	CurrentTab = TabNum;
	TabHTMLString = TabTableStart;

	if(typeof (IsCalendarVisible) != "undefined")
	{
		if (IsCalendarVisible)
			hideCalendar();
	}
	
	var focusTab = document.getElementById("h_BAFocusTab");
	if(focusTab)
	    SetValue("h_BAFocusTab",TabNum);

	DrawTabs();
	for (var i=0;i<TabNames.length;i++) {
	    processExpression("if(xpTab" + (i - 0 + 1) + ".style) { xpTab" + (i - 0 + 1) + ".style.display = 'none'; }");
	}
	processExpression("if(xpTab" + (TabNum - 0 + 1) + ".style) { xpTab" + (TabNum - 0 + 1) + ".style.display = ''; }");
}

function LoadTabs() {
	for (var i=0; i<TabNames.length;i++) {

	    processExpression("if(xpTab" + (i - 0 + 1) + ".style) { xpTab" + (i - 0 + 1) + ".style.display = 'none'; }");

	}
	LoadVars();
	TabHTMLString = TabTableStart;
	DrawTabs();
	ChangeTab(DefaultTab);
}

// ***** Validation Functions *****
function CheckDateFormat(sTest, bMago)
{
	// Do nothing if empty
	if (sTest.length == 0)
	{
		return true;
	}

	var arrMonths, bResult, sAlert, sDatePattern, arrDateParts

	//arrMonths = new Array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' );
	arrMonths = [BA_JAN_L, BA_FEB_L, BA_MAR_L, BA_APR_L, BA_MAY_L, BA_JUN_L, BA_JUL_L, BA_AUG_L, BA_SEP_L, BA_OCT_L, BA_NOV_L, BA_DEC_L ];
	bResult = true;

	var myDate = new Date(sTest);



	sDatePattern = /^([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{4})$/;
	arrDateParts = sTest.match(sDatePattern);

	if (arrDateParts == null)
	{
		sAlert = HTMLEncodeText(BA_DATE_INVALID);//"El formato de la fecha es inválido. Escriba la fecha con formato mm/dd/aaaa.";
		bResult = false;
	}
	else
	{
		iMonth = arrDateParts[1];
		iDay = arrDateParts[2];
		iYear = arrDateParts[3];
	}

	// Verifies values
	if ( bResult && (!IsNumber("",1,31,0,iDay) || !IsNumber("",1,12,0,iMonth) || !IsNumber("",1901,2099,0,iYear)) )
	{
		sAlert = BA_DATE_VALID;//"Verifique los valores de mes, día y año. El formato de la fecha debe ser mm/dd/aaaa.";
		bResult = false;
	}

	// Verifies month and day are consistent
	if (bResult && (iMonth == 4 || iMonth == 6 || iMonth == 9 || iMonth == 11) && (iDay > 30))
	{
		sAlert = BA_DATE_ERR + arrMonths[iMonth - 1]; //"El valor del día (" + iDay + ") no corresponde con el valor del mes (" + arrMonths[iMonth - 1] + ")."
		bResult = false;
	}

	if (bResult && iMonth == 2)
	{
		var iMax;
		iMax = (iYear % 4 == 0) ? 29 : 28;
		if (iDay > iMax)
		{
			sAlert = BA_DATE_ERR + arrMonths[iMonth - 1]; // "El valor del día (" + iDay + ") no corresponde con el valor del mes (" + arrMonths[iMonth - 1] + ")."
			bResult = false;
		}
	}

	// Show message
	if (!bResult)
	{
		if(bMago)
		{
			setHelp("", HTMLEncodeText(sAlert), 3);
		}
		else
		{
			alert(sAlert);
		}
	}

	return bResult;
}

function HTMLEncodeText(strText)
{
	return strText;

	strNew = strText;

	strNew = strNew.replace("á", "&aacute;");
	strNew = strNew.replace("é", "&eacute;");
	strNew = strNew.replace("í", "&iacute;");
	strNew = strNew.replace("ó", "&oacute;");
	strNew = strNew.replace("ú", "&uacute;");
	strNew = strNew.replace("ñ", "&ntilde;");

	strNew = strNew.replace("Á", "&Aacute;");
	strNew = strNew.replace("É", "&Eacute;");
	strNew = strNew.replace("Í", "&Iacute;");
	strNew = strNew.replace("Ó", "&Oacute;");
	strNew = strNew.replace("Ú", "&Uacute;");
	strNew = strNew.replace("Ñ", "&Ntilde;");

	return strNew;
}

function YesNoChecked(Element)
{
	return !GetObject(Element)[0].checked && !GetObject(Element)[1].checked;
}

function YesNoValue(Element)
{
	if (GetObject(Element)[0].checked)
		return "YES";
	else if (GetObject(Element)[1].checked)
		return "NO";
	else
		return "";
}

// ***** GRID Functions *****

function GetEntRelObject(sJoinAttrib, sEntRelatedAttrib)
{
	return GetObject(sJoinAttrib + "__" + sEntRelatedAttrib);
}

function GetEntRelValue(sJoinAttrib, sEntRelatedAttrib)
{
	var oField = GetEntRelObject(sJoinAttrib, sEntRelatedAttrib);
	if (oField == null)
		return 0;

	return oField.value;
}

function YesNoEntRelValue(sJoinAttrib, sEntRelatedAttrib)
{
	var Element = GetEntRelObject(sJoinAttrib, sEntRelatedAttrib);

	if (Element[0].checked)
		return "YES";

	else if (Element[1].checked)
		return "NO";

	else
		return "";
}

function YesNoEntRelChecked(sJoinAttrib, sEntRelatedAttrib)
{
	return !GetEntRelObject(sJoinAttrib, sEntRelatedAttrib)[0].checked && !GetEntRelObject(sJoinAttrib, sEntRelatedAttrib)[1].checked;
}

function SetErrorMsgElement(str, Element)
{
	setHelp(document.sDefHelpTitle, str, 3);
	BASetFocus(Element);
	return;
}

function SetErrorMsgEntRel(str, sJoinAttrib, sEntRelatedAttrib)
{
	setHelp(document.sDefHelpTitle, str, 3);
	BASetFocus(GetEntRelObject(sJoinAttrib, sEntRelatedAttrib).name);
	return;
}

function YesChecked(Element)
{
	return GetObject(Element)[0].checked;
}

function Required(Element)
{
	var oElement = GetObject(Element);
	switch (oElement.tagName)
	{
	case "INPUT":
	case "TEXTAREA":
		return oElement.value.length > 0;
	case "SELECT":
		return oElement.selectedIndex > 0;
	default:
		if (oElement[0].tagName == "INPUT")
			return oElement[0].checked == true || oElement[1].checked == true;
		break;
	}

	return false;
}

function IsDateGreaterThan(Element1, Element2) {
	if (Date.parse(GetValue(Element1)) >= Date.parse(GetValue(Element2))) {
		return true;

	} else {
		return false;
	}
}

function IsDateLowerThan(Element1, Element2) {
	if (Date.parse(GetValue(Element1)) < Date.parse(GetValue(Element2))) {
		return true;

	} else {
		return false;
	}
}

function showProbDesc(sSrcList, sDestList, iFormIndex, iDestComp) {
	//Encontrar la longitud de los arreglos
    var iDestArrLen = processExpression("arr" + sDestList + ".length");

	//Encontramos el valor del elemento seleccionado
    var iSelValue = processExpression("document.forms[" + iFormIndex + "]." + sSrcList + ".options[document.forms[" + iFormIndex + "]." + sSrcList + ".selectedIndex].value")

	if (iSelValue == "") {
		setHelp(document.sDefHelpTitle, document.sDefHelpText, document.iDefHelpType);
	}

	//Recorremos el arreglo destino
	for (var i = 0; i < iDestArrLen; i++) {

		//Ubicar el campo deseado en el arreglo destino
	    if ((processExpression("arr" + sDestList + "[i][" + iDestComp + "] == '" + iSelValue + "'")) || (processExpression("arr" + sDestList + "[i][" + iDestComp + "] == '" + "'"))) {
	        processExpression("setHelp('" + HTMLEncodeText(BA_CASE_DESC) + "', arr" + sDestList + "[i][0],1)");
			break;
		}
	}
}

function ValidateGridInstance(sEntity, idEntKey, sAttrib, sCondition, sErrorMsg)
{
   var sEntKey = "E_" + sEntity + "__" + idEntKey;
   var i, flag;
   for (i=0; document.all[i] != null; i++)
   {
      if (document.all[i].name != null && document.all[i].name.length > sEntKey.length &&
         document.all[i].name.search(sEntKey) >= 0)
      {
         var aEnt = document.all[i].name.split("__");
         var idEntKey   = aEnt[1];
         var sAttribName   = aEnt[2];
         if (sAttribName.substr(1, 1) == "_")
            sAttribName = sAttribName.substr(2);

         if(sAttribName == sAttrib || ( sAttribName.length >= sAttrib.length  &&
            sAttribName.search( sAttrib.length ) >= 0))  //Search attributes in related entity
         {
            flag = 0;
            if (document.all[i].name.substr(0,1) == "h")  //if hidden
            {
               sObjectSearched = document.all[i].name.substr(2);
               if (SearchObject(sObjectSearched))//if exists another object with the same name (for example is a check)
                  flag = 1;
            }

            if (flag == 0)
            {
               var regexp = /<E>/g; //Replace all <E> in the condition               
               var code = sCondition.replace(regexp, "'" + document.all[i].name + "'");
               var bRes = processExpression(code);                               

               if (!bRes)
               {
                  setHelp(document.sDefHelpTitle, sErrorMsg, 3);
                  try
                  {
                     BASetFocus(document.all[i].name);
                  }
                  catch( e1 )
                  {
                     try
                     {
                        // if is a check, try to set focus
                        BASetFocus("h_" + document.all[i].name);
                     }
                     catch( e2 )
                     {
                        // throw original error
                        throw e1;
                     }
                  }
                  return false;
               }
            }
         }
      }
   }
   return true;
}

// Valida que una condici�n se cumpla en todas las filas de una grilla (o solo en un subconjunto).
// sEntity: 	Entidad
// sAttrib1:	Atributo 1a condicion
// sCondition1:	condicion que se debe cumplir para validar la 2a "<E>":parametro; ex. GetValue(<E>)
// sAttrib2:	Atributo 2a condicion
// sCondition2:	Condicion que se debe cumplir para que no salga mensaje error
// sErrorMsg:	Mensaje Error
// ex: ValidateGrid("CRProdSolic", "idModalidadTCSol", "GetValue(<E>)==40", "VigenciaCS", "GetValue(<E>).length > 0", "Err Msg")
//
// Restricciones:
// - No pueden haber 2 grillas de la misma entidad en la p�gina HTML
// - No pueden haber dos columnas de la grilla con el mismo atributo (as� sea un ID a una entidad relacionada y tengan Display Attrib distinto)
// - Siempre se debe validar que cada fila esta correcta, as� se retornar� true si TODAS las filas est�n correctas (Si se intenta
//   validar si la fila tiene alg�n error, solo retornar� FALSE si TODAS las filas est�n err�neas, y con solo una que este bien retornar� TRUE
//   y la validaci�n no tendr� sentido)
function ValidateGrid(sEntity, sAttrib1, sCondition1, sAttrib2, sCondition2, sErrorMsg)
{
   var sEntKey = "E_" + sEntity;

   var i;
   var flag;
   var sObjectSearched;
   for (i=0; document.all[i] != null; i++)
   {
      if (document.all[i].name != null && document.all[i].name.length > sEntKey.length &&
         document.all[i].name.search(sEntKey) >= 0)
      {
         var aEnt = document.all[i].name.split("__");
         var idEntKey   = aEnt[1];
         var sAttrib      = aEnt[2];
         if (sAttrib.substr(1, 1) == "_")
            sAttrib = sAttrib.substr(2);

         if(sAttrib == sAttrib1 || ( sAttrib.length >= sAttrib1.length  &&
            sAttrib.search( sAttrib1.length ) >= 0)) //Search attributes in related entity
         {
            flag = 0;
            if (document.all[i].name.substr(0,1) == "h")  //if hidden
            {
               sObjectSearched = document.all[i].name.substr(2);
               if (SearchObject(sObjectSearched))//if exists another object with the same name (for example checks)
                  flag = 1;
            }

            if (flag == 0)
            {
               var regexp = /<E>/g; //Search all <E> in the condition
               var code = sCondition1.replace(regexp, "'" + document.all[i].name + "'");
               var bRes = processExpression(code);                

               if (bRes)
               {
                  if (!ValidateGridInstance(sEntity, idEntKey, sAttrib2, sCondition2, sErrorMsg))
                     return false;
               }

            }
         }
      }
   }
   return true;
}

/*
SearchObject

Purpose:
   Search html document object
Parameters:
   sObjectName
Return data:
   True or false
*/
function SearchObject(sObjectName)
{
    var i, flag;
    flag = 0;
   for (i=0; document.all[i] != null; i++)
    {
        if ((document.all[i].name != null) && (document.all[i].name == sObjectName))
        {
         flag = 1;
         break;
      }
    }
    if (flag == 1)
      return true;
   else
      return false;
}

// Count elements in grid, that complies with condition
// sEntity:      Entity
// sAttrib:      Attribute used to evaluate condition
// sCondition:   Condition to evaluate. "<E>":parameter; ex. GetValue(<E>)
// ex. BACountElementsInGrid( "Indemnizacion", "idFormaIndemPPD", "true" );
function BACountElementsInGrid( asEntity, asAttrib1, asCondition )
{
   var _sEntKey = "E_" + asEntity;
   var _sEntKeyIgnore = "h_E_" + asEntity; // si es un checkbox, solo es visible y no tiene el valor

   var i;
   var _resp = 0;
   for( i = 0; document.all[i] != null; i++ )
   {
      // el control corresponde a la entidad, o es el dummy con el valor de un checkbox
      // (en un checkbox h_E_ es el visible y E_ es un dummy hidden con el valor)
      if(document.all[i].name != null &&
         document.all[i].name.length > _sEntKey.length &&
         document.all[i].name.search( _sEntKey ) >= 0 &&
         ( document.all[i].name.search( _sEntKeyIgnore ) < 0 ||
           !SearchObject( document.all[i].name.substr( 2 ) )
         ))
      {
         var _aEnt = document.all[i].name.split( "__" );
         var _idEntKey = _aEnt[1];
         var _sAttrib = _aEnt[2];
         _sAttrib = ( _sAttrib.substr(1, 1) == "_" ) ? _sAttrib.substr(2) : _sAttrib;

         // el control corresponde al atributo (search y no ==, si es el display attrib de una entidad relacionada)
         if(_sAttrib == asAttrib1 || ( _sAttrib.length >= asAttrib1.length  &&
            _sAttrib.search( asAttrib1.length ) >= 0))
         {
             var _regexp = /<E>/g;
             var code = asCondition.replace(_regexp, "'" + document.all[i].name + "'");
             var _bRes = processExpression(code);
             
             if(_bRes){
                 _resp++;
             }
         }
      }
   }
   return _resp;
}

// Count elements in grid corresponding to fact, that complies with condition
// sFactEntity:  FactEntity
// sbChecked:    Count facts that checked property is equal to this value
// ex. BACountElementsInMMGrid( "CreditosGarantias", true );
function BACountElementsInMMGrid( asFactEntity, sbChecked )
{
   asPrefix = "h_F_" + asFactEntity + "__";
   asCondition = "GetObject(<E>).checked == " + ( sbChecked ? "true" : "false" );

   var i;
   var _resp = 0;
   for( i = 0; document.all[i] != null; i++ )
   {
      // search controls that contains prefix
      if(document.all[i].name != null &&
         document.all[i].name.length > asPrefix.length &&
         document.all[i].name.search( asPrefix ) >= 0 )
      {
         var _regexp = /<E>/g;
         var code = asCondition.replace(_regexp, "'" + document.all[i].name + "'");
         var _bRes = processExpression(code);

         if(_bRes)
         {
            _resp ++;
         }
      }
   }
   return _resp;
}

// Validates a condition in a fact grid subset
// asFactEntity: Fact Entity
// sbChecked:    Condition will be evaluated in facts that checked property is equal to this value
// asEntity:     Entity used to evaluate condition
// sAttrib:      Attribute used to evaluate condition
// sCondition:   Condition to evaluate. "<E>":parameter; ex. GetValue(<E>)
// sErrorMsg:
// ex. BAValidateMMGrid( "Indemnizacion", true, "idFormaIndemPPD", "GetValue(<E>) == 1", "Corrija error ..." );
function BAValidateMMGrid( asFactEntity, sbChecked, asEntity, sAttrib, sCondition, sErrorMsg )
{
   asPrefix = "h_F_" + asFactEntity + "__";
   asCondition = "GetObject(<E>).checked == " + ( sbChecked ? "true" : "false" );

   var i;
   for( i = 0; document.all[i] != null; i++ )
   {
      // search controls that contains prefix
      if(document.all[i].name != null &&
         document.all[i].name.length > asPrefix.length &&
         document.all[i].name.search( asPrefix ) >= 0 )
      {
         var _aEnt = document.all[i].name.split("__");
         var _idEntKey = _aEnt[1];

         var _regexp = /<E>/g;
         var code = asCondition.replace(_regexp, "'" + document.all[i].name + "'");
         var _bRes = processExpression(code);

         if(_bRes)
         {
            if( !ValidateMMGridAux( asFactEntity, _idEntKey, asEntity, sAttrib, sCondition, sErrorMsg ) )
            {
               return false;
            }
         }
      }
   }
   return true;
}

// BAValidateFactGrid auxiliar function
function ValidateMMGridAux( asFactEntity, aidEntKey, asEntity, asAttrib, sCondition, sErrorMsg )
{
   // Si es un checkbox, se usa el dummy con el valor y se ignora el visible del checkbox
   var _sEntKey = "E_" + asEntity + "__" + aidEntKey;

   var i;
   for( i = 0; document.all[i] != null; i++ )
   {
      // el control corresponde a la entidad, o es el dummy no visible de un checkbox con el valor
      // (en un checkbox h_E_ es el visible y E_ es un dummy hidden con el valor)
      if(document.all[i].name != null &&
         document.all[i].name.length > _sEntKey.length &&
         document.all[i].name.search( _sEntKey ) >= 0 &&
         !SearchObject( document.all[i].name.substr(2) ))
      {
         var _aEnt = document.all[i].name.split("__");
         var _idEntKey = _aEnt[1];
         var _sAttribName = _aEnt[2];
         _sAttribName = ( _sAttribName.substr(1, 1) == "_" ) ? _sAttribName.substr(2) : _sAttribName;

         // el control corresponde al atributo (search o ==, si es el display attrib de una entidad relacionada)
         if(_sAttribName == asAttrib || ( _sAttribName.length >= asAttrib.length  &&
            _sAttribName.search( asAttrib.length ) >= 0))
         {
            var _regexp = /<E>/g;
            var code = sCondition.replace(_regexp, "'" + document.all[i].name + "'");
            var _bRes = processExpression(code);

            if( !_bRes )
            {
               setHelp( document.sDefHelpTitle, sErrorMsg, 3 );
               try
               {
                  BASetFocus( document.all[i].name );
               }
               catch( e1 )
               {
                  try
                  {
                     // if is a check, try to set focus
                     BASetFocus("h_" + document.all[i].name);
                  }
                  catch( e2 )
                  {
                     // don�t throw original error
                     // throw e1;
                  }
               }
            }
            return _bRes;
         }
      }
   }
   return true;
}

// ExecuteCommandInGrid auxiliar method
function ExecuteCommandInGridInstance( asEntity, aidEntKey, asAttrib, asCommand )
{
   // Si es un checkbox, se ignora el dummy con el valor y el comando se ejecuta sobre el visible del checkbox
   var _sEntKey = "E_" + asEntity + "__" + aidEntKey;

   var i;
   for( i = 0; document.all[i] != null; i++ )
   {
      // el control corresponde a la entidad, o es el visible de un checkbox
      // (en un checkbox h_E_ es el visible y E_ es un dummy hidden con el valor)
      if(document.all[i].name != null &&
         document.all[i].name.length > _sEntKey.length &&
         document.all[i].name.search( _sEntKey ) >= 0 &&
         !SearchObject( "h_" + document.all[i].name ))
      {
         var _aEnt = document.all[i].name.split("__");
         var _idEntKey = _aEnt[1];
         var _sAttribName = _aEnt[2];
         _sAttribName = ( _sAttribName.substr(1, 1) == "_" ) ? _sAttribName.substr(2) : _sAttribName;

         // el control corresponde al atributo (search o ==, si es el display attrib de una entidad relacionada)
         if(_sAttribName == asAttrib || ( _sAttribName.length >= asAttrib.length  &&
            _sAttribName.search( asAttrib.length ) >= 0))
         {
             var _regexp = /<E>/g;
             var code = asCommand.replace(_regexp, "document.all('" + document.all[i].name + "')");

             processExpression(code);             
         }
      }
   }
}

// Executes a command in a grid subset
// sEntity:      Entidad
// sAttrib1:     Atributo sobre el cual se evaluara la condicion
// sCondition:   Condicion que se debe cumplir para ejecutar el comando "<E>":parametro; ex. GetValue(<E>)
// sAttrib2:     Atributo sobre el cual se ejecutará el comando
// sCommand:     Comando a ejecutar
// ex. ExecuteCommandInGrid( "Indemnizacion", "idFormaIndemPPD", "GetValue(<E>) == 1", "idCotizacion","<E>.disabled = true;" );
function ExecuteCommandInGrid( asEntity, asAttrib1, asCondition, asAttrib2, asCommand )
{
   var _sEntKey = "E_" + asEntity;
   var _sEntKeyIgnore = "h_E_" + asEntity; // si es un checkbox, solo es visible y no tiene el valor

   var i;
   for( i = 0; document.all[i] != null; i++ )
   {
      // el control corresponde a la entidad, o es el dummy con el valor de un checkbox
      // (en un checkbox h_E_ es el visible y E_ es un dummy hidden con el valor)
      if(document.all[i].name != null &&
         document.all[i].name.length > _sEntKey.length &&
         document.all[i].name.search( _sEntKey ) >= 0 &&
         ( document.all[i].name.search( _sEntKeyIgnore ) < 0 ||
           !SearchObject( document.all[i].name.substr( 2 ) )
         ))
      {
         var _aEnt = document.all[i].name.split( "__" );
         var _idEntKey = _aEnt[1];
         var _sAttrib = _aEnt[2];
         _sAttrib = ( _sAttrib.substr(1, 1) == "_" ) ? _sAttrib.substr(2) : _sAttrib;

         // el control corresponde al atributo (search y no ==, si es el display attrib de una entidad relacionada)
         if(_sAttrib == asAttrib1 || ( _sAttrib.length >= asAttrib1.length  &&
            _sAttrib.search( asAttrib1.length ) >= 0))
         {
            var _regexp = /<E>/g;
            var _bRes = processExpression(asCondition.replace(_regexp, "'" + document.all[i].name + "'"));
            if(_bRes)
            {
               ExecuteCommandInGridInstance( asEntity, _idEntKey, asAttrib2, asCommand );
            }
         }
      }
   }
}

// Funci�n auxiliar para BAValidateSMGrid
function ValidateSMGridInstance(sEntity, idEntKey, sAttrib, sDisplayAttrib, sCondition, sErrorMsg)
{
	var sEntKey = "E_" + sEntity + "__" + idEntKey;
	var i, flag;
	for (i=0; document.all[i] != null; i++)
	{
		if (document.all[i].name != null && document.all[i].name.length > sEntKey.length &&
			document.all[i].name.search(sEntKey) >= 0)
		{
			var aEnt = document.all[i].name.split("__");
			var idEntKey   = aEnt[1];
			var sAttribName   = aEnt[2];
			if (sAttribName.substr(1, 1) == "_")
				sAttribName = sAttribName.substr(2);

			// check Display Attrib
			var sDisplayAttribName = (aEnt.length > 2) ? aEnt[3] : "";

			if ( (sDisplayAttribName == sDisplayAttrib)   &&   (sAttribName == sAttrib || ( sAttribName.length >= sAttrib.length  &&
				sAttribName.search( sAttrib.length ) >= 0)) )  //Search attributes in related entity
			{
				flag = 0;
				if (document.all[i].name.substr(0,1) == "h")  //if hidden
				{
					sObjectSearched = document.all[i].name.substr(2);
					if (SearchObject(sObjectSearched))//if exists another object with the same name (for example is a check)
						flag = 1;
				}

				if (flag == 0)
				{
				    var regexp = /<E>/g; //Replace all <E> in the condition
				    var code = sCondition.replace(regexp, "'" + document.all[i].name + "'");
				    var bRes = processExpression(code);

					if (!bRes)
					{
						setHelp(document.sDefHelpTitle, sErrorMsg, 3);
						try
						{
							BASetFocus(document.all[i].name);
						}
						catch( e1 )
						{
							try
							{
								// if is a check, try to set focus
								BASetFocus("h_" + document.all[i].name);
							}
							catch( e2 )
							{
								// throw original error
								throw e1;
							}
						}
						return false;
					}
				}
			}
		}
	}
	return true;
}


// Validates that all rows (or rows subset defined by another condition) in a Grid fulfill a condition, this function only supports validations
// over attributes of another related entities as DisplayAttrib, the grid can contains two or more different attributes of the same related entity
// (repeated grid entity attribute but different display attrib).
// sEntity: Grid Entity
// sAttrib1: Attribute for first condition (must be an attribute related with another entity)
// sDisplayAttrib1: Display attribute for first condition (must be an attribute of related entity)
// sCondition1: Condition that filter rows to validate, "<E>":parameter; ex. GetValue(<E>)
// sAttrib2: Attribute for second condition (must be an attribute related with another entity)
// sDisplayAttrib2: Display attribute for first condition (must be an attribute of related entity)
// sCondition2: Condition that rows must fulfill
// sErrorMsg: Error message
// ex: if(!BAValidateSMGrid("Pay", "idCount", "CountNumber", "true", "idCount", "CountNumber", "GetValue(<E>) != \"\"", "You must fill count code for all pays")) { SetErrorMsg("Please fill all values"); return; }
//
// Restrictions:
// - An HTML page cannot contain two grids with the same entity
// - A Grid cannot contain two columns with the same attribute (for attributes related to another entities, DisplayAttrib must be different)
// - Conditions always must validate that row are correct, attemps to validate if row is wrong does not work because the function
//    return if ALL rows are wrog!!!
function BAValidateSMGrid(sEntity, sAttrib1, sDisplayAttrib1, sCondition1, sAttrib2, sDisplayAttrib2, sCondition2, sErrorMsg)
{
	var sEntKey = "E_" + sEntity;

	var i;
	var flag;
	var sObjectSearched;
	for (i=0; document.all[i] != null; i++)
	{
		if (document.all[i].name != null && document.all[i].name.length > sEntKey.length &&
			document.all[i].name.search(sEntKey) >= 0)
		{
			var aEnt = document.all[i].name.split("__");
			var idEntKey   = aEnt[1];
			var sAttrib      = aEnt[2];
			if (sAttrib.substr(1, 1) == "_")
				sAttrib = sAttrib.substr(2);

			// check Display Attrib
			var sDisplayAttrib = (aEnt.length > 2) ? aEnt[3] : "";

			if ( (sDisplayAttrib == sDisplayAttrib1)   &&   (sAttrib == sAttrib1 || ( sAttrib.length >= sAttrib1.length  &&
				sAttrib.search( sAttrib1.length ) >= 0)) ) // Search attributes in related entity
			{
				flag = 0;
				if (document.all[i].name.substr(0,1) == "h")  //if hidden
				{
					sObjectSearched = document.all[i].name.substr(2);
					if (SearchObject(sObjectSearched))//if exists another object with the same name (for example checks)
						flag = 1;
				}

				if (flag == 0)
				{
					var regexp = /<E>/g; //Search all <E> in the condition
					var code = sCondition1.replace(regexp, "'" + document.all[i].name + "'");
					var bRes = processExpression(code);

					if (bRes)
					{
						if (!ValidateSMGridInstance(sEntity, idEntKey, sAttrib2, sDisplayAttrib2, sCondition2, sErrorMsg))
							return false;
					}
				}
			}
		}
	}
	return true;
}
//Verify if the typed value is diferent than the current value and call submitonchange method
function TestComboValues(idRender){
	if (event.srcElement.value != event.srcElement.lastValue){
		BASubmitOnChance(idRender);
	}
}

function NullField(sName, sErrorMsg)
{
	if (GetValue(sName).length == 0)
	{
		SetErrorMsg(sErrorMsg);
		BASetFocus(sName);
		return true;
	} else
	return false;
}

// ------------------------------------------------------------------
// Utility functions for parsing in getDateFromFormat()
// ------------------------------------------------------------------
function _isInteger(val) {
	var digits="1234567890";
	for (var i=0; i < val.length; i++) {
		if (digits.indexOf(val.charAt(i))==-1) { return false; }
		}
	return true;
	}
function _getInt(str,i,minlength,maxlength) {
	for (var x=maxlength; x>=minlength; x--) {
		var token=str.substring(i,i+x);
		if (token.length < minlength) { return null; }
		if (_isInteger(token)) { return token; }
		}
	return null;
	}

// ------------------------------------------------------------------
// getDateFromFormat( date_string , format_string )
//
// This function takes a date string and a format string. It matches
// If the date string matches the format string, it returns the
// getTime() of the date. If it does not match, it returns 0.
// ------------------------------------------------------------------

var MONTH_NAMES;
var DAY_NAMES;
if (BA_JAN_L != null) {
    MONTH_NAMES = [BA_JAN_L, BA_FEB_L, BA_MAR_L, BA_APR_L, BA_MAY_L, BA_JUN_L, BA_JUL_L, BA_AUG_L, BA_SEP_L, BA_OCT_L, BA_NOV_L, BA_DEC_L, BA_JAN, BA_FEB, BA_MAR, BA_APR, BA_MAY, BA_JUN, BA_JUL, BA_AUG, BA_SEP, BA_OCT, BA_NOV, BA_DEC];
    DAY_NAMES = [BA_SUNDAY_L, BA_MONDAY_L, BA_TUESDAY_L, BA_WEDNESDAY_L, BA_THURSDAY_L, BA_FRIDAY_L, BA_SATURDAY_L, BA_SUNDAY, BA_MONDAY, BA_TUESDAY, BA_WEDNESDAY, BA_THURSDAY, BA_FRIDAY, BA_SATURDAY];
}
 else {
	MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
}

function getDateFromFormat(val,format) {
	val=val+"";
	format=format+"";
	var i_val=0;
	var i_format=0;
	var c="";
	var token="";
	var token2="";
	var x,y;
	var now=new Date();
	var year=now.getYear();
	var month=now.getMonth()+1;
	var date=1;
	var hh=now.getHours();
	var mm=now.getMinutes();
	var ss=now.getSeconds();
	var ampm="";
	var bUseH = false; //User hour
	var bUseM = false; //Use Minutes
	var bUseS = false; //Use Seconds

	while (i_format < format.length) {
		// Get next token from format string
		c=format.charAt(i_format);

		// check for literal strings to ommit
		if(c == "'")
		{
			// get literal
			var i_literalEndPos = format.indexOf("'",i_format + 1);
			if(i_literalEndPos >= 0)
			{
				var sLiteral = format.substring(i_format + 1, i_literalEndPos);
				// ensure that value contains literal
				if(val.substring(i_val, i_val + sLiteral.length) == sLiteral)
				{
					// remove string
					i_format += sLiteral.length;
					i_format += 2;
					i_val += sLiteral.length;
					continue;
				}
				else
				{
					return 0;
				}
			}
		}

		token="";
		while ((format.charAt(i_format)==c) && (i_format < format.length)) {
			token += format.charAt(i_format++);
			}
		// Extract contents of value based on format token
		if (token=="yyyy" || token=="yy" || token=="y") {
			if (token=="yyyy") { x=4;y=4; }
			if (token=="yy")   { x=2;y=2; }
			if (token=="y")    { x=2;y=4; }
			year=_getInt(val,i_val,x,y);
			if (year==null) { return 0; }
			i_val += year.length;
			if (year.length==2) {
				if (year > 70) { year=1900+(year-0); }
				else { year=2000+(year-0); }
				}
			}
		else if (token=="MMM"||token=="MMMM"||token=="NNN"){
			month=0;
			for (var i=0; i<MONTH_NAMES.length; i++) {
				var month_name=MONTH_NAMES[i];
				if (val.substring(i_val,i_val+month_name.length).toLowerCase()==month_name.toLowerCase()) {
					if (token=="MMM"||token=="MMMM"||(token=="NNN"&&i>11)) {
						month=i+1;
						if (month>12) { month -= 12; }
						i_val += month_name.length;
						break;
						}
					}
				}
			if ((month < 1)||(month>12)){return 0;}
			}
		else if (token=="EE"||token=="E"){
			for (var i=0; i<DAY_NAMES.length; i++) {
				var day_name=DAY_NAMES[i];
				if (val.substring(i_val,i_val+day_name.length).toLowerCase()==day_name.toLowerCase()) {
					i_val += day_name.length;
					break;
					}
				}
			}
		else if (token=="MM"||token=="M") {
			month=_getInt(val,i_val,token.length,2);
			if(month==null||(month<1)||(month>12)){return 0;}
			i_val+=month.length;}
		else if (token=="dd"||token=="d") {
			date=_getInt(val,i_val,token.length,2);
			if(date==null||(date<1)||(date>31)){return 0;}
			i_val+=date.length;}
		else if (token=="hh"||token=="h") {
		    bUseH = true;
			hh=_getInt(val,i_val,token.length,2);
			if(hh==null||(hh<1)||(hh>12)){return 0;}
			i_val+=hh.length;}
		else if (token=="HH"||token=="H") {
		    bUseH = true;
			hh=_getInt(val,i_val,token.length,2);
			if(hh==null||(hh<0)||(hh>23)){return 0;}
			i_val+=hh.length;}
		else if (token=="KK"||token=="K") {
			bUseH = true;
			hh=_getInt(val,i_val,token.length,2);
			if(hh==null||(hh<0)||(hh>11)){return 0;}
			i_val+=hh.length;}
		else if (token=="kk"||token=="k") {
			bUseH = true;
			hh=_getInt(val,i_val,token.length,2);
			if(hh==null||(hh<1)||(hh>24)){return 0;}
			i_val+=hh.length;hh--;}
		else if (token=="mm"||token=="m") {
		    bUseM = true;
			mm=_getInt(val,i_val,token.length,2);
			if(mm==null||(mm<0)||(mm>59)){return 0;}
			i_val+=mm.length;}
		else if (token=="ss"||token=="s") {
		    bUseS = true;
			ss=_getInt(val,i_val,token.length,2);
			if(ss==null||(ss<0)||(ss>59)){return 0;}
			i_val+=ss.length;}
		else if (token=="a"||token=="tt") {
			if (val.substring(i_val,i_val+2).toLowerCase()=="am") {ampm="AM";}
			else if (val.substring(i_val,i_val+2).toLowerCase()=="pm") {ampm="PM";}
			else {return 0;}
			i_val+=2;}
		else {
			if (val.substring(i_val,i_val+token.length)!=token) {return 0;}
			else {i_val+=token.length;}
			}
	}
	// If there are any trailing characters left in the value, it doesn't match
	if (i_val != val.length) { return 0; }
	// Is date valid for month?
	if (month==2) {
		// Check for leap year
		if ( ( (year%4==0)&&(year%100 != 0) ) || (year%400==0) ) { // leap year
			if (date > 29){ return 0; }
			}
		else { if (date > 28) { return 0; } }
		}
	if ((month==4)||(month==6)||(month==9)||(month==11)) {
		if (date > 30) { return 0; }
		}
	// Correct hours value
	if (hh<12 && ampm=="PM") { hh=hh-0+12; }
	else if (hh>11 && ampm=="AM") { hh-=12; }
	if (!bUseH){
	 hh=0;
	}
	if (!bUseM){
	 mm=0;
	}
	if (!bUseS){
	 ss=0;
	}
	var newdate=new Date(year,month-1,date,hh,mm,ss);
	return newdate;
	}




/*
 * DateFormat.js
 * Formats a Date object into a human-readable string
 *
 * Copyright (C) 2001 David A. Lindquist (http://www.gazingus.org)
 */

Date.MONTHS = [
  BA_JAN_L, BA_FEB_L, BA_MAR_L, BA_APR_L, BA_MAY_L, BA_JUN_L, BA_JUL_L,
  BA_AUG_L, BA_SEP_L, BA_OCT_L, BA_NOV_L, BA_DEC_L
];

Date.DAYS = [
  BA_SUNDAY_L, BA_MONDAY_L, BA_TUESDAY_L, BA_WEDNESDAY_L,
  BA_THURSDAY_L, BA_FRIDAY_L, BA_SATURDAY_L
];

Date.SUFFIXES = [
  BA_SUFIX_1, BA_SUFIX_2, BA_SUFIX_3, BA_SUFIX_4, BA_SUFIX_5, BA_SUFIX_6, BA_SUFIX_7, BA_SUFIX_8, BA_SUFIX_9, BA_SUFIX_10,
  BA_SUFIX_11, BA_SUFIX_12, BA_SUFIX_13, BA_SUFIX_14, BA_SUFIX_15, BA_SUFIX_16, BA_SUFIX_17, BA_SUFIX_18, BA_SUFIX_19, BA_SUFIX_20,
  BA_SUFIX_21, BA_SUFIX_22, BA_SUFIX_23, BA_SUFIX_24, BA_SUFIX_25, BA_SUFIX_26, BA_SUFIX_27, BA_SUFIX_28, BA_SUFIX_29, BA_SUFIX_30,
  BA_SUFIX_31
];

Date.prototype.format = function( mask )
{
  var formatted     = ( mask != null ) ? mask : 'dd-MMM-yy';
  var letters       = 'DMyHdhmst'.split( '' );
  var temp          = [];
  var count         = 0;
  var regexA;
  var regexB        = /\[(\d+)\]/;

  var day           = this.getDay();
  var date          = this.getDate();
  var month         = this.getMonth();
  var year          = this.getFullYear().toString();
  var hours         = this.getHours();
  var minutes       = this.getMinutes();
  var seconds       = this.getSeconds();

  // remove literals from formatted
	var literals       = [];
	var i_numLiteral=0;
	if(formatted.indexOf("'") >= 0)
	{
		var s_formattedWithoutLiterals = "";
		var i_literalStartPos = 0;
		var i_literalEndPos = 0;
		while (i_literalEndPos < formatted.length)
		{
			// Get next token from format string
			i_literalStartPos = formatted.indexOf("'", i_literalEndPos);
			if(i_literalStartPos >= 0)
			{
				s_formattedWithoutLiterals = s_formattedWithoutLiterals + formatted.substring(i_literalEndPos, i_literalStartPos);
				i_literalEndPos = formatted.indexOf("'", i_literalStartPos + 1);
				if(i_literalEndPos >= 0)
				{
					// get literal
					var sLiteral = formatted.substring(i_literalStartPos + 1, i_literalEndPos);

					// add literal
					var s_literalKey = "<" + i_numLiteral + ">";
					literals.push(sLiteral);
					s_formattedWithoutLiterals = s_formattedWithoutLiterals + s_literalKey;

					// advance
					i_numLiteral++;
					i_literalEndPos++;
				}
				else
				{
					// no more literals to end, leave isolated character
					s_formattedWithoutLiterals = s_formattedWithoutLiterals + formatted.substring(i_literalStartPos, formatted.length);
					i_literalEndPos = formatted.length;
				}
			}
			else
			{
				// no more literals to end
				s_formattedWithoutLiterals = s_formattedWithoutLiterals + formatted.substring(i_literalEndPos, formatted.length);
				i_literalEndPos = formatted.length;
			}
		}
		// set new format
		formatted = s_formattedWithoutLiterals;
	}

  var formats       = new Object();
  formats[ 'd' ]    = date;
  formats[ 'D' ]    = date + Date.SUFFIXES[ date - 1 ];
  formats[ 'dd' ]   = ( date < 10 ) ? '0' + date : date;
  formats[ 'ddd' ]  = Date.DAYS[ day ].substring( 0, 3 );
  formats[ 'dddd' ] = Date.DAYS[ day ];
  formats[ 'M' ]    = month + 1;
  formats[ 'MM' ]   = ( month + 1 < 10 ) ? '0' + ( month + 1 ) : month + 1;
  formats[ 'MMM' ]  = Date.MONTHS[ month ].substring( 0, 3 );
  formats[ 'MMMM' ] = Date.MONTHS[ month ];
  formats[ 'y' ]    = ( year.charAt( 2 ) == '0' ) ? year.charAt( 3 ) : year.substring( 2, 4 );
  formats[ 'yy' ]   = year.substring( 2, 4 );
  formats[ 'yyyy' ] = year;
  formats[ 'H' ]    = hours;
  formats[ 'HH' ]   = ( hours < 10 ) ? '0' + hours : hours;
  formats[ 'h' ]    = ( hours > 12 || hours == 0 ) ? Math.abs( hours - 12 ) : hours;
  formats[ 'hh' ]   = ( formats[ 'h' ] < 10 ) ? '0' + formats[ 'h' ] : formats[ 'h' ];
  formats[ 'm' ]    = minutes;
  formats[ 'mm' ]   = ( minutes < 10 ) ? '0' + minutes : minutes;
  formats[ 's' ]    = seconds;
  formats[ 'ss' ]   = ( seconds < 10 ) ? '0' + seconds : seconds;
  formats[ 't' ]    = ( hours < 12 ) ?  'A' : 'P';
  formats[ 'tt' ]   = ( hours < 12 ) ?  'AM' : 'PM';

  for ( var i = 0; i < letters.length; i++ ) {
    regexA = new RegExp( '(' + letters[ i ] + '+)' );
    while ( regexA.test( formatted ) ) {
      temp[ count ] = RegExp.$1;
      formatted = formatted.replace( RegExp.$1, '[' + count + ']' );
      count++;
    }
  }

  while ( regexB.test( formatted ) ) {
    formatted = formatted.replace( regexB, formats[ temp[ RegExp.$1 ] ] );
  }

	// replace literals
	for ( var i = 0; i < i_numLiteral; i++ )
	{
		var s_literalKey = "<" + i + ">";
		formatted = formatted.replace(s_literalKey, literals[i]);
	}

  return formatted;
};
///Execute the specified rule
function BAExecuteRule(idRule,idRender){
    GetObject("h_idRuleToExecute").value = idRule;
    BASubmitOnChance(idRender);
}

///Execute specified interface
function BAExecuteInterface(idInterfaceInstance, idRender){
    GetObject("h_idInterfaceToExecute").value = idInterfaceInstance;
    BASubmitOnChance(idRender);
}

function BADeleteSimpleListItem(oClickedDiv){ 
 var sHiddenControl = oClickedDiv.parentElement.hiddenControl || oClickedDiv.parentNode.getAttribute("hiddenControl");
 var iId = oClickedDiv.idSelectedItem || oClickedDiv.getAttribute("idSelectedItem");
 //Delete the id from the current control:
 var oHiddenControl = GetObject(sHiddenControl);
 var sNewIds = "";
 var sIds = oHiddenControl.value.split(',');
 for (i=0;i<sIds.length; i++){
     if (sIds[i] != iId){
         if (sNewIds != ""){
            sNewIds += ",";
         }
         sNewIds += sIds[i];
     }
 }
 oHiddenControl.value =  sNewIds;
 oClickedDiv.style.display = "none";
}

//Set the given value to the hidden focus control, in order
//to use it in roundtrips
function SetFocusValue(sValue){
   var oFocusControl = GetObject("h_Focus");
   if (oFocusControl != null){
       SetValue("h_Focus",sValue);
   }
}

//Set the given value to the given control, if it exists.
function SetValueIfExists(strField, strValue){
  if (GetObject(strField)){
      SetValue(strField,strValue);
  }
}

function SetParentWindowValue(sField,sValue){
	var win = window.dialogArguments;
	if (window){
		var test = win.document.getElementById(sField);
		if (test){
			test.value = sValue;
		}
    }
}

var oLastMIAnchorSelected = null;
var oLastMIDivSelected = null;
function OnMainMenuItemOver(iItemId){
    var oAnchor =  GetObject("aMenuItemName"+iItemId);
    if (oAnchor == oLastMIAnchorSelected){
        return;
    }
	oAnchor.className = "BizAppMenuTextSelect";
	if (oLastMIAnchorSelected != null){
		oLastMIAnchorSelected.className = "BizAppMenuText";
	}
	oLastMIAnchorSelected = oAnchor;

	if (oLastMIDivSelected != null){
		oLastMIDivSelected.style.visibility = "hidden";
	}
	oLastMIDivSelected = GetObject("divMenuItemDescription"+iItemId);
	oLastMIDivSelected.style.visibility = "visible";

}

function RedirectPage(sURL){
	document.location.href = sURL;
}

function DrawButton(anchor,position){
		trButton = anchor;
		if (trButton.cells[0].style.backgroundPosition == position){
			return;
		}
		for (i = 0; i<trButton.cells.length; i++){
			trButton.cells[i].style.backgroundPosition = position;
		}
}
function LoadMainPageFromNode(sRef,oNode){
	LoadMainPage(sRef);
}

function GetBALocationFrame(){
	if(parent.BALocationFrame != null)
	    return parent.BALocationFrame;
    else
        return parent.parent.BALocationFrame;
}

function GetBAMainFrame(){
	if(parent.BAMainFrame != null)
		return parent.BAMainFrame;
    else
        return parent.parent.BAMainFrame;
}

function openBACase(idCase, sHref){
	if(GetBALocationFrame()!= null)
		GetBALocationFrame().setCurrentCase(idCase);

	if(GetBAMainFrame() != null)
		GetBAMainFrame().location.href = sHref;
}
function LoadMainPage(sRef){
	GetBAMainFrame().location.href = sRef;
}
function BASetLocation(locValue){
	GetBALocationFrame().BAWriteLocation(locValue);
}

function BASetHelpText(helpTextValue){
	GetBALocationFrame().BAWriteHelpText(helpTextValue);
}

function SetNavigationBarData(sName, oCaseArray, sFullKey){
	if (GetBALocationFrame() != null && typeof(GetBALocationFrame().BASetNavigationBarData) == 'undefined'){
		var cData = "[";
		for (var i = 0; i< oCaseArray.length; i++){
			if (cData.length > 1){
				cData +=",";
			}
			cData += oCaseArray[i];
		}
		cData +="]";
		setTimeout("SetNavigationBarData('',"+cData+",'"+sFullKey+"');",400);
	}
	else{
		if(GetBALocationFrame() != null)
			GetBALocationFrame().BASetNavigationBarData(sName,oCaseArray,sFullKey);
	}
}
function HideNavigationBarData(){
	if(GetBALocationFrame() != null && GetBALocationFrame().ShowNavBar != null)
		GetBALocationFrame().ShowNavBar("none");
}
function BASetLocationFromMain(locValue,useCurrentList){
	if(typeof(parent) != 'undefined' && typeof(GetBALocationFrame()) != 'undefined'){
		GetBALocationFrame().BAWriteLocation(locValue,useCurrentList);
	}
}
//Add the location value to the end of the location bar
function BAAddLocationFromMain(locValue){
	if (typeof(parent) !='undefined' && typeof(GetBALocationFrame()) != 'undefined')
	{
		GetBALocationFrame().BAAddLocation(locValue);
	}
}
function BARemoveLocationFromMain(locValue){
	if (typeof(parent) !='undefined' && typeof(GetBALocationFrame()) != 'undefined')
	{
		GetBALocationFrame().BARemoveLocation(locValue);
	}
}

/**********************
	WP METHODS
************************/
function  UpdateToolBar(sDate,sTime){
	if (parent.BAStatusBar.BAUpdateDateTime){
		parent.BAStatusBar.BAUpdateDateTime(sDate,sTime);
	}
	else
	{
		setTimeout('UpdateToolBar("'+sDate+'","'+sTime+'")',200);
	}
}
function DetectorNavegador() {
  this.NS4 = document.layers;
  this.IE4 = document.all;
  this.DOM = document.getElementById;
  this.DHTML = this.NS4 || this.IE4 || this.DOM;
}
var soporta = new DetectorNavegador();

function BAInitMenuFromFrame() {
  if (soporta.DHTML) {
    if (soporta.NS4)
      document.captureEvents(Event.MOUSEUP);
    SetMenuEvents();
  }
}
function SetMenuEvents(){
	document.onmouseup = BAHideActiveMenu;
}
function BAHideActiveMenu(){
	oParent = parent;
	var iCounter = 0;
	while (oParent != null && iCounter< 5){
	 if (typeof(oParent.HideBAMenu) != 'undefined')
	 {
		oParent.HideBAMenu();
		break;
	 }
	 oParent = oParent.parent;
	 iCounter++;
	}
}

BAInitMenuFromFrame();

function ShowCaseSumary(idCase){
    if(parent.BACaseSummary != null){
	    parent.BACaseSummary.location.href = "../../App/ListaDetalle/Detalle.aspx?idCase="+idCase+"&isSummary=1";
	    parent.document.getElementById('HorizontalToggle').rows = "33,*,45%"
	}
	else{
    	if (parent.parent.BACaseSummary) {
    		parent.parent.BACaseSummary.location.href = "../../App/ListaDetalle/Detalle.aspx?idCase=" + idCase + "&isSummary=1";
    		parent.parent.document.getElementById('HorizontalToggle').rows = "33,*,45%"
    	}
    }

	if (typeof(clickedItem) != null){
		clickedItem = null;
	}

}

function BAGetMouseCoords(ev){
	if(ev.pageX || ev.pageY){
		return {x:ev.pageX, y:ev.pageY};
	}
	return {
		x:ev.clientX + document.body.scrollLeft - document.body.clientLeft,
		y:ev.clientY + document.body.scrollTop  - document.body.clientTop
	};
}

function cancelEvent()
{
	return false;
}

// Function called when render value changes (for behaviours and actions)
// Compatible with FireFox
function BAInputValueChanged()
{
	if (!bLoadComplete)
		return;

	// Calls script code for behaviours and actions
	if (window.BAExecuteBehavioursAndActions)
	{
		BAExecuteBehavioursAndActions();
	}
}



function BACloseWaitFrame(){
	if (typeof(parent.BAHideWaitFrame) != 'undefined'){
		parent.BAHideWaitFrame();
	}
}

/* Association JavaScript code */
function BAGetAssociationValues(associationTable) {
    //Find the values table:
    var values = "";
    var table = document.getElementById(associationTable);
    for (var i = 0; i < table.rows.length; i++){
        var checkControl = table.rows[i].cells[0].childNodes[0];
        if (checkControl.checked) {
            if (values.length > 0) {
                values = values + ",";
            }
            values = values + checkControl.getAttribute("assocId");
        }
    }
    return values;
}
function BASetAssociationValues(renderId,leftXPath, leftId, newValues){
    var hControl = document.getElementById("A_"+renderId+"__" + leftXPath + "__" + leftId);
    var currentValue = hControl.value;
    var relItems;
    if (currentValue != null) {
        relItems = currentValue.split(':');
		hControl.value = relItems[0] + ":" + relItems[1] + ":" + relItems[2] + ":" + newValues + ":" + relItems[4];
    }
}
function BAValueInArray(arrayObject, value){
    var found = false;
	if (arrayObject != null) {
		for(var i=0;i < arrayObject.length; i++){
			if (arrayObject[i] == value){
				found = true;
				break;
			}
		}
	}
    return found;
}
function BAChangeAssociationValues(tableName, leftXPath, leftId){
    var renderId = tableName.substring(6);
    var hControl = document.getElementById("A_" + renderId + "__" + leftXPath + "__" + leftId);
    var currentValue = hControl.value;
    var relItems;
    if (currentValue != null) {
        relItems = currentValue.split(':');
        if (relItems.length > 3) {
            relItems = relItems[3].split(',');
        }
    }


    //Find the values table:
    var table = document.getElementById(tableName);
    var valuesTable = document.getElementById(table.getAttribute("values"));
    for (var i = 0; i < valuesTable.rows.length; i++){
        var checkControl = valuesTable.rows[i].cells[0].childNodes[0];
        var relId = checkControl.getAttribute("assocId");
        if (BAValueInArray(relItems, relId)) {
            checkControl.checked = true;
        } else {
            checkControl.checked = false;
        }
    }
}

function BAUpdateAssociations(){
    for (var i = 0; i< BAAssociations.length; i++){
       //Find out the selected item:
       var rowIndex = -1;
       if (BAAssociations[i].getAttribute("selectedRow") != null){
           rowIndex = BAAssociations[i].getAttribute("selectedRow");
       }
       else{
			for (var r=1; r< BAAssociations[i].rows.length; r++){
				var row = BAAssociations[i].rows[r];
				if (row.cells[0].className=="SelectedRow"){
				    rowIndex = r;
					break;
				}
			}
       }
       if (rowIndex != -1){

		  BASelectAssociation(BAAssociations[i].id,BAAssociations[i].rows[rowIndex].getAttribute("assocId"));
	   }

    }
}
function BAFlipAssociation(idAssociation){
   if (GetObject("h_fl_Asscn_"+idAssociation).value == "0"){
		GetObject("h_fl_Asscn_"+idAssociation).value = "1";
   }
   else{
       GetObject("h_fl_Asscn_"+idAssociation).value = "0";
   }
   BASubmitOnChance();
}
function BASelectAssociation(tableName, leftId) {
	var renderId = tableName.substring(6);
    //Find the table:
    var table = document.getElementById(tableName);
    //Find out the required row and the current row:
    var currentRow = null;
    var requiredRow = null;
    var requiredRowIndex = 0;


    for (var i = 1; i < table.rows.length;i++){
        var asscId = table.rows[i].getAttribute("assocId");
        var cell = table.rows[i].cells[0];
        if (asscId == leftId){
			requiredRowIndex = i;
            requiredRow = table.rows[i];
        }
        if (cell.className == "SelectedRow"){
            currentRow = table.rows[i];
        }
        if (currentRow != null && requiredRow != null){
            break;
        }
    }

    //Update the sate:
    GetObject("h_st_"+tableName).value = leftId;


    var selectedValues = BAGetAssociationValues(table.getAttribute("values"));
    var leftXpath = table.getAttribute("leftXPath");
    BASetAssociationValues(renderId,leftXpath, currentRow.getAttribute("assocId"), selectedValues);

    if (currentRow != requiredRow){
        //Change the current elements:
        BAChangeAssociationValues(tableName, leftXpath, leftId);
        currentRow.cells[0].className = "NormalRow";
        requiredRow.cells[0].className = "SelectedRow";
        table.setAttribute("selectedRow",requiredRowIndex);
    }
}
function BAonUnload(){
   BAUpdateAssociations();
}

function closeBizagi(evt) {
	var closeSession=false;
	evt = (evt) ? evt : event;
    clickY = evt.clientY;
    altKey = evt.altKey;
    keyCode = evt.keyCode;
    if(!isIE){// Window Closing in FireFox
        closeSession=true;
    } else { // Window Closing in IE
        if (altKey == true && keyCode == 115){
            closeSession=true;
        } else if(clickY < 0){
            closeSession=true;
        } else {
            closeSession=true;
        }
    }

	if (closeSession == true){
		var GetContextDefinitionsActionURL= "App/Ajax/AJAXGateway.aspx?action=99";
		GetContextDefinitionsActionURL = GetContextDefinitionsActionURL;
		callAjaxURL(GetContextDefinitionsActionURL, null, null);
	}
}

function BAReadOnly(){
	var processing = document.getElementById("messageLayer");
	processing.style.visibility = "visible";
	processing.style.display = "block";
	insertAdjacentText(getDescendant(processing, "messageText"), "Read Only");

	getDescendant(processing, "messageBackgroundDiv").className = 'readOnlyBackgroundDiv';
	getDescendant(processing, "messageDiv").className = 'readOnlyMessage';
}

function BAReadOnlyScroll()
{
	getwahas();
	document.getElementById("messageBackgroundDiv").style.top = topscroll;
	document.getElementById("messageDiv").style.top = topscroll;

}

if (!isIE) {
                var _leafElems = ["IMG", "HR", "BR", "INPUT", "img", "hr", "br", "input"];
                var leafElems = {};
                for (var i=0; i<_leafElems.length; i++)
                                leafElems[_leafElems[i]] = true;

                function getOuterHTMLMozilla(node) {
                                var str = "";

                                switch (node.nodeType) {
                                                case 1: // ELEMENT_NODE
                                                                str += "<" + node.nodeName;
                                                                for (var i=0; i<node.attributes.length; i++) {
                                                                                if (node.attributes.item(i).nodeValue != null) {
                                                                                                str += " "
                                                                                                str += node.attributes.item(i).nodeName;
                                                                                                str += "=\"";
                                                                                                str += node.attributes.item(i).nodeValue;
                                                                                                str += "\"";
                                                                                }
                                                                }

                                                                if (node.childNodes.length == 0 && leafElems[node.nodeName])
                                                                                str += " />";
                                                                else {
                                                                                str += ">";
                                                                                str += node.innerHTML;
                                                                                str += "</" + node.nodeName + ">"
                                                                }
                                                                break;

                                                case 3:  //TEXT_NODE
                                                                str += node.nodeValue;
                                                                break;

                                                case 4: // CDATA_SECTION_NODE
                                                                str += "<![CDATA[" + node.nodeValue + "]]>";
                                                                break;

                                                case 5: // ENTITY_REFERENCE_NODE
                                                                str += "&" + node.nodeName + ";"
                                                                break;

                                                case 8: // COMMENT_NODE
                                                                str += "<!--" + node.nodeValue + "-->"
                                                                break;
                                }

                                return str;
                }

                processExpression('try{ HTMLElement.prototype.outerHTML = function(){return getOuterHTMLMozilla(this);}}catch(e){}');
}

function BAReturnControlToJquery(idCase){
    window.parent.postMessage(idCase, "*");
}