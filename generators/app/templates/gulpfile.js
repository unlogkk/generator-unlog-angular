var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync').create();
var jsbeautifier = require('gulp-jsbeautifier');
var less = require('gulp-less');
var path = require('path');

////////////////////
// build
////////////////////
gulp.task('build', ['compile-less']);


////////////////////
// compile-less
////////////////////
gulp.task('compile-less', function() {
  gulp.src(['www/styles/less/app.less'])
      .pipe(less({
        paths: [ 'www/styles/less/inc' ]
      }))
      .pipe(gulp.dest('www/styles'))
      .pipe(browserSync.stream());
});


////////////////////
// serve
////////////////////
gulp.task('serve', ['build', 'browser-sync'], function() {

  gulp.watch(
    [__dirname + '/www/styles/less/**/*.less'],
    {debounceDelay: 400},
    ['compile-less']
  );

  gulp.watch(
    [__dirname + '/www/*.js', __dirname + '/www/scripts/**/*.js', '!' + __dirname + '/www/scripts/vendor/**/*.js', '!' + __dirname + '/www/bower_components/**/*.js', __dirname + '/www/views/**/*.html'],
    {debounceDelay: 400}
  ).on('change', function(event) {
    var path = event.path;
    var dir = pathToDir(path);
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');

    gulp.src(path)
      .pipe(jsbeautifier({config: '.jsbeautifyrc', mode: 'VERIFY_AND_WRITE'}))
      .pipe(gulp.dest(dir));
  });

  gulp.watch(
    [__dirname + '/www/**/*.*'],
    {debounceDelay: 400},
    ['prepare-cordova']
  );
});

////////////////////
// browser-sync
////////////////////
gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: './www/',
      directory: true
    },
    ghostMode: false,
    notify: false,
    debounce: 200,
    port: <%= props.port %>,
    startPath: 'index.html'
  });

  gulp.watch([
    __dirname + '/www/**/*.js',
    '!' + __dirname + '/www/scripts/vendor/**/*.js',
    __dirname + '/www/**/*.html',
    // __dirname + '/www/**/*.{js,html}',
    // __dirname + '/www/**/*.{js,html,css,svg,png,gif,jpg,jpeg}'
  ], {
    debounceDelay: 400
  }, function() {
    browserSync.reload();
  });
});

////////////////////
// prepare-cordova
////////////////////
gulp.task('prepare-cordova', function() {
  return gulp.src('')
    .pipe($.plumber())
    .pipe($.shell(['cordova prepare'], {cwd: __dirname}));
});

// utils

function pathToDir(_path) {
  var split = _path.split(path.sep);
  split.pop();
  return split.join(path.sep);
}


function plumber() {
  return $.plumber({errorHandler: $.notify.onError()});
}
