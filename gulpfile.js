// Gulp.js configuration
var
  // modules
  gulp = require('gulp'),
  newer = require('gulp-newer'),
  imagemin = require('gulp-imagemin'),
  htmlclean = require('gulp-htmlclean'),
  concat = require('gulp-concat'),
  deporder = require('gulp-deporder'),
  stripdebug = require('gulp-strip-debug'),
  uglify = require('gulp-uglify'),
  sass = require('gulp-sass'),
  postcss = require('gulp-postcss'),
  assets = require('postcss-assets'),
  autoprefixer = require('autoprefixer'),
  mqpacker = require('css-mqpacker'),
  cssnano = require('cssnano'),
  uglify = require('gulp-uglify');
  browserify = require('browserify');
  browserSync = require('browser-sync').create(),
  del = require('del'),
  htmlmin = require('gulp-htmlmin'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  sourcemaps = require('gulp-sourcemaps'),
  data = require('gulp-data');
  jsonServer = require("gulp-json-srv");
  imagemin = require('gulp-imagemin');



  // development mode?
  devBuild = (process.env.NODE_ENV !== 'production'),

  server = jsonServer.create({
  	port: 3010
  });

  // folders
  folder = {
    src: 'src/',
    build: 'build/'
  }
;


//CLEAN

gulp.task('clean:html', function () {
    return del([folder.build + "/*.html"]);
});

gulp.task('clean:js', function () {
    return del([folder.build + "/js"]);
});

gulp.task('clean:css', function () {
    return del([folder.build + "/css"]);
});

gulp.task('clean:images', function () {
    return del([folder.build + "/images"]);
});

gulp.task('clean:data', function () {
    return del([folder.build + "/data"]);
});

gulp.task('clean', ['clean:html', 'clean:js', 'clean:css', 'clean:images']);
// gulp.task('clean', ['clean:html', 'clean:js', 'clean:css']);


//BUILD
gulp.task('build:html', function () {
    return gulp.src(folder.src +'html/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(folder.build));
});


gulp.task('build:css', function () {
    return gulp.src(folder.src +'/sass/*')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest(folder.build + '/css'));
});

gulp.task('build:images', function () {
    return gulp.src(folder.src +'/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest(folder.build + '/images'));
});



gulp.task('build:js', function () {
    // set up the browserify instance on a task basis
    var b = browserify({
        entries: folder.src +'js/main.js'
    });

    return b.bundle()
        .pipe(source('app.min.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())       //minify
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(folder.build+'/js/'));
});



gulp.task('build', ['build:html', 'build:css', 'build:js', 'build:images'], function() {
// gulp.taskuild', ['build:html', 'build:css', 'build:js'], function() {
    return gulp.src(folder.src +'other/**/*')
        .pipe(gulp.dest(folder.build));
});



//WATCH
gulp.task('watch:css', function() {
    gulp.watch(folder.src +'sass/**/*', ['clean:css', 'build:css']).on('change', browserSync.reload);
});

gulp.task('watch:js', function() {
    gulp.watch(folder.src +'js/**/*', ['clean:js', 'build:js']).on('change', browserSync.reload);
});

gulp.task('watch:html', function() {
    gulp.watch(folder.src +'html/**/*', ['clean:html', 'build:html']).on('change', browserSync.reload);
});

gulp.task('watch:images', function() {
    gulp.watch(folder.src +'images/**/*', ['clean:images', 'build:images']).on('change', browserSync.reload);
});



// gulp.task('watch', ['watch:html', 'watch:css', 'watch:js', 'watch:images']);
gulp.task('watch', ['watch:html', 'watch:css', 'watch:js']);



// SERVE
// gulp.task('serve', ['clean', 'build', 'watch', "serveData"], function() {
gulp.task('serve', ['clean', 'build', 'watch'], function() {

    browserSync.init({
        server: {
            baseDir: folder.build
        },
        reloadDelay: 2000,
        online: true
    });

});
