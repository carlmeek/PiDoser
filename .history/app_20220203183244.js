var express = require('express');
var app = express();
var settings = require('./settings.js').settings();

app.get('/', function (req, res) {
   res.send('Hello World');
})

console.log("Pi Pool Doser")

console.log("Settings: "+JSON.stringify(settings))

var server = app.listen(80, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Pi Pool Doser listening at http://%s:%s", host, port)
})

console.log("Setting up Testing Poll every "+settings.testPollInterval)
setInterval(testingPoll, settings.testPollInterval);
console.log("Setting up Network Poll every "+settings.networkPollInterval)
setInterval(networkPoll, settings.networkPollInterval);

function testingPoll() {
    console.log('Testing Poll...');
}

function networkPoll() {
    console.log('Network Poll...');
}
