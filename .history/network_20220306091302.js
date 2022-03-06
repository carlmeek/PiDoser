var params

const fs = require('fs')
const { spawn } = require('child_process');
var moment = require('moment')
var funcs = require('./funcs.js');
const e = require('express');

function initialise(passparams) {
    params=passparams
}

function networkPoll() {
    params.networklog=''

    log('Network Poll...');
    params.lastNetworkPoll=new Date()
    params.lastNetworkStatus="Connecting"

    const axios = require('axios')

    var n=new moment(new Date())
    var m=new moment(params.lastNetworkPost)
    var diff=n.diff(m,'seconds')
    log("Last full post was "+funcs.ago(params.lastNetworkPost))

    params.lastURL  = params.rootURL
    params.lastURL += '?m='+escape(params.macAddress)

    if (diff>=params.networkPostInterval) {
        params.lastURL += '&ip='+escape(params.ip)
        params.lastURL += '&v='+escape(params.version)
        //We just want the ENTIRE config every time so force f=1
        params.lastURL += '&f=1'
        params.lastURL += '&u='+new moment(new Date()).diff(new moment(params.uptime))
        for (const [key,probe] of Object.entries(params.probes)) {
            params.lastURL += probe.queryString() 
        }
    }

    if (params.settingsLabels==null) {
        params.lastUrl += '&getlabels=1'
        log("YES")
    } else {
        log("NO")
    }
    }

    log("Getting URL...")
    log(params.lastURL.replaceAll('&','<BR>          '))

    axios
    .get(params.lastURL)
    .then(res => {
        log("Received from server:")
        log(JSON.stringify(res.data,null,4))

        if (typeof(res.data.command)!='undefined' && res.data.command!='') {
            log("*** COMMAND: "+res.data.command)
            switch (res.data.command){
                case 'UPGRADE':
                    update();
                    break;
                case 'REBOOT':
                    reboot();
                    break;
            }
        }

        if (res.headers['haserror']=='YES') {
            log("HasError header was set to YES")
            params.lastNetworkStatus="HasError"
            params.lastNetworkError="Unknown"
        } else {

            params.settings=res.data
            params.lastNetworkStatus="OK"
            params.lastNetworkPost=new Date()
    
            //NO ERROR
            log("Writing Settings File")
            fs.writeFile(params.settingsFile, JSON.stringify(res.data, null, 4), err => {
                if (err) {
                  console.error(err)
                  return
                }
            })    
        }
        params.lastnetworklog=params.networklog
        log("Network Poll Complete")

        //now re-schedule
        log("Re-scheduling next test for "+params.networkPollInterval)
        params.networkTimer=setTimeout(networkPoll, params.networkPollInterval);

    })
    .catch(error => {
        log("Error")
        log(error.toString())
        params.lastNetworkStatus="Error"
        params.lastNetworkError=error
        params.lastnetworklog=params.networklog

        //now re-schedule
        log("Re-scheduling next network poll for "+params.networkPollInterval)
        params.networkTimer=setTimeout(networkPoll, params.networkPollInterval);


    })

}

function log(txt) {
    console.log(txt)
    var n = new moment(new Date())
    params.networklog+=n.format("HH:mm:ss")+' - '+txt.replaceAll('\n','<BR>')+'<br>'
}


function reboot() {
    clearInterval(params.testingTimer);
    clearInterval(params.networkTimer);
    //clearInterval(params.oledTimer);

    log("Spawning REBOOT...")
    var gitchild = spawn('sudo',['/sbin/shutdown','-r','now']); 
    gitchild.stdout.setEncoding('utf8');
    gitchild.stdout.on('data', function(data) {
        log('REBOOT: ' + data);
    });

    gitchild.stderr.setEncoding('utf8');
    gitchild.stderr.on('data', function(data) {
        log('REBOOT ERR: ' + data);
    });
    gitchild.on('close', function() {
        log("Exit App...")
        process.exit(0);
    })
}

function update() {
    clearInterval(params.testingTimer);
    clearInterval(params.networkTimer);

    log("Spawning UPDATE...")
    var gitchild = spawn('./update.sh'); 
    gitchild.stdout.setEncoding('utf8');
    gitchild.stdout.on('data', function(data) {
        log('UPDATE: ' + data);
    });

    gitchild.stderr.setEncoding('utf8');
    gitchild.stderr.on('data', function(data) {
        log('UPDATE ERR: ' + data);
    });
    gitchild.on('close', function() {
        log("Exit App...")
        process.exit(0);
    })
}


module.exports = {initialise,networkPoll,update,reboot}