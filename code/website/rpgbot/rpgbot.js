// 程式來源：https://github.com/Microsoft/BotBuilder/blob/master/Node/examples/hello-ChatConnector/app.js
var restify = require('restify');
var builder = require('botbuilder');
var eliza = require('./lib/eliza');
var doctor = require('./lib/doctor');
var lawyer = require('./lib/lawyer');
var accounter = require('./lib/accounter');
var remember = require('./lib/remember');
var hacker = require('./lib/hacker');
var googler = require('./lib/googler');
var translator = require('./lib/translator')

// Setup Restify Server
var server = restify.createServer();

server.get(/\/html\/?.*/, restify.plugins.serveStatic({
    directory: __dirname + '/web/'
}));

server.listen(process.env.port || process.env.PORT || 3979, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// var connector = new builder.ChatConnector()

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: "95646229-18c6-4e96-827c-4ec26cdeccc9", // process.env.MICROSOFT_APP_ID,
    appPassword: "ujPQRPB6+;zzrtwRJ9281:%" // process.env.MICROSOFT_APP_PASSWORD
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector,
  function (session, results) {
//    console.log('message=%s', JSON.stringify(session.message, null, 2))
    let q = session.message.text.trim()
    let user = session.message.user
    if (translator(session, q)) return
    let answer = remember.answer(q, user) || hacker.answer(q) || doctor.answer(q) || lawyer.answer(q) || accounter.answer(q) || googler.answer(q) || eliza.answer(q) // eliza.answer(q)
    session.send(answer);
  }
);
