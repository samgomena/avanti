var gulp = require("gulp");

/**
 * WATCH
 */

// Sass

var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("gulp-autoprefixer");
var wait = require("gulp-wait");
var csscomb = require("gulp-csscomb");

gulp.task("sass", function() {
  return gulp
    .src("app/assets/scss/**/*.scss")
    .pipe(wait(500))
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([require("postcss-flexbugs-fixes")]))
    .pipe(autoprefixer())
    .pipe(csscomb())
    .pipe(gulp.dest("app/assets/css"))
    .pipe(
      browserSync.reload({
        stream: true,
      })
    );
});

// Browser-sync

var browserSync = require("browser-sync").create();

gulp.task("browserSync", () =>
  browserSync.init({
    server: {
      baseDir: "app",
    },
  })
);

// Watch

gulp.task("watch", gulp.series("browserSync", "sass"), () => {
  gulp.watch("app/assets/scss/**/*.scss", gulp.series("sass"));
  gulp.watch("app/*.html", browserSync.reload);
  gulp.watch("app/assets/js/**/*.js", browserSync.reload);
  gulp.watch("app/assets/img/**/*.svg", browserSync.reload);
});

/**
 * BUILD
 */

// Delete folders

var del = require("del");

gulp.task("clean:dist", function() {
  return del.sync(["dist/"]);
});

// Concat and optimize JS and CSS files

var gulpIf = require("gulp-if");
var useref = require("gulp-useref-plus");
var uglify = require("gulp-uglify");
var cssnano = require("gulp-cssnano");
var cache = require("gulp-cache");

gulp.task("useref", () => {
  return gulp
    .src("app/*.html")
    .pipe(useref())
    .pipe(gulpIf("*.js", uglify()))
    .pipe(gulpIf("*.css", cssnano()))
    .pipe(gulp.dest("dist"));
});

// Optimize images

var imagemin = require("gulp-imagemin");

gulp.task("images", () => {
  return gulp
    .src("app/assets/img/**/*.+(png|jpg|jpeg|gif|svg)")
    .pipe(cache(imagemin()))
    .pipe(gulp.dest("dist/assets/img"));
});

// Copy remaining folders

gulp.task("css", () => {
  return gulp.src("app/assets/css/**/*").pipe(gulp.dest("dist/assets/css"));
});

gulp.task("js", () => {
  return gulp.src("app/assets/js/**/*").pipe(gulp.dest("dist/assets/js"));
});

gulp.task("fonts", () => {
  return gulp.src("app/assets/fonts/**/*").pipe(gulp.dest("dist/assets/fonts"));
});

gulp.task("ico", () => {
  return gulp.src("app/assets/ico/**/*").pipe(gulp.dest("dist/assets/ico"));
});

gulp.task("plugins", () => {
  return gulp
    .src("app/assets/plugins/**/*")
    .pipe(gulp.dest("dist/assets/plugins"));
});

gulp.task("bootstrap", () => {
  return gulp
    .src("app/assets/bootstrap/**/*")
    .pipe(gulp.dest("dist/assets/bootstrap"));
});

// Build everything

var runSequence = require("run-sequence");

gulp.task("build", done => {
  gulp.series(
    "clean:dist",
    "sass",
    "useref",
    "css",
    "js",
    "images",
    "fonts",
    "ico",
    "plugins",
    "bootstrap"
  );
  done();
});

/**
 * ACTION BY DEFAULT
 */

gulp.task("default", done => {
  gulp.series("sass", "browserSync", "watch");
  done();
});
