


function initFloaters()
{
allFloaters = new Array();

floater1 = new floater('floater1Div', 5, -1, -1, 10, 10);
}

function floater(div, position, width, height, hMargin, vMargin)
{
if(navigator.appName != 'Microsoft Internet Explorer')
{
this.div = eval('document.' + div);
this.div.visibility = 'show';
if(width == -1) width = this.div.clip.width;
if(height == -1) height = this.div.clip.height;
}
else
{
this.div = eval(div + '.style');
this.div.visibility = 'visible';
if(width == -1) width = eval(div + '.offsetWidth');
if(height == -1) height = eval(div + '.offsetHeight');
}

this.position = position;
this.width = width;
this.height = height;
this.div.width = width;
this.div.height = height;
this.hMargin = hMargin;
this.vMargin = vMargin;

this.float = float;
this.idNo = allFloaters.length;
allFloaters[allFloaters.length] = this;
this.floatTimer = setInterval("allFloaters[" + this.idNo + "].float()", 50);
}

function float()
{
getwahas();

var w = winwidth - this.width;
var h = winheight - this.height;

if(this.position == 1){ var xPos = this.hMargin; var yPos = this.vMargin; }
if(this.position == 2){ var xPos = w/2; var yPos = this.vMargin; }
if(this.position == 3){ var xPos = w - this.hMargin; var yPos = this.vMargin; }
if(this.position == 4){ var xPos = w - this.hMargin; var yPos = h/2; }
if(this.position == 5){ var xPos = w - this.hMargin; var yPos = h - this.vMargin; }
if(this.position == 6){ var xPos = w/2; var yPos = h - this.vMargin; }
if(this.position == 7){ var xPos = this.hMargin; var yPos = h - this.vMargin; }
if(this.position == 8){ var xPos = this.hMargin; var yPos = h/2 }
if(this.position == 9){ var xPos = w/2; var yPos = h/2; }

if((isNaN(xPos)) || (isNaN(yPos))) return;

this.div.left = leftscroll + xPos;
this.div.top = topscroll + yPos;
}


function getwahas()
{
if(navigator.appName != 'Microsoft Internet Explorer')
 {
 winwidth = window.innerWidth - 16;
 winheight = window.innerHeight - 16;
 leftscroll = window.pageXOffset;
 topscroll = window.pageYOffset;
 }
else
 {
 winwidth = document.body.clientWidth;
 winheight = document.body.clientHeight;
 leftscroll = document.body.scrollLeft;
 topscroll = document.body.scrollTop;
 }
}