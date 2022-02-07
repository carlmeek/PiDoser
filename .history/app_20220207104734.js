//To increase version use:    npm version patch --force
//
//PiDoser is saved in Documents folder on the Pi
//test pi is 10.243.20.29
//
//To make PM2 run at startup: sudo env PATH=$PATH:/usr/local/bin pm2 startup systemd -u pi --hp /home/pi
var server

var express = require('express');
var app = express();
var settings = require('./settings.js');
var probe = require('./probe.js')
var fs = require('fs')
var os = require('os')

var params = {
    testPollInterval: 5000,
    networkPollInterval: 10000,
    settings:settings.settings(),
    uptime:new Date(),
    tempProbeAddress: 0x66,
    firstNetwork:true,
    rootURL:'https://admin.pooldoser.com/deviceupdate.aspx',
    settingsFile:'../settings.json',
    todayFile:'../today.json',
    testinglog:'',
    lasttestinglog:'',
    networklog:'',
    lastnetworklog:'',
    logiclog:'',
    lastlogiclog:'',
    today:{
        date:new Date("2000-01-01")
    }
}

params.probes= {
        orp:new probe.Probe(params,'orp'),
        ph:new probe.Probe(params,'ph'),
        tds:new probe.Probe(params,'tds'),
        temp:new probe.Probe(params,'temp')
    }

var macaddress = require('macaddress');
var ip = require("ip");
params.ip=ip.address()

var pjson = require('./package.json');
params.version=pjson.version

var network = require('./network.js')
network.initialise(params)

const routes = require('./routes.js');
routes.initialise(params,network)

var testing = require('./testing.js')
testing.initialise(params)

app.set('view engine', 'ejs');
app.use('/', routes.router);
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/node_modules/jquery/dist'));
app.use(express.static(__dirname + '/static'));

go ()

async function go() {

    console.log("Pi Pool Doser Version "+params.version)
    console.log("Running in "+__dirname)

    params.systemdata='Architecture:'+os.arch()
    params.systemdata += '<br>'+os.cpus().length+" CPUs: "+os.cpus()[0].model
    params.systemdata += '<br>Host name: '+os.hostname()
    params.systemdata += '<br>OS: '+os.type()+" "+os.version()
    params.systemdata += '<br>Platform: '+os.platform()
    params.systemdata += '<br>Memory: '+Math.round(os.totalmem()/1024/1024/1024)+" gb"

    params.macAddress = await macaddress.one()
    console.log("MAC Address: " + params.macAddress)
    console.log("IP Address: " + params.ip)

    console.log("Settings: "+JSON.stringify(params.settings))

    server = app.listen(3000, function () { //Cannot be port 80 due to permissions.
    var host = server.address().address
    var port = server.address().port
    console.log("Pi Pool Doser listening at http://%s:%s", host, port)
    })

    if (fs.existsSync(params.settingsFile)) {
        console.log("Reading settings from file")
        var data = fs.readFileSync(params.settingsFile)
        params.settings=JSON.parse(data)
        console.log("SETTINGS FROM FILE:")
        console.log(params.settings)
    } else {
        console.log("Cannot read local settings file - it does not exist")
    }

    if (fs.existsSync(params.todayFile)) {
        console.log("Reading TODAY from file")
        var data = fs.readFileSync(params.todayFile)
        params.today=JSON.parse(data)
        console.log("TODAY FROM FILE:")
        console.log(params.today)
    } else {
        console.log("Cannot read local today file - it does not exist")
    }

    for (const [key,probe] of Object.entries(params.probes)) {
        probe.relayOff()
    }

    console.log("Setting up Testing Poll every "+params.testPollInterval)
    params.testingTimer=setInterval(testing.testingPoll, params.testPollInterval);
    testing.testingPoll()

    console.log("Setting up Network Poll every "+params.networkPollInterval)
    params.networkTimer=setInterval(network.networkPoll, params.networkPollInterval);
    network.networkPoll()
}





