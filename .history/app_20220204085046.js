//To increase version use  npm version patch
var server

var express = require('express');
var app = express();
var settings = require('./settings.js');
var network = require('./network.js')

var params = {
    testPollInterval: 5000,
    networkPollInterval: 10000,
    settings:settings.settings()
}

var macaddress = require('macaddress');
var ip = require("ip");
params.ip=ip.address()

var update = require("./update.js")
var pjson = require('./package.json');
params.version=pjson.version

const routes = require('./routes.js');
routes.initialise(params)

app.set('view engine', 'ejs');
app.use('/', routes.router);
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/static'));

go ()

async function go() {

    console.log("Pi Pool Doser Version "+params.version)
    console.log("Running in "+__dirname)

    params.macAddress = await macaddress.one()
    console.log("MAC Address: " + params.macAddress)
    console.log("IP Address: " + params.ip)

    console.log("Settings: "+JSON.stringify(params.settings))

    server = app.listen(80, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Pi Pool Doser listening at http://%s:%s", host, port)
    })

    console.log("Setting up Testing Poll every "+params.testPollInterval)
    params.testingTimer=setInterval(testingPoll, params.testPollInterval);
    testingPoll()

    console.log("Setting up Network Poll every "+params.networkPollInterval)
    params.networkTimer=setInterval(network.networkPoll, params.networkPollInterval);
    network.networkPoll()
}


function testingPoll() {
    console.log('Testing Poll...');
    params.lastTestingPoll=new Date()
}




