//To increase version use:    npm version patch --force
//
//PiDoser is saved in Documents folder on the Pi
//test pi is 10.243.20.29
//
//To make PM2 run at startup: sudo env PATH=$PATH:/usr/local/bin pm2 startup systemd -u pi --hp /home/pi
var server

var express = require('express');
var app = express();
var probe = require('./probe.js')
var fs = require('fs')
var os = require('os')
var queue = require('queue')
var PCF8574 = require('./pcf8574.js').PCF8574; //modified lib for async i2c

var i2c
if (os.arch() == 'arm') {
    i2c = require('i2c-bus');
} else {
    i2c = require('./i2c-dummy.js');
}

var params = {
    settingsLabels:null,
    testPollInterval: 5000,
    oledPollInterval: 1000,
    networkPostInterval: 60, // seconds
    networkPollInterval: 10000,
    lastNetworkPost:new Date('2000-01-01'),
    uptime:new Date(),
    tempProbeAddress: 0x66,
    firstNetwork:true,
    rootURL:'https://admin.pooldoser.com/deviceupdate.aspx',
    settingsFile:'../settings.json',
    labelsFile:'../labels.json',
    todayFile:'../today.json',
    testinglog:'',
    lasttestinglog:'',
    networklog:'',
    lastnetworklog:'',
    logiclog:'',
    lastlogiclog:'',
    lastError:null,
    errors:[],
    today:{
        date:new Date("2000-01-01")
    },
    addError:function(err) {
        err = 'Date:'+new Date +'<br>'+err
        this.lastError=err
        params.lastError=new Date()
        params.errors.push(err)
        if (this.errors.length>10) this.errors.pop()
    }
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

var logic = require('./logic')
logic.initialise(params)

var oled = require('./oled.js')

var testing = require('./testing.js')
testing.initialise(params,logic,oled)


app.set('view engine', 'ejs');
app.use('/', routes.router);
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use(express.static(__dirname + '/node_modules/jquery/dist'));
app.use(express.static(__dirname + '/static'));

try {
    go ()
} catch(e) {
    console.log("FATAL ERROR IN GO: "+e.toString())
}
async function go() {

    console.log("Pi Pool Doser Version "+params.version)
    console.log("Running in "+__dirname)

    if (os.arch() != 'arm') {
        params.addError('Type:Fake Error');
    }

    console.log("Uncaught Exception Handler...")
    process.on('uncaughtException', (error, source) => {
        console.error("Uncaught Exception:"+error.toString()+' - '+Error().stack)
        params.addError('Type:Uncaught Exception<br>' +
                        'Error:'+error.toString() + '<br>' +
                        'Source:'+source.toString()+ '<BR>' +
                        'Stack:'+new Error().stack)
    }); 

    console.log("Unhandled Rejection Handler...")
    process.on('unhandledRejection', (reason, promise) => {
        console.error("Unhandled Rejection:"+reason)
        params.addError('Type:Unhandled Rejection' + '<br>' +
                        'Reason:'+reason + '<br>' +
                        'Promise:'+promise.toString())
    });
    
    params.i2cbus = await i2c.openPromisified(1)    
    oled.initialise(params)

    params.pcf = new PCF8574(params.i2cbus, 32, false);

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
        console.log("Parsing settings from file")
        try {
            var newsettings = JSON.parse(data)
            params.settings=newsettings
            console.log("SETTINGS FROM FILE:")
            console.log(params.settings)
        } catch(e) {
            console.log("Settings from file are corrupted: "+e.message)
        }
    } else {
        console.log("Cannot read local settings file - it does not exist")
    }

    if (fs.existsSync(params.todayFile)) {
        console.log("Reading TODAY from file")
        var data = fs.readFileSync(params.todayFile)
        console.log("Today Data: "+data)
        if (data!='') {
            try {
                params.today=JSON.parse(data)
                console.log("TODAY FROM FILE:")
                console.log(params.today)
            } catch(e) {
                console.log("Parse TODAY file FAILED.")
            }
        } else {
            console.log("Today data blank")
        }
    } else {
        console.log("Cannot read local today file - it does not exist")
    }

    if (fs.existsSync(params.labelsFile)) {
        console.log("Reading LABELS from file")
        var data = fs.readFileSync(params.labelsFile)
        console.log("Labels Data: "+data)
        if (data!='') {
            try {
                params.settingsLabels=JSON.parse(data)
                console.log("LABELS FROM FILE:")
                console.log(params.today)
            } catch(e) {
                console.log("Parse LABELS file FAILED.")
            }
        } else {
            console.log("LABELS data blank")
        }
    } else {
        console.log("Cannot read local today file - it does not exist")
    }
    params.probes= {
        orp:new probe.Probe(params,'orp',logic),
        ph:new probe.Probe(params,'ph',logic),
        tds:new probe.Probe(params,'tds',logic),
        temp:new probe.Probe(params,'temp',logic)
    }

    if (typeof(params.settings)!='undefined') {
        console.log("Switching all relays off")
        for (const [key,probe] of Object.entries(params.probes)) {
            this.relayState=true //to force OFF
            probe.relayOff()
        }
    }


    console.log("Setting up Testing Poll every "+params.testPollInterval)
    //params.testingTimer=setInterval(testing.testingPoll, params.testPollInterval);
    testing.testingPoll()

    console.log("Setting up Network Poll every "+params.networkPollInterval)
    //params.networkTimer=setInterval(network.networkPoll, params.networkPollInterval);
    network.networkPoll()

    //console.log("Setting up OLED Poll every "+params.oledPollInterval)
    //params.oledTimer=setInterval(oled.update, params.oledPollInterval);
    //oled.update()
}





