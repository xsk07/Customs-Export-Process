
var addedObserver = false;

function addOnDestroyObserver() {
    myObserver = {
        onDestroy: function (eventName, win) {
            var div = document.getElementById('alertDiv');
            div.style.visibility = 'hidden';
            div.style.display = 'none';
            div.innerHTML = '';
        }
    };
    Windows.addObserver(myObserver);
}

function DisplayAlert(sMessage) {
    var div = document.getElementById('alertDiv');
    div.style.display = 'block';
    div.style.visibility = 'visible';
    var innerText = document.getElementById("innerText");
    innerText.innerHTML = sMessage;

    var BADialog = new Window('alertWindow', { title: j$("#labelClientValidationTitle").val(), width: '300px', height: '150px', resizable: false, hideEffect: Element.hide, showEffect: Element.show, destroyOnClose: true });
    BADialog.setContent('alertDiv', true, true);
    BADialog.showCenter(true);
    if (!addedObserver) {
        addOnDestroyObserver();
        addedObserver = true;
    }
}

function btnSMSearch_CallBack_onclick(oValue) {
    if (oValue != null) {
        var oOption = oValue[0];
        if (oOption.value.length > 0) {
            document.all["hdnSMId_" + oValue[2]].value = oOption.value;
            document.all["lblSMText_" + oValue[2]].innerText = oOption.text;
        }
    }
}

function btnSMSearch_onclick(sPage, sId) {
    var oOption = document.createElement("OPTION");
    BAWindowParam = new Array();
    BAWindowParam.push(oOption);
    BAWindowParam.push(""); //JSDFilter
    BAWindowParam.push(sId); //UserProperty Id
    ShowBAWindowModal("Bizagi", 600, 400, sPage, btnSMSearch_CallBack_onclick);
}

function onclick_btnAdd(sDrop, sList, sHidden, sBtnDel) {
    var bExist = false;
    var opt = document.createElement("OPTION");

    var maxListElements = 10;
    var textHeight = 18;

    opt.value = document.getElementById(sDrop.id).value;
    opt.text = document.getElementById(sDrop.id).options[document.getElementById(sDrop.id).selectedIndex].text;

    for (var i = 0; i < document.getElementById(sList.id).options.length; i++) {
        if (opt.value == document.getElementById(sList.id).options[i].value) bExist = true;
    }

    if (!bExist) {
        document.getElementById(sList.id).options.add(opt);
        document.getElementById(sHidden.id).value += sDrop.value + ",";

        //expand the list element
        if(document.getElementById(sList.id).options.length <= maxListElements)
            document.getElementById(sList.id).style.height = (document.getElementById(sList.id).options.length * textHeight) + 'px';

        if (sList.id == "dgrMMGrid_26") {
            var relatedOrgTitle = document.getElementById("OrgTable_Title_" + opt.value);
            var relatedOrgValues = document.getElementById("OrgTable_Values_" + opt.value);

            if (relatedOrgValues)
                document.getElementById("OrgTable_Values_" + opt.value).style.display = "";

            if (relatedOrgTitle)
                document.getElementById("OrgTable_Title_" + opt.value).style.display = "";
        }
    }
    else
        alert(j$("#labelUserAlreadyExists").val());
    if (document.getElementById(sList.id).options.length > 0 && document.getElementById(sList.id).style.display != "") {
        document.getElementById(sBtnDel.id).style.display = "";
        document.getElementById(sList.id).style.display = "";
    }
}

function onclick_btnDel(sList, sHidden, sBtnDel) {

    var textHeight = 18;

    document.getElementById(sHidden.id).value = "";

    if (document.getElementById(sList.id).selectedIndex != -1) {
        if (sList.id == "dgrMMGrid_26") {
            var value = document.getElementById(sList.id).options[document.getElementById(sList.id).selectedIndex].value;
            document.getElementById("OrgTable_Values_" + value).style.display = "none";
            document.getElementById("OrgTable_Title_" + value).style.display = "none";

            var lst = document.getElementById("dgrMMGrid_12_" + value);
            var hdM = document.getElementById("hd_dgrMMGrid_12_" + value);
            lst.options.length = 0;
            hdM.value = "";
        }
    }

    while (document.getElementById(sList.id).selectedIndex != -1) {
        document.getElementById(sList.id).remove(document.getElementById(sList.id).selectedIndex);
    }

    for (var i = 0; i < document.getElementById(sList.id).options.length; i++) {
        document.getElementById(sHidden.id).value += document.getElementById(sList.id).options[i].value + ",";
    }

    if (document.getElementById(sList.id).options.length == 0 && document.getElementById(sList.id).style.display == "") {
        document.getElementById(sList.id).style.display = "none";
        document.getElementById(sBtnDel.id).style.display = "none";
    }
    else
        document.getElementById(sList.id).style.height = (document.getElementById(sList.id).options.length * textHeight) + 'px';
}

function onclick_btnUserSelectClear(sLabel, sHidden) {
    document.getElementById(sLabel.id).value = "";
    document.getElementById(sHidden.id).value = "";
}