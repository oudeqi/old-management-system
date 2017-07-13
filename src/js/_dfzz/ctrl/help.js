var app = angular.module('uoudo.dfzz');
app.controller('help',['$scope', '$state',
    function($scope, $state){
        $scope.current = $state.params.id;
        $scope.handleClick = function (i) {
            $scope.current = i;
        };
        $scope.back = function () {
            history.go(-1);
        };
    }
]);
