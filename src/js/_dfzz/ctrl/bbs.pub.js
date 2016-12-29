var app = angular.module('uoudo.dfzz');
app.controller('bbs_pub',['$scope','$uibModal','FileUploader','constant','localStorageService','$sce','$http','$filter','$state','$timeout','$stateParams',
    function($scope,$uibModal,FileUploader,constant,localStorageService,$sce,$http,$filter,$state,$timeout,$stateParams){

        $scope.allx=$stateParams.postitem;
        console.log("#############")
        console.log($scope.allx)
        console.log("#############")
        $scope.pushTime=null;
        // $scope.pushTime = $filter('date')($scope.art.pushTime, "yyyy-MM-dd HH:mm");//发布时间
        // if($scope.pushTime){
        //     pushTime = $scope.pushTime + ":00";
        //     pushTime = new Date(pushTime).getTime();
        // }
        $scope.nowClass='今日成都'
        $scope.showyes=false;
        $scope.option_list=null;
        $scope.selected_name=null;
        $scope.show=false;
        $scope.inhtml='';
        $scope.userInfo=localStorageService.get('userInfo');
        $scope.newStyle={
            "background-image":"url("+$scope.userInfo.headIconUrl+")",
        }

        // $scope.sec={
        //     id:2,
        //     name:'',
        // };
        $scope.sec={
            id:null,
            name:'',
            siteId:1,
        };


        $scope.pub={
            id:null,
            title:'',
            groupTypeId:null,
            top:0,
            htmlContent:'',
            imgList:[],
            pushTime:null,
        }




        $scope.$watchGroup([
            'sec.id',
            'sec.name',
        	],function(na,nc){
                $scope.pub.groupTypeId=na[0]
                $scope.nowClass=na[1]
                console.log("监听分类选择变动，变动之后更改需要发表的值")
                console.log(na)
        		// console.log(nc[1].id)
    	}) 
        $scope.$watch("pub.title",function(na,nc){
            console.log(na.length)
            if(na.length>30){
                $scope.pub.title=na.substr(0,30);
                $scope.inhtml='标题不能超过30字';
                $scope.show=true;
                 $timeout(function() {
                    $scope.show=false;
                }, 3000);
            }
        });

        $scope.$watch("pub.htmlContent",function(nv,ov){
            console.log($scope.pub.htmlContent)
            $scope.artCon = $sce.trustAsHtml(nv);
            var str=nv;
            var imgReg = /<img.*?(?:>|\/>)/gi;
            //匹配src属性
            var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
            var arr = str.match(imgReg);
            $scope.pub.imgList=[];
            try{
                for (var i = 0; i < arr.length; i++) {
                 var src = arr[i].match(srcReg);
                 $scope.pub.imgList.push(src[1]);
                };
            }catch(e){
                console.log('lenght is null')
            }
            
            
            
        });
        $scope.artConPlace = $sce.trustAsHtml("<p>请编辑文章内容。</p>");

        if($scope.allx){
            $scope.pub.title=$scope.allx.title;
            $scope.pub.groupTypeId=$scope.allx.groupTypeId;
            $scope.sec.id=$scope.allx.groupTypeId;
            $scope.pub.top=$scope.allx.top;
            $scope.pub.htmlContent=$scope.allx.htmlContent;
            // $scope.
        }else{
            console.log('scope.allx 为空')
        }

        //获取分类模板
        $http.get(constant.APP_HOST+'/v1/aut/site/group/type',{
            headers:{
                    'Authorization':localStorageService.get("token")
            },  
        }).success(function(data){
            if(data.errMessage){

            }else{
                $scope.option_list=data.data;
                $scope.sec.groupTypeId=data.data[0].groupTypeId;
                // console.log($scope.option_list)
            }
            // console.log(data)
        })

        // 发布文章
        $scope.pubPost=function(){
            $scope.showyes=true;  
            var gosrc,xmsg;
            console.log($scope.pushTime);
            if($scope.pushTime){
            $scope.pub.pushTime=new Date($scope.pushTime).getTime();
            }
            // if($scope.pushTime){
            //     startTime = new Date($scope.pushTime + " 00:00:01").getTime();
            //     endTime = new Date($scope.pushTime + " 23:59:59").getTime();
            // }
            if($scope.allx){ 
                // 是修改
                console.log("变change");
                $scope.pub.groupTypeId=$scope.allx.id;
                gosrc='/v1/aut/site/group/update';
                xmsg='修改成功';
            }else{
                gosrc='/v1/aut/site/group';
                xmsg='发表成功';
           }    

                // 是发表新的

            $http.post(constant.APP_HOST+gosrc,$scope.pub,{
                headers:{
                    'Authorization':localStorageService.get("token")
                    },
                }).success(function(data){
                    if(data.errMessage){
                        $scope.inhtml=data.errMessage;
                        $scope.show=true;
                         $timeout(function() {
                            $scope.show=false;
                        }, 3000); 
                    }else{
                        $scope.inhtml=xmsg;
                        $scope.show=true;
                         $timeout(function() {
                            $scope.show=false;
                        }, 3000); 
                        $scope.pub.title='';
                        $scope.pub.htmlContent='';
                        $scope.pushTime=null;
                    }
                }).error(function(data){
                    console.log('可能网络有错误')
                })
            }

 







    }
]);
