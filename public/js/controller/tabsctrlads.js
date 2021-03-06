/**
 * Created by john on 2015/3/30.
 */
define(["app"], function (app) {

    "use strict";

    app.controller("TabsCtrlAds", function ($timeout, $scope, $rootScope, $http, $q, requestService, SEM_API_URL, $cookieStore, $location, popupService, uiGridConstants) {
        $scope.todayClass = true;
        $scope.browserselect = true;
        var user = $rootScope.user;
        $scope.sortType = 'name';
        var baiduAccount = $rootScope.baiduAccount;
        var esType = $rootScope.userType+"_ad_track";
        var trackid = $rootScope.siteTrackId;

        $scope.tabs = [
            {title: 'Dynamic Title 1', content: 'Dynamic content 1'},
            {title: 'Dynamic Title 2', content: 'Dynamic content 2', disabled: true}
        ]
        //sem
        $scope.target = [
            {consumption_name: "点击量", name: "click"},
            {consumption_name: "展现量", name: "impression"},
            {consumption_name: "消费", name: "cost"},
            {consumption_name: "点击率", name: "ctr"},
            {consumption_name: "平均点击价格", name: "cpc"}
        ];
        //网盟
        $scope.targetNms = [
            {consumption_name: "点击量", name: "click"},
            {consumption_name: "展现量", name: "impression"},
            {consumption_name: "消费", name: "cost"},
            {consumption_name: "点击率", name: "ctr"},
            {consumption_name: "平均点击价格", name: "acp"}
        ];
        $scope.Webbased = [
            {consumption_name: "浏览量(PV)", name: "pv"},
            {consumption_name: "访问次数", name: "vc"},
            {consumption_name: "访客数(UV)", name: "uv"},
            {consumption_name: "新访客数", name: "nuv"},
            {consumption_name: "新访客比率", name: "nuvRate"}
            //{consumption_name: "页头访问次数", name: "o1"}
        ];
        $scope.flow = [
            {consumption_name: "跳出率", name: "outRate"},
            {consumption_name: "平均访问时长", name: "avgTime"},
            {consumption_name: "平均访问页数", name: "avgPage"},
            {consumption_name: "抵达率", name: "arrivedRate"}
        ];
        $scope.transform = [
            {consumption_name: "转化次数", name: "m1"},
            {consumption_name: "转化率", name: "m2"},
            {consumption_name: "平均转化成本", name: "m3"},
            {consumption_name: "收益", name: "m4"},
            {consumption_name: "利润", name: "m5"},
            {consumption_name: "投资回报率", name: "m6"}
        ];
        $scope.mobile = [
            {consumption_name: "搜索页直拨电话展现", name: "v1"},
            {consumption_name: "搜索页直拨电话点击", name: "v2"},
            {consumption_name: "搜索页直拨电话消费", name: "v3"},
            {consumption_name: "搜索页沟通展现", name: "v4"},
            {consumption_name: "搜索页沟通点击", name: "v5"},
            {consumption_name: "搜索页沟通消费", name: "v6"},
            {consumption_name: "搜索页回呼电话展现", name: "v7"},
            {consumption_name: "搜索页回呼电话点击", name: "v8"},
            {consumption_name: "搜索页回呼电话消费", name: "v9"},
            {consumption_name: "搜索页APP下载展现", name: "b1"},
            {consumption_name: "搜索页APP下载点击", name: "b2"},
            {consumption_name: "搜索页APP下载消费", name: "b3"}
        ];
        $scope.recall = [
            {consumption_name: "电话量", name: "z7"},
            {consumption_name: "已接电话量", name: "z8"},
            {consumption_name: "平均通话时长", name: "z9"},
            {consumption_name: "漏接电话量", name: "x1"}
        ];
        $scope.TodayWeb = [
            {consumption_name: "浏览量(PV)", name: "pv"},
            {consumption_name: "访问次数", name: "vc"},
            {consumption_name: "访客数(UV)", name: "uv"},
            {consumption_name: "新访客数", name: "nuv"},
            {consumption_name: "新访客比率", name: "nuvRate"},
            {consumption_name: "IP数", name: "ip"}
        ];
        $scope.Todytransform = [
            {consumption_name: "转化次数", name: "zhuanF"},
            {consumption_name: "转化率", name: "zhuanN"}
        ];
        $scope.Todayfloweds = [
            {consumption_name: "跳出率", name: "outRate"},
            {consumption_name: "平均访问时长", name: "avgTime"},
            {consumption_name: "平均访问页数", name: "avgPage"}
        ];
        $scope.Order = [
            {consumption_name: "订单数", name: "q4"},
            {consumption_name: "订单金额", name: "q5"},
            {consumption_name: "订单转化率", name: "q6"}
        ];
        $scope.Indexform = [
            {consumption_name: "转化指标", name: "q7"},
            {consumption_name: "转化率", name: "q8"}
        ];
        $scope.Indexfloweds = [
            //{consumption_name: "贡献浏览量", name: "q9"},
            {consumption_name: "跳出率", name: "outRate"},
            {consumption_name: "平均访问时长", name: "avgTime"},
            {consumption_name: "平均访问页数", name: "avgPage"}
        ];
        $scope.Mapwebbase = [
            {consumption_name: "浏览量(PV)", name: "pv"},
            //{consumption_name: "浏览量占比", name: "a5"},
            {consumption_name: "访问次数", name: "vc"},
            {consumption_name: "访客数(UV)", name: "uv"},
            {consumption_name: "新访客数", name: "nuv"},
            {consumption_name: "新访客比率", name: "nuvRate"},
            {consumption_name: "IP数", name: "ip"}
        ];
        $scope.Novisitorbase = [
            {consumption_name: "浏览量(PV)", name: "pv"},
            //{consumption_name: "浏览量占比", name: "z3"},
            {consumption_name: "访问次数", name: "vc"},
            {consumption_name: "访客数(UV)", name: "uv"},
            {consumption_name: "IP数", name: "ip"}
        ];

        //事件
        $scope.bases = [
            {consumption_name: "浏览量(PV)", name: "pv"},
            {consumption_name: "访客数(UV)", name: "uv"},
            {consumption_name: "访问次数", name: "vc"},
            {consumption_name: "IP数", name: "ip"},
            {consumption_name: "新访客数", name: "nuv"},
            {consumption_name: "新访客比率", name: "nuvRate"}
        ];
        $scope.transform = [
            {consumption_name: '转化次数', name: 'conversions'},
            {consumption_name: '转化率', name: 'crate'},
            {consumption_name: '平均转化成本(事件)', name: 'transformCost'}
        ];
        $scope.eventParameter = [
            {consumption_name: "事件点击总数", name: "clickTotal"},
            {consumption_name: "唯一访客事件数", name: "visitNum"}
        ];
        $scope.adsTransform = [
            {consumption_name: '转化次数', name: 'conversions'},
            {consumption_name: '转化率', name: 'crate'}
        ];
        //实时访问
        //TODO item["searchWord"] == ""?"--" 为捕获到暂为  --
        var getHtmlTableData = function () {
            var fi = $rootScope.tableSwitch.tableFilter != undefined && $rootScope.tableSwitch.tableFilter != null ? "&q=" + encodeURIComponent($rootScope.tableSwitch.tableFilter) : "";
            var searchUrl = SEM_API_URL + "/es/real_time?tid=" + trackid + fi;
            $http({
                method: 'GET',
                url: searchUrl
            }).success(function (data, status) {
                if (data != undefined) {
                    try {
                        JSON.stringify(data);
                    } catch (e) {
                        return;
                    }

                    data.forEach(function (item, i) {
                        item["city"] = item["city"] == "-" ? "国外" : item["city"];
                        item["visitTime"] = new Date(item["visitTime"]).Format("yyyy-MM-dd hh:mm:ss");
                        var reere = item["searchEngine"] != "-" ? (item["referrer"] + "," + item["searchEngine"]) : item["referrer"] == "-" ? "-,直接访问" : item["referrer"] + "," + item["referrer"].substring(0, 40) + (item["referrer"].length > 40 ? "..." : "")
                        item["referrer"] = reere;
                        item["searchWord"] = item["searchWord"] == "-" ? "--" : item["searchWord"] == "" ? "--" : item["searchWord"];
                        item["keyword"] = item["keyword"] == "-" ? "--" : item["searchWord"];
                        item["isPromotion"] = item["isPromotion"] ? "是" : "否";
                        var a = (Math.round(parseInt(item["totalTime"]) / 1000));
                        item["totalTime"] = parseInt(a / 60) + "\'" + (a % 60) + "\"";
                    })
                    $scope.gridOpArray = angular.copy($rootScope.gridArray);
                    $scope.gridOptions.columnDefs = $scope.gridOpArray;
                    $scope.gridOptions.data = data;
                }
            }).error(function (error) {
                //console.log(error);
            });
        };
        if (typeof($rootScope.checkedArray) != undefined && $rootScope.checkedArray == "SS") {
            $scope.tableJu = "html";
            $rootScope.gridArray = [
                {
                    name: "xl",
                    displayName: "",
                    cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                    maxWidth: 10,
                    enableSorting: false
                },
                {
                    name: '地域', displayName: "地域", field: "city",
                    enableSorting: false
                },
                {
                    name: '访问时间', displayName: "访问时间", field: "visitTime",
                    sort: {
                        direction: uiGridConstants.DESC,
                        priority: 1
                    }
                },
                {
                    name: '来源',
                    displayName: "来源",
                    field: "referrer",
                    cellTemplate: "<div class='getReferrerData' my-data-one='{{grid.appScope.getCellDisplayValueReferrer(grid, row, 1)}}' my-data-two='{{grid.appScope.getCellDisplayValueReferrer(grid, row, 2)}}'></div>",
                    enableSorting: false
                },
                {
                    name: '入口页面',
                    displayName: "入口页面",
                    field: "entrance",
                    cellTemplate: '<a href="{{grid.appScope.getCellDisplayValueEntrance(grid, row)}}" target="_blank" style="color:#0965b8;line-height:30px; display:block; padding:0 10px;white-space: nowrap;text-overflow:ellipsis; overflow:hidden;}">{{grid.appScope.getCellDisplayValueEntrance(grid, row)}}</a>',
                    cellTooltip: function (row, col) {
                        return row.entity.entrance;
                    },
                    enableSorting: false
                },
                {name: '关键词', displayName: "关键词", field: "keyword", enableSorting: false},
                {name: '搜索词', displayName: "搜索词", field: "searchWord", enableSorting: false},
                {name: '推广带来', displayName: "推广带来", field: "isPromotion", enableSorting: false},
                {name: "访问IP", displayName: "访问IP", field: "ip", enableSorting: false},
                {
                    name: '访客标识码', displayName: "访客标识码", field: "vid", cellTooltip: function (row, col) {
                    return row.entity.vid;
                },
                    enableSorting: false
                },
                {name: "访问时长", displayName: "访问时长", field: "totalTime"},
                {name: "访问页数", displayName: "访问页数", field: "viewPages"}];
            getHtmlTableData();
        } else {
            if ($rootScope.tableSwitch.arrayClear)$rootScope.checkedArray = new Array();
            if ($rootScope.tableSwitch.arrayClear)$rootScope.gridArray = new Array();
        }
        //table Button 配置 table_nextbtn
        if ($rootScope.tableSwitch.number == 1) {
            $scope.gridBtnDivObj = "<div class='table_box'><a ng-click='grid.appScope.getHistoricalTrend(this, \"history\")' target='_parent' class='table_nextbtn test' title='查看历史趋势'></a></div>";
        } else if ($rootScope.tableSwitch.number == 2) {
            $scope.gridBtnDivObj = "<div class='table_box'><button onmousemove='getMyButton(this)' class='table_btn'></button><div class='table_win'><ul style='color: #45b1ec'>" + $rootScope.tableSwitch.coding + "</ul></div></div>";
        }

        //排序
        $rootScope.sortNumber = function (a, b) {
            var nulls = $rootScope.gridApi2.core.sortHandleNulls(a, b);
            if (nulls !== null) {
                return nulls;
            } else {
                if (parseInt(a) === parseInt(b)) {
                    return 0;
                }
                if (parseInt(a) < parseInt(b)) {
                    return -1;
                }
                if (parseInt(a) > parseInt(b)) {
                    return 1;
                }
                return 0;
            }

        }
        // 百分比排序
        $rootScope.sortPercent = function (a, b) {
            var _t_a = a.substring(0, a.length - 1);
            var _t_b = a.substring(0, b.length - 1);
            if (_t_a == _t_b) {
                return 0;
            }
            if (_t_a < _t_b) {
                return -1;
            }
            return 1;
        }

        $rootScope.indicators = function (item, entities, number, refresh) {
            $rootScope.gridArray.shift();
            $rootScope.gridArray.shift();
            var footerTemp
            if ($rootScope.tableSwitch.number == 6) {
                $rootScope.gridArray.shift();
                footerTemp = "<div class='ui-grid-cell-contents'>{{grid.appScope.getEventRootData(this,grid.getVisibleRows())}}</div>";
            } else {
                footerTemp = "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>";
            }
            if (refresh == "refresh") {
                $rootScope.gridArray.unshift($rootScope.tableSwitch.latitude);
                $scope.gridObjButton = {};
                $scope.gridObjButton["name"] = "xl";
                $scope.gridObjButton["displayName"] = "";
                $scope.gridObjButton["cellTemplate"] = "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>";
                $scope.gridObjButton["maxWidth"] = 10;
                $rootScope.gridArray.unshift($scope.gridObjButton);
                return
            }

            $rootScope.tableSwitch.number != 0 && $rootScope.tableSwitch.number != 6 ? $scope.gridArray.shift() : "";
            $scope.gridObj = {};
            $scope.gridObjButton = {};
            var a = $rootScope.checkedArray.indexOf(item.name);
            if (a != -1) {
                $rootScope.checkedArray.splice(a, 1);
                $rootScope.gridArray.splice(a, 1);
                if ($rootScope.tableSwitch.number == 6) {
                    var tempButton = {};
                    tempButton["name"] = "页面URL";
                    tempButton["displayName"] = "页面URL";
                    tempButton["field"] = "eventId";
                    tempButton["footerCellTemplate"] = "<div class='ui-grid-cell-contents'>--</div>"
                    $rootScope.gridArray.unshift(tempButton);
                }
                if ($rootScope.tableSwitch.number != 0 && $rootScope.tableSwitch.number != 6) {
                    $scope.gridObjButton["name"] = " ";
                    $scope.gridObjButton["cellTemplate"] = $scope.gridBtnDivObj;
                    $rootScope.gridArray.unshift($scope.gridObjButton);
                }
                $rootScope.gridArray.unshift($rootScope.tableSwitch.latitude);
                $scope.gridObjButton = {};
                $scope.gridObjButton["name"] = "xl";
                $scope.gridObjButton["displayName"] = "";
                $scope.gridObjButton["cellTemplate"] = "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>";
                $scope.gridObjButton["maxWidth"] = 10;
                $rootScope.gridArray.unshift($scope.gridObjButton);
            } else {
                if ($rootScope.checkedArray.length >= number) {
                    $rootScope.checkedArray.shift();
                    $rootScope.checkedArray.push(item.name);
                    $rootScope.gridArray.shift();

                    $scope.gridObj["name"] = item.consumption_name;
                    $scope.gridObj["displayName"] = item.consumption_name;
                    $scope.gridObj["footerCellTemplate"] = footerTemp
                    $scope.gridObj["field"] = item.name;

                    $rootScope.gridArray.push($scope.gridObj);
                    if ($rootScope.tableSwitch.number == 6) {
                        var tempButton = {};
                        tempButton["name"] = "页面URL";
                        tempButton["displayName"] = "页面URL";
                        tempButton["field"] = "eventId";
                        tempButton["footerCellTemplate"] = "<div class='ui-grid-cell-contents'>--</div>"
                        $rootScope.gridArray.unshift(tempButton);
                    }
                    if ($rootScope.tableSwitch.number != 0 && $rootScope.tableSwitch.number != 6) {
                        $scope.gridObjButton["name"] = " ";
                        $scope.gridObjButton["cellTemplate"] = $scope.gridBtnDivObj;
                        $rootScope.gridArray.unshift($scope.gridObjButton);
                    }

                    $rootScope.gridArray.unshift($rootScope.tableSwitch.latitude);
                    $scope.gridObjButton = {};
                    $scope.gridObjButton["name"] = "xl";
                    $scope.gridObjButton["displayName"] = "";
                    $scope.gridObjButton["cellTemplate"] = "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>";
                    $scope.gridObjButton["maxWidth"] = 10;
                    $rootScope.gridArray.unshift($scope.gridObjButton);
                } else {
                    $rootScope.checkedArray.push(item.name);

                    $scope.gridObj["name"] = item.consumption_name;
                    $scope.gridObj["displayName"] = item.consumption_name;
                    $scope.gridObj["footerCellTemplate"] = footerTemp;
                    $scope.gridObj["field"] = item.name;
                    $rootScope.gridArray.push($scope.gridObj);
                    if ($rootScope.tableSwitch.number == 6) {
                        var tempButton = {};
                        tempButton["name"] = "页面URL";
                        tempButton["displayName"] = "页面URL";
                        tempButton["field"] = "eventId";
                        tempButton["footerCellTemplate"] = "<div class='ui-grid-cell-contents'>--</div>"
                        $rootScope.gridArray.unshift(tempButton);
                    }
                    if ($rootScope.tableSwitch.number != 0 && $rootScope.tableSwitch.number != 6) {
                        $scope.gridObjButton["name"] = " ";
                        $scope.gridObjButton["cellTemplate"] = $scope.gridBtnDivObj;
                        $rootScope.gridArray.unshift($scope.gridObjButton);
                    }
                    $rootScope.gridArray.unshift($rootScope.tableSwitch.latitude);
                $scope.gridObjButton = {};
                $scope.gridObjButton["name"] = "xl";
                $scope.gridObjButton["displayName"] = "";
                $scope.gridObjButton["cellTemplate"] = "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>";
                $scope.gridObjButton["maxWidth"] = 10;
                $rootScope.gridArray.unshift($scope.gridObjButton);
            }
            }



            //默认指标设置排序类型
            angular.forEach($rootScope.gridArray, function (_record, index) {
                if (_record.name == "新访客比率" || _record.name == "跳出率") {
                    _record.sortingAlgorithm = $rootScope.sortPercent;
                } else if (_record.field == "vc" || _record.field == "uv" || _record.field == "pv"
                    || _record.field == "nuv" || _record.field == "ip" ||  _record.field == "avgPage" ) {
                    _record.sortingAlgorithm = $rootScope.sortNumber;
                }
            });

            angular.forEach(entities, function (subscription, index) {
                if (subscription.name == item.name) {
                    $scope.classInfo = 'current';
                }
            });


            //$rootScope.$broadcast("ssh_reload_datashow");
        }
        var temp_path = $location.path();
        var today = temp_path.indexOf("/today");
        var yesterday = temp_path.indexOf("/yesterday");
        var month = temp_path.indexOf("/month");
        // 通用表格配置项

        if (typeof($rootScope.checkedArray) != undefined && $scope.tableJu == "html") {
            $scope.gridOptions = {

                paginationPageSize: today != -1 || yesterday != -1 || month != -1 ? 24 : 20,
                expandableRowTemplate: "<div ui-grid='row.entity.subGridOptions'></div>",
                //expandableRowHeight: 360,
                paginationPageSizes: [20, 50, 100],
                //enableExpandableRowHeader: false,
                enableExpandableRowHeader: true,
                enableColumnMenus: false,
                showColumnFooter: true,
                enablePaginationControls: true,
                enableSorting: true,
                enableGridMenu: false,
                enableHorizontalScrollbar: 0,
                enableVerticalScrollbar: 0,
                onRegisterApi: function (girApi) {
                    $rootScope.gridApi2 = girApi;
                    griApihtml(girApi);
                }
            };

        } else {
            $scope.gridOptions = {
                paginationPageSize: today != -1 || yesterday != -1 || month != -1 ? 24 : 20,
                expandableRowTemplate: "<div ui-grid='row.entity.subGridOptions'></div>",
                //expandableRowHeight: 360,
                paginationPageSizes: [20, 50, 100],
                //enableExpandableRowHeader: false,
                enableExpandableRowHeader: true,
                enableColumnMenus: false,
                showColumnFooter: true,
                enablePaginationControls: true,
                enableSorting: true,
                enableGridMenu: false,
                enableHorizontalScrollbar: 0,
                enableVerticalScrollbar: 0,
                onRegisterApi: function (gridApi) {
                    $rootScope.gridApi2 = gridApi;
                    if ($rootScope.tableSwitch.dimen) {
                        griApiInfo(gridApi);
                    }
                }
            }
            if ($scope.changeListHide == true) {
                $scope.gridOptions.enablePaginationControls = false;
                $scope.gridOptions.paginationPageSize = 50;
            }
            //$rootScope.$broadcast("ssh_reload_datashow");
        }
        ;


        $scope.page = "";
        $scope.pagego = function (pagevalue) {
            pagevalue.pagination.seek(Number($scope.page));
        }
        //地图分类
        $scope.setDimen = function (a) {
            var b = "";
            if (a == "city") {
                b = 0;
            } else {
                b = 1;
            }
            var now = +new Date();
            if (now - evTimeStamp < 100) {
                return;
            }
            evTimeStamp = now;
            var inputArray = $(".custom_select .styled");
            inputArray.each(function (i, o) {
                $(o).prev("span").css("background-position", "0px 0px");
                $(o).prop("checked", false);
            });
            $(inputArray[b]).prev("span").css("background-position", "0px -51px");
            $rootScope.tableSwitch.dimen = a;
            $rootScope.$broadcast("ssh_data_show_refresh");
            $scope.targetSearch();
        }
        //设置来源终端
        var evTimeStamp = 0;
        $rootScope.$on("loadAllTerminal", function () {
            $scope.setTerminal(0);
        })
        $scope.setTerminal = function (a) {
            var now = +new Date();
            if (now - evTimeStamp < 100) {
                return;
            }
            evTimeStamp = now;
            var inputArray = $(".chart_top2 .styled");
            inputArray.each(function (i, o) {
                $(o).prev("span").css("background-position", "0px 0px");
                $(o).prop("checked", false);
            });
            $(inputArray[a]).prev("span").css("background-position", "0px -51px");
            if (a == 0) {
                $rootScope.tableSwitch.tableFilter = null;
                $scope.terminalSearch = "";
            }
            ;
            if (a == 1) {
                $rootScope.tableSwitch.tableFilter = "[{\"pm\":[0]}]";
                $scope.terminalSearch = "计算机";
            }
            if (a == 2) {
                $rootScope.tableSwitch.tableFilter = "[{\"pm\":[1]}]";
                $scope.terminalSearch = "移动设备";
            }
            ;
            $scope.isJudge = false;
            if ($scope.tableJu == "html") {
                if (a == 0) $rootScope.tableSwitch.tableFilter = null;
                if (a == 1) $rootScope.tableSwitch.tableFilter = "[{\"pm\":\"0\"}]";
                if (a == 2) $rootScope.tableSwitch.tableFilter = "[{\"pm\":\"1\"}]";
                getHtmlTableData();
            } else {
                $rootScope.$broadcast("ssh_data_show_refresh");
                $scope.targetSearch();
            }
        };
        //设置（外部链接）设备过滤
        $rootScope.$on("ExLoadAllTerminal", function () {
            $scope.setExLinkTerminal(0);
        })
        $scope.setExLinkTerminal = function (a) {
            var now = +new Date();
            if (now - evTimeStamp < 100) {
                return;
            }
            evTimeStamp = now;
            var inputArray = $(".chart_top2_1 .styled");
            inputArray.each(function (i, o) {
                $(o).prev("span").css("background-position", "0px 0px");
                $(o).prop("checked", false);
            });
            $(inputArray[a]).prev("span").css("background-position", "0px -51px");
            if (a == 0) $rootScope.tableSwitch.tableFilter = "[{\"rf_type\":[3]}]" , $scope.exTerminalSearch = "";
            if (a == 1) $rootScope.tableSwitch.tableFilter = "[{\"pm\":[0]},{\"rf_type\":[3]}]" , $scope.exTerminalSearch = "计算机";
            if (a == 2) $rootScope.tableSwitch.tableFilter = "[{\"pm\":[1]},{\"rf_type\":[3]}]" , $scope.exTerminalSearch = "移动设备";
            $scope.isJudge = false;
            $rootScope.$broadcast("ssh_data_show_refresh");
            $scope.targetSearch();
        };
        $rootScope.$on("ExLoadAllWeb", function () {
            $scope.webClass(0);
        })
        $scope.webClass = function (a) {
            var now = +new Date();
            if (now - evTimeStamp < 100) {
                return;
            }
            evTimeStamp = now;
            var inputArray = $(".chart_top2_2 .styled");
            inputArray.each(function (i, o) {
                $(o).prev("span").css("background-position", "0px 0px");
                $(o).prop("checked", false);
            });
            $(inputArray[a]).prev("span").css("background-position", "0px -51px");
            if (a == 0) {
                $scope.webTypeSearch = ""
            }
            if (a == 1) {
                $scope.webTypeSearch = "社会化媒体"
            }
            if (a == 2) {
                $scope.webTypeSearch = "导航网站"
            }
            if (a == 3) {
                $scope.webTypeSearch = "电子邮箱"
            }
        }
        $scope.urlDomain = function (a) {
            var now = +new Date();
            if (now - evTimeStamp < 100) {
                return;
            }
            evTimeStamp = now;
            var inputArray = $(".custom_select .styled");
            inputArray.each(function (i, o) {
                $(o).prev("span").css("background-position", "0px 0px");
                $(o).prop("checked", false);
            });
            $(inputArray[a]).prev("span").css("background-position", "0px -51px");
        }
        //设置（搜索引擎）设备过滤
        $scope.setSearchEngineTerminal = function (a) {
            if (a == 0) $rootScope.tableSwitch.tableFilter = "[{\"rf_type\":[2]}]";
            if (a == 1) $rootScope.tableSwitch.tableFilter = "[{\"pm\":[0]},{\"rf_type\":[2]}]";
            if (a == 2) $rootScope.tableSwitch.tableFilter = "[{\"pm\":[1]},{\"rf_type\":[2]}]";
            $scope.isJudge = false;
            $rootScope.$broadcast("ssh_data_show_refresh");
            $scope.targetSearch();
        };
        //设置来源过滤
        $rootScope.$on("loadAllSource", function () {
            $scope.setSource(0);
        })
        $scope.setSource = function (a) {
            if (a == 0) {
                $rootScope.tableSwitch.tableFilter = null;
                $scope.sourceSearch = "";
            }
            ;
            if (a == 1) $rootScope.tableSwitch.tableFilter = "[{\"rf_type\":[1]}]", $scope.sourceSearch = "直接访问";
            if (a == 2) $rootScope.tableSwitch.tableFilter = "[{\"rf_type\":[2]}]", $scope.sourceSearch = "搜索引擎";
            if (a == 2) {
                $scope.browserselect = false;
            }
            else {
                $scope.browserselect = true;
            }
            if (a == 3) $rootScope.tableSwitch.tableFilter = "[{\"rf_type\":[3]}]", $scope.sourceSearch = "外部链接";

            if ($scope.tableJu == "html") {
                if (a == 0) $rootScope.tableSwitch.tableFilter = null;
                if (a == 1) $rootScope.tableSwitch.tableFilter = "[{\"rf_type\":\"1\"}]";
                if (a == 2) $rootScope.tableSwitch.tableFilter = "[{\"rf_type\":\"2\"}]";
                if (a == 3) $rootScope.tableSwitch.tableFilter = "[{\"rf_type\":\"3\"}]";
                getHtmlTableData();
            } else {
                $rootScope.$broadcast("ssh_data_show_refresh");
                $scope.targetSearch();
            }
        };
        //设置访客来源
        $rootScope.$on("loadAllVisitor", function () {
            $scope.setVisitors(0);
        })
        $scope.setVisitors = function (a) {
            var now = +new Date();
            if (now - evTimeStamp < 100) {
                return;
            }
            evTimeStamp = now;
            var inputArray = $(".chart_top2 .styled");
            inputArray.each(function (i, o) {
                $(o).prev("span").css("background-position", "0px 0px");
                $(o).prop("checked", false);
            });
            $(inputArray[a]).prev("span").css("background-position", "0px -51px");
            if (a == 0) $rootScope.tableSwitch.tableFilter = null, $scope.visitorSearch = "";
            if (a == 1) $rootScope.tableSwitch.tableFilter = "[{\"ct\":[0]}]", $scope.visitorSearch = "新访客";
            if (a == 2) $rootScope.tableSwitch.tableFilter = "[{\"ct\":[1]}]", $scope.visitorSearch = "老访客";
            //$scope.isJudge = false;
            $rootScope.$broadcast("ssh_data_show_refresh");
            $scope.targetSearch();
        };
        //设置来源网站
        $scope.setWebSite = function (a) {
            var now = +new Date();
            if (now - evTimeStamp < 100) {
                return;
            }
            evTimeStamp = now;
            var inputArray = $(".custom_select .styled");
            inputArray.each(function (i, o) {
                $(o).prev("span").css("background-position", "0px 0px");
                $(o).prop("checked", false);
            });
            $(inputArray[a]).prev("span").css("background-position", "0px -51px");
            if (a == 1) {
                $rootScope.tableSwitch.tableFilter = null;
                $rootScope.tableSwitch.latitude = {name: "来源网站", displayName: "来源网站", field: "dm"};
                $scope.webSite = 1;
                $rootScope.gridArray.shift();
                $rootScope.gridArray.shift();
                $rootScope.gridArray.unshift($rootScope.tableSwitch.latitude)
                $rootScope.gridArray.unshift({
                    name: "a",
                    displayName: "",
                    cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                    maxWidth: 10
                })
            }
            if (a == 0) {
                $rootScope.tableSwitch.tableFilter = null;
                $rootScope.tableSwitch.latitude = {name: "来源类型", displayName: "来源类型", field: "rf_type"};
                $rootScope.gridArray.shift();
                $rootScope.gridArray.shift();
                $rootScope.gridArray.unshift($rootScope.tableSwitch.latitude)
                $rootScope.gridArray.unshift({
                    name: "a",
                    displayName: "",
                    cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                    maxWidth: 10
                })
            }
            $scope.isJudge = false;
            if ($rootScope.sshuiyanCompareFlag) {
                $rootScope.datepickerClickTow($rootScope.sshuiyanCompareStart, $rootScope.sshuiyanCompareEnd);
            } else {
                $rootScope.$broadcast("ssh_data_show_refresh");
                $scope.targetSearch();
            }
        };
        //设置地域过滤
        $rootScope.$on("loadAllArea", function () {
            $scope.setAreaFilter("全部");
        })
        $scope.setAreaFilter = function (area) {
            $scope.areaSearch = area == "全部" ? "" : area;
            if (area == "北京" || area == "上海" || area == "广州") {
                if ($scope.city.selected != undefined) {
                    $scope.city.selected.name = area;
                } else {
                    $scope.city.selected = {};
                    $scope.city.selected["name"] = area;
                }
            }
            $scope.allCitys = angular.copy($rootScope.citys);
            if (!$rootScope.tableSwitch) {
                return;
            }

            if ("全部" == area) {
                $rootScope.tableSwitch.tableFilter = null;
            } else {
                area = (area == "北京" ? area + "市" : area);
                if ($scope.tableJu == "html") {
                    $rootScope.tableSwitch.tableFilter = "[{\"region\":\"" + area + "\"}]";
                } else {
                    $rootScope.tableSwitch.tableFilter = "[{\"region\":[\"" + area + "\"]}]";
                }
            }
            $scope.isJudge = false;
            if ($scope.tableJu == "html") {
                getHtmlTableData();
            } else {
                $rootScope.$broadcast("ssh_data_show_refresh");
                $scope.targetSearch();
            }

        };
        //自定义时间设置
        $scope.sitetimes = [{"hour": {"selected": {"name": "0:00"}}, "hour1": {"selected": {"name": "0:59"}}}];
        $scope.sitetimesadd = function () {
            $scope.sitetimes.push({"hour": {"selected": {"name": "0:00"}}, "hour1": {"selected": {"name": "0:59"}}});
        };

        $scope.sitetimesclear = function () {
            $scope.sitetimes = [{"hour": {"selected": {"name": "0:00"}}, "hour1": {"selected": {"name": "0:59"}}}];
        };
        //设置时段过滤

        $scope.setTimeFilter = function (time) {
            $scope.sitetimesclear();
            $scope.timeSearch = time == "全部" ? "" : time;
            if (time == "00:00 - 00:59") {
                if ($scope.time.selected != undefined) {
                    $scope.time.selected.name = time;
                } else {
                    $scope.time.selected = {};
                    $scope.time.selected["name"] = time;
                }
            }
            if (!$rootScope.tableSwitch) {
                return;
            }
            if ("全部" == time) {
                $rootScope.tableSwitch.tableFilter = null;
            } else {
                time = (time == "00:00 - 00:59" ? time + "" : time);
                if ($scope.tableJu == "html") {
                    $rootScope.tableSwitch.tableFilter = "[{\"period\":\"" + time + "\"}]";
                } else {
                    $rootScope.tableSwitch.tableFilter = "[{\"period\":[\"" + time + "\"]}]";
                }
            }
            $scope.isJudge = false;
            if ($scope.tableJu == "html") {
                getHtmlTableData();
            } else {
                $rootScope.$broadcast("ssh_data_show_refresh");
                $scope.targetSearch();
            }
        };
        //设置（搜 索引擎）地域过滤
        $scope.setSearchEngineAreaFilter = function (area) {
            if (!$rootScope.tableSwitch) {
                return;
            }
            if ("全部" == area) {
                $scope.areaSearch = "";
                $rootScope.tableSwitch.tableFilter = "[{\"rf_type\":[2]}]";
            } else {
                $scope.areaSearch = area;
                $rootScope.tableSwitch.tableFilter = "[{\"region\":[\"" + area + "\"]},{\"rf_type\":[2]}]";
            }
            if (area == "北京" || area == "上海" || area == "广州") {
                if ($scope.city.selected != undefined) {
                    $scope.city.selected.name = area;
                } else {
                    $scope.city.selected = {};
                    $scope.city.selected["name"] = area;
                }
            }
            $scope.isJudge = false;
            $rootScope.$broadcast("ssh_data_show_refresh");
            $scope.targetSearch();
            $scope.allCitys = angular.copy($rootScope.citys);
        };

        //设置搜索引擎过滤
        $scope.searchEngine = function (info) {
            if (info === '全部') {
                $rootScope.tableSwitch.tableFilter = "[{\"rf_type\":[2]}]";
                $scope.sourceSearch = "全部引擎";
            } else {
                $rootScope.tableSwitch.tableFilter = "[{\"se\":[\"" + info + "\"]}]";
                $scope.sourceSearch = info;
            }
            $scope.isJudge = false;
            if ($scope.tableJu == "html") {
                if (info === '全部') {
                    $rootScope.tableSwitch.tableFilter = null;
                } else {
                    $rootScope.tableSwitch.tableFilter = "[{\"se\":\"" + info + "\"}]";
                }
                getHtmlTableData();
            } else {
                $rootScope.$broadcast("ssh_data_show_refresh");
                $scope.targetSearch();
            }
            if (info == "百度" || info == "Google") {
                if ($scope.browser.selected != undefined) {
                    $scope.browser.selected.name = info;
                } else {
                    $scope.browser.selected = {};
                    $scope.browser.selected["name"] = info;
                }
            }
            $scope.allBrowsers = angular.copy($rootScope.browsers);
        };
        // 搜索词过滤
        $scope.setGjcFilter = function (gjcText) {
            if (!$rootScope.tableSwitch) {
                return;
            }
            if (undefined == gjcText || "" == gjcText) {
                $rootScope.tableSwitch.tableFilter = null;
            } else {
                $rootScope.tableSwitch.tableFilter = "[{\"kw\":[\"" + gjcText + "\"]}]";
            }
            $scope.isJudge = false;
            $rootScope.$broadcast("ssh_data_show_refresh");
            $scope.targetSearch();
        };
        // 输入URL过滤
        $scope.searchURLFilter = function (urlText) {
            if (!$rootScope.tableSwitch) {
                return;
            }
            if (undefined == urlText || "" == urlText) {
                $rootScope.tableSwitch.tableFilter = null;
            } else {
                $rootScope.tableSwitch.tableFilter = "[{\"loc\":[\"" + urlText + "\"]}]";
            }
            $scope.isJudge = false;
            $rootScope.$broadcast("ssh_data_show_refresh");
            $scope.targetSearch();
        };
        // 按url，按域名过滤
        $scope.setURLDomain = function (urlText) {
            var b = "";
            if (urlText == "rf") {
                b = 0;
            } else {
                b = 1;
            }
            var now = +new Date();
            if (now - evTimeStamp < 100) {
                return;
            }
            evTimeStamp = now;
            var inputArray = $(".custom_select .styled");
            inputArray.each(function (i, o) {
                $(o).prev("span").css("background-position", "0px 0px");
                $(o).prop("checked", false);
            });
            $(inputArray[b]).prev("span").css("background-position", "0px -51px");
            if (undefined == urlText || "" == urlText) {
                $rootScope.tableSwitch.latitude.field = null;
            } else {
                $rootScope.gridArray[1].field = urlText;
                $rootScope.tableSwitch.latitude.field = urlText;
            }
            $scope.isJudge = false;
            $rootScope.$broadcast("ssh_data_show_refresh");
            $scope.targetSearch("rf_dm");
        };
        // 外部链接搜索
        $scope.searchURLFilterBySourceEl = function (urlText) {
            if (!$rootScope.tableSwitch) {
                return;
            }
            if (undefined == urlText || "" == urlText) {
                $rootScope.tableSwitch.tableFilter = "[{\"rf_type\": [\"3\"]}]";
            } else {
                $rootScope.tableSwitch.tableFilter = "[{\"rf_type\": [\"3\"]}, {\"rf\":[\"" + urlText + "\"]}]";
            }
            $scope.isJudge = false;
            $rootScope.$broadcast("ssh_data_show_refresh");
            $scope.targetSearch();
        };
        // 查看入口页链接
        $scope.showEntryPageLink = function (row, _type) {
            if (_type == 1) {// 搜索引擎
                popupService.showEntryPageData(row.entity.rf_type);
            } else if (_type == 2) {
                popupService.showEntryPageData(row.entity.se);
            } else {
                popupService.showEntryPageData(row.entity.rf);
            }
        };
        // 实时访问输入查询
        $scope.input_gjc = "";
        $scope.input_rky = "";
        $scope.input_ip = "";
        $scope.realTimeVisit = function () {
            var visitFilert = [];
            if ($scope.input_gjc != "") {
                visitFilert.push("{\"kw\": \"" + $scope.input_gjc + "\"}")
            }
            if ($scope.input_rky != "") {
                visitFilert.push("{\"entrance\": \"1\"},{\"loc\":\"" + $scope.input_rky + "\"}")
            }
            if ($scope.input_ip != "") {
                visitFilert.push("{\"remote\": \"" + $scope.input_ip + "\"}")
            }
            if ($scope.input_ip == "" && $scope.input_rky == "" && $scope.input_gjc == "") {
                $rootScope.tableSwitch.tableFilter = null;
            } else {
                $rootScope.tableSwitch.tableFilter = "[" + visitFilert + "]";
            }
            $scope.isJudge = false;
            getHtmlTableData();
        }
        // 搜索词过滤
        $scope.setGjcFilter = function (gjcText) {
            if (!$rootScope.tableSwitch) {
                return;
            }
            if (undefined == gjcText || "" == gjcText) {
                $rootScope.tableSwitch.tableFilter = null;
            } else {
                $rootScope.tableSwitch.tableFilter = "[{\"kw\":[\"" + gjcText + "\"]}]";
            }
            $scope.isJudge = false;
            $rootScope.$broadcast("ssh_data_show_refresh");
            $scope.targetSearch();
        };
        // 输入URL过滤
        $scope.searchURLFilter = function (urlText) {
            if (!$rootScope.tableSwitch) {
                return;
            }
            if (undefined == urlText || "" == urlText) {
                $rootScope.tableSwitch.tableFilter = null;
            } else {
                $rootScope.tableSwitch.tableFilter = "[{\"loc\":[\"" + urlText + "\"]}]";
            }
            $scope.isJudge = false;
            $rootScope.$broadcast("ssh_data_show_refresh");
            $scope.targetSearch();
        };
        // 按url，按域名过滤
        $scope.setURLDomain = function (urlText) {
            var b = "";
            if (urlText == "rf") {
                b = 0;
            } else {
                b = 1;
            }
            var now = +new Date();
            if (now - evTimeStamp < 100) {
                return;
            }
            evTimeStamp = now;
            var inputArray = $(".custom_select .styled");
            inputArray.each(function (i, o) {
                $(o).prev("span").css("background-position", "0px 0px");
                $(o).prop("checked", false);
            });
            $(inputArray[b]).prev("span").css("background-position", "0px -51px");
            if (undefined == urlText || "" == urlText) {
                $rootScope.tableSwitch.latitude.field = null;
            } else {
                $rootScope.gridArray[1].field = urlText;
                $rootScope.tableSwitch.latitude.field = urlText;
            }
            $scope.isJudge = false;
            $rootScope.$broadcast("ssh_data_show_refresh");
            $scope.targetSearch("rf_dm");
        };
        // 外部链接搜索
        $scope.searchURLFilterBySourceEl = function (urlText) {
            if (!$rootScope.tableSwitch) {
                return;
            }
            if (undefined == urlText || "" == urlText) {
                $rootScope.tableSwitch.tableFilter = "[{\"rf_type\": [\"3\"]}]";
            } else {
                $rootScope.tableSwitch.tableFilter = "[{\"rf_type\": [\"3\"]}, {\"rf\":[\"" + urlText + "\"]}]";
            }
            $scope.isJudge = false;
            $rootScope.$broadcast("ssh_data_show_refresh");
            $scope.targetSearch();
        };
        // 查看入口页链接
        $scope.showEntryPageLink = function (row, _type) {
            if (_type == 1) {// 搜索引擎
                popupService.showEntryPageData(row.entity.rf_type);
            } else if (_type == 2) {
                popupService.showEntryPageData(row.entity.se);
            } else {
                popupService.showEntryPageData(row.entity.rf);
            }
        };
        // 实时访问输入查询
        $scope.input_gjc = "";
        $scope.input_rky = "";
        $scope.input_ip = "";
        $scope.realTimeVisit = function () {
            var visitFilert = [];
            if ($scope.input_gjc != "") {
                visitFilert.push("{\"kw\": \"" + $scope.input_gjc + "\"}")
            }
            if ($scope.input_rky != "") {
                visitFilert.push("{\"entrance\": \"1\"},{\"loc\":\"" + $scope.input_rky + "\"}")
            }
            if ($scope.input_ip != "") {
                visitFilert.push("{\"remote\": \"" + $scope.input_ip + "\"}")
            }
            if ($scope.input_ip == "" && $scope.input_rky == "" && $scope.input_gjc == "") {
                $rootScope.tableSwitch.tableFilter = null;
            } else {
                $rootScope.tableSwitch.tableFilter = "[" + visitFilert + "]";
            }
            $scope.isJudge = false;
            getHtmlTableData();
        };
        $scope.getEventRootData = function (a, options) {
            //console.log("getEventRootData")
            var hash = {}
            var val = 0
            if (a.col.field == "crate") {
                options.forEach(function (option) {
                    var tempCrate = option.entity[a.col.field].substring(0, option.entity[a.col.field].length - 2)
                    val = val + Number(tempCrate)
                })
                val += "%"
            } else if (a.col.field == "clickTotal") {
                options.forEach(function (option) {
                    val = val + Number(option.entity[a.col.field])
                })
            } else if (a.col.field == "conversions") {
                options.forEach(function (option) {
                    val = val + Number(option.entity[a.col.field])
                })
            } else {
                options.forEach(function (option) {
                    if (!hash[option.entity.loc]) {
                        hash[option.entity.loc] = true;
                        val = val + Number(option.entity[a.col.field])
                    }
                })
            }
            return val
        }




        //前端ui-grid通用查询方法
        $rootScope.targetSearch = function (isClicked) {
            if (window.location.href.split("/")[window.location.href.split("/").length - 1] == "changelist") {
                // 来源变化榜不需要查询
                return;
            }
            $scope.gridOptions.showColumnFooter = !$scope.gridOptions.showColumnFooter;
            $scope.gridOpArray = angular.copy($rootScope.gridArray);
            $scope.gridOptions.columnDefs = $scope.gridOpArray;
            var aaaa =  $scope.gridOpArray;
            var bbbb = $scope.gridOptions.columnDefs;
            $scope.gridOptions.rowHeight = 32;
            $scope.gridOptions.columnFooterHeight = 32;
            $(".custom_table i").css({"display": "block"});

            //默认指标设置排序类型
            angular.forEach($scope.gridOptions.columnDefs, function (_record, index) {
                if (_record.name == "新访客比率" || _record.name == "跳出率") {
                    _record.sortingAlgorithm = $rootScope.sortPercent;
                } else if (_record.field == "vc" || _record.field == "uv" || _record.field == "pv"
                    || _record.field == "nuv" || _record.field == "ip" || _record.field == "avgPage") {
                    _record.sortingAlgorithm = $rootScope.sortNumber;
                }
            });
            //if (isClicked) {
            $rootScope.$broadcast("ssh_dateShow_options_quotas_change", $rootScope.checkedArray);
            //}
            if ($rootScope.tableSwitch.latitude != null && $rootScope.tableSwitch.latitude == undefined) {
                //console.error("error: latitude is not defined,Please check whether the parameter the configuration.");
                return;
            }
            if ($rootScope.tableTimeStart == undefined) {
                ////console.error("error: tableTimeStart is not defined,Please check whether the parameter the configuration.");
                return;
            }
            if ($rootScope.tableTimeEnd == undefined) {
                //console.error("error: tableTimeEnd is not defined,Please check whether the parameter the configuration.");
                return;
            }
            if ($rootScope.tableSwitch.isJudge == undefined) $scope.isJudge = true;
            if ($rootScope.tableSwitch.isJudge) $rootScope.tableSwitch.tableFilter = undefined;
            if ($rootScope.tableSwitch.number == 6) {
                var a = $rootScope.tableSwitch.latitude.field;
                $scope.gridOpArray.forEach(function (item, i) {
                    if (item["cellTemplate"] == undefined) {
                        if (a == item["field"]) {
                            item["footerCellTemplate"] = "<div class='ui-grid-cell-contents' style='height: 32px'>当页汇总</div>";
                        } else if (item["field"] == "eventId" || item["field"] == "loc") {
                            item["footerCellTemplate"] = "<div class='ui-grid-cell-contents' style='height: 32px'>--</div>";
                        } else {
                            item["footerCellTemplate"] = "<div class='ui-grid-cell-contents' style='height: 32px'>" +
                                "<ul><li>{{grid.appScope.getEventRootData(this,grid.getVisibleRows())}}</li></ul></div>";
                        }
                    }
                });
            } else {
                $scope.gridOpArray.forEach(function (item, i) {
                    if (item["cellTemplate"] == undefined) {
                        var a = $rootScope.tableSwitch.latitude.field;
                        if (a != undefined && a == item["field"]) {
                            item["footerCellTemplate"] = "<div class='ui-grid-cell-contents' style='height: 32px'>当页汇总</div>";
                        } else {
//                        item["footerCellTemplate"] = "<div class='ui-grid-cell-contents' style='height: 100px'>{{grid.appScope.getFooterData(this,grid.getVisibleRows(),2)}}<br/>{{grid.appScope.getFooterData(this,grid.getVisibleRows(),3)}}<br/>{{grid.appScope.getFooterData(this,grid.getVisibleRows(),4)}}</div>";
                            item["footerCellTemplate"] = "<div class='ui-grid-cell-contents' style='height: 32px'>" +
                                "<ul><li>{{grid.appScope.getFooterData(this,grid.getVisibleRows(),2)}}</li><li>{{grid.appScope.getFooterData(this,grid.getVisibleRows(),3)}}</li><li>{{grid.appScope.getFooterData(this,grid.getVisibleRows(),4)}}</li></ul></div>";
                        }
                    }
                });
            }
            if ($rootScope.tableSwitch.number == 5) {//推广URL速度
                //var url = SEM_API_URL + "/sem/report/" + (area == "全部" ? $rootScope.tableSwitch.promotionSearch.SEMData : "region") + "?a=" + user + "&b=" + baiduAccount + "&startOffset=" + $rootScope.tableTimeStart + "&endOffset=" + $rootScope.tableTimeEnd + "&device=-1" + (area == "全部" ? "" : "&rgna=" + area);
                $http({
                    method: 'GET',
                    url: "/api/getUrlspeed/?start=" + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeEnd + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&trackId=" + $rootScope.siteTrackId
                }).success(function (data, status) {
                    if (data.length <= 0) {
                        var fields = $rootScope.tableSwitch.latitude.field;
                        var result = [];
                        var resultObj = {};
                        resultObj[fields] = "暂无数据";
                        resultObj["openSpeed"] = "0";
                        resultObj["vc"] = "0";
                        result.push(resultObj);
                        $scope.gridOptions.showColumnFooter = !$scope.gridOptions.showColumnFooter;
                        $scope.gridOptions.data = result;
                    } else {
                        var dataArray = [];
                        var dataObj = {};
                        var speedDataInfo = 0;
                        var speedDataVc = 0
                        data.forEach(function (item, i) {
                            var urlDateTime = (parseInt(item.dms_time.value) / parseInt(item.doc_count) / 1000).toFixed(2);
                            dataObj["loc"] = item.key;
                            dataObj["openSpeed"] = urlDateTime + "\"";
                            dataObj["vc"] = item.ucv.value;
                            dataArray.push(dataObj);
                            speedDataInfo += urlDateTime;
                            speedDataVc += item.ucv.value
                        });
                        $rootScope.urlSeepdDataInfo = (speedDataInfo / (data.length <= 0 ? 1 : data.length)).toFixed(2) + "\"";
                        $rootScope.urlSeepdDataVc = speedDataVc;
                        $scope.gridOptions.showColumnFooter = !$scope.gridOptions.showColumnFooter;
                        $scope.gridOptions.data = dataArray;
                    }
                });
            } else if ($rootScope.tableSwitch.number == 4) {//来源分析搜索词-搜索
                var fi = $rootScope.tableSwitch.tableFilter != undefined && $rootScope.tableSwitch.tableFilter != null ? "&q=" + encodeURIComponent($rootScope.tableSwitch.tableFilter) : "";
                var searchUrl = SEM_API_URL + "/es/search_word?tid=" + trackid + "&startOffset=" + $rootScope.tableTimeStart + "&endOffset=" + $rootScope.tableTimeEnd + fi;
                $http({
                    method: 'GET',
                    url: searchUrl
                }).success(function (data, status) {
                    $rootScope.$broadcast("LoadDateShowDataFinish", data);
                    var result = [];
                    data.forEach(function (item, i) {
                        var infoKey = item["word"];
                        if (infoKey != undefined && (infoKey == "-" || infoKey == "" || infoKey == "www" || infoKey == "null" || infoKey.length >= 40)) {
                        } else {
                            result.push(item);
                        }
                    });
                    $scope.gridOptions.showColumnFooter = !$scope.gridOptions.showColumnFooter;
                    $scope.gridOptions.data = result;
                })
            } else if ($rootScope.tableSwitch.number == 6) {//来源分析搜索词-搜索
                $scope.gridOptions.showColumnFooter = !$scope.gridOptions.showColumnFooter;
                $scope.gridOptions.data = $rootScope.gridData;
            } else {
                $rootScope.$broadcast("LoadAdDateShowStart", $rootScope.checkedArray);
                $http({
                    method: 'GET',
                    url: '/api/indextable/?start=' + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeEnd + "&indic=" + $rootScope.checkedArray + "&dimension=" + ($rootScope.tableSwitch.promotionSearch ? null : $rootScope.tableSwitch.latitude.field)
                    + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&promotion=" + $rootScope.tableSwitch.promotionSearch + "&formartInfo=" + $rootScope.tableFormat+"&popup=" + $rootScope.tableSwitch.popup  + "&type=" + esType
                }).success(function (data, status) {
                    if ($rootScope.tableFormat != "hour") {
                        if ($rootScope.tableFormat == "week") {
                            data.forEach(function (item, i) {
                                item.period = util.getYearWeekState(item.period);
                            });
                            if (data.length == 0) {
                                var resultData = [];
                                var resultObj = {};
                                $rootScope.checkedArray.forEach(function (item, a) {
                                    resultObj[item] = "--";
                                });

                                resultObj[$rootScope.tableSwitch.latitude.field] = "暂无数据";
                                resultData.push(resultObj);
                                $scope.gridOptions.showColumnFooter = !$scope.gridOptions.showColumnFooter;
                                $scope.gridOptions.data = resultData;
                            } else {
                                $scope.gridOptions.showColumnFooter = !$scope.gridOptions.showColumnFooter;
                                $scope.gridOptions.data = data;
                            }
                        } else {

                            if (data.length == 0) {
                                var resultData = [];
                                var resultObj = {};
                                if ($rootScope.checkedArray != undefined) {
                                    $rootScope.checkedArray.forEach(function (item, a) {
                                        resultObj[item] = "--";
                                    });
                                }
                                resultObj[$rootScope.tableSwitch.latitude.field] = "暂无数据";
                                $(".custom_table i").css({"display": "none"});
                                resultData.push(resultObj);
                                $scope.gridOptions.showColumnFooter = !$scope.gridOptions.showColumnFooter;
                                $scope.gridOptions.data = resultData;
                            } else {
                                $scope.gridOptions.showColumnFooter = !$scope.gridOptions.showColumnFooter;
                                $scope.gridOptions.data = data;
                            }
                        }
                    } else {
                        var result = [];
                        var vaNumber = 0;
                        var maps = {}
                        var newData = chartUtils.getByHourByDayData(data);

                        newData.forEach(function (info, x) {
                            for (var i = 0; i < info.key.length; i++) {
                                var infoKey = info.key[i];
                                var obj = maps[infoKey];
                                if (!obj) {
                                    obj = {};
                                    var dataString = (infoKey.toString().length >= 2 ? "" : "0")
                                    obj["period"] = dataString + infoKey + ":00 - " + dataString + infoKey + ":59";
                                    maps[infoKey] = obj;

                                }
                                if (info.label == "平均访问时长") {
                                    obj["avgTime"] = ad.formatFunc(info.quota[i], "avgTime");
                                } else {
                                    if (info.label == "跳出率") {
                                        obj[chartUtils.convertEnglish(info.label)] = info.quota[i] + "%";
                                    } else {
                                        if (info.label == "新访客比率") {
                                            obj[chartUtils.convertEnglish(info.label)] = info.quota[i] + "%";
                                        } else {
                                            obj[chartUtils.convertEnglish(info.label)] = info.quota[i];
                                        }
                                    }
                                }
                                maps[infoKey] = obj;
                            }
                        });

                        var jupey = 0
                        for (var key in maps) {
                            jupey = 1;
                            if (key != null) {
                                result.push(maps[key]);
                            }
                        }
                        if (jupey == 0) {
                            var resultObj = {};
                            $rootScope.checkedArray.forEach(function (item, a) {
                                resultObj[item] = "--";
                            });
                            resultObj[$rootScope.tableSwitch.latitude.field] = "暂无数据";
                            result.push(resultObj)
                        }
                        $scope.gridOptions.showColumnFooter = !$scope.gridOptions.showColumnFooter;
                        $scope.gridOptions.data = result;
                    }

                });
            }
        };
        //init
        if ($scope.tableJu != 'html' && $rootScope.historyJu != "NO") {
            $scope.targetSearch();
        }
        $scope.$on("history", function (e, msg) {
            $scope.gridOpArray = angular.copy($rootScope.gridArray);
            $scope.gridOpArray.splice(1, 1);
            $scope.gridOptions.columnDefs = $scope.gridOpArray;
            $scope.gridOptions.data = msg;
        });
        //数据对比
        $rootScope.datepickerClickTow = function (start, end, label) {
            $scope.gridOptions.showColumnFooter = !$scope.gridOptions.showColumnFooter;
            var gridArrayOld = angular.copy($rootScope.gridArray);
            var latitudeOld = angular.copy($rootScope.tableSwitch.latitude);
            $rootScope.gridArray.forEach(function (item, i) {
                var a = item["field"];
                if (item["cellTemplate"] == undefined) {
                    item["cellTemplate"] = "<ul class='contrastlist'><li>{{grid.appScope.getContrastInfo(grid, row,0,'" + a + "')}}</li><li>{{grid.appScope.getContrastInfo(grid, row,1,'" + a + "')}}</li><li>{{grid.appScope.getContrastInfo(grid, row,2,'" + a + "')}}</li><li>{{grid.appScope.getContrastInfo(grid, row,3,'" + a + "')}}</li></ul>";
                    item["footerCellTemplate"] = "<ul class='contrastlist'><li>{{grid.appScope.getCourFooterData(this,grid.getVisibleRows(),0)}}</li><li>{{grid.appScope.getCourFooterData(this,grid.getVisibleRows(),1)}}</li><li>{{grid.appScope.getCourFooterData(this,grid.getVisibleRows(),2)}}</li><li>{{grid.appScope.getCourFooterData(this,grid.getVisibleRows(),3)}}</li></ul>";
                }
            });
            $scope.gridOptions.rowHeight = 95;
            $scope.gridOptions.columnFooterHeight = 95;
            var time = chartUtils.getTimeOffset(start, end);
            var startTime = time[0];
            var endTime = time[0] + ($rootScope.tableTimeEnd - $rootScope.tableTimeStart);
            $rootScope.$broadcast("ssh_load_compare_datashow", startTime, endTime);
            var dateTime1 = chartUtils.getSetOffTime($rootScope.tableTimeStart, $rootScope.tableTimeEnd);
            var dateTime2 = chartUtils.getSetOffTime(startTime, endTime);
            $rootScope.$broadcast("LoadAdCompareDateShowStart", $rootScope.checkedArray);
            $scope.targetDataContrast(null, null, function (item) {
                var target = $rootScope.tableSwitch.latitude.field;
                var dataArray = [];
                var is = 1;
                $scope.targetDataContrast(startTime, endTime, function (contrast) {
                 //   var newitem =   $scope.mergeArray (item,contrast,latitudeOld);
                    item.forEach(function (a, b) {
                        // 求出总和
                        a.con_a_pv = a.con_a_vc = a.con_a_svc = a.con_a_uv = a.con_a_nuv = 0;
                        a.con_b_pv = a.con_b_vc = a.con_b_svc = a.con_b_uv = a.con_b_nuv = 0;
                        item.forEach(function (item_item) {
                            a.con_a_pv += parseInt(item_item["pv"] == "--" ? 0 : item_item["pv"]);
                            a.con_a_vc += parseInt(item_item["vc"] == "--" ? 0 : item_item["vc"]);
                            a.con_a_svc += parseInt(item_item["svc"] == "--" ? 0 : item_item["svc"]);
                            a.con_a_uv += parseInt(item_item["uv"] == "--" ? 0 : item_item["uv"]);
                            a.con_a_nuv += parseInt(item_item["nuv"] == "--" ? 0 : item_item["nuv"]);
                        });
                        contrast.forEach(function (con_item) {
                            // 保留计算需要的参数原始值
                            a.con_b_pv += parseInt(con_item["pv"] == "--" ? 0 : con_item["pv"]);
                            a.con_b_vc += parseInt(con_item["vc"] == "--" ? 0 : con_item["vc"]);
                            a.con_b_svc += parseInt(con_item["svc"] == "--" ? 0 : con_item["svc"]);
                            a.con_b_uv += parseInt(con_item["uv"] == "--" ? 0 : con_item["uv"]);
                            a.con_b_nuv += parseInt(con_item["nuv"] == "--" ? 0 : con_item["nuv"]);
                        });
                    });

                    var wordArray = [];// 对比词数组
                    var aaaArray = [];
                    var bbbArray = [];
                    item.forEach(function (_record) {
                        aaaArray.push(_record[target]);
                        wordArray.push(_record[target]);
                    });
                    contrast.forEach(function (_record) {
                        bbbArray.push(_record[target]);
                        if (wordArray.indexOf(_record[target]) == -1) {// 判断搜索词是否已存在
                            wordArray.push(_record[target]);
                        }
                    });

                    console.log(wordArray);

                    wordArray.forEach(function (_w, i) {
                        var a_i = aaaArray.indexOf(wordArray[i]);
                        var b_i = bbbArray.indexOf(wordArray[i]);
                        if (a_i != -1 && b_i != -1) {
                            var a_obj = item[a_i];
                            var b_obj = contrast[b_i];
                            var dataObj = {};
                            $rootScope.checkedArray.forEach(function (tt) {
                                var bili = ((parseInt(a_obj[tt] + "".replace("%")) - parseInt((b_obj[tt] + "").replace("%"))) / (parseInt((b_obj[tt] + "").replace("%")) == 0 ? parseInt(a_obj[tt] + "".replace("%")) : parseInt((b_obj[tt] + "").replace("%"))) * 100).toFixed(2);
                                dataObj[tt] = (isNaN(bili) ? 0 : bili) + "%";
                                a_obj[tt] = "　" + "," + a_obj[tt] + "," + b_obj[tt] + "," + dataObj[tt];
                            });
                            a_obj[target] = a_obj[target] + "," + ($rootScope.startString != undefined ? $rootScope.startString : dateTime1[0] == dateTime1[1] ? dateTime1[0] + "," + dateTime2[0] + "," + "变化率" : dateTime1[0] + " 至 " + dateTime1[1]) + "," + (dateTime2[0] + " 至 " + dateTime2[1]) + "," + "变化率";
                            dataArray.push(a_obj);
                        }

                        if (a_i == -1) {
                            var b_obj = contrast[b_i];
                            $rootScope.checkedArray.forEach(function (tt) {
                                b_obj[tt] = "　" + ",--," + b_obj[tt] + ",--"
                            });
                            b_obj[target] = b_obj[target] + "," + ($rootScope.startString != undefined ? $rootScope.startString : dateTime1[0] == dateTime1[1] ? dateTime1[0] + "," + dateTime2[0] + "," + "变化率" : dateTime1[0] + " 至 " + dateTime1[1]) + "," + (dateTime2[0] + " 至 " + dateTime2[1]) + "," + "变化率";
                            dataArray.push(b_obj);
                        }

                        if (b_i == -1) {
                            var a_obj = item[a_i];
                            $rootScope.checkedArray.forEach(function (tt) {
                                a_obj[tt] = "　" + "," + a_obj[tt] + ",--,--"
                            });
                            a_obj[target] = a_obj[target] + "," + ($rootScope.startString != undefined ? $rootScope.startString : dateTime1[0] == dateTime1[1] ? dateTime1[0] + "," + dateTime2[0] + "," + "变化率" : dateTime1[0] + " 至 " + dateTime1[1]) + "," + (dateTime2[0] + " 至 " + dateTime2[1]) + "," + "变化率";
                            dataArray.push(a_obj);
                        }

                    });
                    $scope.gridOptions.showColumnFooter = !$scope.gridOptions.showColumnFooter;
                });
                $scope.gridOptions.data = dataArray;
                $rootScope.tableSwitch.latitude = latitudeOld;
                $rootScope.gridArray = gridArrayOld;
            })
        };
      /*  //合并数组
        $scope.mergeArray = function(arr1, arr2,quotaobj){
            var _arr = [];
            var value_1;
            var value_2;
            var index = 0;
            for (var i = 0; i < arr1.length; i++) {
                for(var j = 0; j < arr2.length; j++){
                    if(quotaobj.field=="rf"){
                         value_1 = arr1[i].rf;
                         value_2 =  arr2[j].rf;
                    }else if(quotaobj.field=="media"){
                         value_1 = arr1[i].media;
                         value_2 =  arr2[j].media;
                    }else if(quotaobj.field=="cpan"){
                         value_1 = arr1[i].cpan;
                         value_2 =  arr2[j].cpan;
                    }else if(quotaobj.field=="kwna"){
                         value_1 = arr1[i].kwna;
                         value_2 =  arr2[j].kwna;
                    }else if(quotaobj.field=="crt"){
                         value_1 = arr1[i].crt;
                         value_2 =  arr2[j].crt;
                    }
                    if(value_1 != value_2){
                        var nullObject = new Object();
                        for (var prop in  arr1[i]){
                            if( prop == "rf" || prop == "media"|| prop == "cpan"||prop == "kwna"|| prop == "crt"){
                                nullObject.prop = arr2[j].prop;
                            }else{
                                nullObject.prop = '--';
                            }
                        }
                        _arr.pus(nullObject)
                    }
                }
                _arr.push(arr1[i]);
            }
            return _arr;
        }*/

        //数据对比实现方法
        $scope.targetDataContrast = function (startInfoTime, endInfoTime, cabk) {
            $scope.gridOpArray = angular.copy($rootScope.gridArray);
            $scope.gridOptions.columnDefs = $scope.gridOpArray;
            if ($rootScope.tableSwitch.isJudge == undefined) $scope.isJudge = true;
            if ($rootScope.tableSwitch.isJudge) $rootScope.tableSwitch.tableFilter = undefined;
            if ($rootScope.tableSwitch.number == 4) {
                var searchUrl = SEM_API_URL + "/es/search_word?tid=" + trackid + "&startOffset=" + $rootScope.tableTimeStart + "&endOffset=" + $rootScope.tableTimeEnd;
                $http({
                    method: 'GET',
                    url: searchUrl
                }).success(function (data, status) {
                    cabk(data);
                })
            } else {
                $http({
                    method: 'GET',
                    url: '/api/indextable/?start=' + (startInfoTime == null ? $rootScope.tableTimeStart : startInfoTime) + "&end=" + (endInfoTime == null ? $rootScope.tableTimeEnd : endInfoTime) + "&indic=" + $rootScope.checkedArray + "&dimension=" + ($rootScope.tableSwitch.promotionSearch ? null : $rootScope.tableSwitch.latitude.field)
                    + "&filerInfo=" + $rootScope.tableSwitch.tableFilter + "&promotion=" + JSON.stringify($rootScope.tableSwitch.promotionSearch) + "&formartInfo=" + $rootScope.tableFormat + "&popup=" + $rootScope.tableSwitch.popup +"&type=" + esType
                }).success(function (data, status) {
                    if ($rootScope.tableSwitch.promotionSearch != undefined && $rootScope.tableSwitch.promotionSearch) {
                        var url = SEM_API_URL + "/sem/report/account?a=" + user + "&b=" + baiduAccount + "&startOffset=" + $rootScope.tableTimeStart + "&endOffset=" + $rootScope.tableTimeEnd + "&device=-1";
                        $http({
                            method: 'GET',
                            url: url
                        }).success(function (dataSEM, status) {
                            var dataArray = [];
                            var dataObj = {};
                            if (dataSEM.length == 1) {
                                $rootScope.checkedArray.forEach(function (item, i) {
                                    if ($rootScope.tableSwitch.latitude.field == "accountName") {
                                        dataObj["accountName"] = dataSEM[0].accountName
                                    }
                                    dataSEM.forEach(function (sem, i) {
                                        if (dataObj[item] == undefined) {
                                            if (item == "ctr") {
                                                dataObj[item] = sem[item] + "%"
                                            } else {
                                                dataObj[item] = sem[item]
                                            }
                                        }
                                    });
                                    data.forEach(function (es, i) {
                                        if (dataObj[item] == undefined) {
                                            dataObj[item] = es[item]
                                        }
                                    })
                                });
                                dataArray.push(dataObj);
                            }
                            cabk(dataArray);
                        });
                    } else {
                        if ($rootScope.tableFormat != "hour") {
                            if ($rootScope.tableFormat == "week") {
                                data.forEach(function (item, i) {
                                    item.period = util.getYearWeekState(item.period);
                                });

                                cabk(data);
                            } else {
                                cabk(data);
                            }
                        } else {
                            var result = [];
                            var maps = {};
                            var newData = chartUtils.getByHourByDayData(data);
                            newData.forEach(function (info, x) {
                                for (var i = 0; i < info.key.length; i++) {
                                    var infoKey = info.key[i];
                                    var obj = maps[infoKey];
                                    if (!obj) {
                                        obj = {};
                                        var dataString = (infoKey.toString()
                                            .length >= 2 ? "" : "0");
                                        obj["period"] = dataString + infoKey + ":00 - " + dataString + infoKey + ":59";
                                        maps[infoKey] = obj;
                                    }
                                    obj[chartUtils.convertEnglish(info.label)] = info.quota[i];
                                    maps[infoKey] = obj;
                                }
                            });
                            for (var key in maps) {
                                if (key != null) {
                                    result.push(maps[key]);
                                }
                            }
                            cabk(result);
                        }
                    }
                }).error(function (error) {
                    //console.log(error);
                });
            }
        };

        //表格数据展开项
        var griApiInfo = function (gridApi) {
            $scope.gridOpArray = angular.copy($rootScope.gridArray);
            gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
                var dataNumber;
                if (row.isExpanded && $rootScope.tableSwitch.dimen != false) {
                    if (row.entity[$rootScope.tableSwitch.latitude.field] == "搜索引擎" && $rootScope.tableSwitch.latitude.field == "rf_type")$rootScope.tableSwitch.dimen = "se";
                    if (row.entity[$rootScope.tableSwitch.latitude.field] == "外部链接" && $rootScope.tableSwitch.latitude.field == "rf_type")$rootScope.tableSwitch.dimen = "rf";
                    if ($scope.webSite == 1)$rootScope.tableSwitch.dimen =
                        "rf";
                    var returnFilter = angular.copy($rootScope.tableSwitch.tableFilter);
                    var entity = row.entity[$rootScope.tableSwitch.latitude.field];
                    var newEntity = row.entity[$rootScope.tableSwitch.latitude.field].split(",");
                    newEntity.length > 0 ? entity = newEntity[0] : "";
                    var fileteran = $rootScope.tableSwitch.tableFilter;
                    var newFileter = fileteran != undefined && fileteran != "undefined" && fileteran != null ? "," + fileteran : "";
                    newFileter = newFileter.toString().replace("[", "").replace(/]$/gi, "")
                    $rootScope.tableSwitch.tableFilter = "[{\"" + $rootScope.tableSwitch.latitude.field + "\":[\"" + getField(entity, $rootScope.tableSwitch.latitude.field) + "\"]}" + newFileter + "]";
                    //  $scope.gridApi2.expandable.collapseAllRows();

                    row.entity.subGridOptions = {
                        appScopeProvider: $scope.subGridScope,
                        showHeader: false,
                        enableHorizontalScrollbar: 0,
                        enableVerticalScrollbar: 0,
                        expandableRowHeight: 30,
                        columnDefs: $rootScope.gridArray
                    };
                    $http({
                        method: 'GET',
                        async: false,
                        url: '/api/indextable/?start=' + $rootScope.tableTimeStart + "&end=" + $rootScope.tableTimeEnd + "&indic=" + $rootScope.checkedArray + "&dimension=" + $rootScope.tableSwitch.dimen
                        + "&filerInfo=" + $rootScope.tableSwitch.tableFilter +"&popup=" + $rootScope.tableSwitch.popup + "&type=" + esType
                    }).success(function (data, status) {
                        var reg = new RegExp($rootScope.tableSwitch.dimen, "g");
                        if (data != undefined && data.length != 0) {
                            data = JSON.parse(JSON.stringify(data).replace(reg, $rootScope.tableSwitch.latitude.field));
                            dataNumber = data.length;
                        }
                        //PS：直接使用$scope.gridOpArray作为只表格的配置会出现子表格数据显示问题
                        //row.entity.subGridOptions.columnDefs = $scope.gridOpArray;
                        row.entity.subGridOptions.columnDefs = $scope.getSubColumnDefs($scope.gridOpArray);
                        row.entity.subGridOptions.data = data;
                        row.entity.subGridOptions.virtualizationThreshold = data.length;
                        if (data.length == 0) {
                            row.isExpanded = false
                        }
                        $rootScope.tableSwitch.tableFilter = returnFilter;
                    }).error(function (error) {
                        //console.log(error);
                    });
                }
            });
        };

        $scope.getSubColumnDefs = function (gridOpArray) {
            var _t_arr = [];
            for (var i = 0; i < gridOpArray.length; i++) {
                //console.log(gridOpArray[i]["name"]);
                if (gridOpArray[i]["name"] == " ") {
                    _t_arr.push({
                        name: gridOpArray[i]["name"],
                        displayName: gridOpArray[i]["displayName"],
                        field: gridOpArray[i]["field"],
                        maxWidth: gridOpArray[i]["maxWidth"],
                        cellTemplate: gridOpArray[i]["cellTemplate"]
                    });
                } else if (gridOpArray[i]["name"] == "来源类型") {
                    _t_arr.push({
                        name: gridOpArray[i]["name"],
                        displayName: gridOpArray[i]["displayName"],
                        field: gridOpArray[i]["field"],
                        maxWidth: gridOpArray[i]["maxWidth"],
                        cellTemplate: "<div class='getExternalLinks' my-data-one='{{grid.appScope.getExternalLinksCellValue(grid, row, 1)}}' my-data-two='{{grid.appScope.getExternalLinksCellValue(grid, row, 2)}}'></div>"
                    });
                } else {
                    _t_arr.push({
                        name: gridOpArray[i]["name"],
                        displayName: gridOpArray[i]["displayName"],
                        field: gridOpArray[i]["field"],
                        maxWidth: gridOpArray[i]["maxWidth"]
                    });
                }
            }
            return _t_arr;
        };

        //子表格方法通用
        $scope.subGridScope = {
            getHistoricalTrend: function (b) {
                $scope.getHistoricalTrend(b, true);
            },
            showEntryPageLink: function (row, number) {
                $scope.showEntryPageLink(row, number);
            },
            getExternalLinksCellValue: function (grid, row, number) {
                return $scope.getExternalLinksCellValue(grid, row, number);
            }
        };
        //得到数据中的url
        $scope.getDataUrlInfoa = function (grid, row, number) {
            var a = row.entity.source.split(",");
            if (number == 1) {
                return a[0];
            } else if (number == 2) {
                var url = a[1].length > 1 ? a[1].substring(0, 1) + "..." : a[1]
                return url;
            }
        };
        //数据对比分割数据
        $scope.getContrastInfo = function (grid, row, number, fieldData) {
            if (fieldData != undefined || fieldData != "undefined") {
                var a = (row.entity[fieldData] + "").split(",");
                if (number == 0) {
                    return a[0];
                } else if (number == 1) {
                    return a[1];
                } else if (number == 2) {
                    return a[2];
                } else if (number == 3) {
                    if (a[2] == 0) {
                        return "--";
                    }
                    return a[3];
                }
            }
        };
        //表格HTML展开项
        var griApihtml = function (gridApi) {
            gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
                var htmlData = new Array();
                row.entity.subGridOptions = {
                    appScopeProvider: $scope.subGridScope,
                    expandableRowHeight: 360,
                    enableHorizontalScrollbar: 1,
                    enableVerticalScrollbar: 1,
                    showHeader: false,
                    columnDefs: htmlData
                };
                var search = SEM_API_URL + "/es/real_time?tid=" + trackid + "&tt=" + row.entity.tt;
                $http({
                    method: 'GET',
                    url: search
                }).success(function (datas, status) {
                    var utimeHtml = "";
                    var vtimeHtml = "";
                    var urlHtml = "";

                    datas.record.forEach(function (vtime, i) {
                        utimeHtml = utimeHtml + "<li><span>" + (new Date(parseInt(vtime.otime)).Format("hh:mm:ss")) + "</span></li>";
                        var a = (Math.round(parseInt(vtime.vtime) / 1000));
                        vtimeHtml = vtimeHtml + "<li><span>" + (datas.record.length - 1 == i ? "--" : (parseInt(a / 60) + "\'" + (a % 60) + "\"")) + "</span></li>";
                        urlHtml = urlHtml + "<li><span><a href='" + vtime.loc + "' target='_blank'>" + vtime.loc + "</a></span></li>"
                    });

                    var lastTime = "";

                    if (datas.ct == 0) {
                        lastTime = datas.last != "首次访问" ? new Date(parseInt(datas.last)).Format("yyyy-MM-dd hh:mm:ss") : datas.last;
                    } else {
                        lastTime = datas.last != "首次访问" ? new Date(parseInt(datas.last)).Format("yyyy-MM-dd hh:mm:ss") : "--";
                    }

                    var classInfo = "windows";
                    var classbr = "firefox";
                    datas.os.indexOf("Windows") != -1 ? classInfo = "windows" : "";
                    datas.os.indexOf("mac") != -1 ? classInfo = "mac" : "";
                    datas.os.indexOf("Linux") != -1 ? classInfo = "linux" : "";
                    datas.br.indexOf("Chrome") != -1 ? classbr = "google" : "";
                    datas.br.indexOf("Firefox") != -1 ? classbr = "firefox" : "";
                    datas.br.indexOf("IE") != -1 ? classbr = "ie" : "";
                    var result = "<div class='trendbox' style='height:360px; overflow:hidden;'>" +
                        "<div class='trend_top'><div class='trend_left'><div class='left_top'><div class='trend_img'><span class='" + classInfo + "'></span></div><div class='trend_text'>" +
                        "<ul><li>操作系统：<span>" + datas.os + "</span></li><li>网络服务商：<span>" + datas.isp + "</span></li><li>屏幕分辨率：<span>" + datas.sr + "</span></li>" +
                        "<li>屏幕颜色:<span>" + datas.sc + "</span></li></ul></div></div><div class='left_under'><div class='trend_img'><span class='" + classbr + "'></span></div><div class='trend_text'>" +
                        "<ul><li>浏览器：<span>" + datas.br + "</span></li><li>Flash版本：<span>" + (datas.fl != undefined ? datas.fl : "12.5") + "</span></li><li>是否支持Cookie：<span>" + (datas.ck == '1' ? " 支持" : " 不支持" ) + "</span></li>" +
                        "<li>是否支持JAVA:<span>" + (datas.ja == "0" ? " 支持" : " 不支持") + "</span></li></ul></div></div></div><div class='trend_right'>" +
                        "<ul><li>访问类型：<span>" + (datas.ct == 0 ? " 新访客" : " 老访客") + "</span></li>" +
                        "<li>当天访问频次：<span>" + datas.vfreq + "</span></li>" +
                        "<li>上一次访问时间：<span>" + lastTime + "</span></li>" +
                        "<li>本次来路:<span>" + (datas.se == "-" || datas.se == undefined || datas.se == "" ? " 直接访问" : "<a href='" + datas.rf + "' target='_blank'>" + datas.se + "( 搜索词:" + datas.kw + ")</a>") + "</span></li>" +
                        "<li>入口页面：<span><a href='" + datas.loc + "' target='_blank'>" + datas.loc + "</a></span></li>" +
                        "<li>最后停留在:<span><a href='" + datas.record[datas.record.length - 1]["loc"] + "' target='_blank'>" + datas.record[datas.record.length - 1]["loc"] + "</a></span></li></ul>" +
                        "</div></div><div class='trendunder'><b>访问路径：</b>" +
                        "<ul><li>打开时间</li>" + utimeHtml + "</ul>" +
                        "<ul><li>停留时长</li>" + vtimeHtml + "</ul>" +
                        "<ul><li>页面地址</li>" + urlHtml + "</ul></div></div>";

                    var res = {};
                    res["name"] = "test";
                    res["field"] = "info";
                    res["cellTemplate"] = result;
                    htmlData.push(res);
                    row.entity.subGridOptions.data = [{"info": " "}];
                }).error(function (error) {
                    //console.log(error);
                });
            });
        };
        // table 历史趋势
        $scope.getHistoricalTrend = function (b, x) {
            if ($rootScope.tableSwitch.isJudge == undefined)$scope.isJudge = true;
            if ($rootScope.tableSwitch.isJudge)$rootScope.tableSwitch.tableFilter = undefined;
            var a = b.$parent.$parent.row.entity[$rootScope.tableSwitch.latitude.field];
            $rootScope.webName = "[" + a + "]";
            var s = a.split(",");
            s.length > 0 ? a = s[0] : "";
            var fileteran = $rootScope.tableSwitch.tableFilter;
            var newFileter = fileteran != undefined && fileteran != "undefined" && fileteran != null ? "," + fileteran : "";
            newFileter = newFileter.toString().replace("[", "").replace(/]$/gi, "");
            if (x) {
                var f = $rootScope.tableSwitch.dimen;
                var field = f != undefined && f != null ? $rootScope.tableSwitch.dimen : $rootScope.tableSwitch.latitude.field;
                $rootScope.tableSwitch.tableFilter = "[{\"" + field + "\":[\"" + getField(a, $rootScope.tableSwitch.latitude.field) + "\"]}" + newFileter + "]";
            } else {
                $rootScope.tableSwitch.tableFilter = "[{\"" + $rootScope.tableSwitch.latitude.field + "\":[\"" + getField(a, $rootScope.tableSwitch.latitude.field) + "\"]}" + newFileter + "]";
            }
        };
        // 对比时的底部显示
        $scope.getCourFooterData = function (a, option, number) {
            var rast = [0.0, 0.0];
            var rastString = ["", ""];
            var bhlString = "";
            var _c_field = a.col.field;
            option.forEach(function (items, x) {
                var itemSplDatas = (items.entity[a.col.field] + "").split(",");
                if (itemSplDatas[3] == "变化率") {
                    rastString[0] = itemSplDatas[1];
                    rastString[1] = itemSplDatas[2];
                    bhlString = "变化率";
                } else {
                    rast[0] += ((itemSplDatas[1] + "").replace("%", "") == "--" || (itemSplDatas[1] + "").replace("%", "") == "　" ? 0.0 : parseFloat(((itemSplDatas[1] + "").replace("%", ""))));
                    rast[1] += ((itemSplDatas[2] + "").replace("%", "") == "--" || (itemSplDatas[2] + "").replace("%", "") == "　" ? 0.0 : parseFloat(((itemSplDatas[2] + "").replace("%", ""))));
                }
            });
            var str
            if (a.renderIndex == 1) {
                str = "当页汇总";
            } else {
                str = " ";
            }
            if (a.col.field == "pv" || a.col.field == "uv" || a.col.field == "ip" || a.col.field == "vc" || a.col.field == "nuv") {
                //
            } else if (_c_field == "nuvRate" || _c_field == "outRate" ) {
                if (_c_field == "outRate") {
                    var t_a_vc = option[0] ? option[0]["entity"]["con_a_vc"] : 0;
                    var t_b_vc = option[0] ? option[0]["entity"]["con_b_vc"] : 0;
                    var t_a_svc = option[0] ? option[0]["entity"]["con_a_svc"] : 0;
                    var t_b_svc = option[0] ? option[0]["entity"]["con_b_svc"] : 0;
                    rast[0] = (t_a_svc * 100 / (t_a_vc == 0 ? 1 : t_a_vc)).toFixed(2) + "%";
                    rast[1] = (t_b_svc * 100 / (t_b_vc == 0 ? 1 : t_b_vc)).toFixed(2) + "%";
                }
                if (_c_field == "nuvRate") {
                    // 新访客比率算法。通过总的新访客数除以总的访客数
                    var t_a_uv = option[0] ? option[0]["entity"]["con_a_uv"] : 0;
                    var t_b_uv = option[0] ? option[0]["entity"]["con_b_uv"] : 0;
                    var t_a_nuv = option[0] ? option[0]["entity"]["con_a_nuv"] : 0;
                    var t_b_nuv = option[0] ? option[0]["entity"]["con_b_nuv"] : 0;
                    rast[0] = (t_a_nuv * 100 / (t_a_uv == 0 ? 1 : t_a_uv)).toFixed(2) + "%";
                    rast[1] = (t_b_nuv * 100 / (t_b_uv == 0 ? 1 : t_b_uv)).toFixed(2) + "%";
                }
            } else {
                rast[0] = (rast[0] / option.length).toFixed(2) + (a.col.field == "outRate" || a.col.field == "nuvRate" || a.col.field == "arrivedRate" ? "%" : "");
                rast[1] = (rast[1] / option.length).toFixed(2) + (a.col.field == "outRate" || a.col.field == "nuvRate" || a.col.field == "arrivedRate" ? "%" : "");
            }

            var bhl = (((parseFloat(((rast[0] + "").replace("%", ""))) - parseFloat(((rast[1] + "").replace("%", "")))) / parseFloat(((rast[1] + "").replace("%", "")))) * 100 ).toFixed(2) + "%";

            if ((bhl + "").indexOf("NaN") != -1 || (bhl + "").indexOf("Infinity") != -1) {
                bhl = "--";
            }

            $rootScope.$broadcast("LoadAdCompareDateShowFinish", a.col.field, rast[0], rast[1]);

            switch (number) {
                case 0:
                    return str;
                case 1:
                    return rastString[0] != "" ? (rastString[0] + "").indexOf("NaN") != -1 ? 0 : rastString[0] : (rast[0] + "").indexOf("NaN") != -1 ? 0 : rast[0];
                case 2:
                    return rastString[1] != "" ? (rastString[1] + "").indexOf("NaN") != -1 ? 0 : rastString[1] : (rast[1] + "").indexOf("NaN") != -1 ? 0 : rast[1];
                case 3:
                    return bhlString != "" ? bhlString : bhl;
                default :
                    return "--";
            }
        };
        $scope.getCellDisplayValueReferrer = function (grid, row, number) {
            var a = row.entity.referrer.split(",");
            if (number == 1) {
                if (a[0] == "-") {
                    a[0] = "javascript:void(0)"
                }
                return a[0];
            } else if (number == 2) {
                if (a[0] == "-") {
                    a[1] = "直接访问";
                }
                return a[1];
            }
        }
        $scope.getCellDisplayValueEntrance = function (grid, row) {
            return row.entity.referrer;
        }
        $scope.getExternalLinksCellValue = function (grid, row, number) {
            var a = row.entity.rf_type;
            if (number == 1) {
                if (a.indexOf("http://") != -1 || a.indexOf("https://") != -1) {
                    return "links";
                } else {
                    return "others";
                }
            } else if (number == 2) {
                return a;
            }
        }
        //得到表格底部数据
        $scope.getFooterData = function (a, option, number) {
            var returnData = [0, 0, 0, 0];
            var spl = 0;
            var newSpl = [0, 0, 0];
            var newitemSplData = [0, 0, 0, 0];
            if (option.length > 0) {
                option.forEach(function (item, i) {
                    var itemSplData = (item.entity[a.col.field] + "").split(",");
                    if (itemSplData.length >= 4) {
                        itemSplData.forEach(function (data, index) {
                            newitemSplData[index] += ((itemSplData[index] + "").replace("%", "") == "--" || (itemSplData[index] + "").replace("%", "") == "　" ? 0.0 : parseFloat(((itemSplData[index] + "").replace("%", ""))));
                        })
                    } else {
                        var tmp = 0;
                        if (item.entity[a.col.field] == "--") {
                            tmp = 0;
                        } else {
                            tmp = item.entity[a.col.field];
                        }
                        returnData[0] += parseFloat((tmp + "").replace("%", ""));
                        if (a.col.field == "avgTime") {
                            if (item.entity[a.col.field] != undefined && item.entity[a.col.field] != 0 && item.entity[a.col.field] != "--") {
                                spl = item.entity[a.col.field].split(":");
                                newSpl[0] += parseInt(spl[0]);
                                newSpl[1] += parseInt(spl[1]);
                                newSpl[2] += parseInt(spl[2]);
                            } else if (item.entity[a.col.field] == 0) {
                                item.entity[a.col.field] = "00:00:00"
                            }
                        }
                    }
                });
                var itemSplDataTow = (option[0].entity[a.col.field] + "").split(",");
                if (itemSplDataTow.length >= 4) {
                    if (a.col.field == "outRate") {
                        newitemSplData.forEach(function (tts, i) {
                            newitemSplData[0] = newitemSplData[0] == "0" ? "0%" : (newitemSplData[0] / option.length).toFixed(2) + "%";
                        })
                    }
                    if (a.col.field == "avgPage" || a.col.field == "click") {
                        newitemSplData[0] = newitemSplData[0] == "0" ? "0" : (newitemSplData[0] / option.length).toFixed(2);
                    }
                    returnData = newitemSplData;
                } else {
                    if ((option[0].entity[a.col.field] + "").indexOf("%") != -1 || (option[0].entity[a.col.field] + "").indexOf("(-)") != -1) {
                        returnData[0] = returnData[0] == "0" ? "0%" : (returnData[0] / option.length).toFixed(2) + "%";
                    }
                    if (a.col.field == "avgPage") {
                        var t_vc = 0;
                        var t_pv = 0;
                        option.forEach(function (_row) {
                            var _entity = _row.entity;
                            if (_entity.vc != "--") {
                                t_vc += parseInt(_entity.vc);
                            }
                            if (_entity.pv != "--") {
                                t_pv += parseInt(_entity.pv);
                            }
                        });
                        returnData[0] = (t_pv / (t_vc == 0 ? 1 : t_vc)).toFixed(2);
                    }
                    if (a.col.field == "click") {
                        var _ll = 0;
                        for (var _i = 0; _i < option.length; _i++) {
                            if (option[_i].entity.click != "--") {
                                _ll++;
                            }
                        }
                        returnData[0] = returnData[0] == "0" ? "0" : (returnData[0] / (_ll == 0 ? 1 : _ll)).toFixed(2);
                    }
                    if (a.col.field == "outRate") {
                        var t_vc = 0;
                        var t_svc = 0;
                        option.forEach(function (_row) {
                            var _entity = _row.entity;
                            if (_entity.vc && _entity.vc != "--") {
                                t_vc += parseInt(_entity.vc);
                            }
                            if (_entity.svc && _entity.svc != "--") {
                                t_svc += parseInt(_entity.svc);
                            }
                        });
                        if (t_vc == 0) {
                            returnData[0] = "--";
                        } else {
                            returnData[0] = (t_svc * 100 / t_vc).toFixed(2) + "%";
                        }
                    }
                    if (a.col.field == "nuvRate") {
                        // 新访客比率算法。通过总的新访客数除以总的访客数
                        var t_uv = 0;
                        var t_nuv = 0;
                        option.forEach(function (_row) {
                            var _entity = _row.entity;
                            if (_entity.uv && _entity.uv != "--") {
                                t_uv += parseInt(_entity.uv);
                            }
                            if (_entity.nuv && _entity.nuv != "--") {
                                t_nuv += parseInt(_entity.nuv);
                            }
                        });
                        if (t_uv == 0) {
                            returnData[0] = "--";
                        } else {
                            returnData[0] = (t_nuv * 100 / t_uv).toFixed(2) + "%";
                        }
                    }
                    if (a.col.field == "avgTime") {
                        var _ll = 0;
                        for (var _i = 0; _i < option.length; _i++) {
                            if (option[_i].entity.avgTime != "--") {
                                _ll++;
                            }
                        }
                        if (_ll == 0) {
                            _ll = 1;
                        }
                        var atime1 = parseInt(newSpl[0]) * 3600 * 1000;
                        var atime2 = parseInt(newSpl[1]) * 60 * 1000;
                        var atime3 = parseInt(newSpl[2]) * 1000;
                        _ll = _ll * 1000;
                        returnData[0] = MillisecondToDate(parseInt((atime1 + atime2 + atime3) / _ll));
                    }
                }

                if (option[0].entity.rf == "暂无数据" || option[0].entity.media == "暂无数据" || option[0].entity.cpna == "暂无数据" || option[0].entity.kwna == "暂无数据" || option[0].entity.crt == "暂无数据") {
                    returnData = ["--", "--", "--", "--"]
                }

                $rootScope.$broadcast("LoadAdDateShowFinish", a.col.field, returnData[0]);

                switch (number) {
                    case 1:
                        return returnData[0];
                    case 2:
                        return returnData[1] == 0 ? returnData[0] : returnData[1];
                    case 3:
                        return returnData[2];
                    case 4:
                        return returnData[3];
                    default :
                        return returnData[0];
                }
            }
        }
        //得到数据中的url
        $scope.getDataUrlInfo = function (grid, row, number) {
            var a = row.entity.referrer.split(",");
            if (number == 1) {
                if (a[0] == "-") {
                    a[0] = "javascript:void(0)"
                }
                return a[0];
            } else if (number == 2) {
                if (a[0] == "-") {
                    a[1] = "直接访问";
                }
                return a[1];
            }
        };
        //得到序列号
        $scope.getIndex = function (b) {
            return b.$parent.$parent.rowRenderIndex + 1
        };
        var getField = function (rr, ss) {
            switch (rr) {
                case "新访客":
                    return 0;
                case "老访客":
                    return 1;
                case "直接访问":
                    if (ss == "se" || ss == "rf") return "-"; else return 1;
                case "搜索引擎":
                    return 2;
                case "外部链接":
                    return 3;
                case "计算机端":
                    return 0;
                case "移动端":
                    return 1;
                default :
                    return rr
            }
        }
        var select = $scope.select = {};
        //数组对象用来给ng-options遍历
        select.optionsData = [{
            title: "公告"
        }, {
            title: "全部事件目标"
        }, {
            title: "完整下载"
        }, {
            title: "在线下载"
        }, {
            title: "时长目标"

        }, {
            title: "访问页数目标"
        }
        ];
        $rootScope.changeListInit = function (timeData) {
            $scope.gridOpArray = angular.copy(timeData.gridArray);
            $scope.gridOptions.columnDefs = $scope.gridOpArray;
            $http.get("api/changeList?start=" + timeData.start + "&end=" + timeData.end + "&contrastStart=" + timeData.contrastStart + "&contrastEnd=" + timeData.contrastEnd + "&filterType=" + timeData.filterType + "&type=" + $rootScope.userType).success(function (data) {
                $rootScope.changeObj = {
                    sum_pv_count: data.sum_pv,
                    contrast_sum_pv_count: data.contrast_sum_pv,
                    all_percentage: data.percentage
                };

                $scope.gridOptions.data = data.pv ? data.pv : [];
                /*if (data.percentage.substring(0, 1) == '+') {
                 $rootScope.riseCell = true;
                 } else if (data.percentage.substring(0, 1) == '-') {
                 $rootScope.descendCell = true;
                 } else {
                 $rootScope.flatCell = true;
                 }*/
                data.pv = data.pv ? data.pv : [];
                var _tempData = [];
                if (timeData.filterType == 4) {
                    _tempData = data.pv;
                } else if (timeData.filterType == 1) {
                    for (var i = 0; i < data.pv.length; i++) {
                        if (data.pv[i]["percentage"].substring(0, 1) == "+") {
                            _tempData.push(data.pv[i]);
                        }
                    }
                } else if (timeData.filterType == 2) {
                    for (var i = 0; i < data.pv.length; i++) {
                        if (data.pv[i]["percentage"].substring(0, 1) == "-") {
                            _tempData.push(data.pv[i]);
                        }
                    }
                } else if (timeData.filterType == 3) {
                    for (var i = 0; i < data.pv.length; i++) {
                        if (data.pv[i]["percentage"].substring(0, 1) != "+" && data.pv[i]["percentage"].substring(0, 1) != "-") {
                            _tempData.push(data.pv[i]);
                        }
                    }
                }

                //if (_tempData.length > 0) {
                //    for (var i = _tempData.length; i < 222; i++) {
                //        _tempData[i] = _tempData[0];
                //    }
                //}

                while (_tempData.length > 100) {
                    _tempData.pop();
                }

                //_tempData.push({
                //    pathName: "123",
                //    pv: 123,
                //    contrastPv: 23,
                //    percentage: "+100(+434.78%)"
                //})
                //
                //_tempData.push({
                //    pathName: "1weims",
                //    pv: 12,
                //    contrastPv: 2,
                //    percentage: "+10(+500%)"
                //})
                //
                //_tempData.push({
                //    pathName: "1weimsdfasdfs",
                //    pv: 42,
                //    contrastPv: 67,
                //    percentage: "-25(-37.31%)"
                //})

                $scope.gridOptions.data = _tempData;
                $scope.gridOptions.enableSorting = true;
                $scope.gridOptions.columnDefs[4].cellClass = function (grid, row, col, rowRenderIndex, colRenderIndex) {
                    if (grid.getCellValue(row, col)) {
                        if (grid.getCellValue(row, col).toString().substring(0, 1) == "+") {
                            return "riseCell";
                        } else if (grid.getCellValue(row, col).toString().substring(0, 1) == "-") {
                            return "descendCell";
                        } else {
                            return "flatCell";
                        }
                    } else {
                        return "flatCell";
                    }
                }
            });
        };

        $scope.$on('parrentData', function (d, data) {
            $scope.gridOpArray = angular.copy(data.gridArray);
            $scope.gridOptions.columnDefs = $scope.gridOpArray;
            $scope.changeListInit(data);
        });
    });
})
;
/**********************隐藏table中按钮的弹出层*******************************/
var s = 1;

function getMyButton(item) {
    var a = document.getElementsByClassName("table_win");
    theDisplay(a);
    item.nextSibling.style.display = "block";
    s = 1
}

function hiddenMyButton(item) {
    item.nextSibling.style.display = "none";
}

function theDisplay(a) {
    for (var i = 0; i < a.length; i++) {
        if (document.getElementsByClassName("table_win")[i].style.display == "block") {
            document.getElementsByClassName("table_win")[i].style.display = "none";
        }
    }
}

document.onclick = function () {
    var a = document.getElementsByClassName("table_win");
    if (a.length != 0) {
        if (s > 0) {
            theDisplay(a);
            s = 1
        }
        s++
    }
};
/*******************************************************************/
