const path = require('path')

const browserify = require('browserify')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const babelify = require('babelify')

const bundle = (entry) => {
  const basename = path.basename(entry)

  let b = browserify({
    entries: entry,
  })

  b.transform('babelify', {
		'presets': [
			'@babel/preset-env'
		],
		'plugins': [
			'@babel/plugin-proposal-object-rest-spread'
		]
	})

  return b.bundle()
    .pipe(source(basename))
    .pipe(buffer())
}

module.exports = gulp => {
	gulp.task('compile:js', () => {
		return bundle('./src/index.js')
			.pipe(gulp.dest('./dist'))
	})
}
