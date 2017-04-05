var app = angular.module('uoudo.dfzz');
app.controller('vote_detail',['$scope','$http','constant','localStorageService','FileUploader','$uibModal','$state','$timeout','$sce','$filter',
    function($scope,$http,constant,localStorageService,FileUploader,$uibModal,$state,$timeout,$sce,$filter){

        $scope.id = $state.params.id;

        $http.get(constant.APP_HOST + '/v1/aut/vote/details', {
            headers: {
                'Authorization': localStorageService.get("token")
            },
            params:{
                id:$scope.id,
            }
        }).success(function(res) {
            console.log("获取投票详情：",res);
            if(res.data && typeof res.data === "object"){
                $scope.detail = res.data;
            }
        }).error(function(data) {

        });

        $scope.pageViewBase = "";
        $scope.alterBaseline = function(){
            console.log($scope.pageViewBase);
            if(/^\+?(0|[1-9][0-9]*)$/.test($scope.pageViewBase)){
                $http.post(constant.APP_HOST+'/v1/aut/vote/view/base',{
                    id:$scope.id,
                    pageViewBase:$scope.pageViewBase
                 },{
         			headers:{
         				'Authorization':localStorageService.get("token")
         			}
         		}).success(function(res){
                    console.log("修改基数：",res);
                    if(res.data){
                        location.reload();
                    }
                }).error(function(err){

                });
            }
        };


    }
]);
