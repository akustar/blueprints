const { app } = require('electron')
const windows = require('./main')
const Tray = require('./main/Tray')
const ipc = require('./main/ipc')
const Store = require('./Store')

app.on('ready', () => {
  const o = Store.fetch()
  const kyes = Object.keys(o)

  if (kyes.length > 0) {
    for (const savedKey of kyes) {
      windows.create(savedKey, o[savedKey])
    }
  }
  else {
    windows.create()
  }

  Tray.create()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (windows.list.length === 0) windows.create()
})

ipc.init()