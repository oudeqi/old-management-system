var gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    watch = require('gulp-watch'),
    changed = require('gulp-changed'),
    spritesmith = require('gulp.spritesmith'),
    merge = require('merge-stream'),
    inject = require('gulp-inject'),
    useref = require('gulp-useref'),
    clean = require('gulp-clean'),
    runSequence = require('run-sequence'),
    rev = require('gulp-rev'),
    revReplace = require('gulp-rev-replace'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-clean-css'),
    htmlmin = require('gulp-htmlmin'),
    ngTemplate = require('gulp-ng-template'),
    angularFilesort = require('gulp-angular-filesort'),
    browserSync = require('browser-sync').create();

    var htmlMinOptions = {
       removeComments: true,//清除HTML注释
       collapseWhitespace: true,//压缩HTML
       collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
       removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
       removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
       removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
       minifyJS: true,//压缩页面JS
       minifyCSS: true//压缩页面CSS
    };

// ----------------------------------------------------------
// bulid 相关
// 合并index页面的资源
gulp.task('useref:index', function() {
    return gulp.src('./src/index.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('./dist'));
});
// 生成index页面的版本
gulp.task('rev:index', ['useref:index'], function() {
    return gulp.src(['dist/css/_index/**/*.css', 'dist/js/_index/**/*.js'], {base: 'dist'})
    .pipe(rev())
    .pipe(gulp.dest('dist/'))
    .pipe(rev.manifest({
        // base: 'dist/',
        merge: true
    }))
    .pipe(gulp.dest('dist/'));
});
// 替换index页面的资源
gulp.task('replacerev:index', ['rev:index'], function(){
  var manifest = gulp.src('dist/rev-manifest.json');
  return gulp.src('dist/index.html')
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest('dist/'));
});

// 合并dfzz页面的资源
gulp.task('useref:dfzz', function() {
    return gulp.src('./src/dfzz.html')
        .pipe(useref())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(gulp.dest('./dist'));
});
// 生成dfzz页面的版本
gulp.task('rev:dfzz', ['useref:dfzz'], function() {
    return gulp.src(['dist/css/_dfzz/**/*.css', 'dist/js/_dfzz/**/*.js'], {base: 'dist'})
    .pipe(rev())
    .pipe(gulp.dest('dist/'))
    .pipe(rev.manifest({
        // base: 'dist/',
        merge: true
    }))
    .pipe(gulp.dest('dist/'));
});
// 替换dfzz页面的资源
gulp.task('replacerev:dfzz', ['rev:dfzz'], function(){
  var manifest = gulp.src('dist/rev-manifest.json');
  return gulp.src('dist/dfzz.html')
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest('dist/'));
});
// 生成图片的版本
gulp.task('rev:img', ['imagemin'], function() {
    return gulp.src(['dist/img/*.*'], {base: 'dist'})
        .pipe(rev())
        .pipe(gulp.dest('dist/'))
        .pipe(rev.manifest({
            // base: 'dist/',
            merge: true
        }))
        .pipe(gulp.dest('dist/'));
});
// 替换图片资源
gulp.task('replacerev:img', ['rev:img'], function(){
  var manifest = gulp.src('dist/rev-manifest.json');
  return gulp.src('dist/**/*')
    .pipe(revReplace({manifest: manifest}))
    .pipe(gulp.dest('dist/'));
});

gulp.task('htmlmin', function() {
    return gulp.src('dist/*.html')
        .pipe(htmlmin(htmlMinOptions))
        .pipe(gulp.dest('./dist'));
});

gulp.task('imagemin', function(){
    return gulp.src('src/img/*.*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/img/'));
});
gulp.task('media', function() {
    return gulp.src('src/media/*.*')
        .pipe(gulp.dest('dist/media'));
});
gulp.task('favicon', function(){
    return gulp.src('src/favicon.ico')
        .pipe(gulp.dest('dist/'));
});

gulp.task('clean', function() {
    return gulp.src('dist/*', {read: false})
        .pipe(clean());
});

gulp.task('server:build',function(){
    // 启动本地服务器
    browserSync.init({
         server: "./dist",
        // proxy: "http://192.168.0.200:80/dist/", //代理
        files: ["dist/css/**/*.css"]
    });
    gulp.watch("src/**/*.html").on('change', browserSync.reload);
});

gulp.task('build', ['clean'], function(cb) {
    runSequence(
        'favicon',
        'media',
        'scss:all',
        'tpl:index',
        'tpl:dfzz',
        'replacerev:index',
        'replacerev:dfzz',
        'replacerev:img',
        'htmlmin',
        'server:build'
    );
});

// -------------------------------------------------------------

gulp.task('sprite', function() {
    var spriteData = gulp.src('src/sprite/*.png')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            imgPath: '../../../img/sprite.png',
            cssName: '_sprite.scss',
            cssFormat: 'scss',
            padding: 10,
            cssVarMap: function(sprite) {
                sprite.name = "icon-" + sprite.name;
            }
        }));
    var imgStream = spriteData.img
        .pipe(gulp.dest('src/img'));
    var cssStream = spriteData.css
        .pipe(gulp.dest('src/scss/helpers/'));
    return merge(imgStream, cssStream);
});



gulp.task('scss', function() {
    return gulp.src("./src/scss/**/*.scss")
        // .pipe(gulpif(!gulp.env.all, changed('./src/css', {extension: '.css'}))) //gulp.env 过时了
        .pipe(changed('./src/css', {extension: '.css'}))
        .pipe(sourcemaps.init())
        //nested expanded compact compressed
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['Android >= 4.0', 'last 3 Safari versions', 'iOS 7', 'ie >= 9'],
            cascade: true, //是否美化属性值 默认：true
            remove: true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest('./src/css'));
});

gulp.task('scss:all', function() {
    return gulp.src("./src/scss/**/*.scss")
        .pipe(sourcemaps.init())
        //nested expanded compact compressed
        .pipe(sass({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['Android >= 4.0', 'last 3 Safari versions', 'iOS 7', 'ie >= 9'],
            cascade: true, //是否美化属性值 默认：true
            remove: true //是否去掉不必要的前缀 默认：true
        }))
        .pipe(sourcemaps.write("./"))
        .pipe(gulp.dest('./src/css'));
});


// 引入index
gulp.task('inject:index', function() {
    return gulp.src('./src/index.html')
        .pipe(inject(gulp.src('./src/css/_index/**/*.css', {
            read: false
        }), {
            relative: true
        }))
        .pipe(inject(gulp.src('./src/js/_index/**/*.js', {
            read: true
        }).pipe(angularFilesort()), {
            relative: true
        }))
        .pipe(gulp.dest('./src'));
});
// 引入dfzz
gulp.task('inject:dfzz', function() {
    return gulp.src('./src/dfzz.html')
        .pipe(inject(gulp.src('./src/css/_dfzz/**/*.css', {
            read: false
        }), {
            relative: true
        }))
        .pipe(inject(gulp.src('./src/js/_dfzz/**/*.js', {
            read: true
        }), {
            relative: true
        }))
        .pipe(gulp.dest('./src'));
    // return gulp.src('./src/dfzz.html')
    //     .pipe(inject(gulp.src('./src/css/_dfzz/**/*.css', {
    //         read: false
    //     }), {
    //         relative: true
    //     }))
    //     .pipe(inject(gulp.src('./src/js/_dfzz/**/*.js', {
    //         read: true
    //     }).pipe(angularFilesort()), {
    //         relative: true
    //     }))
    //     .pipe(gulp.dest('./src'));
});

// 生成 index模板
gulp.task('tpl:index', function() {
  return gulp.src('src/tpl/_index/*.html')
    .pipe(htmlmin(htmlMinOptions))
    .pipe(ngTemplate({
      moduleName: 'tpl.index',
      standalone: true,
      prefix: './tpl/_index/',
      filePath: 'index.tpl.js'
    }))
    .pipe(gulp.dest('src/js/_index/tpl'));
});
// 生成 dfzz模板
gulp.task('tpl:dfzz', function() {
  return gulp.src('src/tpl/_dfzz/*.html')
    .pipe(htmlmin(htmlMinOptions))
    .pipe(ngTemplate({
      moduleName: 'tpl.dfzz',
      standalone: true,
      prefix: './tpl/_dfzz/',
      filePath: 'dfzz.tpl.js'
    }))
    .pipe(gulp.dest('src/js/_dfzz/tpl'));
});

gulp.task('server:dev',function(cb){
    // 启动本地服务器
    browserSync.init({
         server: "./",
        // proxy: "http://192.168.0.200:80/src/", //代理
        files: ["src/css/**/*.css"]
    });
    cb();
});

gulp.task('watch', function(cb) {
    // 监听图片改变，刷新浏览器
    watch("src/img/*.*")
        .on('add', browserSync.reload)
        .on('change', browserSync.reload)
        .on('unlink', browserSync.reload);

    // 监听sprite文件夹，制作雪碧图
    watch("src/sprite/*.*")
        .on('add', function() {
            runSequence('sprite', 'scss:all', browserSync.reload);
        })
        .on('change', function() {
            runSequence('sprite', 'scss:all', browserSync.reload);
        })
        .on('unlink', function() {
            runSequence('sprite', 'scss:all', browserSync.reload);
        });

    // 监听css，js文件增加自动引入文件
    watch(["src/css/**/*.css", "src/js/**/*.js"])
        .on('add', function() {
            gulp.start('inject:index');
            gulp.start('inject:dfzz');
        })
        .on('unlink', function() {
            gulp.start('inject:index');
            gulp.start('inject:dfzz');
        });

    // 监听模板文件增加编译成js
     watch(["src/tpl/**/*.html"])
         .on('add', function() {
             gulp.start('tpl:index');
         })
         .on('change', function() {
             gulp.start('tpl:index');
         })
         .on('unlink', function() {
             gulp.start('tpl:index');
         });

    // 监听scss 编译scss
    gulp.watch("src/scss/**/*.scss", ['scss']);
    // 监听html 刷新浏览器
    gulp.watch("src/**/*.html").on('change', browserSync.reload);
    // 监听js 刷新浏览器
    gulp.watch("src/js/**/*.js").on('change', browserSync.reload);
    cb();
});

gulp.task('default', ['sprite'], function(cb) {
    runSequence('scss:all', 'inject:index', 'inject:dfzz', ['watch', 'server:dev'], cb);
});
