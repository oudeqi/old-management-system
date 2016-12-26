
var app = angular.module('uoudo.dfzz');
app.controller('modal_pic',['$scope','$uibModalInstance','$http','localStorageService','constant','rp','$sce',
    function($scope,$uibModalInstance,$http,localStorageService,constant,rp,$sce){
        // /v1/aut/redpackage/details?id=1
        console.log(rp);
        $scope.showYes=0;
        $scope.showMax=null;
        $scope.allImg=null;
        if(rp){
            $scope.allImg=rp;
            $scope.showMax=rp.length;
        }

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
