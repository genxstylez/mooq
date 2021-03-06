var gulp = require('gulp');
    notify = require('gulp-notify');
    browserify = require('browserify');
    uglify = require('gulp-uglify');
    reactify = require('reactify');
    source = require('vinyl-source-stream');
    babelify = require('babelify');
    livereload = require('gulp-livereload');
    plumber = require('gulp-plumber')
    rename = require('gulp-rename')
    i18next = require('i18next-parser');


function handleErrors() {
    var args = Array.prototype.slice.call(arguments);
    notify.onError({
        title: 'Compile Error',
        message: '<%= error.message %>'
    }).apply(this, args);
}

gulp.task('browserify', function() {
    browserify('./src/js/main.js')
        .transform('babelify')
        .transform('reactify')
        .bundle()
        .on('error', handleErrors)
        .pipe(plumber())
        .pipe(source('main.js'))
        .pipe(gulp.dest('static/js'))
        .pipe(livereload())
    });



gulp.task('css', function() {
    gulp.src('./src/css/**/*.*')
        .pipe(gulp.dest('static/css'))
    });

gulp.task('img', function() {
    gulp.src('./src/img/**/*.*')
        .pipe(gulp.dest('static/img'))
    });

gulp.task('build', function() {
  gulp.src('static/js/main.js')
    .pipe(uglify())
    .on('error', handleErrors)
    .pipe(rename({
        extname: '.min.js'
    }))
    .pipe(gulp.dest('static/js'));
});


gulp.task('i18next', function() {
    gulp.src('./src/**/*.*')
        .pipe(i18next({
            locales: ['en', 'zh-TW'],
            functions: ['__', '_e'],
            output: '../static/locales'
        }))
        .pipe(gulp.dest('static/locales'));
});

gulp.task('default', ['browserify', 'img', 'css', 'build', 'i18next'], function() {
    livereload.listen();
    return gulp.watch('./src/**/*.*', ['browserify', 'img', 'css', 'build', 'i18next'])
    });

