var app = angular.module('uoudo.dfzz');
app.controller('treasure_list_stage',['$scope','$http','constant','localStorageService','$uibModal','$state','$timeout','$sce','treasure_types','$stateParams',
    function($scope,$http,constant,localStorageService,$uibModal,$state,$timeout,$sce,treasure_types,$stateParams){

        console.log($stateParams);
        $scope.treasureId = $stateParams.treasureId;

        $scope.treasureList = function(){
            $state.go("treasure_list",{},{reload:true});
        };

        $scope.status = [{
            id:0,
            name:"所有状态"
        },{
            id:1,
            name:"待领取"
        },{
            id:2,
            name:"待发货"
        },{
            id:3,
            name:"已发货"
        },{
            id:4,
            name:"已完成"
        }];
        $scope.selectedStatus = $scope.status[0];
        $scope.keywords = "";

        //获取概况
        $http.get(constant.APP_HOST+'/v1/aut/gemSet/list/nowStage',{
    		headers:{
    			'Authorization':localStorageService.get("token")
    		},
    		params:{
    			id:$scope.treasureId
    		}
    	}).success(function(data){
            console.log(data);
    		if(!data.errMessage){
    			$scope.currStatus = data.data;
    		}
    	}).error(function(data){});


        $scope.pageSize = 12;
        $scope.currentPage = 1;
        $scope.maxSize = 5;
        $scope.totalItems = 0;
        $scope.list = [];

        //获取列表
        $scope.getList = function(){
            $http.get(constant.APP_HOST+'/v1/aut/gemSet/list/beforeStage',{
    			headers:{
    				'Authorization':localStorageService.get("token")
    			},
    			params:{
    				id:$scope.treasureId,
    				status:$scope.selectedStatus.id,
    				search:$scope.keywords,
    				pageIndex:$scope.currentPage,
    				pageSize:$scope.pageSize
    			}
    		}).success(function(data){
                console.log(data);
                if(!data.errMessage){
                    $scope.totalItems = data.data.rowCount;
                    $scope.currentPage = data.data.pageIndex;
                    $scope.list = data.data.data;
                }
            }).error(function(data){});
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

        //查看参与列表
        $scope.checkUserList = function(item){
            console.log(item);
            var modalInstance = $uibModal.open({
                backdrop:'static',
                animation: true,
                // windowClass: 'app-modal-table',
                templateUrl: './tpl/_dfzz/modal.participation.list.html',
                controller: 'participation_list',
    			size: "lg",
    			resolve: {
    				participationList: function () {
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

        //去发货
        $scope.sendGoods = function(item){
            $http.get(constant.APP_HOST+'/v1/aut/lucky/deliver',{
    			headers:{
    				'Authorization':localStorageService.get("token")
    			},
    			params:{
    				id:item.gemSetId,
    				stage:item.stageNo
    			}
    		}).success(function(data){
                console.log(data);
                item.data = data.data;
                var modalInstance = $uibModal.open({
					backdrop:'static',
					animation: true,
                    windowClass: 'modal_sendgoods',
					templateUrl: './tpl/_dfzz/modal.sendgoods.html',
					controller: 'sendGoods',
					size: "lg",
					resolve: {
						sendGoodsInfo: function () {
							return item;
						}
					}
			    });
			    modalInstance.result.then(function (data) {
			    	console.info(data);
			    }, function () {
			    	console.info('模态框取消: ' + new Date());
			    });
            }).error(function(data){});
        };

        //查看物流
        $scope.checkLogistics = function(item){
            $http.get(constant.APP_HOST+'/v1/aut/gem/view/road',{
    			headers:{
    				'Authorization':localStorageService.get("token")
    			},
    			params:{
    				id:item.gemSetId,
    				stage:item.stageNo
    			}
    		}).success(function(data){
                console.log(data);
                if(!data.errMessage){
                    data.data.id = item.gemSetId;
    				data.data.stage = item.stageNo;
                    data.data.type2 = data.data.type;
                    data.data.number2 = data.data.number;
    				var modalInstance = $uibModal.open({
    			    	backdrop:'static',
    					animation: true,
                        windowClass: 'modal_checkLogistics',
    					templateUrl: './tpl/_dfzz/modal.checklogistics.html?zxc',
    					controller: 'checkLogistics',
    					size: "lg",
    					resolve: {
    						logisticsInfo: function () {
    							return data.data;
    						}
    					}
    			    });
    			    modalInstance.result.then(function (data) {
    			    	console.info(data);
    			    }, function () {
    			    	console.info('模态框取消: ' + new Date());
    			    });
                }
            }).error(function(data){});
        };










    }
]);
