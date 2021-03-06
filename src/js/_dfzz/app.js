
var app = angular.module('uoudo.dfzz',[
    'LocalStorageModule',
    'ui.router',
    'ui.bootstrap',
    'angularFileUpload',
    'ngDraggable',
    'tpl.dfzz'
]);

app.constant("constant",{
  // APP_HOST : "http://192.168.10.254:8082/", //远程接口
  // APP_HOST : "http://192.168.10.14:8080/", //本地测试接口
  APP_HOST : "http://partner.2tai.net/", //线上接口 18628973302 13547822066
  UMEDITOR_CONTENT_HEADER : '<!DOCTYPE html>'+
          '<html lang="zh-CN">'+
              '<head>'+
                  '<meta charset="utf-8">'+
                  '<meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1, user-scalable=no">'+
                  '<title></title>'+
                  '<style type="text/css">'+
                      '*{margin: 0;padding: 0;}'+
                      'html {font-size: 16px;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color:#595959;}'+
                      'p{line-height: 1.5 !important;text-align: justify;word-break:break-all;white-space:normal;margin:10px 0 !important;overflow-x: hidden !important;}'+
                      'iframe{width: 100%;}img{max-width:100% !important;}'+
                      '#custom_style{max-width: 640px;min-width: 250px;margin:0 auto;width:100%;}'+
                      '#custom_style *{max-width: 100%!important;box-sizing: border-box!important;-webkit-box-sizing: border-box!important;word-wrap: break-word!important;}'+
                      '@media screen and (min-width: 1024px){.rich_media{width: auto !important;}}'+
                      '@media screen and (min-width: 1024px){.rich_media_inner {padding: 0 !important;}}'+
                      '.rich_media_area_primary{padding: 0 !important;}'+
                  '</style>'+
              '</head>'+
          '<body id="custom_style">',
  UMEDITOR_CONTENT_HEADER_CK : '<!DOCTYPE html>'+
          '<html lang="zh-CN">'+
              '<head>'+
                  '<meta charset="utf-8">'+
                  '<meta name="viewport" content="width=device-width, initial-scale=1,maximum-scale=1, user-scalable=no">'+
                  '<title></title>'+
                  '<style type="text/css">'+
                      '*{margin: 0;padding: 0;}'+
                      'html {font-size: 16px;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;color:#595959;}'+
                      'p{line-height: 1.5 !important;text-align: justify;word-break:break-all;white-space:normal;margin:10px 0 !important;overflow-x: hidden !important;}'+
                      'iframe{width: 100%;}img{max-width:100% !important;}'+
                      '#custom_style{margin:0 auto;width:100%; font-size: 18px !important;color: #3b424c !important;line-height: 32px !important; width:100%; margin:0 auto;}'+
                      '@media screen and (min-width: 1024px){.rich_media{width: auto !important;}}'+
                      '@media screen and (min-width: 1024px){.rich_media_inner {padding: 0 !important;}}'+
                      '.rich_media_area_primary{padding: 0 !important;}'+
                      '#godiv{ font-size: 18px !important;color: #3b424c !important;line-height: 32px !important; width:100%; margin:0 auto;}'+
                  '</style>'+
              '</head>'+
          '<body id="custom_style">',
  UMEDITOR_CONTENT_FOOTER : "</body></html>"
});

app.run(['$rootScope', '$state', '$stateParams','localStorageService',
    function($rootScope, $state, $stateParams,localStorageService) {
        if(!localStorageService.get("token") || !localStorageService.get('userInfo')){
            window.location.href = "./index.html";
            return;
        }
        console.log(localStorageService.get("token"));
        console.log(localStorageService.get("userInfo"));

        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.headIconUrl = localStorageService.get('userInfo').headIconUrl;
        $rootScope.nickName = localStorageService.get('userInfo').nickName;
        $rootScope.phoneNumber = localStorageService.get('userInfo').phoneNumber;
        $rootScope.uid = localStorageService.get('userInfo').uid;
        $rootScope.siteName = localStorageService.get('userInfo').siteName;
        //状态，1 需要编辑，2审核中 不可编辑，3 审核成功 不可编辑，4，审核失败，可以编辑
        $rootScope.status = localStorageService.get('userInfo').status;
        // if($rootScope.status === 1){
        //     $rootScope.statusMsg = "你的资料不完整，请完善资料";
        // }else if($rootScope.status === 2){
        //     $rootScope.statusMsg = "你的资料正在审核中，请等待";
        // }else if($rootScope.status === 4){
        //     $rootScope.statusMsg = "你的资料审核失败，请完善资料";
        // }else{
        //     $rootScope.statusMsg = "";
        // }
        $rootScope.permission = localStorageService.get('userInfo').permission;//权限
        // $rootScope.permission.menu_gem_verify = "1";
        // $rootScope.permission.menu_vote = "1";
        console.log(localStorageService.get('userInfo'));
        if($rootScope.permission){
            $rootScope.permission.button_info_ucoin = "0"; //取消u币文章
        }
        // 二级导航切换
        $rootScope.currNav = 30000000;
        $rootScope.navMouseover = function(i){
            $rootScope.currNav = i;
        };
        $rootScope.navMouseleave = function(){
            $rootScope.currNav = 30000000;
        };

        // 退出登录
        $rootScope.logout=function(){
            localStorageService.clearAll();
            location.href = "./index.html";
        };

        /*
        conf.put("menu_info", "1");//文章发布
        conf.put("menu_invite", "1");//推广中心
        conf.put("menu_rp", "1");//红包发布
        conf.put("button_push_time", "1");//文章预发布时间
        conf.put("button_info_video", "1");//文章推荐到精彩视频
        conf.put("button_info_ucoin", "1");//是否显示U币文章
         */
        // 监听路由改变开始
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options){
            console.log(toState);
            // 状态，1 需要编辑，2审核中 不可编辑，3 审核成功 不可编辑，4，审核失败，可以编辑
            // if($rootScope.status === 1 && toState.name !== "head_setting"){
            //     // 资料不完整
            //     $rootScope.statusMsg = "你的资料不完整，请完善资料";
            //     event.preventDefault();
            //     $state.go("head_setting",{},{reload:true});
            // }
            // if($rootScope.status === 2 && toState.name !== "head_setting"){
            //     //资料审核中
            //     $rootScope.statusMsg = "你的资料正在审核中，请等待";
            //     event.preventDefault();
            //     $state.go("head_setting",{},{reload:true});
            // }
            // if($rootScope.status === 4 && toState.name !== "head_setting"){
            //     // 资料审核失败
            //     $rootScope.statusMsg = "你的资料审核失败，请完善资料";
            //     event.preventDefault();
            //     $state.go("head_setting",{},{reload:true});
            // }


            if(toState.name.split("_")[0] === "art" && $rootScope.permission.menu_info === "0"){
                console.log("无发布文章权限");
                event.preventDefault();
                $state.go("head_setting",{},{reload:true});
            }
            if(toState.name.split("_")[0] === "rp" && $rootScope.permission.menu_rp === "0"){
                console.log("无发布红包权限");
                event.preventDefault();
                $state.go("head_setting",{},{reload:true});
            }
            if(toState.name.split("_")[0] === "tgtj" && $rootScope.permission.menu_invite === "0"){
                console.log("无推广中心权限");
                event.preventDefault();
                $state.go("head_setting",{},{reload:true});
            }
            if(toState.name === "ads_launch" && $rootScope.permission.button_start_ad === "0"){
                console.log("无设置app启动广告权限");
                event.preventDefault();
                $state.go("head_setting",{},{reload:true});
            }
            if(toState.name === "finance_list" && $rootScope.permission.menu_day_report === "0"){
                console.log("无查看财务权限");
                event.preventDefault();
                $state.go("head_setting",{},{reload:true});
            }
        });

        // 监听路由改变成功
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            $rootScope.mainNav = toState.name.split("_")[0];
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
        $urlRouterProvider.otherwise("/setting");
        $stateProvider
        .state('head_setting', {
            url: "/setting",
            templateUrl: "./tpl/_dfzz/setting.html",
            controller: 'setting',
        })
        .state('head_help', {
            url: "/help/:id",
            templateUrl: "./tpl/_dfzz/help.html",
            controller: 'help',
        })
        .state('art_put', {
            url: "/art_put",
            templateUrl: "./tpl/_dfzz/art.put.html",
            controller: 'art_put',
        })
        .state('art_list', {
            url: "/art_list",
            templateUrl: "./tpl/_dfzz/art.list.html",
            controller: 'art_list',
        })
        .state('rp_put', {
            url: "/rp_put",
            templateUrl: "./tpl/_dfzz/rp.put.html",
            controller: 'rp_put',
        })
        .state('rp_list', {
            url: "/rp_list",
            templateUrl: "./tpl/_dfzz/rp.list.html",
            controller: 'rp_list',
        })
        .state('tgtj_list', {
            url: "/tgtj",
            templateUrl: "./tpl/_dfzz/tgtj.list.html",
            controller: 'tgtj',
        })
        .state('tgtj_promoter', {
            url: "/tgtj_promoter",
            templateUrl: "./tpl/_dfzz/tgtj.promoter.html",
            controller: 'tgtj_promoter',
        })
        .state('ads_launch', {
            url: "/ads_launch",
            templateUrl: "./tpl/_dfzz/ads.launch.html",
            controller: 'ads_launch',
        })
        .state('finance_list', {
            url: "/finance_list",
            templateUrl: "./tpl/_dfzz/finance.list.html",
            controller: 'finance_list',
        })
        .state('websiteman_ctl',{
            url:"/websiteman_ctl", //站长管理
            templateUrl:"./tpl/_dfzz/websiteman.ctl.html",
            controller:'websiteman_ctl',
        })
        .state('websiteman_ctl_add',{
           url:"/websiteman_ctl_add",
            templateUrl:"./tpl/_dfzz/websiteman.ctl.add.html",
            controller:"websiteman_ctl_add"
        })
        .state('bbs_pub',{
            params:{"postid":null,"canedit":null,"postitem":null},
            url:"/bbs_pub",
            templateUrl:"./tpl/_dfzz/bbs.pub.html",
            controller:"bbs_pub"
        })
        .state('bbs_post',{
            url:"/bbs_post",
            templateUrl:"./tpl/_dfzz/bbs.post.html",
            controller:"bbs_post"
        })
        .state('bbs_post_edit',{
            params:{"postid":null,"canedit":null,"postitem":null},
            url:"/bbs_post_edit",
            templateUrl:"./tpl/_dfzz/bbs.post.edit.html",
            controller:"bbs_post_edit"
        })
        .state('bbs_module_set',{
            url:"/bbs_module_set",
            templateUrl:"./tpl/_dfzz/bbs.module.set.html",
            controller:"bbs_module_set"
        })
        .state('cir_pub',{
            url:"/cir_pub",
            templateUrl:"./tpl/_dfzz/cir.pub.html",
            controller:"cir_pub"
        })
        .state('cir_list',{
            url:"/cir_list",
            templateUrl:"./tpl/_dfzz/cir.list.html",
            controller:"cir_list",
        })
        .state('cir_edit',{
             params:{"postid":null,"canedit":null,"postitem":null},
            url:"/cir_edit",
            templateUrl:"./tpl/_dfzz/cir.edit.html",
            controller:"cir_edit"
        })
        .state('cir_dynameic',{
            url:"/cir_dynameic",
            templateUrl:"./tpl/_dfzz/cir.dynameic.html",
            controller:"cir_dynameic",
        })
        .state('cir_dynameic_comment',{
            url:"/cir_dynameic_comment",
            templateUrl:"./tpl/_dfzz/cir.dynameic.comment.html",
            controller:"cir_dynameic_comment",
        })
        .state('cir_comment',{
            url:"/cir_comment",
            templateUrl:"./tpl/_dfzz/cir.comment.html",
            controller:"cir_comment",
        })
        .state('cir_list_info',{
         params:{"postid":null,"canedit":null,"postitem":null},
            url:"/cir_list_info",
            templateUrl:"./tpl/_dfzz/cir.list.info.html",
            controller:"cir_list_info"
        })
        .state('tgtj_user',{
            url:"/tgtj_user",
            templateUrl:"./tpl/_dfzz/user.ctl.html",
            controller:"user_ctl"
        })
        .state('treasure_put', {
            url: "/treasure_put",
            templateUrl: "./tpl/_dfzz/treasure.put.html",
            controller: 'treasure_put',
        })
        .state('treasure_list', {
            url: "/treasure_list",
            templateUrl: "./tpl/_dfzz/treasure.list.html",
            controller: 'treasure_list',
        })
        .state('treasure_list_stage', {
            url: "/treasure_list/:treasureId",
            templateUrl: "./tpl/_dfzz/treasure.list.stage.html",
            controller: 'treasure_list_stage',
        })
        .state('treasure_lucky', {
            url: "/treasure_lucky",
            templateUrl: "./tpl/_dfzz/treasure.luckylist.html",
            controller: 'treasure_lucky',
        })
        .state('sysset_blacklist',{
            url: "/sysset_blacklist",
            templateUrl: "./tpl/_dfzz/sysset.blacklist.html",
            controller: 'sysset_blacklist',
        })
        .state('sysset_report',{
            url:"/sysset_report",
            templateUrl:"./tpl/_dfzz/sysset.report.html",
            controller:"sysset_report"
        })
        .state('syssets_notification_list',{
            url:"/sysset_notification_list",
            templateUrl:"./tpl/_dfzz/sysset.notification.list.html",
            controller:"sysset_notification_list",
        })
        .state('syssets_notification_new',{
            url:"/sysset_notification_new",
            templateUrl:"./tpl/_dfzz/sysset.notification.new.html",
            controller:"sysset_notification_new",
        })
        .state('finance_mgetout',{
            url:"/finance_mgetout",
            templateUrl:"./tpl/_dfzz/finance.mgetout.html",
            controller:"finance_mgetout"
        })
        .state('task_put', {
            url: "/task_put",
            templateUrl: "./tpl/_dfzz/task.put.html",
            controller: 'task_put',
        })
        .state('task_list', {
            url: "/task_list",
            templateUrl: "./tpl/_dfzz/task.list.html",
            controller: 'task_list',
        })
        .state('user_list',{
            url:"/user_list",
            templateUrl:"./tpl/_dfzz/user.list.html",
            controller:"user_list"
        })
        .state('mall_goods_addnew',{
            url:"/mall_goods_addnew",
            templateUrl:"./tpl/_dfzz/sysset.goods.addnew.html",
            controller:"sysset_goods_addnew",
        })
        .state('mall_goods_list',{
            url:"/mall_goods_list",
            templateUrl:"./tpl/_dfzz/sysset.goods.list.html",
            controller:"sysset_goods_list",
        })
        .state('mall_goods_modify',{
            url:"/mall_goods_modify/{id}",
            templateUrl:"./tpl/_dfzz/mall.goods.modify.html",
            controller:"mall_goods_modify",
        })
        .state('mall_order',{
            url:"/mall_order",
            templateUrl:"./tpl/_dfzz/mall.order.html",
            controller:"mall_order"
        })
        .state('vote_put',{
            url:"/vote_put",
            templateUrl:"./tpl/_dfzz/vote.put.html",
            controller:"vote_put"
        })
        .state('vote_list',{
            url:"/vote_list",
            templateUrl:"./tpl/_dfzz/vote.list.html",
            controller:"vote_list"
        })
        .state('vote_player_list',{
            url:"/vote_player_list/{id}",
            templateUrl:"./tpl/_dfzz/vote.player.list.html",
            controller:"vote_player_list"
        })
        .state('vote_detail',{
            url:"/vote_detail/{id}",
            templateUrl:"./tpl/_dfzz/vote.detail.html",
            controller:"vote_detail"
        })
        .state('vote_player_detail',{
            url:"/vote_player_detail/{voteId}/{id}",
            templateUrl:"./tpl/_dfzz/vote.player.detail.html",
            controller:"vote_player_detail"
        })
        .state('vote_modify',{
            url:"/vote_modify/{id}",
            templateUrl:"./tpl/_dfzz/vote.modify.html",
            controller:"vote_modify"
        });



    }
]);
