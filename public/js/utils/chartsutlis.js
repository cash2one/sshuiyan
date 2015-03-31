/**
 * Created by yousheng on 15/3/24.
 */
//typeOption={type:"xxxxx",data:object....}
var chartFactory = {
    lineChart: {
        chartInit: function (data, chartObj, chartConfig) {
            var option = {
                legend: {
                    orient: chartConfig.ledLayout,
                    data: chartConfig.legendData
                },
                tooltip: {
                    trigger: chartConfig.tt
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {show: true},
                        dataView: {show: true, readOnly: false},
                        magicType: {show: true, type: ['line', 'bar']},
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                calculable: true,
                xAxis: [
                    {
                        type: chartConfig.xType,
                        boundaryGap: chartConfig.bGap,
                        data: []
                    }
                ],
                yAxis: [
                    {
                        type: chartConfig.yType,
                        axisLabel: {
                            formatter: chartConfig.axFormat
                        }
                    }
                ],
                series: []
            };
            var serie = {
                name: data.label,
                type: chartConfig.chartType,
                data: [],
                markLine: {
                    data: [
                        {type: 'average', name: '平均值'}
                    ]
                }
            };
            if (chartConfig.min_max) {
                serie["markPoint"] = {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                }
            }
            if (data.data[0] != undefined) {
                var json = data.data;
                var xData = [];
                json.forEach(function (item) {
                    xData.push(item[chartConfig.dataKey]);
                    serie.data.push(item[chartConfig.dataValue]);
                });
                option.xAxis[0].data = xData;
                option.series.push(serie);
            }
            chartObj.hideLoading();
            chartObj.setOption(option);
        },
        chartAddData: function (data, chartObj, chartConfig) {

            if (data.data[0] != undefined) {
                var option = chartObj.getOption();
                var json = data.data;
                var xData = [];
                var serie = {
                    name: data.label,
                    type: chartConfig.chartType,
                    data: [],
                    markPoint: {
                        data: [
                            {type: 'max', name: '最大值'},
                            {type: 'min', name: '最小值'}
                        ]
                    },
                    markLine: {
                        data: [
                            {type: 'average', name: '平均值'}
                        ]
                    }
                };
                var old_series = option.series;
                var find = true;
                old_series.forEach(function (e) {
                    if (e.name == chartConfig.showTarget) {
                        find = false;
                        return;
                    }
                });
                if (find) {
                    json.forEach(function (item) {
                        serie.data.push(item[chartConfig.dataValue]);
                    });
                    option.series.push(serie);
                }
                chartObj.setOption(option);
            }
        }
    }, mapChart: {
        chartInit: function () {
            //var option = {
            //    tooltip: {
            //        trigger: 'item'
            //    },
            //    legend: {
            //        orient: 'vertical',
            //        x: 'left',
            //        data: ['访客']
            //    },
            //    dataRange: {
            //        min: 0,
            //        max: 2500,
            //        x: 'left',
            //        y: 'bottom',
            //        text: ['高', '低'],           // 文本，默认为数值文本
            //        calculable: true
            //    },
            //    toolbox: {
            //        show: true,
            //        orient: 'vertical',
            //        x: 'right',
            //        y: 'center',
            //        feature: {
            //            mark: {show: true},
            //            dataView: {show: true, readOnly: false},
            //            restore: {show: true},
            //            saveAsImage: {show: true}
            //        }
            //    },
            //    series: []
            //};
            //var name = data.name;
            //var series = {
            //    name: name,
            //    type: 'map',
            //    mapType: 'china',
            //    data: [],
            //    itemStyle: {
            //        normal: {label: {show: true}},
            //        emphasis: {label: {show: true}}
            //    }
            //};
            //var name = data.name;
            //var series = {
            //    name: name,
            //    type: 'map',
            //    mapType: 'china',
            //    data: [],
            //    itemStyle: {
            //        normal: {label: {show: true}},
            //        emphasis: {label: {show: true}}
            //    }
            //}
            //data.data.forEach(function (item) {
            //    series.data.push(item);
            //});
            //option.series.push(series);
            //chart.hideLoading();
            //chart.setOption(option);
        },
        chartAddData: function () {

        }
    }, pieChart: {
        chartInit: function (data, chartObj, chartConfig) {
            var option = {
                tooltip: {
                    trigger: chartConfig.tt,
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    orient: chartConfig.ledLayout,
                    x: 'left',
                    data: chartConfig.legendData
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {show: true},
                        dataView: {show: true, readOnly: false},
                        magicType: {
                            show: true,
                            type: ['pie', 'funnel'],
                            option: {
                                funnel: {
                                    x: '25%',
                                    width: '50%',
                                    funnelAlign: 'left',
                                    max: 1548
                                }
                            }
                        },
                        restore: {show: true},
                        saveAsImage: {show: true}
                    }
                },
                calculable: true,
                series: []
            };
            var serie = {
                name: chartConfig.serieName,
                type: chartConfig.chartType,
                radius: '55%',
                center: ['50%', '60%'],
                data: []
                //{value: 335, name: '直接访问'},
                //{value: 310, name: '邮件营销'}
            }

        }
    }
}
var chartUtils = {
    allowSelected: function (chartObj, param, allSelectedItem) {
        var selectedCount = [];
        var legend = chartObj.getOption().legend.data;
        var selected = param.selected;
        legend.forEach(function (e) {
            if (selected[e] == true) {
                selectedCount.push(selected[e]);
            }
        });
        if (selectedCount.length > allSelectedItem) {
            selected[param.target] = false;
        }
    }
}

function chart_factory(params) {


    params['type']
    var options = {
        calculable: false,
        animation: true,
        title: {
            show: true
        },
        toolbox: {
            show: false
        },
        tooltip: {
            show: true,
            trigger: 'item'
        },
        legend: {
            show: true,
            orient: "horizontal" // vertical
        }
    }
}