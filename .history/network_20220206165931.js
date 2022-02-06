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

    params.lastURL  = 'https://admin.pooldoser.com/deviceupdate.aspx'
    params.lastURL += '?mac='+escape(params.macAddress)
    params.lastURL += '&ip='+escape(params.ip)
    params.lastURL += '&version='+escape(params.version)
    params.lastURL += '&uptime='+new moment(params.uptime).diff(new moment(new Date()))
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

        fs.writeFile('../settings.json', JSON.stringify(res.data, null, 4), err => {
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