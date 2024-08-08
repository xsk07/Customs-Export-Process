/*
*****************************************************************************
DataValidation.js

This file contains the JavaScript data validation functions.
It is included in the HTML pages with forms that need these
data validation routines.

Vision Software Ltda.
Author: Francisco Luis Rodríguez (franciscor@visionsoftware.com.co)

*****************************************************************************
*/

/*
Required

Purpose:
	Checks if the form object s has any valid value, 
	trimming and cleaning the value of the object
Parameters:
	objField: Form object (text) to be checked
	iLength:	Maximum length of the string
	strFieldName: Friendly name of the field, used in the alert
Return data:
	True if the string has any valid value, False if not
*/
function Required (objField, iLength, strFieldName)
{   
	var strTest = new String(objField.value);
	var bResult = true;

	// Is strTest empty?
	if ((strTest == null) || (strTest.length == 0)) 
	{
		strAlert = "Por favor llene el cuadro \"" + strFieldName + "\".";
		bResult = false;
	}

	// Regular expression to find non-whitespaces
	var match = strTest.search(/\S/);
	if (bResult && match == -1)
	{
		strAlert = "El cuadro \"" + strFieldName + "\" debe tener letras.";
		bResult = false;
	}

	// Check lenght
	if (bResult && strTest.length > iLength) 
	{
		strAlert = "El cuadro \"" + strFieldName + "\" no puede tener más de " + iLength + " letras.";
		bResult = false;
	}

	if (!bResult)
	{
		// Show alert
		alert(strAlert)
		objField.focus();
		objField.select();
	}

	return bResult;
}

/*
IsText

Purpose:
	Checks if the field has only text characters (letters, points and spaces).
	Then, verifies the text length.	
Parameters:
	objField: Form object (text) to be checked
	strFieldName: Friendly name of the field, used in the alert
Return data:
	True if the string is valid, False if not
*/
function IsText(objField,strFieldName)
{
	var strTest = objField.value;
	var strAlert; 
	var bResult = true;

	// Regular expression to check if the text is valid
	var matchArray = strTest.match(/[^A-Za-z0-9áéíóúÁÉÍÓÚñÑ. ]/);
		
	if (matchArray != null)
	{
		strAlert = "Por favor escriba únicamente letras, números y espacios\nen el cuadro " + strFieldName + ".";			
		bResult = false;
	}

	if (!bResult)
	{
		// Show alert
		alert(strAlert);
		objField.focus();
		objField.select();
	}

	return bResult;
}

/*
IsNumber

Purpose:
	Checks if the string is a number into the range specified.
Parameters:
	objField: Form object (text) to be checked
	iMin: Min value
	iMax: Max value
	iNumDec: Number of decimal places accepted
	strFieldName: Friendly name of the field, used in the alert
		If objField is empty, uses strFieldName as the string to verify
Return data:
	True if the string is valid, False if not
*/
function IsNumber(objField,iMin,iMax,iNumDec,strFieldName)
{
	var strTest,strAlert;
	if (objField != "") 
		strTest = new String(objField.value);
	else
		strTest = new String(strFieldName);
		
	if ((strTest == null) || (strTest.length == 0))
	    return false;

	var i = 0;
	var bResult = true;

	// Regular expression to check if the number is valid
	var strNumberPattern = /^([0-9]+)((\.|,)[0-9]+)*$/;
	var matchArray = strTest.match(strNumberPattern);

	if (matchArray == null) 
	{
		strAlert = "El campo \"" + strFieldName + "\" es numérico. Por favor escriba el número correctamente."
		bResult = false;
	}
		
	if (bResult)
	{
		// Checks decimal places
		iDot = strTest.indexOf(".");
		if (iDot > 0)
		{
			if (iNumDec > 0)
			{

				if (iDot < (strTest.length - iNumDec - 1))
				{
					// Too much decimal places
					strAlert = "El campo \"" + strFieldName + "\" solo acepta hasta " + iNumDec + " decimales.";
					bResult = false;
				}
				else
				{
					iTest = parseFloat(strTest);
				}
			}
			else
			{
				// No decimal places
				strAlert = "El campo \"" + strFieldName + "\" no acepta decimales.";
				bResult = false;
			}
		}
		else
		{
			// Trim leading zeroes
			if (strTest.length > 1 && strTest.charAt(0) == '0')
				strTest = strTest.substr(1,strTest.length);
				
			// Convert from string to integer
			iTest=parseInt(strTest);
		}
	}

	if (bResult && ((iTest < iMin) || (iTest > iMax)))
	{
		strAlert = "El numero escrito en el campo \"" + strFieldName + "\" debe estar entre " + iMin + " y " + iMax + "."; 
		bResult = false;
	}

	// If objField is empty, don't display message
	if (!bResult && objField != "")
	{
		alert(strAlert);
		objField.focus();
		objField.select();
	}

	return bResult;
}

/*
IsDate

Purpose:
	Checks if the three fields form a valid date
Parameters:
	objMonthField: Field with the month (1..12)
	objDayField: Field with the day (1..31)
	objYearField: Field with the year
Return data:
	True if the string is valid, False if not
*/
function IsDate(objMonthField, objDayField, objYearField)
{
	var arrMonths = new Array('Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' );
	var iMonth = 0,iDay = 0,iYear;
	var bResult = true;
	var strAlert;

	// *****************************************************
	// NOTE: the month and day fields MUST be combo boxes
	// *****************************************************
	iMonth = new String(objMonthField.selectedIndex);
	iDay = new String(objDayField.selectedIndex);
	iYear = objYearField.value;
	
	// Verifies values
	if ( bResult && (!IsNumber("",1,31,0,iDay) || !IsNumber("",1,12,0,iMonth) || !IsNumber("",1901,2099,0,iYear)) )
	{
		strAlert = "Verifique los valores de mes, dia y año."
		bResult = false; 
	}

	// Verifies month and day are consistent
	if (bResult && (iMonth == 4 || iMonth == 6 || iMonth == 9 || iMonth == 11) && (iDay > 30))
	{
		strAlert = "El valor del dia (" + iDay + ") no corresponde con el valor del mes (" + arrMonths[iMonth - 1] + ")."
		bResult = false; 
	}
	
	if (bResult && iMonth == 2)
	{
		var iMax;
		iMax = (iYear % 4 == 0) ? 29 : 28;
		if (iDay > iMax)
		{
			strAlert = "El valor del dia (" + iDay + ") no corresponde con el valor del mes (" + arrMonths[iMonth - 1] + ")."
			bResult = false; 
		}
	}

	// Show message	
	if (!bResult)
	{
		alert(strAlert);
		objMonthField.focus();
	}

	return bResult;
}


/*
IsEmailStr

Purpose:
	Checks if a string has valid email format
Parameters:
	strEmail: String with the address
Return data:
	True if the string is valid, False if not
*/
function IsEmailStr (strEmail) 
{
	var bResult;
	bResult = true;

	// Regular expression to check if the e-mail address is valid
	var strEmailPattern = /^([A-Za-z0-9]([A-Za-z0-9]|\.|-|_)+)@([A-Za-z0-9]([A-Za-z0-9]|\.|-|_)*(\.[A-Za-z]\w*)+)$/;
	var matchArray = strEmail.match(strEmailPattern);

	if (matchArray == null) 
		bResult = false;

	return bResult;
}

/*
IsEmail

Purpose:
	Checks if the email address field has a valid address
Parameters:
	objField: Field with the address
	strFieldName: Friendly name of the field, used in the alert
Return data:
	True if the string is valid, False if not
*/
function IsEmail (objField, strFieldName) 
{
	var strEmail
	strEmail = objField.value;

	var bResult;
	bResult = IsEmailStr(strEmail, strFieldName);
	if (!bResult)
	{
		// Show alert
		alert("La dirección escrita en el cuadro \"" + strFieldName + "\" es inválida.\nPor favor corríjala.");
		objField.focus();
		objField.select();
	}
	
	return bResult;
}

/*
IsMultipleEmail

Purpose:
	Checks if the email address fields has a valid address list, separated by semicolons
Parameters:
	objField: Field with the address
	strFieldName: Friendly name of the field, used in the alert
Return data:
	True if the string is valid, False if not
*/
function IsMultipleEmail (objField, strFieldName) 
{
	objField.value = objField.value.replace("  ", " ");
	objField.value = objField.value.replace(",", ";");
	objField.value = objField.value.replace(" ;", ";");
	objField.value = objField.value.replace("; ", ";");
	objField.value = objField.value.replace(" ", ";");
	
	var EmailArray
	EmailArray = objField.value.split(";")
	
	var bResult, i;
	bResult = true;
	for (i=0; i < EmailArray.length && bResult; i++)
	{
		// Check each mail address in the list
		if (!IsEmailStr(EmailArray[i],"E-mail"))
			bResult = false;
	}
	if (!bResult)
	{
		// Show alert
		alert("La dirección escrita en el cuadro \"" + strFieldName + "\" es inválida.\nPor favor corríjala.");
		objField.focus();
		objField.select();
	}

	return bResult;
}
