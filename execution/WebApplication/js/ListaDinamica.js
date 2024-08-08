function vacia(lista)
{
	while (lista.length > 0)
		lista.options.length--;
}	
	
function agrega(lista, valor, texto)
{
	lista.options[lista.length] = new Option(texto,valor);	
}	
	
function actualiza(lista, sublista, campo)
{
	var s = new String;
	var nuevoitem = new String;
	
	// Cleans the subtopics list
	vacia(sublista);
		
	// gets the value of the idClsTopic
	s = lista.options[lista.options.selectedIndex].value + ':';		
	campo.value =  s.substr(0,s.search('::'));	
	s = s.substr(s.search('::')+2,s.length);
				
	// First subtopic: nothing
	agrega(sublista, 0, "---")

	// Loop to get the subtopics and fill the list
	while (s.search(':') >= 0){
		nuevoitem = s.substr(0,s.search(':'));
							
		if (nuevoitem != '')
			agrega(sublista, nuevoitem.substr(0,nuevoitem.search(';')), nuevoitem.substr(nuevoitem.search(';')+1,nuevoitem.length));
			
		s = s.substr(s.search(':')+1,s.length);
	}
	sublista.options.selectedIndex = 0;
}

function quitaSel(lista)
{
	if (lista.selectedIndex >= 0)
	{
		lista.options[lista.selectedIndex] = null;
	}
}

function setlista(lista, sublista, valorlista, valorsublista)
{
	var i = 0;
	var s = new String;
		
	for (i=0;i<=lista.length;i++){
		s = lista.options[i].value;
		if (s.search(':'+valorsublista+';') > -1)
			break;
	}
		
	lista.options[i].selected = -1;
	actualiza(lista, sublista, valorlista);
		
	for (i=0;i<=sublista.length;i++)
		if (sublista.options[i].value == valorsublista)
			break;
	sublista.options[i].selected = -1;			
}			


	