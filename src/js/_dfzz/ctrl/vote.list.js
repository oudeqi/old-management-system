var app = angular.module('uoudo.dfzz');
app.controller('vote_list',['$scope','$http','constant','localStorageService','FileUploader','$uibModal','$state','$timeout','$sce','$filter',
    function($scope,$http,constant,localStorageService,FileUploader,$uibModal,$state,$timeout,$sce,$filter){


        $scope.maxSize = 5;

        $scope.status = "0";//0全部， 1未开始 2报名中 3报名已结束
        $scope.keywords = "";
        $scope.currentPage = 1;
        $scope.pageSize = 20;
        $scope.totalItems = 0;
        $scope.list = [];

        $scope.getList = function(){
            $http.get(constant.APP_HOST + '/v1/aut/vote/list', {
                headers: {
                    'Authorization': localStorageService.get("token")
                },
                params:{
                    search:$scope.keywords,
                    status:$scope.status,
                    pageSize:$scope.pageSize,
                    pageIndex:$scope.currentPage
                }
            }).success(function(res) {
                console.log("获取投票列表：",res);
                $scope.list = res.data;
                $scope.totalItems = res.totalItems;
                $scope.currentPage = res.pageIndex;
            }).error(function(data) {

            });
        };
        $scope.getList();

        $scope.search = function(e){
            if(e && e.keyCode !== 13){
                return;
            }
            $scope.currentPage = 1;
            $scope.getList();
        };
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


    }
]);
