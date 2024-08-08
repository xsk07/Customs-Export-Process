jQuery.noConflict();

function HighlightFixedRange(frControl, val) {
    if (frControl.id == val) {
        frControl.className = "Analysis_CellSelected";

        var hidDateFrom = document.getElementById("Hid" + frControl.id);
        var hidDateToday = document.getElementById("HidFixR_Today");

        document.getElementById("txtFrom").innerText = hidDateFrom.value;
        document.getElementById("txtTo").innerText = hidDateToday.value;
    }
    else
        frControl.className = "Analysis_CellNoSelected";
}

function ShowCurFixedRange() {

    var oCurSelection = document.getElementById("FixR_CurSelection");
    if (oCurSelection != null) {
        var sCurSelection = oCurSelection.value;

        HighlightFixedRange(document.getElementById("FixR_1D"), sCurSelection);
        HighlightFixedRange(document.getElementById("FixR_5D"), sCurSelection);
        HighlightFixedRange(document.getElementById("FixR_1M"), sCurSelection);
        HighlightFixedRange(document.getElementById("FixR_3M"), sCurSelection);
        HighlightFixedRange(document.getElementById("FixR_6M"), sCurSelection);
        HighlightFixedRange(document.getElementById("FixR_1Y"), sCurSelection);
        HighlightFixedRange(document.getElementById("FixR_YTD"), sCurSelection);
        HighlightFixedRange(document.getElementById("FixR_Max"), sCurSelection);
    }
}

function SelectFixedRange(frControlId) {
    document.getElementById("FixR_CurSelection").value = frControlId;
    ShowCurFixedRange();
}

function ValidateFields() {
    return document.getElementById("txtQueryName").value.length > 0;
}

function buttonSave_onclick() {
    if (ValidateFields()) {
        if (document.form1 == undefined)
            document.getElementById("form1").submit();
        else
            document.form1.submit();
    } else {
        document.getElementById("txtQueryName").focus();
    }
}

function buttonCancel_onclick() {
    CloseParentDialog();
}

function ProcessPostBack() {

    //If postback is true is because a SAVE operation took place. Show error or update left panel, acording to the result.
    if (document.getElementById("hidIsPosback").value == "True") {

        var sMessage = document.getElementById("hidErrorMessage").value;
        var successMessage = "Query succesfully saved";
        var iframes = window.parent.document.getElementsByTagName('iframe');
        if (sMessage.length > 0) {
            window.alert(sMessage);
        }
        else {
            
            for (var i = iframes.length - 1; i >= 0; i--) {
                if (iframes[i].src.search("SaveQuery") >= 0) {
                    successMessage = iframes[i].contentWindow.document.getElementById("hidConfirmationMessage").innerHTML;
                    window.alert(successMessage);
                    if (jQuery) {
                        jQuery('.ui-button', jQuery(iframes[i].parentNode.parentNode.parentNode)).click();
                    }
                }
            };
            
            
        }
    }
}


function CloseParentDialog() {
    if (self.parent.bizagi) {
        // This function run within new bizagi workportal
        // Fix on IE9, js injection dont work correctly
        // IE8 work with injection
        var dialogStack = self.parent.bizagi.workportal.desktop.dialogStack || [];
        if (dialogStack.length > 0) {
            var dialog = dialogStack.pop();
            try {
                dialog.close();
            } catch (e){}

        }
    } else {
        if (parent.closeCurrentModalWindow) {
            parent.closeCurrentModalWindow(null);
        }
    }    
}


function ShowHideActionButtons() {
    if (parent.closeCurrentModalWindow) {
        jQuery(".buttonsTable").css("display", "none");
    }
}

function CorrectBackground() {
    if (parent.closeCurrentModalWindow) {
        jQuery(document.body).css("background-color", "white");
        jQuery(document.body).css("background-image", '');
    }
}
function ValidateMultlineChar(textControl, textLength) {
    var maxlength = new Number(textLength);

    if (textControl.value.length > maxlength) {
        textControl.value = textControl.value.substring(0, maxlength);
    }
}

jQuery(document).ready(function () {
    ShowHideActionButtons();
    ShowCurFixedRange();
    ProcessPostBack(); 
    //CorrectBackground();
});