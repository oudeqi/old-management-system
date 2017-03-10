var app = angular.module('uoudo.dfzz');
app.controller('mall_order',['$scope','$http','constant','localStorageService','FileUploader','$uibModal','$state','$timeout','$sce','$filter',
    function($scope,$http,constant,localStorageService,FileUploader,$uibModal,$state,$timeout,$sce,$filter){

        $scope.currentPage = 1;
        $scope.pageSize = 13;
        $scope.maxSize = 5;
        $scope.list = [];
        $scope.totalItems = 0;
        $scope.status = "0";
        $scope.keywords = "";

        $scope.getList = function(){
            $http.get(constant.APP_HOST + '/v1/aut/pay/list', {
                headers: {
                    'Authorization': localStorageService.get("token")
                },
                params:{
                    search:$scope.keywords,
                    status:$scope.status,
                    pageSize:$scope.pageSize,
                    pageIndex:$scope.currentPage
                }
            }).success(function(data) {
                console.info(data);
                if (data.errMessage) {

                } else {
                    $scope.list = data.data.data;
                    $scope.totalItems = data.data.rowCount;
                    $scope.currentPage = data.data.pageIndex;
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

        //去发货
        $scope.sendGoods = function(item){
            $http.get(constant.APP_HOST+'/v1/aut/goods/deliver',{
    			headers:{
    				'Authorization':localStorageService.get("token")
    			},
    			params:{
    				id:item.goodsId,
    				mailType:item.stageNo,
                    mailNumber:item
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






    }
]);
