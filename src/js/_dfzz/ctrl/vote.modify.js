var app = angular.module('uoudo.dfzz');
app.controller('vote_modify',['$scope','$http','constant','localStorageService','FileUploader','$uibModal','$state','$timeout','$sce','$filter',
    function($scope,$http,constant,localStorageService,FileUploader,$uibModal,$state,$timeout,$sce,$filter){

        $scope.votePost = {
            title:"",//活动标题
            coverPhoto:"",//封面图片
            actProfile:"",//活动简介
            signUpRule:[],//报名规则
            prizePhoto:"",//奖品图片
            reward:[],//奖项设置
            signupStart:"",//报名开始时间
            signupEnd:"",//报名结束时间
            voteStart:"",//投票开始时间
            voteEnd:"",//投票结束时间
            voteMethod:"",//投票方式
            voteRule:[],//投票规则
            multiVote:0,//0 不能一票多投 1可以多投
            upperLimit:"",//选手每日被投票上限 0代表无上限
            // pageViewBaseline :0,//浏览量基数
            orgMain:"",//主办单位
            orgSecondary:"",//协办单位
            undertaker:"",//承办单位
            originalLink:"",//原文链接
            serviceWeixin:"",//客服微信
            servicePhone:"",//客服手机
        };

        $scope.id = $state.params.id;
        $http.get(constant.APP_HOST + '/v1/aut/vote/details', {
            headers: {
                'Authorization': localStorageService.get("token")
            },
            params:{
                id:$scope.id,
            }
        }).success(function(res) {
            console.log("获取投票详情：",res);
            if(res.data && typeof res.data === "object"){
                $scope.votePost.title = res.data.title;
                $scope.votePost.coverPhoto = res.data.coverPhoto;
                $scope.votePost.actProfile = res.data.actProfile;
                $scope.votePost.prizePhoto = res.data.prizePhoto;
                $scope.votePost.voteMethod = res.data.voteMethod;
                $scope.votePost.orgMain = res.data.orgMain;
                $scope.votePost.orgSecondary = res.data.orgSecondary;
                $scope.votePost.undertaker = res.data.undertaker;
                $scope.votePost.originalLink = res.data.originalLink;
                $scope.votePost.serviceWeixin = res.data.serviceWeixin;
                $scope.votePost.servicePhone = res.data.servicePhone;
                $scope.votePost.signupStart = $filter("date")(res.data.signupStart, "yyyy-MM-dd HH:mm");
                $scope.votePost.signupEnd = $filter("date")(res.data.signupEnd, "yyyy-MM-dd HH:mm");
                $scope.votePost.voteStart = $filter("date")(res.data.voteStart, "yyyy-MM-dd HH:mm");
                $scope.votePost.voteEnd = $filter("date")(res.data.voteEnd, "yyyy-MM-dd HH:mm");

                if(res.data.signUpRule instanceof Array){
                    angular.forEach(res.data.signUpRule,function(ele,i){
                        $scope.votePost.signUpRule.push({desc:ele,valid:true});
                    });
                }
                if(res.data.voteRule instanceof Array){
                    angular.forEach(res.data.voteRule,function(ele,i){
                        $scope.votePost.voteRule.push({desc:ele,valid:true});
                    });
                }
                if(res.data.reward instanceof Array){
                    angular.forEach(res.data.reward,function(ele,i){
                        $scope.votePost.reward.push({
                            grade:ele.grade,
                            number:ele.number,
                            goods:ele.goods,
                            gradeValid:true,
                            numberValid:true,
                            goodsValid:true
                        });
                    });
                }
            }
        }).error(function(data) {

        });

        //报名规则
        $scope.addSignUpRule = function(){
            $scope.votePost.signUpRule.push({desc:"",valid:false});
        };
        $scope.delSignUpRule = function(index){
            $scope.votePost.signUpRule.splice(index,1);
        };

        //奖项设置
        $scope.addReward = function(){
            $scope.votePost.reward.push({
                grade:"",
                number:"",
                goods:"",
                gradeValid:false,
                numberValid:false,
                goodsValid:false
            });
        };
        $scope.delReward = function(index){
            $scope.votePost.reward.splice(index,1);
        };

        //投票规则
        $scope.addVoteRule = function(){
            $scope.votePost.voteRule.push({desc:"",valid:false});
            console.log($scope.votePost.voteRule);
        };
        $scope.delVoteRule = function(index){
            $scope.votePost.voteRule.splice(index,1);
            console.log($scope.votePost.voteRule);
        };


        $scope.checkTitle = function(){
            if(!$scope.votePost.title){
                $scope.titleInValid = true;
                return false;
            }else{
                $scope.titleInValid = false;
                return true;
            }
        };
        $scope.checkCoverPhoto = function(){
            if(!$scope.votePost.coverPhoto){
                $scope.coverPhotoInValid = true;
                return false;
            }else{
                $scope.coverPhotoInValid = false;
                return true;
            }
        };
        $scope.checkPrizePhoto = function(){
            if(!$scope.votePost.prizePhoto){
                $scope.prizePhotoInValid = true;
                return false;
            }else{
                $scope.prizePhotoInValid = false;
                return true;
            }
        };
        $scope.checkActProfile = function(){
            if(!$scope.votePost.actProfile){
                $scope.actProfileInValid = true;
                return false;
            }else{
                $scope.actProfileInValid = false;
                return true;
            }
        };
        $scope.checkSignupEnd = function(){
            if(!$scope.votePost.signupEnd){
                $scope.signupEndInValid = true;
                return false;
            }else{
                $scope.signupEndInValid = false;
                return true;
            }
        };
        $scope.checkVoteEnd = function(){
            if(!$scope.votePost.voteEnd){
                $scope.voteEndInValid = true;
                return false;
            }else{
                $scope.voteEndInValid = false;
                return true;
            }
        };

        //检测 报名规则
        function checkSignUpRule(){
            if($scope.votePost.signUpRule.length ===0){
                $scope.votePost.signUpRule.push({desc:"",valid:false});
                return false;
            }
            return true;
        }
        $scope.checkSignUpRule = function(item){
            if(item.desc){
                item.valid = true;
            }else{
                item.valid = false;
            }
        };
        //检测 奖励设置
        function checkReward(){
            if($scope.votePost.reward.length ===0){
                $scope.votePost.reward.push({
                    grade:"",
                    number:"",
                    goods:"",
                    gradeValid:false,
                    numberValid:false,
                    goodsValid:false,
                });
                return false;
            }else{
                return true;
            }
        }
        $scope.checkReward = function(item){
            if(item.grade){
                item.gradeValid = true;
            }else{
                item.gradeValid = false;
            }
            if(item.number){
                item.numberValid = true;
            }else{
                item.numberValid = false;
            }
            if(item.goods){
                item.goodsValid = true;
            }else{
                item.goodsValid = false;
            }
        };

        //检测 奖励设置
        function checkVoteRule(){
            if($scope.votePost.voteRule.length ===0){
                $scope.votePost.voteRule.push({desc:"",valid:false});
                return false;
            }else{
                return true;
            }
        }
        $scope.checkVoteRule = function(item){
            if(item.desc){
                item.valid = true;
            }else{
                item.valid = false;
            }
        };
        //votePut 投票发布
        $scope.clicked = false;
        $scope.votePut = function(){
            console.log($scope.votePost);
            if($scope.clicked){
                return;
            }
            $scope.clicked = true;
            if(!$scope.checkTitle() || !$scope.checkCoverPhoto() || !$scope.checkActProfile() || !$scope.checkSignupEnd() || !$scope.checkVoteEnd() || !$scope.checkPrizePhoto()){
                $scope.clicked = false;
                return;
            }
            if(!checkSignUpRule() || !checkReward() || !checkVoteRule()){
                $scope.clicked = false;
                return;
            }
            var signUpRule = [], reward = [], voteRule = [];
            angular.forEach($scope.votePost.signUpRule,function(item){
                signUpRule.push(item.desc);
            });
            angular.forEach($scope.votePost.voteRule,function(item){
                voteRule.push(item.desc);
            });

            $http.post(constant.APP_HOST+'/v1/aut/vote',{
                id:$scope.id,
                title:$scope.votePost.title,
                coverPhoto:$scope.votePost.coverPhoto,//封面图片
                actProfile:$scope.votePost.actProfile,//活动简介
                signUpRule:signUpRule,//报名规则
                prizePhoto:$scope.votePost.prizePhoto,//奖品图片
                reward:$scope.votePost.reward,//奖励设置
                signupStart:new Date($scope.votePost.signupStart+":00").getTime(),//报名开始时间
                signupEnd:new Date($scope.votePost.signupEnd+":00").getTime(),//报名结束时间
                voteStart:new Date($scope.votePost.voteStart+":00").getTime(),//投票开始时间
                voteEnd:new Date($scope.votePost.voteEnd+":00").getTime(),//投票结束时间
                voteMethod:$scope.votePost.voteMethod,//投票方式
                voteRule:voteRule,//投票规则
                multiVote:$scope.votePost.multiVote,//0 不能一票多投 1可以多投
                upperLimit:$scope.votePost.upperLimit,//选手每日被投票上限 0代表无上限
                orgMain:$scope.votePost.orgMain,//主办单位
                orgSecondary:$scope.votePost.orgSecondary,//协办单位
                undertaker:$scope.votePost.undertaker,//承办单位
                originalLink:$scope.votePost.originalLink,//原文链接
                serviceWeixin:$scope.votePost.serviceWeixin,//原文链接
                servicePhone:$scope.votePost.servicePhone,//原文链接
             },{
     			headers:{
     				'Authorization':localStorageService.get("token")
     			}
     		}).success(function(res){
                $scope.clicked = false;
                console.log("修改投票",res);
                if(!!res.data.id){
                    //发布成功
                    $scope.success = "修改投票成功";
                    $scope.error = "";
                    $timeout(function () {
                        $state.go("vote_modify",{},{reload:true});
                    }, 2000);
                }else{
                    //发布失败，请重试
                    $scope.error = "修改投票失败，请重试";
                    $scope.success = "";
                    $timeout(function () {
                        $scope.success = "";
                        $scope.error = "";
                    }, 1000);
                }
            }).error(function(err){
                $scope.clicked = false;
                $scope.error = "修改投票失败，请重试";
                $scope.success = "";
                $timeout(function () {
                    $scope.success = "";
                    $scope.error = "";
                }, 1000);
            });
        };

        //上传奖品图片
        $scope.delPrizePhoto = function(){
            $scope.votePost.prizePhoto = "";
        };
        $scope.addPrizePhoto = function(){
            document.getElementById("uploadPrizePhoto").click();
        };
        var uploadPrizePhoto = $scope.uploadPrizePhoto = new FileUploader({
            url : constant.APP_HOST + "v1/ad/adCoverImg",
            removeAfterUpload : true,
            formData :[{token:localStorageService.get('token')}]
        });
        uploadPrizePhoto.onAfterAddingFile = function(fileItem) {
            fileItem.alias="file";
            $scope.uploadPrizePhoto.queue[0].upload();
        };
        uploadPrizePhoto.onSuccessItem  = function(item,response){
            console.log(response);
            if(item.isSuccess){
                var modalInstance = $uibModal.open({
                    backdrop:'static',
                    animation: true,
                    windowClass: 'modal-cutpic',
                    templateUrl: './tpl/_dfzz/modal.cutpic.html',
                    controller: 'cutVotePrizePhoto',
                    size: 'lg',
                    resolve: {
                        imgSrc: function () {
                            return response;
                        }
                    }
                });
                modalInstance.result.then(function (res) {
                    console.log(res);
                    $scope.votePost.prizePhoto = res;
                }, function () {
                    console.info('模态框取消: ' + new Date());
                });
            }
        };


        //上传封面图片
        $scope.delCoverPhoto = function(){
            $scope.votePost.coverPhoto = "";
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
                    controller: 'cutVoteCoverPhoto',
                    size: 'lg',
                    resolve: {
                        imgSrc: function () {
                            return response;
                        }
                    }
                });
                modalInstance.result.then(function (res) {
                    console.log(res);
                    $scope.votePost.coverPhoto = res;
                }, function () {
                    console.info('模态框取消: ' + new Date());
                });
            }
        };
    }
]);
