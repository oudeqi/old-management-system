var app = angular.module('uoudo.dfzz');
app.controller('cir_pub',['$scope','$uibModal','FileUploader','constant','localStorageService','$sce','$http','$filter','$state','$timeout',
    function($scope,$uibModal,FileUploader,constant,localStorageService,$sce,$http,$filter,$state,$timeout){
        $scope.newTop={
            recommandOrder:null, //是否推荐 1推荐 0不推荐
            topic:null, //话题标题
            content:null, //话题描述
            img:null, //图片
        };

        $scope.inhtml='';
        $scope.show=false;


        $scope.pubGo=function(){
            $http.post(constant.APP_HOST+'/v1/aut/world/topic',$scope.newTop,{
                 headers:{
                    'Authorization':localStorageService.get("token")
                    },
                }).success(function(data){
                    if(data.errMessage){
                        $scope.inhtml='发布失败，'+data.errMessage;
                    }else{
                        $scope.inhtml='发布成功';   
                        $scope.newTop.recommandOrder=null;                     // 上传成功
                        $scope.newTop.topic=null; 
                        $scope.newTop.content=null; 
                        $scope.newTop.img=null; 
                        $scope.clearImg();
                    }
                    $scope.show=true;
                    $timeout(function() {$scope.show=false}, 1500);
                }).error(function(){
                    $scope.inhtml='网络可能有问题';
                    $scope.show=true;
                    $timeout(function() {$scope.show=false}, 1500);
                })
        }






    		 //裁剪图片
        $scope.clickBtnPic = function(){
            document.getElementById("uploadPic").click();
        };
        var uploadPic = $scope.uploadPic = new FileUploader({
            url : constant.APP_HOST + "v1/ad/adCoverImg",
            removeAfterUpload : true,
            formData :[{token:localStorageService.get('token')}]
        });
        uploadPic.onAfterAddingFile = function(fileItem) {
            fileItem.alias="file";
            $scope.uploadPic.queue[0].upload();
        };
        uploadPic.onSuccessItem  = function(item,response){
            console.log(response);
            if(item.isSuccess){
                var modalInstance = $uibModal.open({
                    backdrop:'static',
                    animation: true,
                    windowClass: 'modal-cutpic',
                    templateUrl: './tpl/_dfzz/modal.cutpic.html',
                    controller: 'cutCirPub',
                    size: 'lg',
                    resolve: {
                        imgSrc: function () {
                            return response;
                        }
                    }
                });
                modalInstance.result.then(function (res) {
                    console.log(res);
                    $scope.previewUrl = res[0].data.data;//封面大图
                    console.log($scope.previewUrl);
                    $scope.newTop.img=$scope.previewUrl;
                    $scope.littleUrl = res[1].data.data;//封面小图
                    $scope.imageUrl = res[2].data.data;//视频封面图
                    $scope.shareImg = res[3].data.data;//分享小图
                    $scope.step = 1;
                }, function () {
                    console.info('模态框取消: ' + new Date());
                });
            }else{
                $scope.picUploadErr = "视频上传失败";
            }
        };

        $scope.clearImg = function(){
            $scope.shareImg='';
            $scope.previewUrl='';
            $scope.littleUrl='';
            $scope.imageUrl='';
            $scope.step = 1;
        };

    }
]);