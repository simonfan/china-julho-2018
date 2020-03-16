const notify = require('gulp-notify')
const plumber = require('gulp-plumber')
const less = require('gulp-less')

module.exports = (gulp) => {
	gulp.task('compile:less', () => {
	  return gulp.src('./src/index.less')
	    .pipe(plumber({
	      errorHandler: (err) => {
	        notify.onError('LESS Compilation error')(err)
	        console.warn(err.message)
	      }
	    }))
	    .pipe(less())
	    .pipe(gulp.dest('./dist'))
	})
}
