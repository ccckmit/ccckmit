(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
f6 = module.exports = {
  scriptLoaded: {},
  router: { map: new Map() }
}

// onhashchange => route
f6.route = function (regexp, f) {
  f6.router.map.set(regexp, f)
  return this
}

f6.go = function (hash) {
  window.location.hash = '#' + hash
  return this
}

// DOM Element
Element.prototype.one = function (selector) {
  return this.querySelector(selector)
}

Element.prototype.all = function (selector) {
  return this.querySelectorAll(selector)
}

Element.prototype.hide = function () {
  this.hidden = true
  return this
}

Element.prototype.show = function () {
  this.hidden = undefined
  return this
}

Element.prototype.html = function (html) {
  this.innerHTML = html
  return this
}

f6.toNodes = function (html) {
  var div = document.createElement('div')
  div.innerHTML = html
  var childNodes = div.childNodes
  delete div
  return Array.prototype.slice.call(childNodes)
}

Element.prototype.prepend = function (html) {
  var nodes = f6.toNodes(html)
  for (var i = nodes.length-1; i >= 0; i--) {
    this.insertBefore(nodes[i], this.childNodes[0])
  }
  return this
}

Element.prototype.append = function (html) {
  var nodes = f6.toNodes(html)
  for (var i = nodes.length-1; i >= 0; i--) {
    this.appendChild(nodes[i])
  }
  return this
}

// NodeList
NodeList.prototype.each = function (f) {
  this.forEach(f)
  return this
}

NodeList.prototype.hide = function () {
  this.each(function (x) { x.hide() })
  return this
}

NodeList.prototype.show = function () {
  this.each(function (x) { x.show() })
  return this
}

NodeList.prototype.html = function (html) {
  this.each(function (x) { x.html(html) })
  return this
}

// DOM short cut 
f6.one = function (selector) {
  return document.querySelector(selector)
}

f6.all = function (selector) {
  return document.querySelectorAll(selector)
}

// View : Event Handling
f6.on = function (obj, event, f) {
  var o = (typeof obj === 'string') ? f6.one(obj) : obj
  o.addEventListener(event, f)
}

// load stylesheet (CSS)
f6.styleLoad = function (url) {
  var ss = document.createElement('link')
  ss.type = 'text/css'
  ss.rel = 'stylesheet'
  ss.href = url
  f6.one('head').appendChild(ss)
}

// load script (JS)
f6.scriptLoad = function (url) {
  return new Promise(function (resolve, reject) {
    var urlLoaded = f6.scriptLoaded[url]
    if (urlLoaded === true) resolve(url)
    var script = document.createElement('script')
    script.onload = function () {
      f6.scriptLoaded[url] = true
      resolve()
    }
    script.onerror = function () {
      f6.scriptLoaded[url] = false
      reject(new Error('Could not load script at ' + url));
    }
    script.src = url
    f6.one('head').appendChild(script)
  })
}

/** ajax with 4 contentType , ref : https://imququ.com/post/four-ways-to-post-data-in-http.html
 * 1. application/x-www-form-urlencoded  ex: title=test&sub%5B%5D=1&sub%5B%5D=2&sub%5B%5D=3
 * 2. multipart/form-data                ex: -...Content-Disposition: form-data; name="file"; filename="chrome.png" ... Content-Type: image/png
 * 3. application/json                   ex: JSON.stringify(o)
 * 4. text/plain                         ex: hello !
 * 5. text/xml                           ex: <?xml version="1.0"?><methodCall> ...
 * For form, use xhr.send(new window.FormData(form))
 */
f6.ajax = function (arg) {
  var promise = new Promise(function (resolve, reject) {
    var xhr = new window.XMLHttpRequest()
    xhr.open(arg.method, arg.url, true)
    if (arg.contentType) {
      xhr.setRequestHeader('Content-Type', arg.contentType)
    }
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return
      if (xhr.status === 200) {
        if (arg.alert) alert('Success!')
        resolve(xhr.responseText)
      } else {
        if (arg.alert) alert('Fail!')
        reject(new Error(xhr.statusText))
      }
    }
    console.log('ajax:arg='+JSON.stringify(arg))
    xhr.send(arg.body)
  })
  return promise
}

f6.ojax = async function (arg, obj) {
  arg.contentType = 'application/json'
  if (obj) arg.body = JSON.stringify(obj)
  var json = await f6.ajax(arg)
  return JSON.parse(json)
}

f6.fjax = function (arg, form) {
  form.action = arg.url
  form.method = arg.method
//  arg.contentType = 'multipart/form-data; boundary=----WebKitFormBoundaryrGKCBY7qhFd3TrwA'
  arg.body = new window.FormData(form)
  return f6.ajax(arg)
}

f6.onload = function (init) {
  return new Promise(function (resolve, reject) {
    window.addEventListener('load', function () {
      init()
      window.onhashchange()
      resolve()
    })
  })
}

window.onhashchange = function () {
  var hash = window.location.hash.trim().substring(1)
  for (let [regexp, f] of f6.router.map) {
    var m = hash.match(regexp)
    if (m) {
      f(m, hash)
      break
    }
  }
}

/*
f6.init = function () {
  return this
}

f6.init()

f6.plugin = function (selector, html) {
  f6.one(selector).innerHTML = html
}

*/
},{}]},{},[1]);
