var app = angular.module('uoudo.dfzz');

app.controller('art_put',['$scope','$http','constant','localStorageService','FileUploader','$uibModal','$state','$timeout','$sce','$filter',
    function($scope,$http,constant,localStorageService,FileUploader,$uibModal,$state,$timeout,$sce,$filter){

        // 获取文章类别下拉框数据：/v1/aut/info/type/list  GET
        // {
        //   "errMessage": "",
        //   "data": [
        //     {
        //       "id": 20,
        //       "name": "大城小事"
        //     }
        //   ]
        // }
        $scope.step = 1;//当前显示页数
        $scope.art = localStorageService.get('art.put');
        // console.log($scope.art);
        if(!!$scope.art){
            $scope.artEdit = true;
            var content="",videoCon="";
            if($scope.art.template == "1"){//视频
                videoCon = $scope.art.content;
            }else if($scope.art.template == "2"){//图文
                content = $scope.art.content;
            }
            $scope.infoSet = {
                title:$scope.art.title,//标题
                sellerName:$scope.art.sellerName,//来源
                feeType:$scope.art.feeType+"", //计费类别
                top:$scope.art.top+"",//是否置顶
                videoType:$scope.art.videoType+"",
                template:$scope.art.template+""//模板类型
            };
            $scope.infoSet.content = content;//图文正文
            $scope.infoSet.videoCon = videoCon;//视频简介
            $scope.deleteId = $scope.art.deleteId; //修改的文章id
            $scope.previewUrl = $scope.art.previewUrl;//封面大图
            $scope.littleUrl = $scope.art.littleUrl;//封面小图
            $scope.shareImg = $scope.art.shareImg;//分享小图
            $scope.imageUrl = $scope.art.imageUrl;//视频封面图
            $scope.videoUrl = $scope.art.videoUrl;//视频地址
            $scope.pushTime = $filter('date')($scope.art.pushTime, "yyyy-MM-dd HH:mm");//发布时间
            if($scope.deleteId && $scope.deleteId !== 0){
                $scope.artEdit = true;
            }else{
                $scope.artEdit = false;
            }

        }else{
            $scope.infoSet = {
                top:"0",//是否置顶
                feeType:0, //计费类别
                title:"",//标题
                template:"2",//模板类型 2图文1视频
                sellerName:"",//来源
                content:"",//正文
                videoType:"0",//精彩视频推荐
                videoCon:""//视频正文
            };
            $scope.types = [];
            $scope.type = {}; //文章类别
            $scope.previewUrl = "";//封面大图
            $scope.littleUrl = "";//封面小图:
            $scope.shareImg = "";//分享小图
            $scope.imageUrl = "";//视频封面图
            $scope.videoUrl = "";//视频地址
            $scope.pushTime = null;//发布时间
        }
        $scope.putNew = function(){
            localStorageService.remove('art.put');
            $state.go("art_put",{},{reload:true});
        };
        $scope.showInfo = function(){
            console.log(localStorageService.get('art.put'));
        };
        $scope.$watch("infoSet.content",function(nv,ov){
            $scope.artCon = $sce.trustAsHtml(nv);
        });
        $scope.artConPlace = $sce.trustAsHtml("<p>请编辑文章内容。</p>");
        $scope.$watchGroup([
            'infoSet.top',
            'infoSet.feeType',
            'infoSet.title',
            'infoSet.template',
            'infoSet.sellerName',
            'infoSet.content',
            'infoSet.videoType',
            'infoSet.videoCon',
            // 'type',
            'previewUrl',
            'videoUrl',
            'pushTime'
        ],function(){
            var content = "";
            if($scope.infoSet.template === "1"){//视频
                content = $scope.infoSet.videoCon;
            }else{
                content = $scope.infoSet.content;
            }
            var art = {
               deleteId: $scope.deleteId || 0,
               title: $scope.infoSet.title,
               sellerName: $scope.infoSet.sellerName,
            //    infoTypeId: $scope.type.id,
               template: $scope.infoSet.template,
               previewUrl: $scope.previewUrl,
               feeType: $scope.infoSet.feeType,
               shareImg: $scope.shareImg,
               littleUrl: $scope.littleUrl,
               top: $scope.infoSet.top,
               videoType: $scope.infoSet.videoType,
               imageUrl: $scope.imageUrl,
               videoUrl: $scope.videoUrl,
               pushTime: $scope.pushTime,
               content: content
            };
            localStorageService.set('art.put',art);
        });
        $http.get(constant.APP_HOST + '/v1/aut/info/type/list', {
            headers: {
                'Authorization': localStorageService.get("token")
            }
        }).success(function(data) {
            console.log(data);
            if(!data.errMessage){
                $scope.types = data.data;
                $scope.type = $scope.types[0];
                $scope.$watch("type",function(){
                    var artPut = localStorageService.get("art.put");
                    artPut.infoTypeId = $scope.type.id;
                    localStorageService.set('art.put',artPut);
                });
                // 如果是修改
                if(!!$scope.art){
                    angular.forEach($scope.types,function(item){
                        if(item.id === $scope.art.infoTypeId){
                            $scope.type = item; //文章类别
                        }
                    });
                }
            }
        }).error(function(data) {

        });

        //视频地址
        $scope.clickBtnVideo = function(){
            document.getElementById("uploadVideo").click();
        };
        var uploadVideo = $scope.uploadVideo = new FileUploader({
            url : constant.APP_HOST + "/v1/ad/adVideo",
            removeAfterUpload : true,
            formData :[{token:localStorageService.get('token')}]
        });
        uploadVideo.onAfterAddingFile = function(fileItem) {
            fileItem.alias="file";
            $scope.uploadVideo.queue[0].upload();
        };
        uploadVideo.onSuccessItem  = function(item,response){
            console.log(response);
            if(item.isSuccess){
                $scope.videoUrl = response;
                $scope.videoUploadErr = "";
            }else{
                $scope.videoUploadErr = "视频上传失败";
                $scope.videoUrl = "";
            }
        };

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
                    controller: 'cutArtPic',
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


        // 发布文章
        $scope.loading = false;
        $scope.putArticle = function(){
            if($scope.infoSet.title){
                $scope.noTit = false;
            }else{
                $scope.noTit = true;
                return;
            }
            if($scope.previewUrl){
                $scope.noPreviewUrl = false;
            }else{
                $scope.noPreviewUrl = true;
                return;
            }
            if($scope.infoSet.sellerName){
                $scope.noSellerName = false;
            }else{
                $scope.noSellerName = true;
                return;
            }
            if($scope.infoSet.template === "1"){
                if($scope.videoUrl){
                    $scope.noVideoUrl = false;
                }else{
                    $scope.noVideoUrl = true;
                    return;
                }
            }
            if($scope.infoSet.template === "2"){//图文模板
                if($scope.infoSet.content){
                    $scope.noContent = false;
                }else{
                    $scope.noContent = true;
                    return;
                }
            }else{//视频模板
                if($scope.infoSet.videoCon){
                    $scope.noVideoCon = false;
                }else{
                    $scope.noVideoCon = true;
                    return;
                }
            }

            $scope.loading = true;
            var content = "";
            if($scope.infoSet.template === "1"){ //视频模板
                content = $scope.infoSet.videoCon;
            }else{//图文模板
                content = constant.UMEDITOR_CONTENT_HEADER + $scope.infoSet.content + constant.UMEDITOR_CONTENT_FOOTER;
                // content = $scope.infoSet.content;
            }
            var pushTime = null;
            if($scope.pushTime){
                pushTime = $scope.pushTime + ":00";
                pushTime = new Date(pushTime).getTime();
            }
            $http.post(constant.APP_HOST+'/v1/aut/info/publish',{
                deleteId:$scope.deleteId,
                title:$scope.infoSet.title,
                sellerName:$scope.infoSet.sellerName,
                infoTypeId:$scope.type.id,
                template:$scope.infoSet.template,
                previewUrl:$scope.previewUrl,
                feeType:$scope.infoSet.feeType,
                shareImg:$scope.shareImg,
                littleUrl:$scope.littleUrl,
                top:$scope.infoSet.top,
                videoType:$scope.infoSet.videoType,
                imageUrl:$scope.imageUrl,
                videoUrl:$scope.videoUrl,
                pushTime:pushTime,
                content:content
             },{
     			headers:{
     				'Authorization':localStorageService.get("token")
     			}
     		}).success(function(data){
                console.log(data);
                $scope.loading = false;
                if(data.errMessage){
                    $scope.errMsg = data.errMessage;
                    $scope.succMsg = "";

                }else{
                    $scope.errMsg = "";
                    $scope.succMsg = "文章发布成功";
                    $timeout(function(){
                        localStorageService.remove('art.put');
                        $state.go("art_put",{},{reload:true});
                    },1000);
                }
            }).error(function(data){
                $scope.loading = false;
            });
        };

    }
]);
