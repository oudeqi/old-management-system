var app = angular.module('uoudo.dfzz');
app.controller('rp_put',['$scope','$uibModal','FileUploader','constant','localStorageService','$sce','$http','$filter','$state',
    function($scope,$uibModal,FileUploader,constant,localStorageService,$sce,$http,$filter,$state){

        $scope.startDisabledEnd = new Date();
        $scope.endDisabledEnd = new Date();

        $scope.rp = {};
        if(!!localStorageService.get('rp.put')){
            $scope.rp = localStorageService.get('rp.put');
        }else{
            $scope.rp = {
                deleteId:null,
                vip:2,//1vip，0大众 //2其他
                type:1,//红包类型  1为随机红包,2为平均红包
            	name:"",//投放品牌
            	logo:"",// 品牌标志
            	introduce1:"",//红包标题
            	uCoin:"1",//所需U币 ，大于0手气红包
                rate:"1",
                rounds:null,
            	stageNumber:null,//单期个数
            	count:null,//红包总数（前台算）
            	totalMoney:null,//总金钱（前台算）
            	beginTime:null,// 开始时间，只有vip红包，大众红包才需要
            	// endTime:null,//结束时间，只有vip红包，大众红包才需要
            	introduction:"",//分享摘要
            	shareImg:"",//分享小图
            	templateType:2,//模板类型 (1=视频模版,2=图文模  版)
            	template:{
            		imgList:[],//红包轮播图list
            		content:"",//内容或者html
            		videoUrl:"",//视频地址
            		imageUrl:"",//视频封面地址
            	}
            };
        }

        $scope.$watchGroup([
            'rp.type',
            'rp.name',
            'rp.logo',
            'rp.introduce1',
            'rp.uCoin',
            'rp.rounds',
            'rp.introduction',
            'rp.shareImg',
            'rp.templateType',
            'rp.template.content',
            'rp.template.videoUrl',
            'rp.template.imageUrl'
        ],function(){
            $scope.saveRp();
        });
        $scope.$watchGroup([
            'rp.stageNumber',
            'rp.rounds',
            'rp.totalMoney',
            'rp.count',
            'rp.beginTime',
            // 'rp.endTime',
            'rp.vip'
        ],function(arr){
            console.log(arr);
            $scope.saveRp();
            if($scope.rp.vip === 0 || $scope.rp.vip === 1){
                if(!arr[2] || !arr[3] || !arr[4]){// || !arr[5]
                    $scope.step1Invalid = true;
                }else{
                    $scope.step1Invalid = false;
                }
            }else if($scope.rp.vip === 2){
                if(!arr[0] || !arr[1]){
                    $scope.step1Invalid = true;
                }else{
                    $scope.step1Invalid = false;
                }
            }
        });
        $scope.$watchCollection('rp.template.imgList',function(){
            $scope.saveRp();
        });

        $scope.xx = function(){
            console.log($scope.rp);
        };

        $scope.changeRpType = function(i){
            if($scope.rp.vip !== i){
                $scope.rp.vip = i;
                if($scope.rp.vip === 2){
                    $scope.rp.uCoin = "1";
                    $scope.rp.rate = "1";
                    $scope.rp.stageNumber = null;
                    $scope.rp.rounds = null;
                }
            }
        };
        $scope.putstep = 1;//红包发布的当前步数
        $scope.next = function(i){
            $scope.putstep = $scope.putstep + i;
        };
        $scope.saveRp = function(){
            localStorageService.set('rp.put',$scope.rp);
        };
        $scope.removeCache = function(){
            localStorageService.remove('rp.put');
        };
        $scope.cleanAndRefresh = function(){
            $scope.removeCache();
            $scope.rp = {
                deleteId:null,
                vip:2,//1vip，0大众 //2其他
                type:1,//红包类型  1为随机红包,2为平均红包
            	name:"",//投放品牌
            	logo:"",// 品牌标志
            	introduce1:"",//红包标题
            	uCoin:"1",//所需U币 ，大于0手气红包
                rate:"1",
                rounds:null,
            	stageNumber:null,//单期个数
            	count:null,//红包总数（前台算）
            	totalMoney:null,//总金钱（前台算）
            	beginTime:null,// 开始时间，只有vip红包，大众红包才需要
            	// endTime:null,//结束时间，只有vip红包，大众红包才需要
            	introduction:"",//分享摘要
            	shareImg:"",//分享小图
            	templateType:2,//模板类型 (1=视频模版,2=图文模  版)
            	template:{
            		imgList:[],//红包轮播图list
            		content:"",//内容或者html
            		videoUrl:"",//视频地址
            		imageUrl:"",//视频封面地址
            	}
            };
            $state.go("rp_put",{},{reload:true});
        };
        $scope.retry = function(){
            $state.go("rp_put",{},{reload:true});
        };

        // 上传logo
        $scope.clickAddLogo = function(){
            document.getElementById("uploadLogo").click();
        };
        var uploadLogo = $scope.uploadLogo = new FileUploader({
            url : constant.APP_HOST + "v1/ad/adCoverImg",
            removeAfterUpload : true,
            formData :[{token:localStorageService.get('token')}]
        });
        uploadLogo.onAfterAddingFile = function(fileItem) {
            fileItem.alias="file";
            $scope.uploadLogo.queue[0].upload();
        };
        uploadLogo.onSuccessItem  = function(item,response){
            console.log(response);
            // TODO 上传后的图片不能再次上传
            if(item.isSuccess){
                var modalInstance = $uibModal.open({
                    backdrop:'static',
                    animation: true,
                    windowClass: 'modal-cutpic',
                    templateUrl: './tpl/_dfzz/modal.cutpic.html',
                    controller: 'cutlogo',
                    size: 'lg',
                    resolve: {
                        imgSrc: function () {
                            return response;
                        }
                    }
                });
                modalInstance.result.then(function (data) {
                    console.info(data);
                    $scope.rp.logo = data;
                }, function () {
                    console.info('模态框取消: ' + new Date());
                });
            }
        };

        // 上传大图
        $scope.clickAddBigImg = function(){
            document.getElementById("uploadBigImg").click();
        };
        var uploadBigImg = $scope.uploadBigImg = new FileUploader({
            url : constant.APP_HOST + "v1/ad/adCoverImg",
            removeAfterUpload : true,
            formData :[{token:localStorageService.get('token')}]
        });
        uploadBigImg.onAfterAddingFile = function(fileItem) {
            fileItem.alias="file";
            $scope.uploadBigImg.queue[0].upload();
        };
        uploadBigImg.onSuccessItem  = function(item,response){
            console.log(response);
            if(item.isSuccess){
                var modalInstance = $uibModal.open({
                    backdrop:'static',
                    animation: true,
                    windowClass: 'modal-cutpic',
                    templateUrl: './tpl/_dfzz/modal.cutpic.html',
                    controller: 'cutBigImg',
                    size: 'lg',
                    resolve: {
                        imgSrc: function () {
                            return response;
                        }
                    }
                });
                modalInstance.result.then(function (data) {
                    $scope.rp.template.imgList.push(data);
                    $scope.TplCurrImg = $scope.rp.template.imgList.length - 1;
                    console.log($scope.rp.template.imgList);
                }, function () {
                    console.info('模态框取消: ' + new Date());
                });
            }
        };
        $scope.TplCurrImg = $scope.rp.template.imgList.length - 1;
        $scope.setTplImgView = function(i){
            $scope.TplCurrImg = i;
        };
        $scope.delTplImg = function(i){
            $scope.rp.template.imgList.splice(i,1);
            if(i === $scope.TplCurrImg){
                $scope.TplCurrImg = $scope.rp.template.imgList.length - 1;
            }
        };
        $scope.author = localStorageService.get('userInfo').nickName;
        $scope.rpTplsContent = $sce.trustAsHtml($scope.rp.template.content);
        $scope.$watch("rp.template.content",function(nv,ov){
            $scope.rpTplsContent = $sce.trustAsHtml(nv);
        });

        // 上传分享小图
        $scope.clickAddShareIcon = function(){
            document.getElementById("uploadShareIcon").click();
        };
        var uploadShareIcon = $scope.uploadShareIcon = new FileUploader({
            url : constant.APP_HOST + "v1/ad/adCoverImg",
            removeAfterUpload : true,
            formData :[{token:localStorageService.get('token')}]
        });
        uploadShareIcon.onAfterAddingFile = function(fileItem) {
            fileItem.alias="file";
            $scope.uploadShareIcon.queue[0].upload();
        };
        uploadShareIcon.onSuccessItem  = function(item,response){
            console.log(response);
            if(item.isSuccess){
                var modalInstance = $uibModal.open({
                    backdrop:'static',
                    animation: true,
                    windowClass: 'modal-cutpic',
                    templateUrl: './tpl/_dfzz/modal.cutpic.html',
                    controller: 'cutlogo',
                    size: 'lg',
                    resolve: {
                        imgSrc: function () {
                            return response;
                        }
                    }
                });
                modalInstance.result.then(function (data) {
                    console.info(data);
                    $scope.rp.shareImg = data;
                }, function () {
                    console.info('模态框取消: ' + new Date());
                });
            }
        };



        // 上传文章顶图
        $scope.now = new Date().getTime();
        $scope.clickAddAtcTop = function(){
            document.getElementById("uploadAtcTop").click();
        };
        var uploadAtcTop = $scope.uploadAtcTop = new FileUploader({
            url : constant.APP_HOST + "v1/ad/adCoverImg",
            removeAfterUpload : true,
            formData :[{token:localStorageService.get('token')}]
        });
        uploadAtcTop.onAfterAddingFile = function(fileItem) {
            fileItem.alias="file";
            $scope.uploadAtcTop.queue[0].upload();
        };
        uploadAtcTop.onSuccessItem  = function(item,response){
            console.log(response);
            if(item.isSuccess){
                var modalInstance = $uibModal.open({
                    backdrop:'static',
                    animation: true,
                    windowClass: 'modal-cutpic',
                    templateUrl: './tpl/_dfzz/modal.cutpic.html',
                    controller: 'cutAtcTop',
                    size: 'lg',
                    resolve: {
                        imgSrc: function () {
                            return response;
                        }
                    }
                });
                modalInstance.result.then(function (data) {
                    console.log(data);
                    $scope.rp.template.imageUrl = data;
                }, function () {
                    console.info('模态框取消: ' + new Date());
                });
            }
        };



        /*
        URL配置:/v1/aut/redpackage POST
        Method:POST
        {
        	"type":"1",红包类型  1为随机红包,2为平均红包
        	"name":"",投放品牌
        	"logo":"", 品牌标志
        	"introduce1":"",红包标题
        	"uCoin":"",所需U币
        	"stageNumber":"",单期个数
        	"count":"",红包总数  （前台算）
        	"totalMoney":"",总金钱 （前台算）
        	"beginTime":"", 开始时间， 手气红包不需要
        	private Timestamp endTime;结束时间 手气红包不需要
        	"introduction":"",分享摘要
        	"shareImg":"",分享小图
        	"templateType":"",模板类型 (1=视频模版,2=图文模版)
        	template:{
        		"imgList":[],红包轮播图list
        		"content":"",内容或者html
        		"videoUrl":"",视频地址
        		"imageUrl":"",视频封面地址
        	}
        }
         */
        $scope.rpPutLoading = false;
        $scope.rpPut = function(){
            if($scope.rpPutLoading){
                return;
            }
            $scope.rpPutLoading = true;
            /*
            uCoin:$scope.rp.uCoin*100,//所需U币
            stageNumber:$scope.rp.stageNumber,//单期个数
            count:$scope.rp.rounds*$scope.rp.stageNumber,//红包总数  （前台算）rp.rounds*rp.stageNumber
            totalMoney:$filter('parseNumber')($scope.rp.rounds*$scope.rp.stageNumber*$scope.rp.uCoin*$scope.rp.rate*0.1,2),//总金钱 （前台算）rp.uCoin * rp.rate * 0.1 * rp.stageNumber * rp.rounds
            beginTime:$scope.rp.beginTime,// 开始时间， 手气红包不需要
            endTime:$scope.rp.endTime,//结束时间，只有vip红包，大众红包才需要
             */
            var uCoin,stageNumber,count,totalMoney,beginTime,vip;//,endTime
            if($scope.rp.vip === 0 || $scope.rp.vip === 1){ //大众红包 //vip红包
                vip = $scope.rp.vip;
                uCoin = "";
                stageNumber = "";
                count = $scope.rp.count;
                totalMoney = $scope.rp.totalMoney;
                beginTime = new Date($scope.rp.beginTime).getTime();
                // endTime = new Date($scope.rp.endTime).getTime();
            }else{//手气红包
                vip = 0;
                uCoin = $scope.rp.uCoin*100;
                stageNumber = $scope.rp.stageNumber;
                count = $scope.rp.rounds*$scope.rp.stageNumber;
                totalMoney = $filter('parseNumber')($scope.rp.rounds*$scope.rp.stageNumber*$scope.rp.uCoin*$scope.rp.rate*0.1,2);
                beginTime = null;
                // endTime = null;
            }
            $http.post(constant.APP_HOST+'/v1/aut/redpackage',{
                deleteId:$scope.rp.deleteId,
                vip:vip,
                type:$scope.rp.type,//红包类型  1为随机红包,2为平均红包
                name:$scope.rp.name,//投放品牌
                logo:$scope.rp.logo,// 品牌标志
                introduce1:$scope.rp.introduce1,//红包标题
                uCoin:uCoin,//所需U币
                stageNumber:stageNumber,//单期个数
                count:count,//红包总数  （前台算）rp.rounds*rp.stageNumber
                totalMoney:totalMoney,//总金钱 （前台算）rp.uCoin * rp.rate * 0.1 * rp.stageNumber * rp.rounds
                beginTime:beginTime,// 开始时间， 手气红包不需要
                // endTime:endTime,//结束时间，只有vip红包，大众红包才需要
                introduction:$scope.rp.introduction,//分享摘要
                shareImg:$scope.rp.shareImg,//分享小图
                templateType:$scope.rp.templateType,//模板类型 (1=视频模版,2=图文模版)
                template:{
                	imgList:$scope.rp.template.imgList,//红包轮播图list
                	content:constant.UMEDITOR_CONTENT_HEADER + $scope.rp.template.content + constant.UMEDITOR_CONTENT_FOOTER,//内容或者html
                	videoUrl:$scope.rp.template.videoUrl,//视频地址
                	imageUrl:$scope.rp.template.imageUrl,//视频封面地址
                }
             },{
     			headers:{
     				'Authorization':localStorageService.get("token")
     			}
     		}).success(function(data){
                console.log(data);
                $scope.rpPutLoading = false;
                $scope.putstep = 4;
                if(data.errMessage){
                    $scope.putRpResult = 0;
                    $scope.errMessage = data.errMessage;
                }else{
                    $scope.putRpResult = 1;
                }
            }).error(function(data){
                $scope.rpPutLoading = false;
                $scope.putRpResult = 0;
                $scope.putstep = 4;
            });
        };
    }
]);
