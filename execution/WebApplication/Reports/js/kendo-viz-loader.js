(function ($) {

    $.loadKendoViz = {};

    $.loadKendoViz.methods = {
        init: function (options) {

            $.extend($.loadKendoViz.settings, options);

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

            $(self).kendoChart({
                theme: "flat",
                title: {
                    text: "General Accomplishment"
                },
                legend: {
                    visible: true
                },
                seriesDefaults: {
                    type: $("body").data("response").type || "column",
                    stack: $("body").data("response").stack
                },
                chartArea: {
                    height: 500

                },
                series: [{
                    name: 'on time',
                    color: "#8bbc21",
                    data: ontimeValues

                }, {
                    name: 'at risk',
                    color: "#FFCF40",
                    data: onriskValues
                }, {
                    name: 'overdue',
                    color: "#FF4040",
                    data: overdueValues

                }],
                valueAxis: {
                    line: {
                        visible: false
                    },
                    minorGridLines: {
                        visible: true
                    }
                },
                categoryAxis: {
                    categories: workflowName,
                    majorGridLines: {
                        visible: false
                    }
                },
                tooltip: {
                    visible: true,
                    template: "#= series.name #: #= value #"
                }
            });
        }
    };

    $.fn.loadKendoViz = function (method) {

        if (typeof method != 'object' && method) {
            return $.loadKendoViz.methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method || method == undefined) {
            return $.loadKendoViz.methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.tooltip');
        }

    };
})(jQuery);