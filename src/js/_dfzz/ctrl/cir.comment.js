var app = angular.module('uoudo.dfzz');
app.controller('cir_comment',['$scope','$uibModal','FileUploader','constant','localStorageService','$sce','$http','$filter','$state','$timeout',
    function($scope,$uibModal,FileUploader,constant,localStorageService,$sce,$http,$filter,$state,$timeout){

    	$scope.date_get=null;
    	$scope.showyes=false;
    	$scope.show=false;
    	$scope.inhtml='';

    	$scope.commentAll={
    		startTime:null,
    		endTime:null,
    		search:'',
    		pageIndex:null,
    	}

    	$scope.pageIndex=1;

    	$scope.$watch("pageIndex",function(na,nv){
    		$scope.commentAll.pageIndex=na;
    		$scope.getList();
    	})

    	$scope.pageChanged=function(){
    		console.log('11')
    	}

    	$scope.$watch("date_get",function(na,nv){
    		if(na==null || na==''){
    			$scope.commentAll.startTime=null;
    			$scope.commentAll.endTime=null;
    		}
    		$scope.getList();
    	})

    	// 去评论页面
    	$scope.goListInfo=function(item){
    		$state.go("cir_list_info",{postitem:item},{reload:true});
    	}


    	// 请求评论
    	$scope.getList=function(){
    		if($scope.date_get){
                $scope.commentAll.startTime = new Date($scope.date_get + " 00:00:01").getTime();
                $scope.commentAll.endTime = new Date($scope.date_get + " 23:59:59").getTime();
            };
            		$http.get(constant.APP_HOST+'/v1/aut/all/comment',{
			    		params:$scope.commentAll,
			    		headers:{
			    			'Authorization': localStorageService.get("token")
			    		}
			    	}).success(function(data){
			    		if(data.errMessage){}else{
			    			$scope.commentContent=data.data;
			    			console.log($scope.commentContent)
			    		}

			    	})
    	}
    	$scope.getList();


        // 屏蔽评论
        $scope.shield=function(item){
        	 $http.post(constant.APP_HOST+'/v1/aut/site/group/comment/update',{
                    id:item.id,
                    isDelete:item.isDelete==0 ? 1 : 0,
                },{
                    headers:{
                    'Authorization':localStorageService.get("token")
                    },
                }).success(function(data){
                    if(data.errMessage){
                       
                    }else{
                    	if(item.isDelete==0){
                    		$scope.inhtml='评论屏蔽成功';
							
                    	}else{
                    		$scope.inhtml='评论恢复成功';
                    	}
                    	$scope.showyes=true;
    					$scope.show=true;
    					$timeout(function() {$scope.show=false}, 1500);
                        $scope.getList();
                    }
                }).error(function(data) {
                    $scope.show('网络错误');
                    // console.log('网络可能错误');
                })


        }













    }
]);