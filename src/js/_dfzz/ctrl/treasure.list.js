var app = angular.module('uoudo.dfzz');
app.controller('treasure_list',['$scope','$http','constant','localStorageService','FileUploader','$uibModal','$state','$timeout','$sce','$filter','treasure_types',
    function($scope,$http,constant,localStorageService,FileUploader,$uibModal,$state,$timeout,$sce,$filter,treasure_types){

        $scope.treasurePut = function(){
            $state.go('treasure_put',{},{reload:true});
        };

        //生成夺宝所属类别
        $scope.types = [{
            id:0,
            name:"所有类别"
        }];
        $scope.type = $scope.types[0];
        treasure_types.get().success(function(data){
    		console.log(data);
    		if(!data.errMessage){
                $scope.types = data.data;
                $scope.type = $scope.types[0];
    		}
    	}).error(function(data){});

        //夺宝状态
        $scope.allStatus = [{
            id:0,
            name:"所有状态"
        },{
            id:1,
            name:"审核中"
        },{
            id:2,
            name:"进行中"
        },{
            id:3,
            name:"已结束"
        },{
            id:4,
            name:"已下线"
        }];
        $scope.status = $scope.allStatus[0];

        //获取夺宝列表
        $scope.keywords = "";
        $scope.pageSize = 5;
        $scope.currentPage = 1;
        $scope.maxSize = 5;
        $scope.startTime = "";
        $scope.endTime = "";
        $scope.totalItems = 0;
        $scope.treasureList = [];

        $scope.getTime = function(){
            var startTime,endTime;
            if($scope.startTime){
                startTime = new Date($scope.startTime + " 23:59:59").getTime() - 1000*60*60*24;
            }else{
                startTime = null;
            }
            if($scope.endTime){
                endTime = new Date($scope.endTime+" 23:59:59").getTime();
            }else{
                endTime = null;
            }
            return {
                getStartTime:function(){
                    return startTime;
                },
                getEndTime:function(){
                    return endTime;
                }
            };
        };

        //获取夺宝列表
        $scope.getList = function(){
            $http.get(constant.APP_HOST+'/v1/aut/gemSet/list',{
    			headers:{
    				'Authorization':localStorageService.get('token')
    			},
    			params:{
    				type:$scope.type.id,
    				status:$scope.status.id,
    				search:$scope.keywords,
    				pageSize:$scope.pageSize,
    				pageIndex:$scope.currentPage,
    				startTime:$scope.getTime().getStartTime(),
    				endTime:$scope.getTime().getEndTime(),
    			}
    		}).success(function(data){
                console.log(data);
                $scope.totalItems = data.data.rowCount;
                $scope.currentPage = data.data.pageIndex;
                angular.forEach(data.data.data,function(item,i){
    				if(item.status == 3){
    					item.nowStageNo = "已结束";
    					item.stageRest2 = 0;
    				}else{
    					item.stageRest2  = item.stageNumber - item.nowStageNo;
    				}
    			});
    			$scope.treasureList = data.data.data;

            }).error(function(data){

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

        $scope.treasureCheck = function(item){
            $http.get(constant.APP_HOST+'/v1/aut/gemSet/goods/info',{
    			headers:{
    				'Authorization':localStorageService.get('token')
    			},
    			params:{
    				id:item.id
    			}
    		}).success(function(data){
    			console.log(data);
                $scope.treasureTemp = data.data;
                var modalInstance = $uibModal.open({
                    backdrop:'static',
                    animation: true,
                    windowClass: 'modal-treasurecheck',
                    templateUrl: './tpl/_dfzz/modal.treasurecheck.html',
                    controller: 'treasure_check',
                    size: 'lg',
                    resolve: {
                        treasureTemp: function () {
                            return $scope.treasureTemp;
                        }
                    }
               });
               modalInstance.result.then(function (data) {

               }, function () {
                   console.info('模态框取消: ' + new Date());
               });
    		})
    		.error(function(data){});
        };



    }
]);
