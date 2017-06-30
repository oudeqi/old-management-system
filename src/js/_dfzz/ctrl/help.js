var app = angular.module('uoudo.dfzz');
app.controller('help',['$scope',
    function($scope){
        $scope.current = 1;
        $scope.handleClick = function (i) {
            $scope.current = i;
        };
    }
]);
