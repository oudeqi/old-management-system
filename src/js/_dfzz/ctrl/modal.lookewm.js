angular.module('uoudo.dfzz')
.controller('lookEwm', ['$scope','$uibModalInstance','tg',
    function ($scope,$uibModalInstance,tg) {

        $scope.tg = tg;

    	$scope.ok = function () {
            $uibModalInstance.close($scope.imgSrc);
    	};
    	$scope.cancel = function () {
    		$uibModalInstance.dismiss();
    	};
    }
]);
