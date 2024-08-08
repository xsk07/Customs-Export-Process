var contextMenuObj;
var MSIE = navigator.userAgent.indexOf('MSIE')?true:false;
var navigatorVersion = navigator.appVersion.replace(/.*?MSIE (\d\.\d).*/g,'$1')/1;	
var activeContextMenuItem = false;
var activeContextMenu = null;
var idCM = null;
var idCMSource = null;

function hideContextMenu(e)
{
		if(document.all) e = event;
		if(e.button==0 && !MSIE){
			
		}else {			
			BAHideContextMenu();
		}
}
function BAHideContextMenu(){
	if (typeof(activeContextMenu) != 'undefined' && activeContextMenu){			
		activeContextMenu.style.display='none';
	}
}



function BAShowContextMenu(e,sMenuId,source)
{
		if (source.idCM) {
			idCM = source.idCM;
		} else {
			idCM = source.getAttribute("idCM")
		}
		
		idCMSource = source;
		
		BAHideContextMenu();
		activeContextMenu =document.getElementById(sMenuId);
		
		contextMenuObj = activeContextMenu;
		if(activeContextMenuItem)activeContextMenuItem.className='';
		var xPos = e.clientX;
		if(xPos + contextMenuObj.offsetWidth > (document.documentElement.offsetWidth-20)){
			xPos = xPos + (document.documentElement.offsetWidth - (xPos + contextMenuObj.offsetWidth)) - 20;	
		}		
		var yPos = e.clientY;
		if (document.all){
			if(yPos + contextMenuObj.offsetHeight > (document.documentElement.offsetHeight-20)){
				yPos = yPos + (document.documentElement.offsetHeight - (yPos + contextMenuObj.offsetHeight)) - 20;	
			}		
		}
		contextMenuObj.style.left = xPos + 'px';
		contextMenuObj.style.top = yPos + 'px';
		contextMenuObj.style.visibility='visible';
		contextMenuObj.style.display='block';
		contextMenuObj.style.zIndex=100;
		return false;	
	}


function initContextMenu()
{
	document.documentElement.onclick = hideContextMenu;
}
