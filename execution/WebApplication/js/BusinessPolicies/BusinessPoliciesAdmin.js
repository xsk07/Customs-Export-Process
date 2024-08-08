var currentVocabularyData = null;
var applicationsHTML = '';

function BAToggle(objectId){
	var obj = document.getElementById(objectId);
	if (obj.style.display == "none")
		obj.style.display = "inline";
	else
		obj.style.display = "none";
}

function BASelectApplication(idApplication){
	var link = document.getElementById('BAApp' + idApplication);
	HightlightLink(link);
	
	createTopLink(link);
	
	var GetProcessesActionURL= "App/Ajax/AJAXGateway.aspx?action=7&idApplication="+idApplication;
	GetProcessesActionURL = "../../"+GetProcessesActionURL;
	
	callAjaxURL(GetProcessesActionURL,GetProcessesCallback);
}

function GetProcessesCallback(strData){
	var rData = eval("("+strData+")");
	
	document.getElementById('leftContainer').innerHTML = rData.processesHTML;
	document.getElementById('rightContainer').innerHTML = '';
	document.getElementById('rightContainer').style.display = "none";
}

function BASelectApplicationPolicies(idApplication){
	var link = document.getElementById('BAApplicationPolicies' + idApplication);
	HightlightLink(link);
	
	createTopLink(link);
	
	var GetPoliciesActionURL= "App/Ajax/AJAXGateway.aspx?action=8&idApplication="+idApplication;
	GetPoliciesActionURL = "../../"+GetPoliciesActionURL;
	
	callAjaxURL(GetPoliciesActionURL,GetPoliciesCallback);
}

function BASelectProcess(idApplication, idProcess){
	var link = document.getElementById('BAProcess' + idProcess);
	HightlightLink(link);
	
	createTopLink(link);

	var GetPoliciesActionURL= "App/Ajax/AJAXGateway.aspx?action=8&idApplication="+idApplication+"&idProcess="+idProcess;
	GetPoliciesActionURL = "../../"+GetPoliciesActionURL;
	
	callAjaxURL(GetPoliciesActionURL,GetPoliciesCallback);
}

function GetPoliciesCallback(strData){
	var rData = eval("("+strData+")");
	
	document.getElementById('leftContainer').innerHTML = rData.policiesHTML;
	document.getElementById('rightContainer').innerHTML = '';
	document.getElementById('rightContainer').style.display = "none";
}

function BASelectPolicy(idPolicy, idPolicyVersion){
	var link = document.getElementById('BAPolicy' + idPolicy);
	HightlightLink(link);
	
	var GetPolicyRulesActionURL= "App/Ajax/AJAXGateway.aspx?action=9&idPolicy="+idPolicy+"&idPolicyVersion="+idPolicyVersion;
	GetPolicyRulesActionURL = "../../"+GetPolicyRulesActionURL;
	
	callAjaxURL(GetPolicyRulesActionURL,GetPolicyRulesCallback);
}

function GetPolicyRulesCallback(strData){
	var rData = eval("("+strData+")");
	
	document.getElementById('rightContainer').innerHTML = rData.policyRulesHTML;
	document.getElementById('rightContainer').style.display = "inline";
}

function BASelectApplicationDefinitions(idApplication){
	var link = document.getElementById('BAApplicationDefinitions' + idApplication);
	HightlightLink(link);
	
	createTopLink(link);
	
	var GetConstantDefinitionsActionURL= "App/Ajax/AJAXGateway.aspx?action=11&idApplication="+idApplication+"&container=PolicyContainer";
	GetConstantDefinitionsActionURL = "../../"+GetConstantDefinitionsActionURL;
	
	callAjaxURL(GetConstantDefinitionsActionURL, GetConstantDefinitionsCallback);
}

function BASelectProcessDefinitions(idApplication, idProcess){
	var link = document.getElementById('BAProcessDefinitions' + idProcess);
	HightlightLink(link);
	
	createTopLink(link);
	
	var GetConstantDefinitionsActionURL= "App/Ajax/AJAXGateway.aspx?action=11&idApplication="+idApplication+"&idProcess="+idProcess+"&container=PolicyRuleContainer";
	GetConstantDefinitionsActionURL = "../../"+GetConstantDefinitionsActionURL;
	
	callAjaxURL(GetConstantDefinitionsActionURL, GetConstantDefinitionsCallback);
}

function GetConstantDefinitionsCallback(strData){
	var rData = eval("("+strData+")");
	
	document.getElementById('leftContainer').innerHTML = rData.constantDefinitionsHTML;
	document.getElementById('rightContainer').innerHTML = '';
	document.getElementById('rightContainer').style.display = "none";
}

function BASelectConstantDefinition(idDefinition){
	var GetDefinitionActionURL= "App/Ajax/AJAXGateway.aspx?action=12&idDefinition="+idDefinition;
	GetDefinitionActionURL = "../../"+GetDefinitionActionURL;
	
	callAjaxURL(GetDefinitionActionURL, GetDefinitionCallback);
}

function GetDefinitionCallback(strData){
	var rData = eval("("+strData+")");
	var vocabularyData = rData.vocabularyData;
	
	var link = document.getElementById('BAConstantDefinition' + vocabularyData.id);
	var div = document.getElementById('divConstantDefinition');
	var newDiv = document.createElement('DIV');
	newDiv.innerHTML = div.innerHTML
	newDiv.className = 'editDefinitionDiv';
	newDiv.style.width = getCurrentWidth(div);
	newDiv.style.height = getCurrentHeight(div);
	document.getElementById('rightContainer').innerHTML = '';
	document.getElementById('rightContainer').appendChild(newDiv);
	document.getElementById('rightContainer').style.display = "inline";
		
	showConstantControl(newDiv, vocabularyData);
	currentVocabularyData = vocabularyData;
}

function showConstantControl(div, vocabularyData){
	if (isDatetime(vocabularyData.dataType)){ // Datetime editor
		getDescendant(div, 'frmDatetimeTemplate').id = "frmDatetime";
		getDescendant(div, 'dateTimeControl').style.display = "inline";
		getDescendant(div, 'dateTimeEditor').value = unquote(vocabularyData.constantValue);
			
	} else if (isNumeric(vocabularyData.dataType) || isMoney(vocabularyData.dataType)  ){ // Currency editor
		getDescendant(div, 'numericControl').style.display = "inline";
		getDescendant(div, 'numericEditor').value = vocabularyData.constantValue;
		new BABehaviorElement(getDescendant(div, 'numericEditor'));
			
	} else if (isBoolean(vocabularyData.dataType)){ // Boolean editor
		getDescendant(div, 'booleanControl').style.display = "inline";
		if (vocabularyData.constantValue == 'true'){
			getDescendants(div, 'booleanEditor')[0].checked = true;
		} else if (vocabularyData.constantValue == 'false'){
			getDescendants(div, 'booleanEditor')[1].checked = true;
		}			
	} else { // Text editor by default
		getDescendant(div, 'textControl').style.display = "inline";
		getDescendant(div, 'textEditor').value = unquote(vocabularyData.constantValue);
	} 
}

function saveDefinition(div){
	currentVocabularyData.constantValue = getConstantValue(div, currentVocabularyData.dataType)
	
	var SaveDefinitionActionURL= "App/Ajax/AJAXGateway.aspx?action=13&idDefinition="+currentVocabularyData.id+"&constantValue="+currentVocabularyData.constantValue;
	SaveDefinitionActionURL = "../../"+SaveDefinitionActionURL;
	
	callAjaxURL(SaveDefinitionActionURL, SaveDefinitionCallback);
	currentVocabularyData = null;
	
	cancelEditDefinition();
}

function cancelEditDefinition()
{
	document.getElementById('rightContainer').innerHTML = '';
	document.getElementById('rightContainer').style.display = "none";
}

function SaveDefinitionCallback(strData){
	var rData = eval("("+strData+")");
	var sMessage = rData.returnMessage;
	
	alert(sMessage);
}

// Method that gets the internal value of the controls
function getConstantValue(div, dataType) {
	if (isText(dataType)){
		return quote( getDescendant(div, 'textEditor').value );
	} else if (isDatetime(dataType)){
		return quote( getDescendant(div, 'dateTimeEditor').value );
	} else if (isNumeric(dataType) || isMoney(dataType)){
		return getDescendant(div, 'numericEditor').value;
	} else if (isBoolean(dataType)){
		return String(getDescendants(div, 'booleanEditor')[0].checked);
	}
}
	
	

function  HightlightLink(link){
	
	try {
		var parentTable = getParentElementByTag(link, 'TABLE');
		var childLinks = getChildElementsByTag(parentTable, 'A');
		
		for (var i=0;  i < childLinks.length; i++){
			childLinks[i].style.fontWeight = 'normal';	
		}
		
		link.style.fontWeight = 'bold';	
	} catch (e) {}
}

function getParentElementByTag(object, tag){
	if (object.parentNode == null) {
		return null;
	}
	
	if (object.parentNode.tagName == tag)
	{
		return object.parentNode;
	}
	
	return getParentElementByTag(object.parentNode, tag);
}

function getChildElementsByTag(object, tag){
	var objects = new Array();
	if (object.hasChildNodes())	{
		var children = object.childNodes;
	
		for (var i = 0; i < children.length; i++) {
	
			if (children[i].tagName == tag ){
				
				objects.push(children[i]);
				
			} else {
				var childObjects = getChildElementsByTag(children[i], tag);
				
				for (var j = 0; j < childObjects.length; j++) {
					objects.push(childObjects[j]);
				}
			}					
		}
	}
	
	return objects;
}

function createTopLink(link){
	
	if (link.parentNode.className == 'innerContainer'){
		return;
	}

	var linkTopHTML = document.getElementById('linkTopHTML').innerHTML;
	var topContainer = document.getElementById('topContainer');
	
	topContainer.innerHTML = linkTopHTML;
	
	var image = getDescendant(topContainer, 'imgArrowRight');
	
	if (isIE)
		getDescendant(topContainer, 'linkTop').innerHTML = '<STRONG>' +  link.innerText + '</STRONG>';
	else
		getDescendant(topContainer, 'linkTop').innerHTML = '<STRONG>' +  link.text + '</STRONG>';
	getDescendant(topContainer, 'linkTop').appendChild(image);
	getDescendant(topContainer, 'linkTop').href = link.href + 'clearNextElements(document.getElementById("' + link.id + '"));';
	getDescendant(topContainer, 'linkTop').id = link.id;
	
	topContainer.id = "spanLink" + link.id;
	
	var innerSpan = document.createElement('SPAN');
	innerSpan.id = "topContainer";
	innerSpan.className = 'innerContainer';
	topContainer.appendChild(innerSpan);
}

function clearNextElements(topLink) {
	var topContainer = topLink.parentNode;
	getDescendantByClassName(topContainer, 'innerContainer').innerHTML = '';
	
	// New inner Container
	var innerSpan = document.createElement('SPAN');
	innerSpan.id = "topContainer";
	innerSpan.className = 'innerContainer';
	topContainer.appendChild(innerSpan);
}

