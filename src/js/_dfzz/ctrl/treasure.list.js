var app = angular.module('uoudo.dfzz');
app.controller('treasure_list',['$scope','$http','constant','localStorageService','$uibModal','$state','$timeout','$sce','treasure_types',
    function($scope,$http,constant,localStorageService,$uibModal,$state,$timeout,$sce,treasure_types){

        $scope.treasurePut = function(){
            $state.go('treasure_put',{},{reload:true});
        };

        //生成夺宝所属类别
        $scope.types = [{
            id:0,
            name:"所有类别"
        }];
        $scope.type = $scope.types[0];
        treasure_types.get().success(function(data){
    		console.log(data);
    		if(!data.errMessage){
                $scope.types = data.data;
                $scope.type = $scope.types[0];
    		}
    	}).error(function(data){});

        //夺宝状态
        $scope.allStatus = [{
            id:0,
            name:"所有状态"
        },{
            id:1,
            name:"审核中"
        },{
            id:2,
            name:"进行中"
        },{
            id:3,
            name:"已结束"
        },{
            id:4,
            name:"已下线"
        }];
        $scope.status = $scope.allStatus[0];

        //获取夺宝列表
        $scope.keywords = "";
        $scope.pageSize = 5;
        $scope.currentPage = 1;
        $scope.maxSize = 5;
        $scope.startTime = "";
        $scope.endTime = "";
        $scope.totalItems = 0;
        $scope.treasureList = [];

        $scope.getTime = function(){
            var startTime,endTime;
            if($scope.startTime){
                startTime = new Date($scope.startTime + " 23:59:59").getTime() - 1000*60*60*24;
            }else{
                startTime = null;
            }
            if($scope.endTime){
                endTime = new Date($scope.endTime+" 23:59:59").getTime();
            }else{
                endTime = null;
            }
            return {
                getStartTime:function(){
                    return startTime;
                },
                getEndTime:function(){
                    return endTime;
                }
            };
        };

        //获取夺宝列表
        $scope.getList = function(){
            $http.get(constant.APP_HOST+'/v1/aut/gemSet/list',{
    			headers:{
    				'Authorization':localStorageService.get('token')
    			},
    			params:{
    				type:$scope.type.id,
    				status:$scope.status.id,
    				search:$scope.keywords,
    				pageSize:$scope.pageSize,
    				pageIndex:$scope.currentPage,
    				startTime:$scope.getTime().getStartTime(),
    				endTime:$scope.getTime().getEndTime(),
    			}
    		}).success(function(data){
                console.log(data);
                $scope.totalItems = data.data.rowCount;
                $scope.currentPage = data.data.pageIndex;
                angular.forEach(data.data.data,function(item,i){
    				if(item.status == 3){
    					item.nowStageNo = "已结束";
    					item.stageRest2 = 0;
    				}else{
    					item.stageRest2  = item.stageNumber - item.nowStageNo;
    				}
    			});
    			$scope.treasureList = data.data.data;

            }).error(function(data){

            });
        };
        // $scope.getList();
        $scope.pageChanged = function(){
            console.log("page to "+$scope.currentPage);
            $scope.getList();
        };
        $scope.setPage = function (e) {
            if(e.keyCode === 13 && $scope.currentPage !== $scope.pageTo){
                $scope.currentPage = $scope.pageTo;
                console.log("page to "+$scope.currentPage);
                $scope.getList();
                $scope.pageTo = null;
            }
        };
        $scope.search = function(e){
            if(e && e.keyCode !== 13){
                return;
            }
            $scope.currentPage = 1;
            $scope.getList();
        };

        // 夺宝预览
        $scope.treasureCheck = function(item){
            console.log(item);
            $http.get(constant.APP_HOST+'/v1/aut/gemSet/goods/info',{
    			headers:{
    				'Authorization':localStorageService.get('token')
    			},
    			params:{
    				id:item.id
    			}
    		}).success(function(data){
    			console.log(data);
                $scope.treasureTemp = data.data;
                var modalInstance = $uibModal.open({
                    backdrop:'static',
                    animation: true,
                    windowClass: 'modal-treasurecheck',
                    templateUrl: './tpl/_dfzz/modal.treasurecheck.html',
                    controller: 'treasure_check',
                    size: 'lg',
                    resolve: {
                        treasureTemp: function () {
                            return $scope.treasureTemp;
                        }
                    }
               });
               modalInstance.result.then(function (data) {

               }, function () {
                   console.info('模态框取消: ' + new Date());
               });
    		})
    		.error(function(data){});
        };

        // 通过审核
        $scope.pass = function(item){
            console.log(item);
            var confirm = {
                tit : "确认通过审核吗？",
                content : "通过审核后夺宝立即生效"
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
            // 无用
            modalInstance.result.then(function () {
                $http.post(constant.APP_HOST + '/v1/aut/gemSet/publish',{
                    id:item.id
                },{
                    headers: {
                        'Authorization': localStorageService.get("token")
                    }
                }).success(function(data){
                    console.log(data);
                    $scope.hasMsg = true;
                    if(!data.errMessage){
                        $scope.msg = "操作成功！";
                        $scope.warning = false;
                        item.status = 2;
    					item.startTime = data.data.startTime;
                    }else{
                        $scope.msg = "操作失败！";
                        $scope.warning = true;
                    }
                    $timeout(function(){
                        $scope.hasMsg = false;
                    },1000);
                }).error(function(data){
                    $scope.hasMsg = true;
                    $scope.warning = true;
                    $scope.msg = "操作失败！";
                    $timeout(function(){
                        $scope.hasMsg = false;
                    },1000);
                });
            }, function () {
                console.info('模态框取消: ' + new Date());
            });
    	};

        //修改剩余期数
        $scope.setRestStage = function(item,e){
            if(!e || (e && e.keyCode == 13)){
                console.log(item);
                if((typeof item.nowStageNo).toLowerCase() === "string"){
                    item.nowStageNo = 0;
                }
                $http.post(constant.APP_HOST+'/v1/aut/gemSet/update/stage',{
                    id:item.id,
                    stageNumber:item.nowStageNo + parseInt(item.stageRest)
                 },{
                    headers:{
                        'Authorization':localStorageService.get("token")
                    }
                }).success(function(data){
                    console.log(data);
                    if(!data.errMessage){
                        item.stageNumber = item.nowStageNo + parseInt(item.stageRest);
                        item.stageRest2  = item.stageNumber - item.nowStageNo;
                        item.stageRest = "";
                    }
                }).error(function(data){});
            }
    	};

        //修改下一期价格
        $scope.setPrice = function(item,e){
            if(!e || (e && e.keyCode == 13)){
                console.log(item);
                $http.post(constant.APP_HOST+'/v1/aut/gemSet/update/number',{
                    id:item.id,
                    number:parseInt(item.number2)
                 },{
                    headers:{
                        'Authorization':localStorageService.get("token")
                    }
                }).success(function(data){
    				if(!data.errMessage){
                        item.number = parseInt(item.number2);
    					item.number2 = "";
    				}
    			}).error(function(data){
    				console.error(data);
    			});
            }
    	};

        //下线
        $scope.offLine = function(item){
            var confirm = {
                tit : "确认下线该商品吗？",
                content : "下线之后商品不能抢夺！"
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
    		modalInstance.result.then(function (data) {
                $http.post(constant.APP_HOST + '/v1/aut/gemSet/offLine',{
                    id:item.id
                },{
                    headers: {
                        'Authorization': localStorageService.get("token")
                    }
                }).success(function(data){
    				if(!data.errMessage){
    					item.status = 4;
    				}
    			}).error(function(data){});
    		}, function () {
    			console.info('模态框取消: ' + new Date());
    		});
        };

        //上线
        $scope.onLine = function(item){
            var confirm = {
                tit : "确认上线该商品吗？",
                content : "上线之后商品立即生效！"
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
            modalInstance.result.then(function (data) {
                $http.post(constant.APP_HOST + '/v1/aut/gemSet/onLine',{
                    id:item.id
                },{
                    headers: {
                        'Authorization': localStorageService.get("token")
                    }
                }).success(function(data){
        			if(!data.errMessage){
        				item.status = 2;
        			}
        		}).error(function(data){});
    		}, function () {
    			console.info('模态框取消: ' + new Date());
    		});
        };

        //编辑
    	$scope.edit = function(item){
            $http.get(constant.APP_HOST+"/v1/aut/gemSet",{
               headers:{
                   'Authorization': localStorageService.get("token")
               },
               params:{
                   id:item.id
               }
           }).success(function(data){
               console.log(data);
               if(!data.errMessage){
                   $scope.treasure = {};
                   $scope.treasure.id = item.id;
                   $scope.treasure.goodsName = data.data.goodsName;//夺宝名称
                   $scope.treasure.treasureType =  {//夺宝所属类别
               			id:data.data.labelId,
               			name:data.data.labelName
               		};
                   $scope.treasure.stageNumber = data.data.stageNumber;//夺宝总期数
                   $scope.treasure.previewUrl = data.data.previewUrl;//夺宝封面
                   $scope.treasure.title = data.data.title;//夺宝标题
                   $scope.treasure.number = data.data.number;//商品价格
                   $scope.treasure.onceMoney = data.data.onceMoney;//单次金额
                   $scope.treasure.imgList = data.data.imgList;//存放banner
                   $scope.treasure.remarks = data.data.remarks;//商品描述
                   $scope.treasure.goodsInfo = data.data.goodsInfo;//奖品详情
                   localStorageService.set('treasure.put',$scope.treasure);
                   $state.go("treasure_put",{},{reload:true});
               }
           }).error(function(data){

           });
    	};
    }
]);
