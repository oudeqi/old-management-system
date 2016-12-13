var app = angular.module('uoudo.dfzz');
app.controller('cir_edit',['$scope','$uibModal','FileUploader','constant','localStorageService','$sce','$http','$filter','$state','$stateParams',
    function($scope,$uibModal,FileUploader,constant,localStorageService,$sce,$http,$filter,$state,$stateParams){
    	$scope.allx=$stateParams.postitem;
    	console.log('这里是cir_edit.js')
    	console.log($scope.allx);

    }
]);