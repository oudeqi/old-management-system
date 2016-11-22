angular.module('uoudo.dfzz')
.controller('modal_copyrp',['$scope','rp','$uibModalInstance','$filter','localStorageService','$http','constant',
    function($scope,rp,$uibModalInstance,$filter,localStorageService,$http,constant){

        console.log(rp);

        $scope.id = rp.id;
        $scope.beginTime = $filter("date")(rp.beginTime,"yyyy-MM-dd hh:mm");
        $scope.totalMoney = rp.totalMoney;
        $scope.count = rp.count;

        $scope.$watchGroup([
            'beginTime',
            'totalMoney',
            'count'
        ],function(arr){
            console.log(arr);
            $scope.msg = "";
            if(arr[0]){
                $scope.err = "";
            }else{
                $scope.err = "开抢时间不能为空";
                return;
            }
            if(arr[1]){
                $scope.err = "";
            }else{
                $scope.err = "投放金额必须为大于0的整数";
                return;
            }
            if(arr[2]){
                $scope.err = "";
            }else{
                $scope.err = "红包个数必须为大于0的整数";
                return;
            }
        });

        $scope.loading = false;
        $scope.ok = function () {
            console.log(
                $scope.id,
                $scope.beginTime,
                $scope.totalMoney,
                $scope.count
            );

            $scope.msg = "";
            $scope.err = "";
            if(!$scope.beginTime){
                $scope.err = "开抢时间不能为空";
                return;
            }
            if(!$scope.totalMoney){
                $scope.err = "投放金额必须为大于0的整数";
                return;
            }
            if(!$scope.count){
                $scope.err = "红包个数必须为大于0的整数";
                return;
            }

            if($scope.loading){
                return;
            }
            $scope.loading = true;
            $http.post(constant.APP_HOST+'/v1/aut/redpackage/copy',{
                id:$scope.id,
                beginTime:new Date($scope.beginTime+":00").getTime(),
                totalMoney:$scope.totalMoney,
                count:$scope.count
            },{
                headers:{
                    'Authorization': localStorageService.get("token")
                }
            }).success(function(data){
                $scope.loading = false;
                if(data.errMessage){
                    $scope.err = data.errMessage;
                    $scope.msg = "";
                }else{
                    $scope.msg = "复制成功！";
                    $scope.err = "";
                    // $scope.getList();
                }
            }).error(function(data){
                $scope.loading = false;
                $scope.err = "复制失败！";
            });
    	};
    	$scope.cancel = function () {
    		$uibModalInstance.dismiss($scope.msg);
    	};
    }
]);
