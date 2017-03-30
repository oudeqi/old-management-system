var app = angular.module('uoudo.dfzz');
app.controller('vote_player_list',['$scope','$http','constant','localStorageService','FileUploader','$uibModal','$state','$timeout','$sce','$filter',
    function($scope,$http,constant,localStorageService,FileUploader,$uibModal,$state,$timeout,$sce,$filter){

        $scope.id = $state.params.id;

        $scope.maxSize = 5;
        $scope.status = "0";//0全部， 1已经通过， 2未通过， 3取消资格
        $scope.keywords = "";
        $scope.currentPage = 1;
        $scope.pageSize = 20;
        $scope.totalItems = 500;
        $scope.list = [];

        $scope.getList = function(){
            $http.get(constant.APP_HOST + '/v1/aut/player/list', {
                headers: {
                    'Authorization': localStorageService.get("token")
                },
                params:{
                    id:$scope.id,
                    search:$scope.keywords,
                    status:$scope.status,
                    pageSize:$scope.pageSize,
                    pageIndex:$scope.currentPage
                }
            }).success(function(res) {
                console.log("获取选手列表：",res);
                $scope.list = res.data;
                $scope.totalItems = res.totalItems;
                $scope.currentPage = res.pageIndex;
            }).error(function(data) {

            });
        };
        $scope.getList();

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

        // var res = {
        //     msg:"",
        //     pageIndex:1,
        //     pageSize:20,
        //     totalItems:50,
        //     list:[{
        //         id:"200",
        //         name:"老马",//参选者艺名
        //         declaration:"天府三街谁最骚？非老马莫属",//宣言
        //         phoneNo:"18981936871",
        //         photo:"./img/treasure_eg.jpg",//头图
        //         status:2,//1已经通过， 2未通过， 3取消资格， 4再次通过的
        //         getVotes:20,//获得的票数
        //         ranking:3,//排名
        //     },{
        //         id:"200",
        //         name:"老马",//参选者艺名
        //         declaration:"天府三街谁最骚？非老马莫属",//宣言
        //         phoneNo:"18981936871",
        //         photo:"./img/treasure_eg.jpg",//头图
        //         status:1,//1已经通过， 2未通过， 3取消资格， 4再次通过的
        //         getVotes:20,//获得的票数
        //         ranking:3,//排名
        //     },{
        //         id:"200",
        //         name:"老马",//参选者艺名
        //         declaration:"天府三街谁最骚？非老马莫属",//宣言
        //         phoneNo:"18981936871",
        //         photo:"./img/treasure_eg.jpg",//头图
        //         status:2,//1已经通过， 2未通过， 3取消资格， 4再次通过的
        //         getVotes:20,//获得的票数
        //         ranking:3,//排名
        //     },{
        //         id:"200",
        //         name:"老马",//参选者艺名
        //         declaration:"天府三街谁最骚？非老马莫属",//宣言
        //         phoneNo:"18981936871",
        //         photo:"./img/treasure_eg.jpg",//头图
        //         status:1,//1已经通过， 2未通过， 3取消资格， 4再次通过的
        //         getVotes:20,//获得的票数
        //         ranking:3,//排名
        //     }],
        // };
        //
        // $scope.list = res.list;
        // $scope.search = function(){};

        //--------------------------------------------------------------------------------------------------
                /**
                 * 获取选手列表
                 * @method get
                 * @param {string} id - 投票活动id
                 * @param {string} status - 0全部， 1已经通过， 2未通过， 3取消资格
                 * @param {string} keywords - 搜索关键字
                 * @param {int} pageIndex - 当前搜索页数
                 * @param {int} pageSize - 每页条数
                 * @return {object} players - 选手列表
                 */
                 var players = {
                     msg:"",//返回附加消息
                     pageIndex:1,//当前页
                     pageSize:20,//每页条数
                     totalItems:50,//总共条数
                     list:[{
                         id:"200",
                         seriaNumber:"2",//编号
                         name:"老马",//参选者艺名
                         declaration:"天府三街谁最骚？非老马莫属",//宣言
                         phoneNo:"18981936871",
                         photos:[{
                             id:100,//图片id
                             src:"./img/treasure_eg.jpg"//图片路径
                         }],//头图
                         status:2,//1已经通过， 2未通过， 3取消资格， 4再次通过的
                         getVotes:20,//获得的票数
                         ranking:3,//排名
                     }],
                 };

    }
]);
