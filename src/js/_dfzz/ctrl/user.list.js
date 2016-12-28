var app = angular.module('uoudo.dfzz');
app.controller('user_list',['$scope','$http','constant','localStorageService','FileUploader','$uibModal','$state','$timeout','$sce','$filter',
    function($scope,$http,constant,localStorageService,FileUploader,$uibModal,$state,$timeout,$sce,$filter){

        $scope.currentPage = 1;
        $scope.pageSize = 17;
        $scope.maxSize = 5;
        $scope.list = [];
        $scope.totalItems = 0;
        $scope.keywords = "";

        $scope.getList = function(){
            $http.get(constant.APP_HOST + '/v1/aut/manage/users', {
                headers: {
                    'Authorization': localStorageService.get("token")
                },
                params:{
                    search:$scope.keywords,
                    pageSize:$scope.pageSize,
                    pageIndex:$scope.currentPage
                }
            }).success(function(data) {
                console.info(data);
                if (!!data.errMessage) {
                    $scope.list = null;
                } else {
                    $scope.list = data.data;
                    $scope.currentPage = data.pageIndex;
                    $scope.totalItems = data.rowCount;
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

        $scope.search = function(e){
            if(e && e.keyCode !== 13){
                return;
            }
            $scope.currentPage = 1;
            $scope.getList();
        };

        $scope.detail = function(id){
            var modalInstance = $uibModal.open({
                backdrop:'static',
                animation: true,
                windowClass: 'modal_userDetail',
                templateUrl: './tpl/_dfzz/modal.userdetail.html',
                controller: 'userDetail',
                size: 'lg',
                resolve: {
                    userId: function () {
                        return id;
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
