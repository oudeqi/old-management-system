var app = angular.module('uoudo.dfzz');
app.controller('cir_edit',['$scope','$uibModal','FileUploader','constant','localStorageService','$sce','$http','$filter','$state','$stateParams',
    function($scope,$uibModal,FileUploader,constant,localStorageService,$sce,$http,$filter,$state,$stateParams){
    	$scope.allx=$stateParams.postitem;
    	console.log('这里是cir_edit.js')
    	console.log($scope.allx);






    	// 加载评论数据
    	$scope.list=null;
    	$scope.pageIndex=1;
    	$scope.pageChanged=function(num){
    		$scope.pageIndex=num;
    		$scope.getList();
    	}
    	$scope.getList=function(){
    		$http.get(constant.APP_HOST+'/v1/aut/world/topic/recommend',{
    			params:{
    				id:$scope.allx.id,
    				pageIndex:$scope.pageIndex
    			},
    			 headers:{
                    'Authorization':localStorageService.get("token")
            	},  
    		}).success(function(data){
    			if(data.errMessage){}else{
    				$scope.list=data.data.data;
    				$scope.pageList=data;
    			}
    		}).error(function(data){

    		})
    	}
    	$scope.getList();

    }
]);