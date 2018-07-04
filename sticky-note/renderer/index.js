const { ipcRenderer, remote } = require('electron')
const createWindowButton = document.getElementById('createWindowButton')
const deleteNoteButton = document.getElementById('deleteNoteButton')
const paletteButton = document.getElementById('paletteButton')
const alwaysOnTopButton = document.getElementById('alwaysOnTopButton')
const palette = document.querySelector('.palette')
const note = document.getElementById('note')
const modal = document.getElementById('modal')
const confirmButton = document.getElementById('confirm')
const cancelButton = document.getElementById('cancel')
const debounce = require('debounce')
const tippy = require('tippy.js')

let key, theme, content

function init() {
  ipc()
  initEvents()
}

function ipc() {
  ipcRenderer.on('preferences', (event, {savedKey, preferences}) => {
    key = savedKey
    theme = preferences.theme
    content = preferences.content || ''

    initNote()
  })
  ipcRenderer.on('blur-window', (event) => {
    closePalette()
  })  
}

function initNote() {
  document.body.className = ''
  document.body.classList.add(theme)

  note.value = content
}

function initEvents() {
  note.addEventListener('click', closePalette)
  note.addEventListener('input', debounce(event => input(event), 250))
  deleteNoteButton.addEventListener('click', deleteNote)
  createWindowButton.addEventListener('click', createWindow)
  paletteButton.addEventListener('click', openPalette)
  confirmButton.addEventListener('click', closeWindow)
  cancelButton.addEventListener('click', closeModal)
  alwaysOnTopButton.addEventListener('click', alwaysOnTop)
  Array.from(palette.querySelectorAll('div')).forEach(elem => elem.addEventListener('click', selectColor))
  document.addEventListener('drop', event => event.preventDefault())
  tippy(document.querySelectorAll('.titlebar button'))
}

function createWindow() {
  ipcRenderer.send('create-window', key)
}

function closeWindow() {
  ipcRenderer.send('close-window', key)
}

function deleteNote() {
  if (note.value.trim().length > 0) {
    openModal()
  }
  else {
    closeWindow()
  }
}

function openModal() {
  modal.style.display = 'flex'

  modal.getBoundingClientRect()

  modal.classList.add('active')
}

function closeModal() {
  modal.classList.remove('active')
  modal.addEventListener('transitionend', transitionend)

  function transitionend() {
    modal.style.display = 'none'
    modal.removeEventListener('transitionend', transitionend)
  }
}

function alwaysOnTop() {
  const isAlwaysOnTop = ipcRenderer.sendSync('alwaysOnTop', key)
  if (isAlwaysOnTop) {
    alwaysOnTopButton.classList.add('active')
  }
  else {
    alwaysOnTopButton.classList.remove('active')
  }
}

function input(event) {
  ipcRenderer.send('input', key, event.target.value)
}

function openPalette(event) {
  event.stopPropagation()

  palette.style.display = 'flex'

  palette.getBoundingClientRect()

  palette.classList.add('active')
}

function closePalette(event) {
  if (!palette.classList.contains('active')) return

  palette.classList.remove('active')
  palette.addEventListener('transitionend', transitionend)

  function transitionend() {
    palette.style.display = 'none'
    palette.removeEventListener('transitionend', transitionend)
  }
}

function selectColor(event) {
  event.stopPropagation()

  theme = event.currentTarget.dataset.theme

  document.body.className = ''
  document.body.classList.add(theme)

  closePalette(event)

  ipcRenderer.send('theme', key, theme)
}

init()