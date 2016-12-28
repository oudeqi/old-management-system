var app = angular.module('uoudo.dfzz');
app.controller('finance_mgetout',['$scope','$uibModal','FileUploader','constant','localStorageService','$sce','$http','$filter','$state','$timeout','$stateParams',
    function($scope,$uibModal,FileUploader,constant,localStorageService,$sce,$http,$filter,$state,$timeout,$stateParams){

        $scope.perT=localStorageService.get('userInfo').permission;//权限
        $scope.showyes=false;
        $scope.show=false;
        $scope.inhtml='';
        $scope.date_get=null;

        $scope.cirAll={
            status:0,
            startTime:null,
            endTime:null,
            search:null,
            pageIndex:1,
        }
        $scope.cirAllContent=null;
        $scope.sec={
            name:'',
            id:0
        }

        // 分页
        $scope.pageIndex=1;
        $scope.$watch("pageIndex",function(nv,ov){ 
            $scope.cirAll.pageIndex=nv;
            $scope.getList();
            // console.log(nv)
         });

        $scope.$watch("sec.id",function(nv,ov){
            $scope.cirAll.status=nv;
            $scope.getList();
        })
        // $scope.$watch("")

        // $scope.pageChanged=function(pagein){
        //  $scope.cirAll.pageIndex=pagein;
        //  $scope.getList();
        // }

        $scope.$watch("date_get",function(na,nv){
            if(na==null || na==''){
                $scope.cirAll.startTime=null;
                $scope.cirAll.endTime=null;
            }
            $scope.getList();
        })


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

        // 屏蔽恢复动态
        $scope.shield=function(item){
            var k;
            if(item.isDelete==1){
                k=0;
                $scope.inhtml='动态恢复成功';
            }else{
                k=1;
                $scope.inhtml='动态屏蔽成功';

            }
            $http.delete(constant.APP_HOST+'/v1/world/delete',{
                params:{
                    worldId:item.worldId,
                    isDelete:k,
                },
                headers:{
                     'Authorization':localStorageService.get("token")
                }
            }).success(function(data){
                if(data.errMessage){}else{
                    $scope.showyes=true;
                    $scope.show=true;
                    $timeout(function() {
                        $scope.show=false;
                    }, 1500);
                    $scope.getList();
                }
            })
        }



        // 获取圈子所有动态
        // /v1/aut/world/topic/recommend？siteId=0&startTime=&endTime=&search=
        $scope.getList=function(){
                if($scope.date_get){
                    $scope.cirAll.startTime = new Date($scope.date_get + " 00:00:01").getTime();
                    $scope.cirAll.endTime = new Date($scope.date_get + " 23:59:59").getTime();
                };
                    $http.get(constant.APP_HOST+'/v1/aut/cash/verify',{
                        params:$scope.cirAll,
                        headers:{
                            'Authorization': localStorageService.get("token")
                        }
                    }).success(function(data){
                        if(data.errMessage){}else{
                            $scope.cirAllContent=data;
                            console.log($scope.cirAllContent)
                        }

                    })
        }
        $scope.getList();


        // 去评论页面
        $scope.goListInfo=function(item){
            $state.go("cir_list_info",{postitem:item},{reload:true});
        }

        // 审核通过和取消
                // 删除

        $scope.goYes = function(item,wid){
            var confirm,getHost,getKey;
            switch(wid){
                case 1:
                    confirm={
                        tit:"确认通过吗？",
                        content:"确认通过"
                    }
                    getHost="/v1/aut/cash/verify";
                    getKey=2;
                    break;
                case 2:
                    confirm={
                        tit:"确认拒绝吗？",
                        content:"确认拒绝"
                    }
                    getHost="/v1/aut/cash/verify";
                    getKey=3;
                    break;
                case 3:
                    confirm={
                        tit:"确认处理成功吗？",
                        content:"确认成功",
                    }
                    getHost="/v1/aut/cash/complete";
                    getKey=4;
                    break;
                case 4:
                    confirm={
                        tit:"确认处理失败吗？",
                        content:"确认失败",
                    }
                    getHost="/v1/aut/cash/complete";
                    getKey=5;
                    break;

            }
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
            modalInstance.result.then(function () {
                // /v1/aut/info/delete?id=1  DELETE方法
                $http.post(constant.APP_HOST+getHost, {
                        id:item.id,
                        status:getKey
                    },{
                    headers: {
                        'Authorization': localStorageService.get("token")
                    }
                }).success(function(data){
                    console.log(data);
                        $scope.showyes=true;
                    if(!data.errMessage){
                        $scope.inhtml='操作成功';
                        $scope.show=true;
                        $scope.getList();
                    }else{
                        $scope.inhtml='操作失败,'+data.errMessage;
                        $scope.show=true;
                    }
                    $timeout(function() {
                        $scope.show=false;
                    }, 3000); 


                }).error(function(data){
                    $scope.inhtml='网络错误';
                    $scope.show=true;   
                    $timeout(function(){
                        $scope.show=false;
                    },3000);
                });
            }, function () {
                console.info('模态框取消: ' + new Date());
            });
        };


        // 导出表格
                Downloadify.create('downloadify_finance',{
            filename: function(){
                return "提现审核_"+new Date().getTime()+".xls";
            },
            data: function(){
                return document.getElementById('download_finance_list').innerHTML;
            },
            onComplete: function(){
                $scope.$apply(function(){
                    $scope.inhtml="导出成功";
                    $scope.showyes=true;
                    $scope.show=true;

                    console.log("导出成功");
                });
                $timeout(function(){
                    $scope.show=false;
                    // $scope.hasMsg = false;
                },1500);
            },
            onCancel: function(){

            },
            onError: function(){
                $scope.$apply(function(){
                    $scope.inhtml="导出失败";
                    $scope.showyes=true;
                    $scope.show=true;
                });
                $timeout(function(){
                    $scope.show=false;
                    // $scope.hasMsg = false;
                },1500);
            },
            swf: 'media/downloadify.swf',
            downloadImage: 'img/download_xls.png',
            width: 140,
            height: 38,
            transparent: true,
            append: false
        });



        // 站点分类
        $scope.cirClass=[
        {
            name:'所有审核状态',
            id:0,
        },
        {
            name:'待审核',
            id:1,
        },
        {
            name:'审核成功',
            id:2,
        },
        {
            name:'审核失败',
            id:3,
        },
        {
            name:'转账成功',
            id:4,
        },
        {
            name:'转账失败',
            id:5,
        },
        // {
        //     name:'VIP会员转账',
        //     id:6,
        // },

        ];

        console.log($scope.cirClass);
                // console.log($scope.cirClass.length)


    }
]);
