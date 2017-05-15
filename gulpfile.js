/**
 * Created by truda on 14/05/2017.
 */
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var sassModuleImporter = require('sass-module-importer');

//var browserify = require('browserify');
var ngHtml2Js = require('browserify-ng-html2js');
//var resolutions = require('browserify-resolutions');
var watchify = require('gulp-watchify');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
//var jshint = require('gulp-jshint');

//var uglify = require('gulp-uglify');
//var concat = require('gulp-concat');
//var environments = require('gulp-environments');
var es = require('event-stream');

var errorHandler = function(error) {
    console.log("Error: " + error.toString());
    this.emit('end');
};

var config = {
    entries: [
        './src/app/*/index.js'
    ]
};

//b.transform(ngHtml2Js({ extension: 'html' }));


gulp.task('browserify', watchify(function(watch) {
        return gulp.src(config.entries)
            .pipe(watch({
                watch: true,
                setup: function (bundle) {
                    //bundle.transform(require('brfs'))
                    bundle.transform(ngHtml2Js({extension: 'html'}));
                }
            }))
            .pipe(plugins.rename(function(path) {
                path.basename = path.dirname;
                path.dirname = "";
            }))
            .pipe(gulp.dest('./dist/js/'))
            .pipe(plugins.connect.reload());

            //.pipe(source('main.js'))
            //.pipe(buffer())
            //.pipe(plugins.sourcemaps.init({loadMaps: true}))
            //.pipe(plugins.ngAnnotate()).on('error', errorHandler)
            //.pipe(uglify({ mangle: false }))
            //.pipe(plugins.sourcemaps.write('./'))
    }));

gulp.task('copy', function() {
    es.merge(
        gulp.src('./src/app/client/index.html').pipe(plugins.rename('client.html')),
        gulp.src('./src/app/receiver/index.html').pipe(plugins.rename('receiver.html')),
        gulp.src(['./src/assets/**/*', './src/index.php']))
            .pipe(gulp.dest('./dist'))
            .pipe(plugins.connect.reload());
});

gulp.task('scss', function() {
    gulp.src('./src/styles/*.scss')
        .pipe(plugins.sass({
            importer: sassModuleImporter()
        }).on('error', plugins.sass.logError))
        .pipe(gulp.dest('./dist/styles/'))
        .pipe(plugins.connect.reload())
});

gulp.task('build',['browserify', 'scss', 'copy']);

gulp.task('server', ['build'], function() {
    plugins.connect.server({
        root: './dist',
        livereload: true,
        port: 3000,
        index: 'client.html'
    });
});


gulp.task('default', ['server'], function(){
    plugins.watch('./src/app/*/index.html', function() {
        return gulp.start('copy');
    });
    plugins.watch('./src/assets/**/*', function() {
        return gulp.start('copy');
    });

    plugins.watch('./src/styles/**/*', function() {
        return gulp.start('scss');
    });
});