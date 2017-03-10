angular.module('uoudo.dfzz')
.directive("bgCover",function(){
    return {
        restrict: 'A',
        scope:{
            url:"=bgCover"
        },
        link: function(scope,ele,attrs){
            scope.$watch("url",function(){
                if(scope.url){
                    ele.css({
                        "background-image": "url("+scope.url+")",
                        "background-size": "cover",
                        "background-position": "center",
                        "background-repeat": "no-repeat"
                    });
                }else{
                    ele.css({
                        "background-image":"none"
                    });
                }
            });

        }
    };
})
.directive("multPicEdit",['constant','localStorageService','$http',function(constant,localStorageService,$http){
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope:{
            arr:'=ngModel'
        },
        template: function(element, attrs) {
            var html = '';
            html += '<div class="tpl_edit">';
            html +=     '<div ng-repeat="item in arr">';
            html +=         '<div class="pic">';
            html +=             '<button class="del_pic" ng-click="delPic($index)" type="button" title="删除"></button>';
            html +=             '<img ng-src="{{item.imgUrl}}" alt="">';
            html +=         '</div>';
            html +=         '<div class="editable">';
            html +=             '<p class="content" contenteditable="true" ng-model="item.explain" change-model>{{item.explain}}</p>';
            html +=             '<p class="placeholder" ng-click="editFocus()" ng-show="!item.explain">添加图片描述</p>';
            html +=         '</div>';
            html +=     '</div>';
            html +=     '<div class="btn_cont">';
            html +=         '<button class="addpic" ng-click="addPic()" type="button">';
            html +=             '<i></i>';
            html +=             '<span>添加图片</span>';
            html +=         '</button>';
            html +=         '<p class="msg info" ng-show="arr.length<3">至少选择三张图片</p>';
            html +=         '<form enctype="multipart/form-data" ng-show="false" method="post" name="fileinfo">';
            html +=             '<input type="file" name="file" clean-file-value accept="image/*" onchange="angular.element(this).scope().fileChange(this)" />';
            html +=         '</form>';
            // html +=         '<button ng-click="testshow()">测试</button>';
            html +=     '</div>';
            html += '</div>';
            return html;
        },
        link:function(scope,element, attrs, ctrl){
            console.log(scope.arr);
            scope.delPic = function(index){
                scope.arr.splice(index,1);
                var art = localStorageService.get('art.put');
                art.multPic = scope.arr;
                localStorageService.set('art.put',art);
            };
            scope.addPic = function(){
                element.find('input[type="file"]').click();
            };
            scope.fileChange = function(_this){
                var url = constant.APP_HOST + "/v1/back/uploadImg";
                var fd = new FormData(document.forms.namedItem("fileinfo" ));
                fd.append( "token", localStorageService.get("token"));
                var req = new XMLHttpRequest();
                req.open( "POST", url , true );
                req.onload = function(oEvent) {
                      if (req.status == 200) {
                          console.log(req.responseText);
                          scope.$apply(function(){
                              scope.arr.push({
                                  imgUrl: req.responseText,
                                  explain: ""
                              });
                              var art = localStorageService.get('art.put');
                              art.multPic = scope.arr;
                              localStorageService.set('art.put',art);
                          });
                     } else {
                          console.error(req);
                     }
                };
                req.send(fd);
            };
            scope.editFocus = function(){
                element.find(".content").focus();
            };
            scope.testshow = function(){
                console.log(scope.arr);
            };
        }
    };
}])
.directive('changeModel',function(){
    return {
        restrict: 'A',
        require: '?ngModel',
        link: function(scope,element, attrs, ctrl){
            element.bind("input",function(e){
                ctrl.$setViewValue(e.target.innerText);
            });

        }
    };
})
.directive('switch', function(){
    return {
        restrict: 'AE',
        replace: true,
        transclude: true,
        template: function(element, attrs) {
            var html = '';
            html += '<span';
            html +=   ' class="switch' + (attrs.class ? ' ' + attrs.class : '') + '"';
            html +=   attrs.ngModel ? ' ng-click="' + attrs.disabled + ' ? ' + attrs.ngModel + ' : ' + attrs.ngModel + '=!' + attrs.ngModel + (attrs.ngChange ? '; ' + attrs.ngChange + '()"' : '"') : '';
            html +=   ' ng-class="{ checked:' + attrs.ngModel + ', disabled:' + attrs.disabled + ' }"';
            html +=   '>';
            html +=   '<small></small>';
            html +=   '<input type="checkbox"';
            html +=     attrs.id ? ' id="' + attrs.id + '"' : '';
            html +=     attrs.name ? ' name="' + attrs.name + '"' : '';
            html +=     attrs.ngModel ? ' ng-model="' + attrs.ngModel + '"' : '';
            html +=     ' style="display:none" />';
            html +=     '<span class="switch-text">'; /*adding new container for switch text*/
            html +=     attrs.on ? '<span class="on">'+attrs.on+'</span>' : ''; /*switch text on value set by user in directive html markup*/
            html +=     attrs.off ? '<span class="off">'+attrs.off + '</span>' : ' ';  /*switch text off value set by user in directive html markup*/
            html += '</span>';
            return html;
        }
    };
})
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
.directive('limitNumber',function(){
    return {
        restrict:'A',
        link:function(scope,elem,attrs){
            elem.keyup(function(ev){
                var limitNumber = attrs.limitNumber.substring(1,attrs.limitNumber.length-1);
                limitNumber = limitNumber.split(",");
                if(elem.val() < parseInt(limitNumber[0])){
                     elem.val(0);
                }
                if(elem.val() > parseInt(limitNumber[1])){
                  elem.val(100);
                }
                var reg = /^(\d{1,2}|100)$/;
                if(!reg.test(elem.val())){
                    elem.val("");
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
                'ruter',
                ],function(na){
                    if(scope.innc){
                        scope.myclass='show-msg-in';
                    }else{
                        scope.myclass='show-msg-out';
                    }
                    scope.nohot=na[1];
                    scope.showNow=na[2];
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
        replace: true,
        require: '?ngModel',
        scope: {},
        link: function(scope, element, attrs, ueditorController) {
            var _editorId = attrs.id ? attrs.id : "_editor" + (Date.now());
            element[0].id = _editorId;
            mueditor = UM.getEditor(_editorId,{
                initialFrameWidth:420,
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
            angular.element(document).find(".edui-container").css("text-align","justify");
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
                    }, 30);
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
