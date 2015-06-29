/**
 * Created by ss on 2015/6/23.
 */
define(["./module"], function (ctrs) {

    "use strict";

    ctrs.controller('transformAnalysisctr', function ($scope, $rootScope, $q, requestService, areaService, $http, SEM_API_URL) {
            $scope.city.selected = {"name": "全部"};
            $scope.todayClass = true;
            $rootScope.tableTimeStart = -1;//开始时间
            $rootScope.tableTimeEnd = -1;//结束时间、
            $rootScope.tableFormat = null;
            $scope.send = true;//显示发送
            //sem
            $scope.bases = [
                {consumption_name: "浏览量(PV)", name: "pv"},
                {consumption_name: "访客数(UV)", name: "uv"},
                {consumption_name: "访问次数", name: "vc"},
                {consumption_name: "IP数", name: "ip"},
                {consumption_name: "新访客数", name: "nuv"},
                {consumption_name: "新访客比率", name: "nuvRate"},
                {consumption_name: "平均访问页数", name: "avgPage"},
                {consumption_name: "平均访问时长", name: "avgTime"},
                {consumption_name: "跳出率", name: "outRate"}
            ];
            $scope.transform = [
                {consumption_name: '转化次数', name: 'convert'},
                {consumption_name: '转化率', name: 'convertRate'},
                {consumption_name: '平均转化成本', name: 'avgCost'},
                {consumption_name: '收益', name: 'benefit'},
                {consumption_name: '利润', name: 'profit'}
            ];
            $scope.order = [
                {consumption_name:"订单转化",name:"orderNum"},
                {consumption_name:"订单金额",name:"orderMoney"},
                {consumption_name:"订单转化率",name:"orderNumRate"}
            ];
            $scope.eventParameter = [
                {consumption_name:"事件点击总数",name:"clickTotal"},
                {consumption_name:"唯一事件访客数",name:"visitNum"}
            ];
            //配置默认指标
            $rootScope.checkedArray = ["pv", "uv", "ip", "outRate", "avgTime", "convert"];
            $rootScope.searchGridArray = [
                {
                    name: "xl",
                    displayName: "",
                    cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                    maxWidth: 10
                },
                {
                    name: "事件名称",
                    displayName: "事件名称",
                    field: "campaignName",
                    cellTemplate: "<div><a href='javascript:void(0)' style='color:#0965b8;line-height:30px' ng-click='grid.appScope.getHistoricalTrend(this)'>{{grid.appScope.getDataUrlInfo(grid, row,3)}}</a></div>"
                    , footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>"
                },
                {
                    name: "事件点击总数",
                    displayName: "事件点击总数",
                    field: "impression",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                },
                {
                    name: "浏览量",
                    displayName: "浏览量",
                    field: "cost",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                },
                {
                    name: "访客数",
                    displayName: "访客数",
                    field: "cpc",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                },
                {
                    name: "IP数",
                    displayName: "IP数",
                    field: "outRate",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                },
                {
                    name: "转化次数",
                    displayName: "转化次数",
                    field: "avgTime",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                },
                {
                    name: "平均访问时长",
                    displayName: "平均访问时长",
                    field: "nuvRate",
                    footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                }
            ];
            $rootScope.tableSwitch = {
                latitude: {name: "计划", displayName: "计划", field: "campaignName"},
                tableFilter: null,
                dimen: false,
                arrayClear: false, //是否清空指标array
                promotionSearch: {
                    turnOn: true, //是否开启推广中sem数据
                    SEMData: "campaign" //查询类型
                }
            };


            $scope.selectedQuota = ["click", "impression"];
            $scope.onLegendClickListener = function (radio, chartInstance, config, checkedVal) {
                if (checkedVal.length) {
                    $scope.init($rootScope.user, $rootScope.baiduAccount, "campaign", checkedVal, $rootScope.start, $rootScope.end);
                } else {
                    def.defData($scope.charts[0].config);
                }
            }
            $scope.charts = [
                {
                    config: {
                        legendId: "indicators_charts_legend",
                        legendData: ["浏览量(PV)", "访客数", "转化次数", "订单数", "订单金额", "订单转化率", "平均转化成本", "平均访问时长"],//显示几种数据
                        //legendMultiData: $rootScope.lagerMulti,
                        legendAllowCheckCount: 2,
                        legendClickListener: $scope.onLegendClickListener,
                        legendDefaultChecked: [0, 1],
                        allShowChart: 4,
                        min_max: false,
                        bGap: true,
                        autoInput: 20,
                        auotHidex: true,
                        id: "indicators_charts",
                        chartType: "bar",//图表类型
                        keyFormat: 'eq',
                        noFormat: true,
                        dataKey: "key",//传入数据的key值
                        dataValue: "quota"//传入数据的value值
                    }
                }
            ];
            $scope.initGrid = function (user, baiduAccount, semType, quotas, start, end, renderLegend) {
                $rootScope.start = -1;
                $rootScope.end = -1;
                $scope.init(user, baiduAccount, semType, quotas, start, end, renderLegend);
            }
            $scope.init = function (user, baiduAccount, semType, quotas, start, end, renderLegend) {
                if (quotas.length) {
                    var semRequest = "";
                    if (quotas.length == 1) {
                        semRequest = $http.get(SEM_API_URL + user + "/" + baiduAccount + "/" + semType + "/" + quotas[0] + "-?startOffset=" + start + "&endOffset=" + end);
                    } else {
                        semRequest = $http.get(SEM_API_URL + user + "/" + baiduAccount + "/" + semType + "/" + quotas[0] + "-" + quotas[1] + "-?startOffset=" + start + "&endOffset=" + end)
                    }
                    $q.all([semRequest]).then(function (final_result) {
                        final_result[0].data.sort(chartUtils.by(quotas[0]));
                        var total_result = chartUtils.getSemBaseData(quotas, final_result, "campaignName");
                        var chart = echarts.init(document.getElementById($scope.charts[0].config.id));
                        chart.showLoading({
                            text: "正在努力的读取数据中..."
                        });
                        $scope.charts[0].config.instance = chart;
                        if (renderLegend) {
                            util.renderLegend(chart, $scope.charts[0].config);
                            Custom.initCheckInfo();
                        }
                        cf.renderChart(total_result, $scope.charts[0].config);
                    });
                }
            }
            $scope.initGrid($rootScope.user, $rootScope.baiduAccount, "campaign", $scope.selectedQuota, -1, -1, true);

            $scope.$on("ssh_refresh_charts", function (e, msg) {
                $rootScope.targetSearchSpread();
                $scope.init($rootScope.user, $rootScope.baiduAccount, "campaign", $scope.selectedQuota, $rootScope.start, $rootScope.end);
            });


            //$scope.initMap();
            //点击显示指标
            $scope.select = function () {
                $scope.visible = false;
            };
            $scope.clear = function () {
                $scope.page.selected = undefined;
                $scope.city.selected = undefined;
                $scope.country.selected = undefined;
                $scope.continent.selected = undefined;
            };
            $scope.page = {};
            $scope.pages = [
                {name: '全部页面目标'},
                {name: '全部事件目标'},
                {name: '所有页面右上角按钮'},
                {name: '所有页面底部400按钮'},
                {name: '详情页右侧按钮'},
                {name: '时长目标'},
                {name: '访问页数目标'}
            ];
            //日历

            this.selectedDates = [new Date().setHours(0, 0, 0, 0)];
            //this.type = 'range';
            /*      this.identity = angular.identity;*/
            //$scope.$broadcast("update", "msg");
            $scope.$on("update", function (e, datas) {
                // 选择时间段后接收的事件
                datas.sort();
                //console.log(datas);
                var startTime = datas[0];
                var endTime = datas[datas.length - 1];
                $scope.startOffset = (startTime - today_start()) / 86400000;
                $scope.endOffset = (endTime - today_start()) / 86400000;
                //console.log("startOffset=" + startOffset + ", " + "endOffset=" + endOffset);
            });

            $rootScope.datepickerClick = function (start, end, label) {
                var time = chartUtils.getTimeOffset(start, end);
                var offest = time[1] - time[0];
                $scope.reset();
                $rootScope.start = time[0];
                $rootScope.end = time[1];
                $scope.init($rootScope.user, $rootScope.baiduAccount, "campaign", $scope.selectedQuota, $rootScope.start, $rootScope.end);
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
                $rootScope.start = -1;
                $rootScope.end = -1;
                $rootScope.tableTimeStart = -1;//开始时间
                $rootScope.tableTimeEnd = -1;//结束时间、
                $rootScope.tableFormat = null;
                //$rootScope.targetSearchSpread();
                $scope.init($rootScope.user, $rootScope.baiduAccount, "campaign", $scope.selectedQuota, $rootScope.start, $rootScope.end);
                //图表
                requestService.refresh($scope.charts);
                $scope.reloadByCalendar("today");
                $('#reportrange span').html(GetDateStr(-1));
                //其他页面表格
                //classcurrent
                $scope.reset();
                $scope.yesterdayClass = true;
            };
        }
    );
});