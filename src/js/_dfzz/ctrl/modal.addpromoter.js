angular.module('uoudo.dfzz')
.controller('modal_addpromoter',['$scope','$uibModalInstance','constant','localStorageService','$http','$timeout',
    function($scope,$uibModalInstance,constant,localStorageService,$http,$timeout){
        console.log($scope);
        $scope.name = "";
        $scope.phoneNumber = "";
        $scope.remarks = "";
        $scope.clicked = false;
        $scope.ok = function () {
            if((!$scope.name || !$scope.phoneNumber) || $scope.clicked){
                return;
            }
            $scope.clicked = true;
            $http.post(constant.APP_HOST+'/v1/aut/promoter',{
                name:$scope.name,
                phoneNumber:$scope.phoneNumber,
                remarks:$scope.remarks
             },{
     			headers:{
     				'Authorization':localStorageService.get("token")
     			}
     		}).success(function(data){
                console.log("增加推广员");
                console.log(data);
                $scope.$$prevSibling.getList();
                if(data.errMessage){
                    $scope.msg = "";
                    $scope.err = "data.errMessage";
                }else{
                    $scope.msg = "增加推广员成功！";
                    $scope.err = "";
                }
                $timeout(function(){
                    $scope.name = "";
                    $scope.phoneNumber = "";
                    $scope.remarks = "";
                    $scope.msg = "";
                    $scope.err = "";
                    $scope.clicked = false;
                },1500);
            }).error(function(data){
                $scope.clicked = false;
            });
            // $uibModalInstance.close();
        };
    	$scope.cancel = function () {
    		$uibModalInstance.dismiss();
    	};
    }
]);
