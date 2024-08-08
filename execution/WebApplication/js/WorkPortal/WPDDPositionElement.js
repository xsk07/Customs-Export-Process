/********************
	CLASS THAT ALLOW TO KNOW IF A POINT IS INSIDE AN HTML ELEMENT
*/
function BADDCreateContainer(obj)
{
	var curTop = 0;
	var curHeight = 0;
	var curLeft = 0;
	var curWidth = 0;
	var container= obj;
	if (obj.offsetParent)
	{
		curHeight += obj.offsetHeight;
		curWidth += obj.offsetWidth;
		while (obj.offsetParent)
		{
			curTop += obj.offsetTop;			
			curLeft += obj.offsetLeft;			
			obj = obj.offsetParent;
		}
	}
	var contElement = new BADDcontElement(curLeft,curTop,curWidth,curHeight);
	contElement.container = container;
	return contElement;		
}

function BADDcontElement(x,y,width,height){
	this.posX0 = x;
	this.posY0 = y;
	this.posY1 = y+height;
	this.posX1 = x+width;
	this.validate = IsPointInside;
}
function IsPointInside(x,y){
	valid = true;
	if (x != -1){
		if (x<this.posX0 || x>this.posX1){
			valid = false;
		}
	}
	if (y != -1){
		if (y<this.posY0 || y>this.posY1){
			valid = false;
		}
	}
	return valid;
}

