var app = angular.module('uoudo.dfzz');
app.controller('mall_goods_modify',['$scope','$http','constant','localStorageService','FileUploader','$uibModal','$state','$timeout','$sce','$filter',
    function($scope,$http,constant,localStorageService,FileUploader,$uibModal,$state,$timeout,$sce,$filter){

        $scope.mallGoods = {
            type:'1',
            title:'',
            coverPhoto:'',//封面图片
            originalPrice:null,//原价
            nowPrice:null,//当前价格
            uDiscount:null,//u币优惠
            stock:null,//库存
            isTop:0,//是否置顶
            isRecommend:0,//是否推荐
            banner:[],//轮播图
            content:''
        };

        $scope.id = $state.params.id;
        $http.get(constant.APP_HOST + '/v1/aut/goods/detail', {
            headers: {
                'Authorization': localStorageService.get("token")
            },
            params:{
                id:$scope.id,
            }
        }).success(function(res) {
            console.log("获取商品详情：",res);
            if(res.data && typeof res.data === "object"){
                $scope.mallGoods.type = res.data.goodsType+'';
                $scope.mallGoods.title = res.data.title;
                $scope.mallGoods.coverPhoto = res.data.previewUrl;
                $scope.mallGoods.originalPrice = res.data.originalPrice/100;
                $scope.mallGoods.nowPrice = res.data.price/100;
                $scope.mallGoods.uDiscount = res.data.ucoin/100;
                $scope.mallGoods.stock = res.data.remainNumber;
                $scope.mallGoods.isTop = res.data.top;
                $scope.mallGoods.isRecommend = res.data.recommend;
                $scope.mallGoods.banner = res.data.imgList;
                $timeout(function(){
                    $scope.mallGoods.content = res.data.content;
                },0);
                console.log($scope.mallGoods);
            }
        }).error(function(data) {

        });


        $scope.checkTitle = function(){
            if(!$scope.mallGoods.title){
                $scope.titleInValid = true;
                return false;
            }else{
                $scope.titleInValid = false;
                return true;
            }
        };
        $scope.checkCoverPhoto = function(){
            if(!$scope.mallGoods.coverPhoto){
                $scope.coverPhotoInValid = true;
                return false;
            }else{
                $scope.coverPhotoInValid = false;
                return true;
            }
        };

        $scope.checkBanner = function(){
            if($scope.mallGoods.banner.length === 0){
                $scope.bannerInValid = true;
                return false;
            }else{
                $scope.bannerInValid = false;
                return true;
            }
        };

        $scope.checkOriginalPrice = function(){
            if(!$scope.mallGoods.originalPrice){
                $scope.originalPriceInValid = true;
                return false;
            }else{
                $scope.originalPriceInValid = false;
                return true;
            }
        };
        $scope.checkNowPrice = function(){
            if(!$scope.mallGoods.nowPrice){
                $scope.nowPriceInValid = true;
                return false;
            }else{
                $scope.nowPriceInValid = false;
                return true;
            }
        };
        $scope.checkUDiscount = function(){
            if(!$scope.mallGoods.uDiscount){
                $scope.uDiscountInValid = true;
                return false;
            }else{
                $scope.uDiscountInValid = false;
                return true;
            }
        };
        $scope.checkStock = function(){
            if(!$scope.mallGoods.stock){
                $scope.stockInValid = true;
                return false;
            }else{
                $scope.stockInValid = false;
                return true;
            }
        };

        //modify 修改商品
        $scope.clicked = false;
        $scope.modify = function(){
            console.log($scope.mallGoods);
            if($scope.clicked){
                return;
            }
            $scope.clicked = true;
            if(!$scope.checkTitle() || !$scope.checkCoverPhoto() || !$scope.checkBanner() || !$scope.checkOriginalPrice() || !$scope.checkNowPrice() || !$scope.checkUDiscount() || !$scope.checkStock()){
                $scope.clicked = false;
                return;
            }
            $http.post(constant.APP_HOST+'/v1/aut/goods/set',{
                id:$scope.id,
                goodsType:$scope.mallGoods.type,
                previewUrl:$scope.mallGoods.coverPhoto,
                title:$scope.mallGoods.title,
                originalPrice:$scope.mallGoods.originalPrice*100,
                price:$scope.mallGoods.nowPrice*100,
                ucoin:$scope.mallGoods.uDiscount,
                imgList:$scope.mallGoods.banner,
                content:$scope.mallGoods.content,
                remainNumber:$scope.mallGoods.stock,
                top:$scope.mallGoods.isTop,
                recommend:$scope.mallGoods.isRecommend
             },{
     			headers:{
     				'Authorization':localStorageService.get("token")
     			}
     		}).success(function(res){
                $scope.clicked = false;
                console.log("修改商品",res);
                if(!!res.data.id){
                    $scope.success = "修改商品成功";
                    $scope.error = "";
                    $timeout(function () {
                        // $state.go("mall_goods_modify",{},{reload:true});
                    }, 2000);
                }else{
                    $scope.error = "修改商品失败，请重试";
                    $scope.success = "";
                    $timeout(function () {
                        $scope.success = "";
                        $scope.error = "";
                    }, 1000);
                }
            }).error(function(err){
                $scope.clicked = false;
                $scope.error = "修改商品失败，请重试";
                $scope.success = "";
                $timeout(function () {
                    $scope.success = "";
                    $scope.error = "";
                }, 1000);
            });
        };


        $scope.delBanner = function(index){
            console.log(index);
            $scope.mallGoods.banner.splice(index,1);
        };
        $scope.addBanner = function(){
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
                    controller: 'cutMallBanner',
                    size: 'lg',
                    resolve: {
                        imgSrc: function () {
                            return response;
                        }
                    }
                });
                modalInstance.result.then(function (res) {
                    console.log(res);
                    $scope.mallGoods.banner.push(res);
                    $scope.bannerInValid = false;
                }, function () {
                    console.info('模态框取消: ' + new Date());
                });
            }
        };

        $scope.delCoverPhoto = function(){
            $scope.mallGoods.coverPhoto = "";
        };
        $scope.addCoverPhoto = function(){
            document.getElementById("uploadCoverPhoto").click();
        };
        var uploadCoverPhoto = $scope.uploadCoverPhoto = new FileUploader({
            url : constant.APP_HOST + "v1/ad/adCoverImg",
            removeAfterUpload : true,
            formData :[{token:localStorageService.get('token')}]
        });
        uploadCoverPhoto.onAfterAddingFile = function(fileItem) {
            fileItem.alias="file";
            $scope.uploadCoverPhoto.queue[0].upload();
        };
        uploadCoverPhoto.onSuccessItem  = function(item,response){
            console.log(response);
            if(item.isSuccess){
                var modalInstance = $uibModal.open({
                    backdrop:'static',
                    animation: true,
                    windowClass: 'modal-cutpic',
                    templateUrl: './tpl/_dfzz/modal.cutpic.html',
                    controller: 'cutMallGoodsCoverPhoto',
                    size: 'lg',
                    resolve: {
                        imgSrc: function () {
                            return response;
                        }
                    }
                });
                modalInstance.result.then(function (res) {
                    console.log(res);
                    $scope.mallGoods.coverPhoto = res;
                }, function () {
                    console.info('模态框取消: ' + new Date());
                });
            }
        };
    }
]);
app.controller('cutMallGoodsCoverPhoto', ['$scope','$http','$uibModalInstance','constant','imgSrc','$timeout',
    function ($scope,$http,$uibModalInstance,constant,imgSrc,$timeout) {
        $scope.loading = false;
        $scope.imgSrc = constant.APP_HOST + imgSrc;
    	var postData = {
    		x:0,
    		y:0,
    		width:0,
    		height:0,
    		imgUrl:imgSrc
    	};
    	$scope.imgOnload = function(_this){
            // $(_this).removeAttr("onload");
            $(_this).Jcrop({
                onChange: showPreview,
                onSelect: showPreview,
                setSelect: [0, 0, 800,800],
                aspectRatio: 800/450,
                boxWidth: 400,
                boxHeight:400
            });
        };
        function showPreview(c){
            postData.x = c.x;
            postData.y = c.y;
            postData.width = c.w;
            postData.height = c.h;
        }
    	$scope.ok = function () {
            console.log(postData);
            if(postData.width<80 || postData.height<80){
                $scope.msg = "图片裁剪的最小尺寸为 400*400 px";
            }else{
                $scope.msg = "";
                $scope.loading = true;
    			$http.post(constant.APP_HOST + '/v1/uploade/cut',postData).success(function(data){
                    $scope.loading = false;
                    if(data.errMessage){
                        $scope.msg = data.errMessage;
                        return;
                    }
                    $scope.msg = "";
                    $timeout(function(){
                        $uibModalInstance.close(data.data);
                    },300);
    			}).error(function(a,b,c){
                    $scope.loading = false;
    			});
    		}
    	};
    	$scope.cancel = function () {
    		$uibModalInstance.dismiss();
    	};
    }
]);

app.controller('cutMallBanner', ['$scope','$http','$uibModalInstance','constant','imgSrc','$timeout',
    function ($scope,$http,$uibModalInstance,constant,imgSrc,$timeout) {
        $scope.loading = false;
        $scope.imgSrc = constant.APP_HOST + imgSrc;
    	var postData = {
    		x:0,
    		y:0,
    		width:0,
    		height:0,
    		imgUrl:imgSrc
    	};
    	$scope.imgOnload = function(_this){
            // $(_this).removeAttr("onload");
            $(_this).Jcrop({
                onChange: showPreview,
                onSelect: showPreview,
                setSelect: [0, 0, 800,800],
                aspectRatio: 800/450,
                boxWidth: 400,
                boxHeight:400
            });
        };
        function showPreview(c){
            postData.x = c.x;
            postData.y = c.y;
            postData.width = c.w;
            postData.height = c.h;
        }
    	$scope.ok = function () {
            console.log(postData);
            if(postData.width<80 || postData.height<80){
                $scope.msg = "图片裁剪的最小尺寸为 400*400 px";
            }else{
                $scope.msg = "";
                $scope.loading = true;
    			$http.post(constant.APP_HOST + '/v1/uploade/cut',postData).success(function(data){
                    $scope.loading = false;
                    if(data.errMessage){
                        $scope.msg = data.errMessage;
                        return;
                    }
                    $scope.msg = "";
                    $timeout(function(){
                        $uibModalInstance.close(data.data);
                    },300);
    			}).error(function(a,b,c){
                    $scope.loading = false;
    			});
    		}
    	};
    	$scope.cancel = function () {
    		$uibModalInstance.dismiss();
    	};
    }
]);
