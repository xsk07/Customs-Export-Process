//set this variable to 1 if you wish the URLs of the highlighted menu to be displayed in the status bar
var display_url=0;

var ie5=document.all&&document.getElementById;

var ns6=document.getElementById&&!document.all;

var oBAContextMenuSelectedItem = null;


if (ie5||ns6)
var menuobj=document.getElementById("oBAContextMenu");
menuobj.onmouseover=BAHighlightContextMenu;
menuobj.onmouseout=BAlowContextMenu;
menuobj.onclick=BAContextMenuClick;

function showmenuie5(e){
    oBAContextMenuSelectedItem =  ie5? event.srcElement : e.target;
	//Find out how close the mouse is to the corner of the window
	var rightedge=ie5? document.body.clientWidth-event.clientX : window.innerWidth-e.clientX;

	var bottomedge=ie5? document.body.clientHeight-event.clientY : window.innerHeight-e.clientY;
	
	//if the horizontal distance isn't enough to accomodate the width of the context menu
	if (rightedge<menuobj.offsetWidth)
	//move the horizontal position of the menu to the left by it's width
	menuobj.style.left=ie5? document.body.scrollLeft+event.clientX-menuobj.offsetWidth : window.pageXOffset+e.clientX-menuobj.offsetWidth;
	else
	//position the horizontal position of the menu where the mouse was clicked
	menuobj.style.left=ie5? document.body.scrollLeft+event.clientX : window.pageXOffset+e.clientX;

	//same concept with the vertical position
	if (bottomedge<menuobj.offsetHeight)
	menuobj.style.top=ie5? document.body.scrollTop+event.clientY-menuobj.offsetHeight : window.pageYOffset+e.clientY-menuobj.offsetHeight;
	else
	menuobj.style.top=ie5? document.body.scrollTop+event.clientY : window.pageYOffset+e.clientY;

	menuobj.style.visibility="visible";
	return false;

}

function BAHideContextMenu(e){
	menuobj.style.visibility="hidden";
}

function BAHighlightContextMenu(e){
	var firingobj=ie5? event.srcElement : e.target;
	if (firingobj.className=="BACMenItems"||ns6&&firingobj.parentNode.className=="BACMenItems")
	{
		if (ns6&&firingobj.parentNode.className=="BACMenItems") firingobj=firingobj.parentNode; //up one node
		firingobj.style.backgroundColor="highlight";
		firingobj.style.color="white";
		if (display_url==1)
			window.status=event.srcElement.url;
	}
}

function BAlowContextMenu(e){
	var firingobj=ie5? event.srcElement : e.target;
	if (firingobj.className=="BACMenItems"||ns6&&firingobj.parentNode.className=="BACMenItems")
	{
		if (ns6&&firingobj.parentNode.className=="BACMenItems") firingobj=firingobj.parentNode; //up one node
		firingobj.style.backgroundColor="";
		firingobj.style.color="black";
		window.status='';
	}
}

function BAContextMenuClick(e){
	var firingobj=ie5? event.srcElement : e.target;
	if (firingobj.className=="BACMenItems"||ns6&&firingobj.parentNode.className=="BACMenItems")
	{
		if (ns6&&firingobj.parentNode.className=="BACMenItems") firingobj=firingobj.parentNode;
		if (firingobj.getAttribute("action")){
			eval (firingobj.getAttribute("action"));
		}
	}
}

if (ie5||ns6){
	menuobj.style.display='';
	document.onclick=BAHideContextMenu;
}
