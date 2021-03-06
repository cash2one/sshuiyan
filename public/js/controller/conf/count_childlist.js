/**
 * Created by john on 2015/4/1.
 */
define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('count_childlist', function ($scope, $q, $rootScope, $cookieStore, $http, ngDialog, $state,uiGridConstants) {

        //对象-对话框
        $scope.urlDialog = null;
        //对象-记录
        $scope.entity = null;

        //操作-删除
        $scope.deleteGridData = function () {

            //后台删除
            var url = "/config/subdirectory_list?type=delete&query={\"uid\":\"" + $scope.entity.uid + "\",\"_id\":\"" + $scope.entity._id + "\"}";
            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {
                //页面删除
                $scope.gridOptions.data.splice($scope.gridOptions.data.indexOf($scope.entity), 1);
                $scope.urlDialog.close();
            });
        };


        //显示-删除对话框
        $scope.deleteDialog = function (entity) {

            $scope.entity = entity;

            $scope.urlDialog = ngDialog.open({
                template: '\
              <div class="ngdialog-buttons" ><div class="ngdialog-tilte">系统提示</div>\
                        <ul class="admin-ng-content">\
                        <li> 你确定删除这个子目录吗？</li></ul>   \
                    <div class="ng-button-div"><button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click=closeThisDialog(0)>返回</button>\
                    <button type="button" class="ngdialog-button ng-button" ng-click=deleteGridData()>确定</button></div>\
                </div>',
                className: 'ngdialog-theme-default admin_ngdialog',
                plain: true,
                scope: $scope
            });
        };
        //跳转-修改界面
        $scope.toUpdate = function (entity) {

            $state.go('childlist_update', {'id': entity._id});

        };


        //配置-表格
        $rootScope.checkArray = ["", "", ""];
        $rootScope.gridArray = [
            {
                name: "xl",
                displayName: "",
                cellTemplate: "<div class='table_xlh'>{{grid.appScope.getIndex(this)}}</div>",
                maxWidth: 5,
                enableSorting: false
            },
            {
                name: "子目录名称",
                displayName: "子目录名称",
                field: "subdirectory_url",
                cellClass: 'table_admin_color',
                enableSorting: false
            },
            {
                name: "包含的页面或目录",
                displayName: "包含的页面或目录",
                field: "analysis_url",
                cellClass: 'table_admin_color',
                enableSorting: false
            },
            {
                name: "不包含的页面或目录",
                displayName: "不包含的页面或目录",
                field: "not_analysis_url",
                cellClass: 'table_admin_color',
                enableSorting: false
            },
            {
                name: "创建时间", displayName: "创建时间", field: "create_date", cellClass: 'table_admin_color',
                sort: {
                    direction: uiGridConstants.DESC,
                    priority: 1
                }
            },
            {
                name: "x2",
                displayName: "",
                cellTemplate: "<div class='table_admin'><a href='/#index'>查看网站概览</a></div>",
                maxWidth: 150,
                enableSorting: false
            },
            {
                name: "x5",
                displayName: "",
                cellTemplate: "<div class='table_admin'><a  ng-click='grid.appScope.toUpdate(row.entity)' >修改</a></div>",
                maxWidth: 80,
                enableSorting: false
            },
            {
                name: "x6",
                displayName: "",
                cellTemplate: "<div class='table_admin'><a ng-click='grid.appScope.deleteDialog(row.entity)' >删除</a></div>",
                maxWidth: 80,
                enableSorting: false
            }
        ];
        $rootScope.tableSwitch = {
            latitude: {name: "网站域名", displayName: "网站域名", field: ""},
            tableFilter: null,
            dimen: false,
            // 0 不需要btn ，1 无展开项btn ，2 有展开项btn
            number: 0,
            //当number等于2时需要用到coding参数 用户配置弹出层的显示html 其他情况给false
            coding: false,
            //coding:"<li><a href='http://www.best-ad.cn'>查看历史趋势</a></li><li><a href='http://www.best-ad.cn'>查看入口页连接</a></li>"
            arrayClear: false //是否清空指标array
        };

        $scope.gridOptions = {
            paginationPageSize: 20,
            paginationPageSizes: [20, 50, 100],
            expandableRowTemplate: "<div ui-grid='row.entity.subGridOptions'></div>",
            expandableRowHeight: 360,
            enableColumnMenus: false,
            enablePaginationControls: true,
            enableSorting: false,
            enableGridMenu: false,
            enableHorizontalScrollbar: 0,
            onRegisterApi: function (girApi) {
                $rootScope.gridApiAdmin = girApi;
                //adminGriApihtml(girApi);
            },
            columnDefs: $rootScope.gridArray
        };


        //操作-初始化
        var refushGridData = function () {
            var uid = $cookieStore.get("uid");
            var root_url = $rootScope.siteId;
            var url = "/config/subdirectory_list?type=search&query={\"uid\":\"" + uid + "\",\"root_url\":\"" + root_url + "\"}";
            $http({
                method: 'GET',
                url: url
            }).success(function (dataConfig, status) {
                $scope.gridOptions.data = dataConfig;

            });
        };
        refushGridData();
    });
});
