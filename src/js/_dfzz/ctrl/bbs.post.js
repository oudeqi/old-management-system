var app = angular.module('uoudo.dfzz');
app.controller('bbs_post',['$scope','$uibModal','FileUploader','constant','localStorageService','$sce','$http','$filter','$state','$timeout',
    function($scope,$uibModal,FileUploader,constant,localStorageService,$sce,$http,$filter,$state,$timeout){
		$scope.option_list='';
		$scope.date_get=null;
        $scope.sec={	
            id:0,
            name:'',
            siteId:1,
        };
        $scope.list=null;
        $scope.listParams={
        	startTime:null,
        	endTime:null,
        	type:null,  //穿null 才是全部， 0 是没有值
        	search:'',
        	createType:0,
            pageIndex:1,
        }

        $scope.top=null;
        $scope.inhtml='';
        $scope.show=false;
        $scope.this_page=1;
        $scope.pageTo=null;


        $scope.pageChanged=function(index){
            $scope.listParams.pageIndex=index;    
            $scope.getList();
        }
        $scope.$watchGroup([
            'pageTo',
        ],function(na,nc){
            $scope.listParams.pageIndex=na[0];
            $scope.this_page=na[0]
            $scope.getList();

        })

        // 更改帖子
        $scope.changePost=function(item){
            $state.go("bbs_pub",{postitem:item},{reload:true});
        }
        // 去详情页面吧
        $scope.okgo=function(item){
            console.log(item)
            $state.go("bbs_post_edit",{postitem:item},{reload:true});
        }

        // 发帖日期
        // $scope.
        // test pic
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

        // $scope.testx=function(item){
        // 	console.log('jake')
        //     var modalInstance = $uibModal.open({
        //         backdrop:'static',
        //         animation: true,
        //         windowClass: 'modal-showpic',
        //         templateUrl: './tpl/_dfzz/modal.showpic.html',
        //         controller: 'modal_showpic',
        //         size: 'md',
        //         resolve: {
        //             art: function () {
        //                 return item;
        //             }
        //         }
        //     });
        //     modalInstance.result.then(function (data) {
        //         console.info(data);
        //     }, function () {
        //         console.info('模态框取消: ' + new Date());
        //     });
        // }




        // 选择板块
        $scope.$watch("sec.id",function(nv,ov){ 
        	$scope.listParams.type=nv;
        	$scope.getList();
        	// console.log(nv)
         });

        $scope.get_class=function(num){
            $scope.listParams.createType=num,
            $scope.getList();
        };

        // 删除
        $scope.del = function(item){
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
            modalInstance.result.then(function () {
                // /v1/aut/info/delete?id=1  DELETE方法
                $http.post(constant.APP_HOST +'/v1/aut/site/group/delete', {
                		id:item.id
                	},{
                    headers: {
                        'Authorization': localStorageService.get("token")
                    }
                }).success(function(data){
                    console.log(data);
                    if(!data.errMessage){
                    	$scope.inhtml='删除成功';
    					$scope.show=true;
                        $scope.getList();
                    }else{
                    	$scope.inhtml='删除失败,'+data.errMessage;
    					$scope.show=true;
                    }
                    $timeout(function() {
                        $scope.show=false;
                    }, 3000); 


                }).error(function(data){
                	$scope.inhtml='网络错误';
					$scope.show=true;	
                    $timeout(function(){
                        $scope.show=false;
                    },3000);
                });
            }, function () {
                console.info('模态框取消: ' + new Date());
            });
        };







        // 获取列表
        $scope.getList=function(){
            if($scope.date_get){
                $scope.listParams.startTime = new Date($scope.date_get + " 00:00:01").getTime();
                $scope.listParams.endTime = new Date($scope.date_get + " 23:59:59").getTime();
            };
        	$http.get(constant.APP_HOST+'/v1/aut/site/group/list',{
        	params:$scope.listParams,
        	headers:{
                    'Authorization':localStorageService.get("token")
            }, 
	        }).success(function(data){
	        	if(data.errMessage){}else{
	        		$scope.list=data.data;
	        		console.log($scope.list)
	        	}
	        })
        }
        $scope.getList();
        

        //发布统计
        $http.get(constant.APP_HOST+'/v1/aut/site/group/top',{
        	headers:{
                    'Authorization':localStorageService.get("token")
            }, 
        }).success(function(data){
        	if(data.errMessage){}else{
        		$scope.top=data.data;
        	}
        })
 
       //获取分类模板		
        $http.get(constant.APP_HOST+'/v1/aut/site/group/type',{
            headers:{
                    'Authorization':localStorageService.get("token")
            },  
        }).success(function(data){
            if(data.errMessage){
                    console.log('获取分类模板错误')
            }else{
                $scope.option_list=data.data;
              $scope.option_list.push({"id": 0,"siteId": 1,"name": "全部"})
                console.log("#######这里是option_list");
                console.log($scope.option_list);
                console.log("#######这里是option_list");
            }
            // console.log(data)
        })





    }
]);
