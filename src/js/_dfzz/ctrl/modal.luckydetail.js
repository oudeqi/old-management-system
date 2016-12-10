var app = angular.module('uoudo.dfzz');
app.controller('luckyInfo',['$scope','$uibModalInstance','luckyDetail','$http','constant','localStorageService',
    function($scope,$uibModalInstance,luckyDetail,$http,constant,localStorageService){

        console.log(luckyDetail);
        $scope.luckyDetail = luckyDetail;
    	$scope.valueAShow = false;
    	$scope.valueAToggle = function(){
    		$scope.valueAShow = !$scope.valueAShow;
    	};

        $scope.ok = function () {
        	$uibModalInstance.close();
    	};
    	$scope.cancel = function () {
    		$uibModalInstance.dismiss();
    	};
    }
]);
