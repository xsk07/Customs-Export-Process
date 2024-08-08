// This function returns Internet Explorer's major version number,
// or 0 for others. It works by finding the "MSIE " string and
// extracting the version number following the space, up to the decimal
// point, ignoring the minor version number
function msieversion()
{
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf ( "MSIE " );

    if ( msie > 0 )      // If Internet Explorer, return version number
        return parseInt (ua.substring (msie+5, ua.indexOf (".", msie )));
    else                 // If another browser, return 0
        return 0;

}
   
//Opens the filter window containing a tree with the members in a specific dimension
//Used by DWReport.aspx
function DWOpenFilterWindow(varDimBuffer, varMemberBuffer, varCubeName, varDimension, varMember){
	DWOpenFilterWindow(varDimBuffer, varMemberBuffer, varCubeName, varDimension, varMember, null, null);
}


//Opens the filter window containing a tree with the members in a specific dimension
//Used by DWReport.aspx
function DWOpenFilterWindow(varDimBuffer, varMemberBuffer, varCubeName, varDimension, varMember, varIdReport, varNodeFilterMember)
{
	var sUrl = 'Filter_Main.aspx?cube=' + varCubeName + '&dimension=' + varDimension + '&member=' + varMember;
	
	if(varIdReport != null)
		sUrl += '&nodeFilterMember=' + varNodeFilterMember;
	if(varNodeFilterMember != null)
		sUrl += '&idReport=' + varIdReport;
		
		
	var oCallBackFunc= function (oResult){
		if(oResult != null){		
			document.all(varDimBuffer).value	= varDimension;
			document.all(varMemberBuffer).value = oResult;
			document.generalview.submit();
		} };

	ShowBAWindowModal('Bizagi',350, 220, sUrl, oCallBackFunc);
}



//Sets the current selected member in the dynamic tree used by the filter window
//Used by FilterTree.aspx
function DWSetCurrentMember(treeId, nodeId, nodeValue)
{
	document.all("dtvTreeValue").value = nodeValue;	
}


function GetStringFromJSON(str){
	var ret = str.substring(5);
	ret = ret.substring(0, ret.length-2);
	return ret;
}





