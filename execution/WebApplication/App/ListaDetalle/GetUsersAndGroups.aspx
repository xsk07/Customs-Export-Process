<%@ Page language="c#" Codebehind="GetUsersAndGroups.aspx.cs" AutoEventWireup="false" Inherits="BizAgiBPM.App.ListaDetalle.GetUsersAndGroups" %>
<%@ Register TagPrefix="UI" namespace="BizAgi.UI.WFBase" Assembly="BizAgi.UI" %>
<HTML>
	<HEAD>
		<title>Guardar Consulta</title>
		<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
		<meta http-equiv="expires" content="Wed, 26 Feb 1997 08:00:00 GMT">
		<META http-equiv="Pragma" content="no-cache">
		<LINK href="../../css/estilos.css" type="text/css" rel="stylesheet">
		<link rel="stylesheet" href="../../css/WorkPortal/WPCustomStyles.css" type="text/css">
		<script language="JavaScript" src="../../js/WMask.js"></script>
		<script language="JavaScript" src="../../Localization/LocalizationEN.js"></script>
		<script language="JavaScript" src="../../js/scripts.js"></script>
		<script language="JavaScript" src="../../js/wizard.js"></script>
		<script language="JavaScript" src="../../js/WPSettings.js"></script>
		<script language="JavaScript" src="../../js/BizAgiAJAX.js"></script>
		<LINK href="../../css/BAWindow.css" type="text/css" rel="stylesheet">
		
	<script language="javascript">

	function addItem(allElements, selectedElements) {
		var fl = 0;//allElements.length -1;
		var au = selectedElements.length -1;

		var items = "x";

		//build array of items
		for (au; au > -1; au--) {
			items = items + "," + selectedElements.options[au].value + ","
		}

		//Pull selected allElements and add them to list of selectedElements
		for (fl = 0; fl < allElements.length; fl++) {
			if (allElements.options[fl].selected && items.indexOf( "," + allElements.options[fl].value + "," ) == -1) {
				t = selectedElements.length
				opt = new Option( allElements.options[fl].text, allElements.options[fl].value);
				selectedElements.options[t] = opt;
			}
		}
	}


	//Copy all items from a select to another
	function addAllItems(allElements, selectedElements) {
		var fl = 0;//allElements.length -1;
		var au = selectedElements.length -1;

		var items = "x";

		//build array of items
		for (au; au > -1; au--) {
			items = items + "," + selectedElements.options[au].value + ","
		}

		//Pull selected allElements and add them to list of selectedElements
		for (fl = 0; fl < allElements.length; fl++) {
			if (items.indexOf( "," + allElements.options[fl].value + "," ) == -1) {
				t = selectedElements.length
				opt = new Option( allElements.options[fl].text, allElements.options[fl].value);
				selectedElements.options[t] = opt;
			}
		}
	}

	//Add a new option into a select
	function addOption(selectedElements, value, name) {
		var fl = 0;//allElements.length -1;
		var au = selectedElements.length -1;

		var items = "x";

		//build array of items
		for (au; au > -1; au--) {
			items = items + "," + selectedElements.options[au].value + ","
		}

		var opt = new Option( name, value );
		//Pull selected allElements and add them to list of selectedElements

		if (items.indexOf( "," + value + "," ) == -1) {
			t = selectedElements.length
			selectedElements.options[t] = opt;
		}
	}

	//removes all options from a select
	function clearOptions(selectedElements){
		var fl = selectedElements.length -1;
		for (fl; fl > -1; fl--) {
			selectedElements.options[fl] = null;
		}
	}

	//removes the selected options from a select
	function removeItem(selectedElements) {
		fl = selectedElements.length -1;
		for (fl; fl > -1; fl--) {
			if (selectedElements.options[fl].selected)
			{
				var selValue = selectedElements.options[fl].value;			
				var re = ".*("+selValue+"=[0-9]*;).*";
				selectedElements.options[fl] = null;
			}
		}
	}


	function saveResource(form) {
		var fl = form.h_usersselected.length -1;
		ha = form.h_FinalUsers;
		ha.value = "";
		for (fl; fl > -1; fl--){
			ha.value = ha.value +","+ form.h_usersselected.options[fl].value;
		}
		
		fl = form.h_groupsselected.length -1;
		ha = form.h_FinalGroups;
		ha.value = "";
		for (fl; fl > -1; fl--){
			ha.value =ha.value +","+ form.h_groupsselected.options[fl].value;
		}
	
		parent.document.frm.h_FinalUsers.value = form.h_FinalUsers.value;
		parent.document.frm.h_FinalGroups.value = form.h_FinalGroups.value;		
		parent.CloseCurrentWindow(null);
	}

	function makeRequest(url) {
		var http_request = false;

		if (window.XMLHttpRequest) { // Mozilla, Safari,...
			http_request = new XMLHttpRequest();
			if (http_request.overrideMimeType) {
				http_request.overrideMimeType('text/xml');
			}
		} else if (window.ActiveXObject) { // IE
			try {
				http_request = new ActiveXObject("Msxml2.XMLHTTP");
			} catch (e) {
				try {
				http_request = new ActiveXObject("Microsoft.XMLHTTP");
				} catch (e) {}
			}
		}

		if (!http_request) {
			alert('Giving up :( Cannot create an XMLHTTP instance');
			return false;
		}
		http_request.onreadystatechange = function() { renderContents(http_request); };
		http_request.open('GET', url, true);
		http_request.send(null);
}


    function renderContents(http_request) {
		var oDiv = document.getElementById("h_allusers");
		var data = eval(" (" + http_request + ")");
		var i = 0;
		var selectedElements = document.getElementById("h_allusers");

		clearOptions(selectedElements);

		for (i = 0; i < data.users.length; i++){
			addOption(selectedElements, data.users[i].id,  data.users[i].fullname);
		}
    }
    
    function submitSearch(){
		var sUserName = document.frm.username.value;
		var sFullName = document.frm.fullname.value;
		var sDomain = document.frm.domain.value;
		
		var sPath = location.pathname.split('/');
		//var sURL = 'http://' + location.hostname + '/' + sPath[1] + '/App/Ajax/AJAXGateway.aspx?action=1&username=' + sUserName + '&domain=' + sDomain + '&fullname=' + sFullName;
		var sURL = '../Ajax/AJAXGateway.aspx?action=1&username=' + sUserName + '&domain=' + sDomain + '&fullname=' + sFullName;
		callAjaxURL(sURL, renderContents);
    }
    
    //preload all users
    function preLoadUsers(){
		var sPath = location.pathname.split('/');
		var users = parent.document.getElementById("h_FinalUsers");
		var sURL = "";
		if (users.value != null && users.value.length > 0){			
			document.frm.h_FinalUsers.value = users.value;
			//sURL = 'http://' + location.hostname + '/' + sPath[1] + '/App/Ajax/AJAXGateway.aspx?action=1&ids=' + users.value;
			sURL = '../Ajax/AJAXGateway.aspx?action=1&ids=' + users.value;
		}
		else{
			//sURL = 'http://' + location.hostname + '/' + sPath[1] + '/App/Ajax/AJAXGateway.aspx?action=1';
			sURL = '../Ajax/AJAXGateway.aspx?action=1';
		}
				
		callAjaxURL(sURL, renderContents);
		setTimeout("loadUsers()", 600);
    }
    
    
    function loadUsers(){
		var users = parent.document.getElementById("h_FinalUsers");
		var groups = parent.document.getElementById("h_FinalGroups");
    	document.frm.h_FinalUsers.value = users.value;
		document.frm.h_FinalGroups.value = groups.value;

		var users = document.frm.h_FinalUsers.value.split(",");
		var groups = document.frm.h_FinalGroups.value.split(",");
		
		for(var i = users.length; i >= 0; i--){
			if (users[i] && users[i].length > 0){
				var userName = "";
				for (var j = 0; j < document.frm.h_allusers.length; j++){
					if (document.frm.h_allusers.options[j].value == users[i]){
						userName = document.frm.h_allusers.options[j].text;
						break;
					}
				}
				
				addOption(document.frm.h_usersselected, users[i],  userName);
			}
		}
		
		for(var i = groups.length; i >= 0; i--){
			if (groups[i] && groups[i].length > 0){
				
				var groupName = "";
				for (var j = 0; j < document.frm.h_allgroups.length; j++){
					if (document.frm.h_allgroups.options[j].value == groups[i]){
						groupName = document.frm.h_allgroups.options[j].text;
						break;
					}
				}
				addOption(document.frm.h_groupsselected, groups[i],  groupName);
			}
		}
    }
    </script>
		
	</HEAD>
	<body onload="BAonload();" MS_POSITIONING="FlowLayout">
<form id="frm" name="frm" action="" method="post">
			<TABLE cellSpacing="0" cellPadding="0" width="100%" border="0">
				<TR>
					<TD style="HEIGHT: 16px"><SPAN id="TabHTML"></SPAN></TD>
				</TR>
				<SCRIPT language="JavaScript">
					var DefaultTab = 0;
					var CurrentTab = 0;
					var TabNames = new Array();
					TabNames[0]='<% Response.Write(CResourceManager.RM.GetString("Share_Users")); %>';
					TabNames[1]='<% Response.Write(CResourceManager.RM.GetString("Share_Groups")); %>';
				</SCRIPT>
				<TR>
					<TD bgColor="#ffffff">
						<DIV id="xpTab1" style="HEIGHT: 350px">
							<table  id="Table2" style="BORDER-RIGHT: #d8d2bd 1px solid; BORDER-LEFT: #d8d2bd 1px solid; BORDER-BOTTOM: #d8d2bd 1px solid; HEIGHT: 340px" cellSpacing="0" cellPadding="4" width="100%" border="0" valign="top">
								<TR valign="top"> 
					              <TD height="189">
								  	<TABLE id="Table4" cellSpacing="1" cellPadding="1" width="400" border="0">
						                <TR> 
						                    <TD class="header" colSpan="2"> <p><span id="SpanReassign1"></span><br>
												<B><span><% Response.Write(CResourceManager.RM.GetString("Share_SearchUser")); %></span></B></p>
											</TD>
										</TR>
						                <TR> 
											<TD style="HEIGHT: 4px" colSpan="2"></TD>
						                </TR>
						                <TR> 
						                    <TD>
											
												<TABLE id="Table5" cellSpacing="1" cellPadding="1" width="100%" border="0">
							                        <TR valign="top"> 
														<TD WIDTH="90"><b><% Response.Write(CResourceManager.RM.GetString("Share_Name")); %></b></TD>
														<TD width="169"><input name="username" id="username" style="width:160px"></TD>
														<TD width="99" align="right"><% H.WPButton("button","btnSearch",BizAgi.UI.WFBase.CResourceManager.RM.GetString("BtnSearch"), BizAgi.UI.WFBase.CResourceManager.RM.GetString("BtnSearch"),"sbttn","onclick=\"submitSearch();\""); %></TD>
							                        </TR>
							                        <TR valign="top"> 
														<TD style="WIDTH: 90px"><b><% Response.Write(CResourceManager.RM.GetString("Share_Domain")); %></b></TD>
														<TD><input name="domain" id="domain" style="width:160px"></TD>
														<TD>&nbsp;</TD>
							                        </TR>
							                        <TR valign="top"> 
														<TD  WIDTH="90"><b><% Response.Write(CResourceManager.RM.GetString("Share_FullName")); %></b></TD>
														<TD><input name="fullname" id="fullname" style="width:160px"></TD>
														<TD>&nbsp;</TD>
							                        </TR>
													
													<TR>
													<TD colspan="3">
														<TABLE width="100%" height="91" border="0" cellPadding="1" cellSpacing="1" id="Table3">
															<TR> 
																<TD height="35" colSpan="3" class="header"><p><span id="SpanReassign4"></span><br>
																	<B><span><% Response.Write(CResourceManager.RM.GetString("Share_Users")); %></span></B></p>
																</TD>
															</TR>
															<TR>
																<TD colSpan="3" style="HEIGHT: 4px"></TD>
															</TR>
															<TR valign="top"> 
								                                <TD align="center" >
																	<table  border="0" cellpadding="4" cellspacing="0" class="std">
																		<tr>
																			<td valign="top" align="left" width="100">
																				<table cellspacing="0" cellpadding="2" border="0">
																					<tr>
																						<td><% Response.Write(CResourceManager.RM.GetString("Share_UsersFound")); %>:</td>
																						<td></td>
																						<td><% Response.Write(CResourceManager.RM.GetString("Share_UsersSelected")); %>:</td>
																					</tr>
																					<tr>
																						<td>
																							<select name="h_allusers" id="h_allusers"style="WIDTH:170px" size="10" class="text" multiple>

																							</select>
																						</td>
																						<td>
																							<table border="0">
																								<tr>
																									<td align="right"><input type="button" class="button" value=">" onClick="javascript:addItem(document.frm.h_allusers, document.frm.h_usersselected);"></td>
																								</tr>
																								<tr>
																									<td align="left"><input type="button" class="button" value="<" onClick="javascript:removeItem(document.frm.h_usersselected);"></td>
																								</tr>
																							</table>
																						</td>
																						<td>
																							<select name="h_usersselected" style="WIDTH:170px" size="10" class="text" multiple>
																							</select>
																						</td>
																					</tr>
																					<tr>
																						<td colspan="3" align="center">

																						</td>
																					</tr>
																				</table>
																			</td>
																		</tr>
																	</table>
																</TD>
															</TR>												
							                            </TABLE>
													</TD>
												</TR>
												</TABLE>
											 </TD>
						                  </TR>
						                <TR> 
						                    <TD></TD>
						                  </TR>
					                </TABLE>
					                </TD>
					            </TR>
							</table>
						</DIV>
						<DIV id="xpTab2" style="HEIGHT: 350px">							
							<TABLE id="Table1" style="BORDER-RIGHT: #d8d2bd 1px solid; BORDER-LEFT: #d8d2bd 1px solid; BORDER-BOTTOM: #d8d2bd 1px solid; HEIGHT: 340px" cellSpacing="0" cellPadding="4" width="100%" border="0" valign="top">
								<TR valign="top"> 
									<TD>
										<TABLE width="400" height="91" border="0" cellPadding="1" cellSpacing="1" id="Table2">
										<TR> 
											<TD height="35" colSpan="3" class="header"><p><span id="SpanReassign3"></span><br>
												<B><span><% Response.Write(CResourceManager.RM.GetString("Share_Groups")); %></span></B></p></TD>
										</TR>
										<TR> 
											<TD colSpan="3" style="HEIGHT: 4px"></TD>
										</TR>
										<TR valign="top"> 
											<TD width="90"><B><% Response.Write(CResourceManager.RM.GetString("Share_GroupName")); %></B></TD>
											<TD width="169">
												<select name="h_allgroups" id="h_allgroups" style="width:161px">
													<%= GetGroups() %>
											</select>
											</TD>
											<TD width="113" valign="top" align="right"><% H.WPButton("button","btnAddGroup",BizAgi.UI.WFBase.CResourceManager.RM.GetString("Share_Add"), BizAgi.UI.WFBase.CResourceManager.RM.GetString("Share_Add"),"sbttn","onclick=\"addItem(document.frm.h_allgroups, document.frm.h_groupsselected);\""); %></TD>
										</TR>
										<TR>
				  							<TD colspan="2" align="left" width="259"><select name="h_groupsselected" id="h_groupsselected" size="6"  multiple style="width:258px"></select></TD>
											<TD width="113" valign="top" align="right"><% H.WPButton("button","btnRemoveGroup",BizAgi.UI.WFBase.CResourceManager.RM.GetString("Share_Remove"), BizAgi.UI.WFBase.CResourceManager.RM.GetString("Share_Remove"),"sbttn","onclick=\"javascript:removeItem(document.frm.h_groupsselected);\""); %></TD>
										</TR>
										</TABLE>
									</TD>
								</TR>
							</TABLE>
						</DIV>
					</TD>
				</TR>
				<tr>
					<td></td>
				</tr>
				<TR>
					<td align="center">
						<table><tr><td>
						<% H.WPButton("button","btnShare",BizAgi.UI.WFBase.CResourceManager.RM.GetString("Share_Button"), BizAgi.UI.WFBase.CResourceManager.RM.GetString("Share_Button"),"sbttn","onclick=\"saveResource(document.frm);\""); %>
						</td><td>&nbsp;&nbsp;</td><td>
						<% H.WPButton("button","btnCancel",BizAgi.UI.WFBase.CResourceManager.RM.GetString("Share_Cancel"), BizAgi.UI.WFBase.CResourceManager.RM.GetString("Share_Cancel"),"sbttn","onclick=\"parent.CloseCurrentWindow(null);\""); %>
						</td></tr></table>
					</td>
				</TR>
			</TABLE>
			<input id="h_Tab" style="VISIBILITY: hidden" type="text" value="0" name="h_Tab">
			<input id="h_FinalUsers" type="hidden" value="" name="h_FinalUsers">
			<input id="h_FinalGroups" type="hidden" value="" name="h_FinalGroups">

			<script language="javascript">
				preLoadUsers();
			</script>
		</form>
	</body>
</HTML>

