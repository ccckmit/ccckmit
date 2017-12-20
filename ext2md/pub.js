var converter = new showdown.Converter()
converter.setFlavor('github')

function md2html(mdText) {
  var mdHtml = converter.makeHtml(mdText)
  document.getElementById('mdHtml').innerHTML = mdHtml
}

function show() {
  var file = window.location.hash.substring(1)
  console.log('file=', file)
  const req = new Request('./' + file, {method: 'GET', cache: 'reload'})
  fetch(req).then(function(response) {
    return response.text().then(function(text) {
      md2html(text)
    })
  }).catch(function(err) {
    alert(file + ' load error ! ' + err.message)
  })  
}

window.addEventListener('hashchange', show)
window.addEventListener("load", show)

// ------------------- side menu ---------------------
function openNav() {
    document.getElementById("sidemenu").style.width = "250px";
}

function closeNav() {
    document.getElementById("sidemenu").style.width = "0";
}
