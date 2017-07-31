var { globals, lint } = require('./config');
var { rootDir } = globals;
var gulp = require('gulp');
var connect = require('gulp-connect');
var browserify = require('browserify')
var source = require('vinyl-source-stream');
var concat = require('gulp-concat');
var eslint = require('gulp-eslint');
var htmlreplace = require('gulp-html-replace');
var sass = require('gulp-sass');


gulp.task('default', ['development']);

gulp.task('development', ['assets', 'html', 'js', 'css', 'connect', 'watch']);
gulp.task('build', ['assets', 'html', 'js', 'css']);

gulp.task('connect', function () {
  connect.server({
    root: ['./public'],
    port: '3333',
    base: '0.0.0.0',
    livereload: true,
    fallback: './public/index.html'
  });
});

gulp.task('assets', function() {
  gulp.src(['./app/assets/**/*', '!./app/assets/index.html'])
    .pipe(gulp.dest('./public'))
});

gulp.task('html', function() {
  gulp.src('./buildAssets/index.html')
    .pipe(htmlreplace({
      paths: [`${rootDir}/app.css`, `${rootDir}/js/app.js`],
      globals: `<script>window.globals = ${JSON.stringify(globals)}</script>`,
      favicon: `<link rel="shortcut icon" href="${rootDir}/favicon.ico" type="image/x-icon">`
    }))
    .pipe(gulp.dest('./public'));
});

gulp.task('js', function () {
  return browserify({
    entries: './app/index.js',
    debug: true
  })
    .transform("babelify")
    .bundle()
    .on('error', console.error.bind(console))
    .pipe(source('app.js'))
    .pipe(gulp.dest('./public/js'))
    .pipe(connect.reload())
});

gulp.task('css', function() {
  return gulp.src(['./app/**/*.css', './app/**/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('app.css'))
    .pipe(gulp.dest('./public'))
    .pipe(connect.reload())
});

gulp.task('lint', function() {
  return gulp.src('./app/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
});

gulp.task('watch', function () {
  gulp.watch('./app/**/*.js', ['js'])
  gulp.watch('./app/**/*.css', ['css'])
});




