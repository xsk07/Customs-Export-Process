var oWizardVisible = false;

var DivCloseWidth = 1;
var DivCloseHeight = 1;

var DivBackgroundTxtLeft = 5;
var DivBackgroundTxtTop = 5;
var DivBackgroundTxtWidth = 185;
var DivBackgroundTxtHeight = 125;

var DivFloater1DivWidth = 185;
var DivFloater1DivHeight = 125;

function initFloaters() {
    // Positioning the wizard with CSS to avoid crossbrowser issues
    return false;
	allFloaters = new Array();
	
	if (document.getElementById("floater1Div") == null){
	    OWPSettingsUseWizard = false;
	}
	if  (OWPSettingsUseWizard||typeof(OWPSettingsUseWizard)=='undefined'){
	    floater1 = new floater('floater1Div', 5, -1, -1, 0, 0);
	    floater1.floatx();
	}
}

function floater(div, position, width, height, hMargin, vMargin) {
	if (navigator.appName != 'Microsoft Internet Explorer') {
		this.div = document.getElementById(div);
		this.div.visibility = 'show';

		if (width == -1) width = DivFloater1DivWidth;
		if (height == -1) height = DivFloater1DivHeight;
		
	} else {
		this.div = eval(div + '.style');
		this.div.visibility = 'visible';
		if (width == -1) width = eval(div + '.offsetWidth');
		if (height == -1) height = eval(div + '.offsetHeight');
	}

	this.position = position;
	this.width = width;
	this.height = height;
	this.div.width = width;
	this.div.height = height;
	this.hMargin = hMargin;
	this.vMargin = vMargin;

	this.floatx = floatx;
	
	this.idNo = allFloaters.length;
    allFloaters[allFloaters.length] = this;
    if (this.floatTimer !== undefined) {
        clearInterval(this.floatTimer);
    }
	this.floatTimer = setInterval("allFloaters[" + this.idNo + "].floatx()", 500);
}

function floatx() {   

	if (!bLoadComplete)
		return;

	getwahas();
	
	var w = winwidth - this.width;
	var h = winheight - this.height;
	
	if (this.position == 1){ var xPos = this.hMargin; var yPos = this.vMargin; }
	if (this.position == 2){ var xPos = w/2; var yPos = this.vMargin; }
	if (this.position == 3){ var xPos = w - this.hMargin; var yPos = this.vMargin; }
	if (this.position == 4){ var xPos = w - this.hMargin; var yPos = h/2; }
	if (this.position == 5){ var xPos = w - this.hMargin; var yPos = h - this.vMargin; }
	if (this.position == 6){ var xPos = w/2; var yPos = h - this.vMargin; }
	if (this.position == 7){ var xPos = this.hMargin; var yPos = h - this.vMargin; }
	if (this.position == 8){ var xPos = this.hMargin; var yPos = h/2 }
	if (this.position == 9){ var xPos = w/2; var yPos = h/2; }
	
	if ((isNaN(xPos)) || (isNaN(yPos))) return;
	
	//clear text before moving wizard, in order to avoid IE bug
	if (document.getElementById("BackgroundTxt") == null){
		return;
	}
	var thisText = document.getElementById("BackgroundTxt").innerHTML;
	document.getElementById("BackgroundTxt").innerHTML = "";
	
	if (document.all) { //IE
		this.div.left = leftscroll + xPos;
		this.div.top = topscroll + yPos;
	} else if (document.getElementById) {
		this.div.style.left = leftscroll + xPos;
		this.div.style.top = topscroll + yPos;
	}
	
	//set text again
	document.getElementById("BackgroundTxt").innerHTML = thisText;
	drawWizardIFrame();
}

function drawWizardIFrame(){
	var wizardIFrame	 = document.getElementById("floater1Divfrm");	
	var wizardClose		 = document.getElementById("divClose");	
	var wizardContainer  = document.getElementById("floater1Div");
	
	var left = removePX(wizardContainer.style.left);
	var top = removePX(wizardContainer.style.top);
		
	wizardIFrame.style.top = top + "px";
	wizardIFrame.style.left = (left + 3) + "px";

	// wizardClose.style.top = (top + DivFloater1DivHeight + 6) + "px";
	// wizardClose.style.left = (left + DivFloater1DivWidth - 1) + "px";
}

function removePX(sSize) {
	var iSize = parseInt(sSize.replace("px",""));
	
	if (isNaN(iSize)) 
		iSize = 0;
		
	return iSize;
}

function getwahas() {
	if(navigator.appName != 'Microsoft Internet Explorer') {
		var imgWizard	 = document.getElementById("imgWizard");
		var imgWidth = 0;
		if (imgWizard != null)
		{
		    imgWidth = imgWizard.offsetWidth + 36;
		}
	
	    winwidth = window.innerWidth - imgWidth;
	    winheight = window.innerHeight - 26;
		
	    leftscroll = window.pageXOffset;
	    topscroll = window.pageYOffset;	

	} else {
		winwidth = document.body.clientWidth - 5;
		winheight = document.body.clientHeight - 5;
		leftscroll = document.body.scrollLeft;
		topscroll = document.body.scrollTop;
	}
}
var bWizardEnabled = true;

function BlinkWizzard(){
	if (!bWizardEnabled){
	    document.getElementById("imgCloseWizzard").src = "../../img/wizard/closeblink.gif";
	}
}

function ClickEnableWizzard(){
	EnableWizzard(!bWizardEnabled);
}

var bWizardMagicPrinted = false;

function printWizardMagic(sImgFileName) {
	if (bWizardMagicPrinted){
		return; //div already in the page
	}
    if  (!OWPSettingsUseWizard){
        document.write("</td></tr><tr><td><div id=\"BackgroundTxt\" style=\"display:none\">hola</div></td></tr><tr><td>");
        oWizardVisible = true;
    }
    else{
		document.write("<iframe frameborder='0' id='floater1Divfrm' style=\"z-index:1;visibility:hidden;position:absolute;background-color:transparent;height:0px;width:0px;\" ></iframe>");
    	document.write("<div id=\"floater1Div\" style=\"z-index:1\">");
		document.write("<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td>");
		document.write("	<div id=\"BackgroundTxt\" style=\"position:absolute;left:" + DivBackgroundTxtLeft + ";top:" + DivBackgroundTxtTop + ";width:" + DivBackgroundTxtWidth + "px; height:" + DivBackgroundTxtHeight + "px;z-index:1;visibility:hidden;padding:5px;\" >");
		document.write("	</div>");
		document.write("	<div id=\"BackgroundImg\" align=\"center\" style=\"visibility:hidden;z-index:1;\">");
		document.write("		<a href=\"javascript:void(0);\" onClick=\"EnableWizzard(false);\">");
		document.write("			<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\"><tr><td><img id=\"imgBackgroundImg\" src=\"../../img/wizard/globo.gif\" border=\"0\" align=\"center\" style=\"visibility:hidden;\"></td>");
		document.write("			<td><img id=\"imgWizard\"  src=\"../../img/wizard/" + sImgFileName + "\" border=\"0\" align=\"center\"></td></tr></table>");
		document.write("		</a>");
		document.write("	</div>");
		document.write("    <div id=\"divClose\" style=\"position:absolute;width:" + DivCloseWidth + "px; height:" + DivCloseHeight + "px;z-index:1;visibility:visible;cursor:pointer;\" border=\"0\">");
		document.write("	    <img id=\"imgCloseWizzard\" style=\"visibility:hidden;\" src=\"../../img/wizard/Close.gif\" border=\"0\" style=\"cursor:hand\" onClick=\"ClickEnableWizzard();\">");
		document.write("    </div>");
		document.write("</td></tr></table>");
		document.write("</div>");
		
		var timeout = setTimeout(function() {
            DrawWizard();
            clearTimeout(timeout);
        }, 500);
	}
	bWizardMagicPrinted = true;
}

function DrawWizard(){
		document.getElementById("BackgroundImg").style.visibility = "visible";		
		document.getElementById("imgBackgroundImg").style.visibility = "visible";	
		document.getElementById("imgCloseWizzard").style.visibility = "visible";	
		
		document.getElementById("BackgroundTxt").style.visibility = "visible";	
		document.getElementById("floater1Div").style.zIndex = "1" ;
		
		oWizardVisible = true;
		
		//Move the iframe
		var wizardContainer  = document.getElementById("floater1Div");
		var wizardIFrame	 = document.getElementById("floater1Divfrm");
		
		if(wizardContainer.offsetWidth - 14 > 0)
			wizardIFrame.style.width = wizardContainer.offsetWidth - 14;
		wizardIFrame.style.height = 0;
		wizardIFrame.style.width = 0;
		wizardIFrame.style.zIndex = wizardContainer.style.zIndex - 1;		
		
		drawWizardIFrame();
		
		wizardIFrame.style.visibility = "visible";
}

function EnableWizzard(bEnable) {
	if (!bLoadComplete)
		return;

	bWizardEnabled = bEnable;
	
	if (document.getElementById("BackgroundImg") != null){
		document.getElementById("BackgroundImg").style.visibility = bEnable ? "visible":"hidden";	
		document.getElementById("imgBackgroundImg").style.visibility = bEnable ? "visible":"hidden";			
		
		//document.getElementById("BackgroundImg").style.display = bEnable ? "block":"none";	
		//document.getElementById("imgBackgroundImg").style.display = bEnable ? "block":"none";			
	}
	
	if (typeof(BackgroundTxt)!="undefined"){
		document.getElementById("BackgroundTxt").style.visibility = bEnable ? "visible":"hidden";
	}
	
	if  (OWPSettingsUseWizard){
		if (document.getElementById('imgCloseWizzard')!=null)
		{
			if (!bWizardEnabled){
				document.getElementById("imgCloseWizzard").src = "../../img/wizard/open.gif";
			}
			else{
				document.getElementById("imgCloseWizzard").src = "../../img/wizard/close.gif";
			}
		}
	}
	
	if (typeof(floater1Divfrm)!="undefined"){
		document.getElementById("floater1Divfrm").style.visibility = bEnable ? "visible":"hidden";
	}

	if (typeof(floater1Div)!="undefined"){
		document.getElementById("floater1Div").style.visibility = bEnable ? "visible":"hidden";
	}
}

function isEnabled() {
	if (OWPSettingsUseWizard){
		if (document.getElementById("BackgroundImg")==null || document.getElementById("BackgroundImg").style.visibility == "hidden")
		{
			return false;
		}
	}
	else{
		return true;
	}
	return true;
}

var tLastError = 0;
function setHelp(sHelpTitle, sHelpText, iHelpType) {	
    if (!oWizardVisible){        
        var timeout = setTimeout(function() {
            setHelp(sHelpTitle, sHelpText, iHelpType);
            clearTimeout(timeout);
        },20);
        return;
    }
	var sPre='';
	var sPost=''; 
	var sEnd='';
	var d = new Date();

	// if Wizard is disabled must continue this way, at least is an important message
	//if (!isEnabled() && iHelpType == 1)
	//	return;
	BlinkWizzard();
	//EnableWizzard(true);
	//Prevent Error Message overlapping
	if (d.getTime() - tLastError < 500)
		return;
	if (!OWPSettingsUseWizard){	
		if (iHelpType == 1) {
			window.status = sHelpText;
		}
		else if (iHelpType == 2) {
			window.status = sHelpText;
		}
		else if (iHelpType == 3) {
		    if (OWPSettingsDisplayInMessageBox){
				window.alert(sHelpText);	
			}
			else{
				sPre= "<font color=\""+OWPSettingsErrorColor+"\" >";
				sPost ="</font>";
			}
		}
		else if (iHelpType == 4) {
			window.status = sHelpText;
		}
	}
	else{
		//Type 1 -> Normal Message
		if (iHelpType == 1) {
			//sPre = "<b>";
			//sPost = "</b><br><br>";
			sPre = "<table width='100%' border='0'>";
			if (sHelpTitle.length > 0){
				sPre +="<tr><td class='HelpMessgeTitle' align='left'>";
				sPost = "</td></tr>";
			}
			sPost += "<tr><td>";
			sEnd = "</td></tr></table>";

		//Type 2 -> Success Message
		} else if (iHelpType == 2) {
			sPre = "<b><span class=\"BAMainFontColor\" style=\"font-size:12px\">";
			sPost = "</span></b><br>";

		//Type 3 -> Error Message
		} else if (iHelpType == 3) {
			tLastError = d.getTime();
			sPre = "<b><font color=\"#FF0000\">";
			sPost = "</font></b><br><br>";
			sHelpTitle = BA_CONSIDER;

		//Type 4 -> Warning Message
		} else if (iHelpType == 4) {
			sPre = "<b><font color=\"#0000AA\">";
			sPost = "</font></b><br><br>";
			sHelpTitle = BA_WARNING;
		}
		//Enable vertical scrollbars when the text is overlaped:
		if (sHelpText.length > 110){
			document.getElementById("BackgroundTxt").style.overflow = "auto";
			document.getElementById("BackgroundTxt").style.scrollbarBaseColor = "#D1EDF0";	
			document.getElementById("BackgroundTxt").style.scrollbarTrackColor = "#D1EDF0";
		}
		else{
			document.getElementById("BackgroundTxt").style.overflow = "hidden";
		}
	}
	//Write ballon message
	if (!OWPSettingsUseWizard){	
	    if (!OWPSettingsDisplayInMessageBox&&iHelpType == 3){
			document.getElementById("BackgroundTxt").innerHTML = sPre + sHelpText + sPost  ;
			document.getElementById("BackgroundTxt").style.display = "inline";
			if(parent.BAMainFrame != null)
				parent.BAMainFrame.scrollTo(0, 0);
		}
	}
	else{		
		document.getElementById("BackgroundTxt").innerHTML = sPre + sHelpTitle + sPost + sHelpText+sEnd;	
	}	
}
