var katex = require('katex')

// var html = katex.renderToString("c = \\pm\\sqrt{a^2 + b^2}")
var html = katex.renderToString("\int f(x) dx")
console.log(html)