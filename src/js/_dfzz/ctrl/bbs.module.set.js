var app = angular.module('uoudo.dfzz');
app.controller('bbs_module_set',['$scope','$http','constant','localStorageService','FileUploader','$uibModal','$state','$timeout','$sce','$filter',
    function($scope,$http,constant,localStorageService,FileUploader,$uibModal,$state,$timeout,$sce,$filter){


        $scope.maxSize = 5;
        $scope.list = [];

        // //拖拽交换
        // $scope.dropComplete = function(index, obj){
        //     var idx = $scope.list.indexOf(obj);
        //     $scope.list[idx] = $scope.list[index];
        //     $scope.list[index] = obj;
        // };

        //重新排序
        $scope.dropComplete = function(index, obj){

            var idx = $scope.list.indexOf(obj);
            $scope.list.splice(idx,1);
            $scope.list.splice(index,0,obj);

            $http.post(constant.APP_HOST + '/v1/aut/group/type/order', $scope.list, {
                headers: {
                    'Authorization': localStorageService.get("token")
                }
            }).success(function(data){
                console.log(data);
                $scope.hasMsg = true;
                if(!data.errMessage){
                    $scope.msg = "排序成功！";
                    $scope.warning = false;
                    $scope.getList();
                }else{
                    $scope.msg = "排序失败！";
                    $scope.warning = true;
                    $scope.getList();
                }
                $timeout(function(){
                    $scope.hasMsg = false;
                },1000);
            }).error(function(data){
                $scope.hasMsg = true;
                $scope.warning = true;
                $scope.msg = "排序失败！";
                $timeout(function(){
                    $scope.hasMsg = false;
                    $scope.getList();
                },1000);
            });

        };

        $scope.getList = function(){
            $http.get(constant.APP_HOST + '/v1/aut/group/type', {
                headers: {
                    'Authorization': localStorageService.get("token")
                }
            }).success(function(res) {
                console.log("获取广场板块列表：",res);
                $scope.list = res.data;
            }).error(function(data) {

            });
        };
        $scope.getList();

        $scope.itemDel = function(item){
            console.log(item);
            var confirm = {
                tit : "删除该广场模块？",
                content : "删除模块将当前模块下的所有帖子标记为无模块状态，可在帖子管理重新选择模块"
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
                $http.post(constant.APP_HOST + '/v1/aut/group/type/delete', {
                    id:item.id
                }, {
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
                $scope.getList();
            });
        };


        $scope.itemModify = function(item){
            var modalInstance = $uibModal.open({
                backdrop:'static',
                animation: true,
                windowClass: 'modal-module-set',
                templateUrl: './tpl/_dfzz/modal.module.set.html',
                controller: 'modal_module_set',
                size: 'lg',
                resolve: {
                    squareItem: function () {
                        return item;
                    }
                }
            });
            modalInstance.result.then(function () {
                $scope.getList();
            }, function () {
                console.info('模态框取消: ' + new Date());
            });
        };

        $scope.itemAdd = function(){
            var modalInstance = $uibModal.open({
                backdrop:'static',
                animation: true,
                windowClass: 'modal-module-set',
                templateUrl: './tpl/_dfzz/modal.module.add.html',
                controller: 'modal_module_add',
                size: 'lg'
            });
            modalInstance.result.then(function () {
                $scope.getList();
            }, function () {
                console.info('模态框取消: ' + new Date());
                $scope.getList();
            });
        };

    }
]);

app.controller('modal_module_set',['$scope','squareItem','$uibModalInstance','$http','constant','localStorageService','$timeout',
    function($scope,squareItem,$uibModalInstance,$http,constant,localStorageService,$timeout){

        $scope.name = squareItem.name;
        $scope.status = 0;
        $scope.msg = '';
        $scope.checkName = function(){
            if(!$scope.name){
                $scope.msg = '模块名称不能为空';
                return;
            }
            if($scope.name.length>4){
                $scope.msg = '模块名称最多四个字';
                return;
            }
            $scope.msg = '';
        };
        $scope.ok = function () {
            if(!$scope.name){
                $scope.msg = '模块名称不能为空';
                return;
            }
            if($scope.name.length>4){
                $scope.msg = '模块名称最多四个字';
                return;
            }
            $scope.status = 0;
            $http.post(constant.APP_HOST + '/v1/aut/group/type/update', {
                id:squareItem.id,
                name:$scope.name
            }, {
                headers: {
                    'Authorization': localStorageService.get("token")
                }
            }).success(function(data){
                console.log(data);
                $scope.status = 1;
                $timeout(function(){
                    $uibModalInstance.close();
                },1000);
            }).error(function(data){
                $scope.status = 2;
            });
    	};
    	$scope.cancel = function () {
    		$uibModalInstance.dismiss();
    	};

    }
]);

app.controller('modal_module_add',['$scope','$uibModalInstance','$http','constant','localStorageService','$timeout',
    function($scope,$uibModalInstance,$http,constant,localStorageService,$timeout){
        $scope.name = '';
        $scope.status = 0;
        $scope.msg = '';
        $scope.checkName = function(){
            if(!$scope.name){
                $scope.msg = '模块名称不能为空';
                return;
            }
            if($scope.name.length>4){
                $scope.msg = '模块名称最多四个字';
                return;
            }
            $scope.msg = '';
        };
        $scope.ok = function () {
            if(!$scope.name){
                $scope.msg = '模块名称不能为空';
                return;
            }
            if($scope.name.length>4){
                $scope.msg = '模块名称最多四个字';
                return;
            }
            $scope.status = 0;
            $http.post(constant.APP_HOST + '/v1/aut/group/type/add', {
                name:$scope.name
            }, {
                headers: {
                    'Authorization': localStorageService.get("token")
                }
            }).success(function(data){
                console.log(data);
                $scope.status = 1;
                $timeout(function(){
                    $uibModalInstance.close();
                },1000);
            }).error(function(data){
                $scope.status = 2;
            });
    	};
    	$scope.cancel = function () {
    		$uibModalInstance.dismiss();
    	};
    }
]);
