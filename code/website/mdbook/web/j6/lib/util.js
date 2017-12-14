module.exports = function (j6) {
/* eslint-disable no-undef */
j6.extend = Object.assign

j6.clone = function (o) { return JSON.parse(JSON.stringify(o)) }

j6.assert = function (cond, msg) {
  if (!cond) throw Error(msg)
}

j6.steps = function(from, to, step = 1) {
	var a=[];
	for (var t=from; t<=to; t+=step)
		a.push(t);
	return a;
}

j6.slice = function (a) {
  return Array.prototype.slice.call(a)
}

j6.bind = function (o, member) {
  if (typeof o[member] === 'function') {
    return o[member].bind(o)
  } else {
    return o[member]
  }
}

j6.ncall = function () {
  var args = j6.slice(arguments)
  var n = args[0]
  var o = args[1]
  var fname = args[2]
  var params = args.slice(3)
  var a = []
  for (var i = 0; i < n; i++) {
    a.push(o[fname].apply(o, params))
  }
  return a
}

j6.mapFunctions = function (host, obj, pairs) {
  for (var h in pairs) {
    var o = pairs[h]
    if (typeof host[h] !== 'undefined') {
      console.log('mapFunction:mapBind: error!', h, ' has been defined!')
    }
    host[h] = j6.bind(obj, o)
  }
}

j6.copyFunctions = function (host, obj, names) {
  for (var name of names) {
    if (typeof host[name] !== 'undefined') {
      console.log('copyFunctions:namesBind: error!', name, ' has been defined!')
    }
    host[name] = j6.bind(obj, name)
  }
}

j6.mix = function (self, members) {
  for (var name in members) {
    var member = members[name]
    if (typeof self[name] === 'undefined') {
      Object.defineProperty(self, name, {
        enumerable: true,
        writable: true,
        value: member
      })
    } else {
      console.log('j6.mix fail:', name, ' already exists!')
      console.log(' self[name]=', self[name])
      console.log(' member=', member)
    }
  }
}

j6.arg1this = function (f, obj) { // 傳回一個已經綁定 f, obj 的函數
  return function () {
    var args = j6.slice(arguments)
    return f.apply(obj, [this].concat(args)) // 效果相當於 obj.f(this, args)
  }
}

j6.mixThis = function (proto, obj, fmembers) {
  for (var fname of fmembers) {
    var f = obj[fname]
    if (typeof proto[fname] === 'undefined') {
      Object.defineProperty(proto, fname, {
        enumerable: false,
        writable: true,
        value: j6.arg1this(f, obj) // proto.f(args) => obj.f(this, args) , 這行盡量不要動，除非想得很清楚了！
      })
    } else {
      console.log('j6.mixThis:', fname, ' fail!')
      console.log(' obj[fname]=', obj[fname])
      throw Error()
    }
  }
}

j6.mixThisMap = function (proto, obj, poMap) {
  for (var pname in poMap) {
    var oname = poMap[pname]
    var f = obj[oname]
    if (typeof proto[pname] === 'undefined') {
      Object.defineProperty(proto, pname, {
        enumerable: false,
        writable: true,
        value: j6.arg1this(f, obj) // proto.f(args) = f(this, args) , 這行盡量不要動，除非想得很清楚了！
      })
    } else {
      console.log('pname=', pname, 'proto[pname]=', proto[pname])
      console.log('j6.mixThisMap:', oname, ' fail!')
    }
  }
}

j6.ctrim = function (s, set, side) {
  side = side || 'both'
  for (var b = 0; b < s.length; b++) {
    if (set.indexOf(s[b]) < 0) break
  }
  for (var e = s.length - 1; e >= 0; e--) {
    if (set.indexOf(s[e]) < 0) break
  }
  if (side === 'right') b = 0
  if (side === 'left') e = s.length - 1
  return s.substring(b, e + 1)
}

j6.lpad = function (s, width, ch) {
  return s.length >= width ? s : new Array(width - s.length + 1).join(ch) + s
}

j6.def = function (x, value) {
  return (typeof x !== 'undefined') ? x : value
}

j6.precision = 2

j6.nstr = function (n, precision = j6.precision) {
  if (n % 1 === 0) return n.toFixed(0)
  return n.toFixed(precision)
}

j6.vstr = function (a, precision = j6.precision) {
  var s = []
  for (var i in a) {
    if (typeof a[i] === 'undefined') {
      s.push('undefined')
    } else {
      s.push(a[i].str(precision))
    }
  }
  return '[' + s.join(', ') + ']'
}

j6.sstr = function (s) { return s.toString() }

/*
j6.ostr = function(o, precision=j6.precision) {
  var s = [];
  for (var k in o)
    s.push(k+':'+j6.str(o[k], precision));
  return '{'+s.join(', ')+'}';
}
*/

j6.ostr = function (o) { return o.toString() }

j6.str = function (o, precision = j6.precision) {
  if (typeof o === 'undefined') {
    return 'undefined'
  } else {
    return o.str(precision)
  }
}

j6.toArray = function (arg) { return Array.prototype.slice.call(arg) }

// Global
j6.debug = function () {
  var arg = j6.toArray(arguments)
  console.debug.apply(console, arg)
}

j6.print = function () {
  var arg = j6.toArray(arguments)
  console.log.apply(console, arg)
}

j6.json = function (o) { return JSON.stringify(this) }

/* eslint-disable no-extend-native */
// Array.prototype.toString = function () { return j6.vstr(this) } // 這行不能用，會干擾 numeric.js
// Number.prototype.toString = function () { return j6.nstr(this) }
}