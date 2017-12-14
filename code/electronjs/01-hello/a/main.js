const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow
// const {app, BrowserWindow} = require('electron')

function createWindow () {
  var win = new BrowserWindow({width: 800, height: 600})
  win.loadURL('file://' + __dirname + '/index.html')
}

app.on('ready', createWindow)
