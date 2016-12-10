angular.module('uoudo.dfzz')
.directive('cleanFileValue',function(){
    return {
        restrict:'A',
        link:function(scope,elem,attrs){
            elem.bind("change",function(ev){
                try{
                    ev.target.value = null;
                }catch(err){
                    console.log(err);
                }
            });
        }
    };
})
.directive('showMsg',function($document,$timeout){
    return {
        restrict:'E',
        scope:{     
           inn:'=',
           innc:'=',
           ruter:'=',
           intop:'=',
           inleft:'=',
           inhtml:'@'
        },
        template:'<div class="show-msg" ng-style="ngstylex" ng-class="myclass" ng-if="showNow">{{nohot}}</div>',
        link:function(scope,elem,attrs){ 
            // elem[0].innerText=elem[0].dataset.nt;
            scope.$watchGroup([
                'innc',
                'inhtml',
                ],function(na){
                    if(scope.innc){
                        scope.myclass='show-msg-in';
                    }else{
                        scope.myclass='show-msg-out';
                    }
                    scope.nohot=na[1];
                })
            if(scope.innc){
                scope.myclass='show-msg-in';
            }else{
                scope.myclass='show-msg-out';
            }
            scope.ngstylex={
                'top':scope.intop+'vh',
                'left':scope.inleft+'vw',
            }
            // scope.nohot=elem[0].dataset.nt;
            scope.nohot=scope.inhtml;
            scope.showNow=scope.ruter;

        },

    }
})


.directive('datePicker',function(){
    return {
        restrict:'A',
        scope:{
            disabledStartDate:'=',
            disabledEndDate:'='
        },
        link:function(scope,elem,attrs){
            var startDate = null;
            var endDate = null;
            if(scope.disabledStartDate){
                startDate = new Date(scope.disabledStartDate);
            }
            if(scope.disabledEndDate){
                endDate = new Date(scope.disabledEndDate);
            }
            elem.datetimepicker({
                format: 'yyyy-mm-dd',
                minView:4,
                autoclose:true,
                todayBtn:true,
                language:'zh-CN',
                startDate:startDate,
                endDate:endDate
            });
            elem.siblings('.date-addon').bind('click',function(){
                elem.focus();
            });
            elem.siblings('.input-addon').bind('click',function(){
                elem.focus();
            });
        }
    };
})
.directive('dateTimePicker',function(){
    return {
        restrict:'A',
        scope:{
            disabledStartDate:'=',
            disabledEndDate:'='
        },
        link:function(scope,elem,attrs){
            var startDate = null;
            var endDate = null;
            if(scope.disabledStartDate){
                startDate = new Date(scope.disabledStartDate);
            }
            if(scope.disabledEndDate){
                endDate = new Date(scope.disabledEndDate);
            }
            elem.datetimepicker({
                format: 'yyyy/mm/dd hh:ii',
                minView:0,
                autoclose:true,
                todayBtn:true,
                language:'zh-CN',
                startDate:startDate,
                endDate:endDate
            });
            elem.siblings('.date-addon').bind('click',function(){
                elem.focus();
            });
            elem.siblings('.input-addon').bind('click',function(){
                elem.focus();
            });
        }
    };
})
.directive('appEditorMu', ['$timeout', function($timeout) {
    return {
        restrict: 'E',
        transclude:true,
        replace: false,
        require: '?ngModel',
        scope: {},
        link: function(scope, element, attrs, ueditorController) {
            var _editorId = attrs.id ? attrs.id : "_editor" + (Date.now());
            element[0].id = _editorId;
            mueditor = UM.getEditor(_editorId,{
                initialFrameWidth:360,
                initialFrameHeight:480,
                autoClearinitialContent:true,
                autoClearEmptyNode : true,
            });
            angular.element(document).find("#"+_editorId).css({
                "font-family":"微软雅黑",
                "font-size":"14px",
                "color":"#686868"
            });
            angular.element(document).find(".edui-container").css("box-shadow","0 0 0");
            angular.element(document).find(".edui-container .edui-toolbar").css("box-shadow","0 0 0");
            angular.element(document).find(".edui-container .edui-body-container").css("width","100%");

            if (ueditorController) {
                mueditor.addListener("contentChange", function() {
                    $timeout(function() {
                        scope.$apply(function() {
                            ueditorController.$setViewValue(mueditor.getContent());
                            angular.element(document).find(".edui-container .edui-toolbar").css("box-shadow","0 0 0");
        				    angular.element(document).find("#"+_editorId).find("img").css({"width":"100%"});
                        });
                    }, 0);
                });
                ueditorController.$render = function() {
                    $timeout(function() {
                        mueditor.setContent(ueditorController.$viewValue);
                    }, 100);
                };
            }
        }
    };
}]);
