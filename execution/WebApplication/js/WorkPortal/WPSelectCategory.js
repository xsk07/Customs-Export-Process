function WPCatHideCategories(bHide){
	if (bHide){
		//document.getElementById("CategoryMainContainer").style.height = "10px";		
		document.getElementById("RDiv1").style.display = "none";		
		document.getElementById("RDiv2").style.display = "none";				
		document.getElementById("CategoryMainContainer").style.display = "none";
		
	}
	else{
		//document.getElementById("CategoryMainContainer").style.height = "150px";
		document.getElementById("CategoryMainContainer").style.display = "block";
		document.getElementById("RDiv1").style.display = "";		
		document.getElementById("RDiv2").style.display = "";				
	}
}
function WPCatSelectAllApp(allApp){	
	WPCatHideCategories(allApp);
	if (allApp){
		document.getElementById("imgAllApp").style.visibility = "visible";
		document.getElementById("imgSelectApp").style.visibility = "hidden";
		getSearchTitle().innerHTML = sAllAppText;
		if (currentSC != null ){
			SContainers[currentSC].Show(false);
		}
	}
	else{
		document.getElementById("imgAllApp").style.visibility = "hidden";
		document.getElementById("imgSelectApp").style.visibility = "visible";
		document.getElementById("CategoryMainContainer").style.height = "150px";
		ShowContainer("SCAPP",true);		
	}
}

var spanSearchTitle = null;
	function getSearchTitle(){
		if (spanSearchTitle == null){
			spanSearchTitle =document.getElementById("spanSearchTitle");
		}
		return spanSearchTitle;
	}
	
	/*********************************************
	BEGIN: Search Container
	**********************************************/
	var SContainers = new Array();
	function ShowSContainerRow(index,sDisplay){
		this.table.rows[index].style.display = sDisplay;
	}
	function GetCLink(){
		var data = this.Path.split('#');
		var sLink = "";
		for(var i=0; i<data.length; i++){
			if (data[i] != ""){
				if (sLink != ""){
					sLink += " - ";
				}
				sLink = sLink + "<a href=\"javascript:ShowContainer('"+data[i]+"',true);\">"+SContainers[data[i]].DisplayName+"</a>";
			}
		}
		return sLink;

	}
	function ShowSContainer(bShow){
		var sDisplay;
		if (bShow){
			sDisplay = "block";
		}
		else{
			sDisplay = "none";
		}		
		this.table.style.display = sDisplay;
		
		for (var i=0; i< this.table.rows.length; i++){
			window.setTimeout("SContainers['"+this.idSC+"'].ShowRow("+i+",'"+sDisplay+"');",100*i);
		}		
	}
	function CreateSearchContainer(idSC){
		SContainers[idSC] = new SearchContainer(idSC);

	}
	function SearchContainer(idSC){
		this.idSC = idSC;
		this.table = document.getElementById(idSC);
		this.Show = ShowSContainer;
		this.ShowRow = ShowSContainerRow;
		this.DisplayName = this.table.attributes["CName"].value;
		this.Path	= this.table.attributes["CPath"].value;
		this.getLink = GetCLink;
		
		this.Show(false);
	}
	var currentSC = null;
	function ShowContainer(idSC,bShow){
		document.getElementById("I_idWFClass").value = "";		
		document.getElementById("I_idCategory").value = "";		
		document.getElementById("I_idApplication").value = "";	
		if (idSC.indexOf("APP") == 0){
			//Set the application
			document.getElementById("I_idApplication").value = idSC.replace("APP","");	
		}
		else if (idSC.indexOf("CAT") == 0){
			//Set the application
			document.getElementById("I_idCategory").value = idSC.replace("CAT","");	
		}
		if (idSC != null){
			var container = SContainers[idSC];
			if (container == null){
				CreateSearchContainer(idSC);
				container = SContainers[idSC];
			}
			if (container != null){	
				container.Show(bShow);
				if (bShow){
					getSearchTitle().innerHTML = container.getLink();
					if (currentSC != null && currentSC != idSC){
						SContainers[currentSC].Show(false);
					}
					currentSC = idSC;
				}
			}
		}
		else if (currentSC != null){
			SContainers[currentSC].Show(bShow);
		}
	}
	/*********************************************
	END: Search Container
	**********************************************/
	function SelectWfClass(wfClass,displayName){
		if (currentSC != null){
			SContainers[currentSC].Show(false);
		}
		getSearchTitle().innerHTML = getSearchTitle().innerHTML + " - "+displayName;
		currentSC = null;
		document.getElementById("I_idWFClass").value = wfClass.replace("WFCLASS","");
		document.getElementById("I_idCategory").value = "";		
		document.getElementById("I_idApplication").value = "";
		if(document.getElementById("h_idWFClassUserDefault") !=null)
		{
			document.getElementById("h_idWFClassUserDefault").value	= wfClass.replace("WFCLASS","");
			AddUser();
		}
		WPCatHideCategories(true);
		
	}
