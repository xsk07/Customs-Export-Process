/**
 * create line or cone builder
 * @param {String} typeChart line | cone
 * @param {Boolean} fillArea for line only
 */
function ChartBuilderLine(typeChart, fillArea) {

    /**
     * adjust fill area 
     * @param {Series} series 
     */
    function _adjustFill(series) {
        if (fillArea) {
            series.fillOpacity = 0.5;
        }
        return series;
    };

    /**
     * adjust stacked property when is Cone type
     * @param {Series} series 
     */
    function _adjustForCone(series) {
        if (typeChart === TYPE_OF_CHARTS.coneSeries) {
            series.stacked = true;
        }
        return series;
    };


    /**
     * start to load the Chart
     * @param {*} json 
     */
    function _createNewChart(data, showMessageMaximumRecords) {
        var chart = am4core.create('mainchartdiv', am4charts.XYChart)
        chart.data = data;
        _configureXAxis(chart);
        _createLegends(chart);
        _configureEvents(chart, function(event){
            switch(event){
                case "CHART_READY": 
                    if(showMessageMaximumRecords) {
                        document.getElementsByClassName('limit-results')[0].style.display = 'block';	
                    }
                    break;
                default:
                    break;
            }
        });
        var yAxis = chart.yAxes.push(new am4charts.ValueAxis());
        yAxis.min = 0;
        var dataKeys = Object.keys(chart.data[0]);
        dataKeys.map(function (row, index) {
            if (!isNaN(Object.values(chart.data[0])[index])) {
                _createSeries(row, row, chart);
            }
        })
        var dataTitle = JSON.parse(JSON.stringify(getDataTable()));
        var title = DataAdapter().getTitle(dataTitle);
        _formatTitle(chart, title.title);
        _formatSubTitle(chart, title.subTitle);
    }


    /**
     * Create legends by each measure
     * @param {*} chart 
     */
    function _createLegends(chart) {
        chart.legend = new am4charts.Legend()
        chart.legend.position = 'bottom'
        chart.legend.labels.template.maxWidth = 100
        chart.scrollbarX = new am4core.Scrollbar();
    }

    /**
     * Configure events
     * @param {*} chart 
     */
    function _configureEvents(chart, callback) {
        chart.events.on("ready", function (event) {
            Windows.notify("onReadyChart");
            callback("CHART_READY");
        });
    }

    /**
     * Configure all xAxis labels
     * @param {*} chart 
     */
    function _configureXAxis(chart) {
        var xAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        var label = xAxis.renderer.labels.template;
        label.horizontalCenter = "right";
        label.verticalCenter = "middle";
        label.rotation = 310;
        label.fontSize = 10;
        xAxis.dataFields.category = Object.keys(chart.data[0])[0];
        xAxis.renderer.cellStartLocation = 0.1;
        xAxis.renderer.cellEndLocation = 0.9;
        xAxis.renderer.grid.template.location = 0;
        xAxis.renderer.minGridDistance = 20;
        label.adapter.add("textOutput", function (label) {
            return label ? label.split('±')[0] : '';
        });
        xAxis.adapter.add("getTooltipText", function (text) {
            return text ? text.split('±')[0] : '';
        });

        return xAxis;
    }

    /**
     * Configure series by measure
     * @param {*} value 
     * @param {*} name 
     * @param {*} chart 
     */
    function _createSeries(value, name, chart) {
        var series = chart.series.push(new am4charts[typeChart]())
        series.dataFields.valueY = value;
        series.dataFields.categoryX = Object.keys(chart.data[0])[0];
        series.name = name;
        _adjustFill(series);
        _adjustForCone(series);
        typeChart === TYPE_OF_CHARTS.lineSeries ? _lineProperties(series, chart) : _columnProperties(series, chart);
        return series;
    };

    /**
     * Properties and events if the serie is line or area
     * @param {*} series 
     */
    function _lineProperties(series, chart) {
        var measureName = series.dataFields.valueY;
        series.segments.template.events.on("hit", function (ev) {
            zoom(series.name);
        }, this);
        _configureTooltips(series, chart, 'segments');
        var bullet = series.bullets.push(new am4charts.CircleBullet());
        bullet.circle.stroke = am4core.color("#fff");
        bullet.dy = 1;
        bullet.circle.strokeWidth = 2;
        series.dataItems.template.locations.dateX = 0;
        bullet.events.on("hit", function (ev) {
            zoom(series.name);
        });
        bullet.tooltipText = chart.data[0].tooltip;
        _configureTooltipsAdapter(bullet, measureName);
    }

    /**
     * Properties and events if the serie is bar
     * @param {*} series 
     */
    function _columnProperties(series, chart) {
        var measureName = series.dataFields.valueY;
        series.columns.template.events.on("hit", function (ev) {
            zoom(series.name);
        }, this);
        _configureTooltips(series, chart, 'columns');
        _configureTooltipsAdapter(series.columns.template, measureName);
    }

    /**
     * tooltips configurations
     * @param {*} series 
     * @param {*} chart 
     */
    function _configureTooltips(series, chart, type) {
        series[type].template.tooltipText = chart.data[0].tooltip;
        series.tooltip.label.textAlign = "middle";
        series.tooltip.pointerOrientation = "vertical";
        series.tooltip.background.fillOpacity = 0.5;
    }

    /**
     * adapt the tooltip content for each column or bullet
     * @param {*} tooltip 
     * @param {*} measureName 
     */
    function _configureTooltipsAdapter(tooltip, measureName) {
        tooltip.adapter.add("tooltipText", function (tooltipText, target) {
            var tooltip = target.tooltipDataItem.dataContext.tooltip;
            tooltip += getFriendlyName(measureName) + ": [bold]{valueY} [/]";
            return tooltip;
        })
    }

    /**
     * Show message when chart is empty
     * @param {*} container 
     */
    function _showNoDataMessage(container) {
        Windows.notify("onReadyChart");
        container.textContent = htResources.get("noDataToDisplay") !== '' ? htResources.get("noDataToDisplay") : "No data to display";
        container.style.width = "200px";
        container.style.height = "50px";
        container.style.position = "absolute";
        container.style.left = "50%";
        container.style.top = "50%";
    }
    
    /**
     * Begin start to calculate the data
     * @param {array} data 
     */
	function _getMaximumRecordsToShow(data) {
        var copyData = JSON.parse(JSON.stringify(data));
		if(copyData && copyData.length && copyData.length > 0 && Object.keys(copyData[0]).length && Object.keys(copyData[0]).length > 0){
            copyData = _cutNumberOfRecordsByMaxLimit(copyData);
		}
		return copyData;
    }
    
    /**
     * Remove some records of the last series
     * @param {array} data 
     * @param {number} measuresBySeries 
     * @param {number} maxLimitRecords 
     */
    function _removeSomeRecordsInTheLastSeries(data, measuresBySeries, maxLimitRecords) {
        var leftOver = maxLimitRecords % measuresBySeries;
        var lastSeries = data[data.length - 1];
        var removeFromIndex = leftOver + 1;
        Object.keys( lastSeries ).forEach(function ( name, index ) {
            if(index >= removeFromIndex && name !== "tooltip") {
                delete lastSeries[name];
            }
        });
        return data;
    }

    /**
     * Validate if there is necessary to remove records depending on override
     * @param {array} data 
     */
    function _cutNumberOfRecordsByMaxLimit(data){
        var measuresBySeries = (Object.keys(data[0]).length - 2);
        var recordsCounterTotal = data.length * measuresBySeries;
        var maxLimitRecords = bizagi.override.maxLimitResultsChart;
        
        if(recordsCounterTotal > maxLimitRecords){
            data = _cutNumberOfSeries(data, recordsCounterTotal, maxLimitRecords, measuresBySeries);
            
            _setLimitResultsMessage(maxLimitRecords, recordsCounterTotal);
        }	
        return data;	
    }

    /**
     * It calls depending on records if remove series and specific records of the last series
     * @param {array} data 
     * @param {number} recordsCounterTotal 
     * @param {number} maxLimitRecords 
     * @param {number} measuresBySeries 
     */
    function _cutNumberOfSeries(data, recordsCounterTotal, maxLimitRecords, measuresBySeries){
        // calc series by number of measures
        var numberSeriesToDelete = (recordsCounterTotal - maxLimitRecords) / measuresBySeries;
        var numberToDeleteSeries = Math.ceil(numberSeriesToDelete);
        if(numberSeriesToDelete % 1 === 0){
            data = data.splice(numberToDeleteSeries);
        }
        else{
            if((recordsCounterTotal - maxLimitRecords) >= measuresBySeries) {
                data = data.splice(numberToDeleteSeries - 1);    
            }
            data = _removeSomeRecordsInTheLastSeries(data, measuresBySeries, maxLimitRecords);
        }
        return data;
    }

    /**
     * Set message on the chart if the records is up of limit
     * @param {number} maxLimitRecords 
     * @param {number} recordsCounterTotal 
     */
	function _setLimitResultsMessage(maxLimitRecords, recordsCounterTotal){
        var messageLimitResults = htResources.get("LimitResults") || "The results are limited to {0}. Total: {1}.";
        messageLimitResults = messageLimitResults.replace("{0}",  "<strong>{0}</strong>");
		messageLimitResults = messageLimitResults.replace("{1}",  "<strong>{1}</strong>");
		messageLimitResults = messageLimitResults.replace("{0}",  maxLimitRecords);
		messageLimitResults = messageLimitResults.replace("{1}",  recordsCounterTotal);
		document.getElementsByClassName('limit-results-message')[0].innerHTML = messageLimitResults;
	}

    return {
        /**
         * start to load the Chart
         * @param {*} json 
         */
        buildChart: function (json) {
            var chartContainer = document.getElementById("mainchartdiv"),
                data = DataAdapter().adaptData(json);
            var dataWithMaximumRecords = _getMaximumRecordsToShow(data);
            var showMessageMaximumRecords = JSON.stringify(data) !== JSON.stringify(dataWithMaximumRecords);
            return dataWithMaximumRecords.length > 0 ? _createNewChart(dataWithMaximumRecords, showMessageMaximumRecords) : _showNoDataMessage(chartContainer);
        }
    };
};