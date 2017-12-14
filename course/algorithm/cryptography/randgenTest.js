var r = require('./randgen')
r.seed(132747)
for (let i=0; i<10; i++) {
    console.log(r.next())
}