/**
 * Created by john on 2015/4/3.
 */
app.controller('Trend_yesterday_ctrl', function ($scope, $rootScope, $http, requestService, areaService, messageService) {
    $scope.yesterdayClass = true;
    $scope.dt = new Date();
    $scope.reset = function () {
        $scope.todayClass = false;
        $scope.yesterdayClass = false;
        $scope.sevenDayClass = false;
        $scope.monthClass = false;
        $scope.definClass = false;
    };
    $scope.onLegendClickListener = function (radio, chartObj, chartConfig, checkedVal) {
        $scope.charts[0].types = checkedVal;
        var chartarray = [$scope.charts[0]];
        requestService.refresh(chartarray);
    }
    $scope.charts = [
        {
            config: {
                legendId: "yesterday_charts_legend",
                legendAllowCheckCount: 2,
                legendClickListener: $scope.onLegendClickListener,
                legendData: ["浏览量(PV)", "访客数(UV)", "访问次数", "新访客数", "新访客比率", "IP数", "跳出率", "平均访问时长", "平均访问页数", "转化次数", "转化率"],//显示几种数据
                id: "yesterday_charts",
                bGap: false,//首行缩进
                chartType: "line",//图表类型
                dataKey: "time",//传入数据的key值
                dataValue: "value"//传入数据的value值

            },
            types: ["pv"],
            quota: [],
            interval: $rootScope.interval,
            url: "/api/charts"
        }];

    $scope.init = function () {

        $scope.charts.forEach(function (e) {
            var chart = echarts.init(document.getElementById(e.config.id));
            e.config.instance = chart;
            if (e.config.legendData.length > 0) {
                util.renderLegend(chart, e.config);
            }
        })
        //requestService.initCharts($scope.charts);
        requestService.refresh($scope.charts);
    }
    $scope.init();
    $scope.today = function () {
        $scope.reset();
        $scope.todayClass = true;
        $rootScope.start = today_start().getTime();
        $rootScope.end = today_end().getTime();
        $rootScope.interval = 24;
        requestService.refresh($scope.charts);
    };
    $scope.yesterday = function () {
        $scope.reset();
        $scope.yesterdayClass = true;
        $rootScope.start = yesterday_start().getTime();
        $rootScope.end = yesterday_end().getTime();
        $rootScope.interval = 24;
        requestService.refresh($scope.charts);

    };
    $scope.sevenDay = function () {
        $scope.reset();
        $scope.sevenDayClass = true;
        $rootScope.start = lastWeek_start().getTime();
        $rootScope.start = today_end().getTime();
        $rootScope.interval = 7;
        requestService.refresh($scope.charts);


    };
    $scope.month = function () {
        $scope.reset();
        $scope.monthClass = true;
        $rootScope.start = lastMonth_start().getTime();
        $rootScope.end = today_end().getTime();
        $rootScope.interval = 30;
        requestService.refresh($scope.charts);
    };
    $scope.open = function ($event) {
        $scope.reset();
        $scope.definClass = true;
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
    };
    $scope.checkopen = function ($event) {
        $scope.reset();
        $scope.definClass = true;
        $event.preventDefault();
        $event.stopPropagation();
        $scope.opens = true;
    };
    // initialize
 /*   $scope.yesterday();*/
    //$scope.initMap();

})
app.controller('todaydefine', function ($scope, $http, requestService, messageService) {
    $scope.gridOptions = {
        enableScrollbars: false,
        enableGridMenu: true,
        enableHorizontalScrollbar: 0,
        enableVerticalScrollbar: 0,
        columnDefs: [
            {name: 'date', displayName: "日期"},
            {name: 'number', displayName: "访问次数"},
            {name: 'uv', displayName: "uv"},
            {name: 'ratio', displayName: "新访客比率"}
        ]
    };
    $scope.Todytable = function (type) {
        requestService.request(option, $scope.lineChartConfig);
        //requestService.request("Realtime_charts", $scope.startTime, $scope.endTime, option, $scope.lineChartConfig);
    };
})
app.controller('todayfilter', function ($scope, $http, requestService, messageService) {
    $scope.gridOptions = {
        enableScrollbars: false,
        enableGridMenu: true,
        enableHorizontalScrollbar: 0,
        enableVerticalScrollbar: 0,
        columnDefs: [
            {name: 'date', displayName: "日期"},
            {name: 'number', displayName: "访问次数"},
            {name: 'uv', displayName: "uv"},
            {name: 'ratio', displayName: "新访客比率"}
        ]
    };
    $scope.Todytable = function (type) {
        requestService.request(option, $scope.lineChartConfig);

    };
})