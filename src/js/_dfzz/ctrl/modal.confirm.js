angular.module('uoudo.dfzz')
.controller('modal_confirm',['$scope','confirm','$uibModalInstance',
    function($scope,confirm,$uibModalInstance){
        $scope.tit = confirm.tit;
        $scope.content = confirm.content;
        $scope.ok = function () {
        	$uibModalInstance.close();
    	};
    	$scope.cancel = function () {
    		$uibModalInstance.dismiss();
    	};
    }
]);
