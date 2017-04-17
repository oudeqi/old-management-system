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

        $scope.changeType = function(){
            $scope.currentPage = 1;
            $scope.getList();
        };

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

        $scope.voteDel = function(item){
            console.log(item);
            var confirm = {
                tit : "确认删除吗？",
                content : "删除后将不能恢复"
            };
            var modalInstance = $uibModal.open({
                backdrop:'static',
                animation: true,
                windowClass: 'modal-confirm',
                templateUrl: './tpl/_dfzz/modal.confirm.html',
                controller: 'modal_confirm',
                size: 'sm',
                resolve: {
                    confirm: function () {
                        return confirm;
                    }
                }
            });
            $scope.hasMsg = false;
            $scope.warning = false;
            modalInstance.result.then(function () {
                // /v1/aut/info/delete?id=1  DELETE方法
                $http.get(constant.APP_HOST + '/v1/aut/vote/delete?id='+item.id, {
                    headers: {
                        'Authorization': localStorageService.get("token")
                    }
                }).success(function(data){
                    console.log(data);
                    $scope.hasMsg = true;
                    if(!data.errMessage){
                        $scope.msg = "删除成功！";
                        $scope.warning = false;
                        $scope.getList();
                    }else{
                        $scope.msg = "删除失败！";
                        $scope.warning = true;
                    }
                    $timeout(function(){
                        $scope.hasMsg = false;
                    },1000);
                }).error(function(data){
                    $scope.hasMsg = true;
                    $scope.warning = true;
                    $scope.msg = "删除失败！";
                    $timeout(function(){
                        $scope.hasMsg = false;
                    },1000);
                });
            }, function () {
                console.info('模态框取消: ' + new Date());
            });
        };

        $scope.setPosition = function(item){
            var modalInstance = $uibModal.open({
                backdrop:'static',
                animation: true,
                windowClass: 'modal-setposition',
                templateUrl: './tpl/_dfzz/modal.setvoteposition.html',
                controller: 'setPosition',
                size: 'lg',
                resolve: {
                    vote: function () {
                        return item;
                    }
                }
            });
            modalInstance.result.then(function (data) {
                console.info(data);
            }, function () {
                console.info('模态框取消: ' + new Date());
            });
        };

    }
]);

app.controller("setPosition",["$scope","vote","$uibModalInstance",
    function($scope,vote,$uibModalInstance){
        console.log(vote);
        $scope.ok = function () {
            $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }
]);
