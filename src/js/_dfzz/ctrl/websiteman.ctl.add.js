/**
 * Created by Rainning on 2016/12/3.
 */
var app=angular.module("uoudo.dfzz");
app.controller('websiteman_ctl_add',['$scope','$http','constant','localStorageService','$filter','$uibModal','$state','$timeout',
    function ($scope,$http,constant,localStorageService,$filter,$uibModal,$state,$timeout) {
        $scope.webadd_objl=localStorageService.get("website_edit");
        $scope.website_iseditinfo=localStorageService.get('website_isedit');
    	$scope.webadd_obj={
    		siteName:'',
    		name:'',
    		phoneNumber:null,
    		appPhone:'',
    		weixin:'',
    		privilegeInvite:false, //文章推广权
    		privilegeInfo:false,  //文章编辑权
    		applyDept:'',
    		applyUser:'',

    	}

        angular.forEach($scope.webadd_obj,function(val,key){
            $scope.webadd_obj[key]=$scope.webadd_objl[key];
        });
        $scope.webadd_obj.phoneNumber=parseInt($scope.webadd_objl.phoneNumber)
        if($scope.webadd_objl.privilegeInfo==1){
            $scope.webadd_obj.privilegeInfo=true;
        }else{
            $scope.webadd_obj.privilegeInfo=false;
        }
        if($scope.webadd_objl.privilegeInvite==1){
            $scope.webadd_obj.privilegeInvite=true;
        }else{
            $scope.webadd_obj.privilegeInvite=false;
        }


        // $scope.webfun_go_btn=false;
        $scope.loading=false;
        $scope.info_err=false;
        $scope.info_err_ct='';
        $scope.info_succ=false;
        $scope.info_succ_ct='';

        $scope.hint_error=function(){

        };
        $scope.hint_success=function(){

        };

        // 站点修改
        $scope.website_change=function(innerInfo){
            var get_host=null;
            var change_info=null;

            if(innerInfo=='修改站点'){
                get_host='/v1/aut/site/apply/update';
                change_info='修改站点成功!';
            }else{
                get_host='/v1/aut/site/apply';
                change_info='新增站点成功!'
            }

            $scope.webadd_obj.id=$scope.webadd_objl.id;
            $http.post(constant.APP_HOST+get_host,$scope.webadd_obj,{
                headers:{
                    'Authorization':localStorageService.get("token")
                }
            }).success(function(data){
                console.log(data);
            if($scope.webadd_obj.privilegeInfo==1){
                $scope.webadd_obj.privilegeInfo=true;
            }else{
                $scope.webadd_obj.privilegeInfo=false;
            };
            if($scope.webadd_obj.privilegeInvite==1){
                $scope.webadd_obj.privilegeInvite=true;
            }else{
                $scope.webadd_obj.privilegeInvite=false;
            };
                if(data.errMessage){
                    $scope.info_err=true;
                    $scope.info_succ=false;
                    $scope.info_err_ct=data.errMessage;
                    console.log('错误'+data.errMessage);
                }else{
                    $scope.info_succ=true;
                    $scope.info_err=false;
                    $scope.info_succ_ct=change_info;
                    angular.forEach($scope.webadd_obj,function(val,key){
                        $scope.webadd_obj[key]=null;
                    });
                };

            }).error(function(data){
                console.log('有可能网络错误');
            })

        }

        // 提交站点信息
        $scope.webfun_go=function(){
            $scope.info_err=true;
            $scope.info_succ=true;
            $scope.loading=true;
        	if($scope.webadd_obj.privilegeInfo==true){
        		$scope.webadd_obj.privilegeInfo=1;
        	}else{
        		$scope.webadd_obj.privilegeInfo=0;
        	};
        	if($scope.webadd_obj.privilegeInvite==true){
        		$scope.webadd_obj.privilegeInvite=1;
        	}else{
        		$scope.webadd_obj.privilegeInvite=0;
        	};

            $scope.website_change($scope.website_iseditinfo);

            // $scope.website_iseditinfo
            // if($scope.website_iseditinfo=='修改站点'){
            //                         $scope.webadd_obj.id=$scope.webadd_objl.id;

            //                         $http.post(constant.APP_HOST+'/v1/aut/site/apply/update',$scope.webadd_obj,{
            //                             headers:{
            //                                 'Authorization':localStorageService.get("token")
            //                             }
            //                         }).success(function(data){
            //                             console.log(data);
            //                         if($scope.webadd_obj.privilegeInfo==1){
            //                             $scope.webadd_obj.privilegeInfo=true;
            //                         }else{
            //                             $scope.webadd_obj.privilegeInfo=false;
            //                         };
            //                         if($scope.webadd_obj.privilegeInvite==1){
            //                             $scope.webadd_obj.privilegeInvite=true;
            //                         }else{
            //                             $scope.webadd_obj.privilegeInvite=false;
            //                         };
            //                             if(data.errMessage){
            //                                 $scope.info_err=true;
            //                                 $scope.info_succ=false;
            //                                 $scope.info_err_ct=data.errMessage;
            //                                 console.log('错误'+data.errMessage);
            //                             }else{
            //                                 $scope.info_succ=true;
            //                                 $scope.info_err=false;
            //                                 $scope.info_succ_ct='修改站点成功!';
            //                                 angular.forEach($scope.webadd_obj,function(val,key){
            //                                     $scope.webadd_obj[key]=null;
            //                                 });
            //                             };

            //                         }).error(function(data){
            //                             console.log('有可能网络错误');
            //                         })
            //     }else{
            //                         $http.post(constant.APP_HOST+'/v1/aut/site/apply',$scope.webadd_obj,{
            //                             headers:{
            //                                 'Authorization':localStorageService.get("token")
            //                             }
            //                         }).success(function(data){
            //                             console.log(data);
            //                         if($scope.webadd_obj.privilegeInfo==1){
            //                             $scope.webadd_obj.privilegeInfo=true;
            //                         }else{
            //                             $scope.webadd_obj.privilegeInfo=false;
            //                         };
            //                         if($scope.webadd_obj.privilegeInvite==1){
            //                             $scope.webadd_obj.privilegeInvite=true;
            //                         }else{
            //                             $scope.webadd_obj.privilegeInvite=false;
            //                         };
            //                             if(data.errMessage){
            //                                 $scope.info_err=true;
            //                                 $scope.info_succ=false;
            //                                 $scope.info_err_ct=data.errMessage;
            //                                 console.log('错误'+data.errMessage);
            //                             }else{
            //                                 $scope.info_succ=true;
            //                                 $scope.info_err=false;
            //                                 $scope.info_succ_ct='新增站点成功!';
            //                                 angular.forEach($scope.webadd_obj,function(val,key){
            //                                     $scope.webadd_obj[key]=null;
            //                                 });
            //                             };

            //                         }).error(function(data){
            //                             console.log('有可能网络错误');
            //                         })

            //     }

            $scope.loading=false;
        };
        // 取消提交信息
        $scope.webfun_no=function(){

        };




        console.log(localStorageService.keys());
        console.log(localStorageService.get('userInfo'));

    }

])
