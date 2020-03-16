import lazysizes from 'lazysizes'
import mediumZoom from 'medium-zoom'

// https://stereochro.me/ideas/detecting-broken-images-js
const hasImageLoaded = img => {
	// During the onload event, IE correctly identifies any images that
	// weren't downloaded as not complete. Others should too. Gecko-based
	// browsers act like NS4 in that they report this incorrectly.
	if (!img.complete) {
	  return false
	}

	// However, they do have two very useful properties: naturalWidth and
	// naturalHeight. These give the true size of the image. If it failed
	// to load, either of these should be zero.
	if (typeof img.naturalWidth != 'undefined' && img.naturalWidth == 0) {
	  return false
	}

	// No other way of checking: assume it's ok.
	return true
}

const setUpZoom = () => {
	const getZoomMargin = () => {
		return window.innerWidth < 700 ? 10 : 40
	}
	
	const zoom = mediumZoom('[data-zoom-src]', {
		background: 'rgba(0, 0, 0, 0.8)',
		margin: getZoomMargin(),
		scrollOffset: 0,
	})

	window.addEventListener('resize', () => {
		zoom.update({
			margin: getZoomMargin()
		})
	})
}

const setUpFigures = () => {
	const IMAGES = Array.from(document.querySelectorAll('img'))
	const FIGURES = Array.from(document.querySelectorAll('figure'))

	const updateFiguresStatus = (pageYOffset) => {
		FIGURES.forEach(element => {
			if (element.offsetTop < pageYOffset + window.innerHeight * 2 / 3) {
				element.classList.add('active')
			}
		})
	}

	window.addEventListener('scroll', () => {
		updateFiguresStatus(window.pageYOffset)
	})

	Promise.all(IMAGES.map(img => {
		return new Promise((resolve, reject) => {
			if (hasImageLoaded(img)) {
				resolve()
			} else {
				img.addEventListener('load', resolve)
				img.addEventListener('error', resolve)
			}
		})
	}))
	.then(() => {
		updateFiguresStatus(window.pageYOffset)
	})
}

const setUpAudios = () => {
	const PAUSE_ALL_AUDIO = document.getElementById('pause-all-audio')
	const AUDIO_CONTROLS = Array.from(document.querySelectorAll('.audio-control'))

	const isAnyAudioPlaying = () => {
		return AUDIO_CONTROLS.some(control => {
			return !control.querySelector('audio').paused
		})
	}

	const pauseAll = () => {
		AUDIO_CONTROLS.forEach(control => {
			control.querySelector('audio').pause()
		})
		PAUSE_ALL_AUDIO.classList.remove('active')
	}

	const playAudio = (audio) => {
		pauseAll()
		audio.play()
		PAUSE_ALL_AUDIO.classList.add('active')
	}

	const pauseAudio = (audio) => {
		audio.pause()

		if (!isAnyAudioPlaying()) {
			PAUSE_ALL_AUDIO.classList.remove('active')
		}
	}

	PAUSE_ALL_AUDIO.addEventListener('click', pauseAll)

	AUDIO_CONTROLS.forEach(control => {
		const audio = control.querySelector('audio')

		audio.addEventListener('play', e => {
			control.classList.add('playing')
		})

		audio.addEventListener('pause', e => {
			control.classList.remove('playing')
		})

		audio.addEventListener('ended', e => {
			control.classList.remove('playing')

			if (!isAnyAudioPlaying()) {
				PAUSE_ALL_AUDIO.classList.remove('active')
			}
		})

		control.addEventListener('click', e => {
			if (audio.paused) {
				playAudio(audio)
			} else {
				pauseAudio(audio)
			}
		})
	})
}

document.addEventListener('DOMContentLoaded', () => {
	setUpFigures()
	setUpZoom()
	setUpAudios()
})


