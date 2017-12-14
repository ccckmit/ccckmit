async function main() {
    // test ESP6
    await ESP6.scriptLoad('test.js')
    var text = await ESP6.ajax({method:'GET', url:'test.html'})
    alert(text)
    // test ES6 template string
    var p = {name:'ccc', age:48 }
    var text = `Hello ! I am ${p.name}. I am ${p.age} years old.`
    console.log(text)
  }
  
  main()