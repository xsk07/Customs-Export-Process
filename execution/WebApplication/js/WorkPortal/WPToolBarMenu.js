///This javascript faile contains all the code used in order to display
//the tool bar menu for Bizagi Application


//This variable is used in order to know the browser settings
var soporta = new DetectorNavegador();

var menu = new Array();
var menuActivo = null;


//Change given element opacity
function changeOpacity(oMenuContainer,value){
	if (oMenuContainer != null){
	    if (value == 0){	    
			oMenuContainer.style.visibility = "visible";				
		}		
		oMenuContainer.style.opacity = value/100;
		oMenuContainer.style.filter = 'alpha(opacity=' + value*1 + ')';	
	}	
}
//Change the menu containter opacity. It changes the menu item
//and the iframe
function setOpacity(sMenuContainerId,value){
	var oMenuContainer = document.getElementById(sMenuContainerId);
	var IfrRef = document.getElementById('MenuIFrame');	
	if (oMenuContainer != null){
	    changeOpacity(IfrRef,value);	    
	    changeOpacity(oMenuContainer,value);
	}
}

//This function is called in order to display the menu container
//with a visual efect. The menu container and the iframe container
//are changing in order to appear in a cool way.
function initFade(sMenuContainerId)
{
	var DivRef = document.getElementById(sMenuContainerId);	
	var IfrRef = document.getElementById('MenuIFrame');	
	IfrRef.style.width = DivRef.offsetWidth;
	IfrRef.style.height = DivRef.offsetHeight;
	IfrRef.style.top = DivRef.style.top;
	IfrRef.style.left = DivRef.style.left;
	IfrRef.style.zIndex = DivRef.style.zIndex - 1;	
	for (var i=0;i<=100;i=i+5)
		setTimeout('setOpacity("'+sMenuContainerId+'",'+i+')',2*i);
	return false;
}
//This script section is used in order to desapear the bizagi menu
//when the user is not longer use it. It only works in IE.
var oHideTimer = null;
function SetHideBAMenuTime(){
 CancelHideBAMenuTime();
 oHideTimer = window.setTimeout("HideBAMenu()",500);
}
//If the user is working over the menu the HideTimer is cancelled
function CancelHideBAMenuTime(){
   if (oHideTimer != null){
	 window.clearTimeout(oHideTimer);
   }
}


//This function is used to update the number of cases asigned to the current user
//in the tool bar
function BAUpdateToolbar(iCases){  
  if (parent.parent.BAStatusBar && parent.parent.BAStatusBar.UpdateTotalUrgentCases)
    parent.parent.BAStatusBar.UpdateTotalUrgentCases(iCases);
  //else
	//setTimeout('BAUpdateToolbar("'+iCases+'")',200);    
}



// This class is used to contain the browser settings
function DetectorNavegador() {
  this.NS4 = document.layers;
  this.IE4 = document.all;
  this.DOM = document.getElementById;
  this.DHTML = this.NS4 || this.IE4 || this.DOM;
}
//This function is used to show the given bizagi menu container
function BAOpenWPMenu(mainMenuElement,sMenuToOpen)
{ 
	if (menu[sMenuToOpen])
	{
		menu[sMenuToOpen].left = findPosX(mainMenuElement);
		
		menu[sMenuToOpen].activar();
	}

	try
	{
	    event.cancelBubble = true;
	}
	catch(err){}
	return false;
}
//Gets the real height of the given element. This function is used
//in case that the given element does not have explicit height or with
//values.
function GetElementHeight(oElement){
	var iHeight = 0;
	for (var i=0; i<oElement.childNodes.length; i++){
	    if (typeof(oElement.childNodes[i].offsetHeight) != 'undefined'){
			iHeight = iHeight+oElement.childNodes[i].offsetHeight;
		}
	}
	return iHeight;
}
//Gets the real width of the given element. This function is used
//in case that the given element does not have explicit height or with
//values.
function GetElementWidth(oElement){
	var iWidth = 0;
	for (var i=0; i<oElement.childNodes.length; i++){
	    if (typeof(oElement.childNodes[i].offsetWidth) != 'undefined'){
			iWidth = iWidth+oElement.childNodes[i].offsetWidth;
		}
	}
	return iWidth;
}
//Activates the current menu and hides the old menu
function activarMenu() {
  CancelHideBAMenuTime();
  if (soporta.DHTML && menuActivo != this) {
    if (menuActivo) menuActivo.ocultar();
    menuActivo = this;
    this.mostrar();
  }  
}

//Hides the current menu
function ocultarMenu() {
  if (!eval(this.capaRefStr)) return;
  eval(this.capaRefStr + this.estiloRefStr + '.visibility = "hidden"');
  eval(this.capaRefStr + this.estiloRefStr + '.display = "none"');
  
  var IfrRef = document.getElementById('MenuIFrame');	
  IfrRef.style.visibility = "hidden";
   
}
//Change the position of the current menu
function cambiarPosicionMenu() {  
  eval(this.capaRefStr + this.estiloRefStr + this.leftRefStr + ' = this.left + ' + this.leftOffsetStr);
  eval(this.capaRefStr + this.estiloRefStr + this.topRefStr + ' = this.top + ' + this.topOffsetStr);  
}

// Hide the active menu
function ocultarMenuActivo(e) {
  if (menuActivo) {
    menuActivo.ocultar();
    menuActivo = null;
  }
}

function moverMenuActivo(e) {
  if (menuActivo)
    menuActivo.cambiarPosicion();
}

// Creates the Bizagi menu collection
function BAinitializeMenu() {
  if (soporta.DHTML) {
    if (soporta.NS4)
      document.captureEvents(Event.MOUSEUP);
    document.onmouseup = ocultarMenuActivo;
  }
  var iLeftMargin = 180;
  if (document.getElementById("MenuCases")){
	menu["Cases"] = new Menu("MenuCases", 39, 193-iLeftMargin, 100);
  }
  if (document.getElementById("MenuBAM")){
	menu["BAM"] = new Menu("MenuBAM", 39, 289-iLeftMargin, 100);
  }
  if (document.getElementById("MenuAnalyzer")){
	menu["Analyzer"] = new Menu("MenuAnalyzer", 39, 289-iLeftMargin, 100);
  }
  else{
	iLeftMargin = iLeftMargin+100;
  }
  if (document.getElementById("MenuCookPit")){
	menu["CookPit"] = new Menu("MenuCookPit", 39, 390-iLeftMargin, 100);
  }
  else{
	iLeftMargin = iLeftMargin+113;
  }
  if (document.getElementById("MenuAdmin")){
	menu["Admin"] = new Menu("MenuAdmin", 39, 490-iLeftMargin, 100);
  } 
  else{
  	iLeftMargin = iLeftMargin+113;
  }
  if (document.getElementById("MenuTools")){
	menu["Tools"] = new Menu("MenuTools", 39, 550-iLeftMargin, 100);
  } 
}
//Display the current menu
function mostrarMenu() {
	if (soporta.DOM)
		this.domRef.style.display = "block";
	
	if (!eval(this.capaRefStr)) return;
	this.cambiarPosicion();
	//Para la opacidad
	initFade(this.capaID);     
}
//Menu class
function Menu(capaID) {
  this.activar = activarMenu;
  this.capaID = capaID;
  this.mostrar = mostrarMenu;
  this.ocultar = ocultarMenu;  
  this.cambiarPosicion = cambiarPosicionMenu;
  if (soporta.DOM) {
    this.domRef = document.getElementById(capaID);
	if (!soporta.IE4) {
	  this.domRef.style.position = "fixed";
	}
	//this.domRef.style.height = GetElementHeight(this.domRef);
	this.domRef.style.width = GetElementWidth(this.domRef)+10;
	
  }	
  
  
  this.capaRefStr = (soporta.NS4) ?
    'document["'+capaID+'"]' :
    ((soporta.IE4) ? 'document.all["'+capaID+'"]' : 'this.domRef');
  this.estiloRefStr = (soporta.NS4) ? '' : '.style';
  this.topRefStr = (soporta.IE4) ? '.pixelTop' : '.top';
  this.leftRefStr = (soporta.IE4) ? '.pixelLeft' : '.left';
  this.topOffsetStr = (soporta.NS4) ? 'pageYOffset' : (soporta.IE4 ? 'document.body.scrollTop' : '0');
  this.leftOffsetStr = (soporta.NS4) ? 'pageXOffset' : (soporta.IE4 ? 'document.body.scrollLeft' : '0');
  this.top = 40;
  this.left = 0;
  this.cambiarPosicion();
  if (soporta.DOM)
	this.domRef.style.display = "none";
}
//Finds out the real position of the given object
function findPosX(obj)
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
function findPosY(obj)
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

