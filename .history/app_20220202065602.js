var express = require('express');
var app = express();
var settings = require('./settings.js');

app.get('/', function (req, res) {
   res.send('Hello World');
})

console.log("Pi Pool Doser")

var server = app.listen(80, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Pi Pool Doser listening at http://%s:%s", host, port)
})

console.log("Setting up Poll every "+settings.pollInterval)
//setInterval(poll, settings.pollInterval);

function poll() {
    console.log('Poll...');
}
