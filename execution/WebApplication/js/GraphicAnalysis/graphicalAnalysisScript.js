/**
 * Property for checking if all pie charts are loaded
 */
var readyAllPieCharts = false;


function ShowBADialog(sWindowTitle, sDialog, sWidth, sHeight, oAsyncMethod) {
    if (document.getElementById("window_id" + sDialog))
        return;

    if (sDialog == "addDimensionsDialog")
        populateAddDimensionsDialog();
    else
        populateAddMeasuresDialog();

    var BADialog = new Window("window_id" + sDialog, { title: sWindowTitle, width: sWidth, height: sHeight, resizable: false, hideEffect: Element.hide, showEffect: Element.show, destroyOnClose: true });

    var div = document.getElementById(sDialog);
    var containerDiv = document.createElement("div");
    containerDiv.style.backgroundColor = "#F0F0F0";
    containerDiv.style.width = sWidth;
    containerDiv.style.height = sHeight;
    containerDiv.style.top = 0;
    containerDiv.style.left = 0;
    containerDiv.style.position = "relative";
    containerDiv.style.display = "block";
    containerDiv.id = "div" + sDialog;
    containerDiv.className = "contentBkgorund";
    containerDiv.innerHTML = div.innerHTML;

    BADialog.setContent(containerDiv, false, false);
    BADialog.setDestroyOnClose();
    BAAsyncMethod = oAsyncMethod;
    BADialog.showCenter(false);
}

function saveResource(form, doSubmit, bIsExcel) {
    if (doSubmit)
        startProcessing();
    //variable to stop the timer
    hasChanges = false;
    var dimensions = document.getElementById("h_Dimensions");
    var sDimensions = "";
    var aDimensionsFilters = new Array();
    for (var iDimension = 0; iDimension < selectedDimensions.length; iDimension++) {
        sDimensions += (selectedDimensions[iDimension].columnId ? selectedDimensions[iDimension].columnId : selectedDimensions[iDimension].columnName) + ",";
        if (selectedDimensions[iDimension] && selectedDimensions[iDimension].filter && selectedDimensions[iDimension].filter.length > 0)
            aDimensionsFilters[aDimensionsFilters.length] = "h_dimensionfilter_" + selectedDimensions[iDimension].columnId + "=" + selectedDimensions[iDimension].filter;
    }
    if (sDimensions.length > 0) {
        sDimensions = sDimensions.substring(0, sDimensions.length - 1);
    }
    dimensions.value = sDimensions;

    var sMeasures = "";
    for (var iMeasure = 0; iMeasure < selectedMeasures.length; iMeasure++) {
        var measure = selectedMeasures[iMeasure];
        for (var iFunction = 0; iFunction < measure.functions.length; iFunction++) {
            sMeasures += measure.functions[iFunction] + "(" + measure.columnName + "),";
        }
    }

    if (sMeasures.length > 0) {
        sMeasures = sMeasures.substring(0, sMeasures.length - 1);
    }

    var measures = document.getElementById("h_Measures");
    measures.value = sMeasures;

    if (bIsExcel) {
        var params = new Object();

        var h_CacheKey = document.getElementById("h_CacheKey");

        params['h_CacheKey'] = h_CacheKey.value;
        params['h_Dimensions'] = dimensions.value;
        params['h_Measures'] = measures.value;

        if (aDimensionsFilters.length > 0)
            params['h_dimensionfilter'] = aDimensionsFilters.join("&");

        params['x2xls'] = 'true';
        return params;
    }
    else {
        if (doSubmit && dimensions.value.length > 0 && measures.value.length > 0) {
            var h_CacheKey = document.getElementById("h_CacheKey");
            var sURL = "../Ajax/AJAXGateway.aspx?action=50&h_CacheKey=" + h_CacheKey.value + "&h_Dimensions=" + dimensions.value + "&h_Measures=" + measures.value;

            if (aDimensionsFilters.length > 0)
                sURL += "&" + aDimensionsFilters.join("&");

            callAjaxURL(sURL, renderContents);
            return sURL;
        }
        else if (!doSubmit && dimensions.value.length > 0 && measures.value.length > 0) {
            var params = new Object();
            var h_CacheKey = document.getElementById("h_CacheKey");

            params['h_CacheKey'] = h_CacheKey.value;
            params['h_Dimensions'] = dimensions.value;
            params['h_Measures'] = measures.value;


            if (aDimensionsFilters.length > 0)
                params['h_dimensionfilter'] = aDimensionsFilters.join("&");

            return params;
        }
    }
}

function renderContents(jsonData) {
    if (!jsonData) {
        jsonData = document.getElementById("h_jsondata").value;
    }
    else {
        try {
            JSON.parse(jsonData);
        } catch (e) {
            window.location.reload();
        }
        jsonData = jsonData.replace(/\"/g, '\'');
        document.frm.h_jsondata.value = jsonData;
        //TODO: clear all data
        m_dataTable = null;
    }


    if (jsonData && jsonData.length > 0) {
        mainTable.jsonData = jsonData;
        mainTable.render();

        var dataTable = getNewDataTable(document.frm.h_jsondata.value);
        if (bShowSeparator) {
            var chartSeparatorColumnsCombo = document.getElementById("h_chartseparatorcolumns");
            for (var jColumn = chartSeparatorColumnsCombo.value; jColumn <= dataTable.ExtendedProperties["LastSelectedDimension"]; jColumn++) {
                dataTable.Columns[jColumn].ExtendedProperties["Merge"] = false;
            }
            fillSeparatorColumnsCombo(chartSeparatorColumnsCombo.value);
            secondaryTable.jsonData = null;
            secondaryTable.dataTable = dataTable;
            secondaryTable.render();
        }


        showTabs();
        myObserver = {
            onReadyChart: function (eventName, self) {
                endProcessing();
                showTabs();
                createPieChart();
                hideTabs();
                //Add event click to the tab Measure details (where pie charts loaded)
				document.getElementsByClassName("old-render-tab")[4].addEventListener('click', function(){
					if(!readyAllPieCharts){
						startProcessing();
					}
				});
            },
			onReadyAllPieCharts: function(){
				readyAllPieCharts = true;
				endProcessing();
			}
        }
		Windows.observers = []; // remove old subscriptions
        Windows.addObserver(myObserver);
        createChart();
		readyAllPieCharts = dataTable.Rows.length === 0;

    }
    else {
        saveResource(null, true, false);
    }
}
/**         
 * Work around to fix bug on IE (Hidden charts)
 * This method is responsible for displaying the content of all the tabs.
 *  It is part of a fix to render the graph in IE, also so that the labels of the 
 * x axis do not remain on the graph 
 */
function showTabs() {
    var currentTab = getCurrentTab() + 1;
    for (var i = 1; i < 3; i++) {
        if (i !== currentTab) {
            var tab = document.getElementById("xpTab" + i);
            tab.style.position = 'absolute';
            tab.style.top = "5000px";
            tab.style.display = 'block';
        }
    }
}
/**
 *  Work around to fix bug on IE (Hidden charts)
 * This method is responsible for hiding the content of all the tabs.
 *  It is part of a fix to render the graph in IE, also so that the labels of the 
 * x axis do not remain on the graph 
 */
function hideTabs() {
    var currentTab = getCurrentTab() + 1;
    for (var i = 1; i < 3; i++) {
        var tab = document.getElementById("xpTab" + i);
        tab.style.position = 'relative';
        tab.style.top = "auto";
        if (i !== currentTab) {
            tab.style.display = 'none';
        }
    }
}


function resizeContainers(bOnLoad) {
    startProcessing();
    var xpTab1 = document.getElementById("xpTab1");
    var xpTab2 = document.getElementById("xpTab2");
    var xpTab3 = document.getElementById("xpTab3");
    var currentTab = document.getElementById("xpTab" + (getCurrentTab() + 1));
    var tabWith = findPos(currentTab)[0];
    var tabHeight = findPos(currentTab)[1];

    var windowSize = getWindowSize();
    var width = windowSize[0] - tabWith - 40;
    var height = windowSize[1] - tabHeight - 60;

    m_containerHeight = height;
    m_containerWidth = width;

    if (width < 350)
        width = 350;

    if (height < 340)
        height = 340;

    xpTab1.style.width = width;
    xpTab2.style.width = width;
    xpTab3.style.width = width;

    xpTab1.style.height = height;
    xpTab2.style.height = height;
    xpTab3.style.height = height;

    m_ChartWidth = width - 10;

    m_PiesPerRow = parseInt(width / 260);
    m_PieWidth = (width - (15 * m_PiesPerRow)) / m_PiesPerRow;
    m_PieHeight = m_PieWidth * 0.9;

    mainTable.width = width - 10;
    mainTable.height = height - 10;

    if (!bShowSeparator) {
        m_ChartHeight = height - 10;
    }
    else {
        m_ChartHeight = height - 10;
        m_ChartHeight = m_ChartHeight / 2 - 5;
        secondaryTable.height = mainTable.height / 2;
        secondaryTable.width = mainTable.width;
    }

    var measuresList = document.getElementById("listaMedidas");
    var dimensionsList = document.getElementById("listaDimen");
    var dimensionsClipingList = document.getElementById("dimensionsClipingList");
    var measuresClipingList = document.getElementById("measuresClipingList");
    dimensionsClipingList.style.height = height / 2 - 45;
    measuresClipingList.style.height = height / 2 - 45;
    measuresList.style.height = height / 2 - 5;
    dimensionsList.style.height = height / 2 - 5;

    var pieChartContainer = document.getElementById("piechartdiv");
    pieChartContainer.style.width = width - 10;
    pieChartContainer.style.height = height - 10;

    var gridContainer = document.getElementById("gridContainer");
    gridContainer.style.width = width;
    gridContainer.style.height = height;

    //onResize event 
    if (bOnLoad != false) {
        renderContents();
    }
}

function getWindowSize() {
    var myWidth = 0, myHeight = 0;
    if (typeof (window.innerWidth) == 'number') {
        //Non-IE
        myWidth = window.innerWidth;
        myHeight = window.innerHeight;
    } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
        //IE 6+ in 'standards compliant mode'
        myWidth = document.documentElement.clientWidth;
        myHeight = document.documentElement.clientHeight;
    } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
        //IE 4 compatible
        myWidth = document.body.clientWidth;
        myHeight = document.body.clientHeight;
    }
    return [myWidth, myHeight];
}



function changeSeparatorColumns() {
    startProcessing();
    var chartSeparatorColumnsCombo = document.getElementById("h_chartseparatorcolumns");
    fillChartXML(chartSeparatorColumnsCombo.value);

    var dataTable = getNewDataTable(document.frm.h_jsondata.value);
    for (var jColumn = 0; jColumn <= dataTable.ExtendedProperties["LastSelectedDimension"]; jColumn++) {
        dataTable.Columns[jColumn].ExtendedProperties["Merge"] = jColumn < chartSeparatorColumnsCombo.value;
    }

    secondaryTable.dataTable = dataTable;
    secondaryTable.render();

    changeChartType();
}


function showSeparator() {
    startProcessing();
    var mainchartdata = document.getElementById("mainchartdivgrid");
    var mainchart = document.getElementById("mainchartdiv");
    var chartSeparatorColumnsCombo = document.getElementById("h_chartseparatorcolumns");

    bShowSeparator = !bShowSeparator;
    if (bShowSeparator) {
        // resize chart and set visibility properties
        mainchartdata.style.visibility = "visible";
        mainchartdata.style.display = "block";
        mainchartdata.style.height = "30%";
        mainchart.style.height = "70%";
        fillSeparatorColumnsCombo();
        fillChartXML(chartSeparatorColumnsCombo.value);
        var dataTable = getNewDataTable(document.frm.h_jsondata.value);
        for (var jColumn = chartSeparatorColumnsCombo.value; jColumn <= dataTable.ExtendedProperties["LastSelectedDimension"]; jColumn++) {
            dataTable.Columns[jColumn].ExtendedProperties["Merge"] = false;
        }

        if (!secondaryTable) {
            secondaryTable = new BizAgiGridTable(null, mainchartdata, dataTable, mainTable.width, mainchartdata.style.height, false, true, true);
        }
        else {
            secondaryTable.dataTable = dataTable;
        }
        secondaryTable.render();
    }
    else {
        fillChartXML();
        mainchartdata.innerHTML = "";
        mainchartdata.style.visibility = "hidden";
        mainchartdata.style.display = "none";
        mainchart.style.height = "99%";

    }
    changeChartType();
}

function fillSeparatorColumnsCombo(sSelected) {
    var chartSeparatorColumnsCombo = document.getElementById("h_chartseparatorcolumns");
    clearSelectOptions(chartSeparatorColumnsCombo);
    var dataTable = getDataTable();
    var lastSelectedDimension = 0;
    if (dataTable) {
        lastSelectedDimension = dataTable.ExtendedProperties["LastSelectedDimension"];
        for (var jColumn = 0; jColumn <= lastSelectedDimension; jColumn++) {
            var eOption = document.createElement("option");
            eOption.text = getFriendlyName(dataTable.Columns[jColumn].ColumnName);
            eOption.value = jColumn + 1;

            if (sSelected && sSelected == jColumn + 1)
                eOption.setAttribute("selected", "true");

            chartSeparatorColumnsCombo.options[chartSeparatorColumnsCombo.options.length] = eOption;
        }
    }
}

function clearSelectOptions(selectObj) {
    if (selectObj) {
        for (var i = selectObj.options.length; i > 0; i--) {
            selectObj.options[i] = null;
        }
    }
}
function linkDownload(a, filename, content) {
    var contentType = 'data:application/octet-stream,';
    var uriContent = contentType + encodeURIComponent(content);
    a.setAttribute('href', uriContent);
    a.setAttribute('download', filename);
}


function mostarExcel(parameters) {
    if (navigator.msSaveBlob) {
        navigator.msSaveBlob(new Blob([parameters], { type: "application/octet-stream" }), "Export.xls");
    }
    else if (navigator.userAgent.match(/msie/i)) {
        //TODO for IE8 and IE9 it never worked
    } else {
        var a = document.createElement('a');
        linkDownload(a, "Export.xls", parameters);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}
function exportToExcel() {
    var params = saveResource(null, false, true);
    var envio;
    if (params["h_dimensionfilter"]) {
        params["h_dimensionfilter"] = params["h_dimensionfilter"].replace("&", "|");
        envio = "../GraphicAnalysis/GraphicAnalysis.aspx?h_CacheKey=" + params["h_CacheKey"] + "&h_Dimensions=" + params["h_Dimensions"] + "&h_Measures=" + params["h_Measures"] + "&x2xls=" + params["x2xls"] + "&h_dimensionfilter=" + params["h_dimensionfilter"];
    } else {
        envio = "../GraphicAnalysis/GraphicAnalysis.aspx?h_CacheKey=" + params["h_CacheKey"] + "&h_Dimensions=" + params["h_Dimensions"] + "&h_Measures=" + params["h_Measures"] + "&x2xls=" + params["x2xls"];
    }

    callAjaxURL(envio, mostarExcel, null);
}

function saveGraphicAnalysis(returnURL) {
    var form = document.createElement("form");

    form.setAttribute("id", "formSave");
    form.setAttribute("action", "../ListaDetalle/SaveQuery.aspx");
    form.setAttribute("method", "post");

    var params = saveResource(document.frm, false, false);

    input = document.createElement("input");
    input.setAttribute("id", "h_GraphicAnalysis");
    input.setAttribute("name", "h_GraphicAnalysis");
    input.setAttribute("type", "hidden");
    input.setAttribute("value", "true");
    form.appendChild(input);

    input = document.createElement("input");
    input.setAttribute("id", "h_Action");
    input.setAttribute("name", "h_Action");
    input.setAttribute("type", "hidden");
    input.setAttribute("value", "save");
    form.appendChild(input);

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

    if (params.h_dimensionfilter) {
        var dimensions = params.h_dimensionfilter.split("&");
        dimensions.map(function (dimension) {
            var auxInput = dimension.split("=")
            input = document.createElement("input");
            input.setAttribute("id", auxInput[0]);
            input.setAttribute("name", auxInput[0]);
            input.setAttribute("type", "hidden");
            input.setAttribute("value", auxInput[1]);
            form.appendChild(input);
        })
    }

    var arrayCacheKey = String(params["h_CacheKey"]).split(",");
    var idQueryForm;
    var idStoredQuery;
    var guidQueryForm;
    var queryDefinition;

    for (var i = 0; i <= arrayCacheKey.length; i++) {
        if (String(arrayCacheKey[i]).indexOf("idQueryForm") > 0)
            idQueryForm = String(arrayCacheKey[i]).substring(String(arrayCacheKey[i]).indexOf("=") + 1, String(arrayCacheKey[i]).length);

        if (String(arrayCacheKey[i]).indexOf("idStoredQuery") > 0)
            idStoredQuery = String(arrayCacheKey[i]).substring(String(arrayCacheKey[i]).indexOf("=") + 1, String(arrayCacheKey[i]).length);

        if (String(arrayCacheKey[i]).indexOf("guidQueryForm") > 0)
            guidQueryForm = String(arrayCacheKey[i]).substring(String(arrayCacheKey[i]).indexOf("=") + 1, String(arrayCacheKey[i]).length);
    }

    input = document.createElement("input");
    input.setAttribute("id", "h_idQueryForm");
    input.setAttribute("name", "h_idQueryForm");
    input.setAttribute("type", "hidden");
    if (idQueryForm)
        input.setAttribute("value", idQueryForm);
    else
        input.setAttribute("value", document.getElementById("h_idQueryForm").value);
    form.appendChild(input);

    input = document.createElement("input");
    input.setAttribute("id", "h_idStoredQuery");
    input.setAttribute("name", "h_idStoredQuery");
    input.setAttribute("type", "hidden");
    if (idStoredQuery)
        input.setAttribute("value", idStoredQuery);
    else
        input.setAttribute("value", document.getElementById("h_idStoredQuery").value);
    form.appendChild(input);

    input = document.createElement("input");
    input.setAttribute("id", "h_guidQueryForm");
    input.setAttribute("name", "h_guidQueryForm");
    input.setAttribute("type", "hidden");
    if (guidQueryForm)
        input.setAttribute("value", guidQueryForm);
    else if (idQueryForm == 0)
        input.setAttribute("value", document.getElementById("h_guidQueryForm").value);
    form.appendChild(input);

    input = document.createElement("input");
    input.setAttribute("id", "h_queryDefinition");
    input.setAttribute("name", "h_queryDefinition");
    input.setAttribute("type", "hidden");
    if (queryDefinition)
        input.setAttribute("value", queryDefinition);
    else if (window.parent.document.getElementById("h_definitionData") != null)
        input.setAttribute("value", window.parent.document.getElementById("h_definitionData").innerHTML);
    form.appendChild(input);




    document.getElementsByTagName("body")[0].appendChild(form);
    document.getElementById("formSave").submit();
}

function populateAddMeasuresDialog() {
    var arrSelectedMeasures = new Array();

    var listContainer = document.getElementById("listContainer");

    var tbody = listContainer.getElementsByTagName("tbody")[0];


    for (var i = tbody.childNodes.length - 1; i > 0; i--) {
        tbody.removeChild(tbody.childNodes[i]);
    }

    for (var i = 0; i < selectedMeasures.length; i++) {
        tbody.appendChild(renderWizardMeasures(selectedMeasures[i].columnName, selectedMeasures[i].displayColumnName, selectedMeasures[i].functions.join(',')));
        arrSelectedMeasures[arrSelectedMeasures.length] = selectedMeasures[i].columnName;
    }

    for (var i = 0; i < allMeasures.length; i++) {
        if (arrSelectedMeasures.join().indexOf(allMeasures[i].columnName) < 0) {
            tbody.appendChild(renderWizardMeasures(allMeasures[i].columnName, allMeasures[i].displayColumnName));
        }
    }
}

function populateAddDimensionsDialog() {
    var arrSelectedDimensions = new Array();
    var addDimensionsContainer = document.getElementById("addDimensionsContainer");
    addDimensionsContainer.innerHTML = "";

    for (var i = 0; i < selectedDimensions.length; i++) {
        var dd = createDD(selectedDimensions[i], true);
        addDimensionsContainer.appendChild(dd);
        arrSelectedDimensions[arrSelectedDimensions.length] = selectedDimensions[i].columnName;
    }

    for (var i = 0; i < allDimensions.length; i++) {
        if (arrSelectedDimensions.join().indexOf(allDimensions[i].columnName) < 0) {
            var dd = createDD(allDimensions[i], false);
            addDimensionsContainer.appendChild(dd);
        }
    }
    addDimensionsContainer.innerHTML = addDimensionsContainer.innerHTML.replace(/amp;/g, "");
}

function createDD(item, isChecked) {
    var dd = document.createElement("dd");
    dd.className = "ddAddDialog";
    var check = document.createElement("input");
    check.type = "checkbox";
    check.value = isChecked ? "1" : "0";
    check.id = "check_" + item.columnId;

    dd.appendChild(check);

    if (isChecked) {
        check.setAttribute("CHECKED", "true");
    }

    dd.appendChild(document.createTextNode('&nbsp;'));
    var strong = document.createElement("strong");
    strong.appendChild(document.createTextNode(getFriendlyName(item.columnName)));
    dd.appendChild(strong);

    return dd;
}

function addDimensions() {
    var addDialog = document.getElementById("addDimensionsDialog");
    var inputs = addDialog.getElementsByTagName("input");
    var hasChanges = false;

    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].id.indexOf("check_") == 0) {
            var sColumnName = inputs[i].id.replace("check_", "");
            var dimension = findDimensionByColumnName(sColumnName, selectedDimensions);
            var check = document.getElementById(inputs[i].id);

            if (!dimension) {
                if (check.checked) {
                    dimension = findDimensionByColumnName(sColumnName, allDimensions);
                    selectedDimensions[selectedDimensions.length] = dimension;
                    hasChanges = true;
                }
            }
            else {
                if (!check.checked) {
                    removeDimension(sColumnName, false);
                    hasChanges = true;
                }
            }
        }
    }

    if (hasChanges) {
        renderDimensionContainer(selectedDimensions);
        saveResource(null, true);
    }
    Windows.close("window_idaddDimensionsDialog");
}

function addMeasures() {
    var addDialog = document.getElementById("addMeasureDialog");
    var inputs = addDialog.getElementsByTagName("input");
    var hasChanges = false;

    for (var i = 0; i < allMeasures.length; i++) {
        var measure = allMeasures[i];
        measure.functions = new Array();
    }

    selectedMeasures = new Array();

    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].id.indexOf("check__") == 0) {

            var checkName = inputs[i].id.replace("check__", "").split("__");
            var sColumnName = checkName[0];
            var sFunction = checkName[1];

            var measure = findMeasureByColumnName(sColumnName, selectedMeasures);
            var check = document.getElementById(inputs[i].id);

            if (!measure && check.checked) {
                measure = findMeasureByColumnName(sColumnName, allMeasures);
                selectedMeasures[selectedMeasures.length] = measure;
                hasChanges = true;
            }

            if (check.checked) {
                measure.functions[measure.functions.length] = sFunction;
                hasChanges = true;
            }
        }
    }

    if (hasChanges) {
        renderMeasureContainer(selectedMeasures);
        saveResource(null, true);
    }
    Windows.close("window_idaddMeasureDialog");
}

var chartTypeTimer = null;
function showHideChartType() {
    var div = document.getElementById("chartTypeDiv");
    if (!chartTypeTimer)
        chartTypeTimer = new Timer(1500, showHideChartType);

    if (div.style.display == "none") {
        var switchBtn = document.getElementById("maxLeft");
        var position = findPos(switchBtn);
        div.style.top = String(position[1] + 20) + "px";
        div.style.left = String(position[0] - parseInt(div.style.width.replace("px", ""))) + "px";

        div.style.display = "block";
        div.style.visibility = "visible";
        div.style.zIndex = 150;
        chartTypeTimer.start();
    }
    else {
        div.style.display = "none";
        div.style.visibility = "hidden";
        chartTypeTimer.stop();
    }
}


function startProcessing() {
    hideCombos();
    var processing = document.getElementById("processing");
    processing.style.visibility = "visible";
    processing.style.display = "block";
}

function endProcessing() {
    var processing = document.getElementById("processing");
    processing.style.visibility = "hidden";
    processing.style.display = "none";
    showCombos();
}

function hideCombos() {
    var selects = document.getElementsByTagName("select");

    for (var i = 0; i < selects.length; i++) {
        var select = selects[i];
        if (select.style.visibility == "visible")
            select.style.visibility = "hidden";
    }
}

function showCombos() {
    var selects = document.getElementsByTagName("select");

    for (var i = 0; i < selects.length; i++) {
        var select = selects[i];
        if (select.style.visibility == "hidden")
            select.style.visibility = "visible";
    }
}

function checkAll(sContainer) {
    var container = document.getElementById(sContainer);
    var inputs = container.getElementsByTagName("input");

    for (var i = 0; i < inputs.length; i++) {
        if (inputs[i].id.indexOf("check_") == 0) {
            var check = document.getElementById(inputs[i].id);
            check.checked = true;
        }
    }
}

// Custom drop actions for <div id="selectedDimensionsContainer"> and <div id="unSelectedDimensionsContainer">
function dropItems(idOfDraggedItem, targetId, x, y) {
    if (targetId == 'selectedDimensionsContainer') {	// Item dropped on <div id="selectedDimensionsContainer">
        var obj = document.getElementById(idOfDraggedItem);
        if (obj.parentNode.id == 'dropContent2') return;
        document.getElementById('dropContent2').appendChild(obj); // Appending dragged element as child of target box
    }
    if (targetId == 'unSelectedDimensionsContainer') {	// Item dropped on <div id="unSelectedDimensionsContainer">
        var obj = document.getElementById(idOfDraggedItem);
        if (obj.parentNode.id == 'dropContent') return;
        document.getElementById('dropContent').appendChild(obj); // Appending dragged element as child of target box
    }

}
