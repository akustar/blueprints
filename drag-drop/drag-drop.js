{

  const DOM = {
    dropZone: document.getElementById('dropZone'),
    files: document.getElementById('files'),
    input: document.getElementById('input')
  }

  function init () {
    initEvents()
  }

  function initEvents () {
    addEventListeners(DOM.dropZone, 'drag dragstart dragend dragover dragenter dragleave drop', (event) => {
      event.stopPropagation()
      event.preventDefault()
    })
    addEventListeners(DOM.dropZone, 'dragover dragenter', (event) => {
      DOM.dropZone.classList.add('is-dragover')
    })
    addEventListeners(DOM.dropZone, 'dragleave dragend drop', (event) => {
      DOM.dropZone.classList.remove('is-dragover')
    })
    DOM.dropZone.addEventListener('drop', (event) => {
      const droppedFiles = event.dataTransfer.files
      showFiles(droppedFiles)
    })
    DOM.input.addEventListener('change', (event) => {
      const uploadedFiles = event.target.files
      showFiles(uploadedFiles)
    })
  }

  function showFiles (files) {
    const fragment = document.createDocumentFragment()
    for (const file of files) {
      const div = document.createElement('div')
      div.innerHTML = `
        <em>${file.name}</em>
        <span>×</span>
      `
      fragment.appendChild(div)
    }
    DOM.files.appendChild(fragment)
  }

  function addEventListeners (element, eventNames, listener) {
    eventNames.split(' ').forEach((event) => element.addEventListener(event, listener))
  }

  init()
}
