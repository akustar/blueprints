const { BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const debounce = require('debounce')
const Store = require('../Store')

const windows = {
  list: {},
  create
}

// From: https://stackoverflow.com/a/38872723
function revisedRandId() {
  return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10);
}

function uniqueKey() {
  const randomKey = revisedRandId()
  if (Store.fetch()[randomKey]) {
    return uniqueKey()
  }
  else {
    return randomKey
  }
}

function create(savedKey, preferences = {}, windowBounds = {}) {
  const defaults = {
    windowBounds,
    content: '',
    theme: 'lemon',
    alwaysOnTop: false
  }  
  const opts = Object.assign(defaults, preferences)
  const win = new BrowserWindow({
    width: 385,
    height: 265,
    minWidth: 195,
    minHeight: 120,
    frame: false,
    show: false,
    skipTaskbar: true,
    setSkipTaskbar: false,
    alwaysOnTop: opts.alwaysOnTop,
    ...opts.windowBounds
  })
  const key = savedKey || uniqueKey()

  win.store = new Store(key, opts)
  windows.list[key] = win

  win.loadURL(path.join(__dirname, '..', 'index.html'))
  // win.webContents.openDevTools()
  win.webContents.on('did-finish-load', () => {
    win.webContents.send('preferences', {savedKey: key, preferences})
  })

  win.once('ready-to-show', () => {
    win.show()
  })

  win.on('closed', () => {
    windows.list[key] = null
    delete windows.list[key]
  })

  win.on('blur', () => {
    win.webContents.send('blur-window')
  })

  win.on('resize', debounce(event => {
    win.store.set('windowBounds', event.sender.getBounds())
  }, 250))

  win.on('move', debounce(event => {
    win.store.set('windowBounds', event.sender.getBounds())
  }, 250))
}

module.exports = windows