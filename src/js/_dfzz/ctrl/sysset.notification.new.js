var app = angular.module('uoudo.dfzz');
app.controller('sysset_notification_new',['$scope','$uibModal','FileUploader','constant','localStorageService','$sce','$http','$filter','$state','$timeout','$stateParams',function($scope,$uibModal,FileUploader,constant,localStorageService,$sce,$http,$filter,$state,$timeout,$stateParams){

        $scope.allx=$stateParams.postitem;
        console.log("#############")
        console.log($scope.allx)
        console.log("#############")

        $scope.showyes=false;
        $scope.show=false;
        $scope.inhtml='提交成功'

        $scope.notiType=1;

        $scope.systemOs=1;

        $scope.title=null;
        $scope.content=null;

        $scope.search=null; //子搜索内容
        $scope.searchRes=[];
        // $scope.searchRes=[{},{},{},{},{}]; //子搜索结果
        $scope.sidgo=""; //子搜索id

        $scope.haha=[{
            notiType:1,
            name:"资讯文章",
        },{
            notiType:2,
            name:"社区文章",

        },{
            notiType:3,
            name:"红包",
        },{
            notiType:4,
            name:"任务",

        }]
        $scope.sec={
            notiType:1,
            name:'资讯文章',
        };
       
         $scope.$watchGroup([
            'sec.notiType',
            'sec.name',
            ],function(na,nc){
                console.log(na[0])
                console.log(na[1])
                $scope.notiType=na[0]
                // $scope.nowClass=na[1]
        }) 

        $scope.getSearch=function(){
            $http.get(constant.APP_HOST+'/v1/aut/sysset/getresult',{
                params:{
                    search:$scope.search,
                    notiType:$scope.notiType,
                },
                headers:{
                    'Authorization':localStorageService.get("token")
                }, 
            }).success(function(data){
                console.log(data.data);
                // $scope.searchRes=[{},{},{},{},{}];
                $scope.sidgo=data.data[0].id; //
                $scope.searchRes=data.data;

            })

        }

        $scope.golet=function(inhtml){
             $scope.inhtml=inhtml;
                $scope.showyes=true;
                $scope.show=true;
                $timeout(function() {
                        $scope.show=false;
                    }, 3000); 
        }
        $scope.sidgof=function(tid){
            // console.log("数据绑定改变了",tid)
            $scope.sidgo=tid;
            // $scope.sidgo=tid;
        }

        $scope.pubNow=function(){
            console.log($scope.notiType,$scope.systemOs,$scope.content,$scope.sidgo)
            if($scope.notiType==null || $scope.systemOs==null || $scope.content==null || $scope.sidgo==null){
               $scope.golet("请填写必要的参数")
                return;
            }


            $http.post(constant.APP_HOST+'/v1/aut/sysset/addnewnote',{
                    notiType:$scope.notiType,
                    systemOs:$scope.systemOs,
                    title:$scope.title,
                    content:$scope.content,
                    pubStatus:2,
                    delStatus:2,
                    busId:$scope.sidgo, //内容id
                    uid:localStorageService.get("userInfo").uid, //发布者id
                    siteId:null, //站点权限id
            },{
                headers:{
                    'Authorization':localStorageService.get("token")
                }, 
            }).success(function(data){
                console.log(data);
                if(data.errmsg){
                    $scope.golet("发布失败，请重试");
                }else{
                    $scope.systemOs=1;
                    $scope.title=null;
                    $scope.content=null;
                    $scope.sidgo=null;
                    $scope.search=null;
                    $scope.searchRes=null;
                    $scope.golet("发布成功");
                }

            })
        }



   




 
}





    
])