class HashTable {
  constructor(size) {
    this.table = new Array(size)
  }

  hashCode(str) {
    var hash = 0, i, c;
    if (str.length === 0) return hash
    for (i = 0; i < str.length; i++) {
      c     = str.charCodeAt(i)
      hash  = ((hash << 5) - hash) + c // hash = hash*31 + chr = (hash*32-hash) + c
      hash |= 0 // Convert to 32bit integer, 原因： Bitwise operators treat their operands as a sequence of 32 bits (zeroes and ones), rather than as decimal, hexadecimal, or octal numbers
    }
    return hash
  }

  size() { return this.table.length }

  slot(key) {
    return this.hashCode(key) % this.size()
  }

  get(key) {
    let i = this.slot(key)
    if (this.table[i] == null) return
    return this.table[i].find((o)=>o.key==key)
  }

  put(key, value) {
    let i = this.slot(key)
    if (this.table[i] == null) {
      this.table[i] = [{key:key, value:value}]
    } else {
      let obj = list.find((o)=>o.key==key)
      if (obj == null) {
        list.push({key:key, value:value})
      } else {
        obj.value = value
      }
    }
  }

  remove(key) {
    let i = this.slot(key)
    if (this.table[i] != null) {
      let pos = this.table[i].findIndex((o)=>o.key == key)
      if (pos >= 0) this.table[i].splice(pos, 1)
    }
  }
}

let ht = new HashTable(127)
ht.put('ccc', 'ccckmit@gmail.com')
ht.put('snoopy', 'snoopy@mail.disney.com')
console.log('get(ccc)=', ht.get('ccc'))
console.log('get(garfield)=', ht.get('garfield'))
ht.remove('ccc')
console.log('get(ccc)=', ht.get('ccc'))
