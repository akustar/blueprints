(() => {

  const DOM = {
    box: document.querySelector('.box')
  }

  const sizes = {
    width: DOM.box.offsetWidth,
    height: DOM.box.offsetHeight
  }

  const movement = {
    rotateX: 10,
    rotateY: 5
  }

  function init () {
    initEvents()
  }

  function initEvents () {
    document.addEventListener('mousemove', (event) => {
      requestAnimationFrame(() => {
        const mousepos = {
          x: event.pageX,
          y: event.pageY
        }

        console.log(mousepos)

        rotate(mousepos)
      })
    })
  }

  function rotate (mousepos) {
    const rotX = movement.rotateX ? 2 * movement.rotateX / sizes.height * mousepos.y - movement.rotateX : 0,
      rotY = movement.rotateY ? 2 * movement.rotateY / sizes.width * mousepos.x - movement.rotateY : 0

    // update rotate
    DOM.box.style.transform = `rotate3d(1, 0, 0, ${rotX}deg) rotate3d(0, 1, 0, ${rotY}deg)`
  }

  init()

})()