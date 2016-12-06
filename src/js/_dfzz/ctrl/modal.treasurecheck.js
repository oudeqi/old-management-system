var app = angular.module('uoudo.dfzz');
app.controller('treasure_check',['$scope','$uibModalInstance','treasureTemp','$sce',
    function($scope,$uibModalInstance,treasureTemp,$sce){
        $scope.treasureTemp = $sce.trustAsHtml(treasureTemp);
        $scope.ok = function () {
        	$uibModalInstance.close();
    	};
    	$scope.cancel = function () {
    		$uibModalInstance.dismiss();
    	};
    }
]);
