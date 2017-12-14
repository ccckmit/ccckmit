var Bot = require('./bot')
var loki = require('lokijs')

var qaList = [
//  { Q:"找", A: retrieve },
];

class Remember extends Bot {
  constructor() {
    super('書記', qaList)
    this.db = new loki('remember.db', {
      autoload: true,
      autoloadCallback : databaseInitialize,
//      autosave: true, 
//      autosaveInterval: 4000 // save every four seconds for our example      
    })
 //   this.chat = db.addCollection("chat")
  }

  find(q) {}

  list(user, rexp) {
    let results = []
    let table = this.chatTable.find({})
    results.push('訊息 | 時間')
    results.push('------|--------')
    for (let r of table) {
      if (user.id !== r.userId) continue
      if (rexp != null) {
        if (!rexp.test(r.msg)) continue
      }
      let time = new Date(r.meta.created)
      results.push(r.msg + ' | ' + time.toISOString())
    }
    return results.join('\n')
  }

  save(q, user) {
    var record = { 
      time:Date.now(),
      userId:user.id,
      msg:q
    }
    this.chatTable.insert(record)
    if (q === 'save') {
      this.db.saveDatabase()
      return "已存檔到 remember.db"
    }
  }

  answer(q, user) {
//    console.log('remember:q=', q)
    var ans = null
    if (q === '列表' || q === 'list') ans = this.list(user)
    if (q.indexOf('帳單')>=0) ans = this.list(user, /((收入)|(支出))/)
//      return JSON.stringify(this.chatTable.find({}))
    return ans || this.save(q, user)
  }
}

var remember = new Remember()

process.on('SIGINT', function() {
  remember.db.saveDatabase()
  remember.db.close()
  process.exit(1)
})

// implement the autoloadback referenced in loki constructor
function databaseInitialize() {
  remember.chatTable = remember.db.getCollection("chat") || remember.db.addCollection("chat")
}

module.exports = remember