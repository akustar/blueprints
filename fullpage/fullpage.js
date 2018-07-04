// 리팩토링 필요
{
  const DOM = {
    container: document.querySelector('.fullpage-container'),
    sections: document.querySelectorAll('.fullpage-container section'),
    navLinks: Array.from(document.querySelectorAll('.fullpage-nav > a'))
  }

  let isAnimating = false
  let current = 0

  function init () {
    initEvents()
  }

  function initEvents () {
    DOM.container.addEventListener('mousewheel', onMouseWheel)
    DOM.navLinks.forEach((elem, index) => {
      elem.addEventListener('click', (event) => {
        event.preventDefault()
        navigate(index)
      })
    })    
  }

  function onMouseWheel (event) {
    if (isAnimating) return

    const direction = event.deltaY > 0 ? 'DOWN' : 'UP'

    if (direction === 'DOWN') {
      if (current === DOM.sections.length - 1) return
      current++
    }
    // UP
    else if (direction === 'UP') {
      if (current === 0) return
      current--
    }

    moveTo()
  }

  function navigate (index) {
    current = index

    moveTo()
  }

  function moveTo () {
    isAnimating = true

    const transitionend = () => {
      isAnimating = false
      DOM.container.removeEventListener('transitionend', transitionend)
    }
    DOM.container.addEventListener('transitionend', transitionend)

    activeNavLinks()
    updateScrollTop()
  }

  function updateScrollTop () {
    const scrollTop = current * window.innerHeight
    DOM.container.style.transform = `translate3d(0, ${-scrollTop}px, 0)`
  }

  function activeNavLinks () {
    DOM.navLinks.forEach((elem) => elem.classList.remove('active'))
    DOM.navLinks[current].classList.add('active')
  }  

  init()
}