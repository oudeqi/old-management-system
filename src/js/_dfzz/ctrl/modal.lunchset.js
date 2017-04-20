angular.module('uoudo.dfzz')
.controller('modal_lunchset',['$scope','$uibModal','$uibModalInstance','FileUploader','constant','localStorageService','$http','$timeout','$state',
    function($scope,$uibModal,$uibModalInstance,FileUploader,constant,localStorageService,$http,$timeout,$state){

        $scope.pushTime = "";
        $scope.image = "";
        $scope.busType = "36";
        $scope.busId = "";
        $scope.url = "";
        $scope.keywords = "";
        $scope.list = [{},{},{},{},{}];

        $scope.upload = function(){
            document.getElementById("uploadLunchPic").click();
        };
        var uploadLunchPic = $scope.uploadLunchPic = new FileUploader({
            url : constant.APP_HOST + "/v1/ad/adCoverImg",
            removeAfterUpload : true,
            formData :[{token:localStorageService.get('token')}]
        });
        uploadLunchPic.onAfterAddingFile = function(fileItem) {
            fileItem.alias="file";
            $scope.uploadLunchPic.queue[0].upload();
        };
        uploadLunchPic.onSuccessItem  = function(item,response){
            console.log(response);
//          $scope.image = response;
//          $scope.errMsg = "";
            if(item.isSuccess){
                var modalInstance = $uibModal.open({
                    backdrop:'static',
                    animation: true,
                    windowClass: 'modal-cutpic',
                    templateUrl: './tpl/_dfzz/modal.cutpic.html',
                    controller: 'cutHomeGpic',
                    size: 'lg',
                    resolve: {
                        imgSrc: function () {
                            return response;
                        }
                    }
                });
                modalInstance.result.then(function (res) {
                    console.log(res);
                    $scope.image=res;
                    $scope.errMsg="";
//                  $scope.previewUrl = res[0].data.data;//封面大图
//                  console.log($scope.previewUrl);
//                  $scope.newTop.img=$scope.previewUrl;
//                  $scope.littleUrl = res[1].data.data;//封面小图
//                  $scope.imageUrl = res[2].data.data;//视频封面图
//                  $scope.shareImg = res[3].data.data;//分享小图
//                  $scope.step = 1;
                }, function () {
                    console.info('模态框取消: ' + new Date());
                });
            }else{
                $scope.picUploadErr = "上传失败";
            }


        };
        uploadLunchPic.onErrorItem = function(){
            $scope.errMsg = "图片上传失败";
        };

        $scope.search = function(e){
            if(e && e.keyCode !== 13){
                return;
            }
            $scope.getList();
        };

        $scope.changeType = function(){
            if($scope.busType == '36'){
                $scope.list = [{},{},{},{},{}];
                return;
            }
            $scope.url = "";
            $scope.getList();
        };

        $scope.getList = function(){
            ///v1/start/ad/content?type=&search=GET
            //type:  36  超链接   30 文章   15夺宝   3红包   2任务 	32帖子
            $http.get(constant.APP_HOST + '/v1/start/ad/content', {
                headers: {
                    'Authorization': localStorageService.get("token")
                },
                params:{
                    type:$scope.busType,
                    search:$scope.keywords
                }
            }).success(function(data) {
                console.log(data);
                if(!data.errMessage){
                    if(data.data.length === 0){
                        $scope.list = [{},{},{},{},{}];
                    }
                    if(data.data.length == 1){
                        $scope.list = data.data;
                        $scope.list.push({});
                        $scope.list.push({});
                        $scope.list.push({});
                        $scope.list.push({});
                    }
                    if(data.data.length == 2){
                        $scope.list = data.data;
                        $scope.list.push({});
                        $scope.list.push({});
                        $scope.list.push({});
                    }
                    if(data.data.length == 3){
                        $scope.list = data.data;
                        $scope.list.push({});
                        $scope.list.push({});
                    }
                    if(data.data.length == 4){
                        $scope.list = data.data;
                        $scope.list.push({});
                    }
                    if(data.data.length > 4){
                        $scope.list = data.data;
                    }
                    if(data.data.length > 0){
                        $scope.busId = $scope.list[0].id;
                        $scope.url=$scope.list[0].url;
                    }
                }else{
                    $scope.list = [{},{},{},{},{}];
                }
            }).error(function(data) {
                $scope.list = [{},{},{},{},{}];
            });
        };

        $scope.changeBusId = function(id,urlx){
            $scope.busId = id;
            $scope.url = urlx;
        };

        $scope.checkurl = function(){
            if(/^(f|ht){1}(tp|tps):\/\/([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?/.test($scope.url)){
                $scope.urlMsg = "";
            }else{
                $scope.urlMsg = "广告链接地址格式不正确";
                return;
            }
        };

        $scope.loading = false;
        $scope.ok = function () {
            if($scope.loading){
                return;
            }
            $scope.loading = true;
            console.log(
                new Date($scope.pushTime+":00").getTime(),
                $scope.image,
                $scope.busType,
                $scope.busId,
                $scope.url
            );
            $scope.succMsg = "";
            if(!$scope.image){
                $scope.errMsg = "广告图片不能为空";
                $scope.loading = false;
                return;
            }
            // if($scope.busType == '36' && !$scope.url){
            //     $scope.urlMsg = "广告链接地址格式不正确";
            //     $scope.loading = false;
            //     return;
            // }
            $scope.ntimen=null;
            if($scope.pushTime===""){
            	$scope.ntimen=null;
            }else{
            	$scope.ntimen=new Date($scope.pushTime+":00").getTime();
            }

            $http.post(constant.APP_HOST+'/v1/start/ad/publish',{
                pushTime:$scope.ntimen,
                image:$scope.image,
                busType:$scope.busType,
                busId:$scope.busId,
                url:$scope.url
             },{
     			headers:{
     				'Authorization':localStorageService.get("token")
     			}
     		}).success(function(data){
                $scope.loading = false;
                console.log(data);
                if(data.errMessage){
                    $scope.errMsg = data.errMessage;
                    $scope.succMsg = "";
                }else{
                    $scope.errMsg = "";
                    $scope.succMsg = "设置成功";
                    $uibModalInstance.dismiss($scope.succMsg);
                }
            }).error(function(data){
                $scope.loading = false;
                $scope.errMsg = "设置失败";
                $scope.succMsg = "";
            });
    	};
    	$scope.cancel = function () {
    		$uibModalInstance.dismiss($scope.succMsg);
    	};
    }
]);
