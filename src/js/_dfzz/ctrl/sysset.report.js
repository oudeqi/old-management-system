
var app = angular.module('uoudo.dfzz');

app.controller('sysset_report',['$scope','$uibModal','FileUploader','constant','localStorageService','$sce','$http','$filter','$state','$timeout',
    function($scope,$uibModal,FileUploader,constant,localStorageService,$sce,$http,$filter,$state,$timeout){


        $scope.show=false;
        $scope.showyes=false;
        $scope.inhtml='';
        $scope.search=null;
        $scope.typex=0;
        $scope.list=null;
        $scope.pageIndex=1;

// 0 全部，
// 2 任务文案
// 33 圈子动态
// 11 圈子评论
        $scope.reportx=[{
            name:"全部",
            id:0,
        },{
            name:"任务文案",
            id:2,
        },{
            name:"圈子动态",
            id:33,
        },{
            name:"圈子评论",
            id:11,
        }]

        $scope.sec={
            name:'',
            id:0
        }

        // 获取list
        $scope.getList=function(){
            $http.get(constant.APP_HOST+'/v1/aut/customer/report',{
                params:{
                    search:$scope.search,
                    type:$scope.typex,
                    pageIndex:$scope.pageIndex,
                },
                headers: {
                        'Authorization': localStorageService.get("token")
                }

            }).success(function(data){
                if(data.errMessage){
                }else{
                    $scope.list=data;
                    console.log($scope.list)
                }
            })
        }
        $scope.getList();

        $scope.$watch("pageIndex",function(a,b){
            $scope.getList();
        })

        $scope.$watch("sec.id",function(a,b){
            $scope.typex=a;
            $scope.getList();
        })

        // 删除
        $scope.del = function(item){

            console.log(item);
            var confirm = {
                tit : "确认屏蔽该用户吗？",
                content : "请注意屏蔽之后无法恢复"
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
                $http.post(constant.APP_HOST +'/v1/customer/report',{
                    id:item.id,
                },{
                headers:{
                    'Authorization':localStorageService.get("token")
                    },
                }).success(function(data){
                    console.log(data);
                        $scope.showyes=true;
                    if(!data.errMessage){
                        $scope.inhtml='屏蔽成功';
                        $scope.show=true;
                        $scope.getList();
                    }else{
                        $scope.inhtml='屏蔽失败,'+data.errMessage;
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