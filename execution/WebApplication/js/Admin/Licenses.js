j$(document).ready(function () {
    BASetLocationFromMain(j$("#labelApplyLicenseInformation").val());
});

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