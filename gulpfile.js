var gulp = require("gulp"),
  http = require("http"),
  concat = require('gulp-concat'),
  minifyCSS = require("gulp-minify-css"),
  fs = require('fs'),
  semver = require('semver'),
  uglify = require('gulp-uglify'),
  replace = require('gulp-replace-task'),
  bump = require('gulp-bump'),
  git = require('gulp-git'),
  less = require('gulp-less'),
  //livereload = require('gulp-livereload'),
  moment = require('moment'),
  templateCache = require('gulp-angular-templatecache');



var backgroundScripts = [
  './bower_components/angular/angular.js',
  './src/js/app/services/vk.js',
  './src/js/app/services/chrome.js',
  './src/js/app/services/utils.js',
  './src/js/app/configuration.js',
  './src/js/background.js'
];

var enviromentScripts = ['./src/js/pageParser.js', './src/js/pageEnviroment.js'];

var vendorLibs = [
  './bower_components/lodash/dist/lodash.js',
  './bower_components/jquery/dist/jquery.js',
  './bower_components/bootstrap/dist/js/bootstrap.js',
  './bower_components/angular/angular.js',
  './bower_components/angular-sanitize/angular-sanitize.js',
  './bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
  './bower_components/fancybox/source/jquery.fancybox.js',
  './bower_components/Jcrop/js/jquery.Jcrop.js',
  './bower_components/blueimp-file-upload/js/vendor/jquery.ui.widget.js',
  './bower_components/blueimp-file-upload/js/jquery.iframe-transport.js',
  './bower_components/blueimp-file-upload/js/jquery.fileupload.js',
  './bower_components/momentjs/moment.js',
  './bower_components/angular-i18n/angular-locale_ru.js',
  './bower_components/angular-ui-select/dist/select.js',
  './bower_components/highcharts/highcharts.src.js'
];

var vendorLibsCss = [
  './bower_components/bootstrap/dist/css/bootstrap.min.css',
  './bower_components/font-awesome/css/font-awesome.css',
  './bower_components/fancybox/source/jquery.fancybox.css',
  './bower_components/Jcrop/css/jquery.Jcrop.css',
  './bower_components/select2/select2.css',
  './bower_components/select2/select2-bootstrap.css',
  './bower_components/angular-ui-select/dist/select.css'
];


gulp.task('scripts', function() {
  gulp.src(['./src/js/app/**/*.js'])
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('./public/pack'))

  gulp.src(vendorLibs)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./public/pack'))
});





gulp.task('background-scripts', function() {
  gulp.src(backgroundScripts)
    .pipe(concat('background.js'))
    .pipe(gulp.dest('./public/pack'))
});

gulp.task('dist-enviroment', function() {
  gulp.src(enviromentScripts)
    .pipe(concat('pageEnviroment.js'))
    .pipe(gulp.dest('./public/pack'))
});




gulp.task('less', function() {
  gulp.src('./src/less/styles.less')
    .pipe(less())
    .pipe(gulp.dest('./public/pack'));
});

gulp.task('less-page', function() {
  gulp.src('./src/less/page.less')
    .pipe(less())
    .pipe(gulp.dest('./public/pack'));
});



gulp.task('templates', function() {
  gulp.src('./src/templates/**/*.html')
    .pipe(templateCache('templates.js', {
      standalone: true,
      root: './templates/'
    }))
    .pipe(gulp.dest('./public/pack'));
});



gulp.task('vendors-styles', function() {
  gulp.src(vendorLibsCss)
    .pipe(minifyCSS({
      keepBreaks: true
    }))
    .pipe(concat('vendors.css'))
    .pipe(gulp.dest('./public/pack'))
});

gulp.task('scripts-deploy', function() {
  gulp.src(['./src/js/**/*.js'])
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/pack'))
  gulp.src(vendorLibs)
    .pipe(concat('vendor.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/pack'))
});

gulp.task('styles-deploy', function() {
  gulp.src([
      './public/pack/styles.css'
    ])
    .pipe(minifyCSS({
      keepBreaks: true
    }))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('./public/pack'))
});


gulp.task('dist-manifest', function() {
  var pkg = getPackageJson();

  gulp.src(['./src/manifest.json'])
    .pipe(bump({
      version: pkg.version
    }))
    .pipe(gulp.dest('./public'));
});


gulp.task('dist-background', function() {
  gulp.src(['./src/background.html'])
    .pipe(gulp.dest('./public'));
});

gulp.task('dist-pages', function() {
  gulp.src(['./src/pages/**/*.html'])
    .pipe(gulp.dest('./public/pages'));
});


gulp.task("watch", function() {
  //livereload.listen();
  gulp.watch('./src/js/**', ["scripts", "dist-enviroment"]);
  gulp.watch('./src/less/**', ["less"]);
  gulp.watch('./src/less/page.less', ["less-page"]);
  gulp.watch('./tmp/css/**', ["styles"]);
  gulp.watch('./src/manifest.json', ["dist-manifest"]);
  gulp.watch('./src/background.html', ["dist-background"]);
  gulp.watch('./src/pages/**', ["dist-pages"]);
  gulp.watch('./src/templates/**', ["templates"]);
  gulp.watch('./src/js/*.js', ["background-scripts"]);
  //gulp.watch('./public/pack//**').on('change', livereload.changed);
});

gulp.task('build', [
    'less',
    'vendors-styles',
    'templates',
    'scripts-deploy',
    'styles-deploy'
  ],
  function() {

  });


/* VERSION */
var getPackageJson = function() {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
};

function inc(type) {
  var pkg = getPackageJson();
  var newVer = semver.inc(pkg.version, type);

  git.tag('v' + newVer, 'new version', function(err) {
    console.log(newVer)
  });

  gulp.src(['./src/manifest.json'])
    .pipe(bump({
      version: newVer
    }))
    .pipe(gulp.dest('./public'));
  gulp.src(['./package.json'])
    .pipe(bump({
      version: newVer
    }))
    .pipe(gulp.dest('./'));
}

gulp.task('patch', function() {
  inc('patch');
});
gulp.task('feature', function() {
  inc('minor');
});
gulp.task('release', function() {
  inc('major');
});
