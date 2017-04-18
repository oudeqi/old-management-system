var app = angular.module('uoudo.dfzz');
app.controller('vote_list',['$scope','$http','constant','localStorageService','FileUploader','$uibModal','$state','$timeout','$sce','$filter',
    function($scope,$http,constant,localStorageService,FileUploader,$uibModal,$state,$timeout,$sce,$filter){


        $scope.maxSize = 5;

        $scope.status = "0";//0全部， 1未开始 2报名中 3报名已结束
        $scope.keywords = "";
        $scope.currentPage = 1;
        $scope.pageSize = 20;
        $scope.totalItems = 0;
        $scope.list = [];

        $scope.getList = function(){
            $http.get(constant.APP_HOST + '/v1/aut/vote/list', {
                headers: {
                    'Authorization': localStorageService.get("token")
                },
                params:{
                    search:$scope.keywords,
                    status:$scope.status,
                    pageSize:$scope.pageSize,
                    pageIndex:$scope.currentPage
                }
            }).success(function(res) {
                console.log("获取投票列表：",res);
                $scope.list = res.data;
                $scope.totalItems = res.rowCount;
                $scope.currentPage = res.pageIndex;
            }).error(function(data) {

            });
        };
        $scope.getList();

        $scope.changeType = function(){
            $scope.currentPage = 1;
            $scope.getList();
        };

        $scope.search = function(e){
            if(e && e.keyCode !== 13){
                return;
            }
            $scope.currentPage = 1;
            $scope.getList();
        };
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

        $scope.voteDel = function(item){
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
                $http.get(constant.APP_HOST + '/v1/aut/vote/delete?id='+item.id, {
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

        $scope.setPosition = function(item){
            var modalInstance = $uibModal.open({
                backdrop:'static',
                animation: true,
                windowClass: 'modal-setposition',
                templateUrl: './tpl/_dfzz/modal.setvoteposition.html',
                controller: 'setPosition',
                size: 'lg',
                resolve: {
                    vote: function () {
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

app.controller("setPosition",["$scope","vote","$uibModalInstance","FileUploader","constant","localStorageService","$uibModal","$http",
    function($scope,vote,$uibModalInstance,FileUploader,constant,localStorageService,$uibModal,$http){
        console.log(vote);

        $scope.position = {
            posi:[0,0],
            setTop:0, //0 不置顶，1置顶
            circlePosi:[0,0,0], //2，本地圈，3圈外圈，4朋友圈
            indexPic:'',//咨询首页图片
            circlePic:'',//圈子图片
        };
        function has(array,ele){
            if(array instanceof Array){
                for (var i = 0; i < array.length; i++) {
                    if(array[i] === ele){
                        return true;
                    }
                }
                return false;
            }
            return false;
        }

        $scope.posiChange = function(){
            console.log($scope.position.posi);
            if($scope.position.posi[1] === 1){
                $scope.position.circlePosi[0] = 1;
            }else{
                $scope.position.circlePosi[0] = 0;
                $scope.position.circlePosi[1] = 0;
                $scope.position.circlePosi[2] = 0;
            }
        };
        $scope.circlePosiChange = function(){
            console.log($scope.position.circlePosi);
            if($scope.position.circlePosi[0] === 0 && $scope.position.circlePosi[1] === 0 && $scope.position.circlePosi[2] === 0){
                $scope.position.posi[1] = 0;
            }else{
                $scope.position.posi[1] = 1;
            }
        };

        $http.get(constant.APP_HOST + '/v1/aut/vote/app/publish?id='+vote.id, {
            headers: {
                'Authorization': localStorageService.get("token")
            }
        }).success(function(data) {
            console.log("获取投放设置",data);
            if(!data.errMessage){
                if(!!data.data.infoImg){
                    $scope.position.posi[0] = 1;
                }else{
                    $scope.position.posi[0] = 0;
                }
                if(!!data.data.worldImg){
                    $scope.position.posi[1] = 1;
                }else{
                    $scope.position.posi[1] = 0;
                }
                $scope.position.setTop = data.data.top;
                $scope.position.indexPic = data.data.infoImg;
                $scope.position.circlePic = data.data.worldImg;
                if(has(data.data.types,2)){
                    $scope.position.circlePosi[0] = 1;
                }else{
                    $scope.position.circlePosi[0] = 0;
                }
                if(has(data.data.types,3)){
                    $scope.position.circlePosi[1] = 1;
                }else{
                    $scope.position.circlePosi[1] = 0;
                }
                if(has(data.data.types,4)){
                    $scope.position.circlePosi[2] = 1;
                }else{
                    $scope.position.circlePosi[2] = 0;
                }
            }
        }).error(function(data) {});

        $scope.delIndexPic = function(){
            $scope.position.indexPic = '';
        };
        $scope.delCirclePic = function(){
            $scope.position.circlePic = '';
        };

        $scope.addIndexPic = function(){
            document.getElementById("uploadIndexPic").click();
        };
        $scope.addCirclePic = function(){
            document.getElementById("uploadCirclePic").click();
        };
        var uploadIndexPic = $scope.uploadIndexPic = new FileUploader({
            url : constant.APP_HOST + "v1/ad/adCoverImg",
            removeAfterUpload : true,
            formData :[{token:localStorageService.get('token')}]
        });
        uploadIndexPic.onAfterAddingFile = function(fileItem) {
            fileItem.alias="file";
            $scope.uploadIndexPic.queue[0].upload();
        };
        uploadIndexPic.onSuccessItem  = function(item,response){
            console.log(response);
            if(item.isSuccess){
                var modalInstance = $uibModal.open({
                    backdrop:'static',
                    animation: true,
                    windowClass: 'modal-cutpic',
                    templateUrl: './tpl/_dfzz/modal.cutpic.html',
                    controller: 'cutVotePosiIndexPic',
                    size: 'lg',
                    resolve: {
                        imgSrc: function () {
                            return response;
                        }
                    }
                });
                modalInstance.result.then(function (res) {
                    console.log(res);
                    $scope.position.indexPic = res;
                }, function () {
                    console.info('模态框取消: ' + new Date());
                });
            }
        };

        var uploadCirclePic = $scope.uploadCirclePic = new FileUploader({
            url : constant.APP_HOST + "v1/ad/adCoverImg",
            removeAfterUpload : true,
            formData :[{token:localStorageService.get('token')}]
        });
        uploadCirclePic.onAfterAddingFile = function(fileItem) {
            fileItem.alias="file";
            $scope.uploadCirclePic.queue[0].upload();
        };
        uploadCirclePic.onSuccessItem  = function(item,response){
            console.log(response);
            if(item.isSuccess){
                var modalInstance = $uibModal.open({
                    backdrop:'static',
                    animation: true,
                    windowClass: 'modal-cutpic',
                    templateUrl: './tpl/_dfzz/modal.cutpic.html',
                    controller: 'cutVotePosiCirclePic',
                    size: 'lg',
                    resolve: {
                        imgSrc: function () {
                            return response;
                        }
                    }
                });
                modalInstance.result.then(function (res) {
                    console.log(res);
                    $scope.position.circlePic = res;
                }, function () {
                    console.info('模态框取消: ' + new Date());
                });
            }
        };

        function validData(fn){
            var isOk = true;
            var errMsg = '';
            if($scope.position.posi[0] !== 1 && $scope.position.posi[1] !== 1){
                isOk = false;
                errMsg = '请选择投放位置！';
            }
            if($scope.position.posi[0] === 1 && !$scope.position.indexPic){
                isOk = false;
                errMsg = '选择投放到咨询首页，则咨询首页活动图片不能为空！';
            }
            if($scope.position.posi[1] === 1 && !$scope.position.circlePic){
                isOk = false;
                errMsg = '选择投放到圈子，则圈子的活动图片不能为空！';
            }
            if($scope.position.posi[1] === 1 && $scope.position.circlePosi[0] !== 1 && $scope.position.circlePosi[1] !== 1 && $scope.position.circlePosi[2] !== 1){
                isOk = false;
                errMsg = '选择投放到圈子，也需要选择投放到圈子的哪个位置！';
            }
            fn(isOk,errMsg);
        }

        $scope.succMsg = '';
        $scope.errMsg = '';

        $scope.ok = function () {
            console.log($scope.position);
            validData(function(isOk,errMsg){
                console.log(isOk);
                $scope.errMsg = errMsg;
                $scope.succMsg = '';
                if(!isOk){
                    return;
                }
                var types = [];
                if($scope.position.circlePosi[0] === 1){
                    types.push(2);
                }
                if($scope.position.circlePosi[1] === 1){
                    types.push(3);
                }
                if($scope.position.circlePosi[2] === 1){
                    types.push(4);
                }
                var infoImg,worldImg;
                if($scope.position.posi[0] === 0){
                    infoImg = '';
                }else{
                    infoImg = $scope.position.indexPic;
                }
                if($scope.position.posi[1] === 0){
                    worldImg = '';
                }else{
                    worldImg = $scope.position.circlePic;
                }
                $http.post(constant.APP_HOST+'/v1/aut/vote/app/publish',{
                    voteSetId:vote.id,
                    top:$scope.position.setTop,
                    infoImg:infoImg,
                    worldImg:worldImg,
                    types:types
                 },{
                    headers:{
                        'Authorization':localStorageService.get("token")
                    }
                }).success(function(data){
                    console.log(data);
                    if(data.errMessage){
                        $scope.errMsg = data.errMessage;
                        $scope.succMsg = "";
                    }else{
                        $scope.errMsg = "";
                        $scope.succMsg = "设置成功";
                    }
                }).error(function(data){
                    $scope.errMsg = "出现异常错误，请重试！";
                    $scope.succMsg = "";
                });
            });
            // $uibModalInstance.close();
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }
]);

app.controller('cutVotePosiIndexPic', ['$scope','$http','$uibModalInstance','constant','imgSrc','$timeout',
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
                $scope.msg = "图片裁剪的最小尺寸为 80*80 px";
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
    				console.log(a);
    				console.log(b);
    				console.log(c);
                    $scope.loading = false;
    			});
    		}
    	};
    	$scope.cancel = function () {
    		$uibModalInstance.dismiss();
    	};
    }
]);

app.controller('cutVotePosiCirclePic', ['$scope','$http','$uibModalInstance','constant','imgSrc','$timeout',
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
                $scope.msg = "图片裁剪的最小尺寸为 80*80 px";
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
    				console.log(a);
    				console.log(b);
    				console.log(c);
                    $scope.loading = false;
    			});
    		}
    	};
    	$scope.cancel = function () {
    		$uibModalInstance.dismiss();
    	};
    }
]);
