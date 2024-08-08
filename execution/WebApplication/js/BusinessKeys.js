function getElementValue(key) {
    if(document.getElementsByName(key).length > 0)
        return document.getElementsByName(key)[0].value;
    else if(document.getElementsByName("h_" + key).length > 0)
        return document.getElementsByName("h_" + key)[0].value;
    else
        return null;
}

function getBusinessKeysAndValues(){
	var businessKeysInput = document.getElementById('h_BusinessKeys');
	var sReturnValue = "";
	if (businessKeysInput){
		var businessKeys = businessKeysInput.value.split(',');
			
		for (var i = 0; i < businessKeys.length; i++){
			var key = businessKeys[i];
			try
			{
			   sReturnValue = sReturnValue + key + "|" + getElementValue(key) + ",";
			}
			catch( ev )//For support when a column of two composite business key, is identity and the other no
			{
			}
		}
		
		if (sReturnValue.length > 0){
			sReturnValue = sReturnValue.substring(0,sReturnValue.length-1);
		}
	}
	return sReturnValue;
}

function getAttributeRequiredExternaSourceAndValues(){
	var businessValuesInput = document.getElementById('h_BusinessValues');
	var sReturnValue = "";
	if (businessValuesInput){
		var businessValues = businessValuesInput.value.split('~');
			
		for (var i = 0; i < businessValues.length; i++){
			var key = businessValues[i];
			var value = getElementValue(key);
			
			if(value != null)
			   sReturnValue = sReturnValue + key + "|" + value + "~";
		}
		
		if (sReturnValue.length > 0){
			sReturnValue = sReturnValue.substring(0,sReturnValue.length-1);
		}
	}
	return sReturnValue;
}


var m_isJoinSearchDialog = true;
function BusinessKeysCallback(jsonResponse){

	var idSurrogateKeyInput = document.getElementById('h_idSurrogateKey');
	var data;
	if (idSurrogateKeyInput && jsonResponse){
	    try
	    {
		   data = eval(" (" + jsonResponse + ")");
    	}
		catch( e1 )
		{
		  setHelp('Entities', 'Duplicate Business key', 3);
		}
		if(data != null)
		{
		    idSurrogateKeyInput.value = data.idSurrogateKey;
		    if (data.idSurrogateKey <= 0){
			    var eMessage = data.Message;
			    if (eMessage)
				    setHelp('Entities', eMessage, 3);
				var eMessageError = data.Error;
				if (eMessageError)
				  setHelp('Entities', eMessageError, 3);
		    }
		    else{
		        doFormSubmitIE(m_isJoinSearchDialog);
		    }
		}
	}
	bOnSubmit = false;
}

function VerifyBusinessKeys(isJoinSearchDialog){
	m_isJoinSearchDialog = isJoinSearchDialog;
	var idSurrogateKeyInput = document.getElementById('h_idSurrogateKey');
	var idEntityInput = document.getElementById('h_idEntity');
	var businessKey = getBusinessKeysAndValues();
	var businessValues = getAttributeRequiredExternaSourceAndValues();
	if (idSurrogateKeyInput && idEntityInput && idSurrogateKeyInput.value <= 0 && idEntityInput.value > 0 /*&& businessKey && businessKey.length > 0*/){
		//var sURL = "../Ajax/AJAXGateway.aspx?action=2000&BusinessKey=" + businessKey + "&idEntity=" + idEntityInput.value;
		var sURL = "../Ajax/AJAXGateway.aspx?action=2000&BusinessKey=" + businessKey + "&idEntity=" + idEntityInput.value + "&BusinessValues=" + businessValues;
		callAjaxURL(sURL, BusinessKeysCallback);
	}
	else{
		bOnSubmit = false;
		doFormSubmitIE(isJoinSearchDialog);
	}
}

function doFormSubmit(isJoinSearchDialog) {
    if (isIE)
        return doFormSubmitIE(isJoinSearchDialog);
    else
        return doFormSubmitOthers(isJoinSearchDialog);
}

function doFormSubmitIE(isJoinSearchDialog) {
    m_isJoinSearchDialog = isJoinSearchDialog;
    if (document.getElementById('h_idSurrogateKey').value > 0 || isJoinSearchDialog) {
        bOnSubmit = true;
        document.frm.submit();
        document.body.style.cursor = "wait";
        if (isJoinSearchDialog)
            CloseJSWindow(document.getElementById('h_idSurrogateKey').value);

        return true;
    }
    else {
        return false;
    }
}

function doFormSubmitOthers(isJoinSearchDialog){
	m_isJoinSearchDialog = isJoinSearchDialog;
	if (document.getElementById('h_idSurrogateKey').value > 0 || isJoinSearchDialog) {
	    bOnSubmit = true;
	    var data = $(document.frm).serialize();
	    new Ajax.Request(document.frm.action, {
	        method: 'post',
	        onSuccess: function () {
	            if (isJoinSearchDialog)
	                CloseJSWindow(document.getElementById('h_idSurrogateKey').value);

	            return true;
	        },
	        parameters: data
	    });
		
        document.body.style.cursor="wait";
	}
	else{
		return false;
	}
}

function ToggleMainWindow(){
	var JSMainWindow = document.getElementById('JSDialogMainWindow');
	var NewEntityWindow = document.getElementById('NewEntityWindow');
	if (!JSMainWindow || !NewEntityWindow){
		var BABase = window.parent;
		JSMainWindow = BABase.document.getElementById('JSDialogMainWindow');
		NewEntityWindow = BABase.document.getElementById('NewEntityWindow');	
	}
	
	
	if (JSMainWindow && NewEntityWindow){
		if (JSMainWindow.style.visibility == "hidden"){
			JSMainWindow.style.visibility = "visible";
			NewEntityWindow.style.visibility = "hidden";
			JSMainWindow.style.display = "block";
			NewEntityWindow.style.display = "none";
			var BADialog = window.parent.parent.parent.BADialog;
			BADialog.maximize();
		}
		else{
			JSMainWindow.style.visibility = "hidden";
			NewEntityWindow.style.visibility = "visible";
			JSMainWindow.style.display = "none";
			NewEntityWindow.style.display = "block";
			var BADialog = window.parent.parent.BADialog;
			BADialog.maximize();
			ReSizeiFrame(BADialog);
		}
	}
}


function DisplayNewEntityWindow(sURL){
	var iFrame = document.getElementById('iNewEntity');
	if (iFrame){
		iFrame.src = sURL;
	}
}

function ReSizeiFrame(BADialog){
	var iFrame = document.getElementById('iNewEntity');
	if (iFrame){
		var size = BADialog.getSize();	
		if (size && size.height){
			var height = size.height + " ";
			height = height.replace(/px/,"");
			iFrame.style.height = height - 45;
		}
	}
}

function CloseJSWindow(idSurrogateKey){
	if (parent.parent.parent.BAWindowParam){
		parent.parent.parent.BAWindowParam[0].value = idSurrogateKey;
		parent.parent.parent.CloseCurrentWindow(parent.parent.parent.BAWindowParam);
	}
}

