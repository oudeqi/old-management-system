var app = angular.module('uoudo.dfzz');
app.controller('art_list',['$scope','$state','$http','constant','localStorageService','$uibModal','$timeout','$filter',
    function($scope,$state,$http,constant,localStorageService,$uibModal,$timeout,$filter){

        // 去发布文章
        $scope.artPut = function(){
            $state.go('art_put',{},{reload:true});
        };

        $scope.types = [];
        $scope.artType = {};
        $scope.infoTypeId = 0;//文章分类
        $http.get(constant.APP_HOST + '/v1/aut/info/type/list', {
            headers: {
                'Authorization': localStorageService.get("token")
            }
        }).success(function(data) {
            console.log("文章分类");
            console.log(data);
            if(!data.errMessage){
                if(!!data.data.length){
                    $scope.types = data.data;
                    $scope.types.unshift({
                        id:0,
                        name:"全部"
                    });
                    $scope.artType = $scope.types[0];
                }else{
                    $scope.types = [];
                    $scope.artType = {};
                }
            }
        }).error(function(data) {

        });

        $scope.status = 0;
        $scope.type = "";
        $scope.putDate = null;
        $scope.keywords = "";
        $scope.currentPage = 1;
        $scope.pageSize = 13;
        $scope.maxSize = 5;
        $scope.list = [];
        $scope.totalItems = 0;

        // 获取统计
        $http.get(constant.APP_HOST + '/v1/aut/info/list/top', {
            headers: {
                'Authorization': localStorageService.get("token")
            }
        }).success(function(data) {
            console.log("获取统计");
            console.log(data);
            if(data.errMessage){
                $scope.report = null;
            }else{
                $scope.report = data.data;
            }
        }).error(function(data) {

        });

        // 获取列表
        // 参数：
        // startTime
        // endTime
        // search
        // type：0普通3U币
        // status：1待审核，2通过，3拒绝，4下线

        $scope.getList = function(){
            var startTime = null,endTime = null;
            if($scope.putDate){
                startTime = new Date($scope.putDate + " 00:00:01").getTime();
                endTime = new Date($scope.putDate + " 23:59:59").getTime();
            }
            $http.get(constant.APP_HOST + '/v1/aut/info/list', {
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
                    pageIndex:$scope.currentPage,
                    infoTypeId:$scope.artType.id || $scope.infoTypeId
                }
            }).success(function(data) {
                console.log("获取列表");
                console.info(data);
                if (data.errMessage) {
                    $scope.list = null;
                } else {
                    angular.forEach(data.data.data,function(item){
                        // type：0普通3U币
                        if(item.feeType === 0){
                            item.artType = "普通文章";
                        }else if(item.feeType === 1){
                            item.artType = "广告文章";
                        }else if(item.feeType === 2){
                            item.artType = "积分文章";
                        }else if(item.feeType === 3){
                            item.artType = "U币文章";
                        }

                        // status：1待审核，2通过，3拒绝，4下线
                        if(item.status === 1){
                            item.statusName = "待审核";
                        }else if(item.status === 2){
                            item.statusName = "已投放";
                        }else if(item.status === 3){
                            item.statusName = "已拒绝";
                        }else if(item.status === 4){
                            item.statusName = "已下线";
                        }

                    });

                    $scope.list = data.data.data;
                    $scope.totalItems = data.data.rowCount;
                    $scope.currentPage = data.data.pageIndex;
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
                $scope.type = "";
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
            if($scope.type !== "" || $scope.status !== 0){
                $scope.status = i;
                $scope.type = j;
                $scope.currentPage = 1;
                $scope.getList();
            }
        };

        // 查看
        $scope.check = function(item){
            var modalInstance = $uibModal.open({
                backdrop:'static',
                animation: true,
                windowClass: 'modal-artcheck',
                templateUrl: './tpl/_dfzz/modal.artcheck.html',
                controller: 'art_check',
                size: 'lg',
                resolve: {
                    art: function () {
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
            console.log("item:",item);
            /*
            title:$scope.infoSet.title,
            sellerName:$scope.infoSet.sellerName,
            infoTypeId:$scope.type.id,
            template:$scope.infoSet.template,
            logo:$scope.logo,
            previewUrl:$scope.previewUrl,
            feeType:$scope.infoSet.feeType,
            introduction:$scope.infoSet.introduction,
            shareImg:$scope.shareImg,
            littleUrl:$scope.littleUrl,
            top:$scope.infoSet.top,
            videoType:$scope.infoSet.videoType,
            imageUrl:$scope.imageUrl,
            videoUrl:$scope.videoUrl,
            content:constant.UMEDITOR_CONTENT_HEADER + $scope.infoSet.content + constant.UMEDITOR_CONTENT_FOOTER
             */

             var content = item.content;
             if(!!item.content){
                 var start = content.indexOf('<body id="custom_style">') + 24,
                     end = content.lastIndexOf("</body>");
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
             var art = {
                deleteId: item.id,
                title: item.title,
                sellerName: item.sellerName,
                infoTypeId: item.infoTypeId,
                template: item.template,
                previewUrl: item.previewUrl,
                feeType: item.feeType,
                shareImg: item.shareImg,
                littleUrl: item.littleUrl,
                top: item.top,
                videoType: item.videoType,
                imageUrl: item.imageUrl,
                videoUrl: item.videoUrl,
                pushTime: item.pushTime,
                multPic: item.infoImgsList || [],
                content: content
             };
            //  console.log(art);
             localStorageService.set('art.put',art);
             $state.go("art_put",{},{reload:true});
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
                // /v1/aut/info/delete?id=1  DELETE方法
                $http.delete(constant.APP_HOST + '/v1/aut/info/delete?id='+item.id, {
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
    }
]);

function setPageSize(i){
    var appElement = document.querySelector('#art-list');
    var $scope = angular.element(appElement).scope();
    if(i && i>=1){
        $scope.pageSize = i;
    }else{
        $scope.pageSize = 10;
    }
    $scope.getList();//改变了模型，想同步到控制器中，则需要调用$apply()
    $scope.$apply();
}
