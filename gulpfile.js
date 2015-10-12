var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var babelify = require('babelify');

gulp.task('browserify', function() {
    browserify('./src/js/main.js')
        .transform('babelify')
        .transform('reactify')
        .bundle()
        .pipe(source('main.js'))
        .pipe(gulp.dest('static/js'))
    });

gulp.task('copy', function() {
    gulp.src('src/assets/**/*.*')
        .pipe(gulp.dest('dist/assets'))
    });

gulp.task('default', ['browserify'], function() {
    return gulp.watch('./src/**/*.*', ['browserify'])
    });