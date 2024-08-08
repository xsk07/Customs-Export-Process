//Valores que se pasan a las tabs labels
function public_Labels(label1, label2, label3, label4, label5, label6, label7){
	t1.innerText = label1;
	t2.innerText = label2;
	t3.innerText = label3;
	t7.innerText = label7;
}

//valores que les pasan a los innert de los divs
function public_Contents(contents1, contents2, contents3, contents4, contents5, contents6, contents7){

	t1Contents.innerHTML = contents1;
	t2Contents.innerHTML = contents2;
	t3Contents.innerHTML = contents3;
	t7Contents.innerHTML = contents7;
	init();
}


//Establecer el tab inicial solo header
function init(mtab){
tabContents.innerHTML = t1Contents.innerHTML;	

	switch (mtab)
	{
     	case 1: tabContents.innerHTML = t1Contents.innerHTML;	break
     	case 2: tabContents.innerHTML = t2Contents.innerHTML;	break;
     	case 3: tabContents.innerHTML = t3Contents.innerHTML;	break;
     	case 4: tabContents.innerHTML = t7Contents.innerHTML;	break;
	}

}	

//funcion para cambio de tabs
var currentTab;
var tabBase;
var firstFlag = true;


function changeTabs(mtab){

	if(firstFlag == true){	

	     switch (mtab){	
		case 1:
		currentTab = t1; 
		tabBase = t1base; firstFlag = false;break;

		case 2:
		currentTab = t2; 
		tabBase = t2base; firstFlag = false;break;

		case 3:
		currentTab = t3; 
		tabBase = t2base; firstFlag = false;break;
	
		case 4:
		currentTab = t7; 
		tabBase = t7base; firstFlag = false;break;	
		}

	}

	if(window.event.srcElement.className == 'tab'){

		currentTab.className = 'tab';
		tabBase.style.backgroundColor = 'white';
		currentTab = window.event.srcElement;
		tabBaseID = currentTab.id + 'base';
		tabContentID = currentTab.id + 'Contents';
		tabBase = document.all(tabBaseID);
		tabContent = document.all(tabContentID);
		currentTab.className = 'selTab';
		tabBase.style.backgroundColor = '';
		tabContents.innerHTML = tabContent.innerHTML;

	}
}
