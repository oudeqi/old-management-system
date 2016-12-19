var app = angular.module('uoudo.dfzz');
app.controller('cir_dynameic',['$scope','$uibModal','FileUploader','constant','localStorageService','$sce','$http','$filter','$state',
    function($scope,$uibModal,FileUploader,constant,localStorageService,$sce,$http,$filter,$state){

    	$scope.showyes=false;
    	$scope.show=false;
    	$scope.inhtml='';

    	// 站点分类
    	$http.get(constant.APP_HOST+'v1/aut/all/site',{
    		headers: {
                        'Authorization': localStorageService.get("token")
                    }
    	}).success(function(data){
    		console.log(data);
    		// 2062 1275 725
    	})


    }
]);