
var app = angular.module('uoudo.index',[
    'ui.router',
    'LocalStorageModule',
    'angularFileUpload',
    // 'tpl.index'
]);

app.constant("constant",{
  APP_HOST : "http://192.168.10.254:8082/", //远程接口
  // APP_HOST : "http://partner.uoolle.com/",
});

app.run(['$rootScope','$state',
    function($rootScope,$state) {
        /**
         * [loginType 代表登录类型]
         * 0 地方站长
         * 1 媒体主
         * 2 广告主
         * 3 推广商
         */
        // $rootScope.loginType = 0; //登录类型
        $rootScope.loginTit = ["地方站长登录","媒体主登录","广告主登录","推广商登录"];

        // 监听路由改变成功
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
            // console.log(fromState,toState,$rootScope.loginType);
            if(toState.name === "login" && $rootScope.loginType !== 0 && $rootScope.loginType !== 1 && $rootScope.loginType !== 2 && $rootScope.loginType !== 3){
                event.preventDefault();
                $state.go("secl");
            }
        });
    }
]);

// app.config(['$locationProvider',
//     function($locationProvider) {
//         $locationProvider.html5Mode({enabled: true, requireBase: false});
//     }
// ]);

app.config(['localStorageServiceProvider',
    function(localStorageServiceProvider){
        localStorageServiceProvider.setPrefix('uoudo');
    }
]);

app.config(['$stateProvider','$urlRouterProvider',
    function($stateProvider,$urlRouterProvider){
        $urlRouterProvider.otherwise("/");
        $stateProvider
        .state('secl', {
            url: "/",
            templateUrl: "./tpl/_index/secl-type.html",
            controller: 'secl_type',
        }).state('login', {
            url: "/login",
            templateUrl: "./tpl/_index/login.html",
            controller: 'login',
        }).state('reg', {
            url: "/reg",
            templateUrl: "./tpl/_index/reg.html",
            controller: 'reg',
        }).state('forget', {
            url: "/forget",
            templateUrl: "./tpl/_index/forget.html",
            controller: 'forget',
        }).state('ruzhu', {
            url: "/rz",
            templateUrl: "./tpl/_index/ruzhu.html",
            controller: 'ruzhu',
        });
    }
]);
