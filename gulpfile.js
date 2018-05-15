var gulp = require('gulp');

/**
 * WATCH
 */

// Sass

var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var autoprefixer = require('gulp-autoprefixer');
var wait = require('gulp-wait');
var csscomb = require('gulp-csscomb');

gulp.task('sass', function() {
  return gulp.src('app/assets/scss/**/*.scss')
    .pipe(wait(500))
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([require('postcss-flexbugs-fixes')]))
    .pipe(autoprefixer({
      browsers: ['> 1%']
    }))
    .pipe(csscomb())
    .pipe(gulp.dest('app/assets/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});


// Browser-sync

var browserSync = require('browser-sync').create();

gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
});

// Watch

gulp.task('watch', ['browserSync', 'sass'], function() {
  gulp.watch('app/assets/scss/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload); 
  gulp.watch('app/assets/js/**/*.js', browserSync.reload);
  gulp.watch('app/assets/img/**/*.svg', browserSync.reload);
});


/**
 * BUILD
 */

// Delete folders

var del = require('del');

gulp.task('clean:dist', function() {
  return del.sync('dist');
});

// Concat and optimize JS and CSS files

var gulpIf = require('gulp-if');
var useref = require('gulp-useref-plus');
var uglify = require('gulp-uglify');
var cssnano = require('gulp-cssnano');
var cache = require('gulp-cache');

gulp.task('useref', function() {
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

// Optimize images

var imagemin = require('gulp-imagemin');

gulp.task('images', function() {
  return gulp.src('app/assets/img/**/*.+(png|jpg|gif|svg)')
    .pipe(cache(imagemin()))
    .pipe(gulp.dest('dist/assets/img'))
});

// Copy remaining folders

gulp.task('css', function() {
  return gulp.src('app/assets/css/**/*')
    .pipe(gulp.dest('dist/assets/css'))
});

gulp.task('js', function() {
  return gulp.src('app/assets/js/**/*')
    .pipe(gulp.dest('dist/assets/js'))
});

gulp.task('fonts', function() {
  return gulp.src('app/assets/fonts/**/*')
    .pipe(gulp.dest('dist/assets/fonts'))
});

gulp.task('ico', function() {
  return gulp.src('app/assets/ico/**/*')
    .pipe(gulp.dest('dist/assets/ico'))
});

gulp.task('plugins', function() {
  return gulp.src('app/assets/plugins/**/*')
    .pipe(gulp.dest('dist/assets/plugins'))
});

gulp.task('bootstrap', function() {
  return gulp.src('app/assets/bootstrap/**/*')
  .pipe(gulp.dest('dist/assets/bootstrap'))
});

// Build everything

var runSequence = require('run-sequence');

gulp.task('build', function(callback) {
  runSequence('clean:dist', 
    ['sass', 'useref', 'css', 'js', 'images', 'fonts', 'ico', 'plugins', 'bootstrap'], 
    callback);
});


/**
 * ACTION BY DEFAULT
 */

gulp.task('default', function (callback) {
  runSequence(['sass','browserSync', 'watch'],
    callback
  )
});