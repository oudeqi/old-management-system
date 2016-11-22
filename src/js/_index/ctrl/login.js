var app = angular.module('uoudo.index');
app.controller('login',['$scope','constant','$http','$timeout','localStorageService',
    function($scope,constant,$http,$timeout,localStorageService){

        $scope.errMsg = "";
        $scope.loading = false;
        $scope.phoneNumber = "";
        $scope.password = "";
        $scope.btnTxt = "登 录";
        $scope.remember = true;

        if(localStorageService.get('account_number')){
            $scope.phoneNumber = localStorageService.get('account_number');
        }

        $scope.userLogin = function(){
            console.log("userLogin");
            if($scope.loading){
                return;
            }
            if($scope.remember){
                localStorageService.set('account_number',$scope.phoneNumber);
            }else{
                localStorageService.remove('account_number');
            }
            $scope.loading = true;
            $scope.btnTxt = "登 录 ...";
            $http.post(constant.APP_HOST + 'v1/user/login', {
                phoneNumber: $scope.phoneNumber,
                password: $scope.password
            }).success(function(data){
                console.log(data);
                if(data.errMessage){
                    $scope.btnTxt = "登 录";
                    $scope.loading = false;
                    $scope.errMsg = data.errMessage;
                    $timeout(function(){
                        $scope.errMsg = "";
                    },2000);
                }else{
                    $scope.loading = true;
                    localStorageService.set('token',data.data.token);
                    localStorageService.set('userInfo',data.data);
                    $timeout(function(){
                        location.href = "./dfzz.html";
                    },1000);
                }
            }).error(function(data){
                $scope.errMsg = "服务器繁忙";
                $scope.loading = false;
                $scope.btnTxt = "登 录";
                $timeout(function(){
                    $scope.errMsg = "";
                },2000);
            });
        };
    }
]);
