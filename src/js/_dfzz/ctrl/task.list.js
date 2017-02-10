var app = angular.module('uoudo.dfzz');
app.controller('task_list',['$scope','$http','constant','localStorageService','FileUploader','$uibModal','$state','$timeout','$sce','$filter',
    function($scope,$http,constant,localStorageService,FileUploader,$uibModal,$state,$timeout,$sce,$filter){

        $scope.allStatus = [{
            id:0,
            name:"任务状态"
        },{
            id:1,
            name:"待发布"
        },{
            id:2,
            name:"发布中"
        },{
            id:3,
            name:"已下线"
        }];
        $scope.status = $scope.allStatus[0];

        $http.get(constant.APP_HOST + '/v1/aut/taskset/List/top', {
            headers: {
                'Authorization': localStorageService.get("token")
            }
        }).success(function(data) {
            console.log(data);
            if(data.errMessage){
                $scope.report = null;
            }else{
                $scope.report = data.data;
            }
        }).error(function(data) { });

        $scope.taskPut = function(){
            // localStorageService.remove('rp.put');
            $state.go('task_put',{},{reload:true});
        };

        $scope.currentPage = 1;
        $scope.pageSize = 13;
        $scope.maxSize = 5;
        $scope.list = [];
        $scope.totalItems = 0;
        $scope.putDate = null;
        $scope.keywords = "";
        $scope.type = 0; //类型：答题6 调查1 文案3 欣赏4

        $scope.getList = function(){
            var startTime = null,endTime = null;
            if($scope.putDate){
                // startTime = $filter('date')($scope.putDate + " 00:00:01","yyyy-MM-dd HH:mm:ss");
                // endTime = $filter('date')($scope.putDate + " 23:59:59","yyyy-MM-dd HH:mm:ss");
                startTime = new Date($scope.putDate + " 00:00:01").getTime();
                endTime = new Date($scope.putDate + " 23:59:59").getTime();
            }
            $http.get(constant.APP_HOST + '/v1/aut/taskset/List', {
                headers: {
                    'Authorization': localStorageService.get("token")
                },
                params:{
                    search:$scope.keywords,
                    status:$scope.status.id,
                    type:$scope.type,
                    startTime:startTime,
                    endTime:endTime,
                    pageSize:$scope.pageSize,
                    pageIndex:$scope.currentPage
                }
            }).success(function(data) {
                console.info(data);
                if (data.errMessage) {
                    $scope.list = null;
                } else {
                    $scope.list = data.data;
                    $scope.totalItems = data.rowCount;
                    $scope.currentPage = data.pageIndex;
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

        // 删除
        $scope.delTask = function(item){
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
                // /v1/aut/redpackage/1  DELETE方法
                $http.delete(constant.APP_HOST + '/v1/aut/taskset/'+item.id, {
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

        $scope.alterTask = function(item){
            console.log(item);
            var confirm = {
                tit : "确认修改吗？",
                content : "修改后将进入待发布状态"
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
                ///v1/aut/taskset/12
                $http.get(constant.APP_HOST + '/v1/aut/taskset/'+item.id, {
                    headers: {
                        'Authorization': localStorageService.get("token")
                    }
                }).success(function(data){
                    console.log(data);
                    if(!data.errMessage){
                        localStorageService.set('task.put',data.data);
                        $state.go("task_put",{},{reload:true});
                    }
                }).error(function(data){

                });
            }, function () {
                console.info('模态框取消: ' + new Date());
            });

        };

    }
]);
