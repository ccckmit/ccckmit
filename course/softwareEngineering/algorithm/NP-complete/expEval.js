let assign = {x:false, y:true, z:true}
let exp = '(x||y)&&(x||!z)'
with (assign) {
  let result = eval(exp)
  console.log('exp=', exp, ' assign=', assign, ' result=', result)
}
