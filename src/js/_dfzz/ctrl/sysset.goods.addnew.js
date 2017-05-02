var app = angular.module('uoudo.dfzz');

app.controller('sysset_goods_addnew',['$scope','$http','constant','localStorageService','FileUploader','$uibModal','$state','$timeout','$sce','$filter','treasure_types',
    function($scope,$http,constant,localStorageService,FileUploader,$uibModal,$state,$timeout,$sce,$filter,treasure_types){

        $scope.showyes=false;
        $scope.show=false;
        $scope.inhtml='提交成功';

       $scope.top=0; //是否置顶
       $scope.recommend=0; // 是否推荐

       //商品分类
       $scope.goodsTypeId=null;
       $scope.goodsType=[{
            id:1,
            name:'联联特产',
       },{
            id:2,
            name:'吃货馆',
       },{
            id:3,
            name:'联联优品',
       }];
       $scope.sec={
            id:1,
            name:'联联特产',
        };
        /////

        $scope.title=''; //商品标题

        $scope.previewUrl=''; //商品封面图
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
                    controller: 'cutGoodsAddNew',
                    size: 'lg',
                    resolve: {
                        imgSrc: function () {
                            return response;
                        }
                    }
                });
                modalInstance.result.then(function (res) {
                    console.log(res);
                    $scope.previewUrl = res;
                    $scope.step = 1;
                }, function () {
                    console.info('模态框取消: ' + new Date());
                });
            }else{
                $scope.picUploadErr = "上传图片出错";
            }
        };
        $scope.delFM = function(){
            $scope.previewUrl = "";
        };





        $scope.imgList=[];
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
                    controller: 'cutGoodsnohot',
                    size: 'lg',
                    resolve: {
                        imgSrc: function () {
                            return response;
                        }
                    }
                });
                modalInstance.result.then(function (res) {
                    console.log(res);
                    $scope.imgList.push(res);
                    console.log($scope.imgList.length);
                    $scope.step = 2;
                }, function () {
                    console.info('模态框取消: ' + new Date());
                });
            }else{
                $scope.picUploadErr = "上传图片出错";
            }
        };
        $scope.delBanner = function(index){
            $scope.imgList.splice(index,1);
        };

        // $scope.putNew = function(){
        //     localStorageService.remove('treasure.put');
        //     $state.go("treasure_put",{},{reload:true});
        // };


        $scope.originalPrice=null; //商品原价

        $scope.price=null; //商品现价

        $scope.ucoin=null; //U币优惠

        $scope.remainNumber=null; //库存

        $scope.content=''; //商品富文本

        // $scope.relcontent='';
        // $scope.$watch("content",function(nv,ov){
        //     $scope.relcontent = $sce.trustAsHtml(nv);
        // });
        $scope.$watch("sec",function(nv,ov){
            console.log(nv.id)
            $scope.goodsTypeId=nv.id;

        })
        $scope.golet=function(inhtml){
             $scope.inhtml=inhtml;
                $scope.showyes=true;
                $scope.show=true;
                $timeout(function() {
                        $scope.show=false;
                    }, 3000);
        }

        // difanglianzongbu
        $scope.pubYes=function(){
            console.log($scope.content)
            if($scope.previewUrl=='' || $scope.previewUrl==null){
                $scope.golet('请上传封面')
                return;
            }
            if($scope.title==null || $scope.title==''){
                $scope.golet('请输入标题')
                return;
            }
            if($scope.originalPrice==null || $scope.originalPrice==''){
                $scope.golet('请输入商品原价')
                return;
            }
            if($scope.price==null || $scope.price==''){
                $scope.golet('请输入商品现价')
                return;
            }
            if($scope.ucoin==null || $scope.ucoin==''){
                $scope.ucoin=0;
            }
            // if($scope.imgList==null || $scope.imgList==''){
            //     $scope.golet('请上传轮播图片')
            //     return;
            // }
            if(!$scope.content){
                $scope.golet('请填写图文信息');
                return;
            }
            if(!$scope.remainNumber){
                $scope.golet('请输入库存');
                return;
            }







            $http.post(constant.APP_HOST+'/v1/aut/goods/set',{
                "goodsType":$scope.goodsTypeId,
                "previewUrl":$scope.previewUrl,
                "title":$scope.title,
                "originalPrice":$scope.originalPrice*100,
                "price":$scope.price*100,
                "ucoin":$scope.ucoin,
                "imgList":$scope.imgList,
                "content":$scope.content,
                "remainNumber":$scope.remainNumber,
                "top":$scope.top,
                "recommend":$scope.recommend

            },{
                headers:{
                    'Authorization':localStorageService.get("token")
                    },
            }).success(function(data){
                if(data.data){
                    $scope.golet('发表成功');
                    $scope.previewUrl='';
                    $scope.title='';
                    $scope.originalPrice=null;
                    $scope.price=null;
                    $scope.ucoin=null;
                    $scope.imgList=[];
                    $scope.content='';
                    $scope.remainNumber=null;
                    $scope.top=0;
                    $scope.recommend=0;
                }else{
                    $scope.golet('发表失败')
                }
                console.log(data)
            })
            console.log($scope.top);
            console.log($scope.recommend);
            console.log($scope.goodsTypeId);
            console.log($scope.title);
            console.log($scope.previewUrl);
            console.log($scope.imgList)
            console.log($scope.originalPrice)
            console.log($scope.price)
            console.log($scope.ucoin)

            console.log($scope.remainNumber)
            console.log($scope.content)
        }










    }
]);
