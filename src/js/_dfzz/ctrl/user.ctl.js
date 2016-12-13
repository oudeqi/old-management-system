

var app = angular.module('uoudo.dfzz');

app.controller('user_ctl',['$scope','$uibModal','FileUploader','constant','localStorageService','$sce','$http','$filter','$state',
    function($scope,$uibModal,FileUploader,constant,localStorageService,$sce,$http,$filter,$state){

	        $scope.testx = function(item){
            var modalInstance = $uibModal.open({
                backdrop:'static',
                animation: true,
                windowClass: 'modal-showpic',
                templateUrl: './tpl/_dfzz/modal.showpic.html',
                controller: 'modal_pic',
                size: 'sm', 
                // sm,lg,md
                resolve: {
                    rp: function () {
                        return item;
                    }
                }
            });
            modalInstance.result.then(function (data) {
                console.info(data);
            }, function () {
                console.info('模态框取消: ' + new Date());
            });
        };
    }
]);