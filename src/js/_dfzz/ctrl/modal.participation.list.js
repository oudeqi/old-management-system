var app = angular.module('uoudo.dfzz');
app.controller('participation_list',['$scope','$uibModalInstance','participationList','$http','constant','localStorageService',
    function($scope,$uibModalInstance,participationList,$http,constant,localStorageService){

    	$scope.id = participationList.gemSetId; //夺宝id
    	$scope.stage = participationList.stageNo; //当前期数
    	$scope.number = 1; //number为1代表按数量排序
    	$scope.time = 0; //time为1按时间排序
    	$scope.order = 1; //order=1倒叙0正序
    	$scope.currentPage = 1;
    	$scope.pageSize = 11;
        $scope.maxSize = 5;
        $scope.list = [];
        $scope.totalItems = 0;

        $scope.getList = function(){
            $http.get(constant.APP_HOST+'/v1/aut/gemSet/stage/buyList',{
    			headers:{
    				'Authorization':localStorageService.get('token')
    			},
    			params:{
    				id:$scope.id,
    				stage:$scope.stage,
    				number:$scope.number,
    				time:$scope.time,
    				order:$scope.order,
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

        $scope.ok = function () {
        	$uibModalInstance.close();
    	};
    	$scope.cancel = function () {
    		$uibModalInstance.dismiss();
    	};
    }
]);
