angular.module('uoudo.dfzz')
.controller('modal_confirm_auth',['$scope','$rootScope','$http','constant','localStorageService','confirm','$uibModalInstance',
    function($scope,$rootScope,$http,constant,localStorageService,confirm,$uibModalInstance){
        $scope.privilegeInvite = confirm.privilegeInvite;
        $scope.privilegeInfo = confirm.privilegeInfo;
        $scope.idx=confirm.id;
        $scope.$watchGroup([
            'privilegeInvite',
            'privilegeInfo',
        ],function(na,nc){
            console.log('两个值变化了',na,nc);
            if($scope.privilegeInvite){
                localStorageService.set('auth_user',1)
            }else{
                localStorageService.set('auth_user',0)
            }
            if($scope.privilegeInfo){
                localStorageService.set('auth_edit',1)
            }else{
                 localStorageService.set('auth_edit',0)
            }

        })


        $scope.ok = function () {
                $uibModalInstance.close();
    	};

    	$scope.cancel = function () {
    		$uibModalInstance.dismiss();
    	};
    }
]);
