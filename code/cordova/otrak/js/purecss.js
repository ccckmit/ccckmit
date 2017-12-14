
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
  
