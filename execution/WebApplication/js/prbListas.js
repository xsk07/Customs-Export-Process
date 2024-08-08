arrOrigen = new Array(100, 3);


function ChangeOptionsL(lstPrimary, lstSecondary, strArrOrigen, strArrDestino, indiceOrigen, indiceDestino) {

	var alen = eval(strArrOrigen + ".length")
	var blen = eval(strArrDestino + ".length")

	var listLen = 0;

	var strKey  = eval("document.forms[0]." + lstPrimary + ".options[document.forms[0]." + lstPrimary + ".selectedIndex].value")
	eval("document.forms[0]." + lstSecondary + ".options.length = 0");

	for (var i = 0; i < alen; i++) {

		//Ubicar el campo deseado en el arreglo de origen
		if (eval(strArrOrigen + "[i][0] == " + strKey)) {

			//Recorrer el arreglo destino para encontrar los del mismo tipo
			for (var j = 0; j < blen; j++) {
				if (eval(strArrDestino + "[j]["+ indiceDestino +"] == " + strArrOrigen + "[i][" + indiceOrigen + "]")) {
					eval("document.forms[0]." + lstSecondary + ".options[listLen] = new Option(" + strArrDestino + "[j][2], " + strArrDestino + "[j][1])");
					listLen = listLen + 1;
				}
			}

			break;
		}
	}

	if (listLen > 0){
		eval("document.forms[0]." + lstSecondary + ".options[0].selected = true");
	}
}
