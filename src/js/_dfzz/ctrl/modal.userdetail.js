var app = angular.module('uoudo.dfzz');
app.controller('userDetail', ['$scope', '$uibModalInstance', 'userId', '$http', 'constant', 'localStorageService',
    function($scope, $uibModalInstance, userId, $http, constant, localStorageService) {

        // 模态框确认
        $scope.ok = function() {
            $uibModalInstance.close();
        };

        //模态框取消
        $scope.cancel = function() {
            $uibModalInstance.dismiss();
        };

        //是否加载中
        $scope.loading = true;
        $scope.userId = userId;

        console.log("$scope.userId");
        console.log($scope.userId);
        $scope.search = "";
        $scope.pageSize = 12;
        $scope.maxSize = 5;


        /**
         * [获取个人基本信息]
         * /v1/aut/user/info?uid=10001
         * GET
         */
        $scope.getBaseInfo = function(){
            console.log("获取基本信息");
            $http.get(constant.APP_HOST + '/v1/aut/user/info', {
                headers: {
                    'Authorization': localStorageService.get("token")
                },
                params: {
                    uid: $scope.userId
                }
            }).success(function(data) {
                $scope.loading = false;
                if (data.errMessage) {
                    console.info(data.errMessage);
                    $scope.userInfoErrMsg = data.errMessage;
                } else {
                    console.info(data.data);
                    $scope.loading = false;
                    $scope.userInfo = data.data;
                    if($scope.userInfo.gender === 0){
                        $scope.userInfo.gender = "未填写";
                    }
                    if($scope.userInfo.gender === 1){
                        $scope.userInfo.gender = "男";
                    }else{
                        $scope.userInfo.gender = "女";
                    }
                    if($scope.userInfo.firstUserNickName === null){
                        $scope.userInfo.firstUserNickName = "无";
                    }
                    if($scope.userInfo.vip === 0){
                        $scope.userInfo.vipEndTime = "非VIP";
                    }
                    if($scope.userInfo.identityCard){
                        $scope.userInfo.IDCardInfo = $scope.userInfo.identityCard + ' ( ' + $scope.userInfo.realName + ' )';
                    }else{
                        $scope.userInfo.IDCardInfo = "未实名认证";
                    }
                    if(!$scope.userInfo.professionName){
                        $scope.userInfo.professionName = "未填写";
                    }
                    if(!$scope.userInfo.cityName){
                        $scope.userInfo.cityName = "未填写";
                    }
                    if($scope.userInfo.qqUserInfoId === 0){
                        $scope.userInfo.qqUserInfoNickName = "未绑定";
                    }else{
                        if(!$scope.userInfo.qqUserInfoNickName){
                            $scope.userInfo.qqUserInfoNickName = "已绑定";
                        }
                    }
                    if($scope.userInfo.wxUserInfoId === 0){
                        $scope.userInfo.wxUserInfoNickName = "未绑定";
                    }else{
                        if(!$scope.userInfo.wxUserInfoNickName){
                            $scope.userInfo.wxUserInfoNickName = "已绑定";
                        }
                    }
                    if($scope.userInfo.wbUserInfoId === 0){
                        $scope.userInfo.wbName = "未绑定";
                    }else{
                        $scope.userInfo.wbName = "已绑定";
                    }
                    if(!$scope.userInfo.interests){
                        $scope.userInfo.interests = "未填写";
                    }
                    //1 全部有权限，2 全部没有权限，3无邀请有奖
                    if ($scope.userInfo.status == 1) {
                        $scope.invitationRights = false; //邀请有奖
                        $scope.userBlocking = false; //是否封号
                    } else if ($scope.userInfo.status == 2) {
                        $scope.invitationRights = true;
                        $scope.userBlocking = true;
                    } else {
                        $scope.invitationRights = true;
                        $scope.userBlocking = false;
                    }
                    $scope.userInfoErrMsg = "";
                }
            }).error(function(data) {
                $scope.loading = false;
                $scope.userInfoErrMsg = data.errMessage;
            });
        };


        // 邀请有奖
        $scope.invitationRights = false;
        $scope.userBlocking = false;
        /*
            /v1/aut/user/unable  POST
            {
            "uid":10012,
            "status":2   2 封号，3取消邀请有奖
            }
        */
        $scope.switchInvitation = function() {
            //$scope.invitationRights = false;
            console.log("邀请有奖");
            console.log($scope.invitationRights);
            //1 全部有权限，2 全部没有权限，3无邀请有奖
            var status = 1;
            if ($scope.invitationRights) { //关闭邀请有奖
                status = 3;
            } else { //开启邀请有奖
                status = 1;
            }
            $http.post(constant.APP_HOST + '/v1/aut/user/unable', {
                uid: $scope.userId,
                status: status
            }, {
                headers: {
                    'Authorization': localStorageService.get("token")
                }
            }).success(function(data) {
                if (data.errMessage) {
                    $scope.invitationRights = !$scope.invitationRights;
                }
                console.log(data);
            }).error(function(data) {
                $scope.invitationRights = !$scope.invitationRights;
            });
        };

        $scope.switchUserBlocking = function() {
            //$scope.userBlocking = false;
            console.log("封号");
            console.log($scope.userBlocking);
            //1 全部有权限，2 全部没有权限，3无邀请有奖
            var status = 1;
            if ($scope.userBlocking) { //封号
                status = 2;
                $http.post(constant.APP_HOST + '/v1/aut/user/unable', {
                    uid: $scope.userId,
                    status: status
                }, {
                    headers: {
                        'Authorization': localStorageService.get("token")
                    }
                }).success(function(data) {
                    if (data.errMessage) {
                        $scope.userBlocking = !$scope.userBlocking;
                    } else {
                        $scope.invitationRights = true;
                    }
                    console.log(data);
                }).error(function(data) {
                    $scope.userBlocking = !$scope.userBlocking;
                });
            } else { //解封
                status = 1;
                $http.post(constant.APP_HOST + '/v1/aut/user/unable', {
                    uid: $scope.userId,
                    status: status
                }, {
                    headers: {
                        'Authorization': localStorageService.get("token")
                    }
                }).success(function(data) {
                    if (data.errMessage) {
                        $scope.userBlocking = !$scope.userBlocking;
                    } else {
                        $scope.invitationRights = false;
                    }
                    console.log(data);
                }).error(function(data) {
                    $scope.userBlocking = !$scope.userBlocking;
                });
            }
        };



         /**
          * [财务统计上面的统计数量]
          * @host  /v1/aut/user/finance/count?uid=10001
          * @method  GET
          * @param  {[int]} uid [用户id]
          * @return
          */
         $scope.financeStatistics = function(){
             $http.get(constant.APP_HOST + '/v1/aut/user/finance/count',{
                 headers:{
                    'Authorization': localStorageService.get("token")
                 },
                 params:{
                     uid:$scope.userId
                 }
             }).success(function(data){
                 console.log(data);
                 if($scope.modalCurrent === 2){
                     $scope.loading = false;
                     $scope.overplusMoney = data.data.overplusMoney;
                     $scope.totalIncomeMoney = data.data.totalIncomeMoney;
                     $scope.consumeMoney = data.data.consumeMoney;
                     $scope.thirdConsumeMoney = data.data.thirdConsumeMoney;
                 }

             }).error(function(data){

             });
         };


        $scope.financePageSize = 9;
        $scope.financeCurrentPage = 1;
        $scope.financeType = 0;
        $scope.third = 0;
        $scope.income = 2;
        /**
         * [获取财务记录]
         * @host  /v1/aut/user/finance/list?uid=10001&type=1&third=1
         * @method  get
         * @param  {[int]} uid [用户id]
         * @param  {[int]} type [1广告收入，2任务收入，3红包收入，4推广收益  28话费返佣 夺宝返佣：15  vip返佣:19//平台收益 income 1]
         *                      [19 购买VIP， 15 一元夺宝， 20 话费充值， 7 提现， 10 手续费 //累计支出 income 0]
         * @param  {[int]} third [601 购买VIP， 602 一元夺宝， 603 话费充值， 6 余额充值 //第三方交易，需要传third=1 income 1]
         * @param  {[int]} income [type为0 ，income 1收入，0支出，2全部 //收支明细]
         * @return
         */

        $scope.getFinancialRecord = function(){
            console.log("获取财务记录");
            $http.get(constant.APP_HOST + '/v1/aut/user/finance/list',{
                headers:{
        			'Authorization': localStorageService.get("token")
        		},
                params:{
    				uid:$scope.userId,
    				type:$scope.financeType,
    				search:$scope.search,
                    third:$scope.third,
                    income:$scope.income,
    				pageIndex:$scope.financeCurrentPage,
    				pageSize:$scope.financePageSize
    			}
            }).success(function(data){
                console.log(data);
                if($scope.modalCurrent === 2){
                    $scope.loading = false;
                }
                if(data.data){
                    $scope.financeList = data.data.data;
                    $scope.financeTotalItems = data.data.rowCount;
    				$scope.financeCurrentPage = data.data.pageIndex;
                    $scope.total = data.data.extend;
                }
            }).error(function(data){

            });
        };
        $scope.financeNav = function(type,third,income){
            if(type === $scope.financeType && third === $scope.third && income === $scope.income){
                return;
            }
            $scope.financeCurrentPage = 1;
            $scope.loading = true;
            $scope.search = "";
            $scope.financeType = type;
            $scope.third = third;
            $scope.income = income;
            $scope.getFinancialRecord();
        };
        $scope.searchFinance = function(){
            // if(!!$scope.search){
                $scope.getFinancialRecord();
            // }
        };
        $scope.financePageChanged = function() {
    		console.log('Page changed to: ' + $scope.financeCurrentPage);
    		$scope.getFinancialRecord();
    	};


        // U币 列表
        $scope.getUbStatistics = function(){
            console.log("获取U币统计");
            $http.get(constant.APP_HOST + '/v1/aut/user/ucoin/count',{
                headers:{
                   'Authorization': localStorageService.get("token")
                },
                params:{
                    uid:$scope.userId
                }
            }).success(function(data){
                console.log(data);
                if($scope.modalCurrent === 7){
                    $scope.loading = false;
                    $scope.overplus = data.data.overplus;
                    $scope.recharge = data.data.recharge;
                    $scope.exchange = data.data.exchange;
                    $scope.rechargeMoney = data.data.rechargeMoney;
                    $scope.rpMoney = data.data.rpMoney;
                }

            }).error(function(data){

            });
        };


         $scope.ubCurrentPage = 1;
         $scope.ubPageSize = 9;
         $scope.ubType = 1;
        $scope.getUbList = function(a){
            console.log("获取U币列表");
            $http.get(constant.APP_HOST + '/v1/aut/user/ucoin/list',{
                headers:{
        			'Authorization': localStorageService.get("token")
        		},
                params:{
    				uid:$scope.userId,
    				type:$scope.ubType,
    				pageIndex:$scope.ubCurrentPage,
    				pageSize:$scope.ubPageSize
    			}
            }).success(function(data){
                console.log(data);
                if($scope.modalCurrent === 7){
                    $scope.loading = false;
                }
                if(data.data){
                    $scope.ubList = data.data.data;
                    $scope.ubTotalItems = data.data.rowCount;
    				$scope.ubCurrentPage = data.data.pageIndex;
                }
            }).error(function(data){

            });
        };
        $scope.ubNav = function(type){
            if(type === $scope.ubType){
                return;
            }
            $scope.ubCurrentPage = 1;
            $scope.loading = true;
            $scope.search = "";
            $scope.ubType = type;
            $scope.getUbList();
        };
        $scope.ubPageChanged = function() {
    		console.log('Page changed to: ' + $scope.financeCurrentPage);
    		$scope.getUbList();
    	};


        $scope.actCurrentPage = 1;
        $scope.actType = 1;
         /**
          * [获取活跃记录]
          * @host  /v1/aut/user/active/list?uid=10001&type=1
          * @method  get
          * @param  {[int]} uid [用户id]
          * @param  {[int]} type [1广告 2任务 3红包]
          * @return
          */
        $scope.getActList = function(){
            console.log("获取活跃记录");
            $http.get(constant.APP_HOST + '/v1/aut/user/active/list',{
                headers:{
        			'Authorization': localStorageService.get("token")
        		},
                params:{
    				uid:$scope.userId,
    				type:$scope.actType,
    				search:$scope.search,
    				pageIndex:$scope.actCurrentPage,
    				pageSize:$scope.pageSize
    			}
            }).success(function(data){
                console.log(data);
                if($scope.modalCurrent === 3){
                    $scope.loading = false;
                }
                if(data.data){
                    $scope.actList = data.data.data;
                    $scope.actTotalItems = data.data.rowCount;
    				$scope.actCurrentPage = data.data.pageIndex;
                }
            }).error(function(data){

            });
        };
        $scope.actNav = function(type){
            if(type === $scope.actType){
                return;
            }
            $scope.actCurrentPage = 1;
            $scope.loading = true;
            $scope.search = "";
            $scope.actType = type;
            $scope.getActList();
        };
        $scope.searchAct = function(){
            // if(!!$scope.search){
                $scope.getActList();
            // }
        };
        $scope.actPageChanged = function() {
    		console.log('Page changed to: ' + $scope.actCurrentPage);
    		$scope.getActList();
    	};



        $scope.mediaCurrentPage = 1;
        $scope.mediaType = 1;
        /**
         * [获取媒体价值分]
         * @host  /v1/aut/user/media/list?uid=10001&type=4
         * @method  get
         * @param  {[int]} uid [用户id]
         * @param  {[int]} type [1身份特质，2行为偏好，3人脉关系 4传播效果 5活跃度]
         * @return
         */
        $scope.getMediaList = function(){
            console.log("获取媒体价值分");
            $http.get(constant.APP_HOST + '/v1/aut/user/media/list',{
                headers:{
        			'Authorization': localStorageService.get("token")
        		},
                params:{
    				uid:$scope.userId,
    				type:$scope.mediaType,
    				search:$scope.search,
    				pageIndex:$scope.mediaCurrentPage,
    				pageSize:$scope.pageSize
    			}
            }).success(function(data){
                console.log(data);
                if($scope.modalCurrent === 4){
                    $scope.loading = false;
                }
                if(data.data){
                    $scope.mediaList = data.data.data;
                    $scope.mediaTotalItems = data.data.rowCount;
    				$scope.mediaCurrentPage = data.data.pageIndex;
                }
            }).error(function(data){

            });
        };
        $scope.mediaNav = function(type){
            if(type === $scope.mediaType){
                return;
            }
            $scope.mediaCurrentPage = 1;
            $scope.loading = true;
            $scope.search = "";
            $scope.mediaType = type;
            $scope.getMediaList();
        };
        $scope.searchMedia = function(){
            // if(!!$scope.search){
                $scope.getMediaList();
            // }
        };
        $scope.mediaPageChanged = function() {
    		console.log('Page changed to: ' + $scope.mediaCurrentPage);
    		$scope.getMediaList();
    	};

        $scope.commentCurrentPage = 1;
        $scope.commentType = 0;
        /**
         * [获取评论列表]
         * @host  /v1/aut/user/comment/list?uid=10001&type=0&search=棒
         * @method  get
         * @param  {[int]} uid [用户id]
         * @param  {[int]} type [1广告 2任务 3红包 4任务文案，5夺宝晒单]
         * @return
         */
        $scope.getCommentList = function(xx){
            console.log("获取评论列表");
            $http.get(constant.APP_HOST + '/v1/aut/user/comment/list',{
                headers:{
        			'Authorization': localStorageService.get("token")
        		},
                params:{
    				uid:$scope.userId,
    				type:$scope.commentType,
    				search:$scope.search,
    				pageIndex:$scope.commentCurrentPage,
    				pageSize:$scope.pageSize
    			}
            }).success(function(data){
                console.log(data);
                if($scope.modalCurrent === 5){
                    $scope.loading = false;
                }
                if(data.data){
                    $scope.commentList = data.data.data;
                    $scope.commentTotalItems = data.data.rowCount;
    				$scope.commentCurrentPage = data.data.pageIndex;
                }
            }).error(function(data){

            });
        };
        $scope.commentNav = function(type){
            if(type === $scope.commentType){
                return;
            }
            $scope.commentCurrentPage = 1;
            $scope.loading = true;
            $scope.search = "";
            $scope.commentType = type;
            $scope.getCommentList();
        };
        $scope.searchComment = function(){
            // if(!!$scope.search){
                $scope.getCommentList();
            // }
        };
        $scope.commentPageChanged = function() {
    		console.log('Page changed to: ' + $scope.commentCurrentPage);
    		$scope.getCommentList();
    	};


        // {
        //   "errMessage": "",
        //   "data": {
        //     "pageCount": 1,
        //     "pageSize": 20,
        //     "pageIndex": 1,
        //     "rowCount": 1,
        //     "data": [
        //       {
        //         "uid": 10072,
        //         "phoneNumber": "13547822067",
        //         "nickName": "smil....",
        //         "userType": "VIP会员",
        //         "statusName": "",
        //         "createDate": 1459504694000
        //       }
        //     ],
        //     "errMessage": null,
        //     "extend": null
        //   }
        // }


        $scope.invitCurrentPage = 1;
        $scope.invitType = 1;
        /**
         * [获取邀请列表]
         * @host  /v1/aut/user/invite/list?uid=14699&type=1
         * @method  get
         * @param  {[int]} uid [用户id]
         * @param  {[int]} type [1广告 2任务 3红包 4任务文案，5夺宝晒单]
         * @return
         */
        $scope.getInvitationList = function(a){
            console.log("获取邀请列表");
            $http.get(constant.APP_HOST + '/v1/aut/user/invite/list',{
                headers:{
        			'Authorization': localStorageService.get("token")
        		},
                params:{
    				uid:$scope.userId,
    				type:$scope.invitType,
    				search:$scope.search,
    				pageIndex:$scope.invitCurrentPage,
    				pageSize:$scope.pageSize
    			}
            }).success(function(data){
                console.log(data);
                if($scope.modalCurrent === 6){
                    $scope.loading = false;
                }
                if(data.data){
                    $scope.invitList = data.data.data;
                    $scope.invitTotalItems = data.data.rowCount;
    				$scope.invitCurrentPage = data.data.pageIndex;
                }
            }).error(function(data){

            });
        };

        $scope.invitNav = function(type){
            if(type === $scope.invitType){
                return;
            }
            $scope.invitCurrentPage = 1;
            $scope.search = "";
            $scope.loading = true;
            $scope.invitType = type;
            $scope.getInvitationList();
        };
        $scope.searchInvit = function(){
            // if(!!$scope.search){
                $scope.getInvitationList();
            // }
        };
        $scope.invitPageChanged = function() {
    		console.log('Page changed to: ' + $scope.invitCurrentPage);
    		$scope.getInvitationList();
    	};


        //获取基本信息
        $scope.getBaseInfo();
        // nav 切换
        $scope.modalCurrent = 1;
        $scope.modalNav = function(idx) {
            if($scope.modalCurrent === idx){
                return;
            }
            $scope.search = "";
            $scope.modalCurrent = idx;
            $scope.loading = true; //加载状态
            switch ($scope.modalCurrent) {
                case 1:$scope.getBaseInfo();break;
                case 2:$scope.getFinancialRecord();
                       $scope.financeStatistics();
                       break;
                case 3:$scope.getActList();break;
                case 4:$scope.getMediaList();break;
                case 5:$scope.getCommentList();break;
                case 6:$scope.getInvitationList();break;
                case 7:$scope.getUbStatistics();
                       $scope.getUbList();
                       break;
            }
        };
    }
]);
