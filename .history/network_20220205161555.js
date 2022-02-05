var params

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

        if (res.data.command!='')

        //update OLD METHOD
        /*
        if (typeof(res.data.newversion)!='undefined' && res.data.newversion!='') {
            console.log("Software Update Required from "+params.version+" to "+res.data.newversion+"...")

            //Clean up processes
            clearInterval(params.testingTimer);
            clearInterval(params.networkTimer);
            server.close();

            console.log("2 second delay...")
            setTimeout(update.update,2000);
        }
        */

    })
    .catch(error => {
        console.error(error)
        params.lastNetworkStatus="Error"
        params.lastNetworkError=error
    })
}

module.exports = {initialise,networkPoll}