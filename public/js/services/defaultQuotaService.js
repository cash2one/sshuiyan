/**
 * create by wei on 2015-05-19
 */
define(["../app"], function (app) {

    'use strict';

    app.service('DefaultQuotaService', ["$rootScope", "uiGridConstants", function ($rootScope, uiGridConstants) {

        var dqObj = {
            "extension": {
                "way": ["click", "cost", "pv", "uv", "avgTime", "outRate"]
            },
            "trend": {
                "today": ["pv", "uv", "ip", "outRate", "avgTime"]
            },
            "source": {
                "source": ["pv", "uv", "ip", "outRate", "avgTime"]
            },
            "page": {
                "index": ["pv", "uv", "avgTime"]
            }
        };

        var dgObj = {
            "extension": {
                "way": [
                    {name: "点击量", field: "click"},
                    {name: "消费", field: "cost"},
                    {name: "浏览量(PV)", displayName: "浏览量(PV)", field: "pv"},
                    {name: "访客数(UV)", displayName: '访客数(UV)', field: "uv"},
                    {name: "平均访问时长", field: "avgTime"},
                    {name: "跳出率", field: "outRate"}
                ]
            },
            "trend": {
                "today": [
                    {name: "浏览量(PV)", displayName: "浏览量(PV)", field: "pv"},
                    {name: "访客数(UV)", displayName: '访客数(UV)', field: "uv"},
                    {name: "访问IP", displayName: "访问IP", field: "ip"},
                    {name: "跳出率", field: "outRate"},
                    {name: "平均访问时长", field: "avgTime"}
                ]
            },
            "source": {
                "source": [
                    {name: "浏览量(PV)", displayName: "浏览量(PV)", field: "pv"},
                    {name: "访客数(UV)", displayName: '访客数(UV)', field: "uv"},
                    {name: "访问IP", displayName: "访问IP", field: "ip"},
                    {name: "跳出率", field: "outRate"},
                    {name: "平均访问时长", field: "avgTime"}
                ]
            },
            "page": {
                "index": [
                    {name: "浏览量(PV)", displayName: "浏览量(PV)", field: "pv"},
                    {name: "访客数(UV)", displayName: '访客数(UV)', field: "uv"},
                    {name: "平均访问时长", field: "avgTime"}
                ]
            }
        };

        var defaultQuotaArray = ["pv", "uv", "ip"];

        var defaultQuotaGridArray = [
            {name: "浏览量(PV)", displayName: '浏览量(PV)', filed: "pv"},
            {name: "访客数(UV)", displayName: '访客数(UV)', field: "uv"},
            {name: "访问IP", displayName: "访问IP", field: "ip"}
        ];

        function getQuotaByType(t) {
            return getQuota(t.split("_"), dqObj, 0);
        }

        function getQuota(ta, dq, index) {
            if (dq == undefined) {
                return angular.copy(defaultQuotaArray);
            }
            if (ta.length - 1 == index) {
                var temp = ta[index];
                if (dq[temp] && isArray(dq[temp])) {
                    return angular.copy(dq[temp]);
                } else {
                    return angular.copy(defaultQuotaArray);
                }
            }
            var temp = ta[index];
            return getQuota(ta, dq[temp], ++index);
        }

        function getQuotaGridByType(t) {
            return getQuotaGrid(t.split("_"), dgObj, 0);
        }

        function getQuotaGrid(ta, dg, index) {
            if (dg == undefined) {
                return angular.copy(defaultQuotaGridArray);
            }
            if (ta.length - 1 == index) {
                var temp = ta[index];
                if (dg[temp] && isArray(dg[temp])) {
                    return angular.copy(dg[temp]);
                } else {
                    return angular.copy(defaultQuotaGridArray);
                }
            }
            var temp = ta[index];
            return getQuotaGrid(ta, dg[temp], ++index);
        }

        function isArray(o) {
            return Object.prototype.toString.call(o) === '[object Array]';
        }

        //
        function changeQuotaByType(t) {
            switch (t) {
                case "extension_way" :
                {
                    $rootScope.checkedArray = ["click", "cost", "cpc", "pv", "uv", "avgPage"];
                    $rootScope.gridArray = [
                        {
                            name: "xl",
                            displayName: "",
                            cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                            maxWidth: 10
                        },
                        {
                            name: "推广方式",
                            displayName: "推广方式",
                            field: "accountName",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>"
                        },
                        {
                            name: " ",
                            cellTemplate: "<div class='table_box'><a ng-click='grid.appScope.getHistoricalTrend(this, \"history\")' target='_parent' class='table_nextbtn' title='查看历史趋势'></a></div>"
                        },
                        {
                            name: "点击量",
                            displayName: "点击量",
                            field: "click",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "消费",
                            displayName: "消费",
                            field: "cost",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "平均点击价格",
                            displayName: "平均点击价格",
                            field: "cpc",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
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
                            name: "平均访问页数",
                            displayName: "平均访问页数",
                            field: "avgPage",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                        }
                    ];
                    break;
                }
                case "extension_search" :
                {
                    $rootScope.searchCheckedArray = ["impression", "cost", "cpc", "outRate", "avgTime", "nuvRate"];
                    $rootScope.searchGridArray = [
                        {
                            name: "xl",
                            displayName: "",
                            cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                            maxWidth: 10
                        },
                        {
                            name: "计划",
                            displayName: "计划",
                            field: "campaignName",
                            cellTemplate: "<div><a href='javascript:void(0)' style='color:#0965b8;line-height:30px;margin-left: 10px' ng-click='grid.appScope.getHistoricalTrend(this)'>{{grid.appScope.getDataUrlInfo(grid, row,3)}}</a></div>"
                            , footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>"
                        },
                        {
                            name: "展现量",
                            displayName: "展现量",
                            field: "impression",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "消费",
                            displayName: "消费",
                            field: "cost",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "平均点击价格",
                            displayName: "平均点击价格",
                            field: "cpc",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "跳出率",
                            displayName: "跳出率",
                            field: "outRate",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "平均访问时长",
                            displayName: "平均访问时长",
                            field: "avgTime",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "新访客比率",
                            displayName: "新访客比率",
                            field: "nuvRate",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        }
                    ];
                    break;
                }
                case "trend_today" :
                case "trend_yesterday" :
                case "trend_month" :
                {
                    $rootScope.checkedArray = ["pv", "uv", "ip", "outRate", "avgTime"];
                    $rootScope.gridArray = [
                        {
                            name: "xl",
                            displayName: "",
                            cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                            maxWidth: 10
                        },
                        {
                            name: "日期",
                            displayName: "日期",
                            field: "period",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>"
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
                            name: "IP数",
                            displayName: "IP数",
                            field: "ip",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "跳出率",
                            displayName: "跳出率",
                            field: "outRate",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "平均访问时长",
                            displayName: "平均访问时长",
                            field: "avgTime",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                        }
                    ];
                    break;
                }
                case "source_source" :
                {
                    $rootScope.checkedArray = ["vc", "nuvRate", "ip"];
                    if ($rootScope.webSite && $rootScope.webSite == 1) {
                        var obj = {
                            name: "来源网站",
                            displayName: "来源网站",
                            field: "dm",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>"
                        }
                    } else {
                        var obj = {
                            name: "来源类型",
                            displayName: "来源类型",
                            field: "rf_type",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>"
                        }
                    }
                    $rootScope.gridArray = [
                        {
                            name: "xl",
                            displayName: "",
                            cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                            maxWidth: 10
                        },
                        obj,
                        {
                            name: " ",
                            cellTemplate: "<div class='table_box'><button onmousemove='getMyButton(this)' class='table_btn'></button><div class='table_win'><ul style='color: #45b1ec'><li><a ng-click='grid.appScope.getHistoricalTrend(this, \"history\")' target='_parent'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看来源分布</a></li><li><a href='javascript:void(0)' ng-click='grid.appScope.showEntryPageLink(row, 1)'>查看入口页链接</a></li></ul></div></div>"
                        },
                        {
                            name: "访问次数",
                            displayName: "访问次数",
                            field: "vc",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "新访客比率",
                            displayName: "新访客比率",
                            field: "nuvRate",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "IP数",
                            displayName: "IP数",
                            field: "ip",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                        }
                    ];
                    break;
                }
                case "source_searchengine" :
                {
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
                    break;
                }
                case "source_adsrfsearchengine" :
                {
                    $rootScope.checkedArray = ["pv", "uv", "ip", "outRate", "avgTime"];
                    $rootScope.gridArray = [
                        {
                            name: "xl",
                            displayName: "",
                            cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                            maxWidth: 10,
                            enableSorting: false
                        },
                        {
                            name: "来源",
                            displayName: "来源",
                            field: "rf",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
                            enableSorting: false
                        },
                        {
                            name: "浏览量(PV)",
                            displayName: "浏览量(PV)",
                            field: "pv",
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
                            name: "IP数",
                            displayName: "IP数",
                            field: "ip",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "跳出率",
                            displayName: "跳出率",
                            field: "outRate",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "平均访问时长",
                            displayName: "平均访问时长",
                            field: "avgTime",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                        }
                    ];
                    break;
                }
                case "source_adsrkeyfsearchengine" :
                {
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
                            name: "关键字",
                            displayName: "关键字",
                            field: "kwna",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
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
                    break;
                }

                case "source_adscreativefsearchengine" :
                {
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
                            name: "创意",
                            displayName: "创意",
                            field: "crt",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
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
                    break;
                }

                case "source_adsmediafsearchengine" :
                {
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
                            name: "媒介",
                            displayName: "媒介",
                            field: "media",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
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
                    break;
                }
                case "source_adsplanfsearchengine" :
                {
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
                            name: "计划",
                            displayName: "计划",
                            field: "cpna",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
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
                    break;
                }
                case "source_searchterm" :
                {
                    $rootScope.checkedArray = ["pv", "vc", "nuv", "ip"];
                    $rootScope.gridArray = [
                        {
                            name: "xl",
                            displayName: "",
                            cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                            maxWidth: 10
                        },
                        {
                            name: "搜索词",
                            displayName: "搜索词",
                            field: "kw",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>"
                        },
                        {
                            name: " ",
                            cellTemplate: "<div class='table_box'>" +
                            "<button onmousemove='getMyButton(this)' class='table_btn'></button>" +
                            "<div class='table_win'>" +
                            "<ul style='color: #45b1ec'>" +
                            "<li><a>查看相关热门搜索词</a></li>" +
                            "<li><a ng-click='grid.appScope.showSearchUrl(row)'>查看搜索来路URL</a></li>" +
                            "<li><a ng-click='grid.appScope.getHistoricalTrend(this, \"history6\")' target='_parent'>查看历史趋势</a></li>" +
                            "</ul>" +
                            "</div>" +
                            "</div>"
                        },
                        {
                            name: "浏览量(PV)",
                            displayName: "浏览量(PV)",
                            field: "pv",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "访问次数",
                            displayName: "访问次数",
                            field: "vc",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "新访客数",
                            displayName: "新访客数",
                            field: "nuv",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "IP数",
                            displayName: "IP数",
                            field: "ip",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                        }
                    ];
                    break;
                }
                case "source_externallinks" :
                {
                    $rootScope.checkedArray = ["uv", "nuv", "nuvRate"];

                    if ($rootScope.myRfDm && $rootScope.myRfDm == "dm") {
                        var obj = {name: "外部链接", displayName: "外部链接", field: "dm"};
                    } else {
                        var obj = {name: "外部链接", displayName: "外部链接", field: "rf"};
                    }

                    $rootScope.gridArray = [
                        {
                            name: "xl",
                            displayName: "",
                            cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                            maxWidth: 10
                        },
                        obj,
                        {
                            name: " ",
                            cellTemplate: "<div class='table_box'><button onmousemove='getMyButton(this)' onmouseout='hiddenMyButton(this)' class='table_nextbtn'></button><div class='table_win'><ul><li><a ng-click='grid.appScope.getHistoricalTrend(this, \"history\")' target='_parent'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看来源分布</a></li></ul></div></div>"
                        },
                        {name: "访客数(UV)", displayName: "访客数(UV)", field: "uv"},
                        {name: "新访客数", displayName: "新访客数", field: "nuv"},
                        {name: "新访客比率", displayName: "新访客比率", field: "nuvRate"},
                    ];
                    return;
                }
                case "page_indexoverview" :
                {
                    $rootScope.checkedArray = ["pv", "uv", "entrance"];
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
                            field: "loc",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>"
                        },
                        {
                            name: " ",
                            cellTemplate: "<div class='table_box'><a ng-click='grid.appScope.getHistoricalTrend(this, \"history3\")' target='_parent' class='table_nextbtn' title='查看历史趋势'></a></div>"
                        },
                        {
                            name: "浏览量(PV)",
                            displayName: "浏览量(PV)",
                            field: "pv",
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
                            name: "入口页次数",
                            displayName: "入口页次数",
                            field: "entrance",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                        }
                    ];
                    break
                }
                case "page_entrancepage" :
                {
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
                            field: "loc",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>"
                        },
                        {
                            name: " ",
                            cellTemplate: "<div class='table_box'><button onmousemove='getMyButton(this)' class='table_btn'></button><div class='table_win'>" +
                            "<ul style='color: #45b1ec'>" +
                            "<li><a ng-click='grid.appScope.getHistoricalTrend(this, \"history4\")' target='_parent' target='_blank'>查看历史趋势</a></li>" +
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
                    break;
                }
                case "default_event_conv":
                {
                    $rootScope.checkedArray = ["pv", "uv", "ip", "clickTotal", "conversions", "crate"];
                    $rootScope.gridArray = [
                        {
                            name: "xl",
                            displayName: "",
                            cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                            maxWidth: 10,
                            enableSorting: false
                        },
                        {
                            name: "事件名称",
                            displayName: "事件名称",
                            field: "eventName",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
                            maxWidth: 150
                        },
                        {
                            name: "页面URL",
                            displayName: "页面URL",
                            field: "loc",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>--</div>"
                        },
                        {
                            name: "浏览量(PV)",
                            displayName: "浏览量(PV)",
                            field: "pv",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getEventRootData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "访客数(UV)",
                            displayName: "访客数(UV)",
                            field: "uv",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getEventRootData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "IP数",
                            displayName: "IP数",
                            field: "ip",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getEventRootData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "事件点击总数",
                            displayName: "事件点击总数",
                            field: "clickTotal",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getEventRootData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "转化次数",
                            displayName: "转化次数",
                            field: "conversions",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getEventRootData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "转化率",
                            displayName: "转化率",
                            field: "crate",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getEventRootData(this,grid.getVisibleRows())}}</div>"
                        }
                    ];
                    break;
                }
                case "default_page_conv" :
                {
                    $rootScope.checkedArray = ["pv", "uv", "vc", "ip", "conversions", "crate"]
                    $rootScope.gridArray = [
                        {
                            name: "xl",
                            displayName: "",
                            cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                            maxWidth: 10,
                            enableSorting: false
                        },
                        {
                            name: "来源",
                            displayName: "来源",
                            field: "campaignName",
                            cellTemplate: "<div><a href='javascript:void(0)' style='color:#0965b8;line-height:30px' ng-click='grid.appScope.showPageSeDetail(grid.options.data,row)'>{{grid.appScope.getDataUrlInfo(grid, row,3)}}</a></div>",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
                            enableSorting: false
                        },
                        {
                            name: "浏览量(PV)",
                            displayName: "浏览量(PV)",
                            field: "pv",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>",
                            sort: {
                                direction: uiGridConstants.ASC,
                                priority: 0
                            }
                        },
                        {
                            name: "访客数(UV)",
                            displayName: "访客数(UV)",
                            field: "uv",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "访问次数",
                            displayName: "访问次数",
                            field: "vc",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "IP数",
                            displayName: "IP数",
                            field: "ip",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "转化次数",
                            displayName: "转化次数",
                            field: "conversions",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "转化率",
                            displayName: "转化率",
                            field: "crate",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        }
                    ];

                    break;
                }
                case "search_campaign" :
                {
                    $rootScope.checkedArray = ["impression", "cost", "cpc", "outRate", "avgTime", "nuvRate"]
                    $rootScope.searchGridArray = [
                        {
                            name: "xl",
                            displayName: "",
                            cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                            maxWidth: 10
                        },
                        {
                            name: "计划",
                            displayName: "计划",
                            field: "campaignName",
                            cellTemplate: "<div><a href='javascript:void(0)' style='color:#0965b8;line-height:30px;margin-left: 10px' ng-click='grid.appScope.getHistoricalTrend(this)'>{{grid.appScope.getDataUrlInfo(grid, row,3)}}</a></div>"
                            , footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>"
                        },
                        {
                            name: "展现量",
                            displayName: "展现量",
                            field: "impression",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "消费",
                            displayName: "消费",
                            field: "cost",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "平均点击价格",
                            displayName: "平均点击价格",
                            field: "cpc",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "跳出率",
                            displayName: "跳出率",
                            field: "outRate",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "平均访问时长",
                            displayName: "平均访问时长",
                            field: "avgTime",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "新访客比率",
                            displayName: "新访客比率",
                            field: "nuvRate",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        }
                    ];
                    break;
                }
                case "search_dy" :
                {
                    $rootScope.checkedArray = ["impression", "cost", "cpc", "outRate", "avgTime", "nuvRate"]
                    $rootScope.searchGridArray = [
                        {
                            name: "xl",
                            displayName: "",
                            cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                            maxWidth: 10
                        },
                        {
                            name: "单元",
                            displayName: "单元",
                            field: "adgroupName",
                            cellTemplate: "<div><a href='javascript:void(0)' style='color:#0965b8;line-height:30px;' ng-click='grid.appScope.getHistoricalTrend(this)'>{{grid.appScope.getDataUrlInfo(grid, row,1)}}</a><br/>{{grid.appScope.getDataUrlInfo(grid, row,2)}}</div>",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>"
                        },
                        {
                            name: "展现",
                            displayName: "展现",
                            field: "impression",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "消费",
                            displayName: "消费",
                            field: "cost",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "平均点击价格",
                            displayName: "平均点击价格",
                            field: "cpc",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "跳出率",
                            displayName: "跳出率",
                            field: "outRate",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "平均访问时长",
                            displayName: "平均访问时长",
                            field: "avgTime",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "新访客比率",
                            displayName: "新访客比率",
                            field: "nuvRate",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        }
                    ];
                    break
                }
                case "search_gjc" :
                {
                    $rootScope.checkedArray = ["impression", "cost", "cpc", "outRate", "avgTime", "nuvRate"]
                    $rootScope.searchGridArray = [
                        {
                            name: "xl",
                            displayName: "",
                            cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                            maxWidth: 10
                        },
                        {
                            name: "关键词",
                            displayName: "关键词",
                            field: "keywordName",
                            cellTemplate: "<div><a href='http://www.baidu.com/s?wd={{grid.appScope.getDataUrlInfo(grid, row,1)}}' target='_blank' style='color:#0965b8;line-height:30px;margin-left: 10px'>{{grid.appScope.getDataUrlInfo(grid, row,1)}}</a><br/>{{grid.appScope.getDataUrlInfo(grid, row,2)}}</div>"
                            , footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>"
                        },
                        {
                            name: "展现",
                            displayName: "展现",
                            field: "impression",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "消费",
                            displayName: "消费",
                            field: "cost",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "平均点击价格",
                            displayName: "平均点击价格",
                            field: "cpc",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "跳出率",
                            displayName: "跳出率",
                            field: "outRate",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "平均访问时长",
                            displayName: "平均访问时长",
                            field: "avgTime",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "新访客比率",
                            displayName: "新访客比率",
                            field: "nuvRate",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        }
                    ];
                    break;
                }
                case "search_cy" :
                {
                    $rootScope.checkedArray = ["impression", "cost", "cpc"]
                    $rootScope.searchGridArray = [
                        {
                            name: "xl",
                            displayName: "",
                            cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                            maxWidth: 10
                        },
                        {
                            name: "创意",
                            displayName: "创意",
                            field: "description1",
                            cellTemplate: "<div class='search_table_box'><a href='http://{{grid.appScope.getDataUrlInfo(grid, row, 6)}}' target='_blank' style='color:#0965b8;line-height:30px;'>{{grid.appScope.getDataUrlInfo(grid, row,5)}}</a><span>{{grid.appScope.getDataUrlInfo(grid, row,4)}}</span><span class='search_table_color'>{{grid.appScope.getDataUrlInfo(grid, row,6)}}</span>"
                            , footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>"
                        },
                        {
                            name: "展现",
                            displayName: "展现",
                            field: "impression",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "消费",
                            displayName: "消费",
                            field: "cost",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "平均点击价格",
                            displayName: "平均点击价格",
                            field: "cpc",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        }
                    ];
                    break;
                }
                case "search_ssc" :
                {
                    $rootScope.checkedArray = ["impression", "cost", "cpc", "outRate", "avgTime", "nuvRate"]
                    $rootScope.searchGridArray = [
                        {
                            name: "xl",
                            displayName: "",
                            cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                            maxWidth: 10
                        },
                        {
                            name: "触发关键词的搜索词",
                            displayName: "触发关键词的搜索词",
                            field: "kw",
                            cellTemplate: "<div><a href='http://www.baidu.com/s?wd={{grid.appScope.getDataUrlInfo(grid, row,1)}}' style='color:#0965b8;line-height:30px;' target='_blank'>{{grid.appScope.getDataUrlInfo(grid, row,1)}}</a><br/>{{grid.appScope.getDataUrlInfo(grid, row,2)}}</div>"
                            , footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>"
                        },
                        {
                            name: "展现",
                            displayName: "展现",
                            field: "impression",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "消费",
                            displayName: "消费",
                            field: "cost",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "平均点击价格",
                            displayName: "平均点击价格",
                            field: "cpc",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "跳出率",
                            displayName: "跳出率",
                            field: "outRate",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "平均访问时长",
                            displayName: "平均访问时长",
                            field: "avgTime",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "新访客比率",
                            displayName: "新访客比率",
                            field: "nuvRate",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        }
                    ];
                    break;
                }
                case "search_tgUrl" :
                {
                    $rootScope.checkedArray = ["impression", "cost", "cpc", "outRate", "avgTime", "nuvRate"]
                    $rootScope.searchGridArray = [
                        {
                            name: "xl",
                            displayName: "",
                            cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                            maxWidth: 10
                        },
                        {
                            name: "关键词对应的URL",
                            displayName: "关键词对应的URL",
                            field: "des_url"
                            , footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>"
                        },
                        {
                            name: "展现",
                            displayName: "展现",
                            field: "impression",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "消费",
                            displayName: "消费",
                            field: "cost",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "平均点击价格",
                            displayName: "平均点击价格",
                            field: "cpc",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "跳出率",
                            displayName: "跳出率",
                            field: "outRate",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "平均访问时长",
                            displayName: "平均访问时长",
                            field: "avgTime",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "新访客比率",
                            displayName: "新访客比率",
                            field: "nuvRate",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getSearchFooterData(this,grid.getVisibleRows())}}</div>"
                        }
                    ];
                    break;
                }

                case "provincemap" :
                {
                    //配置默认指标
                    $rootScope.checkedArray = ["pv", "uv", "outRate"];
                    $rootScope.gridArray = [
                        {
                            name: "a",
                            displayName: "",
                            cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                            maxWidth: 10,
                            enableSorting: false
                        },
                        {
                            name: "地域",
                            displayName: "地域",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
                            field: "region",
                            enableSorting: false
                        },
                        {
                            name: " ",
                            cellTemplate: "<div class='table_box'><a ng-click='grid.appScope.getHistoricalTrend(this, \"history1\")' target='_parent' class='table_nextbtn' title='查看历史趋势'></a></div>",
                            enableSorting: false
                        },
                        {
                            name: "浏览量(PV)",
                            displayName: "浏览量(PV)",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>",
                            sort: {
                                direction: uiGridConstants.DESC,
                                priority: 1
                            },
                            field: "pv"
                        },
                        {
                            name: "访客数(UV)",
                            displayName: "访客数(UV)",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>",
                            field: "uv"
                        },
                        {
                            name: "跳出率",
                            displayName: "跳出率",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>",
                            field: "outRate"
                        }
                    ];
                    break;
                }
                case "equipment" :
                {
                    //配置默认指标
                    $rootScope.checkedArray = ["pv", "uv", "ip", "outRate", "avgTime"];
                    var equipment = $rootScope.equipment.selected;
                    var obj = {
                        name: equipment.name,
                        displayName: equipment.displayName,
                        field: equipment.field,
                        footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
                        enableSorting: false
                    };
                    $rootScope.gridArray = [
                        {
                            name: "xl",
                            displayName: "",
                            cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                            maxWidth: 10,
                            enableSorting: false
                        },
                        obj,
                        {
                            name: "浏览量(PV)",
                            displayName: "浏览量(PV)",
                            field: "pv",
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
                            name: "IP数",
                            displayName: "IP数",
                            field: "ip",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>",
                            enableSorting: false
                        },
                        {
                            name: "跳出率",
                            displayName: "跳出率",
                            field: "outRate",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "平均访问时长",
                            displayName: "平均访问时长",
                            field: "avgTime",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                        }
                    ];
                    break;
                }
                case "novisitors" :
                {
                    $rootScope.checkedArray = ["vc", "uv", "outRate", "avgTime", "avgPage"];
                    $rootScope.gridArray = [
                        {
                            name: "xl",
                            displayName: "",
                            cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                            maxWidth: 10,
                            enableSorting: false
                        },
                        {
                            name: "新老访客",
                            displayName: "新老访客",
                            field: "ct",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>当页汇总</div>",
                            enableSorting: false
                        },
                        {
                            name: " ",
                            cellTemplate: "<div class='table_box'><a ng-click='grid.appScope.getHistoricalTrend(this, \"history2\")' target='_parent' class='table_nextbtn'  title='查看历史趋势'></a></div>",
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
                            name: "跳出率",
                            displayName: "跳出率",
                            field: "outRate",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "平均访问时长",
                            displayName: "平均访问时长",
                            field: "avgTime",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                        },
                        {
                            name: "平均访问页数",
                            displayName: "平均访问页数",
                            field: "avgPage",
                            footerCellTemplate: "<div class='ui-grid-cell-contents'>{{grid.appScope.getFooterData(this,grid.getVisibleRows())}}</div>"
                        }
                    ];
                    break;
                }
            }
        }

        return {
            getQuotaByType: getQuotaByType,
            getQuotaGridByType: getQuotaGridByType,
            changeQuotaByType: changeQuotaByType
        }
    }]);

});