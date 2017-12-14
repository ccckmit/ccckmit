var fs = require('mz/fs')

var fileWalk = function (dir, path, done) {
  console.log('dir=%s path=%s', dir, path)
  var results = []
  dir = (dir.endsWith('/')) ? dir : dir + '/'
  path = (path.endsWith('/')) ? path : path + '/'
  fs.readdir(dir + path, function (err, list) {
    if (err) return done(err)
    var pending = list.length
    if (!pending) return done(null, results)
    list.forEach(function (file) {
      fs.stat(dir + path + file, function (err, stat) {
        if (err) throw err
        console.log('path=%s file=%s', path, file)
        if (stat && stat.isDirectory()) {
          fileWalk(dir, path + file, function (err, res) {
            if (err) throw err
            results = results.concat(res)
            if (!--pending) done(null, results)
          })
        } else {
          results.push(path.substring(1) + file)
          if (!--pending) done(null, results)
        }
      })
    })
  })
}

var io = {
  readJsonSync: function (file) {
    var json = fs.readFileSync(file, 'utf8')
    return JSON.parse(json)
  },
  readFile: async function (file) {
    return await fs.readFile(file, 'utf8')
  },
  writeFile: async function (file, text) {
    return await fs.writeFile(file, text)
  },
  appendFile: async function (file, text) {
    return await fs.appendFile(file, text)
  },
  mkdir: async function (path) {
    return await fs.mkdir(path)
  },
  readJson: async function readJson (file) {
    var json = await fs.readFile(file, 'utf8')
    return JSON.parse(json)
  },
  fileExists: async function (file) {
    var fstat = await fs.stat(file)
    return fstat.isFile()
  },
  recursiveList: function (dir) {
    return new Promise(function (resolve) {
      fileWalk(dir, '', function(err, result) {
        resolve(result)
      })
    })
  }
}

module.exports = io
/*
U.clone=function(o) {
  return JSON.parse(JSON.stringify(o))
}

U.hash = function(o) {
  return hash(o)
}
*/
/*
U.parseJson = function(json) {
  json = json.replace(/(\W)(\w+):/gm, '$1'$2':') // id: => 'id':
             .replace(/:(\w+)/gm, ':'$1'')     // :v  => :'v'
             .replace(/([\{\[])\s*,/gm, '$1')  // {, => {
             .replace(/,\s*([\}\]])/gm, '$1') // ,] => ]
//  console.log('json=%s', json)
  return JSON.parse(json)
}
*/
