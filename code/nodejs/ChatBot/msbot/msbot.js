// 程式來源：https://github.com/Microsoft/BotBuilder/blob/master/Node/examples/hello-ChatConnector/app.js
var restify = require('restify');
var builder = require('botbuilder');
var eliza = require('./lib/eliza');

// Setup Restify Server
var server = restify.createServer();

server.get(/\/html\/?.*/, restify.plugins.serveStatic({
    directory: './web/'
}));

server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: "請填入申請的 appId", // process.env.MICROSOFT_APP_ID,
    appPassword: "請填入申請的 appPassword" // process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector, function (session) {
    session.send(eliza.answer(session.message.text));
    console.log('received session.message.text=', session.message.text)
//    session.send("You said: %s", session.message.text);
});