var express = require('express');
var app = express();
var settings = require('./settings.js').settings();
var macaddress = require('macaddress');
var update = require("./update.js")
var pjson = require('./package.json');
var server

//To increase version use  npm version patch

app.get('/', function (req, res) {
   res.send('Hello World');
})

go ()

var testingTimer
var networkTimer

async function go() {

    console.log("Pi Pool Doser Version "+pjson.version)
    console.log("Running in "+__dirname)

    settings.macAddress = await macaddress.one()
    console.log("MAC Address: " + settings.macAddress)

    console.log("Settings: "+JSON.stringify(settings))

    server = app.listen(80, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Pi Pool Doser listening at http://%s:%s", host, port)
    })

    console.log("Setting up Testing Poll every "+settings.testPollInterval)
    testingTimer=setInterval(testingPoll, settings.testPollInterval);
    testingPoll()

    console.log("Setting up Network Poll every "+settings.networkPollInterval)
    networkTimer=setInterval(networkPoll, settings.networkPollInterval);
    networkPoll()
}


function testingPoll() {
    console.log('Testing Poll...');
}

function networkPoll() {
    console.log('Network Poll...');

    const axios = require('axios')

    axios
    .get('https://admin.pooldoser.com/deviceupdate.aspx?mac='+settings.macAddress+'&version='+pjson.version)
    .then(res => {
        //console.log(`statusCode: ${res.status}`)
        console.log(res.data)
        settings.data=res.data

        //update
        if (res.data.newversion!='') {
            console.log("Software Update Required from "+pjson.version+" to "+res.data.newversion+"...")

            //Clean up processes
            clearInterval(testingTimer);
            clearInterval(networkTimer);
            server.close();
            
            update.update();
        }

    })
    .catch(error => {
        console.error(error)
    })
}


