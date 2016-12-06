var app = angular.module('uoudo.dfzz');
app.controller('treasure_lucky',['$scope','$http','constant','localStorageService','$uibModal','$state','$timeout','$sce','treasure_types',
    function($scope,$http,constant,localStorageService,$uibModal,$state,$timeout,$sce,treasure_types){

        $scope.status = [{
            id:0,
            name:"所有状态"
        },{
            id:1,
            name:"未领取"
        },{
            id:2,
            name:"未发货"
        },{
            id:3,
            name:"已发货"
        },{
            id:4,
            name:"已完成"
        }];
        $scope.selectedStatus = $scope.status[0];
        $http.get(constant.APP_HOST+'/v1/aut/lucky',{
    		headers:{
    			'Authorization':localStorageService.get('token')
    		}
    	}).success(function(data){
            console.log(data);
    		if(!data.errMessage){
    			$scope.report = data.data;
    		}
    	}).error(function(data){});

        $scope.keywords = "";
        $scope.currentPage = 1;
        $scope.pageSize = 10;
        $scope.maxSize = 5;
        $scope.getList = function(){
            $http.get(constant.APP_HOST+'/v1/aut/lucky/list',{
    			headers:{
    				'Authorization':localStorageService.get('token')
    			},
    			params:{
    				status:$scope.selectedStatus.id,
    				search:$scope.keywords,
    				pageIndex:$scope.currentPage,
    				pageSize:$scope.pageSize
    			}
    		}).success(function(data){
    			console.info(data);
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

        //办理发货
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
    					templateUrl: './tpl/_dfzz/modal.checklogistics.html',
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

        //查看详情
        $scope.detail = function(item){
            $http.get(constant.APP_HOST+'/v1/aut/lucky/info',{
    			headers:{
    				'Authorization':localStorageService.get("token")
    			},
    			params:{
    				id:item.gemSetId,
    				stage:item.stageNo
    			}
    		}).success(function(data){
    			if(!data.errMessage){
                    var modalInstance = $uibModal.open({
    			    	backdrop:'static',
    					animation: true,
                        windowClass: 'modal_luckyInfo',
    					templateUrl: './tpl/_dfzz/modal.luckydetail.html',
    					controller: 'luckyInfo',
    					size: 'lg',
    					resolve: {
    						luckyDetail: function () {
    							return data.data;
    						}
    					}
    			    });
    			    modalInstance.result.then(function (data) {

    			    }, function () {
    			    	console.info('模态框取消: ' + new Date());
    			    });
    			}
    		}).error(function(data){});
        };


    }
]);
