var app = angular.module('uoudo.dfzz');
app.controller('checkLogistics_order',['$scope','$uibModalInstance','logisticsInfo','$http','constant','localStorageService',
    function($scope,$uibModalInstance,logisticsInfo,$http,constant,localStorageService){

        if(logisticsInfo.State == "3"){
            logisticsInfo.StateName = "已签收";
        }else{
            logisticsInfo.StateName = "运输中";
        }

        $scope.logisticsInfo = logisticsInfo;
        console.log($scope.logisticsInfo);

        $scope.ok = function () {
        	$uibModalInstance.close();
    	};
    	$scope.cancel = function () {
    		$uibModalInstance.dismiss();
    	};
    }
]);
