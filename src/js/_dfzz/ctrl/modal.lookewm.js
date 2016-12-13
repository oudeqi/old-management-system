angular.module('uoudo.dfzz')
.controller('lookEwm', ['$scope','$uibModalInstance','promotEwm',
    function ($scope,$uibModalInstance,promotEwm) {

        $scope.promotEwm = promotEwm;

    	$scope.ok = function () {
            $uibModalInstance.close();
    	};
    	$scope.cancel = function () {
    		$uibModalInstance.dismiss();
    	};
    }
]);
