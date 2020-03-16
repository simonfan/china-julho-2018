const path = require('path')
const fs = require('fs')

const notify = require('gulp-notify')
const plumber = require('gulp-plumber')
const nunjucks = require('gulp-nunjucks')

const isJpg = filename => {
	return /\.jpg$/.test(filename)
}

module.exports = gulp => {
	gulp.task('compile:html', () => {
		return gulp.src('src/**/*.html')
	    .pipe(plumber({
	      errorHandler: (err) => {
	        notify.onError('Nunjucks compilation error')(err)
	        console.warn(err.message)
	      }
	    }))
			.pipe(nunjucks.compile({
				imageSizes: require('../src/image-sizes.json')
			}))
			.pipe(gulp.dest('dist'))
	})
}
