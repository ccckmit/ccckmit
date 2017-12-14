var M = module.exports = require('mdo')

// 1. md 分解出 parts
// 2. 取得 Markdown Object (mdo) 的 json
// 3. 取得表格的 json
M.parse = function (md) {
  var codeHeader, codeLines
  var lines = md.split(/\r?\n/)
  var partLines = []
  var partList = []
  var jsonList = []
  for (var i = 0, len = lines.length; i < len; i++) {
    var line = lines[i]
    // 取得 partList
    if (line.startsWith('#') || i === len - 1) {
      var partMd = partLines.join('\n')
      partLines = [ line ]
      var m = partMd.match(/^#{0,6}/)
      if (partMd.trim().length > 0) {
        partList.push({ part: partList.length, level: m[0].length, text: partMd, type: 'mdpart' })
      }
    } else {
      partLines.push(line)
    }
    if (line.startsWith('```')) { // 處理 code
      if (typeof codeHeader === 'undefined') { // code start
        codeHeader = line
        codeLines = []
      } else { // code end
        if (codeHeader.toLowerCase().startsWith('```mdo')) {
          jsonList.push(M.parseMdo(codeLines.join('\n')))
        }
        codeHeader = undefined
      }
    } else if (typeof codeHeader === 'undefined' && line.indexOf('|') >= 0) {
      if (i < len - 1 && i > 0 && lines[i + 1].match(/^[-|]+$/) && !lines[i - 1].startsWith('```')) {
        var table = []
        for (;i < len && lines[i].trim() !== ''; i++) {
          table.push(lines[i])
        }
        jsonList.push(M.parseTable(table.join('\n')))
      }
    } else if (typeof codeHeader !== 'undefined') {
      codeLines.push(line)
    }
  }
  // parts: 分解段落, jsons:所有物件列表, formal:正規化的 markdown 字串
  return {parts: partList, jsons: jsonList}
}
