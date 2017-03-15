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
        $scope.systemOs_1=false;
        $scope.systemOs_2=false;

        // $scope.$watch("systemOs_1",function(data){
        //     if(data){
        //         if($scope.systemOs_2){
        //             $scope.systemOs=0;
        //         }else{
        //             $scope.systemOs=1;
        //         }
        //     }
           
        // })

        $scope.title=null;
        $scope.content=null;
        $scope.wwwsrc=null;

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

        },{
            notiType:5,
            name:"网页",
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
            $http.get(constant.APP_HOST+'/v1/aut/push/content',{
                params:{
                    search:$scope.search,
                    busType:$scope.notiType,
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
             if($scope.systemOs_1==true && $scope.systemOs_2==true){
                $scope.systemOs=0;
            }else if($scope.systemOs_1==true && $scope.systemOs_2==false){
                $scope.systemOs=1;
            }else if($scope.systemOs_1==false && $scope.systemOs_2==true){
                $scope.systemOs=2;
            }else{
                $scope.systemOs=null;
            }
            console.log($scope.notiType,$scope.systemOs,$scope.content,$scope.sidgo)
            // if($scope.notiType==null || $scope.systemOs==null || $scope.content==null || $scope.sidgo==null){
            //    $scope.golet("请填写必要的参数")
            //     return;
            // }
             if($scope.notiType==null || $scope.systemOs==null || $scope.content==null){
               $scope.golet("请填写必要的参数")
                return;
            }

            $http.post(constant.APP_HOST+'/v1/aut/push',{
                    busType:$scope.notiType,
                    systemOs:$scope.systemOs,
                    title:$scope.title,
                    content:$scope.content,
                    busId:$scope.sidgo, //内容id
                    url:$scope.wwwsrc,
            },{
                headers:{
                    'Authorization':localStorageService.get("token")
                }, 
            }).success(function(data){
                console.log(data);
                if(data.errMessage){
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