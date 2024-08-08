/*	This script file contains the logis used to display, hide , refresh and resize
the left panel of the work portal. In this panel the user can find some containers, for example
the bizagi cases, smart folders and bizagi queries. When the user select one container, this container
is maximized and the others are minimized.

*/


///This function finds out the new size of the left panel and each container
function onResize(){
	if (oBAActiveContainer){
		oBAActiveContainer.Show();
	}
}
//Assign the onresize method to the window on resize event
window.onresize = onResize; 

//Maximizes the given container
function BAShowData(sContainerName){
	BAContainers[sContainerName].Show();
}
//Refresh the data in the given container
function BARefreshData(sContainerName){
	BAContainers[sContainerName].Loaded = false;
	BAContainers[sContainerName].Show();
}	

var BAContainers = new Array();
var oBAActiveContainer = null;
var imgUp=null;
var imgDown=null;
var iContainers = 0;
//Create the container objects. 
function BALPLoad(){
	var oTable = document.getElementById("BALPMainTable");
	//Find out each container element:
	var oFirstContainer = null;
	for(var i=0;i<oTable.rows.length;i=i+1){
		var sName = oTable.rows[i].attributes["BAName"].value;	
		var sFrameName = "ifr"+sName;
		BAContainers[sName] = new BALPContainer(sName,oTable.rows[i].attributes["BARef"].value,sFrameName,oTable.rows[i]);			
		if (oFirstContainer == null){
			oFirstContainer = BAContainers[sName];
		}
		iContainers++;
	}			
	imgUp = document.getElementById("imgUp");
	imgDown = document.getElementById("imgDown");
	if (oFirstContainer != null){
		oFirstContainer.Show();
	}
}
//Container object. Each container has two rows in the table
//The first one is the container title, the second one is the container element.
//The loaded page is displayed in the container element (second row)
function BALPContainer(sName,BARef,sFrameName,TRContainer){
	this.sName = sName;
	this.BARef= BARef; //HTTP of this container 
	this.FrameName = sFrameName;	
	//alert (typeof(document.getElementById(sFrameName)));
	this.Container = document.getElementById(sFrameName);
	this.TRContainer = TRContainer;
	//Add class methods
	this.Reload = BAReloadContainer;
	this.Show = BAShowContainer;
	this.SetData = 	BASetContainerData;	
	this.imgStatus = document.getElementById("BAImg"+sName);

	//Initialize element		
	this.Loaded = false;
}
function BASetContainerData(strData){
	this.Container.innerHTML = strData;
}
function BASetContainerLoadingLogo(){
	this.Container.innerHTML= "<table width='100%' height='100%'><tr><td align='center'><img src='../img/WorkPortal/BALoadingFrame.gif' alt='Loading'></td></tr></table>";
}
function BAReloadContainer(){
	this.Container.src = this.BARef;
	this.Loaded = true;
}			
function BAShowContainer(){
	if (!this.Loaded){
		//Load the frame
		this.Reload();
	}
	var iHeight = 0;
	var iHeaderHeight = 21;
	var iTop = 0;
	
	if (typeof(BA_LPTOP) != 'undefined')
		iTop = BA_LPTOP;
	
	if (document.all){
		iHeight = document.body.clientHeight-iHeaderHeight*iContainers - iTop;
	}
	else{
		iHeight = innerHeight-iHeaderHeight*iContainers - iTop;
	}
	
	if (oBAActiveContainer){
		oBAActiveContainer.Container.style.display="none";
		oBAActiveContainer.TRContainer.style.height = "1px";
		oBAActiveContainer.imgStatus.src = imgUp.src;
		
	}
	oBAActiveContainer = this;				
	oBAActiveContainer.Container.style.display="block";
	oBAActiveContainer.TRContainer.style.height = "100%";
	if (iHeight < 0 ){
		iHeight  = 0;
	}
	//oBAActiveContainer.Container.style.height = '100%';
	oBAActiveContainer.Container.style.height = iHeight;
	oBAActiveContainer.imgStatus.src = imgDown.src;

}	
