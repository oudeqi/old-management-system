var app = angular.module('uoudo.dfzz');
app.controller('tgtj_detail',['$scope','$uibModalInstance',
    function($scope,$uibModalInstance){

        $scope.ok = function () {
        	$uibModalInstance.close();
    	};

    	$scope.cancel = function () {
    		$uibModalInstance.dismiss();
    	};

        // function isUserName(){ //验证用户名
        //     if(UserNameString.match(rgExp)){
        //         return true;
        //     }
        //     return false;
        // }
        // function isEmail(){ //验证电子邮件
        //     if(emailString.match(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/)){
        //         return true;
        //     }
        //     return false;
        // }
        // function reg(){ //注册函数
        //     if(!isUserName()){
        //         alert("用户名格式不正确");
        //         return;
        //     }
        //     if(!isEmail()){
        //         alert("邮件格式不正确");
        //         return;
        //     }
        //     //发送注册的请求
        //     $.ajax("http://www.xxx.com/xx/xx",{
        //         name:userName,
        //         email:email
        //     })
        //     .done(function(data){
        //         alert("请求成功");
        //     })
        //     .fail(function(data){
        //         alert("请求失败");
        //     });
        // }

    }
]);
