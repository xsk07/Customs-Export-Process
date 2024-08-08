	var BA_WARNING = "Warning...";
	var BA_CONSIDER = "Consider that...";
	var BA_MASKERROR = "Input value does not match with expected format";

	var BA_DATE_INVALID = "Date format is invalid. Date format must be mm/dd/yyyy.";
	var BA_DATE_VALID = "Verify values for month, day and year. Date format must be mm/dd/aaaa.";
	var BA_DATE_ERR = "Day does not correspond with month.";
	var BA_CASE_DESC = "Case description" ;

	var BA_JAN_L = "January";
	var BA_FEB_L = "February";
	var BA_MAR_L = "March";
	var BA_APR_L = "April";
	var BA_MAY_L = "May";
	var BA_JUN_L = "June";
	var BA_JUL_L = "July";
	var BA_AUG_L = "August";
	var BA_SEP_L = "September";
	var BA_OCT_L = "October";
	var BA_NOV_L = "November";
	var BA_DEC_L = "December";
	
	var BA_JAN = "Jan";
	var BA_FEB = "Feb";
	var BA_MAR = "Mar";
	var BA_APR = "Apr";
	var BA_MAY = "May";
	var BA_JUN = "Jun";
	var BA_JUL = "Jul";
	var BA_AUG = "Aug";
	var BA_SEP = "Sep";
	var BA_OCT = "Oct";
	var BA_NOV = "Nov";
	var BA_DEC = "Dec";
	
	var BA_SUNDAY_L = "Sunday";
	var BA_MONDAY_L = "Monday";
	var BA_TUESDAY_L = "Tuesday";
	var BA_WEDNESDAY_L = "Wednesday";
	var BA_THURSDAY_L = "Thursday";
	var BA_FRIDAY_L = "Friday";
	var BA_SATURDAY_L = "Saturday";
	
	var BA_SUNDAY = "S";
	var BA_MONDAY = "M";
	var BA_TUESDAY = "T";
	var BA_WEDNESDAY = "W";
	var BA_THURSDAY = "X";
	var BA_FRIDAY = "F";
	var BA_SATURDAY = "S";
	
	var BA_MINUTES = "Min";
	var BA_HOUR = "Hour";
	
	var BA_SUFIX_1 = "st";
	var BA_SUFIX_2 = "nd";
	var BA_SUFIX_3 = "rd";
	var BA_SUFIX_4 = "th";
	var BA_SUFIX_5 = "th";
	var BA_SUFIX_6 = "th";
	var BA_SUFIX_7 = "th";
	var BA_SUFIX_8 = "th";
	var BA_SUFIX_9 = "th";
	var BA_SUFIX_10 = "th";
	var BA_SUFIX_11 = "th";
	var BA_SUFIX_12 = "th";
	var BA_SUFIX_13 = "th";
	var BA_SUFIX_14 = "th";
	var BA_SUFIX_15 = "th";
	var BA_SUFIX_16 = "th";
	var BA_SUFIX_17 = "th";
	var BA_SUFIX_18 = "th";
	var BA_SUFIX_19 = "th";
	var BA_SUFIX_20 = "th";
	var BA_SUFIX_21 = "st";
	var BA_SUFIX_22 = "nd";
	var BA_SUFIX_23 = "rd";
	var BA_SUFIX_24 = "th";
	var BA_SUFIX_25 = "th";
	var BA_SUFIX_26 = "th";
	var BA_SUFIX_27 = "th";
	var BA_SUFIX_28 = "th";
	var BA_SUFIX_29 = "th";
	var BA_SUFIX_30 = "th";
	var BA_SUFIX_31 = "st";
	var BA_RETYPEVALUE = "Retype the value";
	
	//Business Policies Module messages
	var BAP_DEFAULT_ARGUMENT_MESSAGE = '&lt;Insert argument here&gt;';
	var BAP_DEFAULT_OPERATOR_MESSAGE = '&lt;Insert operator here&gt;';
	var BAP_NO_VALID_DEFINITION = 'You need to fill all the set definitions';
	var BAP_NO_VALID_OPERATOR = 'You need to fill all the operators';
	var BAP_NO_VALID_ARGUMENT = 'You need to fill all the arguments';
	var BAP_CONDITION_HEADER_MESSAGE = 'insert in this field all the <strong>conditions</strong> that you need';
	var BAP_EXECUTIONSTATEMENT_HEADER_MESSAGE = 'insert in this field all the <strong>execution statements</strong> that you need.';
	var BAP_NO_CONDITIONS = 'You need to create at least one condition';
	var BAP_NO_EXECUTIONSTATEMENTS = 'You need to create at least one execution statement';
	var BAP_NO_CONSTANT_VALUE = 'You must set a value before closing this popup';
	var BAP_NO_DEFINITION_SELECTED = 'You must select a definition before closing this popup';
	var BAP_DEFINITION_DATATYPE_DOESNT_MATCH = 'The data type of the definition is not valid';
	var BAP_FUNCTION_ARGUMENTS_MUST_BE_FILLED = 'You must fill all the arguments in the function before closing this popup';
	var BAP_NO_POLICY_NAME = 'You must fill the policy rule name';
	var BAP_NO_POLICY_DISPLAY_NAME = 'You must fill the policy rule display name';
	var BAP_NO_POLICY_DESCRIPTION = 'You must fill the policy rule description';
	var BAP_NO_POLICY_PRIORITY = 'You must fill the priority';
	
	var BAP_DEFAULT_CELL_MESSAGE = '&lt;Insert a value here&gt;';
	var BAP_NO_VALID_CELL = 'You must fill all the cells';
	var BAP_CANT_DELETE_COLUMN = 'Cannot delete column if there are rows';
	var BAP_CANT_ADD_ROW = 'To add a row you must first add at least one get definition and one set definition';
	var BAP_NO_ROWS = 'You must add at least one row o the decision table';
	var BAP_NO_DECISION_TABLE_NAME = 'You must fill the decision table name';
	var BAP_NO_DECISION_TABLE_DISPLAY_NAME = 'You must fill the decision table display name';
	var BAP_NO_DECISION_TABLE_DESCRIPTION = 'You must fill the decision table description';
	var BAP_NO_DECISION_TABLE_PRIORITY = 'You must fill the priority';
	
	var BAP_POLICYRULE_IF = 'If';
	var BAP_POLICYRULE_THEN = 'Then';
	var BAP_POLICYRULE_ANDMESSAGE = 'all the following conditions are true';
	var BAP_POLICYRULE_ORMESSAGE = 'any of the following conditions are true';
	
	var BAP_POLICY_DATADOESNOTMATCH =  'The data type does not match';
	var BAP_POLICY_OBJECTRETURNINGFUNCTIONFORBIDDEN =  'Can\'t set a function with object return type as a condition argument';
	var BAP_POLICY_NODOCUMENTATIONFORITEM = 'There is no documentation for this item';
	var BAP_POLICY_NOVALIDFUNCTION = 'No valid function';
	var BAP_POLICY_NORULECODES = 'You need to add at least one rule code';
	var BAP_POLICY_ELSE = 'Else';

	var BA_PROCESSING = 'Processing... Please wait.';

	var BA_DIMENSION_TOOMANYRECORDS = "The selected dimension returned too many records. Please configure the filter in the search tab.";
