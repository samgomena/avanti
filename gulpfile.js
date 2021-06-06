const gulp = require("gulp");

/**
 * WATCH
 */

// Sass

const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("gulp-autoprefixer");
const wait = require("gulp-wait");
const csscomb = require("gulp-csscomb");

gulp.task("sass", (done) => {
  gulp
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
  done();
});

// Browser-sync

const browserSync = require("browser-sync").create();

gulp.task("browserSync", () =>
  browserSync.init({
    server: {
      baseDir: "app",
    },
  })
);

gulp.task("serve:dist", () =>
  browserSync.init({
    server: {
      baseDir: "dist",
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

const del = require("del");

gulp.task("clean:dist", (done) => {
  del.sync(["dist/"]);
  done();
});

// Concat and optimize JS and CSS files

const gulpIf = require("gulp-if");
const useref = require("gulp-useref");
const uglify = require("gulp-uglify");
const cssnano = require("gulp-cssnano");
const cache = require("gulp-cache");
const fileinclude = require("gulp-file-include");

gulp.task("useref", (done) => {
  return gulp
    .src("app/*.html")
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(useref())
    .pipe(gulpIf("*.js", uglify()))
    .pipe(gulpIf("*.css", cssnano()))
    .pipe(useref())
    .pipe(gulp.dest("dist"));
  // done();
});

// Optimize images

const imagemin = require("gulp-imagemin");

gulp.task("images", (done) => {
  gulp
    .src("app/assets/img/**/*.+(png|jpg|jpeg|gif|svg)")
    .pipe(cache(imagemin()))
    .pipe(gulp.dest("dist/assets/img"));
  done();
});

// Copy remaining folders

gulp.task("css", (done) => {
  gulp.src("app/assets/css/**/*").pipe(gulp.dest("dist/assets/css"));
  done();
});

gulp.task("js", (done) => {
  gulp.src("app/assets/js/**/*").pipe(gulp.dest("dist/assets/js"));
  done();
});

gulp.task("fonts", (done) => {
  gulp.src("app/assets/fonts/**/*").pipe(gulp.dest("dist/assets/fonts"));
  done();
});

gulp.task("ico", (done) => {
  gulp.src("app/assets/ico/**/*").pipe(gulp.dest("dist/assets/ico"));
  done();
});

gulp.task("plugins", (done) => {
  gulp.src("app/assets/plugins/**/*").pipe(gulp.dest("dist/assets/plugins"));
  done();
});

gulp.task("bootstrap", (done) => {
  gulp
    .src("app/assets/bootstrap/**/*")
    .pipe(gulp.dest("dist/assets/bootstrap"));
  done();
});

// Build everything

gulp.task(
  "build",
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
  )
);

/**
 * ACTION BY DEFAULT
 */

gulp.task("default", gulp.series("sass", "useref", "browserSync", "watch"));
