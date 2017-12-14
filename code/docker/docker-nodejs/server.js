const serve = require('koa-static');
const logger = require('koa-logger')
const Koa = require('koa');
const app = new Koa();

app.use(logger())
app.use(serve(__dirname));

app.listen(3001);

console.log('listening on port 3001');
