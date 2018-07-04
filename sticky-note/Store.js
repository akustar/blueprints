// // 참고: https://gist.github.com/ccnokes/95cb454860dbf8577e88d734c3f31e08#file-store-js
const electron = require('electron')
const path = require('path')
const fs = require('fs')
const userDataPath = (electron.app || electron.remote.app).getPath('userData')
const filePath = path.join(userDataPath, 'user-preferences.json')

class Store {
  constructor(key, preferences) {
    Store.data = Store.fetch()

    this.key = key
    this.data = Object.assign((Store.data[key] || {}), preferences) 
  }
  static fetch() {
    try {
      return JSON.parse(fs.readFileSync(filePath))
    } catch (error) {
      return {}
    }
  }
  get(key) {
    return this.data[key]
  }
  set(key, val) {
    this.data[key] = val
    
    Store.data[this.key] = this.data
    fs.writeFileSync(filePath, JSON.stringify(Store.data))
  }
  remove() {
    delete Store.data[this.key]
    fs.writeFileSync(filePath, JSON.stringify(Store.data))
  }
}

module.exports = Store


