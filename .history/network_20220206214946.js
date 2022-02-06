var params

const fs = require('fs')
const { spawn } = require('child_process');

function initialise(passparams) {
    params=passparams
}

function networkPoll() {
    console.log('Network Poll...');
    params.lastNetworkPoll=new Date()
    params.lastNetworkStatus="Connecting"

    const axios = require('axios')

    params.lastURL  = params.rootURL
    params.lastURL += '?m='+escape(params.macAddress)
    params.lastURL += '&ip='+escape(params.ip)
    params.lastURL += '&v='+escape(params.version)
    //We just want the ENTIRE config every time so force f=1
    //if (params.firstNetwork) {
        params.lastURL += '&f=1'
    //    params.firstNetwork=false
   // }
    params.lastURL += '&u='+new moment(new Date()).diff(new moment(params.uptime))
    for (const [key,probe] of Object.entries(params.probes)) {
        params.lastURL += probe.queryString()
    }

    console.log("URL: " + params.lastURL)

    axios
    .get(params.lastURL)
    .then(res => {
        console.log(res.data)
        params.settings=res.data
        params.lastNetworkStatus="OK"

        fs.writeFile(params.settingsFile, JSON.stringify(res.data, null, 4), err => {
            if (err) {
              console.error(err)
              return
            }
        })

        if (typeof(res.data.command)!='undefined' && res.data.command!='') {
            console.log("*** COMMAND: "+res.data.command)
            switch (res.data.command){
                case 'UPGRADE':
                    update();
                    break;
                case 'REBOOT':
                    reboot();
                    break;
            }
        }

        if (res.header('HasError')=='YES') {
            params.lastNetworkStatus="HasError"
            params.lastNetworkError="Unknown"
         }
    })
    .catch(error => {
        console.error(error)
        params.lastNetworkStatus="Error"
        params.lastNetworkError=error
    })
}

function reboot() {
    clearInterval(params.testingTimer);
    clearInterval(params.networkTimer);

    console.log("Spawning REBOOT...")
    var gitchild = spawn('sudo',['/sbin/shutdown','-r','now']); 
    gitchild.stdout.setEncoding('utf8');
    gitchild.stdout.on('data', function(data) {
        console.log('REBOOT: ' + data);
    });

    gitchild.stderr.setEncoding('utf8');
    gitchild.stderr.on('data', function(data) {
        console.log('REBOOT ERR: ' + data);
    });
    gitchild.on('close', function() {
        console.log("Exit App...")
        process.exit(0);
    })
}

function update() {
    clearInterval(params.testingTimer);
    clearInterval(params.networkTimer);

    console.log("Spawning UPDATE...")
    var gitchild = spawn('./update.sh'); 
    gitchild.stdout.setEncoding('utf8');
    gitchild.stdout.on('data', function(data) {
        console.log('UPDATE: ' + data);
    });

    gitchild.stderr.setEncoding('utf8');
    gitchild.stderr.on('data', function(data) {
        console.log('UPDATE ERR: ' + data);
    });
    gitchild.on('close', function() {
        console.log("Exit App...")
        process.exit(0);
    })
}


module.exports = {initialise,networkPoll,update,reboot}