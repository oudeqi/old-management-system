var app = angular.module('uoudo.index');
app.controller('secl_type',['$scope','$rootScope','$state',
    function($scope,$rootScope,$state){
        console.log("secl_type.........");
        /**
         * [loginType 代表登录类型]
         * 0 地方站长
         * 1 媒体主
         * 2 广告主
         * 3 推广商
         */
        $scope.changeLoginType = function(i){
            $rootScope.loginType = i;
            $state.go("login");
        };
    }
]);
