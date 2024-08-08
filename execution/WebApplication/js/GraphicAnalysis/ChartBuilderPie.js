/**
 * Identify maximum time to wait loading pie charts
 */
var timeSpendingLoadingPieCharts;

function ChartBuilderPie(json) {
    var m_data = DataAdapter().adaptDataPie(json);
    var dataTable = getDataTable(document.frm.h_jsondata.value);
    var lastSelectedDimension = parseInt(dataTable.ExtendedProperties["LastSelectedDimension"]);
    var typeChart = getPieChart();
    
    // Properties for tracking loading charts
	var lastBuildedChart = -1;
	var arrayPieChartData = [];
	

    /**
     * Build the chart
     */
    function buildCharts() {
        var dataContainer = document.getElementById("piedatadiv");
        var chartContainer = document.getElementById("piechartdiv");
        clearDiv(chartContainer);
        if (!dataContainer) {
            alert("Data container not found, div 'piedatadiv'");
        }
        else {
            
            Object.keys(m_data).length === 0 ? _showNoDataMessage(chartContainer): _createPies(chartContainer);
        }
    }
    
    /**
     * Show 'no data to display message' when the graph don't have data 
     * @param {*} container 
     */
    function _showNoDataMessage(container) {
        container.textContent = htResources.get("noDataToDisplay") !== '' ? htResources.get("noDataToDisplay") : "No data to display";
        container.style.width = "200px";
        container.style.height = "50px";
        container.style.position = "absolute";
        container.style.left = "50%";
        container.style.top = "50%";
    }

    /**
     * Method to create a pie container
     * @param {*} chartContainer 
     */
    function _createPies(chartContainer) {
        var containerWidth = chartContainer.style.width.replace('px', '');
        var containerHeight = chartContainer.style.height.replace('px', '');
        if (containerHeight > containerWidth)
            iLowerSize = containerWidth;

        m_PieHeight = (containerWidth / m_PiesPerRow) - 15;
        m_PieWidth = (containerWidth / m_PiesPerRow) - 15;
        Object.keys(m_data).map(function (columnName, index) {
            var div = _createDiv(index);
            chartContainer.appendChild(div);

            if (m_UseGrid) {
                var divGrid = document.createElement("div");
                divGrid.id = "gridpiediv" + jColumn;
                chartContainer.appendChild(divGrid);
            }
			arrayPieChartData.push({
				id: div.id,
				columnName: columnName
			});
            
        });
		timeSpendingLoadingPieCharts = Date.now();
		_buildNextPieChart(false);
    }
    
    /**
     * Build the next Pie. 
     * @param {boolean} showReloadMessage Show only a link for manual loading
     */
	function _buildNextPieChart(showReloadMessage){
		lastBuildedChart++;
		if(lastBuildedChart < arrayPieChartData.length){
			buildPie(arrayPieChartData[lastBuildedChart].id, arrayPieChartData[lastBuildedChart].columnName, undefined, showReloadMessage, false);		
		}
		else {
			lastBuildedChart = -1;
			Windows.notify("onReadyAllPieCharts");
		}
	}
    
    /**
     * Build a pie chart by id
     * @param {*} id 
     */
	function _buildPieById(id){
		buildPie(arrayPieChartData[id].id, arrayPieChartData[id].columnName, undefined, false, true);	
	}

    /**
     * Add a new div 
     * @param {*} index 
     */
    function _createDiv (index) {
        var div = document.createElement("div");
            div.id = "piediv" + index;
        return div;
    };

    /**
     * Build the pie with amcharts library and some configurations
     * @param {id of div} div 
     * @param {string} columnName 
     * @param {number} labelsRadius 
     * @param {boolean} showReloadMessage 
     * @param {boolean} loadOnlyThisChart 
     */
    function buildPie(div, columnName, labelsRadius, showReloadMessage, loadOnlyThisChart) {
		loadOnlyThisChart = loadOnlyThisChart || false;
		
		am4core.createDeferred(function(divContainer) {
			var chart = _chooseChart(div),
            pieSeries = _chooseSerie(chart),
            nameLastDimension = dataTable.Columns[lastSelectedDimension].ColumnName,
            _countTotal = function() { 
                var counter = 0;
                if ( Object.keys(m_data).length === 0) {
                    counter = 0;
                } else {
                    m_data[columnName].map(function (item) {
                        counter += item[columnName] === "" ?  parseInt(0) : parseInt(item[columnName]);
                    });
                }
                return counter;
            },
            _hideSmall = function(ev) {
                var _MAX_WIDTH = 1.7,
                    _verySmall = 
                        ev.target.dataItem && ev.target.dataItem.values.value.percent < _MAX_WIDTH;
                _verySmall ? ev.target.hide(): ev.target.show();
            },
            _activeRadiusLabels = function(_pieSeries) {
                _pieSeries.alignLabels = false;
                _pieSeries.labels.template.bent = false;
                _pieSeries.labels.template.radius = 20;
                _pieSeries.labels.template.padding(0, 0, 0, 0);
                _pieSeries.labels.template.fill = am4core.color("#000");
                _pieSeries.ticks.template.disabled = false;
                _pieSeries.labels.template.fontSize = 9;
                _pieSeries.labels.template.maxWidth = 100;
                _pieSeries.labels.template.truncate = true;
                _pieSeries.ticks.template.events.on("ready", _hideSmall);
                _pieSeries.ticks.template.events.on("visibilitychanged", _hideSmall);
                _pieSeries.labels.template.events.on("ready", _hideSmall);
                _pieSeries.labels.template.events.on("visibilitychanged", _hideSmall);
                return _pieSeries;
            },
            total = _countTotal();

			if (total === 0) {
				_showNoDataMessageInPie(chart);
			}
			else if (showReloadMessage){
				_showActionLoadingPieByDemand(chart);
			}
			else {
				pieSeries.dataFields.value = columnName;
				pieSeries.dataFields.category = nameLastDimension;
				pieSeries.labels.template.text = "{category} {value.percent.formatNumber('#.0')}%";
				pieSeries.labels.template.paddingTop = 3;
				pieSeries.labels.template.paddingBottom = 3;
				pieSeries = _activeRadiusLabels(pieSeries);
				chart.data = m_data[columnName];
				
				if (labelsRadius) {
					pieSeries.labels.template.radius = am4core.percent(labelsRadius);
				}
				_formatTooltip(pieSeries, chart.data[0], columnName);
			}
			var title = columnName;
			_formatTitle(chart, title);

			return chart;
		}, div).then(function(chart){
			if(!loadOnlyThisChart){
                showReloadMessage = Date.now() - timeSpendingLoadingPieCharts > bizagi.override.maxTimeLoadingPieCharts;
                // prevent some rendering errors when the pie chart only have an unique value
                setTimeout(function(){
                    _buildNextPieChart(showReloadMessage);
                }, 100);
			}
		})
    };

    /**
     * Change type chart to 3D
     * @param {*} div 
     */
    function _chooseChart(div) {
        var _is3D = typeChart === TYPE_OF_CHARTS.pieSeries3D;
        return _is3D ? am4core.create(div, am4charts.PieChart3D) : am4core.create(div, am4charts.PieChart);
        
    }

    /**
     * Change series type to 3D
     * @param {*} chart 
     */
    function _chooseSerie(chart) {
        var _is3D = typeChart === TYPE_OF_CHARTS.pieSeries3D;
        return _is3D ? chart.series.push(new am4charts.PieSeries3D()) : chart.series.push(new am4charts.PieSeries());
    }

    /**
     * Show "No data to display" message in a pie chart 
     * @param {*} pieSeries 
     * @param {*} chart 
     */
    function _showNoDataMessageInPie(chart) {
        var label = chart.seriesContainer.createChild(am4core.Label);
        label.text = htResources.get("noDataToDisplay") !== '' ? htResources.get("noDataToDisplay") : "No data to display";
        label.isMeasured = false;
        label.x = am4core.percent(50);
        label.horizontalCenter = "middle";
        label.y = am4core.percent(50);
    }
    
    /**
     * Show label with click event to reload the chart
     * @param {object} chart 
     */
	function _showActionLoadingPieByDemand(chart) {
		var label = chart.seriesContainer.createChild(am4core.Label);
        label.id = lastBuildedChart;
        label.text = htResources.get("ClickToLoadChart") !== '' ? htResources.get("ClickToLoadChart") : "Click here to load the chart";
        label.text = "[#0000EE]" + label.text; // set color like a blue hyperlink
        label.isMeasured = false;
        label.x = am4core.percent(50);
        label.horizontalCenter = "middle";
        label.y = am4core.percent(50);
        label.cursorOverStyle = am4core.MouseCursorStyle.pointer;
		label.events.on("hit", function(event) { //hit event is like click event
			_buildPieById(event.target.id);
		}, chart);
	}

    /**
     * Rewrite an format the tooltip
     * @param {*} pieSeries 
     * @param {*} item 
     * @param {*} measureName 
     */
    function _formatTooltip(pieSeries, item, measureName) {
        var tooltip = '';
        var keys = Object.keys(item);

        for (var i = 0; i < keys.length; i++) {
            if (keys[i] !== measureName) {
                tooltip += getFriendlyName(keys[i]) + ": [bold] {" + keys[i] + "} [/]\n"
            } else {
                tooltip += getFriendlyName(keys[i]) + ": [bold]{value.value} \n {value.percent.formatNumber('#.0')}%[/] \n";
            }
        }

        pieSeries.slices.template.tooltipText = tooltip;
    };

    return {
        buildPie: buildPie,
        buildCharts: buildCharts
    };
}