var app = angular.module('uoudo.dfzz');
app.controller('tgtj',['$scope','$uibModal','$http','constant','localStorageService','$rootScope',
    function($scope,$uibModal,$http,constant,localStorageService,$rootScope){

        $scope.type = 0;
        $scope.putDate = null;
        $scope.keywords = "";
        $scope.currentPage = 1;
        $scope.pageSize = 12;
        $scope.maxSize = 5;
        $scope.list = [];
        $scope.totalItems = 0;

        $scope.getList = function(){
            var startTime = null,endTime = null;
            if($scope.putDate){
                startTime = new Date($scope.putDate + " 00:00:01").getTime();
                endTime = new Date($scope.putDate + " 23:59:59").getTime();
            }
            $http.get(constant.APP_HOST + '/v1/aut/extensioncenter/list', {
                headers: {
                    'Authorization': localStorageService.get("token")
                },
                params:{
                    search:$scope.keywords,
                    type:$scope.type,
                    startTime:startTime,
                    endTime:endTime,
                    pageSize:$scope.pageSize,
                    pageIndex:$scope.currentPage
                }
            }).success(function(data) {
                console.log("推广用户列表");
                console.info(data);
                if (data.errMessage) {
                    $scope.list = null;
                    $scope.report = null;
                } else {
                    // angular.forEach(data.data.data,function(item){});
                    $scope.report = data.data.extend; //顶部统计
                    $scope.list = data.data.data;//列表
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
        $scope.search = function(e){
            if(e && e.keyCode !== 13){
                return;
            }
            $scope.currentPage = 1;
            $scope.getList();
        };
        $scope.changeType = function(i){
            if(i !== $scope.type){
                $scope.type = i;
                $scope.currentPage = 1;
                $scope.getList();
            }
        };

        $scope.detail = function(item){
            // var modalInstance = $uibModal.open({
            //     backdrop:'static',
            //     animation: true,
            //     windowClass: 'modal-table',
            //     templateUrl: './tpl/_dfzz/modal.tgtjdetail.html',
            //     controller: 'tgtj_detail',
            //     size: 'lg',
            //     resolve: {
            //         tgtj: function () {
            //             return item;
            //         }
            //     }
            // });
            // modalInstance.result.then(function (data) {
            //     console.info(data);
            // }, function () {
            //     console.info('模态框取消: ' + new Date());
            // });
        };

        // 获取二维码
        // /v1/create/site/barcode?phone=18683200723
        // {
        //   "errMessage": "",
        //   "data": {
        //     "imgUrl": "http://share.uoolle.cn/userupload/795471478252792038barcode.jpg",
        //     "inviteCode": "99683"
        //   }
        // }

        $scope.lookEwm = function(){
            $http.get(constant.APP_HOST + '/v1/user/site/barcode?uid='+$rootScope.uid, {
                headers: {
                    'Authorization': localStorageService.get("token")
                }
            }).success(function(data) {
                console.log(data);
                if(data.errMessage){

                }else{
                    var modalInstance = $uibModal.open({
                        backdrop:'static',
                        animation: true,
                        windowClass: 'modal-lookewm',
                        templateUrl: './tpl/_dfzz/modal.lookewm.html',
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
            }).error(function(data) {

            });
        };





    }
]);
