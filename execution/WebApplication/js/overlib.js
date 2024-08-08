	if (typeof fcolor == 'undefined') { var fcolor = "#CCCCFF";}
	
	if (typeof backcolor == 'undefined') { var backcolor = "#990033";}
	
	
	if (typeof textcolor == 'undefined') { var textcolor = "#000000";}
	
	if (typeof capcolor == 'undefined') { var capcolor = "#FFFFFF";}
	
	if (typeof closecolor == 'undefined') { var closecolor = "#9999FF";}
	
	
	if (typeof width == 'undefined') { var width = "200";}
	
	if (typeof border == 'undefined') { var border = "1";}
	
	
	if (typeof offsetx == 'undefined') { var offsetx = 10;}
	
	if (typeof offsety == 'undefined') { var offsety = 10;}
	

ns4 = (document.layers)? true:false
ie4 = (document.all)? true:false

if (ie4) {
	if (navigator.userAgent.indexOf('MSIE 5')>0) {
		ie5 = true;
	} else {
		ie5 = false; }
} else {
	ie5 = false;
}

var x = 0;
var y = 0;
var snow = 0;
var sw = 0;
var cnt = 0;
var dir = 1;
var tr = 1;
if ( (ns4) || (ie4) ) {
	if (ns4) over = document.overDiv
	if (ie4) over = overDiv.style
	document.onmousemove = mouseMove
	if (ns4) document.captureEvents(Event.MOUSEMOVE)
}


function drs(text) {
	dts(1,text);
}

function drc(text, title) {
	dtc(1,text,title);
}

function src(text,title) {
	stc(1,text,title);
}

function dls(text) {
	dts(0,text);
}

function dlc(text, title) {
	dtc(0,text,title);
}

function slc(text,title) {
	stc(0,text,title);
}

function dcs(text) {
	dts(2,text);
}

function dcc(text, title) {
	dtc(2,text,title);
}

function scc(text,title) {
	stc(0,text,title);
}

function nd() {
	if ( cnt >= 1 ) { sw = 0 };
	if ( (ns4) || (ie4) ) {
		if ( sw == 0 ) {
			snow = 0;
			hideObject(over);
		} else {
			cnt++;
		}
	}
}


function dts(d,text) {
	txt = "<TABLE WIDTH="+width+" BORDER=0 CELLPADDING="+border+" CELLSPACING=0 BGCOLOR=\""+backcolor+"\"><TR><TD><TABLE WIDTH=100% BORDER=0 CELLPADDING=2 CELLSPACING=0 BGCOLOR=\""+fcolor+"\"><TR><TD><FONT FACE=\"Arial,Helvetica\" COLOR=\""+textcolor+"\" SIZE=\"-2\">"+text+"</FONT></TD></TR></TABLE></TD></TR></TABLE>"
	layerWrite(txt);
	dir = d;
	disp();
}

function dtc(d,text, title) {
	txt = "<TABLE WIDTH="+width+" BORDER=0 CELLPADDING="+border+" CELLSPACING=0 BGCOLOR=\""+backcolor+"\"><TR><TD><TABLE WIDTH=100% BORDER=0 CELLPADDING=0 CELLSPACING=0><TR><TD><SPAN ID=\"PTT\"><B><FONT COLOR=\""+capcolor+"\">"+title+"</FONT></B></SPAN></TD></TR></TABLE><TABLE WIDTH=100% BORDER=0 CELLPADDING=2 CELLSPACING=0 BGCOLOR=\""+fcolor+"\"><TR><TD><SPAN ID=\"PST\"><FONT COLOR=\""+textcolor+"\">"+text+"</FONT><SPAN></TD></TR></TABLE></TD></TR></TABLE>"
	layerWrite(txt);
	dir = d;
	disp();
}

function stc(d,text, title) {
	sw = 1;
	cnt = 0;
	txt = "<TABLE WIDTH="+width+" BORDER=0 CELLPADDING="+border+" CELLSPACING=0 BGCOLOR=\""+backcolor+"\"><TR><TD><TABLE WIDTH=100% BORDER=0 CELLPADDING=0 CELLSPACING=0><TR><TD><SPAN ID=\"PTT\"><B><FONT COLOR=\""+capcolor+"\">"+title+"</FONT></B></SPAN></TD><TD ALIGN=RIGHT><A HREF=\"/\" onMouseOver=\"cClick();\" ID=\"PCL\"><FONT COLOR=\""+closecolor+"\"><b>X</b></FONT></A></TD></TR></TABLE><TABLE WIDTH=100% BORDER=0 CELLPADDING=2 CELLSPACING=0 BGCOLOR=\""+fcolor+"\"><TR><TD><SPAN ID=\"PST\"><FONT COLOR=\""+textcolor+"\">"+text+"</FONT><SPAN></TD></TR></TABLE></TD></TR></TABLE>"
	layerWrite(txt);
	dir = d;
	disp();
	snow = 0;
}

function disp() {
	if ( (ns4) || (ie4) ) {
		if (snow == 0) 	{
			if (dir == 2) { // Center
				moveTo(over,x+offsetx-(width/2),y+offsety);
			}
			if (dir == 1) { // Right
				moveTo(over,x+offsetx,y+offsety);
			}
			if (dir == 0) { // Left
				moveTo(over,x-offsetx-width,y+offsety);
			}
			showObject(over);
			snow = 1;
		}
	}
}

function mouseMove(e) {
	if (ns4) {x=e.pageX; y=e.pageY;}
	if (ie4) {x=event.x; y=event.y;}
	if (ie5) {x=event.x+document.body.scrollLeft; y=event.y+document.body.scrollTop;}
	if (snow) {
		if (dir == 2) { // Center
			moveTo(over,x+offsetx-(width/2),y+offsety);
		}
		if (dir == 1) { // Right
			moveTo(over,x+offsetx,y+offsety);
		}
		if (dir == 0) { // Left
			moveTo(over,x-offsetx-width,y+offsety);
		}
	}
}

function cClick() {
	hideObject(over);
	sw=0;
}

function layerWrite(txt) {
        if (ns4) {
                var lyr = document.overDiv.document
                lyr.write(txt)
                lyr.close()
        }
        else if (ie4) document.all["overDiv"].innerHTML = txt
		if (tr) { trk(); }
}

function showObject(obj) {
        if (ns4) obj.visibility = "show"
        else if (ie4) obj.visibility = "visible"
}

function hideObject(obj) {
        if (ns4) obj.visibility = "hide"
        else if (ie4) obj.visibility = "hidden"
}

function moveTo(obj,xL,yL) {
        obj.left = xL
        obj.top = yL
}

function trk() {
	if ( (ns4) || (ie4) ) {
//			SI ESTO NOS PASA NOS LLEVO EL PUTAS
	}
	tr = 0;
}