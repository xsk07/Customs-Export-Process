function ocultarItems() {
var indice = checkDeshab.parentNode.parentNode.rowIndex;
document.getElementById("xpTab1").firstChild.deleteRow(indice);
var botonGuardar = document.getElementById("btnSave");
botonGuardar.style.display = 'none';
indice = botonGuardar.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.cellIndex;
botonGuardar.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.deleteCell(indice);