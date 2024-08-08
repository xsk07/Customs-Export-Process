	var BA_WARNING = "Varning...";
	var BA_CONSIDER = "&Ouml;verv&auml;g att...";
	var BA_MASKERROR = "Angivet v&auml;rde st&auml;mmer ej med f&ouml;rv&auml;ntat format";

	var BA_DATE_INVALID = "Datumformatet &auml;r ogiltigt. Datum skall anges p&aring; formen yyyy/mm/dd.";
	var BA_DATE_VALID = "Verifiera datum f&ouml;r m&aring;nad, dag och &aring;r. Datum skall anges p&aring; formen yyyy/mm/dd.";
	var BA_DATE_ERR = "Dagen &ouml;verensst&auml;mmer ej med angiven m&aring;nad.";
	var BA_CASE_DESC = "&Auml;rendebeskrivning" ;

	var BA_JAN_L = "Januari";
	var BA_FEB_L = "Februari";
	var BA_MAR_L = "Mars";
	var BA_APR_L = "April";
	var BA_MAY_L = "Maj";
	var BA_JUN_L = "Juni";
	var BA_JUL_L = "Juli";
	var BA_AUG_L = "Augusti";
	var BA_SEP_L = "September";
	var BA_OCT_L = "Oktober";
	var BA_NOV_L = "November";
	var BA_DEC_L = "December";
	
	var BA_JAN = "Jan";
	var BA_FEB = "Feb";
	var BA_MAR = "Mar";
	var BA_APR = "Apr";
	var BA_MAY = "Maj";
	var BA_JUN = "Jun";
	var BA_JUL = "Jul";
	var BA_AUG = "Aug";
	var BA_SEP = "Sep";
	var BA_OCT = "Okt";
	var BA_NOV = "Nov";
	var BA_DEC = "Dec";
	
	var BA_SUNDAY_L = "S&ouml;ndag";
	var BA_MONDAY_L = "M&aring;ndag";
	var BA_TUESDAY_L = "Tisdag";
	var BA_WEDNESDAY_L = "Onsdag";
	var BA_THURSDAY_L = "Torsdag";
	var BA_FRIDAY_L = "Fredag";
	var BA_SATURDAY_L = "L&ouml;rdag";
	
	var BA_SUNDAY = "S";
	var BA_MONDAY = "M";
	var BA_TUESDAY = "T";
	var BA_WEDNESDAY = "O";
	var BA_THURSDAY = "T";
	var BA_FRIDAY = "F";
	var BA_SATURDAY = "L";
	
	var BA_MINUTES = "Min";
	var BA_HOUR = "Hour";
	
	var BA_SUFIX_1 = "a";
	var BA_SUFIX_2 = "a";
	var BA_SUFIX_3 = "e";
	var BA_SUFIX_4 = "e";
	var BA_SUFIX_5 = "e";
	var BA_SUFIX_6 = "e";
	var BA_SUFIX_7 = "e";
	var BA_SUFIX_8 = "e";
	var BA_SUFIX_9 = "e";
	var BA_SUFIX_10 = "e";
	var BA_SUFIX_11 = "e";
	var BA_SUFIX_12 = "e";
	var BA_SUFIX_13 = "e";
	var BA_SUFIX_14 = "e";
	var BA_SUFIX_15 = "e";
	var BA_SUFIX_16 = "e";
	var BA_SUFIX_17 = "e";
	var BA_SUFIX_18 = "e";
	var BA_SUFIX_19 = "e";
	var BA_SUFIX_20 = "e";
	var BA_SUFIX_21 = "a";
	var BA_SUFIX_22 = "a";
	var BA_SUFIX_23 = "e";
	var BA_SUFIX_24 = "e";
	var BA_SUFIX_25 = "e";
	var BA_SUFIX_26 = "e";
	var BA_SUFIX_27 = "e";
	var BA_SUFIX_28 = "e";
	var BA_SUFIX_29 = "e";
	var BA_SUFIX_30 = "e";
	var BA_SUFIX_31 = "a";
	var BA_RETYPEVALUE = "Skriv v&auml;rdet igen";
	
	//Business Policies Module messages
	var BAP_DEFAULT_ARGUMENT_MESSAGE = '&lt;Ange v&auml;rde h&auml;r&gt;';
	var BAP_DEFAULT_OPERATOR_MESSAGE = '&lt;Ange operator h&auml;r&gt;';
	var BAP_NO_VALID_DEFINITION = 'Alla definitioner m&aring;ste anges';
	var BAP_NO_VALID_OPERATOR = 'Alla operatorer m&aring;ste anges';
	var BAP_NO_VALID_ARGUMENT = 'Alla argument m&aring;ste anges';
	var BAP_CONDITION_HEADER_MESSAGE = 'ange de <strong>villkor</strong> som &ouml;nskas i detta f&auml;lt';
	var BAP_EXECUTIONSTATEMENT_HEADER_MESSAGE = 'ange de <strong>exekverbara uttryck</strong> som &ouml;nskas i detta f&auml;lt.';
	var BAP_NO_CONDITIONS = 'Du m&aring;ste ange minst ett villkor';
	var BAP_NO_EXECUTIONSTATEMENTS = 'Du m&aring;ste ange minst ett exekverbart uttryck';
	var BAP_NO_CONSTANT_VALUE = 'Du m&aring;ste ange minst ett v&auml;rde f&ouml;r att st&auml;nga f&ouml;nstret';
	var BAP_NO_DEFINITION_SELECTED = 'Du m&aring;ste ange mint en definition f&ouml;r att st&auml;nga f&ouml;nstret';
	var BAP_DEFINITION_DATATYPE_DOESNT_MATCH = 'Datatypen f&ouml;r definitionen &auml;r inte giltig';
	var BAP_FUNCTION_ARGUMENTS_MUST_BE_FILLED = 'Du m&aring;ste ange samtliga argument f&ouml;r funktionen f&ouml;r att st&auml;nga f&ouml;nstret';
	var BAP_NO_POLICY_NAME = 'Du m&aring;ste ange namn f&ouml;r policy regeln';
	var BAP_NO_POLICY_DISPLAY_NAME = 'Du m&aring;ste ange visningsnamn f&ouml;r policy regeln';
	var BAP_NO_POLICY_DESCRIPTION = 'Du m&aring;ste ange beskrivning f&ouml;r policy reglen';
	var BAP_NO_POLICY_PRIORITY = 'Du m&aring;ste ange prioritet';
	
	var BAP_DEFAULT_CELL_MESSAGE = '&lt;Ange ett v&auml;rde h&auml;r&gt;';
	var BAP_NO_VALID_CELL = 'Du m&aring;ste ange v&auml;rde i alla celler';
	var BAP_CANT_DELETE_COLUMN = 'Kan inte radera kolumner om rader redan finns';
	var BAP_CANT_ADD_ROW = 'F&ouml;r att l&auml;gga till en rad, kr&auml;vs minst en Set och Get definition';
	var BAP_NO_ROWS = 'Du m&aring;ste l&auml;gga till minst en rad till beslutstabellen';
	var BAP_NO_DECISION_TABLE_NAME = 'Du m&aring;ste ange namn f&ouml;r beslutstabellen';
	var BAP_NO_DECISION_TABLE_DISPLAY_NAME = 'Du m&aring;ste ange visningsnamn f&ouml;r beslutstabellen';
	var BAP_NO_DECISION_TABLE_DESCRIPTION = 'Du m&aring;ste ange beskrivning f&ouml;r beslutstabellen';
	var BAP_NO_DECISION_TABLE_PRIORITY = 'Du m&aring;ste ange prioritet';
	
	var BAP_POLICYRULE_IF = 'If';
	var BAP_POLICYRULE_THEN = 'Then';
	var BAP_POLICYRULE_ANDMESSAGE = 'Alla f&ouml;ljande villkor &auml;r sanna';
	var BAP_POLICYRULE_ORMESSAGE = 'N&aring;got av de f&ouml;ljande villoren &auml;r sanna';
	
	var BAP_POLICY_DATADOESNOTMATCH =  'Datatypen &auml;r felaktig';
	var BAP_POLICY_OBJECTRETURNINGFUNCTIONFORBIDDEN =  'En funktion som returnerar datatypen Objekt kan inte anv&auml;ndas som villkorsargument.';
	var BAP_POLICY_NODOCUMENTATIONFORITEM = 'Det finns ingen dokumentation f&ouml;r denna';
	var BAP_POLICY_NOVALIDFUNCTION = 'Ingen giltig funktion';
	var BAP_POLICY_NORULECODES = 'Du m&aring;ste ange minst en regel kod';
	var BAP_POLICY_ELSE = 'Else';
	
	var BA_PROCESSING = 'Bearbetning ... Var god v&auml;nta';

	var BA_DIMENSION_TOOMANYRECORDS = "The selected dimension returned too many records. Please configure the filter in the search tab.";