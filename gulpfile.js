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

var vendorLibs = [
  './bower_components/jquery/dist/jquery.js',
  './bower_components/bootstrap/dist/js/bootstrap.js',
  './bower_components/angular/angular.js',
  './bower_components/angular-bootstrap/ui-bootstrap-tpls.js'
];

var vendorLibsCss = [
  './bower_components/bootstrap/dist/css/bootstrap.min.css',
  './bower_components/font-awesome/css/font-awesome.css',
  './bower_components/fancybox/source/jquery.fancybox.css'
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





gulp.task('less', function() {
  gulp.src('./src/less/styles.less')
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
  gulp.watch('./src/js/**', ["scripts"]);
  gulp.watch('./src/less/**', ["less"]);
  gulp.watch('./tmp/css/**', ["styles"]);
  gulp.watch('./src/manifest.json', ["dist-manifest"]);
  gulp.watch('./src/background.html', ["dist-background"]);
  gulp.watch('./src/pages/**', ["dist-pages"]);
  gulp.watch('./src/templates/**', ["templates"]);
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
