

var app = angular.module('uoudo.dfzz');

app.controller('cir_list',['$scope','$uibModal','FileUploader','constant','localStorageService','$sce','$http','$filter','$state','$timeout',
    function($scope,$uibModal,FileUploader,constant,localStorageService,$sce,$http,$filter,$state,$timeout){

        $scope.list={
            startTime:null,
            endTime:null,
            search:'',
            createType:0,
            pageIndex:0,
            recommend:0,
        }

        $scope.thispage=null;
        $scope.pageTo=null;
        $scope.date_get=null;


        // 是否推荐
        $scope.isRecommandOrder = function(item){
            console.log(item);
            var confirm,takeyes;
            if(item.recommandOrder==1){
                takeyes=0;
                confirm = {
                tit : "取消推荐话题？",
                content : "取消推荐话题后将不再圈子首页中显示"
                };
            }else{
                takeyes=1;
                confirm = {
                tit : "确定推荐话题？",
                content : "推荐话题"
                };
            }
            // var confirm = {
            //     tit : "取消推荐话题？",
            //     content : "取消推荐话题后将不再圈子首页中显示"
            // };
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
                $http.post(constant.APP_HOST+'/v1/aut/world/topic/recommend',{
                id:item.id,
                recommandOrder:takeyes,
                    },{
                        headers:{
                            'Authorization':localStorageService.get("token")
                        }, 
                    }).success(function(data){
                        if(data.errMessage){}else{
                            $scope.getList();
                        }
                    })
            }, function () {
                console.info('模态框取消: ' + new Date());
            });
        };

        // 搜索
        $scope.$watch("list.search",function(na,nv){
            console.log(na);
            $scope.getList();
        })

        $scope.$watch("date_get",function(na,nv){
            if(na==null || na==''){
                $scope.list.startTime=null;
                $scope.list.endTime=null;
            }
            $scope.getList();
        })

        // 查看推荐话题
        $scope.goRecommend=function(){
            $scope.list.createType=0;
            $scope.list.recommandOrder=1;
            $scope.getList();
        }
        // top 分类
        $scope.goTopClass=function(num){
            $scope.list.recommandOrder=0;
            $scope.list.createType=num;
            $scope.getList();
        }

        // 去话题详情
        $scope.goCirInfo=function(item){
            $state.go("cir_edit",{postitem:item},{reload:true});
        }

                     //裁剪图片
        $scope.clickBtnPic = function(itemx){
            localStorageService.set("nowCirList",itemx);
            document.getElementById("uploadPic").click();
        };
        var uploadPic = $scope.uploadPic = new FileUploader({
            url : constant.APP_HOST + "v1/ad/adCoverImg",
            removeAfterUpload : true,
            formData :[{token:localStorageService.get('token')}]
        });
        uploadPic.onAfterAddingFile = function(fileItem) {
            fileItem.alias="file";
            $scope.uploadPic.queue[0].upload();
        };
        uploadPic.onSuccessItem  = function(item,response){
            console.log(response);
            if(item.isSuccess){
                var modalInstance = $uibModal.open({
                    backdrop:'static',
                    animation: true,
                    windowClass: 'modal-cutpic',
                    templateUrl: './tpl/_dfzz/modal.cutpic.html',
                    controller: 'cutCirPub',
                    size: 'lg',
                    resolve: {
                        imgSrc: function () {
                            return response;
                        }
                    }
                });
                modalInstance.result.then(function (res) {
                    console.log(res);
                    $scope.previewUrl = res[0].data.data;//封面大图
                    console.log($scope.previewUrl);
                    $scope.littleUrl = res[1].data.data;//封面小图
                    $scope.imageUrl = res[2].data.data;//视频封面图
                    $scope.shareImg = res[3].data.data;//分享小图
                    $scope.step = 1;
                    $http.post(constant.APP_HOST+'/v1/aut/world/topic/update/img',{
                        id:localStorageService.get("nowCirList").id,
                        img:$scope.previewUrl,
                    },{
                        headers:{
                            'Authorization':localStorageService.get("token")
                        }, 
                    }).success(function(data){
                        if(data.errMessage){}else{
                            console.log('修改成功');
                            $scope.getList();
                        }
                    })

                }, function () {
                    console.info('模态框取消: ' + new Date());
                });
            }else{
                $scope.picUploadErr = "视频上传失败";
            }
        };

        $scope.clearImg = function(){
            $scope.shareImg='';
            $scope.previewUrl='';
            $scope.littleUrl='';
            $scope.imageUrl='';
            $scope.step = 1;
        };





        // 是否推荐
        $scope.cgRecommandOrder=function(item){
            $http.post(constant.APP_HOST+'/v1/aut/world/topic/recommend',{
                id:item.id,
                recommandOrder:item.recommandOrder==1?0:1,
            },{
                headers:{
                    'Authorization':localStorageService.get("token")
                }, 
            }).success(function(data){
                if(data.errMessage){}else{
                    $scope.getList();
                }
            })
        };

        $scope.$watch("pageTo",function(na,nv){
            $scope.list.pageIndex=na;
            $scope.this_page=na
            $scope.getList();
        })
        // page
        $scope.pageChanged=function(num){
            $scope.list.pageIndex=num;
            $scope.getList();

        }

        // 话题详情
        $scope.goListInfo=function(item){
            $state.go("cir_list_info",{postitem:item},{reload:true});
        }


        // 获取话题列表
        $scope.getList=function(){
            if($scope.date_get){
                $scope.list.startTime = new Date($scope.date_get + " 00:00:01").getTime();
                $scope.list.endTime = new Date($scope.date_get + " 23:59:59").getTime();
            };
            $http.get(constant.APP_HOST+'/v1/aut/world/topic/list',{
            params: $scope.list,
            headers:{
                    'Authorization':localStorageService.get("token")
            },  
            }).success(function(data){
                if(data.errMessage){}else{
                    $scope.listd=data.data.data;
                        $scope.pageAll=data.data;
                }
            })
        };
        $scope.getList();

        // 话题统计
        $scope.top=null;
        $scope.getTop=function(){
            $http.get(constant.APP_HOST+'/v1/aut/world/topic/top',{
            headers:{
                    'Authorization':localStorageService.get("token")
            },   
            }).success(function(data){
                if(data.errMessage){}else{
                    $scope.top=data.data;

                }
            })
        };
        $scope.getTop();



	        $scope.testx = function(item){
            var modalInstance = $uibModal.open({
                backdrop:'static',
                animation: true,
                windowClass: 'modal-showpic',
                templateUrl: './tpl/_dfzz/modal.showpic.html',
                controller: 'modal_pic',
                size: 'sm', 
                // sm,lg,md
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
    }
]);