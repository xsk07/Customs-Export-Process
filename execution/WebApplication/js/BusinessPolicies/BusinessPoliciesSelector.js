// Vocabulary Data Object 
function VocabularyData() {
    this.id = 0;
    this.idVocabulary = 0;
    this.definitionType = 0;
    this.name = '';
    this.xPathExpression = '';
    this.constantValue = '';
    this.destinationUse = 0;
    this.dataType = 0;
    this.idRelatedEntity = 0;
}

// Global Variables
var leftActiveElement;
var rightActiveElement;
var currentVocabularyEditable = true;
var currentPolicyAllowAddItems = true;
var currentPolicyId = 0;
var currentPolicyVersionId = 0;
var currentPolicyDocumentationId = 0;
var displayFloatingTree = false;

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////					    				RESET OVERRIDE      								  //////
////////////////////////////////////////////////////////////////////////////////////////////////////////
function resetOverride(element, objectType, idObject, resetMessage) {
    startProcessing();

    if (!confirm(resetMessage)) {
        endProcessing();
        return;
    }

    restoreActiveElement();
    leftActiveElement = WPGetParentControl(element, 'A');
    leftActiveElement.className = "WPSelectedNode";
    var ResetOverrideActionURL = "App/Ajax/AJAXGateway.aspx?action=2007&objectType=" + objectType + "&idObject=" + idObject + "&sPathToBaseDirectory=" + PATH_TO_BASE_DIRECTORY;

    ResetOverrideActionURL = PATH_TO_BASE_DIRECTORY + ResetOverrideActionURL;
    callAjaxURL(ResetOverrideActionURL, resetOverride_Callback, element);
}

function resetOverride_Callback(strData, element) {
    var rData = eval("(" + strData + ")");

    var sMessage = rData.returnMessage;
    var bRefreshPage = rData.refreshPage;
    var bReturn = rData.returnValue;


    showInfo(sMessage);

    //refreshes definition values
    if (bReturn == true) {
        if (bRefreshPage == true) {
            location.reload(true);
        }
        else {
            getConstantDefinitions(
                element,
	            document.getElementById('floatingContainer').idApplication,
	            document.getElementById('floatingContainer').idProcess,
	            document.getElementById('floatingContainer').idWorkflow);
        }
    }
}


////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									GET CONSTANT DEFINITIONS								  //////
////////////////////////////////////////////////////////////////////////////////////////////////////////
function getConstantDefinitions(element, idApplication, idProcess, idWorkflow) {
    startProcessing();

    restoreActiveElement();
    leftActiveElement = WPGetParentControl(element, 'A');
    leftActiveElement.className = "WPSelectedNode";
    var GetConstantDefinitionsActionURL = "App/Ajax/AJAXGateway.aspx?action=2001&idApplication=" + idApplication + "&idProcess=" + idProcess + "&idWorkflow=" + idWorkflow + "&sPathToBaseDirectory=" + PATH_TO_BASE_DIRECTORY;

    //sets id values for refreshing the container after saving or resetting a definition
    document.getElementById('floatingContainer').idApplication = idApplication;
    document.getElementById('floatingContainer').idProcess = idProcess;
    document.getElementById('floatingContainer').idWorkflow = idWorkflow;

    GetConstantDefinitionsActionURL = PATH_TO_BASE_DIRECTORY + GetConstantDefinitionsActionURL;
    callAjaxURL(GetConstantDefinitionsActionURL, getConstantDefinitions_Callback);
}

function getConstantDefinitions_Callback(strData) {
    var expression = new RegExp(/(\r\n|\n|\r)/gm);
    var strDataNoSpaces = strData.replace(expression, "");

    var rData;
    try {
        JSON.parse(strDataNoSpaces);
        rData = eval("(" + strDataNoSpaces + ")");
    } catch (e) {
        window.top.location.reload();
    }

    showFloatingContainer();
    document.getElementById('floatingContainer').innerHTML = rData.constantDefinitionsHTML;
    document.getElementById('floatingContainer').style.display = "block";

    currentVocabularyEditable = rData.editable;

    setTimeout("endProcessing()", 200);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									GET POLICY ITEMS										  //////
////////////////////////////////////////////////////////////////////////////////////////////////////////
function getPolicyItems(element, idPolicy, idPolicyVersion) {
    startProcessing();

    // Set current ids
    currentPolicyId = idPolicy;
    currentPolicyVersionId = idPolicyVersion;

    restoreActiveElement();
    leftActiveElement = WPGetParentControl(element, 'A');
    leftActiveElement.className = "WPSelectedNode";
    var GetPolicyItemsActionURL = "App/Ajax/AJAXGateway.aspx?action=2002&idPolicy=" + idPolicy + "&idPolicyVersion=" + idPolicyVersion + "&sPathToBaseDirectory=" + PATH_TO_BASE_DIRECTORY;

    GetPolicyItemsActionURL = PATH_TO_BASE_DIRECTORY + GetPolicyItemsActionURL;
    callAjaxURL(GetPolicyItemsActionURL, getPolicyItems_Callback);
}

function getPolicyItems_Callback(strData) {
    var expression = new RegExp(/(\r\n|\n|\r)/gm);
    var strDataNoSpaces = strData.replace(expression, "");

    var rData = eval("(" + strDataNoSpaces + ")");

    showFloatingContainer();
    document.getElementById('floatingContainer').innerHTML = rData.policyItemsHTML;
    document.getElementById('floatingContainer').style.display = "block";

    currentPolicyAllowAddItems = rData.allowAddItems;

    // Enable disable links
    if (currentPolicyAllowAddItems) {
        var div = document.getElementById('addPolicyItemsTemplate');
        var newDiv = document.createElement('DIV');
        newDiv.innerHTML = div.innerHTML;

        document.getElementById('bottomFloatingContainer').innerHTML = '';
        document.getElementById('bottomFloatingContainer').appendChild(newDiv);
        document.getElementById("bottomFloatingContainer").style.display = "block";

    } else {
        document.getElementById('bottomFloatingContainer').innerHTML = '';
        document.getElementById("bottomFloatingContainer").style.display = "none";
    }
    adjustFloatingContainer();

    setTimeout("endProcessing()", 200);
}

function getPolicyItemsOnDemand(element, idPolicy, idPolicyVersion, idParentPolicy, level) {

    if (isAlreadyPolicyItemsOnDemand(element)) {
        WPtoggleNode(element);
    }
    else {
        startProcessing();
        currentPolicyId = idPolicy;
        currentPolicyVersionId = idPolicyVersion;
        restoreActiveElement();
        leftActiveElement = WPGetParentControl(element, 'A');
        leftActiveElement.className = "WPSelectedNode";
        var GetPolicyItemsActionURL = "App/Ajax/AJAXGateway.aspx?action=2008&idPolicy=" + idPolicy + "&idPolicyVersion=" + idPolicyVersion + "&idParentPolicyVersion=" + idParentPolicy + "&level=" + level + "&sPathToBaseDirectory=" + PATH_TO_BASE_DIRECTORY;

        GetPolicyItemsActionURL = PATH_TO_BASE_DIRECTORY + GetPolicyItemsActionURL;
        callAjaxURL(GetPolicyItemsActionURL, getPolicyItemsOnDemand_Callback, element);
    }
}

function isAlreadyPolicyItemsOnDemand(element) {
    var result = false;
    var anchor = closest(element, "a");

    if (anchor) {
        var div = anchor.nextSibling;
        result = div.childElementCount > 0;
    }

    return result;
}

function getPolicyItemsOnDemand_Callback(strData, element) {
    var expression = new RegExp(/(\r\n|\n|\r)/gm);
    var strDataNoSpaces = strData.replace(expression, "");
    var rData = {};

    try {
        rData = JSON.parse(strDataNoSpaces);
    } catch (e) {
        console.log("Error:", e.toString());
    }

    var anchor = closest(element, "a");

    if (anchor) {
        var div = anchor.nextSibling;
        var parent = div.parentNode;
        var newDiv = document.createElement('div');
        newDiv.setAttribute('style', 'display:none');
        newDiv.innerHTML = rData.policyItemsHTML;
        parent.replaceChild(newDiv, div);
        WPtoggleNode(element);
    }

    setTimeout("endProcessing()", 200);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									EDIT CONSTANT DEFINITION								  //////
////////////////////////////////////////////////////////////////////////////////////////////////////////
function editConstantDefinition(element, idDefinition) {
    startProcessing();

    restoreActiveElement();
    rightActiveElement = WPGetParentControl(element, 'A');
    rightActiveElement.className = "WPSelectedNode";

    var GetDefinitionActionURL = "App/Ajax/AJAXGateway.aspx?action=12&idDefinition=" + idDefinition;
    GetDefinitionActionURL = "../../../" + GetDefinitionActionURL;

    callAjaxURL(GetDefinitionActionURL, editConstantDefinition_Callback, element);
}

function editConstantDefinition_Callback(strData, element) {
    var rData = eval("(" + strData + ")");
    var vocabularyData = rData.vocabularyData;

    var div = document.getElementById('constantDefinitionTemplate');
    var newDiv = document.createElement('DIV');
    newDiv.innerHTML = div.innerHTML

    document.getElementById('bottomFloatingContainer').innerHTML = '';
    document.getElementById('bottomFloatingContainer').appendChild(newDiv);
    document.getElementById("bottomFloatingContainer").style.display = "block";

    //sets element value for refreshing the container after saving current definition
    document.getElementById('floatingContainer').element = element;

    newDiv.className = 'definitionEditor';

    showConstantControl(newDiv, vocabularyData);
    currentVocabularyData = vocabularyData;

    // Set editable
    var input_textEditor=getDescendant(newDiv, 'textEditor');
    var input_dateTimeEditor=getDescendant(newDiv, 'dateTimeEditor');
    var input_numericEditor=getDescendant(newDiv, 'numericEditor');
    input_textEditor.disabled = (currentVocabularyEditable) ? false : true;
    input_dateTimeEditor.disabled = (currentVocabularyEditable) ? false : true;
    input_numericEditor.disabled = (currentVocabularyEditable) ? false : true;

    
    getDescendants(newDiv, 'booleanEditor').map(function (e) {
        e.disabled = (currentVocabularyEditable) ? false : true; 
    });
    var updateButton =getDescendant(newDiv, 'btnUpdate');
    updateButton.disabled = (currentVocabularyEditable) ? false : true;
    if(!currentVocabularyEditable){
        input_textEditor.classList.add("inputDisabledConstantsDefinitions");
        input_dateTimeEditor.classList.add("inputDisabledConstantsDefinitions");
        input_numericEditor.classList.add("inputDisabledConstantsDefinitions");
        getDescendant(newDiv, 'BTN_date').style.display = "none";
        updateButton.parentNode.classList.add("btnDisabledConstantsDefinitions");
    }

    adjustFloatingContainer();

    setTimeout("endProcessing()", 200);
}

function saveDefinition(div) {
    currentVocabularyData.constantValue = getConstantValue(div, currentVocabularyData.dataType)

    var SaveDefinitionActionURL = "App/Ajax/AJAXGateway.aspx?action=13&idDefinition=" + currentVocabularyData.id + "&constantValue=" + encodeURIComponent(currentVocabularyData.constantValue);
    SaveDefinitionActionURL = "../../../" + SaveDefinitionActionURL;

    callAjaxURL(SaveDefinitionActionURL, saveDefinition_Callback, div);
    currentVocabularyData = null;

    cancelEditDefinition();
}

function cancelEditDefinition() {
    document.getElementById('bottomFloatingContainer').innerHTML = '';
    document.getElementById('bottomFloatingContainer').style.display = "none";
    document.getElementById('popupcalendar').style.visibility = "hidden";

    adjustFloatingContainer();
}

function saveDefinition_Callback(strData, element) {
    var rData = eval("(" + strData + ")");
    var sMessage = rData.returnMessage;

    showInfo(sMessage);

    //refreshes definition values
    getConstantDefinitions(
        document.getElementById('floatingContainer').element,
        document.getElementById('floatingContainer').idApplication,
        document.getElementById('floatingContainer').idProcess,
        document.getElementById('floatingContainer').idWorkflow);
}

//Definition Edition
function showConstantControl(div, vocabularyData) {

    getDescendant(div, 'definitionDisplayName').innerHTML = vocabularyData.definitionName;

    document.getElementById('popupcalendar').style.visibility = "hidden";

    if (isDatetime(vocabularyData.dataType)) { // Datetime editor
        getDescendant(div, 'frmDatetimeTemplate').id = "frmDatetime";
        getDescendant(div, 'dateTimeControl').style.display = "inline";
        //getDescendant(div, 'dateTimeEditor').value = unquote(vocabularyData.constantValue);
        getDescendant(div, 'dateTimeEditor').value = convertDate(unquote(vocabularyData.constantValue));

    } else if (isNumeric(vocabularyData.dataType) || isMoney(vocabularyData.dataType)) { // Currency editor
        getDescendant(div, 'numericControl').style.display = "inline";
        getDescendant(div, 'numericEditor').value = vocabularyData.constantValue;
        new BABehaviorElement(getDescendant(div, 'numericEditor'));

    } else if (isBoolean(vocabularyData.dataType)) { // Boolean editor
        getDescendant(div, 'booleanControl').style.display = "inline";
        if (vocabularyData.constantValue.toLowerCase() == 'true') {
            getDescendants(div, 'booleanEditor')[0].checked = true;
        } else if (vocabularyData.constantValue.toLowerCase() == 'false') {
            getDescendants(div, 'booleanEditor')[1].checked = true;
        }
    } else { // Text editor by default
        getDescendant(div, 'textControl').style.display = "inline";
        getDescendant(div, 'textEditor').value = unquote(vocabularyData.constantValue);
    }
}

function convertDate(dateString) {
	var resultSerializeDate = serializeDateValueInvariant(dateString);
	var fragmentsDate = resultSerializeDate.split('#');

	return getDateFormat(
		parseInt(fragmentsDate[0], 10),
		parseInt(fragmentsDate[1], 10),
		parseInt(fragmentsDate[2], 10))
}

// Method that gets the internal value of the controls
function getConstantValue(div, dataType) {
    if (isText(dataType)) {
        return quote(getDescendant(div, 'textEditor').value);
    } else if (isDatetime(dataType)) {
        return quote(getDescendant(div, 'dateTimeEditor').value);
    } else if (isNumeric(dataType) || isMoney(dataType)) {
        return getDescendant(div, 'numericEditor').value;
    } else if (isBoolean(dataType)) {
        return String(getDescendants(div, 'booleanEditor')[0].checked);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									MISC METHODS											  //////
////////////////////////////////////////////////////////////////////////////////////////////////////////
function showFloatingContainer() {
    document.getElementById("floatingTree").style.display = "block";
    document.getElementById("bottomFloatingContainer").style.display = "none";
    document.getElementById("documentationBox").style.display = "none";

    adjustFloatingContainer();

    displayFloatingTree = true;
}

function hideFloatingContainer() {
    document.getElementById("floatingTree").style.display = "none";
    restoreActiveElement();

    displayFloatingTree = false;
}

function restoreActiveElement() {
    if (leftActiveElement != null) {
        leftActiveElement.className = "WPFolderNodeLN";
        leftActiveElement = null;
    }

    if (rightActiveElement != null) {
        rightActiveElement.className = "WPFolderNodeLN";
        rightActiveElement = null;
    }
}

function adjustFloatingContainer() {
    getwahas();
    var containerHeight = winheight * 0.8 - 20;
    var bShowFloatingTree = (document.getElementById("floatingTree").style.display != "none");
    var bShowDocumentationBox = (document.getElementById("documentationBox").style.display != "none");

    if (bShowFloatingTree) {
        document.getElementById("floatingTree").style.top = topscroll + winheight * 0.1;

        if (document.getElementById("bottomFloatingContainer").style.display == "none") {
            document.getElementById("floatingContainer").style.height = containerHeight + "px";
        }
        else {
            document.getElementById("floatingContainer").style.height = (containerHeight - document.getElementById("bottomFloatingContainer").offsetHeight) + "px";
        }
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									ADD METHODS												  //////
////////////////////////////////////////////////////////////////////////////////////////////////////////
function addPreconditionToPolicyVersion() {
    //should be an empty Guid but it works anyway
    addPrecondition(0);
}

function addPolicyRuleToPolicyVersion() {
    //should be an empty Guid but it works anyway
    addPolicyRule(0);
}

function addDecisionTableToPolicyVersion() {
    //should be an empty Guid but it works anyway
    addDecisionTable(0);
}

function addRuleTableToPolicyVersion() {
    //should be an empty Guid but it works anyway
    addRuleTable(0);
}

function addChildPrecondition() {
    var element = document.getElementById(idCM);
    var idParentPrecondition = getDescendant(element, "idPrecondition").value;

    addPrecondition(idParentPrecondition);
}

function addChildPolicyRule() {
    var element = document.getElementById(idCM);
    var idParentPrecondition = getDescendant(element, "idPrecondition").value;

    addPolicyRule(idParentPrecondition);
}

function addChildDecisionTable() {
    var element = document.getElementById(idCM);
    var idParentPrecondition = getDescendant(element, "idPrecondition").value;

    addDecisionTable(idParentPrecondition);
}

function addChildRuleTable() {
    var element = document.getElementById(idCM);
    var idParentPrecondition = getDescendant(element, "idPrecondition").value;

    addRuleTable(idParentPrecondition);
}

function addPrecondition(idParentPrecondition) {
    location.href = "BusinessPolicyPrecondition.aspx?idPolicy=" + currentPolicyId + "&idPolicyVersion=" + currentPolicyVersionId + "&idParentPrecondition=" + idParentPrecondition + "&idPolicyItem=0";
}

function addPolicyRule(idParentPrecondition) {
    location.href = "BusinessPolicyRule.aspx?idPolicy=" + currentPolicyId + "&idPolicyVersion=" + currentPolicyVersionId + "&idParentPrecondition=" + idParentPrecondition + "&idPolicyItem=0";
}

function addDecisionTable(idParentPrecondition) {
    location.href = "BusinessDecisionTable.aspx?idPolicy=" + currentPolicyId + "&idPolicyVersion=" + currentPolicyVersionId + "&idParentPrecondition=" + idParentPrecondition + " &idPolicyItem=0";
}

function addRuleTable(idParentPrecondition) {
    location.href = "BusinessPolicyRuleTable.aspx?idPolicy=" + currentPolicyId + "&idPolicyVersion=" + currentPolicyVersionId + "&idParentPrecondition=" + idParentPrecondition + "&idPolicyItem=0";
}

////////////////////////////////////////////////////////////////////////////////////////////////////////
//////									DOCUMENTATION METHODS									  //////
////////////////////////////////////////////////////////////////////////////////////////////////////////
function showPolicyItemDocumentation() {
    var element = document.getElementById(idCM);
    var idPolicyDocumentation = getDescendant(element, "idPolicyDocumentation").value;

    if (idPolicyDocumentation == 0) {
        showError(BAP_POLICY_NODOCUMENTATIONFORITEM);
        return;
    }

    showDocumentation(idPolicyDocumentation);
}

function showPolicyDocumentation() {
    var element = document.getElementById("BP-" + idCM);
    var idPolicyDocumentation = getDescendant(element, "idPolicyDocumentation").value;

    if (idPolicyDocumentation == 0) {
        showError(BAP_POLICY_NODOCUMENTATIONFORITEM);
        return;
    }

    showDocumentation(idPolicyDocumentation);
}


function showDocumentation(idPolicyDocumentation) {
    document.getElementById("documentationBox").style.display = "block";
    document.getElementById("floatingTree").style.display = "none";

    currentPolicyDocumentationId = idPolicyDocumentation;

    adjustFloatingContainer();
}

function cancelShowDocumentation() {
    document.getElementById("documentationBox").style.display = "none";

    if (displayFloatingTree)
        document.getElementById("floatingTree").style.display = "block";

    adjustFloatingContainer();
}

function ShowRTFDocument() {
    // Send getAttachment with 0
    var sURL = PATH_TO_BASE_DIRECTORY + "App/Admin/BusinessPolicies/BusinessPolicyDocumentation.aspx?getAttachment=0&idPolicyDocumentation=" + currentPolicyDocumentationId;
    window.open(sURL, 'doc');
}

function ShowItemAttachment() {
    // Send getAttachment with 1
    var sURL = PATH_TO_BASE_DIRECTORY + "App/Admin/BusinessPolicies/BusinessPolicyDocumentation.aspx?getAttachment=1&idPolicyDocumentation=" + currentPolicyDocumentationId;
    window.open(sURL, 'doc');
}