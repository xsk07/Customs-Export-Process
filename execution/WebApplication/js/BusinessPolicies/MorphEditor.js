function MorphEditor(endEditFunction){
	this.value =  '';
	this.dataType = 0;
	this.idRelatedEntity = 0;
	this.parentElement = null;
	this.editor = null;
	this.endEditFunction = endEditFunction;
	this.currentEditableElement = null;
	this.useDefaultComboWidth = true;
	this.internalControlWidth = 0;
	this.internalControlHeight = 0;
	
	this.getEditorControl = function(){
		if (this.idRelatedEntity > 0) {
			// Combo control for related entities
			var comboEditorTemplate = document.getElementById('comboEditorHtml');
			this.editor = document.createElement('SPAN');
			this.editor.innerHTML = comboEditorHtml.innerHTML;	
			
			var comboEditor = getDescendantByClassName(this.editor, 'comboEditor');
			if (this.useDefaultComboWidth)
				comboEditor.style.width = '350px';
			else 
				comboEditor.style.width = 'auto';
				
			comboEditor.style.height = '100%';
			
			if (this.internalControlWidth != 0)
				comboEditor.style.width = this.internalControlWidth;
			if (this.internalControlHeight != 0)
				comboEditor.style.height = this.internalControlHeight;
			
			// Changes the name to make it unique
			var newIdentifier = 'comboEditor' + this.parentElement.id;
			comboEditor.id = newIdentifier;
			comboEditor.onkeydown = this.internalEndEditFunction;
			
			// Get options
			getRelatedEntityValues(newIdentifier, this.idRelatedEntity, this.value);
		
		} else {	
			if ( isNumeric(this.dataType) || isMoney(this.dataType) ) {
				var numericEditorTemplate = document.getElementById('numericEditorHtml');
				this.editor = document.createElement('SPAN');
				this.editor.innerHTML = numericEditorTemplate.innerHTML;	
				
				getDescendant(this.editor, 'numericEditor').preset = getNamedDataType(this.dataType);
				//getDescendant(editor, 'numericEditor').onblur = getNamedDataType(dataType);
				getDescendant(this.editor, 'numericEditor').onkeydown = this.internalEndEditFunction;
				
				if (this.internalControlWidth != 0)
					getDescendant(this.editor, 'numericEditor').style.width = this.internalControlWidth;
				if (this.internalControlHeight != 0)
					getDescendant(this.editor, 'numericEditor').style.height = this.internalControlHeight;
				
				// Add behavior
				new BABehaviorElement(getDescendant(this.editor, 'numericEditor'));
				
			} else if (isDatetime(this.dataType)) {	
				var dateTimeEditorTemplate = document.getElementById('datetimeEditorHtml');
				this.editor = document.createElement('SPAN');
				
				var innerForm = document.createElement('FORM');
				innerForm.id= 'frmDatetime';
				innerForm.innerHTML = dateTimeEditorTemplate.innerHTML;		
				
				this.editor.appendChild(innerForm);		
				
				getDescendant(innerForm, 'dateTimeEditor').onkeydown = this.internalEndEditFunction;
				
				// Add behavior
				new BABehaviorElement(getDescendant(this.editor, 'dateTimeEditor'));
				
			} else if (isBoolean(this.dataType)){
				var booleanEditorTemplate = document.getElementById('booleanEditorHtml');
				this.editor = document.createElement('SPAN');
				this.editor.innerHTML = booleanEditorTemplate.innerHTML;	
				
                getDescendants(this.editor, 'booleanEditor')[0].onclick = this.endEditFunction;
				getDescendants(this.editor, 'booleanEditor')[1].onclick = this.endEditFunction;
			
			} else {  // Default or text show text editor
				var textEditorTemplate = document.getElementById('textEditorHtml');
				this.editor = document.createElement('SPAN');
				this.editor.innerHTML = textEditorTemplate.innerHTML;	
				
				getDescendant(this.editor, 'textEditor').onkeydown = this.internalEndEditFunction;
				
				if (this.internalControlWidth != 0)
					getDescendant(this.editor, 'textEditor').style.width = this.internalControlWidth;
				if (this.internalControlHeight != 0)
					getDescendant(this.editor, 'textEditor').style.height = this.internalControlHeight;
				
			}
		}
		
		this.editor.id = 'morphEditor';
		
		return this.editor;
	}
	
	this.focusEditorControl = function(){
		if (this.idRelatedEntity > 0)	{
			getDescendant(this.editor, 'comboEditor' + this.parentElement.id).focus();
		} else if (isDatetime(this.dataType)){
			getDescendant(this.editor, 'dateTimeEditor').focus();
		} else if (isNumeric(this.dataType) || isMoney(this.dataType)){
			getDescendant(this.editor, 'numericEditor').focus();
		} else if (isBoolean(this.dataType)){
		}
		else { // Default text editor
			getDescendant(this.editor, 'textEditor').focus();
		}
	}
	
	this.internalEndEditFunction = function(evt){
		var evt = getEvent(evt);
		
		if (evt.keyCode == 13){
			endEditFunction();
		}
	}
	
	this.setEditorValue = function(){
		if (this.idRelatedEntity > 0){
			return;
		}
		
		if (isDatetime(this.dataType)){
			getDescendant(this.editor, 'dateTimeEditor').value = unquote(this.value);;
		} else if (isNumeric(this.dataType) || isMoney(this.dataType)){
			getDescendant(this.editor, 'numericEditor').value = this.value;
		} else if (isBoolean(this.dataType)){
			if (this.value.toLowerCase() == 'true'){
				getDescendants(this.editor, 'booleanEditor')[0].checked = true;
			} else if (this.value.toLowerCase() == 'false'){
				getDescendants(this.editor, 'booleanEditor')[1].checked = true;
			}
		} else { // Default text editor
			getDescendant(this.editor, 'textEditor').value = unquote(this.value);
		}
	}
	
	/**
	 * return the displayAttributeValue for parametrics
	 */
	this.getDisplayAttributeValue = function(){
		return this.displayAttributeValue;
	}
	
	this.getEditorValue = function(){
		if (this.idRelatedEntity > 0)	{
			return getDescendant(this.editor, 'comboEditor' + this.parentElement.id).value;

		} else if (isDatetime(this.dataType)){
			return quote( getDescendant(this.editor, 'dateTimeEditor').value );
			
		} else if (isNumeric(this.dataType) || isMoney(this.dataType)){
			getDescendant(this.editor, 'numericEditor').BABehavior.doBlur();
			return getDescendant(this.editor, 'numericEditor').value;

		} else if (isBoolean(this.dataType)){
			if (getDescendants(this.editor, 'booleanEditor')[0].checked) {
			    return String(getDescendants(this.editor, 'booleanEditor')[0].value);
			} else {
			    return String(getDescendants(this.editor, 'booleanEditor')[1].value);
			}
		} else { // Default text editor
			return quote( getDescendant(this.editor, 'textEditor').value );
		}
	}
	
	this.getEditorDisplayValue = function(){
		if (this.idRelatedEntity > 0)	{
			var comboEditor = getDescendant(this.editor, 'comboEditor' + this.parentElement.id);
			if(comboEditor.options && comboEditor.options[comboEditor.selectedIndex])
				this.displayAttributeValue=comboEditor.options[comboEditor.selectedIndex].title;
			return comboEditor.options[comboEditor.selectedIndex].text;

		} else {
			return this.getEditorValue()
		}
	}
}

function focusDatetimeEditor(datetimeEditor){
	document.getElementById(datetimeEditor).focus();
}

// Ajax method to fill the combo values
function getRelatedEntityValues(comboName, idRelatedEntity, value){
	startProcessing();
	
	var getRelatedEntityValuesURL= "App/Ajax/AJAXGateway.aspx?action=10&comboName=" + comboName + "&idRelatedEntity=" + idRelatedEntity + "&value=" + value;
	getRelatedEntityValuesURL = PATH_TO_BASE_DIRECTORY+getRelatedEntityValuesURL;
	
	callAjaxURL(getRelatedEntityValuesURL,getRelatedEntityValuesCallback);
}

// Ajax method to fill the combo values (Callback)
function getRelatedEntityValuesCallback(strData) {
    var expression = new RegExp(/(\r\n|\n|\r)/gm);
    var strDataNoSpaces = strData.replace(expression, "");

    var rData = {};

    try {
        rData = JSON.parse(strDataNoSpaces);
        var code = new Function(rData.relatedEntityComboCode);
        code();
    } catch (e) {
        console.log("Error:", e.toString());
    }
	
	setTimeout("endProcessing()", 100);
}

