var gulp = require('gulp');
    browserify = require('browserify');
    reactify = require('reactify');
    source = require('vinyl-source-stream');
    babelify = require('babelify');
    livereload = require('gulp-livereload');

gulp.task('browserify', function() {
    browserify('./src/js/main.js')
        .transform('babelify')
        .transform('reactify')
        .bundle()
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