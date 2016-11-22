angular.module('uoudo.dfzz')
.filter('parseNumber',function(){
    return function(input,i){
        return Math.floor(input*Math.pow(10,i)) / Math.pow(10,i);
    };
});
