
var app = angular.module('uoudo.dfzz');

app.controller('sysset_blacklist',['$scope','$uibModal','FileUploader','constant','localStorageService','$sce','$http','$filter','$state','$timeout',
    function($scope,$uibModal,FileUploader,constant,localStorageService,$sce,$http,$filter,$state,$timeout){


        $scope.show=false;
        $scope.showyes=false;
        $scope.inhtml='';
        $scope.search=null;
        $scope.list=null;


        // add new 关键词
        $scope.addNewWord=function(){
            var confirm = {
                tit : "新增关键词",
            };
            var modalInstance = $uibModal.open({
                backdrop:'static',
                animation: true,
                windowClass: 'modal-confirm',
                templateUrl: './tpl/_dfzz/modal.newword.html',
                controller: 'modal_newword',
                size: 'sm',
                resolve: {
                    confirm: function () {
                        return confirm;
                    }
                }
            });
            modalInstance.result.then(function (data) {
                // console.log(data)
                $http.post(constant.APP_HOST+'/v1/aut/filter',{
                    value:data
                },{
                    headers:{
                        'Authorization': localStorageService.get("token")
                    }
                }).success(function(data){
                    if(data.errMessage){}else{
                        $scope.getList();
                    }
                })

            }, function () {
                console.info('模态框取消: ' + new Date());
            });
        }



        // 获取list
        $scope.getList=function(){
            $http.get(constant.APP_HOST+'/v1/aut/filter',{
                params:{
                    search:$scope.search
                },
                headers: {
                        'Authorization': localStorageService.get("token")
                }

            }).success(function(data){
                if(data.errMessage){
                }else{
                    $scope.list=data.data;
                    console.log($scope.list)
                }
            })
        }
        $scope.getList();



        // 删除
        $scope.del = function(item){

            console.log(item);
            var confirm = {
                tit : "确认删除关键词？",
                content : "删除关键词后，发布的文字将会在APP中展示给其它用户"
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
                $http.get(constant.APP_HOST +'/v1/aut/filter/delete',{
                    params:{
                        id:item.id
                    },
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


	        $scope.testx = function(item){
            var modalInstance = $uibModal.open({
                backdrop:'static',
                animation: true,
                windowClass: 'modal-showpic',
                templateUrl: './tpl/_dfzz/modal.showpic.html',
                controller: 'modal_pic',
                size: 'sm', 
                // sm,lg,md
                resolve: {
                    rp: function () {
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