/*
'***********************************************************
'Proyecto: BancaFe Etapa 1.0 beta
'Crossbrowser. : Js que determina el comportamiento segun el navegador
'Ultima Modificacion : 20-Sep/2001
' Estructura : Un main, una funcion forma que escribe la forma,  traer datos es levantar el stored procedure
'Desarrollador:	
''Diseñador: 
'********* MAIN *************
*/

function browserType() {
  this.name = navigator.appName;
  this.version = navigator.appVersion;			        //Version string
  this.dom=document.getElementById?1:0;			                //w3-dom
  this.op5=(this.name.indexOf("Opera") > -1 && (this.dom))?1:0;	 //Opera Browser
  this.ie4=(document.all && !this.dom)?1:0;			           //ie4
  this.ie5=(this.dom && this.version.indexOf("MSIE ") > -1)?1:0;     //IE5, IE6?
  this.ns4=(document.layers && !this.dom)?1:0;			           //NS4
  this.ns5=(this.dom && this.version.indexOf("MSIE ") == -1)?1:0; //NS6, Mozilla5

  if (this.ie4 || this.ie5) {
    document.write('<DIV id=testOpera style="position:absolute; visibility:hidden">TestIfOpera5</DIV>');
    if (document.all['testOpera'].style.clip=='rect()') {
      this.ie4=0;
      this.ie5=0;
      this.op5=1;
    }
  }

  this.ok=(this.ie4 || this.ie5 || this.ns4 || this.ns5 || this.op5); //any DHTML
  eval ("bt=this");
}
browserType();


function getObj(obj){

  function getRefNS4(doc,obj){
    var fobj=0;
    var c=0;
    while (c < doc.layers.length) {
        if (doc.layers[c].name==obj) return doc.layers[c];
			fobj=getRefNS4(doc.layers[c].document,obj);
			if (fobj != 0) return fobj;
			c++;
		}
		return 0;
	}

	return (bt.dom)?document.getElementById(obj):(bt.ie4)?
         document.all[obj]:(bt.ns4)?getRefNS4(document,obj):0;
}


function createPageSize(){
  this.width=(bt.ns4 || bt.ns5 || bt.op5)?innerWidth:document.body.offsetWidth;
  this.height=(bt.ns4 || bt.ns5 || bt.op5)?innerHeight:document.body.offsetHeight;
  return this;
}
var screenSize = new createPageSize();


function createLayerObject(name) {
  this.name=name;
  this.obj=getObj(name);
  this.css=(bt.ns4)?obj:obj.style;
  this.x=parseInt(this.css.left);
  this.y=parseInt(this.css.top);
  this.show=b_show;
  this.hide=b_hide;
  this.moveTo=b_moveTo;
  this.moveBy=b_moveBy;
  this.writeText=b_writeText;
  return this;
}
  

function b_show(){

  this.css.visibility='visible';
}


function b_hide(){

  this.css.visibility='hidden';
}


function b_moveTo(x,y){
  this.x = x;
  this.y = y;
  this.css.left=x;
  this.css.top=y;
}


function b_moveBy(x,y){
  this.moveTo(this.x+x, this.y+y);
}

function b_writeText(text) {
   if (bt.ns4) {
     this.obj.document.write(text);
     this.obj.document.close();
   }
   else {
     this.obj.innerHTML=text;
   }
}



