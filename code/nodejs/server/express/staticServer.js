const express = require('express');
const serve   = require('express-static');
 
const app = express();
 
app.use(serve(__dirname));
 
const server = app.listen(3000, function(){
  console.log('server is running at %s', server.address().port);
});