/**
 * Created by Fzk lwek on 2015/6/4.
 */
define(["./module"], function (ctrs) {
    "use strict";

    ctrs.controller('adtrack_add', function ($scope, $rootScope, $http, $cookieStore, $state, ngDialog) {
        $scope.ipArea = {
            "tNum": "1",//当前个数？
            "tText": "",//内容
            "count": 1,//个数
            "helpFlag": false//是否显示帮组信息
        };
        $scope.adtrack_add =angular.copy($scope.ipArea);
        $scope.addIP = function (e, obj) {
            var f = e.currentTarget;
            var d = f.value.replace(/\r/gi, "");
            var s = d.split("\n").length;
            var num = "";
            for (var i = 0; i < s; i++) {
                num += (i + 1) + "\r\n";
            }
            obj.count = s;
            obj.tNum = num;
            obj.tText = f.value;
            $(f.previousElementSibling).scrollTop(f.scrollTop);
        };

        /**
         * 初始化 entity
         * @type {{uid: string, site_id: string, targetUrl: string, mediaPlatform: string, adTypes: string, planName: string, keywords: string, creative: string, produceUrl: string}}
         */
        $scope.adtrack_model = {
            uid: "",            //用户ID
            site_id: "",        //站点ID
            targetUrl: "",      //目标URL
            mediaPlatform: "",  //媒体平台
            adTypes: "",        //广告类型
            planName: "",       //计划名称
            keywords: "",       //关键词
            creative: "",       //创意
            produceUrl: ""      //生成的URL
        };

        /**
         * 接收页面输入的值
         * @type {{targetUrl: string, mediaPlatform: string, adTypes: string, planName: string, keywords: string, creative: string}}
         */
        $scope.adTrack = {
            targetUrl: "",
            mediaPlatform: "",
            adTypes: "",
            planName: "",
            keywords: "",
            creative: ""
        };

        /**
         * 去重
         * @returns {Array}
         */
        Array.prototype.unique = function(){
            var res = [];
            var json = {};
            for(var i = 0; i < this.length; i++){
                if(!json[this[i]]){
                    res.push(this[i]);
                    json[this[i]] = 1;
                }
            }
            return res;
        }

        /**
         * 根据 keywords 来进行回车符换行拆分
         */
        $scope.allSubmit = function(){
            var kVal = $scope.adTrack.keywords;
            var includeObj = kVal.indexOf("\\n");
            if( includeObj < -1) {
                $scope.submit();
            } else {
                var kVal2 = $scope.adTrack.keywords;
                var splArray = kVal2.split("\n").unique();  //拆分回车换行符并去重
                for (var i=0 ; i< splArray.length ; i++) {
                    var kwObj = splArray[i];
                    $scope.submit(kwObj);
                }
            }
        };

        /**
         * show URL
         */
        $scope.keywordsWrap = function(){
            $scope.str = function(kw){
                var strUrl = "";
                if($scope.adTrack.targetUrl.indexOf("?") == -1){
                    strUrl = "http://" + $scope.adTrack.targetUrl
                    + "?hmsr=" + $scope.adTrack.mediaPlatform
                    + "&hmmd=" + $scope.adTrack.adTypes
                    + "&hmpl=" + $scope.adTrack.planName
                    + "&hmkw=" + kw
                    + "&hmci=" + $scope.adTrack.creative;
                } else {
                    strUrl = "http://" + $scope.adTrack.targetUrl
                    + "&hmsr=" + $scope.adTrack.mediaPlatform
                    + "&hmmd=" + $scope.adTrack.adTypes
                    + "&hmpl=" + $scope.adTrack.planName
                    + "&hmkw=" + kw
                    + "&hmci=" + $scope.adTrack.creative;
                }

                return encodeURI(strUrl);
            }

            var kVal2 = $scope.adTrack.keywords;
            var splArray = kVal2.split("\n").unique();  //拆分回车换行符并去重
            $scope.ssssss = "";

            for (var i=0 ; i< splArray.length ; i++) {
                var kw = splArray[i];
                $scope.ssssss += $scope.str(kw) + "\n";
            }
        };

        /**
         * 返回列表
         */
        $scope.onCancel = function () {
            $state.go('adtrack');
        };

        /**
         * 继续添加
         */
        $scope.addAdTrack = function () {
            window.location.reload();
        };

        $scope.submit = function (obj) {
            var model = angular.copy($scope.adtrack_model);
            model.targetUrl = $scope.adTrack.targetUrl;
            model.mediaPlatform = $scope.adTrack.mediaPlatform;
            model.adTypes = $scope.adTrack.adTypes;
            model.planName = $scope.adTrack.planName;
            model.keywords = obj;
            model.creative = $scope.adTrack.creative;
            model.site_id = $rootScope.siteId;
            model.uid = $cookieStore.get("uid");

           //保存
            var url = "/config/adtrack?type=save&entity=" + JSON.stringify(model);
            $http({method: 'GET', url: url}).success(function (dataConfig, status) {

            });
        };

        /**
         * 清除 form 表单输入的内容
         */
        $scope.clear = function(){
            var isNoClear = confirm("您确认要清空当前填写的内容吗？");
            if(isNoClear == true){
                //document.getElementById('adTrackForm').reset();
                window.location.reload();
            } else {

            }
        };

        /**
         * 高级选项
         */
        $scope.advancedOpt = function(){
            if($scope.adTrack.mediaPlatform == null || $scope.adTrack.mediaPlatform == ""){
                document.getElementById("adTypes").disabled = "disabled";
            }else{
                document.getElementById("adTypes").disabled = "";
            }
            if($scope.adTrack.adTypes == null || $scope.adTrack.adTypes == ""){
                document.getElementById("planName").disabled = "disabled";
            }else{
                document.getElementById("planName").disabled = "";
            }
            if($scope.adTrack.planName == null || $scope.adTrack.planName == ""){
                document.getElementById("keywords").disabled = "disabled";
            }else{
                document.getElementById("keywords").disabled = "";
            }
            if($scope.adTrack.keywords == null || $scope.adTrack.keywords == ""){
                document.getElementById("creative").disabled = "disabled";
            }else{
                document.getElementById("creative   ").disabled = "";
            }
        };
        //提示
        $scope.fzk = {
            "help": false//是否显示帮组信息
        };
        $scope.targetUrlHelp = {
            "help": false//是否显示帮组信息
        };
        $scope.mediaPlatformhelp = {
            "help": false//是否显示帮组信息
        };
        $scope.addblur= function (obj) {
            obj.help=   false;
        };
        $scope.addfocus= function (obj) {
            obj.help = true;
        }
    });
});