var express = require('express');
var app = express();
var settings = require('./settings.js').settings();
var macaddress = require('macaddress');
var AutoUpdater = require('auto-updater');

var autoupdater = new AutoUpdater({
    pathToJson: '',
    autoupdate: false,
    checkgit: true,
    jsonhost: 'raw.githubusercontent.com',
    contenthost: 'codeload.github.com',
    progressDebounce: 0,
    devmode: false
});

app.get('/', function (req, res) {
   res.send('Hello World');
})

go ()

async function go() {
    console.log("Pi Pool Doser Version "+settings.version)

    settings.macAddress = await macaddress.one()
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
}


function testingPoll() {
    console.log('Testing Poll...');
}

function networkPoll() {
    console.log('Network Poll...');

    const axios = require('axios')

    axios
    .get('https://admin.pooldoser.com/deviceupdate.aspx?mac='+settings.macAddress+'&version='+settings.version)
    .then(res => {
        //console.log(`statusCode: ${res.status}`)
        console.log(res.data)
        settings.data=res.data

        //update
        if (res.data.newversion!='') {
            console.log("Software Update Required to version "+res.data.newversion)
            autoupdater.fire('check');
        }

    })
    .catch(error => {
        console.error(error)
    })
}