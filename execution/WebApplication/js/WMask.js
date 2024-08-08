	var oBARetypeElement = null;
	var isIE = (navigator.appName == "Microsoft Internet Explorer");
	var isIE10 = new RegExp('MSIE 10.0').test(navigator.appVersion);
	var BAAssociations = new Array();
	var MaskError = false;	
	
	function BADoInitBehavior(BABehaviorElement){
		var element = BABehaviorElement.element;

		AttachEvent(element,"focus",BAFocusWrapper);
		AttachEvent(element,"blur",BABlurWrapper);
		AttachEvent(element,"keyup",BAKeyUpWrapper);

		AttachEvent(element,"keypress",BAKeyPressWrapper);
		AttachEvent(element,"beforepaste",BADoBeforePasteWrapper);
		AttachEvent(element,"paste",BADoPasteWrapper);

		BABehaviorElement.TextTyped = element.value;	
		BABehaviorElement.doBlur();
		BABehaviorElement.TextTyped = element.value;	
		BABehaviorElement.TextChanged = false;
	}
	
	function BABehaviorKeyPress(evt){
	   	var e = (window.event) ? window.event : evt;
	    
	    if (this.TextChanged == false){
        	this.TextChanged = true;
        	this.TextTyped = "";
    	}
    	
		if(!isNaN(this.maxLength)){
			this.maxLength = parseInt(this.maxLength);
			
			if(this.element.value.length > this.maxLength-1) {
			    if (e.preventDefault && e.which && e.which != 0 && e.which != 8)
					e.preventDefault(); // DOM style
				else
					e.returnValue = false;
				return false;
			}
		}
	}


	function BABehaviorElement(BAHtmlElement){
		this.element = BAHtmlElement;
		BAHtmlElement.BABehavior = this;
		
		//Add behavior properties here
		this.TextChanged = false;
		this.TextTyped = "";
		this.maxLength = BAHtmlElement.getAttribute("maxlength");
		this.ReType = BAHtmlElement.getAttribute("ReType");
		this.preset = BAHtmlElement.getAttribute("preset");
		this.decimals = BAHtmlElement.getAttribute("decimals");
		this.regExp = BAHtmlElement.getAttribute("regExp");
		
		//Add Behavior events here
		this.doKeyPress = BABehaviorKeyPress;
		this.doInput	= BAInputFocus;
		this.doBlur		= BAInputBlur;
		this.doKeyUp	= BADoKey;
		this.formatValue= BAFormatValue;		
		this.doBeforePaste = BABeforePaste;
		this.doPaste	=	BAPaste;
		
		//Initialize the behavior
		BADoInitBehavior(this);
	}

	function BAVerifyBehavior(){
		var elements = document.getElementsByTagName("input");
		for (var i = 0; i < elements.length; i++){
			if (elements[i].className.indexOf('mask') != -1){
				new BABehaviorElement(elements[i]);
			}
		}
		
		elements = document.getElementsByTagName("textarea");
		for (var i = 0; i < elements.length; i++){
			if (elements[i].className.indexOf('mask') != -1){
				new BABehaviorElement(elements[i]);
			}
		}
		elements = document.getElementsByTagName("table");
		for (var i = 0; i < elements.length; i++){
			if (elements[i].getAttribute("leftXPath") != null){
				BAAssociations[BAAssociations.length] = elements[i];
			}
		}
	}

	function BAInputFocus(){
	}

	function BADoKey(e){
		var keyCode = e.keyCode;
		if ((keyCode > 47 && keyCode < 58) || (keyCode > 95 && keyCode < 106) || (keyCode == 8)) {
			switch (this.preset){
				case "currency":
					if ((this.element.value != "") && (this.element.value != "0")) {
						this.element.value = MaskMoney(this.element.value, false, this.decimals);
					}
					break;
			}
		}
	}

	function BAFormatValue()
	{
		switch(this.preset){
			case "shortdate":
				this.element.innerText = MaskDate(this.element.innerText, false);
				break;
			case "shortdatetime":
				this.element.innerText = MaskDate(this.element.innerText, true);
				break;		
			case "currency" :
				this.element.innerText = MaskMoney(this.element.innerText, true, this.decimals);
				break;
			case "bigint": 
				this.element.innerText = MaskNumber(this.element.innerText, this.preset);
				break;
			case "int": 
				this.element.innerText = MaskNumber(this.element.innerText, this.preset);
				break;
			case "smallint": 
				this.element.innerText = MaskNumber(this.element.innerText, this.preset);
				break;
			case "tinyint": 
				this.element.innerText = MaskNumber(this.element.innerText, this.preset);
				break;
			case "decimal": 
				this.element.innerText = MaskNumber(this.element.innerText, preset);
				break;
			case "numeric": 
				this.element.innerText = MaskNumber(this.element.innerText, this.preset);
				break;
			case "float": 
				this.element.innerText = MaskNumber(this.element.innerText, this.preset);
				break;
			case "real": 
				this.element.innerText = MaskNumber(this.element.innerText, preset);
				break;
			case "number": 
				this.element.innerText = MaskNumber(this.element.innerText, this.preset);
				break;
			case "texto":
				this.element.innerText = MaskTexto(this.element.innerText);
				break;
			case "atexto":
				this.element.innerText = MaskATexto(this.element.innerText);
				break;
			case "regExp":
				this.element.innerText = MaskRegExp(this.element.innerText, new RegExp(this.regExp));
				break;
			case "aregExp":
				this.element.innerText = MaskARegExp(this.element.innerText, new RegExp(this.regExp));
				break;
			case "hour":
				this.element.innerText = MaskHour(this.element.innerText);
				break;
			case "min":
				this.element.innerText = MaskMin(this.element.innerText);
				break;
		}
	}

	function BAPaste(evt){
	   	var e = (window.event) ? window.event : evt;
	   	if (isIE && !isIE10)
	   	{
			if(this.maxLength != null && !isNaN(this.maxLength)){
				if (e.preventDefault)
					e.preventDefault(); // DOM style
				else
					e.returnValue = false;
				maxLength = parseInt(this.maxLength);
				var oTR = this.element.document.selection.createRange();
				var iInsertLength = maxLength - this.element.value.length + oTR.text.length;
				var sData = window.clipboardData.getData("Text").substr(0,iInsertLength);
				oTR.text = sData;
			}
		} else {
			if(!isNaN(this.maxLength)){
				this.maxLength = parseInt(this.maxLength);
				
				if(this.element.value.length > this.maxLength-1)
				{
					this.element.text = this.element.text.substr(0, this.maxLength-1);
				}
			}			
		}
	}
	
	function BABeforePaste(evt){
	   	var e = (window.event) ? window.event : evt;
		if(this.maxLength != null && !isNaN(this.maxLength)){
			if (e.preventDefault)
				e.preventDefault(); // DOM style
			else
				e.returnValue = false;
			return false;
		}
	}

	function BAInputBlur(){
		MaskError = false;

		var element = this.element;
		if (this.ReType == "true"){
			if (element.value != this.TextTyped && this.TextTyped != ""){
				element.value = "";
			}
		}
		var sUnformattedValue = element.value;
		var formattedValue = "";
		switch (this.preset){
			case "shortdate":
				formattedValue = MaskDate(sUnformattedValue, false);
				break;
			case "shortdatetime":
				formattedValue = MaskDate(sUnformattedValue, true);		
				break;
			case "currency":
				formattedValue = MaskMoney(sUnformattedValue, true, this.decimals);
				break;
			case "percent":
				formattedValue = MaskPercent(sUnformattedValue);
				break;
			case "bigint":
				formattedValue = MaskNumber(sUnformattedValue, this.preset);
				break;
			case "int": 				
				formattedValue = MaskNumber(sUnformattedValue, this.preset);
				break;
			case "smallint": 
				formattedValue = MaskNumber(sUnformattedValue, this.preset);
				break;
			case "tinyint": 
				formattedValue = MaskNumber(sUnformattedValue, this.preset);
				break;
			case "decimal": 
				formattedValue = MaskNumber(sUnformattedValue, this.preset);
				break;
			case "numeric": 
				formattedValue = MaskNumber(sUnformattedValue, this.preset);
				break;
			case "float": 
				formattedValue = MaskNumber(sUnformattedValue, this.preset);
				break;
			case "real": 
				formattedValue = MaskNumber(sUnformattedValue, this.preset);
				break;
			case "number": 
				formattedValue = MaskNumber(sUnformattedValue, this.preset);
				break;
			case "texto":
				formattedValue = MaskTexto(sUnformattedValue);
				break;
			case "atexto":
				formattedValue = MaskATexto(sUnformattedValue);
				break;
			case "regExp":
				formattedValue = MaskRegExp(sUnformattedValue, new RegExp(this.regExp));
				break;
			case "aregExp":
				formattedValue = MaskARegExp(sUnformattedValue, new RegExp(this.regExp));
				break;
			case "hour":
				formattedValue = MaskHour(sUnformattedValue);
				break;
			case "min":
				formattedValue = MaskMin(sUnformattedValue);
				break;
		}
		try
		{
		    element.value = formattedValue;
	    }
	    catch(err){}
		var bPrintMessage = false;		
		if (this.ReType == "true" ){		
			if (this.TextTyped == "" && element.value !=""){
				this.TextTyped = sUnformattedValue;
				element.value = "";
				bPrintMessage = true;
				oBARetypeElement = element;
				//element.focus();	
			}
			else if (element.value != this.TextTyped){	    
				this.TextTyped = "";
	       }
	       
	    }
	    printReTypeMessage(this.element,bPrintMessage);
	
		
		if (bPrintMessage == false){
	       this.TextChanged = false	  ; 
		}	

		if(MaskError) {
			MaskError = false;
			setHelp(document.sDefHelpTitle, BA_MASKERROR, 3);
			try
			{
			    element.focus();
			}
			catch(err){}
		}
	}

	/****************************
	HTML Event wrapper methods. This functions are used to call the behavior real methods
	****************************/
	
	function BAKeyPressWrapper(e){	
		BAGetTarget(e).BABehavior.doKeyPress(BAGetEvent(e));		
	}

	function BADoPasteWrapper(e){
		BAGetTarget(e).BABehavior.doPaste(BAGetEvent(e));		
	}

	function BADoBeforePasteWrapper(e){
		BAGetTarget(e).BABehavior.doBeforePaste(BAGetEvent(e));		
	}

	function BAFocusWrapper(e){
		if (!oBARetypeElement){		
			BAGetTarget(e).BABehavior.doInput();		
		}
	}
	var rtControlToFocus = null;
	function SetRetypeFocus(name){
		rtControlToFocus.focus();
		rtControlToFocus = null;
	}

	function BABlurWrapper(e){
		e = BAGetEvent(e);	
		e.returnValue = false;
		BAGetTarget(e).BABehavior.doBlur();		
		if (oBARetypeElement){
			var cpy = oBARetypeElement;
			oBARetypeElement = null;
			if (isIE){
				cpy.focus();
			}
			else{
				rtControlToFocus = cpy;
				window.setTimeout("SetRetypeFocus()",100);
			}
		}

	}

	function BAKeyUpWrapper(e){
		BAGetTarget(e).BABehavior.doKeyUp(BAGetEvent(e));
	}

	/****************************
	Format functions
	****************************/

	function MaskGeneralNumber(sValue, sType, bRound, iDecimals)
	{
		if(iDecimals == null)
			iDecimals = BA_DIGITS_AFTER_DECIMAL;
		
		var sResult = "";
		if (sValue.length == 0) 
			sResult =  "";
		else{
			try{
				var sDecimals = "";
				var iValue = 0;
				var dblRealDecimals = 0;
				
				//Clear group separator
				var sGroupSeparator = BA_GROUP_SEPARATOR;
				if(sGroupSeparator == ".")
					sGroupSeparator = "\\."
				sValue = eval("sValue.replace(/" + sGroupSeparator + "/g, \"\")");
				
				//Convert (x) format of negative numbers into -x format
				if (sValue.indexOf("(") == 0){
					sValue = sValue.replace("(","");
					sValue = sValue.replace(")","");
					sValue = "-" + sValue;
				}
				
				//Manage negative numbers
				var bNegativeNumber = false;
				if (sValue.indexOf("-") == 0){
					bNegativeNumber = true;
					sValue = sValue.replace("-","");
				}			
				//Resolve decimals
				var iPos = sValue.indexOf(BA_DECIMAL_SEPARATOR);
				
				//Manage decimals (rounding them if necessary)
				if (iPos != -1){
					//asdf
					sDecimals = sValue.substring(iPos+1);
					sDecimals = sDecimals.replace(BA_DECIMAL_SEPARATOR, "");
					//var dblTestDecimals = BAParseFloat(sDecimals)
					var dblTestDecimals = parseFloat(sDecimals)
					dblRealDecimals = BAParseFloat(sDecimals / Math.pow(10,sDecimals.length));
				
					if (bRound){
						var bRoundValue = dblRealDecimals * Math.pow(10, parseInt(iDecimals));
						bRoundValue = Math.round(bRoundValue);
						
						//Checks if the decimals has been rounded to 1
						sDecimals = "";
						if(bRoundValue != Math.pow(10, parseInt(iDecimals)))
						{
							for (var i=0; i<(iDecimals - bRoundValue.toString().length); i++)
								sDecimals = sDecimals + "0";
							sDecimals = sDecimals + bRoundValue.toString();
						}
					}	

					sDecimals = BA_DECIMAL_SEPARATOR + sDecimals.substring(0, iDecimals);
				
					iValue = sValue.substring(0,iPos);
				}
				else{
					iValue = sValue;
				}
				
				//Integer part
				//JOB 15/01/2007: Bigint numbers are too big and can lose presition
				if (sType != "bigint"){
					iValue = BAParseFloat(iValue);
				}
				
					
				//get result based on number type
				switch(sType){
					case "bigint":
					    var iBigValue = 0;	
					    if (iValue.length > 15){
							iBigValue = BAParseFloat(iValue.substring(0,iValue.length-15));
							iValue = BAParseFloat(iValue.substring(iBigValue.toString().length));
					    }
					    else{
					    	iValue = BAParseFloat(iValue);
					    }					    
						iValue = Math.round(iValue + dblRealDecimals);
						if (iBigValue>=9223){
							if(iValue > 372036854775807 || iValue < -372036854775807){
								iValue = "";
								iBigValue=0;
							}
						}
						sResult = "";
						if (iBigValue != 0){
							sResult = iBigValue.toString();
						}
						sResult += iValue.toString();
						sResult = sResult.replace(/,/g, BA_DECIMAL_SEPARATOR);
						sResult = sResult.replace(/\./g, BA_DECIMAL_SEPARATOR);
						break;			
					case "int":
						iValue = parseInt(iValue);
						if (iValue > 2147483647 || iValue < -2147483647 ){
							iValue = "";
						}
						sResult = iValue.toString();
						break;
					case "smallint":
						iValue = parseInt(iValue);						
						if (iValue > 32767 || iValue < -32767){
							iValue = "";
						}
						sResult = iValue.toString();
						break;
					case "tinyint":
					    if (bNegativeNumber == true){
					     iValue = "-" + iValue;
					      if(iValue < 0){ 
					        iValue = "";
					      }
					      sResult = iValue.toString();
   				        }
				        else
				        {
						  iValue = parseInt(iValue);						
						  if (iValue > 255 || iValue < 0){
						  	iValue = "";
						  }
						  sResult = iValue.toString();
						}
						break;
					case "decimal":
						if(dblRealDecimals > 0)
							iValue = BAParseFloat(dblRealDecimals.toString().replace("0.", iValue.toString() + "."));
							
						if (iValue > 999999999999999 || iValue < -999999999999999){
							iValue = "";
						}
						sResult = iValue.toString();
						sResult = sResult.replace(/,/g, BA_DECIMAL_SEPARATOR);
						sResult = sResult.replace(/\./g, BA_DECIMAL_SEPARATOR);						
						break;	
					case "numeric":
						if(dblRealDecimals > 0)
							iValue = BAParseFloat(dblRealDecimals.toString().replace("0.", iValue.toString() + "."));
							
						if(iValue > 999999999999999 || iValue < -999999999999999){
							iValue = "";
						}
						sResult = iValue.toString();
						sResult = sResult.replace(/,/g, BA_DECIMAL_SEPARATOR);
						sResult = sResult.replace(/\./g, BA_DECIMAL_SEPARATOR);
						break;
					case "float":
						if(dblRealDecimals > 0)
							iValue = BAParseFloat(dblRealDecimals.toString().replace("0.", iValue.toString() + "."));
							
						if(iValue > 999999999999999 || iValue < -999999999999999){
							iValue = "";
						}
						sResult = iValue.toString();
						sResult = sResult.replace(/,/g, BA_DECIMAL_SEPARATOR);
						sResult = sResult.replace(/\./g, BA_DECIMAL_SEPARATOR);
						break;
					case "real":
						if(dblRealDecimals > 0)
							iValue = BAParseFloat(dblRealDecimals.toString().replace("0.", iValue.toString() + "."));
							
						if(iValue > 999999999999999 || iValue < -999999999999999){
							iValue = "";
						}
						sResult = iValue.toString();
						sResult = sResult.replace(/,/g, BA_DECIMAL_SEPARATOR);
						sResult = sResult.replace(/\./g, BA_DECIMAL_SEPARATOR);				
						break;
					case "number":
						if(dblRealDecimals > 0)
							iValue = BAParseFloat(dblRealDecimals.toString().replace("0.", iValue.toString() + "."));
					
						sResult = iValue.toString();
						sResult = sResult.replace(/,/g, BA_DECIMAL_SEPARATOR);
						sResult = sResult.replace(/\./g, BA_DECIMAL_SEPARATOR);
						break;
					case "currency":
						//Resolve Group Separator
						var sFinalValue = "";
						var i = 1;
						var currencyValue = iValue.toString();
						var contSEPARATOR = 0;
						for (var iCount = currencyValue.length; iCount>0; iCount--)
						{
							var	digit = currencyValue.charAt(iCount-1);
							if (i % BA_GROUP_SIZE == 0){
							    if(contSEPARATOR <=3)
							    {
								  sFinalValue = BA_GROUP_SEPARATOR + digit + sFinalValue ;
								  contSEPARATOR++;
								}
							}
							else{
								sFinalValue = digit + sFinalValue ;
							}
							i = i + 1;
						}	
						
						
				
						if (sFinalValue.substring(0, 1) == BA_GROUP_SEPARATOR){
							sFinalValue = sFinalValue.substring(1);
						}
						sResult = sFinalValue + sDecimals;	
						break;	

				}
				if (bNegativeNumber == true && sResult!="" ){
					sResult = "-" + sResult;
				}			
				
			}
			catch(err){
				sResult = "";
				MaskError = true;
			}
		}
		return sResult;						
	}


	function MaskMoney(sValue,bRound,iDecimals){
		return MaskGeneralNumber(sValue, "currency", bRound, iDecimals);		
	}	

	function MaskNumber(sValue, preset){ 
		return MaskGeneralNumber(sValue, preset, false, null);
	}

	function MaskHour(sValue){
		var vMaskHour = "";
		var tTime= new Date();
		var minutes = tTime.getMinutes();
		minutes -= 10;
		tTime.setMinutes(minutes);
		
		if (sValue.length == 0) {
			if (tTime.getHours() > 12 )
				vMaskHour = tTime.getHours() - 12;
			else
				vMaskHour = tTime.getHours();
		}
		else 
		{
			if  (isNaN(sValue) || sValue=="0")
				vMaskHour =12		
			else 
			{
				if (sValue>=13 &&  sValue<=24)
					vMaskHour =  sValue -12;
				else if (sValue>24 ||  sValue < 0 )
					vMaskHour =  12;
				else
					vMaskHour =  sValue;
			}
		}
		return vMaskHour;
	}
	
	function MaskMin(sValue){ 
		var vMaskMin = "";
		var tTime= new Date();
		var minutes = tTime.getMinutes();
		minutes -= 10;
		tTime.setMinutes(minutes);
	
		if (sValue.length == 0){
			if (tTime.getMinutes()< 10)
				vMaskMin =  "0"+tTime.getMinutes(tTime);
			else
				vMaskMin =tTime.getMinutes();		
		}
		else{
			if  (isNaN(sValue))
				vMaskMin = "00";
			else if (sValue > 59 ||  sValue < 0)
				vMaskMin =  "00";
			else
				vMaskMin =  sValue;			
		}
	}
	
	function MaskPercent(sValue)
	{
		var vMaskPercent = "";
		if (sValue.length == 0)
			vMaskPercent = "";
		else
		{
			try{
				iValue = BAParseFloat(sValue);		   
				iValue = iValue * 100
				vMaskPercent = iValue + "%";
			}
			catch(err){
				vMaskPercent = "";
			}
		}
	}

	function MaskTexto(sValue){
		var sRetorno;
		var sLocal;
		var iCont;

		//Trim string
		sLocal = sValue.replace(/^\s+|\s+$/g, '') ;

		if(sValue.length == 0)
			sLocal = "";
		else
			sLocal = sLocal.replace(/"/g,"");
		
		return sLocal;
	}

	function MaskATexto(sValue){
		var sRetorno;
		var sLocal;
		
		//Trim string
		sLocal = sValue.replace(/^\s+|\s+$/g, '') ;
		
		if (sValue.length == 0 ){
				return "";
		}
		
		return sLocal;
	}

	function MaskRegExp(sValue, sRegExp){
		var sLocal = sValue;

		if(sValue.length == 0)
			sLocal = "";
		else
			sLocal = sLocal.replace(/"/g,"");
			
		if(!(sRegExp.test(sLocal)))
			sLocal = "";
		
		return sLocal;
	}

	function MaskARegExp(sValue, sRegExp){
		var sLocal = sValue;

		if (sValue.length == 0 ){
			return "";
		}
			
		if(!(sRegExp.test(sLocal)))
			sLocal = "";
		
		return sLocal;
	}

	function MaskDate(sValue, bIsDateTime){	
		if (sValue.length == 0){
			return "";
		}
		
		sValue = sValue.replace("a.m.","AM"); //a.m. format is not allowed in VBScript	
		sValue = sValue.replace("p.m.","PM"); //a.m. format is not allowed in VBScript	

		var thisDateFormat = BA_DATE_FORMAT_MASK;
		if(bIsDateTime){
			thisDateFormat = thisDateFormat +" "+BA_TIME_FORMAT_MASK;
		}
		var formatedDate = getDateFromFormat(sValue, thisDateFormat);
		if (formatedDate == "0") {
			MaskError = true;
			return "";
		}else{
			return BAFormatDateTime(getDateFromFormat(sValue, thisDateFormat), thisDateFormat);
		}
	}

	/****************************
	Helper functions
	****************************/
	function BAFormatDateTime(dateParam, dateFormatParam){
		return dateParam.format(dateFormatParam);
	}
	
	function BAParseFloat(sText){
		var BAfloat = parseFloat(sText);
		if (isNaN(BAfloat) || sText.toString().length != BAfloat.toString().length){
			throw "NaN";
		}
		return BAfloat;
	}
	
	function BAGetTarget(e){
		e = BAGetEvent(e);		
		if (isIE){
			return e.srcElement;
		}
		else{
			return	e.target;
		}
	}
	
	function BAGetEvent(e){
		if (isIE){
			return event;
		}
		else{
			return	e;
		}
	}

	function AttachEvent(elementObj, eventName, eventHandlerFunctionName){  
		if (elementObj.addEventListener)   {
			 // Non-IE browsers    
			 elementObj.addEventListener(eventName, eventHandlerFunctionName, false);		  
		}
		else if (elementObj.attachEvent)   {
		  // IE 6+    
		  elementObj.attachEvent('on' + eventName, eventHandlerFunctionName); 
		}else   { // Older browsers     
			var currentEventHandler = elementObj['on' + eventName];    
			if (currentEventHandler == null)     
			{      
				elementObj['on' + eventName] = eventHandlerFunctionName;    
			}     
			else     
			{      
			elementObj['on' + eventName] = function(e) { currentEventHandler(e); eventHandlerFunctionName(e); }    
			}  
		}
	}
	
	function printReTypeMessage(BAHTMLElement,bPrint){
		var oBARetypeMContId = BAHTMLElement.getAttribute("oBARetypeMCont");
		var oBARetypeMCont = null;
		if (oBARetypeMContId != null){
			oBARetypeMCont = document.getElementById(oBARetypeMContId);
		}
		if (bPrint){
			if (!oBARetypeMCont){     
				oBARetypeMCont = document.createElement("span");
				oBARetypeMCont.innerHTML  = " " + BA_RETYPEVALUE;
				oBARetypeMCont.className = "WarningMessage";
				oBARetypeMCont.id = BAHTMLElement.name+"Retype";
				//BAHTMLElement.insertAdjacentElement ("afterEnd", oBARetypeMCont);
				if (BAHTMLElement.nextSibling){
					BAHTMLElement.parentNode.insertBefore(oBARetypeMCont,BAHTMLElement.nextSibling);
				}
				else{
					BAHTMLElement.parentNode.appendChild(oBARetypeMCont);
				}
				BAHTMLElement.setAttribute("oBARetypeMCont",oBARetypeMCont.id);
				//BAHTMLElement.oBARetypeMCont = oBARetypeMCont;
			}
			oBARetypeMCont.style.display = "inline";
		}
		else{
			if (oBARetypeMCont){
				oBARetypeMCont.style.display = "none";
			}
		}
	}
	

	//function alert(smessage){
	//	document.getElementById("BAmessagebox").innerHTML=document.getElementById("BAmessagebox").innerHTML+"\n"+smessage;
	//}

		