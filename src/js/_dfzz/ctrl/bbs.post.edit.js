var app = angular.module('uoudo.dfzz');
app.controller('bbs_post_edit',['$scope','$uibModal','$timeout','FileUploader','constant','localStorageService','$sce','$http','$filter','$state','$stateParams',
    function($scope,$uibModal,$timeout,FileUploader,constant,localStorageService,$sce,$http,$filter,$state,$stateParams){
    	// console.log($stateParams.postitem);
    	$scope.allx=$stateParams.postitem;
    	console.log($scope.allx.createType)
    	$scope.inhtml='';
    	$scope.show=false;
    	$scope.list=null;
    	$scope.htmlc=null;
        $scope.showyes=false;


            // 更改帖子
        $scope.changePost=function(item){
            $state.go("bbs_pub",{postitem:item},{reload:true});
        }

        $scope.newStyle={
            "background-image":"url("+$scope.allx.headIconUrl+")",
        }

        $scope.unStyle={
        	"text-decoration":"none"
        }
        if($scope.allx.createType==1){
        $scope.htmlc = $sce.trustAsHtml($scope.allx.htmlContent);
        }else{
        $scope.htmlc = $sce.trustAsHtml($scope.allx.content);   
        }
        // 获取评论列表
        $scope.getList=function(){
	         $http.get(constant.APP_HOST+'/v1/aut/site/group/comment',{
	        	params:{
	        		groupId:$scope.allx.id
	        	},
	    		headers:{
	                'Authorization':localStorageService.get("token")
	                },	
	        }).success(function(data){
	        	 		console.log(data)

	        	 if(data.errMessage){
		            }else{
		            	$scope.list=data.data.data;
		            	console.log($scope.list)

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
                        $scope.showyes=true;
                    	if(item.isDelete==0){
                    		$scope.inhtml='评论屏蔽成功';
							$scope.unStyle={
							"text-decoration":"line-through"
							}
                    	}else{
                    		$scope.inhtml='评论恢复成功';
                    		$scope.unStyle={
							"text-decoration":"none"
							}
                    	}
    					$scope.show=true;
    					$timeout(function() {$scope.show=false}, 1500);
                        $scope.getList();
                    }
                }).error(function(data) {
                    $scope.show('网络错误');
                    // console.log('网络可能错误');
                })

        	// $http.post(constant.APP_HOST+'/v1/aut/site/group/comment/update',
        	// 	{
        	// 	id:item.id,
        	// 	isDelte:item.isDelete==0 ? 1 : 0,
        	// 	},{
        	// 		headers:{
         //            'Authorization':localStorageService.get("token")
         //            },
        	// 	}).success(function(data){
    				 // if(data.errMessage){
			      //       }else{
			      //       	console.log('修改成功');
			      //       	$scope.getList();

			      //       }
        	// 	})
        }
        // 恢复评论
        $scope.recover=function(num){

        }


    	// $http.post(constant.APP_HOST+'')
       // $scope.noho=false;
       // $timeout(function() {
       // 	console.log('换掉class')
       // 	$scope.noho=true;
       // }, 5000);
    }
]);
