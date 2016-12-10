var app = angular.module('uoudo.dfzz');
app.controller('tgtj_promoter',['$scope','$uibModal','$http','constant','localStorageService','$rootScope','$timeout',
    function($scope,$uibModal,$http,constant,localStorageService,$rootScope,$timeout){

        $scope.clicked = false;
        $scope.addNewPromoter = function(){
            if($scope.clicked){
                return;
            }
            $scope.clicked = true;
            var modalInstance = $uibModal.open({
                backdrop:'static',
                animation: true,
                windowClass: 'modal_addpromoter',
                templateUrl: './tpl/_dfzz/modal.addpromoter.html',
                controller: 'modal_addpromoter',
                size: 'lg'
            });
            modalInstance.result.then(function (data) {
                $scope.clicked = false;
                console.info(data);
            }, function (data) {
                console.info('模态框取消: ' + new Date());
                $scope.clicked = false;
                if(data){
                    $scope.getList();
                }
            });
        };

        ///v1/aut/promoter/list  GET   推广员列表  分页
        $scope.currentPage = 1;
        $scope.pageSize = 14;
        $scope.maxSize = 5;
        $scope.list = [];
        $scope.totalItems = 0;

        $scope.getList = function(){
            $http.get(constant.APP_HOST + '/v1/aut/promoter/list', {
                headers: {
                    'Authorization': localStorageService.get("token")
                },
                params:{
                    pageSize:$scope.pageSize,
                    pageIndex:$scope.currentPage
                }
            }).success(function(data) {
                console.log("推广用户列表");
                console.info(data);
                if (!data.errMessage) {
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

        $scope.lookEwm = function(item){
            console.log(item);
            $http.get(constant.APP_HOST + '/v1/aut/promoter/barcode?id='+item.id, {
                headers: {
                    'Authorization': localStorageService.get("token")
                }
            }).success(function(data) {
                console.log(data);
                if(!data.errMessage){
                    var modalInstance = $uibModal.open({
                        backdrop:'static',
                        animation: true,
                        windowClass: 'modal-lookewm',
                        templateUrl: './tpl/_dfzz/modal.lookewm.html?zxc',
                        controller: 'lookEwm',
                        size: 'sm',
                        resolve: {
                            promotEwm: function () {
                                return data.data;
                            }
                        }
                    });
                    modalInstance.result.then(function (data) {
                        console.log(data);
                    }, function () {
                        console.info('模态框取消: ' + new Date());
                    });
                }
            }).error(function(data){});
        };

        $scope.delPromoter = function(item){
            console.log(item);
            var confirm = {
                tit : "确认删除该推广员吗？",
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
                $http.post(constant.APP_HOST+'/v1/aut/promoter/delete',{
                    id:item.id,
                 },{
         			headers:{
         				'Authorization':localStorageService.get("token")
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




    }
]);
