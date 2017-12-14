// =========================== page switch ==================

function one(id) {
    return document.getElementById(id)
}

var tablePage = `
<table>
<tr><th>欄位</th><th>內容</th></tr>
<tr><td>f1</td><td>c1</td></tr>
<tr><td>f2</td><td>c2</td></tr>
<tr><td>f3</td><td>c3</td></tr>
<tr><td>f4</td><td>c4</td></tr>
</table>
`

var addPage = `
<!-- <input type="file" name="upload"><button>新增物件</button> -->
<img id="imageFile" src="" style="width:100%; height:60vh"/>
<button type="button" class="pure-button pure-button-primary mt" onclick="uploadPicture()">上傳照片</button>
`

function uploadPicture() {
  openFilePicker()
}

function displayImage(imgUri) {
    var elem = one('imageFile');
    elem.src = imgUri;
}

function hashChanged() {
  var main = one('main')
  var map = one('map')
  var hash = location.hash
  main.innerHTML = page[hash]
  if (hash === '#gmap') {
    main.style.display = 'none'
    map.style.display = 'block'
  } else {
    main.style.display = 'block'
    map.style.display = 'none'
  }
}

window.onhashchange = hashChanged;

var page = {
  '#home': `<h1>home</h1>`,
  '#add': addPage,
  '#map': `<h1>map</h1>`,
  '#search': `<input type="text" name="query"/><button>查詢</button>`,
  '#table' : tablePage
}
  
