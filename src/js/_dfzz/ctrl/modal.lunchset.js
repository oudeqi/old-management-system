angular.module('uoudo.dfzz')
.controller('modal_lunchset',['$scope','$uibModalInstance','FileUploader','constant','localStorageService','$http','$timeout','$state',
    function($scope,$uibModalInstance,FileUploader,constant,localStorageService,$http,$timeout,$state){

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
            url : constant.APP_HOST + "/v1/back/uploadImg",
            removeAfterUpload : true,
            formData :[{token:localStorageService.get('token')}]
        });
        uploadLunchPic.onAfterAddingFile = function(fileItem) {
            fileItem.alias="file";
            $scope.uploadLunchPic.queue[0].upload();
        };
        uploadLunchPic.onSuccessItem  = function(fileItem,response){
            console.log(response);
            $scope.image = response;
            $scope.errMsg = "";
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
            //type:  36  超链接   30 文章   15夺宝   3红包   2任务
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
                    }
                }else{
                    $scope.list = [{},{},{},{},{}];
                }
            }).error(function(data) {
                $scope.list = [{},{},{},{},{}];
            });
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
            if($scope.busType == '36' && !$scope.url){
                $scope.urlMsg = "广告链接地址格式不正确";
                $scope.loading = false;
                return;
            }
            $http.post(constant.APP_HOST+'/v1/start/ad/publish',{
                pushTime:new Date($scope.pushTime+":00").getTime(),
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
