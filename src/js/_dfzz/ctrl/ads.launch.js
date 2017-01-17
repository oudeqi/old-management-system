angular.module('uoudo.dfzz')
.controller('ads_launch',['$scope','$http','constant','localStorageService','$uibModal','$state',
    function($scope,$http,constant,localStorageService,$uibModal,$state){
        //获取启动页广告列表/v1/start/ad/list  GET

        $scope.currentPage = 1;
        $scope.pageSize = 6;
        $scope.maxSize = 5;
        $scope.list = [];
        $scope.totalItems = 0;

        $scope.getList = function(){
            $http.get(constant.APP_HOST + '/v1/start/ad/list', {
                headers: {
                    'Authorization': localStorageService.get("token")
                },
                params:{
                    pageSize:$scope.pageSize,
                    pageIndex:$scope.currentPage
                }
            }).success(function(data) {
                console.info(data);
                if (data.errMessage) {
                    $scope.list = null;
                } else {
                    //busType: 36：网页，30：文章  15：夺宝 3红包 2任务
                    angular.forEach(data.data.data,function(e,i){
                        console.log(e);
                        if(e.busType == '36'){
                            e.busTypeName = '网页';
                        }else if(e.busType == '30'){
                            e.busTypeName = '文章';
                        }else if(e.busType == '15'){
                            e.busTypeName = '夺宝';
                        }else if(e.busType == '3'){
                            e.busTypeName = '红包';
                        }else if(e.busType == '2'){
                            e.busTypeName = '任务';
                        }
                    });
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

        $scope.clicked = false;
        $scope.setLunch = function(){
            if($scope.clicked){
                return;
            }
            $scope.clicked = true;
            var modalInstance = $uibModal.open({
                backdrop:'static',
                animation: true,
                windowClass: 'modal_lunchset',
                templateUrl: './tpl/_dfzz/modal.lunchset.html',
                controller: 'modal_lunchset',
                size: 'lg'
                // ,
                // resolve: {
                //     art: function () {
                //         return item;
                //     }
                // }
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

        $scope.onLine = function(item){
            if($scope.clicked){
                return;
            }
            $scope.clicked = true;
            var confirm = {
                tit : "确认上线吗？",
                content : "上线之后启动广告将立即生效"
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
            modalInstance.result.then(function () {
                $http.post(constant.APP_HOST + '/v1/start/ad/online',{
                    id:item.id
                 }, {
                    headers: {
                        'Authorization': localStorageService.get("token")
                    }
                }).success(function(data){
                    console.log(data);
                    $scope.clicked = false;
                    if(!data.errMessage){
                        $state.go("ads_launch",{},{reload:true});
                    }
                }).error(function(data){
                    $scope.clicked = false;
                });
            }, function () {
                $scope.clicked = false;
                console.info('模态框取消: ' + new Date());
            });
        };


    }
]);
