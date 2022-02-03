var express = require('express');
var app = express();
var settings = require('./settings.js').settings();
var macaddress = require('macaddress');

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
            console.log("Software Update Required to version "+res.data.newversio+"...")
        }

    })
    .catch(error => {
        console.error(error)
    })
}




// State the events
autoupdater.on('git-clone', function() {
    console.log("You have a clone of the repository. Use 'git pull' to be up-to-date");
  });
  autoupdater.on('check.up-to-date', function(v) {
    console.info("You have the latest version: " + v);
  });
  autoupdater.on('check.out-dated', function(v_old, v) {
    console.warn("Your version is outdated. " + v_old + " of " + v);
    autoupdater.fire('download-update'); // If autoupdate: false, you'll have to do this manually.
    // Maybe ask if the'd like to download the update.
  });
  autoupdater.on('update.downloaded', function() {
    console.log("Update downloaded and ready for install");
    autoupdater.fire('extract'); // If autoupdate: false, you'll have to do this manually.
  });
  autoupdater.on('update.not-installed', function() {
    console.log("The Update was already in your folder! It's read for install");
    autoupdater.fire('extract'); // If autoupdate: false, you'll have to do this manually.
  });
  autoupdater.on('update.extracted', function() {
    console.log("Update extracted successfully!");
    console.warn("RESTART THE APP!");
  });
  autoupdater.on('download.start', function(name) {
    console.log("Starting downloading: " + name);
  });
  autoupdater.on('download.progress', function(name, perc) {
    process.stdout.write("Downloading " + perc + "% \033[0G");
  });
  autoupdater.on('download.end', function(name) {
    console.log("Downloaded " + name);
  });
  autoupdater.on('download.error', function(err) {
    console.error("Error when downloading: " + err);
  });
  autoupdater.on('end', function() {
    console.log("The app is ready to function");
  });
  autoupdater.on('error', function(name, e) {
    console.error(name, e);
  });