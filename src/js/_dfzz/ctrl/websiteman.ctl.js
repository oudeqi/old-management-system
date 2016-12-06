var app=angular.module("uoudo.dfzz");
app.controller('websiteman_ctl',['$scope','$rootScope','$http','constant','localStorageService','$filter','$uibModal','$state','$timeout',
	function ($scope,$rootScope,$http,constant,localStorageService,$filter,$uibModal,$state,$timeout) {
        


        $scope.hasMsg = false;
        $scope.warning = false;
        $scope.msg='通知信息'
        $scope.all_page=null;
        $scope.this_page=null;
        $scope.pageTo=null;

        // 获取初始化站点列表
        $scope.list_get={
            // startTime endTime  时间使用时间戳   status 0 全部，1待审核，2已开通，3待开通   search 站点名称搜索
            startTime:null,
            endTime:null,
            status:0,
            search:'',
            pageSize:20,
            pageIndex: $scope.this_page,

        }
        $scope.date_get=null;
		$scope.list=[];
        $scope.topinfo=null;
        localStorageService.set('website_isedit','新增站点');
        localStorageService.set('website_edit',{
            siteName:'',
            name:'',
            phoneNumber:null,
            appPhone:'',
            weixin:'',
            privilegeInvite:false, //文章推广权
            privilegeInfo:false,  //文章编辑权
            applyDept:'',
            applyUser:'',
        });

        $scope.currentPage = 1;
        $scope.maxSize = 5;
        $scope.totalItems = 0;


        // 获取列表页数
        $scope.pageChanged=function(index){
            $scope.list_get.pageIndex=index;    
            $scope.get_list();
        };

        $scope.$watchGroup([
            'pageTo',
        ],function(na,nc){
            console.log('两个值变化了',na[0]);
            $scope.list_get.pageIndex=na[0];
            $scope.this_page=na[0]
            $scope.get_list();

        })



        // 获取站点列表
        $scope.get_list=function(){
            console.log($scope.list_get);
            if($scope.date_get){
                $scope.list_get.startTime = new Date($scope.date_get + " 00:00:01").getTime();
                $scope.list_get.endTime = new Date($scope.date_get + " 23:59:59").getTime();
            };
            $http.get(constant.APP_HOST+'/v1/aut/site/apply/list',{
                params:$scope.list_get,
                headers:{
                    'Authorization':localStorageService.get("token")
                },
            }).success(function(data){
                $scope.list=[];
                if(data.errMessage){

                }else{
                    $scope.list=data.data.data;
                    $scope.all_page=data.data;

                    // angular.forEach(data.data.data,function(data,index,item){
                    //     $scope.list.push(data);
                    // })
                }
                console.log(data);
            }).error(function(data){
                console.log('网络可能错误');
            })
            
        }
        $scope.get_list();


        // 获取总的开通 审核数量
        $scope.get_top=function(){
            $http.get(constant.APP_HOST+'/v1/aut/site/apply/top',{
                headers:{
                    'Authorization':localStorageService.get("token")
                },
            }).success(function(data){
                if(data.errMessage){
                }else{
                    console.log(data);
                    $scope.topinfo=data.data;
                }
            }).error(function () {
                console.log('网络可能错误');
            })
        };
        $scope.get_top();

        // 全部 待审核，已通过分类查询
        $scope.get_class=function(num){
            $scope.list_get.startTime=null,
            $scope.list_get.endTime=null,
            $scope.list_get.status=num,
            $scope.list_get.search='',
            $scope.get_list();
        };
        // 提示信息
        $scope.show=function(content){
                $scope.msg=content;
                $scope.hasMsg=true;
                $timeout(function(){
                $scope.hasMsg = false;
                },1000);
        }


		$scope.info_change=function(itemx){
            localStorageService.set('website_isedit','修改站点');
            localStorageService.set('website_edit',itemx);
            $state.go("websiteman_ctl_add",{},{reload:true});
		};
		$scope.info_dredge=function(itemx){
            console.log('通过执行次数')
			var confirm = {
                // tit : "确认删除吗？",
                // content : "删除后将不能恢复"
            };
            var modalInstance = $uibModal.open({
                backdrop:'static',
                animation: true,
                windowClass: 'modal-confirm',
                templateUrl: './tpl/_dfzz/modal.confirm.op.html',
                controller: 'modal_confirm',
                size: 'sm',
                resolve: {
                    confirm: function () {
                        return confirm;
                    }
                }
            });
            modalInstance.result.then(function () { 
                console.log('确认通过'+itemx.id);
                $http.post(constant.APP_HOST+'v1/aut/site/apply/audit',{
                    id:itemx.id,
                },{
                    headers:{
                    'Authorization':localStorageService.get("token")
                    },
                }).success(function(data){
                    if(data.errMessage){
                        $scope.show(data.errMessage);
                    }else{
                        $scope.msg='确认成功';
                        $scope.hasMsg=true;
                        $timeout(function(){
                        $scope.hasMsg = false;
                        },1000);
                        $scope.get_list();
                        $scope.topinfo.opened=$scope.topinfo.opened+1;
                        $scope.topinfo.whaitAudit=$scope.topinfo.whaitAudit-1;

                    }
                }).error(function(data) {
                    $scope.show('网络错误');
                    // console.log('网络可能错误');
                })

            });

		};

		$scope.info_auth=function(itemx){
            console.log(itemx.id)
            var privilegeInvitex,privilegeInfox;

            if(parseInt(itemx.privilegeInvite)==1){
                privilegeInvitex=true;
            }else{
                privilegeInvitex=false;
            }
            if(parseInt(itemx.privilegeInfo)==1){
                privilegeInfox=true;
            }else{
                privilegeInfox=false;
            }

			var confirm = {
                privilegeInvite:privilegeInvitex,
                privilegeInfo:privilegeInfox,
                id:itemx.id,
            };
            var modalInstance = $uibModal.open({
                backdrop:'static',
                animation: true,
                windowClass: 'modal-confirm',
                templateUrl: './tpl/_dfzz/modal.confirm.auth.html',
                controller: 'modal_confirm_auth',
                size: 'sm',
                resolve: {
                    confirm: function () {
						return confirm;
                    }
                }
            });


            // 必须要有一个权限
            modalInstance.result.then(function () { 
                $http.post(constant.APP_HOST+'/v1/aut/site/apply/privilege',{
                    id:itemx.id,
                    privilegeInvite:localStorageService.get('auth_user'),
                    privilegeInfo:localStorageService.get('auth_edit'),
                },{
                    headers:{
                    'Authorization':localStorageService.get("token")
                    },
                }).success(function(data){
                    if(data.errMessage){
                        $scope.show(errMessage);
                    }else{
                        $scope.show('权限修改成功');
                        console.log('权限修改成功');
                        console.log(data);
                    }
                    $scope.get_list();
                }).error(function(data){
                    console.log('网络可能错误');
                    $scope.show('网络可能错误');
                });

            })







		};


	}

	])