"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var minifyCss = require("gulp-csso");
var minifyImage = require("gulp-imagemin");
var minifyJs = require("gulp-uglify");
var webp = require("gulp-webp");
var rename = require("gulp-rename");
var concat = require("gulp-concat");
var run = require("run-sequence");
var del = require("del");

gulp.task("style", function() {
  gulp.src("source/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minifyCss())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

gulp.task("script", function() {
  return gulp.src([
    "source/js/menu-nav.js",
    "source/js/map.js",
    "source/js/marker.js"
  ])
  .pipe(concat("scripts.js"))
  .pipe(gulp.dest("build/js"))
  .pipe(rename({suffix: ".min"}))
  .pipe(minifyJs())
  .pipe(gulp.dest('build/js'))
});

gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(minifyImage([
      minifyImage.optipng({optimizationLevel: 3}),
      minifyImage.jpegtran({progressive: true}),
      ]))
    .pipe(gulp.dest("build/img"));
});

gulp.task("webp", function() {
  return gulp.src("source/img/**/*.jpg")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/img"));
});

gulp.task("serve", function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("source/*.html").on("change", server.reload);
});

gulp.task("build", function(done) {
  run("clean", "copy", "style", done);
});

gulp.task("copy", function () {
  return gulp.src([
  "source/fonts/**/*.{woff,woff2}",
  "source/img/**",
  "source/js/picturefill.min.js",
  "source/js/svg4everybody.min.js",
  "source/*.html"
  ], {
  base: "source"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
return del("build");
});
