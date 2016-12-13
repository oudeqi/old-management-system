
var app = angular.module('uoudo.dfzz');
app.controller('modal_pic',['$scope','$uibModalInstance','$http','localStorageService','constant','rp','$sce',
    function($scope,$uibModalInstance,$http,localStorageService,constant,rp,$sce){
        // /v1/aut/redpackage/details?id=1
        $scope.showYes=0;
        $scope.showMax=2;

        $scope.next=function(){
        	if($scope.showYes==$scope.showMax){
        		$scope.showYes=0;
        		return
        	}else{
        	$scope.showYes++;
        	}
        }
        $scope.left=function(){
        	if($scope.showYes==0){
        		return
        	}else{
        		$scope.showYes--;
        	}
        }
        $scope.go=function(num){
        	$scope.showYes=num;
        }

        $scope.ok = function () {
        	$uibModalInstance.close();
    	};
    	$scope.cancel = function () {
    		$uibModalInstance.dismiss();
    	};
    }
]);
