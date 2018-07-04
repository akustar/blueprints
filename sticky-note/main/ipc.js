const electron = require('electron')
const windows = require('./index')
const ipcMain = electron.ipcMain

function init() {
  ipcMain.on('create-window', (event, key) => {
    const win = windows.list[key]
    const {width:screenW, height:screenH} = electron.screen.getPrimaryDisplay().size
    const width = 385
    const height = 265   
    const distance = 30
    let [x, y] = win.getPosition()
    
    if ((x + distance + width) > screenW) {
      x = x - width
    }
    else {
      x = x + distance
    }

    if ((y + distance + height) > screenH) {
      y = y - height
    }
    else {
      y = y + distance
    }

    windows.create('', {}, {width, height, x, y})
  })
  ipcMain.on('close-window', (event, key) => {
    const win = windows.list[key]
    
    if (win) {
      win.close()
      win.store.remove(key)
    }
  })
  ipcMain.on('theme', (event, key, theme) => {
    const win = windows.list[key]

    win.store.set('theme', theme)
  })
  ipcMain.on('alwaysOnTop', (event, key) => {
    const win = windows.list[key]
    const isAlwaysOnTop = !win.isAlwaysOnTop()

    win.setAlwaysOnTop(isAlwaysOnTop)
    event.returnValue = isAlwaysOnTop
  })
  ipcMain.on('input', (event, key, value) => {
    const win = windows.list[key]

    win.store.set('content', value)
  })
}

module.exports = {
  init
}