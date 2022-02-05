var params
const { spawn } = require('child_process');

function initialise(passparams) {
    params=passparams
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
        params.settings=res.data
        params.lastNetworkStatus="OK"

        if (typeof(res.data.command)!='undefined' && res.data.command!='') {
            console.log("*** COMMAND: "+res.data.command)
            switch (res.data.command){
                case 'UPGRADE':
                    update();
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



function update() {
    var RunNPM = true

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


module.exports = {initialise,networkPoll}