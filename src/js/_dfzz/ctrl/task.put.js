var app = angular.module('uoudo.dfzz');
app.controller('task_put',['$scope','$http','constant','localStorageService','FileUploader','$uibModal','$state','$timeout','$sce','$filter',
    function($scope,$http,constant,localStorageService,FileUploader,$uibModal,$state,$timeout,$sce,$filter){

        //页面对象
        $scope.page = {
            res: 0,// 0第一步；1第二步；2成功；3失败
            type: 0,// 0答题；1调查；2文案；3欣赏；4审核
        };

        //改变类型
        $scope.changeType = function(i){
            if($scope.page.type == i){
                return;
            }else{
                $scope.page.type = i;
                $scope.answer.step = 1;
                $scope.survey.step = 1;
                $scope.paperwork.step = 1;
                $scope.enjoy.step = 1;
                $scope.check.step = 1;
            }
        };

        //添加说明
        $scope.addExplain = function(obj){
            obj.step = 2;
            obj.explain.push({
                desc:""
            });
        };

        //删除说明
        $scope.delExplain = function(obj,index){
            if(obj.explain.length>1){
                obj.explain.splice(index,1);
            }
        };

        //改变单价
        $scope.getPrice = function(totalPrice,count){
            if($scope.page.type == '0'){
                if(totalPrice && count){
                    $scope.answer.price = $filter("formatFloat")(totalPrice/count);
                }else{
                    $scope.answer.price = 0;
                }
            }else if($scope.page.type == '1'){
                if(totalPrice && count){
                    $scope.survey.price = $filter("formatFloat")(totalPrice/count);
                }else{
                    $scope.survey.price = 0;
                }
            }else if($scope.page.type == '2'){
                if(totalPrice && count){
                    $scope.paperwork.price = $filter("formatFloat")(totalPrice/count);
                }else{
                    $scope.paperwork.price = 0;
                }
            }else if($scope.page.type == '3'){
                if(totalPrice && count){
                    $scope.enjoy.price = $filter("formatFloat")(totalPrice/count);
                }else{
                    $scope.enjoy.price = 0;
                }
            }else if($scope.page.type == '4'){
                if(totalPrice && count){
                    $scope.check.price = $filter("formatFloat")(totalPrice/count);
                }else{
                    $scope.check.price = 0;
                }
            }
        };

        //查看数据
        $scope.test = function(){
            console.log("答题");
            console.log($scope.answer);
            console.log("调查");
            console.log($scope.survey);
            console.log("文案");
            console.log($scope.paperwork);
            console.log("欣赏");
            console.log($scope.enjoy);
            console.log("审核");
            console.log($scope.check);
        };

        //点击添加图片
        $scope.addPic = function(id){
            document.getElementById(id).click();
        };

        //删除封面图片
        $scope.delCoverImg = function(obj){
            obj.coverImg = "";
        };
        //删除banner图片
        $scope.delBannerImg = function(obj,index){
            obj.banner.splice(index,1);
        };

        //上传封面
        var uploadCoverImg = $scope.uploadCoverImg = new FileUploader({
            url : constant.APP_HOST + "v1/ad/adCoverImg",
            removeAfterUpload : true,
            formData :[{token:localStorageService.get('token')}]
        });
        uploadCoverImg.onAfterAddingFile = function(fileItem) {
            fileItem.alias="file";
            $scope.uploadCoverImg.queue[0].upload();
        };
        uploadCoverImg.onSuccessItem  = function(item,response){
            console.log(response);
            if(item.isSuccess){
                var modalInstance = $uibModal.open({
                    backdrop:'static',
                    animation: true,
                    windowClass: 'modal-cutpic',
                    templateUrl: './tpl/_dfzz/modal.cutpic.html',
                    controller: 'cutTaskImg',
                    size: 'lg',
                    resolve: {
                        imgSrc: function () {
                            return response;
                        }
                    }
                });
                modalInstance.result.then(function (res) {
                    console.log(res);
                    if($scope.page.type == "0"){
                        $scope.answer.coverImg = res;
                        $scope.answer.step = 1;
                    }else if($scope.page.type == "1"){
                        $scope.survey.coverImg = res;
                        $scope.survey.step = 1;
                    }else if($scope.page.type == "2"){
                        $scope.paperwork.coverImg = res;
                        $scope.paperwork.step = 1;
                    }else if($scope.page.type == "3"){
                        $scope.enjoy.coverImg = res;
                        $scope.enjoy.step = 1;
                    }else if($scope.page.type == "4"){
                        $scope.check.coverImg = res;
                        $scope.check.step = 1;
                    }
                }, function () {
                    console.info('模态框取消: ' + new Date());
                });
            }else{
                $scope.picUploadErr = "上传图片出错";
            }
        };

        //上传banner
        var uploadBannerImg = $scope.uploadBannerImg = new FileUploader({
            url : constant.APP_HOST + "v1/ad/adCoverImg",
            removeAfterUpload : true,
            formData :[{token:localStorageService.get('token')}]
        });
        uploadBannerImg.onAfterAddingFile = function(fileItem) {
            fileItem.alias="file";
            $scope.uploadBannerImg.queue[0].upload();
        };
        uploadBannerImg.onSuccessItem  = function(item,response){
            console.log(response);
            if(item.isSuccess){
                var modalInstance = $uibModal.open({
                    backdrop:'static',
                    animation: true,
                    windowClass: 'modal-cutpic',
                    templateUrl: './tpl/_dfzz/modal.cutpic.html',
                    controller: 'cutTaskImg',
                    size: 'lg',
                    resolve: {
                        imgSrc: function () {
                            return response;
                        }
                    }
                });
                modalInstance.result.then(function (res) {
                    console.log(res);
                    if($scope.page.type == "0"){
                        $scope.answer.banner.push(res);
                        $scope.answer.step = 2;
                    }else if($scope.page.type == "1"){
                        $scope.survey.banner.push(res);
                        $scope.survey.step = 2;
                    }else if($scope.page.type == "2"){
                        $scope.paperwork.banner.push(res);
                        $scope.paperwork.step = 2;
                    }else if($scope.page.type == "3"){
                        $scope.enjoy.banner.push(res);
                        $scope.enjoy.step = 2;
                    }else if($scope.page.type == "4"){
                        $scope.check.banner.push(res);
                        $scope.check.step = 2;
                    }
                }, function () {
                    console.info('模态框取消: ' + new Date());
                });
            }else{
                $scope.picUploadErr = "上传图片出错";
            }
        };

        //上传视频
        var uploadVideo = $scope.uploadVideo = new FileUploader({
            url : constant.APP_HOST + "/v1/ad/adVideo",
            removeAfterUpload : true,
            formData :[{token:localStorageService.get('token')}]
        });
        uploadVideo.onAfterAddingFile = function(fileItem) {
            fileItem.alias="file";
            $scope.uploadVideo.queue[0].upload();
        };
        uploadVideo.onSuccessItem  = function(item,res){
            console.log(res);
            if(item.isSuccess){
                if($scope.page.type == "0"){
                    $scope.answer.video = res;
                    $scope.answer.step = 2;
                }else if($scope.page.type == "1"){
                    $scope.survey.video = res;
                    $scope.survey.step = 2;
                }else if($scope.page.type == "2"){
                    $scope.paperwork.video = res;
                    $scope.paperwork.step = 2;
                }else if($scope.page.type == "3"){
                    $scope.enjoy.video = res;
                    $scope.enjoy.step = 2;
                }else if($scope.page.type == "4"){
                    $scope.check.video = res;
                    $scope.check.step = 2;
                }
                $scope.videoUploadErr = "";
            }else{
                $scope.videoUploadErr = "视频上传失败";
                $scope.videoUrl = "";
            }
        };

        // 是否有正确答案
        $scope.hasCorrect = function(ans){
            for (var i = 0; i < ans.length; i++) {
                if(ans[i].flag == "1"){
                    return true;
                }
            }
            return false;
        };

        // 隐藏设为正确按钮
        $scope.hideSetBtn = function(i){
            $timeout(function () {
                i.hover = 0;
            }, 150);
        };

        // 设置为正确
        $scope.setCorrect = function(item,i){
            console.log(item);
            $timeout(function () {
                if(item.type == "1"){
                    i.flag = 1;
                }else{
                    angular.forEach(item.ans,function(v){
                        if(v == i){
                            v.flag = 1;
                        }else{
                            v.flag = 0;
                        }
                    });
                }
            }, 60);
        };

        // 获取正确的长度
        $scope.getCorrectLength = function(array){
            var count = 0;
            for (var i = 0; i < array.length; i++) {
                if(array[i].flag == '1'){
                    count++;
                }
            }
            return count;
        };

        // 设为错误
        $scope.setError = function(ans,i){
            $timeout(function () {
                if($scope.getCorrectLength(ans) > 1){
                    i.flag = 0;
                }
            }, 60);
        };

        // 新增答案
        $scope.addOption = function(ans){
            ans.push({
                option:"",
                optionEmpty:0,
                hover:0,
                flag:0 //0 错误答案；1正确答案
            });
        };

        // 删除答案
        $scope.delOption = function(ans,idex){
            if(ans.length>1){
                ans.splice(idex,1);
            }
        };

        // 新增题目
        $scope.addQues = function(queArr,i){
            queArr.push({
                tit:"",
                titEmpty:0,
                type:i,//0单选；1多选
                ans:[{
                    option:"",
                    optionEmpty:0,
                    hover:0,
                    flag:1 //1正确答案；0错误答案
                }]
            });
        };

        //删除题目
        $scope.delQues = function(question,index){
            if(question.length>1){
                question.splice(index,1);
            }
            // question.splice(index,1);
        };

        //是否有空的说明
        function hasEmptyExplain(array){
            for (var i = 0; i < array.length; i++) {
                if(!array[i].desc){
                    return true;
                }
            }
            return false;
        }

        //验证文案任务
        $scope.validPaperwork = function(){
            if(!$scope.paperwork.title){
                return false;
            }
            if(!$scope.paperwork.coverImg){
                return false;
            }
            if(!$scope.paperwork.price){
                return false;
            }
            if(!$scope.paperwork.count){
                return false;
            }
            if(!$scope.paperwork.time){
                return false;
            }
            if($scope.paperwork.template == '0' && !$scope.paperwork.banner.length){ //图文
                return false;
            }
            if($scope.paperwork.template == '1' && !$scope.paperwork.video){
                return false;
            }
            if($scope.paperwork.explain.length < 1 || hasEmptyExplain($scope.paperwork.explain)){
                return false;
            }
            return true;
        };

        //验证欣赏任务
        $scope.validEnjoy = function(){
            if(!$scope.enjoy.title){
                return false;
            }
            if(!$scope.enjoy.coverImg){
                return false;
            }
            if(!$scope.enjoy.price){
                return false;
            }
            if(!$scope.enjoy.count){
                return false;
            }
            if(!$scope.enjoy.time){
                return false;
            }
            if(!$scope.enjoy.video){
                return false;
            }
            if($scope.enjoy.explain.length < 1 || hasEmptyExplain($scope.enjoy.explain)){
                return false;
            }
            return true;
        };

        //验证答题任务第一步
        $scope.validAnswerStep1 = function(){
            if(!$scope.answer.title){
                return false;
            }
            if(!$scope.answer.coverImg){
                return false;
            }
            if(!$scope.answer.price){
                return false;
            }
            if(!$scope.answer.count){
                return false;
            }
            if(!$scope.answer.rate){
                return false;
            }
            if(!$scope.answer.time){
                return false;
            }
            if($scope.answer.template == '0' && !$scope.answer.banner.length){ //图文
                return false;
            }
            if($scope.answer.template == '1' && !$scope.answer.video){
                return false;
            }
            if($scope.answer.explain.length < 1 || hasEmptyExplain($scope.answer.explain)){
                return false;
            }
            return true;
        };

        //去答题任务第二步
        $scope.answerNext = function(){
            if($scope.validAnswerStep1()){
                $scope.page.res = 1;
            }
        };

        //输入题目时重新验证是否为空
        $scope.reValidTit = function(item){
            if(!!item.tit){
                item.titEmpty = 0;
            }else{
                item.titEmpty = 0;
            }
        };

        //输入选项时重新验证是否为空
        $scope.reValidOption = function(item){
            if(!!item.option){
                item.optionEmpty = 0;
            }else{
                item.optionEmpty = 0;
            }
        };

        //验证调查任务第一步
        $scope.validSurveyStep1 = function(){
            if(!$scope.survey.title){
                return false;
            }
            if(!$scope.survey.coverImg){
                return false;
            }
            if(!$scope.survey.price){
                return false;
            }
            if(!$scope.survey.count){
                return false;
            }
            if(!$scope.survey.time){
                return false;
            }
            if($scope.survey.template == '0' && !$scope.survey.banner.length){ //图文
                return false;
            }
            if($scope.survey.template == '1' && !$scope.survey.video){
                return false;
            }
            if($scope.survey.explain.length < 1 || hasEmptyExplain($scope.survey.explain)){
                return false;
            }
            return true;
        };

        //去调查任务第二步
        $scope.surveyNext = function(){
            if($scope.validSurveyStep1()){
                $scope.page.res = 1;
            }
        };

        // 上一步
        $scope.preStep = function(){
            $scope.page.res = 0;
        };

        $scope.reload = function(){
            $state.go("task_put",{},{reload:true});
        };

        //改变option结构
        function changeOptionCons(optArr){
            var res = [];
            for (var i = 0; i < optArr.length; i++) {
                res.push({
                    testAnswer:optArr[i].option,
                    rightAnswer:optArr[i].flag
                });
            }
            return res;
        }

        //改变question结构
        function changeQuesCons(ques) {
            var res = [];
            for (var i = 0; i < ques.length; i++) {
                var type;
                if(ques[i].type == '0'){
                    type = 1;
                }else{
                    type = 2;
                }
                res.push({
                    question:ques[i].tit,
                    questionType:type,
                    answerList:changeOptionCons(ques[i].ans)
                });
            }
            return res;
        }

        //改变说明结构
        function changeExplainCons(descArr){
            var res = [];
            for (var i = 0; i < descArr.length; i++) {
                res.push(descArr[i].desc);
            }
            return res;
        }

        function hasEmptyOption(ans){
            for (var i = 0; i < ans.length; i++) {
                if(!ans[i].option){
                    ans[i].optionEmpty = 1;
                    return true;
                }else{
                    ans[i].optionEmpty = 0;
                }
            }
            return false;
        }

        //验证问题是否正确
        $scope.validQues = function(obj){
            for (var i = 0; i < obj.question.length; i++) {
                // 是否标题为空
                if(!obj.question[i].tit){
                    obj.question[i].titEmpty = 1;
                    return false;
                }else{
                    obj.question[i].titEmpty = 0;
                }
                //选项是否为空
                if(hasEmptyOption(obj.question[i].ans)){
                    return false;
                }
                // 是否设置正确答案
                if(!$scope.hasCorrect(obj.question[i].ans)){
                    return false;
                }
            }
            return true;
        };

        $scope.answer = { // 0答题
            step:1,
            title:"",
            coverImg:"",
            price:"",
            totalPrice:"",
            count:"",
            rate:"",//正确率
            time:"",
            template:0, // 0图文；1视频
            banner:[],
            video:"",
            explain:[{desc:""}],
            question:[{
                tit:"",
                titEmpty:0,
                type:0,//0单选；1多选
                ans:[{
                    option:"",
                    optionEmpty:0,
                    hover:0,
                    flag:1 //1正确答案；0错误答案
                }]
            }]
        };

        //发布答题任务
        $scope.putAnswer = function(){
            if($scope.validQues($scope.answer)){
                var template;
                if($scope.answer.template == '0'){
                    template = 2;
                }else{
                    template = 1;
                }
                $http.post(constant.APP_HOST+'/v1/aut/taskset',{
                    title:$scope.answer.title,
                    taskType:6,
                    onesMoney:$scope.answer.price,
                    taskNumber:$scope.answer.count,
                    pushTime:new Date($scope.answer.time+":00").getTime(),
                    proportional:$scope.answer.rate,//正确比列
                    imgList:$scope.answer.banner,//轮播图
                    previewUrl:$scope.answer.coverImg,//封面图
                    introduceList:changeExplainCons($scope.answer.explain),
                    templateType:template,//模板类型
                    videoUrl:$scope.answer.video,
                    testQuestionList: changeQuesCons($scope.answer.question)
                 },{
         			headers:{
         				'Authorization':localStorageService.get("token")
         			}
         		}).success(function(data){
                    console.log(data);
                    if(data.errMessage){
                        $scope.page.res = 3;
                    }else{
                        $scope.page.res = 2;
                    }
                }).error(function(data){
                    $scope.page.res = 3;
                });
            }
        };

        $scope.survey = { // 1调查
            step:1,
            title:"",
            coverImg:"",
            price:"",
            totalPrice:"",
            count:"",
            time:"",
            template:0, // 0图文；1视频
            banner:[],
            video:"",
            explain:[{desc:""}],
            question:[{
                tit:"",
                titEmpty:0,
                type:0,//0单选；1多选
                ans:[{
                    option:"",
                    optionEmpty:0,
                    hover:0,
                    flag:1 //1正确答案；0错误答案
                }]
            }]
        };

        //发布调查任务
        $scope.putSurvey = function(){
            if($scope.validQues($scope.survey)){
                var template;
                if($scope.survey.template == '0'){
                    template = 2;
                }else{
                    template = 1;
                }
                /*
                    taskType; //1.调查,2.审核,3.文案,4.欣赏 5.游戏  6答题
                    templateType：//1视频 2模板
                    questionType：//1单选，2多选
                 */
                $http.post(constant.APP_HOST+'/v1/aut/taskset',{
                    title:$scope.survey.title,
                    taskType:1,
                    onesMoney:$scope.survey.price,
                    taskNumber:$scope.survey.count,
                    pushTime:new Date($scope.survey.time+":00").getTime(),
                    imgList:$scope.survey.banner,//轮播图
                    previewUrl:$scope.survey.coverImg,//封面图
                    introduceList:changeExplainCons($scope.survey.explain),
                    templateType:template,//模板类型
                    videoUrl:$scope.survey.video,
                    testQuestionList: changeQuesCons($scope.survey.question)
                 },{
         			headers:{
         				'Authorization':localStorageService.get("token")
         			}
         		}).success(function(data){
                    console.log(data);
                    if(data.errMessage){
                        $scope.page.res = 3;
                    }else{
                        $scope.page.res = 2;
                    }
                }).error(function(data){
                    $scope.page.res = 3;
                });
            }
        };

        $scope.paperwork = { // 2文案
            step:1,
            title:"",
            coverImg:"",
            price:"",
            totalPrice:"",
            count:"",
            time:"",
            template:0, // 0图文；1视频
            banner:[],
            video:"",
            explain:[{desc:""}]
        };

        //发布文案任务
        $scope.putPaperwork = function(){
            if($scope.validPaperwork()){
                var template;
                if($scope.paperwork.template == '0'){
                    template = 2;
                }else{
                    template = 1;
                }
                /*
                    taskType; //1.调查,2.审核,3.文案,4.欣赏 5.游戏  6答题
                    templateType：//1视频 2模板
                    questionType：//1单选，2多选
                 */
                $http.post(constant.APP_HOST+'/v1/aut/taskset',{
                    title:$scope.paperwork.title,
                    taskType:3,
                    onesMoney:$scope.paperwork.price,
                    taskNumber:$scope.paperwork.count,
                    pushTime:new Date($scope.paperwork.time+":00").getTime(),
                    imgList:$scope.paperwork.banner,//轮播图
                    previewUrl:$scope.paperwork.coverImg,//封面图
                    introduceList:changeExplainCons($scope.paperwork.explain),
                    templateType:template,//模板类型
                    videoUrl:$scope.paperwork.video
                 },{
         			headers:{
         				'Authorization':localStorageService.get("token")
         			}
         		}).success(function(data){
                    console.log(data);
                    if(data.errMessage){
                        $scope.page.res = 3;
                    }else{
                        $scope.page.res = 2;
                    }
                }).error(function(data){
                    $scope.page.res = 3;
                });
            }
        };

        $scope.enjoy = { // 3欣赏
            step:1,
            title:"",
            coverImg:"",
            price:"",
            totalPrice:"",
            count:"",
            time:"",
            template:1, // 0图文；1视频//欣赏任务没有图片模板
            video:"",
            explain:[{desc:""}]
        };

        //发布欣赏任务
        $scope.putEnjoy = function(){
            if($scope.validEnjoy()){
                /*
                    taskType; //1.调查,2.审核,3.文案,4.欣赏 5.游戏  6答题
                    templateType：//1视频 2模板
                    questionType：//1单选，2多选
                 */
                $http.post(constant.APP_HOST+'/v1/aut/taskset',{
                    title:$scope.enjoy.title,
                    taskType:4,
                    onesMoney:$scope.enjoy.price,
                    taskNumber:$scope.enjoy.count,
                    pushTime:new Date($scope.enjoy.time+":00").getTime(),
                    previewUrl:$scope.enjoy.coverImg,//封面图
                    introduceList:changeExplainCons($scope.enjoy.explain),
                    templateType:1,
                    videoUrl:$scope.enjoy.video
                 },{
         			headers:{
         				'Authorization':localStorageService.get("token")
         			}
         		}).success(function(data){
                    console.log(data);
                    if(data.errMessage){
                        $scope.page.res = 3;
                    }else{
                        $scope.page.res = 2;
                    }
                }).error(function(data){
                    $scope.page.res = 3;
                });
            }
        };

        $scope.check = { // 4审核
            step:1,
            title:"",
            coverImg:"",
            price:"",
            totalPrice:"",
            count:"",
            time:"",
            template:0, // 0图文；1视频
            banner:[],
            video:"",
            explain:[{desc:""}]
        };

    }
]);

function test(){
    var appElement = document.querySelector('.task_put');
    var $scope = angular.element(appElement).scope();
    $scope.test();
}
