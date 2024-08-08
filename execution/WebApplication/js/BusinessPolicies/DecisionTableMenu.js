var ie	= document.all
var ns6	= document.getElementById&&!document.all

var currentMenu = null ;
var currentMenuObject = null; 
var overpopupmenu = false;
var displayingMenu = false;

function popupMenu(e, menuId, customHandler)
{
	var obj = ns6 ? e.target.parentNode : event.srcElement.parentElement;
	var clickType = ie ? event.button : e.button;
	
	if (clickType == 2 ) {  // Right click
		currentMenu = document.getElementById(menuId);
		displayingMenu = true;
		document.oncontextmenu = showPopupMenu;
		try {
			customHandler(obj);
		}catch(e){}
		
	} else {
		hideMenu(menuId);
		document.oncontextmenu = null;
		return false;
	}
}

function hideMenu(){
	if (displayingMenu == true)
		return;
		
	if (currentMenu != null) {
		currentMenu.style.display = "none" ;
	}
	currentMenu = null;
	currentMenuObject = null;
	document.oncontextmenu = null;
}

// POP UP MENU
function showPopupMenu(e)
{
	var	obj = ns6 ? e.target.parentNode : event.srcElement.parentElement;	
	
	if (currentMenu == null)
		return false;
	
	currentMenuObject = obj ;
	if (ns6)
	{
		currentMenu.style.left = e.clientX+document.body.scrollLeft;
		currentMenu.style.top = e.clientY+document.body.scrollTop;
	} else
	{
		currentMenu.style.pixelLeft = event.clientX+document.body.scrollLeft;
		currentMenu.style.pixelTop = event.clientY+document.body.scrollTop;
	}
	currentMenu.style.display = "block";
	
	var menuItems = getDescendantsByClassName(currentMenu, 'popupMenuItem');
	
	for (var i=0; i < menuItems.length; i++)
	{
		menuItems[i].className = 'popupMenuItem';
	}
	
	displayingMenu = false;	
	return false ;
}

function hideAllMenus(){
	hideMenu();
}

document.onclick = hideAllMenus;

