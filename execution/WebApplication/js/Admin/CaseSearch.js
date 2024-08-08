
j$(document).ready(function () {
    BASetLocationFromMain(j$("#labelBASetLocationFromMain").val());
});

function verifyForm() {
    /*if (!(document.frm.I_radNumber.value.length == 0)) 
    {
    if (isNaN(document.frm.I_radNumber.value)) {
    setHelp("", "<% Response.Write(CResourceManager.RM.GetString("ClientValidationMessage2"));%>", 3);
    document.frm.radNumber.focus();
    return false;
    }
    }*/

    //verificar que se seleccione un proceso para la busqueda de casos
    if (document.getElementById("I_idWFClass").value == "") {
        document.getElementById("I_idWFClass").value = document.getElementById("h_idWFClassAuth").value;
        //document.getElementById("I_idApplication").value=document.getElementById("h_idApp").value;
        //return false;
    }


    if ((document.frm.I_From__CreationDate.value.length > 0) || (document.frm.I_To__CreationDate.value.length > 0)) {
        /*
        if (!CheckDateFormat(document.frm.I_From__CreationDate.value, true))
        {
        document.frm.I_From__CreationDate.focus();
        return false;
        }

        if (!CheckDateFormat(document.frm.I_To__CreationDate.value, true))
        {
        document.frm.I_To__CreationDate.focus();
        return false;
        }
        */

        var dtFrom = getDateFromFormat(document.frm.I_From__CreationDate.value, BA_DATE_FORMAT_MASK);
        var dtTo = getDateFromFormat(document.frm.I_To__CreationDate.value, BA_DATE_FORMAT_MASK);
        
        if (dtFrom > dtTo) {
            setHelp("", j$("#labelValidationMessage").val(), 3);
            document.frm.I_From__CreationDate.focus();
            return false;
        }

    }
    var bOnSubmit = true; document.frm.submit(); document.body.style.cursor = "wait";
    return true;
}