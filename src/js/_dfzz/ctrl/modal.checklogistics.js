var app = angular.module('uoudo.dfzz');
app.controller('checkLogistics',['$scope','$uibModalInstance','logisticsInfo','$http','constant','localStorageService',
    function($scope,$uibModalInstance,logisticsInfo,$http,constant,localStorageService){

        $scope.logisticsInfo = logisticsInfo;
console.log($scope.logisticsInfo);
        $scope.sellerAlterFlag = false;
        $scope.alterSeller = function(){
            $scope.sellerAlterFlag = true;
        };
        $scope.alterSellerCancel = function(){
            $scope.sellerAlterFlag = false;
            $scope.logisticsInfo.type2 = $scope.logisticsInfo.type;
        };

        $scope.noAlterFlag = false;
        $scope.alterNo = function(){
            $scope.noAlterFlag = true;
        };
        $scope.alterNoCancle = function(){
            $scope.noAlterFlag = false;
            $scope.logisticsInfo.number2 = $scope.logisticsInfo.number;
        };

        $scope.alterLogistics = function(e){
            if($scope.logisticsInfo.number2 && $scope.logisticsInfo.number2 && e.keyCode == 13){
                $http.post(constant.APP_HOST+'/v1/aut/lucky/deliver',{
                    id:$scope.logisticsInfo.id,
                    stage:$scope.logisticsInfo.stage,
                    mailType:$scope.logisticsInfo.type2,
                    mailNumber:$scope.logisticsInfo.number2
                 },{
         			headers:{
         				'Authorization':localStorageService.get("token")
         			}
         		}).success(function(data){
    				console.log(data);
    				if(!data.errMessage){
                        $scope.sellerAlterFlag = false;
                        $scope.noAlterFlag = false;
                        $scope.logisticsInfo.type = $scope.logisticsInfo.type2;
    					$scope.logisticsInfo.number = $scope.logisticsInfo.number2;
                        $scope.logisticsInfo.typeName = "";
    				}
    			}).error(function(data){});
    		}
        };

        $scope.ok = function () {
        	$uibModalInstance.close();
    	};
    	$scope.cancel = function () {
    		$uibModalInstance.dismiss();
    	};
    }
]);
app.directive('oneWayBind',function(){
    return {
        restrict:'A',
        require: 'ngModel',
        scope:{
            oneWayBind:"@"
        },
        link:function(scope,elem,attrs,modelCtr){
            console.log(scope);
            console.log(modelCtr);
        }
    };
});
