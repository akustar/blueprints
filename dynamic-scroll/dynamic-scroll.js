(() => {

  const DOM = {
    circle: document.getElementById('circle'),
    cards: Array.from(document.querySelectorAll('.cards > .card'))
  }

  function init () {
    initEvents()
    dynamicScroll()
  }

  function initEvents () {
    addEventListeners(window, 'resize scroll', dynamicScroll)
  }

  function dynamicScroll () {
    changeScale()
    displayCards()
  }

  function changeScale () {
    const scrollTop = window.pageYOffset
    const winWidth = window.innerWidth
    const winHeight = window.innerHeight
    const docHeight = document.body.scrollHeight
    const scrollEndPoint = docHeight - winHeight

    DOM.circle.style.transform = `scale(${Math.ceil(winWidth / DOM.circle.offsetWidth) / scrollEndPoint * scrollTop})`
  }

  function displayCards () {
    DOM.cards.forEach((elem) => {
      const scrollTop = window.pageYOffset
      const winHeight = window.innerHeight
      const limit = elem.offsetTop <= (winHeight * 0.8) + scrollTop

      elem.classList[limit ? 'add' : 'remove']('is-active')
    })
  }

  function addEventListeners (element, eventNames, listener) {
    eventNames.split(' ').forEach((event) => element.addEventListener(event, listener))
  }

  init()
  
})()