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
    		}
    	}).error(function(data){});

        $scope.showInfo = function(){
            console.log("goodsName:"+$scope.treasure.goodsName);
            console.log($scope.treasure.treasureType);
            console.log("stageNumber:"+$scope.treasure.stageNumber);
            console.log("previewUrl:"+$scope.treasure.previewUrl);
            console.log("title:"+$scope.treasure.title);
            console.log("number:"+$scope.treasure.number);
            console.log("onceMoney:"+$scope.treasure.onceMoney);
            console.log($scope.treasure.imgList);
            console.log("remarks:"+$scope.treasure.remarks);
            console.log("goodsInfo:"+$scope.treasure.goodsInfo);
        };
        $scope.treasure = {};
        $scope.treasure.goodsName = "";//夺宝名称
        $scope.treasure.treasureType =  {//夺宝所属类别
			id:0,
			name:"全部"
		};
        $scope.treasure.stageNumber = "";//夺宝总期数
        $scope.treasure.previewUrl = "";//夺宝封面
        $scope.treasure.title = "";//夺宝标题
        $scope.treasure.number = "";//商品价格
        $scope.treasure.onceMoney = 1;//单次金额
        $scope.treasure.imgList = [];//存放banner
        $scope.treasure.remarks = "";//商品描述
        $scope.treasure.goodsInfo = "";//奖品详情
        $scope.$watch("treasure.goodsInfo",function(nv,ov){
            $scope.goodsInfo = $sce.trustAsHtml(nv);
        });


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
        uploadBanner.onAfterAddingFile = function(fileItem) {
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

            }
        };
        $scope.delBanner = function(index){
            $scope.treasure.imgList.splice(index,1);
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
