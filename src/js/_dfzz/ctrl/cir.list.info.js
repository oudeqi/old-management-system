var app = angular.module('uoudo.dfzz');
app.controller('cir_list_info',['$scope','$uibModal','$timeout','FileUploader','constant','localStorageService','$sce','$http','$filter','$state','$stateParams',
    function($scope,$uibModal,$timeout,FileUploader,constant,localStorageService,$sce,$http,$filter,$state,$stateParams){
    	// console.log($stateParams.postitem);
    	$scope.allx=$stateParams.postitem;
    	$scope.inhtml='';
    	$scope.show=false;
        $scope.showyes=false;
    	$scope.list=null;
        $scope.nowList=[];
    	$scope.htmlc=null;

        $scope.pageIndex=1;

        // 
        $scope.pageSize=20;
        $scope.rowCount=null;

        $scope.htmlc = $sce.trustAsHtml($scope.allx.htmlContent);

        $scope.$watch("pageIndex",function(na,nv){
            // $scope.nowList.push(a);
            if(na==1){
                $scope.nowList=$scope.list.commentList.slice(0,20);
            }else{
                $scope.nowList=$scope.list.commentList.slice(na*20-20,20*na);
            }
        })

        // 获取动态和评论列表
        $scope.getList=function(){
	         $http.get(constant.APP_HOST+'/v1/aut/world/details',{
	        	params:{
	        		worldId:$scope.allx.worldId
	        	},
	    		headers:{
	                'Authorization':localStorageService.get("token")
	                },	
	        }).success(function(data){
	        	 if(data.errMessage){
		            }else{
		            	$scope.list=data.data;
                        angular.forEach($scope.list.commentList,function(a,b){
                            if(b==20){
                                return;
                            }else{
                                $scope.nowList.push(a);
                            }
                            
                            
                        })
                        console.log($scope.nowList)
                        // list.commentList.length
                        $scope.rowCount=$scope.list.commentList.length;
                        $scope.pageCount=parseInt(($scope.list.commentList.length)/20);
                        $scope.newStyle={
                            "background-image":"url("+$scope.list.headIconUrl+")",
                        }

		            }
	        })       	
        }
        $scope.getList()


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
