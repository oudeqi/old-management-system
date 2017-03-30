var app = angular.module('uoudo.dfzz');
app.controller('vote_player_detail',['$scope','$http','constant','localStorageService','FileUploader','$uibModal','$state','$timeout','$sce','$filter',
    function($scope,$http,constant,localStorageService,FileUploader,$uibModal,$state,$timeout,$sce,$filter){

        $scope.id = $state.params.id;
        $scope.voteId = $state.params.voteId;

        $http.get(constant.APP_HOST + '/v1/aut/player', {
            headers: {
                'Authorization': localStorageService.get("token")
            },
            params:{
                id:$state.params.id,
            }
        }).success(function(res) {
            console.log("获取选手详情：",res);
            $scope.tetail = res.data;
        }).error(function(data) {

        });

        $scope.rejectionReason = "";
        $scope.throughAudit = function(status){
            $http.post(constant.APP_HOST+'/v1/aut/player/vote/status',{
                id:$scope.id,
                status:status,
                rejectionReason:$scope.rejectionReason
             },{
     			headers:{
     				'Authorization':localStorageService.get("token")
     			}
     		}).success(function(res){
                console.log("改变状态：",res);
                if(res.data){
                    location.reload();
                }
            }).error(function(err){

            });
        };

        $scope.voteBaseline = "";
        $scope.alterBaseline = function(){
            if(/^\+?(0|[1-9][0-9]*)$/.test($scope.voteBaseline)){
                $http.post(constant.APP_HOST+'/v1/aut/player/vote/base',{
                    id:$scope.id,
                    voteBaseline:$scope.voteBaseline
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
