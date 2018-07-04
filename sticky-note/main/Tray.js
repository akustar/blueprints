const { app, Menu, Tray } = require('electron')
const { list, create:createWindow } = require('./index')
const path = require('path')

let tray

function create() {
  tray = new Tray(path.join(__dirname, '..', '/icons/sticky.ico'))

  tray.on('click', () => {
    for (const key of Object.keys(list)) {
      if (list[key]) {
        list[key].show()
      }
    }
  })

  updateTrayMenu()
}

function updateTrayMenu() {
  const contextMenu = Menu.buildFromTemplate(getMenuTemplate())
  tray.setToolTip('Sticky Note')
  tray.setContextMenu(contextMenu)
}

function getMenuTemplate() {
  return [
    {
      label: '노트 추가하기',
      click: () => createWindow()
    },    
    {
      label: '종료',
      click: () => app.quit()
    }
  ]
}

module.exports = {
  create
}