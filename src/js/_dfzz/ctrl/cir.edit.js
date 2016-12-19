var app = angular.module('uoudo.dfzz');
app.controller('cir_edit',['$scope','$uibModal','FileUploader','constant','localStorageService','$sce','$http','$filter','$state','$stateParams',
    function($scope,$uibModal,FileUploader,constant,localStorageService,$sce,$http,$filter,$state,$stateParams){
    	$scope.allx=$stateParams.postitem;
    	console.log('这里是cir_edit.js')
    	console.log($scope.allx);

    	$scope.showyes=false;
    	$scope.show=false;
    	$scope.inhtml='';

    	// 屏蔽动态
    	$scope.unStyle={
			"text-decoration":"line-through"
			}
    	$scope.shield=function(item){
    		var k;
    		if(item.isDelete==1){
    			k=0
    		}else{
    			k=1
    		}
    		$http.delete(constant.APP_HOST+'/v1/world/delete',{
    			params:{
    				worldId:item.worldId,
    				isDelete:k,
    			},
    			headers:{
    				 'Authorization':localStorageService.get("token")
    			}
    		}).success(function(data){
    			if(data.errMessage){}else{
    				$scope.getList();
    			}
    		})
    	}



        $scope.testx = function(item){
            var modalInstance = $uibModal.open({
                backdrop:'static',
                animation: true,
                windowClass: 'modal-showpic',
                templateUrl: './tpl/_dfzz/modal.showpic.html',
                controller: 'modal_pic',
                size: 'sm', 
                // sm,lg,md
                resolve: {
                    rp: function () {
                        return item;
                    }
                }
            });
            modalInstance.result.then(function (data) {
                console.info(data);
            }, function () {
                console.info('模态框取消: ' + new Date());
            });
        };





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