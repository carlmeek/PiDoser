//To increase version use  npm version patch
var server

var express = require('express');
var app = express();
var settings = require('./settings.js');
var params = {settings:settings.settings()}

var macaddress = require('macaddress');
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

    console.log("Settings: "+JSON.stringify(params.settings))

    server = app.listen(80, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Pi Pool Doser listening at http://%s:%s", host, port)
    })

    console.log("Setting up Testing Poll every "+params.settings.testPollInterval)
    params.testingTimer=setInterval(testingPoll, params.settings.testPollInterval);
    testingPoll()

    console.log("Setting up Network Poll every "+params.settings.networkPollInterval)
    params.networkTimer=setInterval(networkPoll, params.settings.networkPollInterval);
    networkPoll()
}


function testingPoll() {
    console.log('Testing Poll...');
    params.lastTestingPoll=new Date()
}

function networkPoll() {
    console.log('Network Poll...');
    params.lastNetworkPoll=new Date()
    params.lastNetworkStatus="Connecting"

    const axios = require('axios')

    axios
    .get('https://admin.pooldoser.com/deviceupdate.aspx?mac='+params.macAddress+'&version='+params.version)
    .then(res => {
        console.log(res.data)
        params.settings.data=res.data
        params.lastNetworkStatus="OK"

        //update
        if (typeof(res.data.newversion)!='undefined' && res.data.newversion!='') {
            console.log("Software Update Required from "+params.version+" to "+res.data.newversion+"...")

            //Clean up processes
            clearInterval(params.testingTimer);
            clearInterval(params.networkTimer);
            server.close();

            console.log("2 second delay...")
            setTimeout(update.update,2000);
        }

    })
    .catch(error => {
        console.error(error)
        params.lastNetworkStatus="Error"
        params.lastNetworkError=error
    })
}



