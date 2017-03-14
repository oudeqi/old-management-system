angular.module('uoudo.dfzz')
.controller('cutlogo', ['$scope','$http','$uibModalInstance','constant','imgSrc','$timeout',
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
                aspectRatio: 1,
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
app.controller('cutLittleUrl', ['$scope','$http','$uibModalInstance','constant','imgSrc','$timeout',
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
                aspectRatio: 16/11,
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
app.controller('cutBigImg', ['$scope','$http','$uibModalInstance','constant','imgSrc','$timeout',
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
                aspectRatio: 0.5622188905547226,
                setSelect: [0, 0, 800,800],
                boxWidth: 800,
                boxHeight:550
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
            if(postData.width<400){
                $scope.msg = "图片裁剪的最小宽度为 400 px";
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
app.controller('cutAtcTop', ['$scope','$http','$uibModalInstance','constant','imgSrc','$timeout',
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
                aspectRatio: 1.5625,
                setSelect: [0, 0, 800,800],
                boxWidth: 800,
                boxHeight:550
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
            if(postData.width<400){
                $scope.msg = "图片裁剪的最小宽度为 640 px";
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
app.controller('cutArtPic', ['$scope','$http','$uibModalInstance','constant','imgSrc','$timeout','$q',
    function ($scope,$http,$uibModalInstance,constant,imgSrc,$timeout,$q) {
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
                aspectRatio: 375/180,
                setSelect: [0, 0, 800,800],
                boxWidth: 800,
                boxHeight:550
            });
        };
        function showPreview(c){
            postData.x = c.x;
            postData.y = c.y;
            postData.width = c.w;
            postData.height = c.h;
        }
        function allOk(values){
            angular.forEach(values,function(ele,index){
                if(ele.status !== 200 || ele.data.errMessage){
                    return false;
                }
            });
            return true;
        }
    	$scope.ok = function () {
            console.log(postData);
            if(postData.width<400){
                $scope.msg = "图片裁剪的最小宽度为 640 px";
            }else{
                $scope.msg = "";
                $scope.loading = true;

                //postData 封面大图 aspectRatio: 375:180,
                //postData 封面小图 aspectRatio: 16:11,
                var postDataSm = {
            		x:(postData.width - 16/11*postData.height) / 2 + postData.x,
            		y:postData.y,
            		width:16/11*postData.height,
            		height:postData.height,
            		imgUrl:imgSrc
            	};
                //postData 视频封面图 aspectRatio: 375:310,
                var postDataVideo = {
                    x:(postData.width - 375/310*postData.height) / 2 + postData.x,
            		y:postData.y,
            		width:375/310*postData.height,
            		height:postData.height,
            		imgUrl:imgSrc
            	};
                //postData 分享小图 aspectRatio: 1:1,
                var postDataShare = {
                    x:(postData.width - postData.height) / 2 + postData.x,
            		y:postData.y,
            		width:postData.height,
            		height:postData.height,
            		imgUrl:imgSrc
                };

                $q.all([
                    $http.post(constant.APP_HOST + '/v1/uploade/cut',postData),
                    $http.post(constant.APP_HOST + '/v1/uploade/cut',postDataSm),
                    $http.post(constant.APP_HOST + '/v1/uploade/cut',postDataVideo),
                    $http.post(constant.APP_HOST + '/v1/uploade/cut',postDataShare)
                ]).then(function(values) {
                    $scope.loading = false;
                    if(allOk(values)){
                        $scope.msg = "";
                        $timeout(function(){
                            $uibModalInstance.close(values);
                        },300);
                    }else{
                        $scope.msg = data.errMessage;
                    }
                });
    		}
    	};
    	$scope.cancel = function () {
    		$uibModalInstance.dismiss();
    	};
    }
]);
app.controller('cutCirPub', ['$scope','$http','$uibModalInstance','constant','imgSrc','$timeout','$q',
    function ($scope,$http,$uibModalInstance,constant,imgSrc,$timeout,$q) {
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
                aspectRatio: 1.448717948717949,
                setSelect: [0, 0, 800,800],
                boxWidth: 800,
                boxHeight:550
            });
        };
        function showPreview(c){
            postData.x = c.x;
            postData.y = c.y;
            postData.width = c.w;
            postData.height = c.h;
        }
        function allOk(values){
            angular.forEach(values,function(ele,index){
                if(ele.status !== 200 || ele.data.errMessage){
                    return false;
                }
            });
            return true;
        }
        $scope.ok = function () {
            console.log(postData);
            if(postData.width<200){
                $scope.msg = "图片裁剪的最小宽度为 200 px";
            }else{
                $scope.msg = "";
                $scope.loading = true;

                //postData 封面大图 aspectRatio: 375:180,
                //postData 封面小图 aspectRatio: 16:11,
                var postDataSm = {
                    x:(postData.width - 16/11*postData.height) / 2 + postData.x,
                    y:postData.y,
                    width:16/11*postData.height,
                    height:postData.height,
                    imgUrl:imgSrc
                };
                //postData 视频封面图 aspectRatio: 375:310,
                var postDataVideo = {
                    x:(postData.width - 375/310*postData.height) / 2 + postData.x,
                    y:postData.y,
                    width:375/310*postData.height,
                    height:postData.height,
                    imgUrl:imgSrc
                };
                //postData 分享小图 aspectRatio: 1:1,
                var postDataShare = {
                    x:(postData.width - postData.height) / 2 + postData.x,
                    y:postData.y,
                    width:postData.height,
                    height:postData.height,
                    imgUrl:imgSrc
                };

                $q.all([
                    $http.post(constant.APP_HOST + '/v1/uploade/cut',postData),
                    $http.post(constant.APP_HOST + '/v1/uploade/cut',postDataSm),
                    $http.post(constant.APP_HOST + '/v1/uploade/cut',postDataVideo),
                    $http.post(constant.APP_HOST + '/v1/uploade/cut',postDataShare)
                ]).then(function(values) {
                    $scope.loading = false;
                    if(allOk(values)){
                        $scope.msg = "";
                        $timeout(function(){
                            $uibModalInstance.close(values);
                        },300);
                    }else{
                        $scope.msg = data.errMessage;
                    }
                });
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }
]);


// goods裁剪
app.controller('cutGoodsAddNew', ['$scope','$http','$uibModalInstance','constant','imgSrc','$timeout',
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
                aspectRatio: 800/450,
                setSelect: [0, 0, 800,800],
                boxWidth: 800,
                boxHeight:450
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
            if(postData.width<400){
                $scope.msg = "图片裁剪的最小宽度为 400 px";
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
                    $scope.loading = false;
                });
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }
]);
app.controller('cutGoodsnohot', ['$scope','$http','$uibModalInstance','constant','imgSrc','$timeout',
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
                aspectRatio: 800/450,
                setSelect: [0, 0, 800,800],
                boxWidth: 800,
                boxHeight:450
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
            if(postData.width<400){
                $scope.msg = "图片裁剪的最小宽度为 400 px";
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
                    $scope.loading = false;
                });
            }
        };
        $scope.cancel = function () {
            $uibModalInstance.dismiss();
        };
    }
]);





//裁剪夺宝
app.controller('cutTreasurePic', ['$scope','$http','$uibModalInstance','constant','imgSrc','$timeout',
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
                aspectRatio: 2,
                setSelect: [0, 0, 800,800],
                boxWidth: 800,
                boxHeight:550
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
            if(postData.width<400){
                $scope.msg = "图片裁剪的最小宽度为 640 px";
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
                    $scope.loading = false;
    			});
    		}
    	};
    	$scope.cancel = function () {
    		$uibModalInstance.dismiss();
    	};
    }
]);

// 裁剪任务封面图，banner图
app.controller('cutTaskImg', ['$scope','$http','$uibModalInstance','constant','imgSrc','$timeout',
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
                aspectRatio: 356/205,
                setSelect: [0, 0, 800,800],
                boxWidth: 800,
                boxHeight:550
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
            if(postData.width<400){
                $scope.msg = "图片裁剪的最小宽度为 400 px";
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
                    $scope.loading = false;
    			});
    		}
    	};
    	$scope.cancel = function () {
    		$uibModalInstance.dismiss();
    	};
    }
]);
