var express = require('express');
var app = express();
var settings = require('./settings.js').settings();
var macaddress = require('macaddress');

app.get('/', function (req, res) {
   res.send('Hello World');
})

console.log("Pi Pool Doser Version "+settings.version)

macaddress.one(function (err, mac) {
    console.log("Mac address for this host: %s", mac);  
    settings.macAddress = mac
});
console.log("MAC Address: " + settings.macAddress)

console.log("Settings: "+JSON.stringify(settings))

var server = app.listen(80, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Pi Pool Doser listening at http://%s:%s", host, port)
})

console.log("Setting up Testing Poll every "+settings.testPollInterval)
setInterval(testingPoll, settings.testPollInterval);
testingPoll()

console.log("Setting up Network Poll every "+settings.networkPollInterval)
setInterval(networkPoll, settings.networkPollInterval);
networkPoll()

function testingPoll() {
    console.log('Testing Poll...');
}

function networkPoll() {
    console.log('Network Poll...');

    const axios = require('axios')

    axios
    .get('https://admin.pooldoser.com/deviceupdate.aspx')
    .then(res => {
        //console.log(`statusCode: ${res.status}`)
        //console.log(res)
        console.log("Network Response: " + res.data)
    })
    .catch(error => {
        console.error(error)
    })
}
