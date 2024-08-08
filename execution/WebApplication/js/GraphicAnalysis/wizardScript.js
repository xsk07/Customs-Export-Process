function showWizard(iStep) {
	var div = null;
	var imgTitle = document.getElementById("imgTitle");
	var txtTitle = document.getElementById("txtTitle");
	if (iStep == 1) {
		setHelp(getFriendlyName('WizardHelpTitle'), getFriendlyName('WizardStep1'), 2);
		imgTitle.src = "../../img/graphicanalysis/IconoMedidas.gif";
		txtTitle.innerHTML = getFriendlyName("WizardStep1");
		div = document.getElementById("wizardStep1");
		div.style.visibility = "visible";
		div.style.display = "block";
		div = document.getElementById("wizardStep2");
		div.style.visibility = "hidden";
		div.style.display = "none";
	}
	else if (iStep == 2) {
		setHelp(getFriendlyName('WizardHelpTitle'), getFriendlyName('WizardStep2'), 2);
		imgTitle.src = "../../img/graphicanalysis/IconoDimensiones.gif";
		txtTitle.innerHTML = getFriendlyName("WizardStep2");
		div = document.getElementById("wizardStep2");
		div.style.visibility = "visible";
		div.style.display = "block";
		div = document.getElementById("wizardStep1");
		div.style.visibility = "hidden";
		div.style.display = "none";
	}
	else
		return;
}

function toggleCollapse(sDiv) {
	var div = document.getElementById(sDiv.replace("\"", "\\\""));
	if (div) {
		var img = document.getElementById(sDiv.replace("\"", "\\\"") + "Img");
		if (div && div.style.visibility == "hidden") {
			div.style.visibility = "visible";
			div.style.display = "block";
			img.src = "../../img/graphicanalysis/merge.gif"
		}
		else {
			div.style.visibility = "hidden";
			div.style.display = "none";
			img.src = "../../img/graphicanalysis/expand.gif";
		}
	}
}

function addWizardMeasures() {
	selectedMeasures = new Array();
	var inputs = document.getElementsByTagName("input");
	for (var i = 0; i < inputs.length; i++) {
		if (inputs[i].id.indexOf("check__") == 0) {
			var checkName = inputs[i].id.replace("check__", "").split("__");
			var sColumnName = checkName[0];
			var sFunction = checkName[1];
			var sColumnDisplayName = checkName[2];
			var check = document.getElementById(inputs[i].id);

			if (check.checked) {
				var measure = findItemByColumnName(sColumnName, selectedMeasures);
				if (!measure) {
					measure = new Measure(sColumnDisplayName, sColumnName, "String");
					selectedMeasures[selectedMeasures.length] = measure;
				}

				measure.functions[measure.functions.length] = sFunction;
			}
		}
	}

	/*for (var i = 0; i < selectedMeasures.length; i++){
		alert(selectedMeasures[i].columnName);
		for (var j = 0; j < selectedMeasures[i].functions.length; j++){
			alert(selectedMeasures[i].functions[j]);
		}
	}*/
	if (selectedMeasures.length > 0)
		showWizard(2);
	else {
		setHelp(getFriendlyName('WizardHelpNoMeasuresTitle'), getFriendlyName('WizardHelpNoMeasuresText'), 1);
	}
}

function addWizardDimensions() {
	var dl = document.getElementById("dropContent2");
	selectedDimensions = new Array();
	for (var i = 0; i < dl.childNodes.length; i++) {
		dd = dl.childNodes[i];
		if (dd && dd.id && dd.id.indexOf("dragableElement") == -1) {
			var sColumnId = dd.id.replace("box_", "");
			var dimension = findItemByColumnId(sColumnId, allDimensions);

			if (dimension)
				selectedDimensions[selectedDimensions.length] = dimension;
		}
	}

	/*
			for (var i = 0; i < selectedDimensions.length; i++){
				alert(selectedDimensions[i].columnName + ", " + selectedDimensions[i].dataType);
			}
	*/
	if (selectedDimensions.length > 0) {
		setHelp(getFriendlyName('WizardHelpTitle'), getFriendlyName('WizardHelpFinished'), 2);

		var form = document.createElement("form");

		form.setAttribute("id", "formParams");
		form.setAttribute("action", "GraphicAnalysis.aspx");
		form.setAttribute("method", "post");

		var params = saveResource(document.frm, false, true);

		input = document.createElement("input");
		input.setAttribute("id", "h_CacheKey");
		input.setAttribute("name", "h_CacheKey");
		input.setAttribute("type", "hidden");
		input.setAttribute("value", params["h_CacheKey"]);
		form.appendChild(input);

		input = document.createElement("input");
		input.setAttribute("id", "h_Dimensions");
		input.setAttribute("name", "h_Dimensions");
		input.setAttribute("type", "hidden");
		input.setAttribute("value", params["h_Dimensions"]);
		form.appendChild(input);

		input = document.createElement("input");
		input.setAttribute("id", "h_Measures");
		input.setAttribute("name", "h_Measures");
		input.setAttribute("type", "hidden");
		input.setAttribute("value", params["h_Measures"]);
		form.appendChild(input);

		if (params["h_dimensionfilter"]) {
			input = document.createElement("input");
			input.setAttribute("id", "h_dimensionfilter");
			input.setAttribute("name", "h_dimensionfilter");
			input.setAttribute("type", "hidden");
			input.setAttribute("value", params["h_dimensionfilter"]);
			form.appendChild(input);
		}

		document.getElementsByTagName("body")[0].appendChild(form);
		document.getElementById("formParams").submit();
	}
	else
		setHelp(getFriendlyName('WizardHelpNoDimensionsTitle'), getFriendlyName('WizardHelpNoDimensionsText'), 1);
}

function renderWizardMeasures(sColumnName, sColumnDisplayName, sFunctions) {
	var tr = document.createElement("tr");
	var tdIcon = document.createElement("td");
	tdIcon.width = "3%";
	tdIcon.vAlign = "top";
	tdIcon.align = "center";
	var aIcon = document.createElement("a");
	aIcon.href = 'javascript:toggleCollapse("' + sColumnName.replace("\"", "\\\"") + '");';
	var imgIcon = document.createElement("img");
	imgIcon.id = sColumnName.replace("\"", "\\\"") + "Img";
	imgIcon.src = "../../img/graphicanalysis/expand.gif";
	imgIcon.width = "7";
	imgIcon.height = "7";
	imgIcon.hspace = "4";
	imgIcon.vspace = "4";
	imgIcon.border = "0";
	aIcon.appendChild(imgIcon);
	tdIcon.appendChild(aIcon);
	tr.appendChild(tdIcon);

	var tdText = document.createElement("td");
	tdText.width = "97%";
	var aText = document.createElement("a");
	aText.href = 'javascript:toggleCollapse("' + sColumnName.replace("\"", "\\\"") + '");';
	aText.className = "itemList";
	var tnText = document.createTextNode(getFriendlyName(sColumnDisplayName.replace("\"", "\\\"")));
	aText.appendChild(tnText);
	tdText.appendChild(aText);
	var divText = document.createElement("div");
	divText.id = sColumnName.replace("\"", "\\\"");
	divText.style.visibility = "hidden";
	divText.style.display = "none";

	var divTextTable = document.createElement("table");
	var divTextTableBody = document.createElement("tbody");

	if (!sFunctions)
		sFunctions = "";
	if (sColumnName != "Counter") {
		divTextTableBody.appendChild(createTR(sColumnName, getFriendlyName("FunctionMax"), "max", "MaxIcon.gif", sFunctions.indexOf('max') > -1, sColumnDisplayName));
		divTextTableBody.appendChild(createTR(sColumnName, getFriendlyName("FunctionMin"), "min", "MinIcon.gif", sFunctions.indexOf('min') > -1, sColumnDisplayName));
		divTextTableBody.appendChild(createTR(sColumnName, getFriendlyName("FunctionAvg"), "avg", "AverageIcon.gif", sFunctions.indexOf('avg') > -1, sColumnDisplayName));
		divTextTableBody.appendChild(createTR(sColumnName, getFriendlyName("FunctionSum"), "sum", "SumIcon.gif", sFunctions.indexOf('sum') > -1, sColumnDisplayName));
	}
	else
		divTextTableBody.appendChild(createTR(sColumnName, getFriendlyName("FunctionCount"), "count", "CountIcon.gif", sFunctions.indexOf('count') > -1, sColumnName));

	divTextTable.appendChild(divTextTableBody);

	divText.appendChild(divTextTable);

	tdText.appendChild(divText);

	tr.appendChild(tdText);

	return tr;
}

function createTR(sColumnName, sName, sFunction, sImage, bChecked, sColumnDisplayName) {
	var divTextTableTr1 = document.createElement("tr");
	var divTextTableTd1 = document.createElement("td");
	var divTextTableTd1Check = document.createElement("input");
	divTextTableTd1Check.id = "check__" + sColumnName + "__" + sFunction + "__" + sColumnDisplayName;
	divTextTableTd1Check.type = "checkbox";
	if (bChecked) {
		divTextTableTd1Check.setAttribute("CHECKED", "true");
	}
	var divTextTableTd1Img = document.createElement("img");
	divTextTableTd1Img.src = "../../img/graphicanalysis/" + sImage;
	var divTextTableTd1Text = document.createTextNode("  " + getFriendlyName(sName));
	divTextTableTd1.appendChild(divTextTableTd1Check);
	divTextTableTd1.appendChild(divTextTableTd1Img);
	divTextTableTd1.appendChild(divTextTableTd1Text);
	divTextTableTr1.appendChild(divTextTableTd1);

	return divTextTableTr1;
}

function renderWizardDimension(sColumnName, sColumnId) {
	var dd = document.createElement("dd");
	dd.id = "box_" + (sColumnId ? sColumnId : sColumnName);
	dd.className = "ddWizard";
	var aDD = document.createElement("a");
	aDD.hRef = "javascript:void(0);";
	aDD.className = "itemList";
	//		aDD.setAttribute("class","itemList");
	var aTextNode = document.createTextNode(getFriendlyName(sColumnName));
	aDD.appendChild(aTextNode);
	dd.appendChild(aDD);

	return dd;
	//<dd id="box_Medida 1" class="ddWizard"><a  class="itemList" href="javascript:void(0);">Medida 1</a></dd>
}

