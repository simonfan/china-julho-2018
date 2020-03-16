const fs = require('fs')
const path = require('path')

const gulp = require('gulp')
const size = require('gulp-size')
const browserSync = require('browser-sync')

require('./gulp/javascript')(gulp)
require('./gulp/css')(gulp)
require('./gulp/html')(gulp)
require('./gulp/photos')(gulp)

gulp.task('compile', ['compile:html', 'compile:less', 'compile:js'])

gulp.task('develop', ['compile'], () => {
  let server = browserSync.create()
  server.init({
    server: {
      baseDir: ['dist', 'src']
    }
  })

  gulp.watch('src/**/*.less', ['compile:less'])
  gulp.watch([
    'src/**/*.html',
    'src/sections.json'
  ], ['compile:html'])
  gulp.watch('src/**/*.js', ['compile:js'])

  gulp.watch('dist/**/*', server.reload)
})

gulp.task('distribute', ['compile'])

gulp.task('sizes', () => {
  return gulp.src('dist/photos/*-miniature.jpg')
    .pipe(size())
})
