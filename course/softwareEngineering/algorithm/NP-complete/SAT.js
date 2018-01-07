function satisfy(exp, vars, values) {
  if (values.length === vars.length) {
    let assign = {}
    for (var i in vars) {
      assign[vars[i]] = values[i]
    }
    with (assign) {
      let result = eval(exp)
      console.log('exp=', exp, ' assign=', assign, ' result=', result)
      if (result === true) return values
    }
    return
  }
  let v0 = values.slice(0)
  let v1 = values.slice(0)
  v0.push(false)
  v1.push(true)
  return satisfy(exp, vars, v0) || satisfy(exp, vars, v1)
}

function SAT(exp, vars) {
  let values = satisfy(exp, vars, [])
  return values
}

console.log(SAT('(x||y)&&(x||z)', ['x', 'y', 'z']))
console.log(SAT('(x)&&(!x)&&(!y)&&(!z)', ['x', 'y', 'z']))
