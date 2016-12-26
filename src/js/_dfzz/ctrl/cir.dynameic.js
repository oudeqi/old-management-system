var app = angular.module('uoudo.dfzz');
app.controller('cir_dynameic',['$scope','$uibModal','FileUploader','constant','localStorageService','$sce','$http','$filter','$state','$timeout','$stateParams',
    function($scope,$uibModal,FileUploader,constant,localStorageService,$sce,$http,$filter,$state,$timeout,$stateParams){

    	$scope.perT=localStorageService.get('userInfo').permission;//权限
    	$scope.showyes=false;
    	$scope.show=false;
    	$scope.inhtml='';
    	$scope.date_get=null;

    	$scope.cirAll={
    		siteId:0,
    		startTime:null,
    		endTime:null,
    		search:null,
    		pageIndex:1,
    	}
    	$scope.cirAllContent=null;
    	$scope.sec={
    		name:'',
    		id:0
    	}

    	// 分页
    	$scope.pageIndex=1;
        $scope.$watch("pageIndex",function(nv,ov){ 
        	$scope.cirAll.pageIndex=nv;
        	$scope.getList();
        	// console.log(nv)
         });

        $scope.$watch("sec.id",function(nv,ov){
        	$scope.cirAll.siteId=nv;
        	$scope.getList();
        })
        // $scope.$watch("")

    	// $scope.pageChanged=function(pagein){
    	// 	$scope.cirAll.pageIndex=pagein;
    	// 	$scope.getList();
    	// }

    	$scope.$watch("date_get",function(na,nv){
    		if(na==null || na==''){
    			$scope.cirAll.startTime=null;
    			$scope.cirAll.endTime=null;
    		}
    		$scope.getList();
    	})


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

    	// 屏蔽恢复动态
    	$scope.shield=function(item){
    		var k;
    		if(item.isDelete==1){
    			k=0;
    			$scope.inhtml='动态恢复成功';
    		}else{
    			k=1;
    			$scope.inhtml='动态屏蔽成功';

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
    				$scope.showyes=true;
    				$scope.show=true;
    				$timeout(function() {
    					$scope.show=false;
    				}, 1500);
    				$scope.getList();
    			}
    		})
    	}



    	// 获取圈子所有动态
    	// /v1/aut/world/topic/recommend？siteId=0&startTime=&endTime=&search=
    	$scope.getList=function(){
	            if($scope.date_get){
	                $scope.cirAll.startTime = new Date($scope.date_get + " 00:00:01").getTime();
	                $scope.cirAll.endTime = new Date($scope.date_get + " 23:59:59").getTime();
	            };
    		    	$http.get(constant.APP_HOST+'/v1/aut/world/topic/recommend',{
			    		params:$scope.cirAll,
			    		headers:{
			    			'Authorization': localStorageService.get("token")
			    		}
			    	}).success(function(data){
			    		if(data.errMessage){}else{
			    			$scope.cirAllContent=data.data;
			    			console.log($scope.cirAllContent)
			    		}

			    	})
    	}
    	$scope.getList();


    	// 去评论页面
    	$scope.goListInfo=function(item){
    		$state.go("cir_list_info",{postitem:item},{reload:true});
    	}



    	// 站点分类
    	$scope.cirClass=null;
    	$http.get(constant.APP_HOST+'v1/aut/all/site',{
    		headers: {
                        'Authorization': localStorageService.get("token")
                    }
    	}).success(function(data){
    		if(data.errMessage){}else{
    			$scope.cirClass=data.data;
    			$scope.cirClass.push({
    				name:'全部站点',
    				id:0,
    			})
    			// console.log($scope.cirClass.length)
    		}
    		// console.log(data);
    		// 2062 1275 725
    	})


    }
]);
