var app = angular.module('uoudo.dfzz');
app.controller('rp_list',['$scope','$http','constant','localStorageService','$filter','$uibModal','$state','$timeout',
    function($scope,$http,constant,localStorageService,$filter,$uibModal,$state,$timeout){

        $scope.rpPut = function(){
            localStorageService.remove('rp.put');
            $state.go('rp_put',{},{reload:true});
        };

        $scope.currentPage = 1;
        $scope.pageSize = 13;
        $scope.maxSize = 5;
        $scope.list = [];
        $scope.totalItems = 0;

        $scope.status = 0;
        $scope.type = 0;

        $scope.putDate = null;

        /*
        /v1/aut/redpackage/report  GET
        {
          "errMessage": "",
          "data": {
            "waitVerify": 0,待审核
            "offLine": 3,下线
            "onLine": 0,审核通过
            "refuse": 0,拒绝
            "uCoinRpCount": 0,手气红包数量
            "vipRpCount": 0,vip红包数量
            "generalRpCount": 3普通红包数量
          }
        }
         */
        $http.get(constant.APP_HOST + '/v1/aut/redpackage/report', {
            headers: {
                'Authorization': localStorageService.get("token")
            }
        }).success(function(data) {
            console.log(data);
            if(data.errMessage){
                $scope.report = null;
            }else{
                $scope.report = data.data;
            }
        }).error(function(data) {

        });

        /*
        /v1/aut/redpackage/List
         */
        $scope.getList = function(){
            var startTime = null,endTime = null;
            if($scope.putDate){
                startTime = $filter('date')($scope.putDate + " 00:00:01","yyyy-MM-dd HH:mm:ss");
                endTime = $filter('date')($scope.putDate + " 23:59:59","yyyy-MM-dd HH:mm:ss");
            }
            $http.get(constant.APP_HOST + '/v1/aut/redpackage/List', {
                headers: {
                    'Authorization': localStorageService.get("token")
                },
                params:{
                    search:$scope.keywords,
                    status:$scope.status,
                    type:$scope.type,
                    startTime:startTime,
                    endTime:endTime,
                    pageSize:$scope.pageSize,
                    pageIndex:$scope.currentPage
                }
            }).success(function(data) {
                console.info(data);
                if (data.errMessage) {
                    $scope.list = null;
                } else {
                    angular.forEach(data.data,function(item){
                        // vip:"2",//1vip，//0大众 //uCoin>0 手气红包
                        if(item.uCoin > 0){
                            item.typeName = "手气红包";
                        }else{
                            if(item.vip === 0){
                                item.typeName = "大众红包";
                            }else if(item.vip === 1){
                                item.typeName = "VIP红包";
                            }
                        }
                        // <!-- 1 待审核，2已投放 3未通过，4已下线 -->
                        if(item.status === 1){
                            item.statusName = "待审核";
                        }else if(item.status === 2){
                            item.statusName = "已投放";
                        }else if(item.status === 3){
                            item.statusName = "未通过";
                        }else if(item.status === 4){
                            item.statusName = "已下线";
                        }
                    });
                    $scope.list = data.data;
                    $scope.totalItems = data.rowCount;
                    $scope.currentPage = data.pageIndex;
                }
            }).error(function(data) {

            });
        };
        $scope.getList();

        $scope.pageChanged = function(){
            console.log("page to "+$scope.currentPage);
            $scope.getList();
        };
        $scope.setPage = function (e) {
            if(e.keyCode === 13 && $scope.currentPage !== $scope.pageTo){
                $scope.currentPage = $scope.pageTo;
                console.log("page to "+$scope.currentPage);
                $scope.getList();
                $scope.pageTo = null;
            }
        };
        $scope.search = function(e){
            if(e && e.keyCode !== 13){
                return;
            }
            $scope.currentPage = 1;
            $scope.getList();
        };
        $scope.changeStatus = function(i){
            if(i !== $scope.status){
                $scope.type = 0;
                $scope.status = i;
                $scope.currentPage = 1;
                $scope.getList();
            }
        };
        $scope.changeType = function(i){
            if(i !== $scope.type){
                $scope.status = 0;
                $scope.type = i;
                $scope.currentPage = 1;
                $scope.getList();
            }
        };
        $scope.changeAll = function(i,j){
            if($scope.type !== 0 || $scope.status !== 0){
                $scope.status = i;
                $scope.type = j;
                $scope.currentPage = 1;
                $scope.getList();
            }
        };


        $scope.check = function(item){
            var modalInstance = $uibModal.open({
                backdrop:'static',
                animation: true,
                windowClass: 'modal-rpcheck',
                templateUrl: './tpl/_dfzz/modal.rpcheck.html',
                controller: 'rp_check',
                size: 'lg',
                resolve: {
                    rp: function () {
                        return item;
                    }
                }
            });
            modalInstance.result.then(function (data) {
                console.info(data);
            }, function () {
                console.info('模态框取消: ' + new Date());
            });
        };

        $scope.modify = function(item){
            $http.get(constant.APP_HOST + '/v1/aut/redpackage/details', {
                headers: {
                    'Authorization': localStorageService.get("token")
                },
                params:{
                    id:item.id
                }
            }).success(function(data){
                console.log(data);
                if(!data.errMessage){
                    var imgList = [],content = "",videoUrl = "",imageUrl = "";
                    if(data.data.template){
                        imgList = data.data.template.imgList;
                        videoUrl = data.data.template.videoUrl;
                        imageUrl = data.data.template.imageUrl;
                        if(data.data.template.content){
                            content = data.data.template.content;
                        }
                        var start = content.indexOf('<body id="custom_style">') + 24,
                            end = content.indexOf("</body>");
                        if(start === 23){
                            start = content.indexOf('<body>') + 6;
                            if(start === 5){
                                start = 0;
                            }
                        }
                        if(end === -1){
                            content = content.substring(start);
                        }else{
                            content = content.substring(start,end);
                        }
                    }
                    var vip = item.vip;
                    if(vip === 0 && item.uCoin > 0){
                        vip = 2;
                    }
                    var rp = {
                        deleteId:item.id,
                        vip:vip,
                        type:item.type,
                        name:item.name,
                        logo:item.logo,
                        introduce1:item.introduce1,
                        uCoin:item.uCoin/100+"",
                        // 总金额*10/(总个数*每期U币数）
                        rate:item.totalMoney*1000/(item.count*item.uCoin)+"",
                        rounds:item.count/item.stageNumber,
                        stageNumber:item.stageNumber,//单期个数
                        count:item.count,//红包总数（前台算）
                        totalMoney:item.totalMoney,//总金钱（前台算）
                        beginTime:$filter('date')(item.beginTime,"yyyy-MM-dd HH:mm"),
                        endTime:$filter('date')(item.endTime,"yyyy-MM-dd HH:mm"),
                        introduction:item.introduction,
                        shareImg:item.shareImg,
                        templateType:item.templateType,
                        template:{
                            imgList:imgList,//红包轮播图list
                            content:content,//内容或者html
                            videoUrl:videoUrl,//视频地址
                            imageUrl:imageUrl,//视频封面地址
                        }
                    };
                    localStorageService.set('rp.put',rp);
                    $state.go("rp_put",{},{reload:true});
                }
            }).error(function(data){});
        };
        // 删除
        $scope.del = function(item){
            console.log(item);
            var confirm = {
                tit : "确认删除吗？",
                content : "删除后将不能恢复"
            };
            var modalInstance = $uibModal.open({
                backdrop:'static',
                animation: true,
                windowClass: 'modal-confirm',
                templateUrl: './tpl/_dfzz/modal.confirm.html',
                controller: 'modal_confirm',
                size: 'sm',
                resolve: {
                    confirm: function () {
                        return confirm;
                    }
                }
            });
            $scope.hasMsg = false;
            $scope.warning = false;
            modalInstance.result.then(function () {
                // /v1/aut/redpackage/1  DELETE方法
                $http.delete(constant.APP_HOST + '/v1/aut/redpackage/'+item.id, {
                    headers: {
                        'Authorization': localStorageService.get("token")
                    }
                }).success(function(data){
                    console.log(data);
                    $scope.hasMsg = true;
                    if(!data.errMessage){
                        $scope.msg = "删除成功！";
                        $scope.warning = false;
                        $scope.getList();
                    }else{
                        $scope.msg = "删除失败！";
                        $scope.warning = true;
                    }
                    $timeout(function(){
                        $scope.hasMsg = false;
                    },1000);
                }).error(function(data){
                    $scope.hasMsg = true;
                    $scope.warning = true;
                    $scope.msg = "删除失败！";
                    $timeout(function(){
                        $scope.hasMsg = false;
                    },1000);
                });
            }, function () {
                console.info('模态框取消: ' + new Date());
            });
        };
        // 复制
        $scope.copy = function(item){

            var modalInstance = $uibModal.open({
                backdrop:'static',
                animation: true,
                windowClass: 'modal-copyrp',
                templateUrl: './tpl/_dfzz/modal.copyrp.html',
                controller: 'modal_copyrp',
                size: 'lg',
                resolve: {
                    rp: function () {
                        return item;
                    }
                }
            });
            modalInstance.result.then(function (data) {
                console.log(data);
            }, function (data) {
                console.log(data);
                if(data){
                    $scope.getList();
                }
            });
        };
    }
]);
