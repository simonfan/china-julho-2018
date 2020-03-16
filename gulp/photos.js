const fs = require('fs')
const path = require('path')

const responsive = require('gulp-responsive')
const imagemin = require('gulp-imagemin')
const imageSize = require('image-size')

const JPG_RE = /\.jpg/

const isJpg = filename => {
  return JPG_RE.test(filename)
}

module.exports = gulp => {
	gulp.task('photos-responsive', () => {
		return gulp.src('media/photos-src/**/*.jpg')
			.pipe(responsive({
				'*': [
					{
						width: 30,
						rename: {
							suffix: '-miniature',
						}
					},
					{
						width: 600,
						rename: {
							suffix: '-600w'
						}
					},
					{
						width: 1200,
						rename: {
							suffix: '-1200w',
						}
					}
				]
			}))
			.pipe(imagemin())
			.pipe(gulp.dest('media/photos-dist'))
	})

	gulp.task('photos-original', () => {
		return gulp.src('media/photos-src/**/*.jpg')
			.pipe(imagemin())
			.pipe(gulp.dest('media/photos-dist'))
	})

	gulp.task('photos', ['photos-responsive', 'photos-original'])

	gulp.task('unused-photos', () => {
	  const PHOTO_RE = /IMG_[0-9]{8}_[0-9]{6}/g

	  const indexContents = fs.readFileSync(path.join(__dirname, '../src/index.html'), 'utf8')
	  const photos = fs.readdirSync(path.join(__dirname, '../media/photos-src'))
	    .filter(isJpg)
	    .map(filename => {
	      return filename.replace(JPG_RE, '')
	    })
	  const used = indexContents.match(PHOTO_RE)

	  const unused = photos.filter(photo => !used.includes(photo))

	  console.log(unused)
	})

	gulp.task('image-sizes', () => {
		const sizes = fs.readdirSync(path.join(__dirname, '../media/photos-src'))
	    .filter(isJpg)
	    .reduce((acc, filename) => {
	    	const id = path.basename(filename, '.jpg')

	    	return {
	    		...acc,
	    		[id]: imageSize(path.join(__dirname, '../media/photos-src', filename))
	    	}

	    }, {})

	  fs.writeFileSync(
	  	path.join(__dirname, '../tmp/image-sizes.json'),
	  	JSON.stringify(sizes, null, '  '),
	  	'utf8'
	  )
	})
}
