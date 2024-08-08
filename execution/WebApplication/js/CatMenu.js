var BAContainers = new Array();
var BACategories = new Array();
var BAWfClass	 = new Array();
//var BAWfClass	 = new Array();
var containerid = 0;

function BAGetContainer(idParentCategory){
	for (var i=0; i<BAContainers.length; i++){
		if (BAContainers[i].idParentCategory == idParentCategory){
			return BAContainers[i];
		}
	}
	return null;
	
}
function BAShowContainer(show){
	if (this.HTMLContainer != null){
		if (show){
			this.HTMLContainer.style.display = "";
		}
		else{
			
			this.HTMLContainer.style.display = "none";
			//Use the main color for the container items:
			for (var i=0; i<this.Categories.length;	i++){
				this.Categories[i].RestartAppearance();
			}	
		}
	}
}
function BACategoryContainer(idParentCategory,Level){
	this.idParentCategory = idParentCategory;
	this.Categories = new Array();
	this.Level = Level;
	this.HTMLContainer = document.getElementById("Cat"+idParentCategory+"Data");
	this.Show = BAShowContainer;
	//this.Show(false);
	this.id = containerid;
	containerid++;
}
function BARestartCategoryAppearance(){
	if(this.catAnchor != null)
	    this.catAnchor.className = "BAMnColor";
	if (this.leftArrow){
		this.leftArrow.style.visibility = "visible";
		this.rightArrow.style.visibility = "visible";
		this.leftArrow.src = this.leftArrow.src.replace("RedLittleArrowUp.gif","RedLittleArrow.gif");
	}
}
function BAGetRow(BAElement){
   while (BAElement != null && BAElement.tagName != "TR"){
		BAElement = BAElement.parentNode;
   }
   return BAElement;
}
function BAHideCategory(bHide){
	if (bHide){
		BAGetRow(this.catAnchor).style.display="none";	
	}
	else{
		BAGetRow(this.catAnchor).style.display="";	
	}
}
function BAUnselectCategory(){
    if(this.catAnchor != null)
	    this.catAnchor.className = "BAOpColor";
	if (this.leftArrow){
		this.leftArrow.style.visibility = "hidden";
		this.rightArrow.style.visibility = "hidden";
	}
}
function BAUseSelectCategoryAppearance(){
	this.catAnchor.className = "BAOpColorSelected";	
	if (this.leftArrow){
		if (this.idParent != -1){
			this.leftArrow.style.visibility = "hidden";
			this.rightArrow.style.visibility = "visible";
		}
		else{
			this.rightArrow.style.visibility = "visible";
			this.leftArrow.src = this.leftArrow.src.replace("RedLittleArrow.gif","RedLittleArrowUp.gif");
			this.leftArrow.style.cursor = "hand";
			this.leftArrow.onclick = ShowRootCategories;
		}
	}
	
}

function BACreateWFClass(idWfClass, idParent){
	this.idWfClass = idWfClass;
	this.idParent = idParent;
	this.catAnchor = document.getElementById("BAWFClass"+idWfClass);
	var container = BAGetContainer(idParent);
	this.leftArrow = null;
	this.RestartAppearance = BARestartCategoryAppearance;
	this.Select = BAUseSelectCategoryAppearance;
	this.UnSelect = BAUnselectCategory;	
	this.Hide = BAHideCategory;
	if (container == null){
		var idLevel = 0;
		if (idParent != -1){	
			idLevel =  BACategories[idParent].container.Level+1;
		}
		container = new BACategoryContainer(idParent,idLevel);			
		BAContainers[BAContainers.length]= container;
	}
	container.Categories[container.Categories.length]=this;	
	
	this.container = container;
	BAWfClass[idWfClass] = this;
}
//Creates a new category element
function BACreateCategory(idCat, idParent){	
	this.idCat = idCat;
	this.idParent = idParent;
	this.catAnchor = document.getElementById("BACat"+idCat);
	this.leftArrow = document.getElementById("BACat"+idCat+"LI");
	this.rightArrow = document.getElementById("BACat"+idCat+"RI");		
	
	this.RestartAppearance = BARestartCategoryAppearance;
	this.Select = BAUseSelectCategoryAppearance;
	this.UnSelect = BAUnselectCategory;
	this.Hide = BAHideCategory;


	var container = BAGetContainer(idParent);
	if (container == null){
		var idLevel = 0;
		if (idParent != -1){	
			idLevel =  BACategories[idParent].container.Level+1;
		}
		container = new BACategoryContainer(idParent,idLevel);			
		BAContainers[BAContainers.length]= container;
	}
	container.Categories[container.Categories.length]=this;	
	
	this.container = container;
	BACategories[idCat] = this;
	
}
function HideConteinersByLevel(currentContainer){
	for (var i= 0; i< BAContainers.length; i++){
		if (BAContainers[i].Level >= currentContainer.Level && BAContainers[i] != currentContainer ){
			BAContainers[i].Show(false);
		}
	}
}
function BASelectWFClass(idWfClass,displayName,desc){
	var container = BAWfClass[idWfClass].container;	
	HideConteinersByLevel(container);
	document.getElementById("SelectedItem").innerHTML = displayName;
	document.getElementById("SelectedItemDesc").innerHTML = desc;
	document.getElementById("I_IDCATEGORY1").value = idWfClass;
	document.getElementById("BACategoryCreate").style.display="";
	
}
function BAHideRootCategory(idCat,index,bhide){
	//Find the container (of the given category):
	var container = BACategories[idCat].container;	
	var siblings = container.Categories;
	if (bhide){
		siblings[index].Hide(true);
	}
	else{
		siblings[index].Hide(false);
	}
	siblings[index].RestartAppearance();
}
function ShowRootCategories(){
	var container = BACategories[rootCategory].container;	
	var siblings = container.Categories;
	for (var i=0; i< siblings.length; i++){
		window.setTimeout("BAHideRootCategory("+rootCategory+","+i+",false);",100*i);
	}
	document.getElementById("mainCategoryContainer").style.display = "none";
	
}
var rootCategory = -1;
function BASelectCategory(idCat){
	document.getElementById("BACategoryCreate").style.display="none";
	//Find the container (of the given category):
	var container = BACategories[idCat].container;	
	//Find the container to display:
	var containerToDisplay = BAGetContainer(idCat)
	//Hide the categoris with level > idCat Level
	if (containerToDisplay){
	    HideConteinersByLevel(containerToDisplay);
	}
	var siblings = container.Categories;
	if (container.idParentCategory){
		rootCategory = idCat;
	}
	for (var i = 0; i< siblings.length; i++){
		if (siblings[i].idCat == idCat){			
			siblings[i].Select();
		}
		else{
			if (container.idParentCategory != -1 ){
				siblings[i].UnSelect();
			}
			else{				
				window.setTimeout("BAHideRootCategory("+idCat+","+i+",true);",100*i);				
			}
		}	
		if (containerToDisplay){
		    containerToDisplay.Show(true);	
		    document.getElementById("mainCategoryContainer").style.display = "";
		}
		else{
			document.getElementById("mainCategoryContainer").style.display = "none";
		}		
	}
	
}