$("document").ready(function () {
    var hiddenOperation = $("#hdfOperation");
    var hiddenOperationMessage = $("#hdfMessage");
    var activeAccordion = hiddenOperation != undefined && hiddenOperation.val() == "Import";

    if (hiddenOperationMessage != undefined && hiddenOperationMessage.val() != "")
        $("#lblLoadFileMessage").text(hiddenOperationMessage.val());

    if (activeAccordion) {
        $("#biz-documentTemplates-LoadBdtFilePanel").accordion({ collapsible: true, icons: false });
    }
    else {
        $("#biz-documentTemplates-LoadBdtFilePanel").accordion({ collapsible: true, active: false, icons: false });
    }
    $("#biz-documentTemplates-tabs").tabs();
});