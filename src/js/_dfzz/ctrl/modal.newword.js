angular.module('uoudo.dfzz')
.controller('modal_newword',['$scope','confirm','$uibModalInstance',
    function($scope,confirm,$uibModalInstance){
        $scope.tit = confirm.tit;
        $scope.content = confirm.content;
        $scope.theKey='';
        $scope.ok = function () {
        	$uibModalInstance.close($scope.theKey);


    	};
    	$scope.cancel = function () {
    		$uibModalInstance.dismiss();
    	};
    }
]);
