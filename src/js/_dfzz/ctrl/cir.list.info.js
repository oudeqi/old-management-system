var app = angular.module('uoudo.dfzz');
app.controller('cir_list_info',['$scope','$uibModal','$timeout','FileUploader','constant','localStorageService','$sce','$http','$filter','$state','$stateParams',
    function($scope,$uibModal,$timeout,FileUploader,constant,localStorageService,$sce,$http,$filter,$state,$stateParams){
    	// console.log($stateParams.postitem);
    	$scope.allx=$stateParams.postitem;
    	console.log($scope.allx.createType)
    	$scope.inhtml='';
    	$scope.show=false;
    	$scope.list=null;
    	$scope.htmlc=null;

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

        $scope.newStyle={
            "background-image":"url("+$scope.allx.headIconUrl+")",
        }

        $scope.unStyle={
        	"text-decoration":"none"
        }

        $scope.htmlc = $sce.trustAsHtml($scope.allx.htmlContent);

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
