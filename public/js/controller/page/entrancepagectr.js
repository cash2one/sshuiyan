/**
 * Created by XiaoWei on 2015/4/22.
 */
define(["./module"], function (ctrs) {

    "use strict";

    ctrs.controller('entrancepagectr', function ($scope, $rootScope, $http, requestService, popupService, messageService, areaService, uiGridConstants) {
        $scope.todayClass = true;

        $rootScope.tableTimeStart = 0;
        $rootScope.tableTimeEnd = 0;
        $rootScope.tableFormat = null;
        //配置默认指标
        $rootScope.checkedArray = ["pv", "uv", "avgTime"];
        $rootScope.gridArray = [
            {
                name: "xl",
                displayName: "",
                cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                maxWidth: 10
            },
            {
                name: "页面url",
                displayName: "页面url",
                field: "entrance",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>"
            },
            {
                name: " ",
                cellTemplate: "<div class='table_box'><button onmousemove='getMyButton(this)' class='table_btn'></button><div class='table_win'>" +
                "<ul style='color: #45b1ec'>" +
                "<li><a ui-sref='history4' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent' target='_blank'>查看历史趋势</a></li>" +
                "<li><a ng-click='grid.appScope.showSourceDistribution(row)'>查看来源分布</a></li>" +
                "</ul></div></div>"
            },
            {
                name: "浏览量(PV)",
                displayName: "浏览量(PV)",
                field: "pv",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
            },
            {
                name: "访客数(UV)",
                displayName: "访客数(UV)",
                field: "uv",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
            },
            {
                name: "平均访问时长",
                displayName: "平均访问时长",
                field: "avgTime",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
            }
        ];
        $rootScope.tableSwitch = {
            latitude: {name: "页面url", displayName: "页面url", field: "entrance"},
            tableFilter: null,
            dimen: false,
            // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
            number: 2,
            //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
            coding: "<li><a  ui-sref='history4' ng-click='grid.appScope.getHistoricalTrend(this)' target='_parent'>查看历史趋势</a></li>" +
            "<li><a ng-click='grid.appScope.showSourceDistribution(row)'>查看来源分布</a></li>",
            arrayClear: false
        };

        $scope.showSourceDistribution = function (row) {
            popupService.showSourceDistributionData(row.entity.loc);
        };

        $scope.onLegendClick = function (radio, chartInstance, config, checkedVal) {
            clear.lineChart(config, checkedVal);
            $scope.charts.forEach(function (chart) {
                chart.config.instance = echarts.init(document.getElementById(chart.config.id));
                chart.types = checkedVal;
            });
            var chartArray = [$scope.charts[1]];
            requestService.refresh(chartArray);
        }
        //
        //
        //
        $scope.pieFormat = function (data, config) {
            var json = JSON.parse(eval("(" + data + ")").toString());
            cf.renderChart(json, config);
        }
        $scope.mainFormat = function (data, config, e) {
            var json = JSON.parse(eval("(" + data + ")").toString());
            var result = chartUtils.getRf_type(json, $rootScope.start, "serverLabel", e.types);
            config['noFormat'] = true;
            config['twoYz'] = "none";

            /*===============TopN开始=============*/
            //if (result.length > 5) {
            //    var top = [];
            //    var _index = [];
            //    result.forEach(function (e, i) {
            //        var value = 0;
            //        e.quota.forEach(function (item) {
            //            value += item;
            //        });
            //        top.push(value);
            //        _index.push(i);
            //    });
            //}
            /*=================TopN结束==================*/
            if (result.length > 5) {
                result = result.slice(result.length - 5);
            }
            cf.renderChart(result, config);
            var final_result = chartUtils.getExternalinkPie(result);//获取barchart的数据
            var pieData = chartUtils.getEnginePie(final_result);
            $scope.charts[0].config.instance = echarts.init(document.getElementById($scope.charts[0].config.id));
            cf.renderChart(pieData, $scope.charts[0].config);
        }
        $scope.charts = [
            {
                config: {
                    legendData: [],
                    id: "sourse_charts",
                    pieStyle: true,
                    serieName: "入口页面",
                    chartType: "pie",
                    dataKey: "key",
                    dataValue: "quota"
                },
                types: ["pv"],
                dimension: ["rf"],
                url: "/api/map",
                cb: $scope.pieFormat
            },
            {
                config: {
                    legendId: "indicators_charts_legend",
                    legendData: ["访客数(UV)", "访问次数", "新访客数", "IP数", "贡献浏览量", "转化次数"],
                    legendClickListener: $scope.onLegendClick,
                    legendAllowCheckCount: 1,
                    id: "indicators_charts",
                    bGap: false,
                    min_max: false,
                    chartType: "line",
                    lineType: false,
                    keyFormat: 'none',
                    dataKey: "key",
                    dataValue: "quota"
                },
                types: ["pv"],
                dimension: ["period,loc"],
                interval: $rootScope.interval,
                url: "/api/charts",
                cb: $scope.mainFormat
            }
        ]
        $scope.init = function () {
            $rootScope.start = 0;
            $rootScope.end = 0;
            $rootScope.interval = undefined;
            var chart = echarts.init(document.getElementById($scope.charts[1].config.id));
            $scope.charts[1].config.instance = chart;
            util.renderLegend(chart, $scope.charts[1].config);
            var chartArray = [$scope.charts[1]];
            requestService.refresh(chartArray);
        }
        $scope.init();
        $scope.$on("ssh_refresh_charts", function (e, msg) {
            $rootScope.targetSearch();
            var chart = echarts.init(document.getElementById($scope.charts[1].config.id));
            $scope.charts[1].config.instance = chart;
            var arrayChart = [$scope.charts[1]]
            requestService.refresh(arrayChart);
        });
//日历
        $rootScope.datepickerClick = function (start, end, label) {
            var time = chartUtils.getTimeOffset(start, end);
            $rootScope.start = time[0];
            $rootScope.end = time[1];
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
            })
            if ($rootScope.start <= -1) {
                $scope.charts[0].config.keyFormat = "day";
            } else {
                $scope.charts[0].config.keyFormat = "hour";
            }
            requestService.refresh($scope.charts);
            $rootScope.tableTimeStart = time[0];
            $rootScope.tableTimeEnd = time[1];
            $rootScope.targetSearch();
            $scope.$broadcast("ssh_dateShow_options_time_change");
        }
        function GetDateStr(AddDayCount) {
            var dd = new Date();
            dd.setDate(dd.getDate() + AddDayCount);//获取AddDayCount天后的日期
            var y = dd.getFullYear();
            var m = dd.getMonth() + 1;//获取当前月份的日期
            var d = dd.getDate();
            return y + "-" + m + "-" + d;
        }

        //刷新
        $scope.page_refresh = function () {
            $rootScope.start = 0;
            $rootScope.end = 0;
            $rootScope.tableTimeStart = 0;
            $rootScope.tableTimeEnd = 0;
            $scope.charts.forEach(function (e) {
                var chart = echarts.init(document.getElementById(e.config.id));
                e.config.instance = chart;
            });
            //图表
            requestService.refresh($scope.charts);
            $scope.reloadByCalendar("today");
            $('#reportrange span').html(GetDateStr(0));
            //其他页面表格
            $rootScope.targetSearch(true);
            $scope.$broadcast("ssh_dateShow_options_time_change");
            //classcurrent
            $scope.reset();
            $scope.todayClass = true;
        };
    });

});
