/**
 * Created by john on 2015/4/1.
 */
app.controller('TodydateCtrl', function ($scope, $http,requestService,messageService) {
    $scope.todayClass = true;
    $scope.reset = function () {
        $scope.todayClass = false;
        $scope.yesterdayClass = false;
        $scope.sevenDayClass = false;
        $scope.monthClass = false;
        $scope.definClass = false;
    };
    $scope.gridOptions = {
        enableScrollbars: false,
        enableGridMenu: true,
        enableHorizontalScrollbar: 0,
        enableVerticalScrollbar: 0,
        columnDefs: [
            {name: 'name', displayName: "日期"},
            {name: 'value', displayName: "访问次数"},
            {name: 'name', displayName: "uv"},
            {name: 'value', displayName: "新访客比率"}
        ]
    };
    $scope.lineChartConfig = {
        legendData: ["pv", "uv", "访问次数", "新访客数", "新访客比率", "IP数","跳出率","平均访问时长","平均访问页数","转化次数","转化率"],//显示几种数据
        bGap: false,//首行缩进
        chartType: "line",//图表类型
        dataKey: "time",//传入数据的key值
        dataValue: "value"//传入数据的value值
    }
    $scope.today = function () {
        $scope.reset();
        $scope.todayClass = true;
        var start = today_start(), end = today_end();
        var option = {
            type: "pv",
            chart: "line",
            interval: 24
        };
        requestService.request('index_charts', start.getTime(), end.getTime(), option);

    };
    $scope.yesterday = function () {
        $scope.reset();
        $scope.yesterdayClass = true;

    };
    $scope.sevenDay = function () {
        $scope.reset();
        $scope.sevenDayClass = true;


    };
    $scope.month = function () {
        $scope.reset();
        $scope.monthClass = true;


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
    $scope.today();
    //$scope.initMap();
});
