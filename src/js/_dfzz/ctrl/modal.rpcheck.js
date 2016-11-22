var app = angular.module('uoudo.dfzz');
app.controller('rp_check',['$scope','$uibModalInstance','$http','localStorageService','constant','rp','$sce',
    function($scope,$uibModalInstance,$http,localStorageService,constant,rp,$sce){
        // /v1/aut/redpackage/details?id=1
        $http.get(constant.APP_HOST + '/v1/aut/redpackage/details', {
            headers: {
                'Authorization': localStorageService.get("token")
            },
            params:{
                id:rp.id
            }
        }).success(function(data){
            console.log(data);
            if(!data.errMessage){
                if(data.data.template){
                    $scope.imgList = data.data.template.imgList;
                    var content = data.data.template.content,tplCon;
                    if(content){
                        var start = content.indexOf('<body id="custom_style">') + 24,
                            end = content.indexOf("</body>");
                        if(start === 23){
                            start = content.indexOf('<body>') + 6;
                            if(start === 5){
                                start = 0;
                            }
                        }
                        if(end === -1){
                            tplCon = content.substring(start);
                        }else{
                            tplCon = content.substring(start,end);
                        }
                    }
                    $scope.tpl = $sce.trustAsHtml(tplCon);
                }
            }
        }).error(function(data){});

        $scope.step = 1;
    	$scope.rp = rp;
        if(rp.uCoin){
            $scope.rp.rpType = "手气红包";
        }else{
            if(rp.vip === 0){
                $scope.rp.rpType = "大众红包";
            }else{
                $scope.rp.rpType = "VIP红包";
            }
        }
        $scope.now = new Date().getTime();
        $scope.ok = function () {
        	$uibModalInstance.close();
    	};
    	$scope.cancel = function () {
    		$uibModalInstance.dismiss();
    	};
    }
]);
