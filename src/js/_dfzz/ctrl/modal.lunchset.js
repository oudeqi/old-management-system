angular.module('uoudo.dfzz')
.controller('modal_lunchset',['$scope','$uibModalInstance','FileUploader','constant','localStorageService','$http',
    function($scope,$uibModalInstance,FileUploader,constant,localStorageService,$http){
        /*
        /v1/start/ad/publish POST
        {
            "title":"jasper118",
            "image":"1212",
            "url":"12121"
        }
        返回：
        {
          "errMessage": "",
          "data": "发布成功"
        }
         */

        $scope.title = "";
        $scope.image = "";
        $scope.url = "";

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

        $scope.checkTit = function(){
            if(!$scope.title){
                $scope.titMsg = "广告标题为1到30字";
                return;
            }else{
                $scope.titMsg = "";
            }
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
                $scope.title,
                $scope.url,
                $scope.image
            );
            $scope.succMsg = "";
            if(!$scope.title){
                $scope.titMsg = "广告标题为1到30字";
                $scope.loading = false;
                return;
            }
            if(!$scope.url){
                $scope.urlMsg = "广告链接地址格式不正确";
                $scope.loading = false;
                return;
            }
            if(!$scope.image){
                $scope.errMsg = "广告图片不能为空";
                $scope.loading = false;
                return;
            }
            $http.post(constant.APP_HOST+'/v1/start/ad/publish',{
                title:$scope.title,
                url:$scope.url,
                image:$scope.image
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
