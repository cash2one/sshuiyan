/**
 * Created by XiaoWei on 2015/4/22.
 */
define(["./module"], function (ctrs) {
    "use strict";
    ctrs.controller("searchenginectr", function ($scope, $rootScope, $http,$cookieStore, requestService, messageService, areaService, uiGridConstants) {
        $scope.allCitys = angular.copy($rootScope.citys);
        $scope.todayClass = true;
        //        高级搜索提示显示
        $scope.terminalSearch = "";
        $scope.areaSearch = "";
//        取消显示的高级搜索的条件
        $scope.removeTerminalSearch = function(obj){
            $rootScope.$broadcast("loadAllTerminal");
            obj.terminalSearch = "";
        }
        $scope.removeAreaSearch = function(obj){
            $scope.city.selected = {"name": "全部"};
            $rootScope.$broadcast("loadAllArea");
            obj.areaSearch = "";
        }
        //table配置
        $rootScope.tableTimeStart = 0;
        $rootScope.tableTimeEnd = 0;
        $rootScope.tableFormat = null;
        //配置默认指标
        $rootScope.checkedArray = ["vc", "uv", "nuvRate", "avgPage", "ip"];
        $rootScope.gridArray = [
            {
                name: "xl",
                displayName: "",
                cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                maxWidth: 10,
                enableSorting: false
            },
            {
                name: "搜索引擎",
                displayName: "搜索引擎",
                field: "se",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
                enableSorting: false
            },
            {
                name: " ",
                cellTemplate: "<div class='table_box'><button onmousemove='getMyButton(this)' class='table_btn'></button><div class='table_win'><ul style='color: #45b1ec'><li><a ng-click='grid.appScope.getHistoricalTrend(this, \"history5\")' target='_parent'>查看历史趋势</a></li><li><a href='javascript:void(0)' ng-click='grid.appScope.showEntryPageLink(row, 2)'>查看入口页链接</a></li></ul></div></div>",
                enableSorting: false
            },
            {
                name: "访问次数",
                displayName: "访问次数",
                field: "vc",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>",
                sort: {
                    direction: uiGridConstants.DESC,
                    priority: 1
                }
            },
            {
                name: "访客数(UV)",
                displayName: "访客数(UV)",
                field: "uv",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
            },
            {
                name: "新访客比率",
                displayName: "新访客比率",
                field: "nuvRate",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
            },
            {
                name: "平均访问页数",
                displayName: "平均访问页数",
                field: "avgPage",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
            },
            {
                name: "IP数",
                displayName: "IP数",
                field: "ip",
                footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
            }
        ];
        $rootScope.tableSwitch = {
            latitude: {name: "搜索引擎", displayName: "搜索引擎", field: "se"},
            tableFilter: "[{\"rf_type\": [\"2\"]}]",
            dimen: false,
            // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
            number: 2,
            //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
            coding: "<li><a ng-click='grid.appScope.getHistoricalTrend(this, \"history5\")' target='_parent'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>",
            //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
            arrayClear: false, //是否清空指标array
            isJudge: false //是否清空filter 默认为清空
        };


        $scope.pieFormat = function (data, config) {
            var json = JSON.parse(eval("(" + data + ")").toString());
            cf.renderChart(json, config);
        }
        $scope.onLegendClick = function (radio, chartInstance, config, checkedVal) {
            clear.lineChart(config, checkedVal);
            var chart = $scope.charts[1];
            chart.config.instance = echarts.init(document.getElementById(chart.config.id));
            chart.types = checkedVal;
            requestService.refresh([chart]);
        }
        $scope.searchengineFormat = function (data, config, e) {
            var json = JSON.parse(eval("(" + data + ")").toString());
            var times = [$rootScope.start, $rootScope.end];
            var result_json = chartUtils.getRf_type(json, times, "serverLabel", e.types, config);
            config['noFormat'] = true;
            config['twoYz'] = "none"
            cf.renderChart(result_json, config);
            var pieData = chartUtils.getEnginePie(result_json, null, e);
            var e0 = $scope.charts[0];
            e0.config.instance = echarts.init(document.getElementById(e0.config.id));
            cf.renderChart(pieData, e0.config);
            var firstCount=0;
            pieData.forEach(function(i){
                i.quota.forEach(function(q){
                    firstCount+=q;
                });
            });
            if(firstCount){
                $(".chart_box").attr("style", "background:" + $rootScope.chartColors[0]);
                $("#chartlink").html(pieData[0].key[0]);
                $("#chartnumber").html(pieData[0].quota[0]);
                $("#chartpointe").html(parseFloat(pieData[0].quota[0]/firstCount*100).toFixed(2)+"%");
            }
            $("#chartname").html(chartUtils.convertChinese(e.types[0]));
        }
        $scope.extPieHover = function (params, type) {
            if (params.dataIndex != -1) {
                var colorIndex = Number(params.dataIndex);
                $(".chart_box").attr("style", "background:" + $rootScope.chartColors[colorIndex]);
                $("#chartlink").html(params.name);
                $("#chartname").html(chartUtils.convertChinese(type));
                $("#chartnumber").html(params.data.value);
                $("#chartpointe").html(params.special + "%");
            }
        }
        $scope.itemHover = function (params, typeTotal, allTotal) {
            var type = chartUtils.convertChinese($scope.charts[1].types.toString())
            $(".chart_box").attr("style", "background:" + $rootScope.chartColors[params.seriesIndex]);
            $("#chartlink").html(params[0]);
            $("#chartname").html(type);
            $("#chartnumber").html(typeTotal);
            $("#chartpointe").html(parseFloat(typeTotal / allTotal * 100).toFixed(2) + "%");
            var xName = params[1].toString();
            var res = '<li>' + type + '</li>';
            if ($rootScope.start - $rootScope.end == 0) {
                res += '<li>' + xName + ':00-' + xName + ':59</li>';
            } else {
                res += '<li>' + xName + '</li>';
            }
            res += '<li  class=chartstyle' + params.seriesIndex + '>' + params[0] + '：' + params[2] + '</li>';
            return res;
        }
        $scope.charts = [{
            config: {
                legendData: [],
                id: "sourse_charts",
                pieStyle: true,
                serieName: "搜索引擎",
                chartType: "pie",
                dataKey: "key",
                dataValue: "quota",
                onHover: $scope.extPieHover
            },
            types: ["pv"],
            dimension: ["se"],
            filter: "[{\"rf_type\":[\"2\"]}]",
            url: "/api/map",
            cb: $scope.pieFormat
        },
            {
                config: {
                    legendId: "indicators_charts_legend",
                    legendData: ["浏览量(PV)", "访客数(UV)", "访问次数", "新访客数", "IP数", "页面转化"],
                    legendClickListener: $scope.onLegendClick,
                    legendAllowCheckCount: 1,
                    //min_max: false,
                    bGap: false,
                    id: "indicators_charts",
                    keyFormat: "none",//设置不需要chart工厂处理x轴数据
                    //auotHidex: true,
                   // tt: "item",
                    itemHover: $scope.itemHover,
                    chartType: "line",
                    lineType: false,
                    dataKey: "key",
                    dataValue: "quota"
                },
                types: ["pv"],
                dimension: ["period,se"],
                filter: "[{\"rf_type\":[\"2\"]}]",
                interval: $rootScope.interval,
                url: "/api/charts",
                cb: $scope.searchengineFormat
            }]
        $scope.init = function () {
            $rootScope.start = 0;
            $rootScope.end = 0;
            $rootScope.interval = undefined;
            var chart = $scope.charts[1];
            chart.config.instance = echarts.init(document.getElementById(chart.config.id));
            util.renderLegend(chart, chart.config);
            requestService.refresh([$scope.charts[1]]);
        }
        $scope.init();
        $scope.$on("ssh_refresh_charts", function (e, msg) {
            $rootScope.targetSearch();
            var chart = $scope.charts[1];
            chart.config.instance = echarts.init(document.getElementById(chart.config.id));
            requestService.refresh([chart]);
        });
        //日历
        $rootScope.datepickerClick = function (start, end, label) {
            var time = chartUtils.getTimeOffset(start, end);
            $rootScope.start = time[0];
            $rootScope.end = time[1];
            var e = $scope.charts[1];
            e.config.keyFormat = "day";
            var chart = echarts.init(document.getElementById(e.config.id));
            e.config.instance = chart;
            requestService.refresh([e]);
            $rootScope.tableTimeStart = time[0];
            $rootScope.tableTimeEnd = time[1];
            $rootScope.targetSearch();
            $scope.$broadcast("ssh_dateShow_options_time_change");
        }
        //刷新
        $scope.page_refresh = function () {
            $rootScope.start = 0;
            $rootScope.end = 0;
            $rootScope.tableTimeStart = 0;
            $rootScope.tableTimeEnd = 0;
//            $scope.charts.forEach(function (e) {
//                var chart = echarts.init(document.getElementById(e.config.id));
//                e.config.instance = chart;
//            });
            //图表
//            requestService.refresh($scope.charts);
            //首页表格
            //requestService.gridRefresh(scope.grids);
            //其他页面表格
//            $rootScope.targetSearch();
            $scope.reloadByCalendar("today");
            $('#reportrange span').html(GetDateStr(0));
            //classcurrent
            $scope.reset();
            $scope.todayClass = true;
        };
        $rootScope.initMailData = function () {
            $http.get("api/saveMailConfig?rt=read&rule_url=" + $rootScope.mailUrl[5] + "").success(function (result) {
                if (result) {
                    var ele = $("ul[name='sen_form']");
                    formUtils.rendererMailData(result, ele);
                }
            });
        };
        $scope.sendConfig = function () {
            var formData = formUtils.vaildateSubmit($("ul[name='sen_form']"));
            var result = formUtils.validateEmail(formData.mail_address, formData);
            if (result.ec) {
                alert(result.info);
            } else {
                formData.rule_url = $rootScope.mailUrl[5];
                formData.uid = $cookieStore.get('uid');
                formData.site_id = $rootScope.siteId;
                formData.type_id=$rootScope.userType;
                formData.schedule_date = $scope.mytime.time.Format('hh:mm');
                $http.get("api/saveMailConfig?data=" + JSON.stringify(formData)).success(function (data) {
                    var result = JSON.parse(eval("(" + data + ")").toString());
                    if (result.ok == 1) {
                        alert("操作成功!");
                        $http.get("/api/initSchedule");
                    } else {
                        alert("操作失败!");
                    }
                });
            }
        };
        // 构建PDF数据
        $scope.generatePDFMakeData = function (cb) {
            var dataInfo = angular.copy($rootScope.gridApi2.grid.options.data);
            var dataHeadInfo = angular.copy($rootScope.gridApi2.grid.options.columnDefs);
            var _tableBody = $rootScope.getPDFTableBody(dataInfo, dataHeadInfo);
            var docDefinition = {
                header: {
                    text: "Search Engines data report",
                    style: "header",
                    alignment: 'center'
                },
                content: [
                    {
                        table: {
                            headerRows: 1,
                            body: _tableBody
                        }
                    },
                    {text: '\nPower by www.best-ad.cn', style: 'header'},
                ],
                styles: {
                    header: {
                        fontSize: 20,
                        fontName: "标宋",
                        alignment: 'justify',
                        bold: true
                    }
                }
            };
            cb(docDefinition);
        };

    });
});
