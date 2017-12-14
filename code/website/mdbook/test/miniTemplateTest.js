var templateEngine = function (template, obj) {
  return template.replace(/\{\{(.*?)\}\}/gmi, function (match, p1) {
    if (p1 != null) return eval('obj.'+p1)
  })
}


var template = '<p>Hello, my name is {{name}}. I\'m {{profile.age}} years old.</p>';

console.log(templateEngine(template, {
    name: "ccc",
    profile: { age: 43 }
}));