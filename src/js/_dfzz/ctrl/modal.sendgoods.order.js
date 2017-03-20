var app = angular.module('uoudo.dfzz');
app.controller('sendGoods_order',['$scope','$uibModalInstance','sendGoodsInfo','$http','constant','localStorageService',
    function($scope,$uibModalInstance,sendGoodsInfo,$http,constant,localStorageService){

        console.log(sendGoodsInfo);

        $scope.sendGoodsInfo = sendGoodsInfo;
        $scope.mailType = {};//物流类型
        $scope.mailType.type = $scope.sendGoodsInfo.logistics[0].type;
        $scope.mailNumber = "";//运单号码
        $scope.selected = false;
        $scope.err = "";
        $scope.succ = "";
        $scope.mailName = "";

        $scope.$watch("mailType",function(n,o){
            angular.forEach($scope.sendGoodsInfo.logistics,function(i){
                if(n.type == i.type){
                    $scope.mailName = i.name;
                }
            });
        },true);

        $scope.confirm = function(){
            console.log($scope.mailNumber);
            console.log($scope.mailType);
            if($scope.mailNumber){
                $scope.selected = true;
            }
        };

        $scope.redo = function(){
            $scope.selected = false;
            $scope.err = "";
        };

        $scope.submit = function(){
            $http.post(constant.APP_HOST+'/v1/aut/goods/deliver',{
                id:$scope.sendGoodsInfo.id,
                mailType:$scope.mailType.type,
                mailNumber:$scope.mailNumber
            },{
                headers :{
    				'Authorization':localStorageService.get("token")
    			}
            }).success(function(data){
                console.log(data);
                if(data.errMessage){
    				$scope.err = data.errMessage;
                    $scope.succ = "";
    			}else{
                    $scope.err = "";
                    $scope.succ = "录入物流信息成功";
    				sendGoodsInfo.status = 3;
    			}
            }).error(function(data){});
        };

        $scope.ok = function () {
        	$uibModalInstance.close();
    	};
    	$scope.cancel = function () {
    		$uibModalInstance.dismiss();
    	};
    }
]);
