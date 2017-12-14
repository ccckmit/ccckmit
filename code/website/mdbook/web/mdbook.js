var MDB = {}
var PLUGIN

function one (selectors) {
  return f6.one(selectors)
}

function show (selectors) {
  f6.all(selectors).show()
}

function hide (selectors) {
  f6.all(selectors).hide()
}

MDB.mt = function (msg) {
  return msg
}

MDB.mtRender = function () {
  f6.all('.mt').each(function (node) {
    var s = node.getAttribute('data-mt')
    var t = MDB.mt(s)
    node.innerHTML = t
  })
}

MDB.plugin = async function (path) {
  var html = await f6.ajax({method: 'GET', url: '../../plugin/' + path})
  one('#pluginBox').innerHTML = html
  MDB.showBox('pluginBox')
  MDB.mtRender()
}

// markdown-it 對 <code>...</code> 的解讀有誤，因此會把數學式裡的 *...* 與 ^...^ 誤解而翻錯成 <em> 與 <sup>！
// 所以只能用 showdown.js  // var html = converter.render(md) // markdown-it
MDB.md2html = function (md) {
  return MDB.converter.makeHtml(md) // showdown.js
}

MDB.mdRender = function (md) {
  return MDB.md2html(md)
}

MDB.mdRewrite = function (md) {
  md = md.replace(/(```\w*\n([\s\S]*?)\n```)|(`[^`\n]*`)|(\$\$\s*\n\s*([^$]+)\s*\n\s*\$\$)|(\$\$([^$\n]+)\$\$)/gmi, function (match, p1, p2, p3, p4, p5, p6, p7, offset, str) {
    if (p1) {
      return match
    } else if (p3) {
      return match
    } else if (p4) {
      return '<code>' + p4 + '</code>' // (texHtml == null) ? p5 : texHtml
    } else if (p6) {
      return '<code>' + p6 + '</code>' // (texHtml == null) ? p7 : texHtml
    }
  })
  return Promise.resolve(MDB.mdRender(md))
}

MDB.editRender = async function (text) {
  if (MDB.setting.file.endsWith('.html')) {
    return text
  } else {
    var md
    if (MDB.setting.file.endsWith('.json')) {
      md = '```json\n' + text + '\n```'
    } else
    if (MDB.setting.file.endsWith('.mdo')) {
      md = '```mdo\n' + text + '\n```'
    } else { // *.md
      md = text
    }
    return await MDB.mdRewrite(md)
  }
}

MDB.bookRender = function () {
  var bookJson = one('#editBook').value
  var bookObj = JSON.parse(bookJson)
  one('#bookTitle').innerHTML = '<a href="README.md" class="pure-menu-link mt" data-mt="' + bookObj.title + '"></a>'
  var chapters = bookObj.chapters
  var bookHtmls = []
  for (var i in chapters) {
    bookHtmls.push('<li class="pure-menu-item"><a href="' + chapters[i].link + '" class="pure-menu-link mt" data-mt="' + chapters[i].title + '">' + MDB.mt(chapters[i].title) + '</a></li>')
  }
  one('#bookBox').innerHTML = bookHtmls.join('\n')
}

MDB.showBox = function (ID) {
  one('#pluginBox').hide()
  one('#viewBox').hide()
  one('#editBox').hide()
  one('#' + ID).show()
}

MDB.texApply = function (text) {
  return text.replace(/(```\w*\n([\s\S]*?)\n```)|(`[^`\n]*`)|(<code>\$\$\s*\n\s*([^$]+)\s*\n\s*\$\$<\/code>)|(<code>\$\$([^$\n]+)\$\$<\/code>)/gmi, function (match, p1, p2, p3, p4, p5, p6, p7, offset, str) {
    if (p1) {
      return match
    } else if (p3) {
      return match
    } else if (p4) {
      return window.katex.renderToString(p5, { displayMode: true }) || p5
    } else if (p6) {
      return window.katex.renderToString(p7) || p7
    }
  })
}

MDB.texRender = async function (text) {
  if (text.indexOf('$$') >= 0) {
    await f6.scriptLoad(MDB.setting.katexJsUrl)
    await f6.styleLoad(MDB.setting.katexCssUrl)
    return MDB.texApply(text)
  } else {
    return text
  }
}

MDB.render = async function () {
  var html = await MDB.editRender(one('#editText').value)
  var texHtml = await MDB.texRender(html)
  one('#mdBox').innerHTML = texHtml
  MDB.mtRender()
  await MDB.codeHighlight()
}

MDB.codeHighlight = async function () {
  var codes = f6.all('pre code')
  if (codes.length > 0) {
    await f6.scriptLoad(MDB.setting.highlightJsUrl)
    await f6.styleLoad(MDB.setting.highlightCssUrl)
    for (var i = 0; i < codes.length; i++) {
      if (window.hljs != null) window.hljs.highlightBlock(codes[i])
    }
  }
}

MDB.view = function () {
  MDB.showBox('viewBox')
  MDB.render()
}

MDB.edit = function () {
  MDB.showBox('editBox')
}

// =================== CURD Server 編輯登入儲存 =============================
MDB.login = async function () {
  var userBox = one('#user')
  var passwordBox = one('#password')
  await f6.ojax({method: 'POST', url: '../../login', alert: true},
                {user: userBox.value, password: passwordBox.value})
  window.location.reload()
}

MDB.save = async function () {
  await f6.ojax(
    {method: 'POST', url: '../../save/' + MDB.setting.book + '/' + MDB.setting.file, alert: true},
    {text: one('#editText').value}
  )
}

MDB.createBook = async function () {
  try {
    var bookName = one('#book').value
    await f6.ojax({method: 'POST', url: '../../createbook/' + bookName}, {})
    window.alert('Success!')
    window.location.href = '../../view/' + bookName + '/'
  } catch (error) {
    window.alert('Fail!')
  }
}

MDB.upload = async function (form) {
  await f6.fjax({method: 'POST', url: '../../upload/' + MDB.setting.book, alert: true}, form)
}

MDB.logout = async function () {
  await f6.ojax({method: 'POST', url: '../../logout', alert: true}, {})
  window.location.reload()
}

MDB.signup = async function () {
  await f6.ojax({method: 'POST', url: '../../signup', alert: true},
                {user: one('#user').value, password: one('#password').value})
}

async function init() {
  await f6.scriptLoad('../../plugin/plugin.js')
  await f6.scriptLoad(MDB.setting.showdownJsUrl)
  MDB.converter = new window.showdown.Converter()
  MDB.converter.setOption('tables', true)
  if (PLUGIN != null) PLUGIN.load()
  MDB.bookRender()
  MDB.view()
}

async function main () {
/*  
  f6.route(/^$/, list)
    .route(/^post\/new/, add)
    .route(/^post\/(\w+?)/, show)
    .route(/^post/, create)
*/    
  await f6.onload(init)
}

main()

// ============== purecss ui.js ====================
function purecssLoad (window, document) {
  var layout = document.getElementById('layout')
  var menu = document.getElementById('menu')
  var menuLink = document.getElementById('menuLink')
  var content = document.getElementById('main')

  function toggleClass (element, className) {
    var classes = element.className.split(/\s+/)
    var length = classes.length
    var i = 0

    for (; i < length; i++) {
      if (classes[i] === className) {
        classes.splice(i, 1)
        break
      }
    }
    // The className is not found
    if (length === classes.length) {
      classes.push(className)
    }

    element.className = classes.join(' ')
  }

  function toggleAll (e) {
    var active = 'active'

    e.preventDefault()
    toggleClass(layout, active)
    toggleClass(menu, active)
    toggleClass(menuLink, active)
  }

  menuLink.onclick = function (e) {
    toggleAll(e)
  }

  content.onclick = function (e) {
    if (menu.className.indexOf('active') !== -1) {
      toggleAll(e)
    }
  }
}

purecssLoad(window, window.document)
