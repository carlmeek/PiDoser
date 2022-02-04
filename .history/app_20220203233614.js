//To increase version use  npm version patch

var express = require('express');
var app = express();
var settings = require('./settings.js');
var macaddress = require('macaddress');
var update = require("./update.js")
var pjson = require('./package.json');
const routes = require('./routes.js');

var server

app.set('view engine', 'ejs');
app.use('/', routes);
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/static'));

go ()

var testingTimer
var networkTimer

async function go() {

    console.log("Pi Pool Doser Version "+pjson.version)
    console.log("Running in "+__dirname)

    settings.settings.macAddress = await macaddress.one()
    console.log("MAC Address: " + settings.macAddress)

    console.log("Settings: "+JSON.stringify(settings.settings))

    server = app.listen(80, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Pi Pool Doser listening at http://%s:%s", host, port)
    })
return
    console.log("Setting up Testing Poll every "+settings.settings.testPollInterval)
    testingTimer=setInterval(testingPoll, settings.settings.testPollInterval);
    testingPoll()

    console.log("Setting up Network Poll every "+settings.settings.networkPollInterval)
    networkTimer=setInterval(networkPoll, settings.settings.networkPollInterval);
    networkPoll()
}


function testingPoll() {
    console.log('Testing Poll...');
}

function networkPoll() {
    console.log('Network Poll...');

    const axios = require('axios')

    axios
    .get('https://admin.pooldoser.com/deviceupdate.aspx?mac='+settings.settings.macAddress+'&version='+pjson.version)
    .then(res => {
        console.log(res.data)
        settings.data=res.data

        //update
        if (typeof(res.data.newversion)!='undefined' && res.data.newversion!='') {
            console.log("Software Update Required from "+pjson.version+" to "+res.data.newversion+"...")

            //Clean up processes
            clearInterval(testingTimer);
            clearInterval(networkTimer);
            server.close();

            console.log("2 second delay...")
            setTimeout(update.update,2000);
        }

    })
    .catch(error => {
        console.error(error)
    })
}


