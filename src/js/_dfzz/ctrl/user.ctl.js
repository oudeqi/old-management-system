

var app = angular.module('uoudo.dfzz');

app.controller('user_ctl',['$scope','$uibModal','FileUploader','constant','localStorageService','$sce','$http','$filter','$state',
    function($scope,$uibModal,FileUploader,constant,localStorageService,$sce,$http,$filter,$state){

            $scope.option_list=[
                {
                    name:'全部',
                    id:0,
                },
                {
                    name:'男生',
                    id:1,
                },
                {
                    name:'女生',
                    id:2,
                }
            ]
            $scope.sec={
                name:'',
                id:0,
            }

            $scope.par={
                search:null,
                gender:0,
                type:0,
                pageIndex:1,
            }
            $scope.list=null;
            $scope.pageIndex=1;

            $scope.$watch("sec.id",function(a,b){
                $scope.par.gender=a;
                $scope.getList();
            })

            // change
            $scope.changeS=function(inx){
                $scope.par.type=inx;
                $scope.getList();
            }

            // 用户列表
            $scope.getList=function(){
                $http.get(constant.APP_HOST+'/v1/aut/user/list',{
                    params:$scope.par,
                    headers:{
                    'Authorization':localStorageService.get("token")
                    }, 
                }).success(function(data){
                    if(data.errMessage){}else{
                        $scope.list=data.data;
                        console.log($scope.list)
                    }
                })
            }
            $scope.getList();

            // 获取活跃
            $scope.allTop=null;
            $http.get(constant.APP_HOST+'/v1/aut/user/count',{
                    headers:{
                    'Authorization':localStorageService.get("token")
                    }, 
            }).success(function(data){
                if(data.errMessage){}else{
                    $scope.allTop=data.data;
                }
            })

            $scope.$watch("pageIndex",function(na,nv){
                $scope.par.pageIndex=na;
                $scope.getList();
            })



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