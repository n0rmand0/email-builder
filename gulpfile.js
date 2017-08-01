// set email below and run gulp task
// run 'gulp' to launch server
// run 'gulp d' to deploy
var email = 'test-email'

// config
var publicURL = '';
var deployHost= '',
var deployUser= '',
var deployPass= '',
var deployPort= '',
var deployRemotePath= '';

// 
var emailURL = publicURL+"/"+email;
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var inlineCss = require('gulp-inline-css');
var rename = require("gulp-rename");
var sftp = require('gulp-sftp');
var watch = require('gulp-watch');
var browserSync = require('browser-sync');
var replace = require('gulp-replace');

// watch
var watchTask = function() {
  gulp.watch('./'+email+'/source.html', function() {
    htmlTask();
    setTimeout(function () {
      browserSync.reload();

    }, 1000 );
  })
}

// browsersync
var browsersyncTask = function(){
  browserSync.init({
    startPath: '/'+email+'/index.html',
    server: {
        baseDir: "./"
     }

  });
}

// optimize images
var imagesTask = function() {
  return gulp.src( email+'/images/*')
      .pipe(imagemin({
          progressive: true,
          use: [pngquant()]
      }))
      .pipe(gulp.dest( email+'/images/' ));
}

// build html
var htmlTask = function(){
  return gulp.src(email+'/source.html')
  .pipe(rename("index.html"))
  .pipe(replace('#emailURL', emailURL))
  .pipe(inlineCss({
          applyStyleTags: true,
          applyLinkTags: false,
          removeStyleTags: false,
          removeLinkTags: true
  }))
  .pipe(gulp.dest(email+'/')),
  console.log('[BS] Build Complete');
}

// deploy email
var deployTask = function() {
  return gulp.src( email+'/**' )
    .pipe(sftp({
        host: deployHost,
        user: deployUser,
        pass: deployPass,
        port: deployPort,
        remotePath: deployRemotePath+email
    }));
}

// Commands
gulp.task('serve', function() {
  browsersyncTask();
  htmlTask();
  watchTask();
});
gulp.task('s', ['serve']);

gulp.task('build', function() {
  imagesTask();
  htmlTask();
});
gulp.task('b', ['build']);

gulp.task('deploy',['build'], function() {
  setTimeout(function () {
    console.log("\n----------------------------------------\nEMAIL URL:\n"+emailURL+"\n----------------------------------------\n");
    deployTask();
  }, 1000 );
});
gulp.task('d', ['deploy']);

gulp.task('default',['serve']);
