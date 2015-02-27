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
  zip = require('gulp-zip'),
  templateCache = require('gulp-angular-templatecache'),
  ngAnnotate = require('gulp-ng-annotate');

var gulpsync = require('gulp-sync')(gulp);

var urlConfig = require('./config/urls');
var extensionConfig = require('./config/extension');

var backgroundScripts = [
  './bower_components/angular/angular.js',
  './src/js/app/services/chrome.js',
  './src/js/app/services/utils.js',
  './src/js/app/configuration.js',
  './src/js/background.js'
];

var enviromentScripts = ['./src/js/pageParser.js', './src/js/pageEnviroment.js'];

var vendorLibs = [
  './bower_components/socket.io-client/socket.io.js',
  './bower_components/lodash/dist/lodash.js',
  './bower_components/jquery/dist/jquery.js',
  './bower_components/bootstrap/dist/js/bootstrap.js',
  './bower_components/angular/angular.js',
  './bower_components/angular-sanitize/angular-sanitize.js',
  './bower_components/angular-animate/angular-animate.js',
  './bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
  './bower_components/fancybox/source/jquery.fancybox.js',
  './bower_components/Jcrop/js/jquery.Jcrop.js',
  './bower_components/blueimp-file-upload/js/vendor/jquery.ui.widget.js',
  './bower_components/blueimp-file-upload/js/jquery.iframe-transport.js',
  './bower_components/blueimp-file-upload/js/jquery.fileupload.js',
  './bower_components/momentjs/moment.js',
  './bower_components/angular-i18n/angular-locale_ru.js',
  './bower_components/angular-ui-select/dist/select.js',
  './bower_components/highcharts/highcharts.src.js',
  './bower_components/jquery-autosize/jquery.autosize.js',
  './bower_components/jquery-mousewheel/jquery.mousewheel.js',
  './bower_components/angular-local-storage/dist/angular-local-storage.js',
  './bower_components/shepherd.js/shepherd.js'
];

var vendorLibsCss = [
  './bower_components/bootstrap/dist/css/bootstrap.min.css',
  './bower_components/font-awesome/css/font-awesome.css',
  './bower_components/fancybox/source/jquery.fancybox.css',
  './bower_components/Jcrop/css/jquery.Jcrop.css',
  './bower_components/select2/select2.css',
  './bower_components/select2/select2-bootstrap.css',
  './bower_components/angular-ui-select/dist/select.css',
  './bower_components/ionicons/css/ionicons.css', 
  './bower_components/shepherd.js/css/shepherd-theme-arrows.css'
];


gulp.task('scripts', function() {
  gulp.src(['./src/js/app/**/*.js'])
    .pipe(replace({
      patterns: [{
        match: 'apiServer',
        replacement: urlConfig.apiServer_dev
      }, {
        match: 'extensionId',
        replacement: extensionConfig.extensionId_dev
      }]
    }))
    .pipe(ngAnnotate())
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('./public/pack'))

  gulp.src(vendorLibs)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./public/pack'))
});

gulp.task('background-scripts', function() {
  return gulp.src(backgroundScripts)
    .pipe(replace({
      patterns: [{
        match: 'apiServer',
        replacement: urlConfig.apiServer_dev
      }, {
        match: 'extensionId',
        replacement: extensionConfig.extensionId_dev
      }]
    }))
    .pipe(ngAnnotate())
    .pipe(concat('background.js'))
    .pipe(gulp.dest('./public/pack'))
});

gulp.task('dist-enviroment', function() {
  return gulp.src(enviromentScripts)
    .pipe(replace({
      patterns: [{
        match: 'apiServer',
        replacement: urlConfig.apiServer_dev
      }, {
        match: 'extensionId',
        replacement: extensionConfig.extensionId_dev
      }]
    }))
    .pipe(ngAnnotate())
    .pipe(concat('pageEnviroment.js'))
    .pipe(gulp.dest('./public/pack'))
});



gulp.task('less', function() {
  return gulp.src('./src/less/styles.less')
    .pipe(less())
    .pipe(gulp.dest('./public/pack'));
});

gulp.task('less-page', function() {
  return gulp.src('./src/less/page.less')
    .pipe(less())
    .pipe(gulp.dest('./public/pack'));
});



gulp.task('templates', function() {
  return gulp.src('./src/templates/**/*.html')
    .pipe(templateCache('templates.js', {
      standalone: true,
      root: './templates/'
    }))
    .pipe(gulp.dest('./public/pack'));
});

 

gulp.task('vendors-styles', function() {
  return gulp.src(vendorLibsCss)
    .pipe(minifyCSS({
      keepBreaks: true
    }))
    .pipe(concat('vendors.css'))
    .pipe(gulp.dest('./public/pack'))
});


gulp.task('scripts_pack_uglify', function() {
  return gulp.src(['./public/pack/*.js'])
    .pipe(uglify())
    .pipe(gulp.dest('./public/pack'));
});

gulp.task('styles-deploy', function() {
  return gulp.src([
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

  return gulp.src(['./src/manifest.json'])
    .pipe(bump({
      version: pkg.version
    }))
    .pipe(gulp.dest('./public'));
});


gulp.task('dist-background', function() {
  return gulp.src(['./src/background.html'])
    .pipe(gulp.dest('./public'));
});

gulp.task('dist-pages', function() {
  return gulp.src(['./src/pages/**/*.html'])
    .pipe(gulp.dest('./public/pages'));
});


gulp.task('scripts-deploy', function() {
  gulp.src(['./src/js/app/**/*.js'])
    .pipe(replace({
      patterns: [{
        match: 'apiServer',
        replacement: urlConfig.apiServer
      }, {
        match: 'extensionId',
        replacement: extensionConfig.extensionId
      }]
    }))
    .pipe(ngAnnotate())
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('./public/pack'))

  gulp.src(vendorLibs)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('./public/pack'))
});

gulp.task('background-scripts-deploy', function() {
  return gulp.src(backgroundScripts)
    .pipe(replace({
      patterns: [{
        match: 'apiServer',
        replacement: urlConfig.apiServer
      }, {
        match: 'extensionId',
        replacement: extensionConfig.extensionId
      }]
    }))
    .pipe(ngAnnotate())
    .pipe(concat('background.js'))
    .pipe(gulp.dest('./public/pack'))
});

gulp.task('dist-enviroment-deploy', function() {
  return gulp.src(enviromentScripts)
    .pipe(replace({
      patterns: [{
        match: 'apiServer',
        replacement: urlConfig.apiServer
      }, {
        match: 'extensionId',
        replacement: extensionConfig.extensionId
      }]
    }))
    .pipe(ngAnnotate())
    .pipe(concat('pageEnviroment.js'))
    .pipe(gulp.dest('./public/pack'))
});

gulp.task('zip_public', function() {
  return gulp.src('./public/**')
    .pipe(zip('extension.zip'))
    .pipe(gulp.dest('./'));
});

gulp.task("watch", function() {
  gulp.watch('./src/js/**', ["scripts", "dist-enviroment"]);
  gulp.watch('./src/less/**', ["less"]);
  gulp.watch('./src/less/page.less', ["less-page"]);
  gulp.watch('./tmp/css/**', ["styles"]);
  gulp.watch('./src/manifest.json', ["dist-manifest"]);
  gulp.watch('./src/background.html', ["dist-background"]);
  gulp.watch('./src/pages/**', ["dist-pages"]);
  gulp.watch('./src/templates/**', ["templates"]);
  gulp.watch('./src/js/*.js', ["background-scripts"]);
});


gulp.task('build', gulpsync.sync([
  ['dist-enviroment-deploy',
    'less',
    'less-page',
    'dist-manifest',
    'dist-background',
    'dist-pages',
    'templates',
    'scripts-deploy',
    'background-scripts-deploy'
  ],
  'scripts_pack_uglify',
  'zip_public'
]));




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
