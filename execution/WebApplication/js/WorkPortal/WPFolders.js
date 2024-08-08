var itemContainers = null;
function BAGetItemContainers(){			
	var iConter = 0;
	itemContainers = new Array();
	var anchors = document.getElementsByTagName("A");
	for (var i=0; i<anchors.length; i++){											
			if (anchors[i].attributes["idFolder"]!= null){
				var idFolder = anchors[i].attributes["idFolder"].value;
				var container = BADDCreateContainer(anchors[i]);
				container.idFolder = idFolder;
				itemContainers[iConter] = container;
				iConter++;
			}
		}

	return itemContainers;
	
}

function BAGetFoldercontainer(idFolder){
	var container = null;
	var anchors = document.getElementsByTagName("A");
	for (var i = 0; i< anchors.length; i++){
		if (anchors[i].getAttribute("idFolder") != null){					
			if (anchors[i].getAttribute("idFolder") == idFolder){
				container = anchors[i];
				break;
			}
		}
	}
	return container;
}

function BAShowFolderWait(show){
	document.getElementById("BAWait").style.display = show?"block":"none";
}