
var app = angular.module('uoudo.dfzz');

app.controller('sysset_notification_list',['$scope','$uibModal','FileUploader','constant','localStorageService','$sce','$http','$filter','$state','$timeout',
    function($scope,$uibModal,FileUploader,constant,localStorageService,$sce,$http,$filter,$state,$timeout){

		$scope.top=null;
		$scope.list=null;

		$scope.notiType=null;
		$scope.search=null;
		$scope.begin=0;
		$scope.end=20;

	    $scope.show=false;
        $scope.showyes=false;
        $scope.inhtml='';
        $scope.golet=function(inhtml){
             $scope.inhtml=inhtml;
                $scope.showyes=true;
                $scope.show=true;
                $timeout(function() {
                        $scope.show=false;
                    }, 3000); 
        }


		$scope.this_page=1;

		$scope.nopage=function(index){
			// 0   20    1 (1-1)x20 1*20
			// 20  40    2 (2-1)x20 2*20
			// 40	60    3 (3-1)x20 3*20
			// $scope.begin=index*20;
			// $scope.end=(index+1)*20;
			$scope.begin=(index-1)*20;
			$scope.end=index*20;

		}
        $scope.$watchGroup([
            'this_page',
        ],function(na,nc){
            $scope.nopage(na[0]);
            $scope.this_page=na[0];
            $scope.getList();

        })

		$http.get(constant.APP_HOST+'/v1/aut/sysset/gettop',{
			headers:{
                    'Authorization':localStorageService.get("token")
            }, 
		}).success(function(data){
			if(data!=null){
				$scope.top=data.data[0];
			}
		})

		
		$scope.getList=function(){
			console.log($scope.search)
			$http.get(constant.APP_HOST+'/v1/aut/sysset/getallplease',{
				params:{
					notiType:$scope.notiType,
					search:$scope.search,
					begin:$scope.begin,
					end:$scope.end,
				},
				headers:{
                    'Authorization':localStorageService.get("token")
            }, 
			}).success(function(data){
				if(data.errMessage){}else{
					$scope.list=data;
					console.log($scope.list)
				}

			})
		}
		$scope.getList();

		/*设置类型选中类型*/
		$scope.get_class=function(yesx){
			if($scope.notiType==yesx){
				$scope.notiType=null;

			}else{
				$scope.notiType=yesx;
			}
			$scope.getList();
		}

		/*上线通知*/
		$scope.pubYes=function(item){
				$http.get(constant.APP_HOST+'/v1/aut/sysset/pubnoti',{
					params:{
					nid:item.id,
				},
					headers:{
                    'Authorization':localStorageService.get("token")
       				 }, 
				}).success(function(data){
						if(data.successStatus==1){
							// 成功
							$scope.golet("成功上线")
							$scope.getList();
						}
				})
		}

		/*删除通知*/
		// $scope.delYes=function(item){
		// 		$http.get(constant.APP_HOST+'/v1/aut/sysset/delnoti',{
		// 			nid:item.id,
		// 		},{
		// 			headers:{
  //                   'Authorization':localStorageService.get("token")
  //      				 }, 
		// 		}).success(function(data){
		// 				if(data.successStatus==1){
		// 					// 成功
		// 					$scope.getList();
		// 				}
		// 		})
		// }

		$scope.delYes = function(item){
            console.log(item);
            var confirm = {
                tit : "确认删除吗？",
                content : "删除后将不能恢复"
            };
            var modalInstance = $uibModal.open({
                backdrop:'static',
                animation: true,
                windowClass: 'modal-confirm',
                templateUrl: './tpl/_dfzz/modal.confirm.html',
                controller: 'modal_confirm',
                size: 'sm',
                resolve: {
                    confirm: function () {
                        return confirm;
                    }
                }
            });
            $scope.hasMsg = false;
            $scope.warning = false;
            modalInstance.result.then(function () {
                $http.get(constant.APP_HOST+'/v1/aut/sysset/delnoti',{
                	params:{
					nid:item.id,
					},
					headers:{
                    'Authorization':localStorageService.get("token")
       				 }, 
				}).success(function(data){
						if(data.successStatus==1){
							// 成功
							$scope.golet("删除成功")
							$scope.getList();
						}
				})
            }, function () {
                console.info('模态框取消: ' + new Date());
            });
        };



    


    }
]);