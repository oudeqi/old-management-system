var app = angular.module('uoudo.dfzz');
app.controller('art_check',['$scope','$uibModalInstance','art','$sce','$sceDelegate',
    function($scope,$uibModalInstance,art,$sce,$sceDelegate){

        $scope.step = 1;
        console.log(art);
        $scope.infoTypeName = art.infoTypeName;
        $scope.previewUrl = art.previewUrl;
        $scope.title = art.title;
        $scope.littleUrl = art.littleUrl;
        $scope.imageUrl = art.imageUrl;
        $scope.template = art.template;
        $scope.sellerName = art.sellerName;
        $scope.videoUrl = $sce.trustAsResourceUrl(art.videoUrl);
        $scope.top = art.top;
        $scope.content = $sce.trustAsHtml(art.content);
        console.log(art.content);

        $scope.ok = function () {
        	$uibModalInstance.close();
    	};
    	$scope.cancel = function () {
    		$uibModalInstance.dismiss();
    	};

    }
]);
