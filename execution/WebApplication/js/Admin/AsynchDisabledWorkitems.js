	var DefaultTab = 0;
	var CurrentTab = 0;
	var TabNames = new Array();

	$("document").ready(function () {
		setClickParameters();
		setLocalizationLabels();
		BASetLocationFromMain($("#asynchDisabledWorkitemsHeader").text());
		initTabs();
	});
	
	function setClickParameters() {
	}
	
	function setLocalizationLabels() {
	    $("#ui-bizagi-asynch-refresh-label").html($("#asynchRefreshLabel").text());
	    //TabNames[0] = $("#asynchDisabledWorkitemsAsynchExecutions").text();
	    //TabNames[1] = $("#asynchDisabledWorkitemsGroupedByTask").text(); 
	    $("#tab-list").html($("#asynchDisabledWorkitemsAsynchExecutions").text());
	    $("#tab-grouped").html($("#asynchDisabledWorkitemsGroupedByTask").text()); 
	}
	   
	function validateSelected(source, arguments) {
		arguments.IsValid = isAnyElementChecked("dgAsynchDisabledWorkitems", "chkEnable");
	}

	function isAnyElementChecked(sGridName, sElementName) {
		for (var i = 0; document.all[i] != null; i++) {
			var object = document.all[i];

			if (object.name != null &&
				object.name.search(sGridName) >= 0) {
				var sName = object.name.split(":");
				var gridName = sName[0];
				var elementName = sName[2];

				if (gridName == sGridName &&
					elementName == sElementName) {
					if (object.checked == true)
						return true;
				}
			}
		}
		return false;
	}
		
	function initTabs() {
//		var oTabContents = $("#xpTab1");
//		if (oTabContents != null)
	    //			LoadTabs();
	    $("#tabs").tabs();
	}

	function showHideTasks(idWfClass) {
	    var tableRows = $("#tblGrouped .tGrpTask");
	    var appNavigator = navigator.appName;
	    for (var i = 0; i < tableRows.length; i++) {
	        if (tableRows[i].id == "wfclass_" + idWfClass) {
	            tableRows[i].style.display = (tableRows[i].style.display != "table-row") ? "table-row" : "none";

	        }
	    }
	}
	