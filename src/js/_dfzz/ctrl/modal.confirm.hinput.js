angular.module('uoudo.dfzz')
.controller('modal_confirm_hinput',['$scope','confirm','$uibModalInstance',
    function($scope,confirm,$uibModalInstance){
        $scope.tit = confirm.tit;
        $scope.content = confirm.content;
        $scope.show=confirm.show;
        $scope.myinput=null;
        $scope.ok = function () {
        	$uibModalInstance.close($scope.myinput);
    	};
    	$scope.cancel = function () {
    		$uibModalInstance.dismiss();
    	};
    }
]);
