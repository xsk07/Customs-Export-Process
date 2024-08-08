// *** Browser Type Detection
var ppcIE = checkIsIE();
var ppcNN6 = ((navigator.appName == "Netscape") && (parseInt(navigator.appVersion) == 5));
var ppcNN = ((navigator.appName == "Netscape") && (document.layers));
var ppcX = 4;
var ppcY = 4;
var ppcCHROME = (navigator.userAgent.indexOf("Chrome") >= 0);
var ppcFirefox = (navigator.userAgent.indexOf("Firefox") >= 0);

/*
* Method to detect IE visitors
*/
function checkIsIE() {
    var result = (navigator.appName.indexOf("Internet Explorer") > 0) ? true : ( checkIsIE11() ? true : false);
    return result;
};

/*
* Method to detect IE11 visitors
*/
function checkIsIE11() {
    return !!navigator.userAgent.match(/Trident\/7.0/) && !navigator.userAgent.match(/MSIE/i);
};

/*
* Returns ie version number, if is not, return -1
*/
function getIEVersion() {
    var result;

    if (checkIsIE()) {
        if (checkIsIE11())
            result = 11;
        else    
            result = Number(document.documentMode);
    }
    else
        result = -1;

    return result;
}

// *** END Browser Type Detection

var IsCalendarVisible;
var calfrmName;
var maxYearList;
var minYearList;
var todayDate = new Date;
var curDate = new Date;
var curImg;
var curDateBox;
var curScrollY;
var minDate = new Date;
var maxDate = new Date;
var IsUsingMinMax;
var FuncsToRun;
var img_del;
var img_close;
var bhour;
var bAmPm;
var bhourChanged = false;

var versionIE = getIEVersion();
var bHideDropDowns = versionIE === -1 ? false : (versionIE < 7); //true, for IE 6

function calSwapImg(whatID, NewImg, override) {
    if (document.images) {
        if (!(IsCalendarVisible && override)) {
            document.images[whatID].src = eval(NewImg + ".src");
        }
    }
    window.status = ' ';
    return true;
}

function getOffsetLeft(el) {
    var ol = el.offsetLeft;
    while ((el = el.offsetParent) != null)
        ol += el.offsetLeft;
    return ol;
}

function getOffsetTop(el) {
    var ot = el.offsetTop;
    while ((el = el.offsetParent) != null)
        ot += el.offsetTop;
    return ot;
}

var bInitialized = false;
function initCalendar() {
    if (bInitialized)
        return;

    var sPathToBase = "../../";

    if (typeof (BA_PATH_TO_BASE) != 'undefined')
        sPathToBase = BA_PATH_TO_BASE;

    img_del = new Image();
    img_del.src = sPathToBase + "img/tools/cal.gif";

    img_close = new Image();
    img_close.src = sPathToBase + "img/tools/cal.gif";

    minYearList = todayDate.getFullYear() - 200;
    maxYearList = todayDate.getFullYear() + 200;
    IsCalendarVisible = false;

    img_Date_UP = new Image();
    img_Date_UP.src = sPathToBase + "img/tools/cal.gif";

    img_Date_OVER = new Image();
    img_Date_OVER.src = sPathToBase + "img/tools/cal.gif";

    img_Date_DOWN = new Image();
    img_Date_DOWN.src = sPathToBase + "img/tools/cal.gif";
    bInitialized = true;

    if (ppcIE && !checkIsIE11()) {
        document.body.onscroll = scroll;
    }

    if (ppcFirefox) {
        window.addEventListener("scroll", scroll, true);
    }

    function scroll() {
        var scrollTopfn = 0;
        if (document.documentElement && document.body.scrollTop == 0) {
            scrollTopfn = document.documentElement.scrollTop;
        }
        else {
            scrollTopfn = document.body.scrollTop;
        }

        var offsetY = scrollTopfn - curScrollY;
        curScrollY += offsetY;
        document.getElementById("popupcalendar").style.top = (Number(document.getElementById("popupcalendar").style.top.replace("px", "")) - offsetY) + "px";
    }
}

function showCalendar(frmName, dteBox, btnImg, bHour, event, MnDt, MnMo, MnYr, MxDt, MxMo, MxYr, runFuncs) {
    showCalendar(frmName, dteBox, btnImg, bHour, true, event, MnDt, MnMo, MnYr, MxDt, MxMo, MxYr);
}

function showCalendar(frmName, dteBox, btnImg, bHour, bAMPM, event, MnDt, MnMo, MnYr, MxDt, MxMo, MxYr, runFuncs) {
    initCalendar();

    bhour = bHour;
    bAmPm = bAMPM;

    FuncsToRun = runFuncs;
    calfrmName = frmName;
    if (IsCalendarVisible) {
        hideCalendar();
    }
    else {
        if (document.images['calbtn1'] != null) document.images['calbtn1'].src = img_del.src;
        if (document.images['calbtn2'] != null) document.images['calbtn2'].src = img_close.src;
        if (bHideDropDowns) { toggleDropDowns('hidden'); }
        if ((MnDt != null && MnMo != null && MnYr != null) || (MxDt != null && MxMo != null && MxYr != null)) {
            IsUsingMinMax = true;

            if (MnDt != null && MnMo != null && MnYr != null) {
                minDate.setFullYear(MnYr);
                minDate.setDate(15);
                minDate.setMonth(MnMo - 1);
                minDate.setDate(MnDt);
            } else {
                minDate = new Date("1/1/" + minYearList);
            }
            minDate.setHours(0, 0, 0);

            if (MxDt != null && MxMo != null && MxYr != null) {
                maxDate.setFullYear(MxYr);
                maxDate.setDate(15);
                maxDate.setMonth(MxMo - 1);
                maxDate.setDate(MxDt);
            } else {
                maxDate = new Date("12/31/" + maxYearList);
            }
            maxDate.setHours(23, 59, 59);
        }
        else {
            IsUsingMinMax = false;
        }
        curImg = btnImg;
        curDateBox = dteBox;

        if (ppcIE && !checkIsIE11()) {
            ppcX = getOffsetLeft(document.images[btnImg]);
            ppcY = getOffsetTop(document.images[btnImg]) + document.images[btnImg].height;
        }
        else if (ppcNN) {
            ppcX = document.images[btnImg].x;
            ppcY = document.images[btnImg].y + document.images[btnImg].height;
        }

        var toShowDate = todayDate = new Date();
        if (document.getElementsByName(curDateBox)[0]) {
            var sCurrDate = document.getElementsByName(curDateBox)[0].value;
            if (sCurrDate.length > 0) {
                curDate = getDateFromFormat(sCurrDate, BA_DATE_FORMAT_MASK + (bhour ? ' ' + BA_TIME_FORMAT_MASK : ''), bhour);
                if (curDate == 0 && bhour == false) {
                    curDate = getDateFromFormat(sCurrDate, BA_DATE_FORMAT_MASK + ' ' + BA_TIME_FORMAT_MASK, true);
                }
                toShowDate = curDate;
            } else {
                toShowDate = todayDate;
            }
        }

        if (IsUsingMinMax && minDate > todayDate)
            toShowDate = minDate;

        //		if(IsUsingMinMax &&  toShowDate > maxDate)
        //			toShowDate = maxDate;

        var scrollTop = 0;

        if (document.documentElement && document.body.scrollTop == 0) {
            scrollTop = document.documentElement.scrollTop;
        }
        else {
            scrollTop = document.body.scrollTop;
        }

        curScrollY = scrollTop;

        //Detects the calendar icon position, to calculate the screen coordinates and reposition the calendar element in the absolute position
        var obj;
        var currentTargetElement;

        //use the bAMPM element as reference for the click event
        if (event == null){
            obj = {x: bAMPM.clientX, y: bAMPM.clientY};
        }
        else{
            currentTargetElement = (event.currentTarget) ? event.currentTarget : event.srcElement;
            
            obj = getScreenCordinates(event,currentTargetElement);

            //Add the icon's dimention as an offset
            obj.x += currentTargetElement.offsetWidth * .5;
            obj.y += currentTargetElement.offsetHeight * .5;
        }
        
        domlay('popupcalendar', 1, obj.x, obj.y, Calendar(toShowDate.getMonth(), toShowDate.getFullYear(), toShowDate.getDate(), bhour, bAmPm));

        IsCalendarVisible = true;

    }
}

function getScreenCordinates(event, obj) {

    var isOldRenderIFrame = window.frameElement.id =="bz-wp-widget-oldrender" ? true : false;

    var p = {};

    p.x = obj.offsetLeft;
    p.y = obj.offsetTop;

    while (obj.offsetParent) {
        p.x = p.x + obj.offsetParent.offsetLeft;
        p.y = p.y + obj.offsetParent.offsetTop;
        if (obj == document.getElementsByTagName("body")[0]) {
            break;
        }
        else 
            obj = obj.offsetParent;
    }

    //If is inside an old render iframe, use the clientY
    if(isOldRenderIFrame) {
        p.y = event.clientY;
    }

    return p;
}

function windowSize() {
    var winSize = [0, 0];

    if (typeof window.innerWidth != 'undefined') {
        winSize = [window.innerWidth, window.innerHeight];
    }
    else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
        winSize = [document.documentElement.clientWidth, document.documentElement.clientHeight];
    }
    else {
        winSize = [document.getElementsByTagName('body')[0].clientWidth, document.getElementsByTagName('body')[0].clientHeight];
    }
    return winSize;
}

var SELECTelements = new Array;
function toggleDropDowns(showHow) {
    var i; var j; var k = 0;

    if (SELECTelements.length > 0) {
        for (i = 0; i < SELECTelements.length; i++) {
            SELECTelements[i].style.visibility = showHow;
        }
    } else {
        for (i = 0; i < document.forms.length; i++) {
            for (j = 0; j < document.forms[i].elements.length; j++) {
                if (document.forms[i].elements[j].tagName == "SELECT") {
                    if (document.forms[i].name != "Cal") {
                        document.forms[i].elements[j].style.visibility = showHow;
                        SELECTelements[k++] = document.forms[i].elements[j];
                    }
                }
            }
        }
    }
}

function hideCalendar() {
    domlay('popupcalendar', 0, ppcX, ppcY, "&nbsp;");
    calSwapImg(curImg, 'img_Date_UP');
    IsCalendarVisible = false;
    if (bHideDropDowns) { toggleDropDowns('inherit'); }
}

function calClick() {
}

function domlay(id, trigger, lax, lay, content) {
    // Layer visible
    if (trigger == "1") {
        if (document.layers) document.layers['' + id + ''].visibility = "show";
        else if (document.all) document.all['' + id + ''].style.visibility = "visible";
        else if (document.getElementById) document.getElementById('' + id + '').style.visibility = "visible";
    }
    // Layer hidden
    else if (trigger == "0") {
        if (document.layers) document.layers['' + id + ''].visibility = "hide";
        else if (document.all) document.all['' + id + ''].style.visibility = "hidden";
        else if (document.getElementById) document.getElementById('' + id + '').style.visibility = "hidden";
    }
    // Set horizontal position  
    if (lax) {
        if (document.layers) { document.layers['' + id + ''].left = event.x + document.body.scrollLeft;
        }
        else if (document.all) { document.all['' + id + ''].style.left = lax + "px";
        }
        else if (document.getElementById) { document.getElementById('' + id + '').style.left = lax + "px";
        }
    }
    // Set vertical position
    if (lay) {
        if (document.layers) { document.layers['' + id + ''].top = event.y + document.body.scrollTop;
        }
        else if (document.all) { document.all['' + id + ''].style.top = lay + "px";
        }
        else if (document.getElementById) { document.getElementById('' + id + '').style.top = lay + "px";
        }
    }

    // Cambiar contenido
    if (document.all)
        document.all('' + id + '').style.zIndex = 10;
    else if (document.getElementById)
        document.getElementById('' + id + '').style.zIndex = 10;

    if (content) {
        if (document.layers) {
            sprite = document.layers['' + id + ''].document;

            sprite.open();
            sprite.write(content);
            sprite.close();
        }
        else if (document.all) {
            var oDiv = (oDiv) ? oDiv : document.createElement("div");
            var layoutElm = document.getElementById(id);

            // Reset value of layout
            layoutElm.innerHTML = "";
            content = content || "";
            if (layoutElm) {
                oDiv.innerHTML = content;
                layoutElm.appendChild(oDiv);
            } 
        } else if (document.getElementById) {
                rng = document.createRange();
                el = document.getElementById('' + id + '');
                rng.setStartBefore(el);
                htmlFrag = rng.createContextualFragment(content);
                while (el.hasChildNodes()) el.removeChild(el.lastChild);
                el.appendChild(htmlFrag);
        }
    }
}

function Calendar(whatMonth, whatYear, whatDay, bhour) {
    Calendar(whatMonth, whatYear, whatDay, bhour, true);
}

function Calendar(whatMonth, whatYear, whatDay, bhour, bAmPm) {
    var output = '';
    var datecolwidth;
    var startMonth;
    var startYear;
    startMonth = whatMonth;
    startYear = whatYear;

    curDate.setFullYear(whatYear);
    curDate.setDate(whatDay);
    curDate.setMonth(whatMonth);
    curDate.setDate(todayDate.getDate());

    var sPathToBase = "../../";

    if (typeof (BA_PATH_TO_BASE) != 'undefined')
        sPathToBase = BA_PATH_TO_BASE;

    output += '<form name="Cal" style="height:10px"><table width="185"  class="cal-Table" cellspacing="0" cellpadding="0"><tr>';

    output += '<td class="cal-HeadCell" align="center" width="100%"><a href="javascript:clearDay();"><img src="' + sPathToBase + 'img/tools/calDelete.gif" border="0"></a><a href="javascript:scrollMonth(-1);" class="cal-DayLink"><img src="' + sPathToBase + 'img/tools/RedLittleArrowleft.gif" border="0"></a>&nbsp;<SELECT class="cal-TextBox" NAME="cboMonth" onChange="changeMonth();">';
    for (month = 0; month < 12; month++) {
        if (month == whatMonth) output += '<OPTION VALUE="' + month + '" SELECTED>' + names[month] + '<\/OPTION>';
        else output += '<OPTION VALUE="' + month + '">' + names[month] + '<\/OPTION>';
    }

    output += '<\/SELECT><SELECT class="cal-TextBox" NAME="cboYear" onChange="changeYear();">';

    var minYearCal = IsUsingMinMax ? minDate.getFullYear() : minYearList;
    var maxYearCal = IsUsingMinMax ? maxDate.getFullYear() : maxYearList;

    if (whatYear < minYearCal)
        minYearCal = whatYear;

    for (year = minYearCal; year <= maxYearCal; year++) {
        if (year == whatYear) {
            output += '<OPTION VALUE="' + year + '" SELECTED>' + year + '<\/OPTION>';
        } else {
            output += '<OPTION VALUE="' + year + '">' + year + '<\/OPTION>';
        }
    }

    output += '<\/SELECT>&nbsp;<a href="javascript:scrollMonth(1);" class="cal-DayLink"><img src="' + sPathToBase + 'img/tools/RedLittleArrow.gif" border="0"></a>&nbsp;<a href="javascript:hideCalendar();"><img src="' + sPathToBase + 'img/tools/closeCalendar.gif" border="0"></a><\/td><\/tr><tr><td width="100%" align="center">';

    firstDay = new Date(whatYear, whatMonth, 1);
    startDay = firstDay.getDay();

    if (((whatYear % 4 == 0) && (whatYear % 100 != 0)) || (whatYear % 400 == 0))
        days[1] = 29;
    else
        days[1] = 28;

    output += '<table width="185" cellspacing="1" cellpadding="2" border="0"><tr>';

    for (i = 0; i < 7; i++) {
        if (i == 0 || i == 6) {
            datecolwidth = "15%";
        }
        else {
            datecolwidth = "14%";
        }
        output += '<td class="cal-HeadCell" width="' + datecolwidth + '" align="center" valign="middle">' + dow[i] + '<\/td>';
    }

    output += '<\/tr><tr>';

    var column = 0;
    var lastMonth = whatMonth - 1;
    var lastYear = whatYear;
    if (lastMonth == -1) { lastMonth = 11; lastYear = lastYear - 1; }

    for (i = 0; i < startDay; i++, column++) {
        output += getDayLink((days[lastMonth] - startDay + i + 1), true, lastMonth, lastYear);
    }

    for (i = 1; i <= days[whatMonth]; i++, column++) {
        output += getDayLink(i, false, whatMonth, whatYear);
        if (column == 6) {
            output += '<\/tr><tr>';
            column = -1;
        }
    }

    var nextMonth = whatMonth + 1;
    var nextYear = whatYear;
    if (nextMonth == 12) { nextMonth = 0; nextYear = nextYear + 1; }

    if (column > 0) {
        for (i = 1; column < 7; i++, column++) {
            output += getDayLink(i, true, nextMonth, nextYear);
        }
        output += '<\/tr><\/table><\/td><\/tr>';
    }
    else {
        output = output.substr(0, output.length - 4); // remove the <tr> from the end if there's no last row
        output += '<\/table><\/td><\/tr>';
    }

    if (!bhour) {
        output += '<\/table><input type=hidden name=hora> <input type=hidden name=min> <input type=hidden name=ampm ><\/form>';

        //	Shows time part
    } else {
        //  Hide ampm
        if (!bAmPm) {
            output += '<tr><td align=center class=cal-GreyDate><b>';

            var sHora = "";
            var sMin = "";
            var bAM = true;
            if (bhourChanged) {
                sHora = curDate.getHours();
                sMin = curDate.getMinutes() < 10 ? '0' + curDate.getMinutes() : curDate.getMinutes();
            } else {
                sHora = (new Date()).getHours();
                sMin = (new Date()).getMinutes() < 10 ? '0' + (new Date()).getMinutes() : (new Date()).getMinutes();
            }

            bhourChanged = true;

            output += time[1] + ':<input type=text name=hora size=2 maxlength=2 preset=hour CLASS=mask value="' + sHora + '">';
            output += time[0] + ':<input type=text name=min size=2 maxlength=2 preset=min CLASS=mask value="' + sMin + '">';

            output += '<input type=hidden name=ampm ></td></tr><\/table><\/form>';

            //  Show ampm
        } else {
            output += '<tr><td align=center class=cal-GreyDate><b>';

            var sHora = "";
            var sMin = "";
            var bAM = true;
            if (bhourChanged) {
                sHora = curDate.getHours() <= 12 ? curDate.getHours() : curDate.getHours() - 12;
                sMin = curDate.getMinutes() < 10 ? '0' + curDate.getMinutes() : curDate.getMinutes();
                bAM = (curDate.getHours() < 12);
            } else {
                sHora = (new Date()).getHours() <= 12 ? (new Date()).getHours() : (new Date()).getHours() - 12;
                sMin = (new Date()).getMinutes() < 10 ? '0' + (new Date()).getMinutes() : (new Date()).getMinutes();
                bAM = ((new Date()).getHours() < 12);
            }

            bhourChanged = true;

            output += time[1] + ':<input type=text name=hora size=2 maxlength=2 preset=hour CLASS=mask value="' + sHora + '">';
            output += time[0] + ':<input type=text name=min size=2 maxlength=2 preset=min CLASS=mask value="' + sMin + '">';

            if (bAM) {
                output += '<select name=ampm><option value=AM>a.m</option><option value=PM>p.m</option></select></b></td></tr><\/table><\/form>';
            } else {
                output += '<select name=ampm><option value=AM>a.m</option><option value=PM selected>p.m</option></select></b></td></tr><\/table><\/form>';
            }
        }
    }

    curDate.setFullYear(startYear);
    curDate.setDate(15);
    curDate.setMonth(startMonth);
    curDate.setDate(1);

    return output;
}

function getDayLink(linkDay, isGreyDate, linkMonth, linkYear) {
    var templink;
    if (!(IsUsingMinMax)) {
        if (isGreyDate) {
            templink = '<td align="center" class="cal-GreyDate">' + linkDay + '<\/td>';
        }
        else {
            if (isDayToday(linkDay)) {
                templink = '<td align="center" class="cal-DayCell">' + '<a class="cal-TodayLink" onmouseover="self.status=\' \';return true" href="javascript:changeDay(' + linkDay + ');">' + linkDay + '<\/a>' + '<\/td>';
            }
            else {
                templink = '<td align="center" class="cal-DayCell">' + '<a class="cal-DayLink" onmouseover="self.status=\' \';return true" href="javascript:changeDay(' + linkDay + ');">' + linkDay + '<\/a>' + '<\/td>';
            }
        }
    }
    else {
        if (isDayValid(linkDay, linkMonth, linkYear)) {

            if (isGreyDate) {
                templink = '<td align="center" class="cal-GreyDate">' + linkDay + '<\/td>';
            }
            else {
                if (isDayToday(linkDay)) {
                    templink = '<td align="center" class="cal-DayCell">' + '<a class="cal-TodayLink" onmouseover="self.status=\' \';return true" href="javascript:changeDay(' + linkDay + ');">' + linkDay + '<\/a>' + '<\/td>';
                }
                else {
                    templink = '<td align="center" class="cal-DayCell">' + '<a class="cal-DayLink" onmouseover="self.status=\' \';return true" href="javascript:changeDay(' + linkDay + ');">' + linkDay + '<\/a>' + '<\/td>';
                }
            }
        }
        else {
            templink = '<td align="center" class="cal-GreyInvalidDate">' + linkDay + '<\/td>';
        }
    }

    return templink;
}

function isDayToday(isDay) {
    if ((curDate.getFullYear() == todayDate.getFullYear()) && (curDate.getMonth() == todayDate.getMonth()) && (isDay == todayDate.getDate())) {
        return true;
    }
    else {
        return false;
    }
}

function isDayValid(validDay, validMonth, validYear) {
    curDate.setFullYear(validYear);
    curDate.setDate(15);
    curDate.setMonth(validMonth);
    curDate.setDate(validDay);

    if ((curDate.getDateString() >= minDate.getDateString()) && (curDate.getDateString() <= maxDate.getDateString())) {
        return true;
    }
    else {
        return false;
    }
}

function padout(number) { return (number < 10) ? '0' + number : number; }

function clearDay() {
    eval('document.forms["' + calfrmName + '"].' + curDateBox + '.value = \'\'');
    hideCalendar();
    if (FuncsToRun != null)
        eval(FuncsToRun);
}

// Se Ejecuta al seleccionar el dia 
// Coloca el valor en el input anterior
function changeDay(whatDay) {
    var min, hora, bRenderHora;
    if (document.getElementsByName("min").length > 0) {
        min = document.getElementsByName("min").item(0);
        hora = document.getElementsByName("hora").item(0);
        bRenderHora = (hora.value.length > 0 && min.value.length > 0) ? true : false;
    }

    curDate.setDate(whatDay);
    updateCurHourMinutes();

    eval('document.forms["' + calfrmName + '"].' + curDateBox + '.value = "' + curDate.format(BA_DATE_FORMAT_MASK) + ((bRenderHora) ? (' ' + curDate.format(BA_TIME_FORMAT_MASK)) : '') + '"');

    hideCalendar();
    if (FuncsToRun != null)
        eval(FuncsToRun);
    if (!isIE && window.BAExecuteBehavioursAndActions) {
        window.BAExecuteBehavioursAndActions();
    }


}

function updateCurHourMinutes() {
    var min, hora, ampm;
    if (document.getElementsByName("min").length > 0) {
        min = document.getElementsByName("min").item(0);
        hora = document.getElementsByName("hora").item(0);
        ampm = document.getElementsByName("ampm").item(0);
    }

    //12-hour format
    if (BA_TIME_FORMAT_MASK.indexOf("H") == -1) {
        if (ampm.value == "AM" || (ampm.value == "PM" && hora.value == 12))
            curDate.setHours(hora.value);
        else
            curDate.setHours(Number(hora.value) + 12);
        if (ampm.value == "AM" && hora.value == 12)
            curDate.setHours(0);
    }
    else
        curDate.setHours(hora.value);

    curDate.setMinutes(min.value);
}


function scrollMonth(amount) {
    var monthCheck;
    var yearCheck;

    if ( (ppcIE && !checkIsIE11())   ||    ppcCHROME ) {
        monthCheck = parseInt(document.getElementsByName("cboMonth")[0].value) + amount;
    }
    else if (ppcNN) {
        monthCheck = document.popupcalendar.document.forms["Cal"].cboMonth.selectedIndex + amount;
    } else if (ppcNN6) {
        monthCheck = parseInt(document.getElementsByName("cboMonth")[0].value) + amount;
    }
    var minYearCal = IsUsingMinMax ? minDate.getFullYear() : minYearList;
    var maxYearCal = IsUsingMinMax ? maxDate.getFullYear() : maxYearList;

    if (monthCheck < 0) {
        yearCheck = curDate.getFullYear() - 1;
        if (yearCheck < minYearCal) {
            yearCheck = minYearCal;
            monthCheck = 0;
        }
        else {
            monthCheck = 11;
        }
        curDate.setFullYear(yearCheck);
    }
    else if (monthCheck > 11) {
        yearCheck = curDate.getFullYear() + 1;
        if (yearCheck > maxYearCal) {
            yearCheck = maxYearCal;
            monthCheck = 11;
        }
        else {
            monthCheck = 0;
        }
        curDate.setFullYear(yearCheck);
    }

    if ((ppcIE && !checkIsIE11()) || ppcCHROME) {
        curDate.setMonth(document.getElementsByName("cboMonth")[0].options[monthCheck].value);
    }
    else if (ppcNN) {
        curDate.setMonth(document.popupcalendar.document.forms["Cal"].cboMonth.options[monthCheck].value);
    } else if (ppcNN6) {
        curDate.setMonth(document.getElementsByName("cboMonth")[0].options[monthCheck].value);
    }

    updateCurHourMinutes();

    domlay('popupcalendar', 1, document.getElementById('popupcalendar').scrollLeft, document.getElementById('popupcalendar').scrollTop, Calendar(curDate.getMonth(), curDate.getFullYear(), curDate.getDay(), bhour, bAmPm));
}

function changeMonth() {
    if (ppcIE) {
        if(checkIsIE11()){
            curDate.setMonth(document.getElementsByName("cboMonth")[0].options[document.getElementsByName("cboMonth")[0].selectedIndex].value);
            domlay('popupcalendar', 1, document.getElementById('popupcalendar').scrollLeft, document.getElementById('popupcalendar').scrollTop, Calendar(curDate.getMonth(), curDate.getFullYear(), curDate.getDay(), bhour, bAmPm));
        } else {
            curDate.setMonth(document.forms["Cal"].cboMonth.options[document.forms["Cal"].cboMonth.selectedIndex].value);
            domlay('popupcalendar', 1, document.getElementById('popupcalendar').scrollLeft, document.getElementById('popupcalendar').scrollTop, Calendar(curDate.getMonth(), curDate.getFullYear(), curDate.getDay(), bhour, bAmPm));
        }            
    }
    else if (ppcNN) {
        curDate.setMonth(document.popupcalendar.document.forms["Cal"].cboMonth.options[document.popupcalendar.document.forms["Cal"].cboMonth.selectedIndex].value);
        domlay('popupcalendar', 1, document.body.scrollLeft, document.body.scrollTop, Calendar(curDate.getMonth(), curDate.getFullYear(), curDate.getDay(), bhour, bAmPm));
    }
    else if (ppcCHROME) {
        curDate.setMonth(document.getElementsByName("cboMonth")[0].options[document.getElementsByName("cboMonth")[0].selectedIndex].value);
        domlay('popupcalendar', 1, document.getElementById('popupcalendar').scrollLeft, document.getElementById('popupcalendar').scrollTop, Calendar(curDate.getMonth(), curDate.getFullYear(), curDate.getDay(), bhour, bAmPm));
    } else if (ppcFirefox) {
        curDate.setMonth(document.getElementsByName("cboMonth")[0].options[document.getElementsByName("cboMonth")[0].selectedIndex].value);
        domlay('popupcalendar', 1, document.getElementById('popupcalendar').scrollLeft, document.getElementById('popupcalendar').scrollTop, Calendar(curDate.getMonth(), curDate.getFullYear(), curDate.getDay(), bhour, bAmPm));
    }
}

function changeYear() {
    if (ppcIE) {
        if(checkIsIE11()){
            curDate.setFullYear(document.getElementsByName("cboYear")[0].options[document.getElementsByName("cboYear")[0].selectedIndex].value);
            domlay('popupcalendar', 1, document.getElementById('popupcalendar').scrollLeft, document.getElementById('popupcalendar').scrollTop, Calendar(curDate.getMonth(), curDate.getFullYear(), curDate.getDay(), bhour, bAmPm));    
        }
        else{
            curDate.setFullYear(document.forms["Cal"].cboYear.options[document.forms["Cal"].cboYear.selectedIndex].value);
            domlay('popupcalendar', 1, document.getElementById('popupcalendar').scrollLeft, document.getElementById('popupcalendar').scrollTop, Calendar(curDate.getMonth(), curDate.getFullYear(), curDate.getDay(), bhour, bAmPm));
        }
    }
    else if (ppcNN) {
        curDate.setFullYear(document.popupcalendar.document.forms["Cal"].cboYear.options[document.popupcalendar.document.forms["Cal"].cboYear.selectedIndex].value);
        domlay('popupcalendar', 1, document.body.scrollLeft, document.body.scrollTop, Calendar(curDate.getMonth(), curDate.getFullYear(), curDate.getDay(), bhour, bAmPm));
    }
    else if (ppcCHROME) {
        curDate.setFullYear(document.getElementsByName("cboYear")[0].options[document.getElementsByName("cboYear")[0].selectedIndex].value);
        domlay('popupcalendar', 1, document.getElementById('popupcalendar').scrollLeft, document.getElementById('popupcalendar').scrollTop, Calendar(curDate.getMonth(), curDate.getFullYear(), curDate.getDay(), bhour, bAmPm));
    } else if (ppcFirefox) {
        curDate.setFullYear(document.getElementsByName("cboYear")[0].options[document.getElementsByName("cboYear")[0].selectedIndex].value);
        domlay('popupcalendar', 1, document.getElementById('popupcalendar').scrollLeft, document.getElementById('popupcalendar').scrollTop, Calendar(curDate.getMonth(), curDate.getFullYear(), curDate.getDay(), bhour, bAmPm));
    }
}

function makeArray0() {
    for (i = 0; i < makeArray0.arguments.length; i++)
        this[i] = makeArray0.arguments[i];
}

var names = new makeArray0(BA_JAN, BA_FEB, BA_MAR, BA_APR, BA_MAY, BA_JUN, BA_JUL, BA_AUG, BA_SEP, BA_OCT, BA_NOV, BA_DEC);
var dow = new makeArray0(BA_SUNDAY, BA_MONDAY, BA_TUESDAY, BA_WEDNESDAY, BA_THURSDAY, BA_FRIDAY, BA_SATURDAY);
var time = new makeArray0(BA_MINUTES, BA_HOUR);
var days = new makeArray0(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
var vmes = new makeArray0('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12');

// ------------------------------------------------------------------
// getDateFromFormat( date_string , format_string )
//
// This function takes a date string and a format string. It matches
// If the date string matches the format string, it returns the 
// getTime() of the date. If it does not match, it returns 0.
// ------------------------------------------------------------------
function getDateFromFormat(val, format, bHour) {
    val = val + "";
    format = format + "";
    var i_val = 0;
    var i_format = 0;
    var c = "";
    var token = "";
    var token2 = "";
    var x, y;
    var now = new Date();
    var year = now.getYear();
    var month = now.getMonth() + 1;
    var date = 1;
    var hh = bHour ? now.getHours() : 0;
    var mm = bHour ? now.getMinutes() : 0;
    var ss = bHour ? now.getSeconds() : 0;
    var ampm = "";

    while (i_format < format.length) {
        // Get next token from format string
        c = format.charAt(i_format);
        token = "";
        while ((format.charAt(i_format) == c) && (i_format < format.length)) {
            token += format.charAt(i_format++);
        }
        // Extract contents of value based on format token
        if (token == "yyyy" || token == "yy" || token == "y") {
            if (token == "yyyy") { x = 4; y = 4; }
            if (token == "yy") { x = 2; y = 2; }
            if (token == "y") { x = 2; y = 4; }
            year = _getInt(val, i_val, x, y);
            if (year == null) { return 0; }
            i_val += year.length;
            if (year.length == 2) {
                if (year > 70) { year = 1900 + (year - 0); }
                else { year = 2000 + (year - 0); }
            }
        }
        else if (token == "MMMM" || token == "MMM") {
            month = 0;
            for (var i = 0; i < MONTH_NAMES.length; i++) {
                var month_name = MONTH_NAMES[i];
                if (val.substring(i_val, i_val + month_name.length).toLowerCase() == month_name.toLowerCase()) {
                    if (token == "MMMM" || (token == "MMM" && i > 11)) {
                        month = i + 1;
                        if (month > 12) { month -= 12; }
                        i_val += month_name.length;
                        break;
                    }
                }
            }
            if ((month < 1) || (month > 12)) { return 0; }
        }
        else if (token == "EE" || token == "E") {
            for (var i = 0; i < DAY_NAMES.length; i++) {
                var day_name = DAY_NAMES[i];
                if (val.substring(i_val, i_val + day_name.length).toLowerCase() == day_name.toLowerCase()) {
                    i_val += day_name.length;
                    break;
                }
            }
        }
        else if (token == "MM" || token == "M") {
            month = _getInt(val, i_val, token.length, 2);
            if (month == null && token == "MM") { // try with just one M
                month = _getInt(val, i_val, "M".length, 1);
            }
            if (month == null || (month < 1) || (month > 12)) { return 0; }
            i_val += month.length;
        }
        else if (token == "dd" || token == "d") {
            date = _getInt(val, i_val, token.length, 2);
            if (date == null && token == "dd") { // try with just one d
                date = _getInt(val, i_val, "d".length, 1);
            }
            if (date == null || (date < 1) || (date > 31)) { return 0; }
            i_val += date.length;
        }
        else if (token == "hh" || token == "h") {
            hh = _getInt(val, i_val, token.length, 2);
            if (hh == null || (hh < 1) || (hh > 12)) { return 0; }
            i_val += hh.length;
        }
        else if (token == "HH" || token == "H") {
            hh = _getInt(val, i_val, token.length, 2);
            if (hh == null || (hh < 0) || (hh > 23)) { return 0; }
            i_val += hh.length;
        }
        else if (token == "KK" || token == "K") {
            hh = _getInt(val, i_val, token.length, 2);
            if (hh == null || (hh < 0) || (hh > 11)) { return 0; }
            i_val += hh.length;
        }
        else if (token == "kk" || token == "k") {
            hh = _getInt(val, i_val, token.length, 2);
            if (hh == null || (hh < 1) || (hh > 24)) { return 0; }
            i_val += hh.length; hh--;
        }
        else if (token == "mm" || token == "m") {
            mm = _getInt(val, i_val, token.length, 2);
            if (mm == null || (mm < 0) || (mm > 59)) { return 0; }
            i_val += mm.length;
        }
        else if (token == "ss" || token == "s") {
            ss = _getInt(val, i_val, token.length, 2);
            if (ss == null || (ss < 0) || (ss > 59)) { return 0; }
            i_val += ss.length;
        }
        else if (token == "tt") {
            if (val.substring(i_val, i_val + 2).toLowerCase() == "am" ||
			    val.substring(i_val, i_val + 4).toLowerCase() == "a.m.") { ampm = "AM"; }
            else if (val.substring(i_val, i_val + 2).toLowerCase() == "pm" ||
			         val.substring(i_val, i_val + 4).toLowerCase() == "p.m.") { ampm = "PM"; }
            else { return 0; }
            i_val += 2;
        }
        else {
            if (val.substring(i_val, i_val + token.length) != token) { return 0; }
            else { i_val += token.length; }
        }
    }
    // If there are any trailing characters left in the value, it doesn't match
    if (i_val != val.length) { return 0; }
    // Is date valid for month?
    if (month == 2) {
        // Check for leap year
        if (((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)) { // leap year
            if (date > 29) { return 0; }
        }
        else { if (date > 28) { return 0; } }
    }
    if ((month == 4) || (month == 6) || (month == 9) || (month == 11)) {
        if (date > 30) { return 0; }
    }
    // Correct hours value
    if (hh < 12 && ampm == "PM") { hh = hh - 0 + 12; }
    else if (hh > 11 && ampm == "AM") { hh -= 12; }
    var newdate = new Date(year, month - 1, date, hh, mm, ss);
    return newdate;
}
