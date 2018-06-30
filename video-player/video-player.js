// 작업중

{

  const DOM = {
    container: document.querySelector('.player-container'),
    video: document.getElementById('video'),
    seek: document.getElementById('seek'),
    progressFilled: document.getElementById('progressFilled'),
    progressCursor: document.getElementById('progressCursor'),
    currentTime: document.getElementById('currentTime'),
    totalTime: document.getElementById('totalTime'),
    volume: document.getElementById('volume'),
    togglePlayButton: document.getElementById('togglePlay'),
    toggleMuteButton: document.getElementById('toggleMute'),
    toggleFullscreenButton: document.getElementById('toggleFullscreen'),
  }

  let isPlaying = false
  let isMuted = false
  let isFullScreen = false
  let isFocused = false
  let isDragging = false
  let prevPrettyTime = ''

  function init () {
    initEvents()
  }

  function initEvents () {
    DOM.video.addEventListener('timeupdate', onTimeupdate)
    DOM.video.addEventListener('loadedmetadata', loadedmetadata)
    DOM.togglePlayButton.addEventListener('click', togglePlay)
    DOM.toggleMuteButton.addEventListener('click', toggleMute)
    DOM.toggleFullscreenButton.addEventListener('click', toggleFullscreen)
    DOM.seek.addEventListener('mousedown', handleTimeupdate)
    DOM.volume.addEventListener('input', updateVolume)
    
    document.addEventListener('mousemove', (event) => { 
      if (isDragging) handleTimeupdate(event)
    })
    document.addEventListener('mouseup', (event) => {
      isDragging = false
      DOM.seek.classList.remove('is-dragging')
    })

    DOM.container.addEventListener('keydown', (event) => {
      if (!event.altKey && !event.shiftKey && !event.metaKey && !event.ctrlKey) {
        event.preventDefault()
        switch (event.keyCode) {
          // 엔터
          case 13:
            fullScreen()
          break
          // esc
          case 27:
            unFullScreen()
          break
          // 스페이스
          case 32:
            togglePlay()
          break
          case 37: // 왼쪽 방향 키
            skipPrev()
          break
          case 39: // 오른쪽 방향 키
            skipNext() 
          break
          case 38: // 위 방향 키
            volumeUp()
          break
          case 40: // 아래 방향 키
            volumeDown()
          break
          case 77: // M
            toggleMute()
          break
        }
      }
    })
  }

  function loadedmetadata () {
    DOM.totalTime.innerHTML = prettyTime(DOM.video.duration)
  }

  // 동영상 재생
  function onPlay () {
    isPlaying = true

    DOM.togglePlayButton.classList.remove('play')
    DOM.togglePlayButton.classList.add('pause')

    DOM.video.play()
  }

  // 동영상 일시정지
  function onPause () {
    isPlaying = false

    DOM.togglePlayButton.classList.remove('pause')
    DOM.togglePlayButton.classList.add('play')

    DOM.video.pause()
  }

  // 동영상 음소거
  function onMuted () {
    isMuted = true

    DOM.toggleMuteButton.classList.remove('mute')
    DOM.toggleMuteButton.classList.add('unmute')

    DOM.video.muted = isMuted
  }

  // 동영상 음소거 해제
  function onUnMuted () {
    isMuted = false

    DOM.toggleMuteButton.classList.remove('unmute')
    DOM.toggleMuteButton.classList.add('mute')    

    DOM.video.muted = isMuted
  }

  // 소리 키움
  function volumeUp () {
    const volume = Math.min(Number(DOM.video.volume) + 5, 100)

    DOM.video.volume = volume / 100
    DOM.volume.style.backgroundSize = `${(volume * 100) / 100}% 100%`
  }

  // 소리 줄임
  function volumeDown () {
    const volume = Math.max(Number(DOM.video.volume) - 5, 0)

    DOM.video.volume = volume / 100
    DOM.volume.style.backgroundSize = `${(volume * 100) / 100}% 100%`
  }

  function updateVolume (event) {
    const volume = event.target.value

    DOM.video.volume = volume / 100
    DOM.volume.style.backgroundSize = `${(volume * 100) / 100}% 100%`
  }

  function skipPrev () {

  }

  function skipNext () {

  }

  // 전체화면
  function onFullscreen (event) {
    isFullScreen = true

    DOM.toggleFullscreenButton.classList.remove('fullscreen')
    DOM.toggleFullscreenButton.classList.add('unfullscreen')

    if (!document.webkitFullscreenElement) DOM.video.webkitRequestFullscreen()
  }

  // 전체화면 해제
  function onUnFullscreen (event) {
    isFullScreen = false

    DOM.toggleFullscreenButton.classList.remove('unfullscreen')
    DOM.toggleFullscreenButton.classList.add('fullscreen')
    
    if (document.webkitFullscreenElement) document.webkitExitFullscreen()
  }

  // 동영상 재생/일시정지 토글
  function togglePlay () {
    if (isPlaying) {
      onPause()
    }
    else {
      onPlay()
    }
  }

  // 동영상 음소거/음소거 해제 토글
  function toggleMute () {
    if (isMuted) {
      onUnMuted()
    }
    else {
      onMuted()
    }
  }

  // 동영상 전체화면/전체화면 해제 토글
  function toggleFullscreen () {
    if (isFullScreen) {
      onUnFullscreen()
    }
    else {
      onFullscreen()
    }
  }  

  function onFoucsed () {
    isFocused = true
  }

  function onUnFoucsed () {
    isFocused = false
  }

  function prettyTime (t) {
    const hours = zeroFill(Math.floor(t / 3600))
    const minutes = zeroFill(Math.floor(t % 3600 / 60))
    const second = zeroFill(Math.floor(t % 3600 % 60))

    return `${hours}:${minutes}:${second}`
  }

  function updateTimeDisplay () {
    const currentPrettyTime = prettyTime(DOM.video.currentTime)

    if (prevPrettyTime !== currentPrettyTime) {
      DOM.currentTime.innerHTML = currentPrettyTime
    }
    prevPrettyTime = currentPrettyTime
  }

  function updateProgressFilled () {
    DOM.progressFilled.style.transform = `scaleX(${DOM.video.currentTime / DOM.video.duration})`
  }

  function updateProgressCursor () {
    DOM.progressCursor.style.left = `${DOM.video.currentTime / DOM.video.duration * 100}%`
  }

  function onTimeupdate () {
    updateTimeDisplay()
    updateProgressFilled()
    updateProgressCursor()
  }

  function handleTimeupdate (event) {
    event.stopPropagation()

    isDragging = true

    const rect = DOM.seek.getBoundingClientRect()
    DOM.video.currentTime = Math.min(Math.max((event.clientX - rect.left) / rect.width * DOM.video.duration, 0), DOM.video.duration)

    onTimeupdate()

    if (!DOM.seek.classList.contains('is-dragging')) DOM.seek.classList.add('is-dragging')
  }

  function zeroFill (n) {
    return ('0' + n).slice(-2)
  }

  init()
}
