const remote = require('electron').remote
const {Menu, MenuItem, dialog} = remote
// const win = remote.getCurrentWindow()
const fs = require('fs')
const marked = require('marked')
let E = module.exports = {}

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  smartLists: true,
  smartypants: false
})

var mdHtml, mdSource, filePath, fileHistory = [], fileHistoryMenu

window.addEventListener('load', function () {
  mdHtml = document.getElementById('mdHtml')
  mdSource = document.getElementById('mdSource')
//  filePath = document.getElementById('filePath')
  filePath = document.querySelector('title')
  fileHistoryMenu = document.getElementById('fileHistoryMenu')
  fileHistoryMenu.addEventListener('change', function () {
    loadFile(fileHistoryMenu.value)
    E.viewHtml()
  })
/*
//  fileHistoryMenu = new Menu()
  window.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    // fileHistoryMenu.popup(remote.getCurrentWindow())
    remote.app.fileHistoryMenu.popup(remote.getCurrentWindow())
  }, false)
*/
  loadFile(__dirname + '/test.md')
})

E.help = function () {
  loadFile(__dirname + '/help.md')
  E.viewHtml()
}

E.render = function render () {
  mdHtml.innerHTML = marked(mdSource.value)
  mdHtml.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', function (event) {
      event.preventDefault()
      let href = a.getAttribute('href')
      if (a.href.startsWith('file:///')) {
        loadFile(a.href.substring('file:///'.length))
      } else if (a.href.indexOf('://') < 0) {
        loadFile(a.href)
      } else {
//        window.alert('href=' + href)
      }
    })
  })
}

E.viewSource = function () {
  mdSource.style.display = 'block'
  mdHtml.style.display = 'none'
}

E.viewHtml = function () {
  E.render()
  mdSource.style.display = 'none'
  mdHtml.style.display = 'block'
}

function newFile () {
  filePath.innerText = ''
  mdSource.value = ''
}

function saveFileAs () {
  dialog.showSaveDialog(
    {
      filters: [ { name: 'all', extensions: [ '*' ] }, { name: 'text', extensions: [ 'txt' ] } ]
    },
    function (fileName) {
      if (fileName === undefined) return
      filePath.innerText = fileName
      fs.writeFile(fileName, mdSource.value, function (err) {
        if (err) { window.alert('error=' + err); return }
        dialog.showMessageBox({ message: '儲存完畢！', buttons: ['OK'] })
      })
    }
  )
}

function openFile () {
  dialog.showOpenDialog(
    function (fileName) {
      if (fileName === undefined) {
        console.log('No file selected')
        return
      }
      console.log('fileName=' + fileName)
      loadFile(fileName)
    }
  )
}

function loadFile (fileName) {
  filePath.innerText = fileName
  if (fileHistory.indexOf(fileName) < 0) {
    fileHistory.push(fileName)
    let addOption = document.createElement('option')
    addOption.text = fileName
    addOption.value = fileName
    fileHistoryMenu.appendChild(addOption)
// 注意：下列這段不能加，否則會因為無法從 main (remote) 呼叫 renderer 而導致失敗！
// 因為 fileHistoryMenu 是 new Menu() 建立的，屬於 main (remote) process .
/*
    remote.app.fileHistoryMenu.append(
      new MenuItem(
        {
          label: fileName,
          click () {
            loadFile(fileName)
            E.viewHtml()
          }
        }
      )
    )
*/
  }
  fileHistoryMenu.value = fileName
  fs.readFile(fileName.toString(), 'utf8', function (err, data) {
    if (err) { window.alert('read fail!'); return }
    console.log('mdSource.value = ', data)
    mdSource.value = data
    E.viewHtml()
  })
}

function saveFile () {
  var fileName = filePath.innerText
//          if (fileName.trim().length === 0) window.alert('No file loaded!')
  if (fileName.trim().length === 0) {
    saveFileAs()
  }
  fs.writeFile(fileName, mdSource.value, function (err) {
    if (err) { window.alert('Save Fail!'); return }
    window.alert('Save Success!')
  })
}

const template = [
  {
    label: 'File',
    submenu: [
      {
        label: '開新檔案',
        accelerator: 'CmdOrCtrl+N',
        click: newFile
      },
      {
        label: 'Open',
        accelerator: 'CmdOrCtrl+O',
        click: openFile
      },
      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click: saveFile
      },
      {
        label: '另存新檔',
        accelerator: 'CmdOrCtrl+A',
        click: saveFileAs
      },
      { label: 'Exit', role: 'close' }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' }
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: '原始碼',
        click: E.viewSource // viewSource
      },
      {
        label: '預覽',
        click: E.viewHtml
      },
      {
        label: 'GoBack',
        click: E.goBack
      },
      { role: 'reload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    role: 'window',
    submenu: [
      { role: 'minimize' },
      { role: 'close' }
    ]
  }
/*  
  ,
  {
    role: 'help',
    submenu: [ { label: 'Learn More' } ]
  }
*/
]

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
