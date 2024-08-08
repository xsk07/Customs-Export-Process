(function ($) {

    $.fn.extend({

        bizagiHighchartReport: function (optionsSended) {

            //Set the default values
            var defaults = new defaultChartOptions();
            var options = $.extend(defaults, optionsSended);
            // Necessary to set the type of gradient in the bars only modify x2 or y2
            var perShapeGradient = { x1: 0, y1: 0, x2: 1, y2: 0};
            
            //Main plugin container DIV. It will be created inside each match in the selector.
            var objectContainer;

            //var chart;
            basicChartOptions();
            //chart = new Highcharts.chart(options);
            objectContainer = $("<div id='" + options.actualChartName + "' class = 'BAChartDiv'> </div>");
            $(this).html(objectContainer);
            drawTable(objectContainer);
            
            function defaultChartOptions(){
                this.categoryNameColumnIndex = 0;
                // where the chart is going to be rendered and the type
                this.chart = {
                    renderTo: ' ',
                    type: 'bar'                    
                };
                // name of the chart on the upper side of the chart.
                this.title = {
                    text: ''                    
                };
                this.xAxis= {
                    categories: [],
                    title: {
                        style: {
                            font: 'NeoSansStdRegular, Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                        }
                    }
                };
                this.yAxis= {
                    min: 0,
                    title: {
                        text: '',
                        style: {
                            font: 'NeoSansStdRegular, Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                        }
                    }
                };
                this.legend= {
                    backgroundColor: '#FFFFFF',
                    reversed: true
                };
                this.tooltip= '';
                this.plotOptions= {
                    series: {
                        pointWidth: 50,
                        stacking: 'normal'
                    }
                };
                this.series= [];
            }

            //Sets the gradient colors for the chart
            function colorChartGradientOptions(){
                var gradientColors = [];
                //oChartOptions.seriesColors = ["#7EA016", "#E4C65F", "#B32629", "#FFFFFF"];
                $.each(options.seriesColors, function(index){
                    var s = {
                        linearGradient: perShapeGradient,
                        // The steps of the gradient go like this 0-1 and percentage values between 0 and 1
                        stops: [
                            [0, options.seriesColors[index]],
                            [0.7,'#F0F0F0'],
                            [1, options.seriesColors[index]]
                        ]
                    };
                    gradientColors.push(s);
                });
                return gradientColors;
            }

            //Sets the basic options to the chart
            function basicChartOptions() {
                this.categoryNameColumnIndex = 0;
                // where the chart is going to be rendered and the type
                this.chart = {
                    renderTo: options.renderTo,
                    type: getChartType(options.chartType)                    
                };
                // name of the chart on the upper side of the chart.
                this.title = {
                    text: options.chartTitle || '',
                    style: {
                        font: 'NeoSansStdRegular, Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                    }
                };
                this.xAxis= {
                    categories: getCategoriesName(options.dataTable),
                    title: {
                        style: {
                            font: 'NeoSansStdRegular, Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                        }
                    }
                };
                this.yAxis= {
                    min: 0,
                    title: {
                        text: '',
                        style: {
                            font: 'NeoSansStdRegular, Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                        }
                    }
                };
                this.legend= {
                    backgroundColor: '#FFFFFF',
                    reversed: true
                };
                this.tooltip= {
                    formatter: function() {
                        return ''+
                        this.series.name +': '+ this.y +'';
                    }
                };
                this.plotOptions= {
                    series: {
                        pointWidth: 50,
                        stacking: options.stackOption || 'normal'
                    }
                };
                this.series= getSeriesData(options.dataTable);                                
            }

            // Sets the properties for the data in the bar 
            function getSeriesData(dataTable){
                // Hold all the values in the table
                var series =[];
                
                for (var columnIndex = 0; columnIndex < dataTable.columns.length; ++columnIndex) {
                    // Don't draw invisible tables
                    if (dataTable.columns[columnIndex].extendedProperties && 
                        dataTable.columns[columnIndex].extendedProperties.visible && 
                        dataTable.columns[columnIndex].extendedProperties.visible.toLowerCase() == "false")
                        continue;

                    //Do not use label column as data
                    if (columnIndex == options.categoryNameColumnIndex)
                        continue;

                    //DataSet (all row values for the columnIndex-th column)
                    var dc = dataTable.columns[columnIndex];
                    var seriesName = dc.caption;
                    // 
                    var seriesDataValues = [];
                    //Values for each member
                    for (var dataRow = 0; dataRow < dataTable.rows.length; dataRow++) {
                        var seriesValues = [];
                        var row = dataTable.rows[dataRow];
                        
                        seriesValues.push(parseInt(row[columnIndex].value));
                        // Sets the data to pass to the link when it's clicked
                        var datalink ={ 
                            y: parseInt(row[columnIndex].value),
                            rowClicked : dataRow,
                            colClicked: columnIndex,
                            chartName: options.actualChartName,
                            reportIndex: options.reportIndex,    
                            events: {
                                click: ''
                            }
                        };
                        if (options.clickSeries) {
                            var seriesLink =  {
                                reportIndex : options.reportIndex , 
                                rowClicked : dataRow , 
                                colClicked: columnIndex , 
                                chartName: options.actualChartName };
                            // event click to open the details list of each state
                            datalink.events.click = function(){
                                                        ChartClicked({  reportIndex : this.reportIndex , 
                                                                        rowClicked : this.rowClicked , 
                                                                        colClicked: this.colClicked , 
                                                                        chartName: this.chartName});
                                                    };                   
                        }
                        
                        seriesDataValues.push(datalink);

                    }
                    series.push({name:seriesName, data:seriesDataValues});

                }
                return series;
            }

            // Gets the x axis categories names for the chart in an arraylist           
            function getCategoriesName(dataTable){
                var categories = [];
                for (var categoryNumber = 0; categoryNumber < dataTable.rows.length; categoryNumber++) {
                    var row = dataTable.rows[categoryNumber];
                    categoryName = row[options.categoryNameColumnIndex].text;
                    categories.push(categoryName);
                }
                return categories;
            }

            // type of the chart to be drawned. for now it's only bar.
            function getChartType(chartType) {
                switch (name) {
                    case 'bar':
                    return 'bar';
                    default:
                    return 'bar';
                }
            }

            function drawTable(objectContainer){
                if (chart) {
                   chart.destroy();
                }
                var chart;
                chart = new Highcharts.Chart({
                    chart: {
                        // where to render the chart
                        renderTo: options.renderTo,
                        // type of the chart
                        type: options.chartType,
                        //border of the chart
                        borderWidth: 1,
                        //border of the plot area
                        plotBorderWidth: 1,
                        //margins for the plot area only doesn't apply for labels and axis names of the chart
                        marginRight: options.marginRight || 50,
                        //The padding between the left outer area and all elements inside a chart. In this mode, the chart is adjusted to make room for title and legend, axis labels etc 
                        //Is required ignore the value of the left margin because the margins override the spacing  options
                        spacingLeft: 10,
                        // Dimensions of the chart
                        width: options.width,
                        height: options.height,
                        style: {
                            fontFamily: 'NeoSansStdRegular, Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                        }
                    },
                    // Hides the www.highchart link
                    credits : {
                            enabled : false
                        },
                    // Colors of the chart are defined here 
                    colors: colorChartGradientOptions(),
                    title: {
                        text: options.chartTitle || '',
                        style: {
                            fontFamily: 'NeoSansStdRegular, Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                        }
                    },
                    xAxis: {
                        // categories are the labels in the x axis
                        categories: getCategoriesName(options.dataTable),
                        // options for the labels in the x axis, the justify means to fit in the space and stagger lines refers to the max number of lines in the label before crop
                        labels: { 
                            align: 'right',
                            overflow: 'justify',
                            staggerLines: 2,
                            style: {
                                fontFamily: 'NeoSansStdRegular, Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                            }
                        },
                        title:{
                            style: {
                                fontFamily: 'NeoSansStdRegular, Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                            }
                        }
                    },
                    yAxis: {
                        max: options.xAxisMaxValue,
                        min: 0,
                        allowDecimals: false,                        
                        // title of the y axis if needed
                        labels: { 
                            style: {
                                fontFamily: 'NeoSansStdRegular, Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                            }
                        },
                        title: {
                            text: '',
                            style: {
                                fontFamily: 'NeoSansStdRegular, Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                            }
                        }
                    },
                    legend: {
                        backgroundColor: '#FFFFFF',
                        // reversed cause the chart of type bar
                        reversed: true,
                        style: {
                            fontFamily: 'NeoSansStdRegular, Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                        }
                    },
                    tooltip: {
                        // Format the tooltip in the chart when the mouse is over the chart
                        formatter: function() {
                            return ''+ this.series.name +': '+ this.y +'';
                        },
                        style: {
                            fontFamily: 'NeoSansStdRegular, Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
                        }
                    },
                    // Options for the plot overall
                    plotOptions: {
                        series: {
                            // this sets the height of the bar 
                            pointWidth: options.barHeight,
                            cursor: 'pointer',
                            // type of the stacking in the bar mode the default is normal
                            stacking: options.stackOption || 'normal'
                        } 

                    },
                    series: getSeriesData(options.dataTable)

                });
                //set the theme when needed disabled for now
                //var highchartsOptions = Highcharts.setOptions();                
            }
        }
    });

})(jQuery);