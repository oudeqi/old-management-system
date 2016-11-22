var app = angular.module('uoudo.dfzz');
app.controller('setting',['$scope','$rootScope','$http','constant','localStorageService','FileUploader','$uibModal',
    function($scope,$rootScope,$http,constant,localStorageService,FileUploader,$uibModal){

        $scope.setting_nav = 1;
        $scope.edit = false;

        // /v1/cooperate/get?uid=10072  GET
        // {
        //   "errMessage": "",
        //   "data": {
        //     "id": 12,
        //     "uType": 2,
        //     "siteType": 0,
        //     "uid": 10072,
        //     "phoneNumber": null,
        //     "connectionName": "liuwenchao",
        //     "connectionPhone": "13547822066",
        //     "connectionEmail": "627729604@QQ.com",
        //     "identityFaceImg": "dfad",
        //     "identityBackImg": "null",
        //     "permitUrl": null,
        //     "status": 2,
        //     "createDate": 1462243900000,
        //     "siteId": "0",
        //     "siteName": null,
        //     "siteIntroduce": null,
        //     "qqNumber": "627729604",
        //     "telephone": null
        //   }
        // }

        console.log($rootScope.uid);

        //状态，1 需要编辑，2审核中 不可编辑，3 审核成功 不可编辑，4，审核失败，可以编辑
        //只有 3审核成功，才能有其他功能

        $scope.connectionName = "";// 经营人姓名
        $scope.connectionPhone = "";// 经营人电话
        $scope.telephone = "";//固定电话
        $scope.qqNumber = "";//qq
        $scope.connectionEmail = "";//邮箱
        $scope.siteIntroduce = "";//地方站简介
        $scope.identityFaceImg = "";//身份证正面
        $scope.identityBackImg = "";//身份证反面

        $http.get(constant.APP_HOST + '/v1/cooperate/get?uid='+$rootScope.uid, {
            headers: {
                'Authorization': localStorageService.get("token")
            }
        }).success(function(data) {
            console.log(data);
            if(data.errMessage){

            }else{
                $rootScope.status = data.data.status;
                $rootScope.siteName = data.data.siteName;
                $scope.connectionName = data.data.connectionName;
                $scope.connectionPhone = data.data.connectionPhone;
                $scope.telephone = data.data.telephone;
                $scope.qqNumber = data.data.qqNumber;
                $scope.connectionEmail = data.data.connectionEmail;
                $scope.siteIntroduce = data.data.siteIntroduce;
                $scope.identityFaceImg = data.data.identityFaceImg;
                $scope.identityBackImg = data.data.identityBackImg;
            }
        }).error(function(data) {

        });

        // /v1/cooperate/update  POST
        // 参数：
        // {
        //     "uid": 10072,
        //     "connectionName": "liuwenchao",
        //     "connectionPhone": "13547822066",
        //     "connectionEmail": "627729604@QQ.com",
        //     "identityFaceImg": "dfad",
        //     "identityBackImg": "null",
        //     "permitUrl": null,
        //     "siteIntroduce": null,
        //     "qqNumber": "627729604",
        //     "telephone": null
        // }

        $scope.set = function(){
            $http.post(constant.APP_HOST+'/v1/cooperate/update',{
                uid:$rootScope.uid,
                connectionName:$scope.connectionName,
                connectionPhone:$scope.connectionPhone,
                connectionEmail:$scope.connectionEmail,
                identityFaceImg:$scope.identityFaceImg,
                identityBackImg:$scope.identityBackImg,
                siteIntroduce:$scope.siteIntroduce,
                qqNumber:$scope.qqNumber,
                telephone:$scope.telephone
             },{
                headers:{
                    'Authorization':localStorageService.get("token")
                }
            }).success(function(data){
                console.log(data);
                if(data.errMessage){

                }else{
                    $rootScope.status = data.data.status;
                    $rootScope.siteName = data.data.siteName;
                    $scope.connectionName = data.data.connectionName;
                    $scope.connectionPhone = data.data.connectionPhone;
                    $scope.telephone = data.data.telephone;
                    $scope.qqNumber = data.data.qqNumber;
                    $scope.connectionEmail = data.data.connectionEmail;
                    $scope.siteIntroduce = data.data.siteIntroduce;
                    $scope.identityFaceImg = data.data.identityFaceImg;
                    $scope.identityBackImg = data.data.identityBackImg;
                    $scope.edit = false;

                    var userInfo = localStorageService.get('userInfo');
                    userInfo.status = $rootScope.status;
                    localStorageService.set('userInfo',userInfo);
                    if($rootScope.status === 1){
                        $rootScope.statusMsg = "你的资料不完整，请完善资料";
                    }else if($rootScope.status === 2){
                        $rootScope.statusMsg = "你的资料正在审核中，请等待";
                    }else if($rootScope.status === 4){
                        $rootScope.statusMsg = "你的资料审核失败，请完善资料";
                    }else{
                        $rootScope.statusMsg = "";
                    }
                }
            }).error(function(data){

            });
        };

        // 上传正面
        $scope.clickFace = function(){
            //状态，1 需要编辑，2审核中 不可编辑，3 审核成功 不可编辑，4，审核失败，可以编辑
            // if($scope.status === 2){
            //     return;
            // }
            // if($scope.status === 3){
            //     return;
            // }
            // if($scope.status === 0){
            //     return;
            // }
            document.getElementById("uploadIdFace").click();
        };
        var uploadIdFace = $scope.uploadIdFace = new FileUploader({
            url : constant.APP_HOST + "/v1/back/uploadImg",
            removeAfterUpload : true,
            formData :[{token:localStorageService.get('token')}]
        });
        uploadIdFace.onAfterAddingFile = function(fileItem) {
            fileItem.alias="file";
            $scope.uploadIdFace.queue[0].upload();
        };
        uploadIdFace.onSuccessItem  = function(item,response){
            console.log(response);
            $scope.identityFaceImg = response;
            $scope.set();
        };

        // 上传反面
        $scope.clickBack = function(){
            //状态，1 需要编辑，2审核中 不可编辑，3 审核成功 不可编辑，4，审核失败，可以编辑
            // if($scope.status === 2){
            //     return;
            // }
            // if($scope.status === 3){
            //     return;
            // }
            // if($scope.status === 0){
            //     return;
            // }
            document.getElementById("uploadIdBack").click();
        };
        var uploadIdBack = $scope.uploadIdBack = new FileUploader({
            url : constant.APP_HOST + "/v1/back/uploadImg",
            removeAfterUpload : true,
            formData :[{token:localStorageService.get('token')}]
        });
        uploadIdBack.onAfterAddingFile = function(fileItem) {
            fileItem.alias="file";
            $scope.uploadIdBack.queue[0].upload();
        };
        uploadIdBack.onSuccessItem  = function(item,response){
            console.log(item,response);
            $scope.identityBackImg = response;
            $scope.set();
        };









    }
]);
