var app = angular.module('uoudo.dfzz');
app.controller('finance_list',['$scope','$http','constant','localStorageService','$timeout',
    function($scope,$http,constant,localStorageService,$timeout){

        $scope.currentPage = 1;
        $scope.pageSize = 17;
        $scope.maxSize = 5;
        $scope.list = [];
        $scope.totalItems = 0;

        $scope.getList = function(){
            $http.get(constant.APP_HOST + '/v1/aut/day/report/list', {
                headers: {
                    'Authorization': localStorageService.get("token")
                },
                params:{
                    pageSize:$scope.pageSize,
                    pageIndex:$scope.currentPage
                }
            }).success(function(data) {
                console.log("获取财务列表");
                console.info(data);
                if (data.errMessage) {
                    $scope.list = null;
                } else {
                    $scope.list = data.data.data;
                    $scope.totalItems = data.data.rowCount;
                    $scope.currentPage = data.data.pageIndex;
                }
            }).error(function(data) {

            });
        };
        $scope.getList();

        $scope.pageChanged = function(){
            console.log("page to "+$scope.currentPage);
            $scope.getList();
        };
        $scope.setPage = function (e) {
            if(e.keyCode === 13 && $scope.currentPage !== $scope.pageTo){
                $scope.currentPage = $scope.pageTo;
                console.log("page to "+$scope.currentPage);
                $scope.getList();
                $scope.pageTo = null;
            }
        };

        $scope.downloadSucc = false;
        $scope.hasMsg = false;
        Downloadify.create('downloadify_finance',{
    		filename: function(){
    			return "财务列表_"+new Date().getTime()+".xls";
    		},
    		data: function(){
    			return document.getElementById('download_finance_list').innerHTML;
    		},
    		onComplete: function(){
                $scope.$apply(function(){
                    $scope.msg = "导出成功！";
                    $scope.hasMsg = true;
                });
                $timeout(function(){
                    $scope.hasMsg = false;
                },1500);
            },
    		onCancel: function(){

            },
    		onError: function(){
                $scope.$apply(function(){
                    $scope.msg = "导出失败！";
                    $scope.hasMsg = true;
                });
                $timeout(function(){
                    $scope.hasMsg = false;
                },1500);
            },
    		swf: 'media/downloadify.swf',
    		downloadImage: 'img/download_xls.png',
    		width: 140,
    		height: 38,
    		transparent: true,
    		append: false
    	});


        $scope.downloadCurrentPage = 1;
        $scope.downloadPageSize = 1000;
        $scope.downloadList = [];
        $http.get(constant.APP_HOST + '/v1/aut/day/report/list', {
            headers: {
                'Authorization': localStorageService.get("token")
            },
            params:{
                pageSize:$scope.downloadPageSize,
                pageIndex:$scope.downloadCurrentPage
            }
        }).success(function(data) {
            console.log("获取财务下载列表");
            console.info(data);
            if (data.errMessage) {
                $scope.downloadList = [];
            } else {
                $scope.downloadList = data.data.data;
            }
        }).error(function(data) {
            $scope.downloadList = [];
        });






    }
]);
