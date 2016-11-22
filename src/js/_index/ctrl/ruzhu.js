var app = angular.module('uoudo.index');
app.controller('ruzhu',['$scope','FileUploader','constant','localStorageService','$document','$http','$timeout','$state',
    function($scope,FileUploader,constant,localStorageService,$document,$http,$timeout,$state){

        console.log("ruzhu...........");

        $scope.siteType = 1;//入驻类型
        $scope.uType = 1;//媒体类型
        $scope.phoneNumber = "";//二台账号
        $scope.connectionName = "";//运营人姓名
        $scope.connectionPhone = "";//联系电话
        $scope.identityFaceImg = "";//身份证正面
        $scope.identityBackImg = "";//身份证反面
        $scope.permitUrl = "";//执照

        $scope.idUploadState_z = 1;//身份证正面上传状态
        $scope.idUploadState_f = 1;//身份证反面上传状态
        $scope.zzUploadState = 1;//执照上传状态

        $scope.uploadSelected = false;
        //上传身份证正面
        $scope.slelectIDZ = function(){
            // if(!$scope.uploadSelected){
                $scope.uploadSelected = true;
                document.getElementById("id_upload_z").click();
            // }

        };
        var uploadIdZ = $scope.uploadIdZ = new FileUploader({
            url : constant.APP_HOST + "v1/ad/adCoverImg",
            removeAfterUpload : true,
            formData :[{token:localStorageService.get('token')}]
        });
        uploadIdZ.onAfterAddingFile = function(fileItem){
            fileItem.alias="file";
            $scope.uploadIdZ.queue[0].upload();
        };
        uploadIdZ.onSuccessItem  = function(item,response){
            console.log(response);
            if(item.isSuccess){
                $scope.idUploadState_z = 2;
                $scope.identityFaceImg = response;
            }else{
                $scope.idUploadState_z = 3;
                $scope.identityFaceImg = "";
            }
        };

        //上传身份证反面
        $scope.slelectIDF = function(){
            // if(!$scope.uploadSelected){
                $scope.uploadSelected = true;
                document.getElementById("id_upload_f").click();
            // }
        };
        var uploadIdF = $scope.uploadIdF = new FileUploader({
            url : constant.APP_HOST + "v1/ad/adCoverImg",
            removeAfterUpload : true,
            formData :[{token:localStorageService.get('token')}]
        });
        uploadIdF.onAfterAddingFile = function(fileItem){
            fileItem.alias="file";
            $scope.uploadIdF.queue[0].upload();
        };
        uploadIdF.onSuccessItem  = function(item,response){
            console.log(response);
            if(item.isSuccess){
                $scope.idUploadState_f = 2;
                $scope.identityBackImg = response;
            }else{
                $scope.idUploadState_f = 3;
                $scope.identityBackImg = "";
            }
        };

        //上传执照
        $scope.slelectZZ = function(){
            // if(!$scope.uploadSelected){
                $scope.uploadSelected = true;
                document.getElementById("zz_upload").click();
            // }
        };
        var uploadZZ = $scope.uploadZZ = new FileUploader({
            url : constant.APP_HOST + "v1/ad/adCoverImg",
            removeAfterUpload : true,
            formData :[{token:localStorageService.get('token')}]
        });
        uploadZZ.onAfterAddingFile = function(fileItem){
            fileItem.alias="file";
            $scope.uploadZZ.queue[0].upload();
        };
        uploadZZ.onSuccessItem  = function(item,response){
            console.log(response);
            if(item.isSuccess){
                $scope.zzUploadState = 2;
                $scope.permitUrl = response;
            }else{
                $scope.zzUploadState = 3;
                $scope.permitUrl = "";
            }
        };

        // /v1/cooperate/info/open  POST
        //  {
        //     "uType":"1", 1个人，2企业，3机构
        //     "siteType":"1",  1地方站长，2媒体主，3广告主，4推广商
        //     "phoneNumber":"13547822066", 2台账号
        //     "connectionName":"某某", 运营人员
        //     "connectionPhone":"13547822066", 联系电话
        //     "identityFaceImg":"http://share.uoolle.cn/qualification/1420160401170319674.jpg", 身份证正面
        //     "identityBackImg":"http://share.uoolle.cn/qualification/1420160401170319674.jpg", 身份证反面
        //     "permitUrl":"http://share.uoolle.cn/qualification/1420160401170319674.jpg" 营业执照
        // }

        $scope.loading = false;
        $scope.msg = "";
        $scope.ruzhu = function(){
            if(!$scope.phoneNumber || !$scope.connectionName || !$scope.connectionPhone || !$scope.identityFaceImg || !$scope.identityBackImg || !$scope.permitUrl){
                $scope.msg = "请补全所有信息";
                return;
            }else{
                $scope.msg = "";
            }
            if($scope.loading){
                return;
            }
            $scope.loading = true;
            $http.post(constant.APP_HOST+'/v1/cooperate/info/open',{
                uType:$scope.uType,
                siteType:$scope.siteType,
                phoneNumber:$scope.phoneNumber,
                connectionName:$scope.connectionName,
                connectionPhone:$scope.connectionPhone,
                identityFaceImg:$scope.identityFaceImg,
                identityBackImg:$scope.identityBackImg,
                permitUrl:$scope.permitUrl
             }).success(function(data){
                console.log(data);
                if(data.errMessage){
                    $scope.msg = data.errMessage;
                    $scope.loading = false;
                }else{
                    $scope.msg = "入驻成功";
                    $scope.succ = true;
                    $scope.loading = false;
                    $timeout(function(){
                        $state.go("ruzhu",{},{reload:true});
                    },1500);
                }
            }).error(function(data){
                $scope.loading = false;
            });
        };

        // $scope.siteType = 1;//入驻类型
        // $scope.uType = 1;//媒体类型
        // $scope.phoneNumber = "";//二台账号
        // $scope.connectionName = "";//运营人姓名
        // $scope.connectionPhone = "";//联系电话
        // $scope.identityFaceImg = "";//身份证正面
        // $scope.identityBackImg = "";//身份证反面
        // $scope.permitUrl = "";//执照

        $scope.test = function(){
            console.log(
                $scope.siteType,
                $scope.uType,
                $scope.phoneNumber,
                $scope.connectionName,
                $scope.connectionPhone,
                $scope.identityFaceImg,
                $scope.identityBackImg,
                $scope.permitUrl
            );
        };


    }
]);
