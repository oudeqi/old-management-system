var app = angular.module('uoudo.dfzz');
app.controller('vote_put',['$scope','$http','constant','localStorageService','FileUploader','$uibModal','$state','$timeout','$sce','$filter',
    function($scope,$http,constant,localStorageService,FileUploader,$uibModal,$state,$timeout,$sce,$filter){

        $scope.votePost = {
            title:"",//活动标题
            coverPhoto:"",//封面图片
            actProfile:"",//活动简介
            signUpRule:[],//报名规则
            reward:[],
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
        };

        $scope.delCoverPhoto = function(){
            $scope.votePost.coverPhoto = "";
        };

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
            if(!$scope.checkTitle() || !$scope.checkCoverPhoto() || !$scope.checkActProfile() || !$scope.checkSignupEnd() || !$scope.checkVoteEnd()){
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
                title:$scope.votePost.title,
                coverPhoto:$scope.votePost.coverPhoto,//封面图片
                actProfile:$scope.votePost.actProfile,//活动简介
                signUpRule:signUpRule,//报名规则
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
             },{
     			headers:{
     				'Authorization':localStorageService.get("token")
     			}
     		}).success(function(res){
                $scope.clicked = false;
                console.log("发布投票：",res);
                if(!!res.data.id){
                    //发布成功
                    $scope.success = "发布成功";
                    $scope.error = "";
                    $timeout(function () {
                        $state.go("vote_put",{},{reload:true});
                    }, 1000);
                }else{
                    //发布失败，请重试
                    $scope.error = "发布失败，请重试";
                    $scope.success = "";
                    $timeout(function () {
                        $scope.success = "";
                        $scope.error = "";
                    }, 1000);
                }
            }).error(function(err){
                $scope.clicked = false;
                $scope.error = "发布失败，请重试";
                $scope.success = "";
                $timeout(function () {
                    $scope.success = "";
                    $scope.error = "";
                }, 1000);
            });
        };


        //上传封面图片
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
app.controller('cutVoteCoverPhoto', ['$scope','$http','$uibModalInstance','constant','imgSrc','$timeout',
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
                aspectRatio: 375/180,
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
