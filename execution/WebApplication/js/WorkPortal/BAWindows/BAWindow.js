
var BADialog =  null;
var BAAsyncMethod = null;
var BAWindowParam = null;
function ShowBAWindowModal(sWindowTitle,sWidth,sHeight,sUrl,oAsyncMethod){
		//currentWindow = new Window('window_id', { title: "Sample", width:200, height:150, url:"ModalWindow.html"})
		BADialog = new Window('window_id', { title: sWindowTitle, width:sWidth, height:sHeight, url:sUrl, destroyOnClose: true})
		BADialog.setDestroyOnClose();
		BAAsyncMethod = oAsyncMethod;
		BADialog.showCenter(true);
}
function CloseCurrentWindow(oValue){
		if (BADialog != null){
			//currentWindow.destroy();
			Windows.close("window_id");			
		}
		BADialog = null;
		if (BAAsyncMethod){
			BAAsyncMethod(oValue);
		}
		BAAsyncMethod = null;
}
	
function BAShowMessageBox(sMessage){
	Dialog.info(sMessage,{width:300, height:100, className:'dialog', showProgress: true});
	Dialog.setInfoMessage(sMessage);

	setTimeout("Dialog.closeInfo()", 2000);
}

function refreshUserPage(form) {
    document.Form1.isPostBack.value = true;
    document.Form1.submit();
}