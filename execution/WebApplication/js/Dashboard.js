


function ChangeDisplayMode(mode){
	var btnReports = document.getElementById("btnReports");
	var btnDiagram = document.getElementById("btnDiagram");
	var divQueries = document.getElementById("divQueries");
	var divDiagram = document.getElementById("divDiagram");
	
	btnReports.disabled = (mode != 1);
	btnDiagram.disabled = (mode == 1);
	
	divQueries.style.display = (mode != 1) ? "" : "none";
	divDiagram.style.display = (mode == 1) ? "" : "none";
}


///////////////////////////////
//Process charts
///////////////////////////////



function CreateCharts(){
	var dtFrom		= document.getElementById("I_cFrom").value;
	var dtTo		= document.getElementById("I_cTo").value;
	var workkflowId = document.getElementById("processSelect").value;

	var url = "../Ajax/AJAXGateway.aspx?action=1501&dtFrom=" + dtFrom + "&dtTo=" + dtTo + "&idWorkflow=" + workkflowId + "&date=" + new Date();
	callAjaxURL(url, DashGetReportDataCallBack);
	
}

function DashGetReportDataCallBack(oResult){
	var ds = eval(" (" + oResult + ")");
	var dtCycleTimeSummary		= ds.DashboardData[0];
	var dtProcActivitySummary	= ds.DashboardData[1];
	var dtCycleTimeCharts		= ds.DashboardData[2];
	var dtProcActivityCharts	= ds.DashboardData[3];
	
	var sReportHtml = "<TABLE width = '100%'>"
					+ "<TR><TD class='header'>" + dtCycleTimeSummary.ExtendedProperties["title"]	+ "</TD></TR>"
					+ "<TR><TD>" + GetReportRow(dtCycleTimeSummary, "div_ct1", "div_ct2")			+ "</TD><TR>"
					+ "<TR><TD class='header'>" + dtProcActivitySummary.ExtendedProperties["title"] + "</TD><TR>"
					+ "<TR><TD>" + GetReportRow(dtProcActivitySummary, "div_pa1", "div_pa2")		+ "</TD><TR>"
					+ "</TABLE>";
					
	
	
	//Update content
	document.getElementById("divQueries").innerHTML = sReportHtml;
	
	//Show charts
	DrawChart("ct1", dtCycleTimeCharts.Rows[0][0], dtCycleTimeCharts.Rows[0][1], "div_ct1");
	DrawChart("ct2", dtCycleTimeCharts.Rows[1][0], dtCycleTimeCharts.Rows[1][1], "div_ct2");
	
	DrawChart("pa1", dtProcActivityCharts.Rows[0][0], dtProcActivityCharts.Rows[0][1], "div_pa1");
	DrawChart("pa2", dtProcActivityCharts.Rows[1][0], dtProcActivityCharts.Rows[1][1], "div_pa2");
	
}

function GetReportRow(dtSummary, div1, div2){
	var sTableHtml	= GetSummaryTableHtml(dtSummary);
	var sRowHtml	= "<TABLE><TR>"
					+ "<TD width ='30%' class= 'BACaseInformation'>" + sTableHtml + "</TD>"
					+ "<TD width ='35%'><DIV id='" + div1 +  "'></DIV></TD>"
					+ "<TD width ='35%'><DIV id='" + div2 +  "'></DIV></TD>"
					+ "</TR></TABLE>";
					
	return sRowHtml;
}

function DrawChart(chartId, chartXml, chartFile, divWhere){
	var aChart = new FusionCharts(chartFile, 'FusionCharts_' + chartId, 290, 200, '0', '0'); 
	aChart.setDataXML(chartXml);
	aChart.render(divWhere);
}



function GetSummaryTableHtml(datatable){
	var sTable = "<Table width='100%'>";
	for(var iRow = 0; iRow < datatable.Rows.length; iRow++){
		sTable += "<TR><TD ><b>" + datatable.Rows[iRow][0] + "</b></TD>";
		sTable += "<TD>" + datatable.Rows[iRow][1] + "</TD></TR>";
	}
	sTable += "</Table>";
	return sTable;
}

///////////////////////////////
//Process Diagram
///////////////////////////////


function onSilverlightError(sender, args) {
    if (args.errorType == "InitializeError")  {
        var errorDiv = document.getElementById("errorLocation");
        if (errorDiv != null)
            errorDiv.innerHTML = args.errorType + "- " + args.errorMessage;
    }
}

function UpdateDiagram(){
	var workkflowId = document.getElementById("processSelect").value;
	var uri = document.getElementById("txtServiceURI").value;
    var sl = document.getElementById('Xaml1');    
    try{
		sl.Content.Bridge.ConfigureService(uri, workkflowId, -1);
		return 1;
    }catch(e){
		return 0;
    }
}
