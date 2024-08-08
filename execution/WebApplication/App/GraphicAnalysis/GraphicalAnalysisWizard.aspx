<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<%@ Page language="c#" Codebehind="GraphicalAnalysisWizard.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.GraphicAnalysis.GraphicalAnalysisWizard" %>
<!--DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"-->
<html>
  <head>
    <title>Wizard</title>
	
	<link rel="stylesheet" href="../../css/estilos.css" type="text/css">
	<link rel="stylesheet" href="../../css/WorkPortal/WPCustomStyles.css" type="text/css">
    <link rel="stylesheet" href="../../css/GraphicAnalysis/wizard.css" type="text/css">

	<script language="JavaScript" src="../../js/GraphicAnalysis/containerScript.js"></script>
	<script language="JavaScript" src="../../js/GraphicAnalysis/wizardScript.js"></script>
	<script language="JavaScript" src="../../js/GraphicAnalysis/drag-drop-custom.js"></script>
	<script language="JavaScript" src="../../js/GraphicAnalysis/hashTable.js"></script>
	<script language="JavaScript" src="../../js/GraphicAnalysis/graphicalAnalysisScript.js"></script>
	<script src="../../js/BizAgiAJAX.js" type="text/javascript"></script>
	
	<script language="JavaScript" src="../../js/WPSettings.js"></script>
	<script language="JavaScript" src="../../js/wizard.js"></script>



<script language="javascript">
    var bLoadComplete = false;
    function BAonload() {

        var wizardContainer = document.getElementById("wizardContainer");
        wizardContainer.style.visibility = "visible";
        wizardContainer.style.display = "block";

        var listContainer = document.getElementById("listContainer");
        showWizard(1);
        for (var i = 0; i < allMeasures.length; i++) {
            var columnId = allDimensions[i] === undefined ? "" : allDimensions[i].columnId;
            listContainer.getElementsByTagName("tbody")[0].appendChild(renderWizardMeasures(allMeasures[i].columnName, allMeasures[i].displayColumnName, columnId));
        }

        var dropContent = document.getElementById("dropContent");
        dropContent.innerHTML = "";
        for (var i = 0; i < allDimensions.length; i++) {
            var dd = renderWizardDimension(allDimensions[i].columnName, allDimensions[i].columnId);
            var div = document.createElement("div");
            div.appendChild(dd);
            //dropContent.appendChild( renderWizardDimension(allDimensions[i].columnName) );
            dropContent.innerHTML += div.innerHTML;
        }
    }


</script>
<!-- dimensions -->
<%= RenderDimensions() %>

<!-- measures -->
<%= RenderMeasures() %>

<script>


    var htResources = new Hashtable();
    htResources.put("CASCREATIONDATE", "<% Response.Write(CResourceManager.RM.GetString("ColHeader_CASCREATIONDATE").Replace("\"", "\\\"")); %>");
    htResources.put("CASSOLUTIONDATE", "<% Response.Write(CResourceManager.RM.GetString("ColHeader_CASSOLUTIONDATE").Replace("\"", "\\\"")); %>");
    htResources.put("CATDISPLAYNAME", "<% Response.Write(CResourceManager.RM.GetString("ColHeader_CATDISPLAYNAME").Replace("\"", "\\\"")); %>");
    htResources.put("WFCLSDISPLAYNAME", "<% Response.Write(CResourceManager.RM.GetString("ColHeader_WFCLSDISPLAYNAME").Replace("\"", "\\\"")); %>");
    htResources.put("CREATOR", "<% Response.Write(CResourceManager.RM.GetString("ColHeader_CREATOR").Replace("\"", "\\\"")); %>");
    htResources.put("CREATORFULLNAME", "<% Response.Write(CResourceManager.RM.GetString("ColHeader_CREATORFULLNAME").Replace("\"", "\\\"")); %>");
    htResources.put("CREATORUSERNAME", "<% Response.Write(CResourceManager.RM.GetString("ColHeader_CREATORUSERNAME").Replace("\"", "\\\"")); %>");
    htResources.put("CREATORPOSITION", "<% Response.Write(CResourceManager.RM.GetString("ColHeader_CREATORPOSITION").Replace("\"", "\\\"")); %>");
    htResources.put("IDCASESTATE", "<% Response.Write(CResourceManager.RM.GetString("ColHeader_CASESTATE").Replace("\"", "\\\"")); %>");
    htResources.put("AMOUNT", "<% Response.Write(CResourceManager.RM.GetString("ColHeader_AMOUNT").Replace("\"", "\\\"")); %>");
    htResources.put("CASEPATH", "<% Response.Write(CResourceManager.RM.GetString("ColHeader_FINALSTATE").Replace("\"", "\\\"")); %>");
    htResources.put("_Y", "<% Response.Write(CResourceManager.RM.GetString("GA_YEAR").Replace("\"", "\\\"")); %>");
    htResources.put("_Q", "<% Response.Write(CResourceManager.RM.GetString("GA_QUART").Replace("\"", "\\\"")); %>");
    htResources.put("_M", "<% Response.Write(CResourceManager.RM.GetString("GA_MONTH").Replace("\"", "\\\"")); %>");
    htResources.put("_D", "<% Response.Write(CResourceManager.RM.GetString("GA_DAY").Replace("\"", "\\\"")); %>");
    htResources.put("MONTH1", "<%= System.Threading.Thread.CurrentThread.CurrentUICulture.DateTimeFormat.GetMonthName(1) %>");
    htResources.put("MONTH2", "<%= System.Threading.Thread.CurrentThread.CurrentUICulture.DateTimeFormat.GetMonthName(2) %>");
    htResources.put("MONTH3", "<%= System.Threading.Thread.CurrentThread.CurrentUICulture.DateTimeFormat.GetMonthName(3) %>");
    htResources.put("MONTH4", "<%= System.Threading.Thread.CurrentThread.CurrentUICulture.DateTimeFormat.GetMonthName(4) %>");
    htResources.put("MONTH5", "<%= System.Threading.Thread.CurrentThread.CurrentUICulture.DateTimeFormat.GetMonthName(5) %>");
    htResources.put("MONTH6", "<%= System.Threading.Thread.CurrentThread.CurrentUICulture.DateTimeFormat.GetMonthName(6) %>");
    htResources.put("MONTH7", "<%= System.Threading.Thread.CurrentThread.CurrentUICulture.DateTimeFormat.GetMonthName(7) %>");
    htResources.put("MONTH8", "<%= System.Threading.Thread.CurrentThread.CurrentUICulture.DateTimeFormat.GetMonthName(8) %>");
    htResources.put("MONTH9", "<%= System.Threading.Thread.CurrentThread.CurrentUICulture.DateTimeFormat.GetMonthName(9) %>");
	htResources.put("MONTH10", "<%= System.Threading.Thread.CurrentThread.CurrentUICulture.DateTimeFormat.GetMonthName(10) %>");
	htResources.put("MONTH11", "<%= System.Threading.Thread.CurrentThread.CurrentUICulture.DateTimeFormat.GetMonthName(11) %>");
	htResources.put("MONTH12", "<%= System.Threading.Thread.CurrentThread.CurrentUICulture.DateTimeFormat.GetMonthName(12) %>");
	htResources.put("FunctionMax", "<% Response.Write(CResourceManager.RM.GetString("GA_Function_Max").Replace("\"", "\\\"")); %>");
	htResources.put("FunctionMin", "<% Response.Write(CResourceManager.RM.GetString("GA_Function_Min").Replace("\"", "\\\"")); %>");
	htResources.put("FunctionAvg", "<% Response.Write(CResourceManager.RM.GetString("GA_Function_Avg").Replace("\"", "\\\"")); %>");
	htResources.put("FunctionSum", "<% Response.Write(CResourceManager.RM.GetString("GA_Function_Sum").Replace("\"", "\\\"")); %>");
	htResources.put("FunctionCount", "<% Response.Write(CResourceManager.RM.GetString("GA_Function_Count").Replace("\"", "\\\"")); %>");
	htResources.put("Counter", "<% Response.Write(CResourceManager.RM.GetString("GA_Counter").Replace("\"", "\\\"")); %>");

	htResources.put("WizardStep1", "<% Response.Write(CResourceManager.RM.GetString("GA_WizardStep1").Replace("\"", "\\\"")); %>");
	htResources.put("WizardStep2", "<% Response.Write(CResourceManager.RM.GetString("GA_WizardStep2").Replace("\"", "\\\"")); %>");

	htResources.put("WizardHelpTitle", "<% Response.Write(CResourceManager.RM.GetString("GA_WizardHelpTitle").Replace("\"", "\\\"")); %>");
	htResources.put("WizardStep2", "<% Response.Write(CResourceManager.RM.GetString("GA_WizardStep2").Replace("\"", "\\\"")); %>");
	htResources.put("WizardStep1Explanation", "<% Response.Write(CResourceManager.RM.GetString("GA_WizardStep1Explanation").Replace("\"", "\\\"")); %>");

	htResources.put("WizardHelpNoMeasuresTitle", "<% Response.Write(CResourceManager.RM.GetString("GA_WizardHelpNoMeasuresTitle").Replace("\"", "\\\"")); %>");
	htResources.put("WizardHelpNoMeasuresText", "<% Response.Write(CResourceManager.RM.GetString("GA_WizardHelpNoMeasuresText").Replace("\"", "\\\"")); %>");
	htResources.put("WizardHelpNoDimensionsTitle", "<% Response.Write(CResourceManager.RM.GetString("GA_WizardHelpNoDimensionsTitle").Replace("\"", "\\\"")); %>");
	htResources.put("WizardHelpNoDimensionsText", "<% Response.Write(CResourceManager.RM.GetString("GA_WizardHelpNoDimensionsText").Replace("\"", "\\\"")); %>");
	htResources.put("WizardHelpFinished", "<% Response.Write(CResourceManager.RM.GetString("GA_WizardHelpFinished").Replace("\"", "\\\"")); %>");

	<%= RenderExtendedResources() %>
</script>


  </head>
  <body onload="BAonload()" >
	<%=GetHiddens()%>
	
		<div id="wizardContainer" style="visibility:hidden;display:none;width:90%;height:660px;">
			
			
			<table width="100%" border="0">
				<tr>
					<td class="header" colSpan="2"><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("GA_WizardTitle") %></td>
				</tr>
				<tr>
					<td colSpan="2">
						<table width="100%" border="0">
							<tr>
								<td><span id="txtTitle"><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("GA_WizardStep1") %></span><br>
								</td>
								<td><IMG id="imgTitle" src="../../img/graphicanalysis/IconoMedidas.gif"></td>
							</tr>
						</table>
					</td>
				</tr>
				<tr>
					<td class="header" colspan="2">
			
			
			
			<table width="100%" border="0" cellspacing="0" cellpadding="0">
			<tr align="left" valign="top">
				<td width="10"><img src="../../img/graphicanalysis/marc_Sup_izq.gif" width="10" height="10"></td>
				<td background="../../img/graphicanalysis/marc_sup_cent.gif"><img src="../../img/graphicanalysis/shim.gif" width="5" height="5"></td>
				<td width="10"><img src="../../img/graphicanalysis/marc_Sup_der.gif" width="10" height="10"></td>
			</tr>
			<tr align="left" valign="middle">
				<td width="10" background="../../img/graphicanalysis/marc_left_Cent.gif"><img src="../../img/graphicanalysis/shim.gif" width="5" height="5"></td>
				<td bgcolor="#FFFFFF">

					<!-- Arranca listado -->
					<div id="wizardStep1" style="visibility:hidden;display:none;">
							<ul class="listaMedidas">
								<li class="ListTitle">
									<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("GA_MeasuresDialogText") %>
								</li>
								<li>
									<div class="listBtn"><span class="colorTextos"><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("GA_WizardStep1Explanation") %></span></div>
								</li>
								<li class="listItems">
									<div style="overflow-y:auto;overflow-x:hidden;height: 260px;width:100%">
										<table id="listContainer" width="100%" border="0" cellpadding="0" cellspacing="0">
											<tbody>
											<tr>
												<td width="3%" valign="top" align="center"></td><td width="97%"></td>
											</tr>
											</tbody>
										</table>
									</div>
								</li>
								<li>
									<a href="javascript:void(0);" class="addAllBtn"></a>
								</li>
								<li>
									<%H.WPButton("button","btnAdd",BizAgi.UI.WFBase.CResourceManager.RM.GetString("BtnNext"),BizAgi.UI.WFBase.CResourceManager.RM.GetString("BtnNext"),"sbttn","onclick='javascript:addWizardMeasures();'");%>
								</li>
							</ul>
					</div>
						<!-- termina listado -->
						<!-- Arranca listado -->
						<div id="wizardStep2" style="visibility:hidden;display:none;">
								<ul class="listaInicial">
									<li class="ListTitle">
										<%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("GA_DimensionsDialogText") %>
									</li>
									<li>
										<div class="listBtn"><span class="colorTextos"><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("GA_WizardStep2ExplanationLeft") %></span></div>
									</li>
									<li class="itemListContainer" id="unSelectedDimensionsContainer">
										<dl id="dropContent" class="dlWizard"></dl>
									</li>
									<li>
										<a href="#" class="addAllBtn"></a>
									</li>
									<li>
										<table>
											<tr>
											<td>
												<%H.WPButton("button","btnAdd",BizAgi.UI.WFBase.CResourceManager.RM.GetString("BtnBack"),BizAgi.UI.WFBase.CResourceManager.RM.GetString("BtnBack"),"sbttn","onclick='javascript:showWizard(1);'");%>
											</td>
											<td>
												<%H.WPButton("button","btnAdd",BizAgi.UI.WFBase.CResourceManager.RM.GetString("BtnNext"),BizAgi.UI.WFBase.CResourceManager.RM.GetString("BtnNext"),"sbttn","onclick='javascript:addWizardDimensions();'");%>
											</td>
											</tr>
										</table>
									</li>
								</ul>
								<ul class="listaActivas">
									<li class="ListTitle">&nbsp;
									</li>
									<li>
										<div class="listBtn colortextos"><span class="colorTextos"><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("GA_WizardStep2ExplanationRight") %></span></div>
									</li>
									<li class="itemListContainer" id="selectedDimensionsContainer">
										<dl id="dropContent2" class="dlWizard"></dl>
									</li>
									<li>
										<a href="#" class="addAllBtn"></a>
									</li>
								</ul>								
							<!-- termina listado -->
						</div>


				</td>
				<td width="10" background="../../img/graphicanalysis/marc_der_cent.gif"><img src="../../img/graphicanalysis/shim.gif" width="5" height="5"></td>
			</tr>
			<tr align="left" valign="bottom">
				<td width="10"><img src="../../img/graphicanalysis/marc_Inf_izq.gif" width="10" height="10"></td>
				<td background="../../img/graphicanalysis/marc_inf_cent.gif"><img src="../../img/graphicanalysis/shim.gif" width="5" height="5"></td>
				<td width="10"><img src="../../img/graphicanalysis/marc_Inf_der.gif" width="10" height="10"></td>
			</tr>
			</table>

	</td></tr></table>


		</div> <!-- id="wizardContainer" -->


<div id="processing" style="visibility:hidden; display:none;">
	<div id="waitingBackgroundDiv"></div>
	<div id="waitingDiv">
		<div id="textContainer">
			<table>
				<tr>
					<td><%= BizAgi.UI.WFBase.CResourceManager.RM.GetString("ProcessingPleaseWait") %></td>
				</tr>
			</table>
		</div>
	</div>
</div>

<script>

    function onDragFunction(cloneId, origId) {
        var obj = document.getElementById(cloneId);
        obj.style.border = '1px solid #BFBFBF';
    }

    function initDrag() {
        var dragDropObj = new DHTMLgoodies_dragDrop();

        for (var i = 0; i < allDimensions.length; i++) {
            dragDropObj.addSource('box_' + (allDimensions[i].columnId ? allDimensions[i].columnId : allDimensions[i].columnName), true, true, true, false, 'onDragFunction');
        }

        dragDropObj.addTarget('selectedDimensionsContainer', 'dropItems');
        dragDropObj.addTarget('unSelectedDimensionsContainer', 'dropItems');

        dragDropObj.init();
    }

    setTimeout("initDrag()", 1000);

    bLoadComplete = true;
    printWizardMagic("merlin1.gif");
    initFloaters();
</script>

		
  </body>
</html>
