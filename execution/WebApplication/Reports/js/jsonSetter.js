$(document).ready(function () {

    //Load the chart calling the REST service.
    $.read(
        '../Rest/Reports/BAM/Process/LoadAnalysis'
    ).done(
        function (response) {

            $.data(document.body, "response", response);
            showGeneralAccomplishmentChart(response);
        });

    $("#div-chart-type").change(function () {
        var chartType = { type: $("#div-chart-type option:selected").val() };
        $.extend($("body").data("response"), chartType);
        var isStacked = { stack: $("#div-chart-stacked").prop("checked") };
        $.extend($("body").data("response"), isStacked);
        showGeneralAccomplishmentChart($("body").data("response"));
    });
});


function showGeneralAccomplishmentChart(result) {
    
    $("#highchart-viz-chart").loadHighchartViz({dataTable: result});

    $("#kendo-viz-chart").loadKendoViz({ dataTable: result });

}