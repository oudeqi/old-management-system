
var app = angular.module('uoudo.dfzz');

app.controller('sysset_goods_list',['$scope','$uibModal','FileUploader','constant','localStorageService','$sce','$http','$filter','$state','$timeout',
    function($scope,$uibModal,FileUploader,constant,localStorageService,$sce,$http,$filter,$state,$timeout){

        $scope.show=false;
        $scope.showyes=false;
        $scope.inhtml='';

        //添加新商品
        $scope.addNewGoods=function(){

        };

        $scope.keywords = "";
        $scope.search = function(e){
            if(e && e.keyCode !== 13){
                return;
            }
            $scope.pageIndex = 1;
            $scope.getList();
        };

        // 获取list
        $scope.getList=function(){
            $http.get(constant.APP_HOST+'/v1/aut/goods/set',{
                params:{
                    search:$scope.keywords,
                    pageIndex:$scope.pageIndex,
                },
                headers: {
                    'Authorization': localStorageService.get("token")
                }
            }).success(function(data){
                if(data.errMessage){

                }else{
                    $scope.list=data.data;
                    console.log($scope.list);
                }
            });
        };
        $scope.getList();

        $scope.$watch("pageIndex",function(a,b){
            $scope.getList();
        });

        // 删除
        $scope.del = function(item){
            console.log(item);
            var confirm = {
                tit : "确认删除该商品？",
                content : ""
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
                // /v1/aut/info/delete?id=1  DELETE方法
                $http.delete(constant.APP_HOST +'/v1/aut/goods/set?id='+item.id,{
                    headers: {
                        'Authorization': localStorageService.get("token")
                    }
                }).success(function(data){
                    console.log(data);
                        $scope.showyes=true;
                    if(!data.errMessage){
                        $scope.inhtml='删除成功';
                        $scope.show=true;
                        $scope.getList();
                    }else{
                        $scope.inhtml='删除失败,'+data.errMessage;
                        $scope.show=true;
                    }
                    $timeout(function() {
                        $scope.show=false;
                    }, 3000);
                }).error(function(data){
                    $scope.inhtml='网络错误';
                    $scope.show=true;
                    $timeout(function(){
                        $scope.show=false;
                    },3000);
                });
            }, function () {
                console.info('模态框取消: ' + new Date());
            });
        };
    }
]);
