(function ($) {

    $.loadHighchartViz = {};

    $.loadHighchartViz.methods = {
        init: function (options) {

            $.extend($.loadHighchartViz.settings, options);

            var self = this;
            self.show().html('<span style="color:red;">' + options.dataTable.ReportName + '</span>');

            var ontimeValues = [];
            var onriskValues = [];
            var overdueValues = [];
            var workflowName = [];

            for (var i = options.dataTable.rows.length - 1; i >= 0; i--) {
                ontimeValues.push(options.dataTable.rows[i].ontime);
                onriskValues.push(options.dataTable.rows[i].onrisk);
                overdueValues.push(options.dataTable.rows[i].overdue);
                workflowName.push(options.dataTable.rows[i].wfclsDisplayName);
            }

            $(self).highcharts({
                chart: {
                    type: $("body").data("response").type || 'column'
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: workflowName
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: ''
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y} cases</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    series: {
                        stacking: $("body").data("response").stack === false ? null : 'normal'
                    },
                    column: {
                        pointPadding: 0.2,
                        borderWidth: 0
                    }
                },
                series: [{
                    name: 'on time',
                    color : "#8bbc21",
                    data: ontimeValues

                }, {
                    name: 'at risk',
                    color: "#FFCF40",
                    data: onriskValues

                }, {
                    name: 'overdue',
                    color: "#FF4040",
                    data: overdueValues

                }]
            });
         }
    };

    $.fn.loadHighchartViz = function (method) {

        if (typeof method != 'object' && method) {
            return $.loadHighchartViz.methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method || method == undefined) {
            return $.loadHighchartViz.methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.tooltip');
        }

    };
})(jQuery);