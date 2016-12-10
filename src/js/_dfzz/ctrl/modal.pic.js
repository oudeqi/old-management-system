var app = angular.module('uoudo.dfzz');
app.controller('modal_pic',['$scope','$uibModalInstance','$http','localStorageService','constant','rp','$sce',
    function($scope,$uibModalInstance,$http,localStorageService,constant,rp,$sce){
        // /v1/aut/redpackage/details?id=1
     
        $scope.ok = function () {
        	$uibModalInstance.close();
    	};
    	$scope.cancel = function () {
    		$uibModalInstance.dismiss();
    	};
    }
]);
