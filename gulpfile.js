var gulp = require('gulp');
    notify = require('gulp-notify');
    browserify = require('browserify');
    reactify = require('reactify');
    source = require('vinyl-source-stream');
    babelify = require('babelify');
    livereload = require('gulp-livereload');
    plumber = require('gulp-plumber')


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

gulp.task('copy', function() {
    gulp.src('./src/css/**/*.*')
        .pipe(gulp.dest('static/css'))
    });

gulp.task('default', ['browserify', 'copy'], function() {
    livereload.listen();
    return gulp.watch('./src/**/*.*', ['browserify', 'copy'])
    });