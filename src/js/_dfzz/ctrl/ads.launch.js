angular.module('uoudo.dfzz')
.controller('ads_launch',['$scope','$http','constant','localStorageService','$uibModal',
    function($scope,$http,constant,localStorageService,$uibModal){
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


    }
]);
