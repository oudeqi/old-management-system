var app = angular.module('uoudo.dfzz');
app.controller('treasure_put',['$scope','$http','constant','localStorageService','FileUploader','$uibModal','$state','$timeout','$sce','$filter','treasure_types',
    function($scope,$http,constant,localStorageService,FileUploader,$uibModal,$state,$timeout,$sce,$filter,treasure_types){

        $scope.step = 1;
        $scope.content = "";

        //生成夺宝所属类别
    	treasure_types.get().success(function(data){
    		console.log(data);
    		if(data.errMessage){
    			$scope.types = [];
    		}else{
    			$scope.types = data.data;
                $scope.treasure.treasureType = data.data[0];
    		}
    	}).error(function(data){});

        $scope.showInfo = function(){
            console.log(localStorageService.get('treasure.put'));
        };

        if(localStorageService.get('treasure.put')){
            $scope.treasure = localStorageService.get('treasure.put');
        }else{
            $scope.treasure = {};
            $scope.treasure.id = null;
            $scope.treasure.goodsName = "";//夺宝名称
            // $scope.treasure.treasureType =  {//夺宝所属类别
    		// 	id:0,
    		// 	name:"全部"
    		// };
            $scope.treasure.stageNumber = "";//夺宝总期数
            $scope.treasure.previewUrl = "";//夺宝封面
            $scope.treasure.title = "";//夺宝标题
            $scope.treasure.number = "";//商品价格
            $scope.treasure.onceMoney = 1;//单次金额
            $scope.treasure.imgList = [];//存放banner
            $scope.treasure.remarks = "";//商品描述
            $scope.treasure.goodsInfo = "";//奖品详情
        }

        $scope.$watch("treasure.goodsInfo",function(nv,ov){
            $scope.goodsInfo = $sce.trustAsHtml(nv);
        });
        $scope.$watch('treasure',function(){
            localStorageService.set('treasure.put',$scope.treasure);
            if($scope.treasure.previewUrl){
                $scope.noPreviewUrl = false;
            }
            if($scope.treasure.imgList.length > 0){
                $scope.noImgList = false;
            }
        },true);



        //裁剪封面图片
        $scope.clickAddFM = function(){
            document.getElementById("uploadFM").click();
        };
        var uploadFM = $scope.uploadFM = new FileUploader({
            url : constant.APP_HOST + "v1/ad/adCoverImg",
            removeAfterUpload : true,
            formData :[{token:localStorageService.get('token')}]
        });
        uploadFM.onAfterAddingFile = function(fileItem) {
            fileItem.alias="file";
            $scope.uploadFM.queue[0].upload();
        };
        uploadFM.onSuccessItem  = function(item,response){
            console.log(response);
            if(item.isSuccess){
                var modalInstance = $uibModal.open({
                    backdrop:'static',
                    animation: true,
                    windowClass: 'modal-cutpic',
                    templateUrl: './tpl/_dfzz/modal.cutpic.html',
                    controller: 'cutTreasurePic',
                    size: 'lg',
                    resolve: {
                        imgSrc: function () {
                            return response;
                        }
                    }
                });
                modalInstance.result.then(function (res) {
                    console.log(res);
                    $scope.treasure.previewUrl = res;
                    $scope.step = 1;
                }, function () {
                    console.info('模态框取消: ' + new Date());
                });
            }else{
                $scope.picUploadErr = "上传图片出错";
            }
        };
        $scope.delFM = function(){
            $scope.treasure.previewUrl = "";
        };

        //裁剪轮播图
        $scope.clickAddBanner = function(){
            document.getElementById("uploadBanner").click();
        };
        var uploadBanner = $scope.uploadBanner = new FileUploader({
            url : constant.APP_HOST + "v1/ad/adCoverImg",
            removeAfterUpload : true,
            formData :[{token:localStorageService.get('token')}]
        });
        uploadBanner.onAfterAddingFile = function(fileItem){
            fileItem.alias="file";
            $scope.uploadBanner.queue[0].upload();
        };
        uploadBanner.onSuccessItem  = function(item,response){
            console.log(response);
            if(item.isSuccess){
                var modalInstance = $uibModal.open({
                    backdrop:'static',
                    animation: true,
                    windowClass: 'modal-cutpic',
                    templateUrl: './tpl/_dfzz/modal.cutpic.html',
                    controller: 'cutTreasurePic',
                    size: 'lg',
                    resolve: {
                        imgSrc: function () {
                            return response;
                        }
                    }
                });
                modalInstance.result.then(function (res) {
                    console.log(res);
                    $scope.treasure.imgList.push(res);
                    console.log($scope.treasure.imgList.length);
                    $scope.step = 2;
                }, function () {
                    console.info('模态框取消: ' + new Date());
                });
            }else{
                $scope.picUploadErr = "上传图片出错";
            }
        };
        $scope.delBanner = function(index){
            $scope.treasure.imgList.splice(index,1);
        };

        $scope.putNew = function(){
            localStorageService.remove('treasure.put');
            $state.go("treasure_put",{},{reload:true});
        };

        // 验证表单
        $scope.validate = function(){
            // 商品名称-----------------------------
            if(!$scope.treasure.goodsName){
                $scope.noGoodsName = true;
                return false;
            }else{
                $scope.noGoodsName = false;
            }
            // 夺宝期数-------------------------------
            if(!$scope.treasure.stageNumber || $scope.treasure.stageNumber<1){
                $scope.noStageNumber = true;
                return false;
            }else{
                $scope.noStageNumber = false;
            }
            // 夺宝封面-------------------------------
            if(!$scope.treasure.previewUrl){
                $scope.noPreviewUrl = true;
                return false;
            }else{
                $scope.noPreviewUrl = false;
            }
            // 设置标题-------------------------------
            if(!$scope.treasure.title){
                $scope.noTitle = true;
                return false;
            }else{
                $scope.noTitle = false;
            }
            // 商品价格-------------------------------
            if(!$scope.treasure.number || $scope.treasure.number<1){
                $scope.noNumber = true;
                return false;
            }else{
                $scope.noNumber = false;
            }
            // 轮播图片-------------------------------
            if($scope.treasure.imgList.length === 0){
                $scope.noImgList = true;
                return false;
            }else{
                $scope.noImgList = false;
            }
            // 商品描述-------------------------------
            if(!$scope.treasure.remarks){
                $scope.noRemarks = true;
                return false;
            }else{
                $scope.noRemarks = false;
            }
            // 奖品详情-------------------------------
            if(!$scope.treasure.goodsInfo){
                $scope.noGoodsInfo = true;
                return false;
            }else{
                $scope.noGoodsInfo = false;
            }
            return true;
        };

        $scope.loading = false;
        $scope.treasurePut = function(){
            if($scope.validate()){
                if($scope.loading){
                    return;
                }
                $scope.loading = true;
                var postData = {
                    goodsName:$scope.treasure.goodsName,
                    labelId:$scope.treasure.treasureType.id,
                    stageNumber:$scope.treasure.stageNumber,
                    previewUrl:$scope.treasure.previewUrl,
                    title:$scope.treasure.title,
                    number:$scope.treasure.number,
                    onceMoney:$scope.treasure.onceMoney,
                    imgList:$scope.treasure.imgList,
                    remarks:$scope.treasure.remarks,
                    goodsInfo:$scope.treasure.goodsInfo,
                };
                if($scope.treasure.id){
                    postData.id = $scope.treasure.id;
                }

                $http.post(constant.APP_HOST+'v1/aut/gemSet',postData,{
         			headers:{
         				'Authorization':localStorageService.get("token")
         			}
         		}).success(function(data){
                    console.log(data);
                    if(data.errMessage){
                        $scope.errMsg = data.errMessage;
                        $scope.succMsg = "";
                    }else{
                        $scope.errMsg = "";
                        if($scope.treasure.id){
                            $scope.succMsg = "修改夺宝成功";
                        }else{
                            $scope.succMsg = "夺宝发布成功";
                        }
                        $timeout(function(){
                            localStorageService.remove('treasure.put');
                            $state.go("treasure_put",{},{reload:true});
                        },1000);
                    }
                }).error(function(data){
                    $scope.loading = false;
                    if($scope.treasure.id){
                        $scope.errMsg = "修改夺宝失败！";
                    }else{
                        $scope.errMsg = "夺宝发布失败！";
                    }
                });
            }
        };
    }
]);
app.factory('treasure_types',['$http','constant','localStorageService',
    function($http,constant,localStorageService){
        return {
            get : function(){
                return $http.get(constant.APP_HOST+"/v1/aut/gem/type",{
                    headers: {
                        'Authorization': localStorageService.get("token")
                    }
                });
            }
        };
    }
]);
