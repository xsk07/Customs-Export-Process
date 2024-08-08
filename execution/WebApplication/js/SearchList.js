var ie5=document.all&&document.getElementById;

var ns6=document.getElementById&&!document.all;

var oBAContextMenuSelectedItem = null;

initContextMenu();
function showSearchListCMenu(e){
    oBAContextMenuSelectedItem =  ie5? event.srcElement : e.target;
	//Find out how close the mouse is to the corner of the window
	BAShowContextMenu(e,'CtMenuSearchList',oBAContextMenuSelectedItem);	
	return false;
}

