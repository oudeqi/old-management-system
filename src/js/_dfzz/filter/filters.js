angular.module('uoudo.dfzz')
.filter('parseNumber',function(){
    return function(input,i){
        return Math.floor(input*Math.pow(10,i)) / Math.pow(10,i);
    };
})
.filter('formatFloat',function(){//去除js计算误差
    return function(input){
        var m = Math.pow(10, 1);
        return parseInt(input * m, 10) / m;
    };
});
