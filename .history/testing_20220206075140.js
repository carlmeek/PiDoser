var params
os = require('os')
moment = require('moment')

var i2c
var atlas
if (os.arch() == 'arm') {
    i2c = require('i2c-bus');
    atlas = require('atlas-scientific-i2c');
} else {
    i2c = require('./i2c-dummy.js');
    atlas = require('./atlas-dummy.js')
}


function initialise(passparams) {
    params=passparams
}

function log(txt) {
    console.log(txt)
    var n = new moment(new Date())
    params.testinglog+=n.format("HH:mm:ss")+' - '+txt+'<br>'
}

async function testingPoll() {
    params.testinglog=''

    log('Testing Poll...');
    params.lastTestingPoll=new Date()

    //open the i2c bus
    log("Open i2c Bus...")
    const bus = await i2c.openPromisified(1);

    //find all EZO devices
    log("Find All Devices...")
    const devs=await atlas.FindAllDevices(bus);

    //Loop through the list, using 'instanceof' to find the pH chip, and pull a reading from it.
    log("Looping Devices...")
    for (const item of devs) {
        var probe
        if(item instanceof atlas.pH | item instanceof){
            probe=params.probes.ph
            log(">> Found pH Device")
            probe.reading = await item.GetReading();
            probe.lastReading = new Date()
            log('     pH reading:'+probe.reading);
        } else if(item instanceof atlas.ORP){
            probe=params.probes.orp
            log(">> Found ORP Device")
            probe.reading = await item.GetReading();
            probe.lastReading = new Date()
            log('     ORP reading:'+probe.reading);
        }else{
            probe=params.probes.temp
            log(">> Found (assumed) RTD Temperature Device")
            item.waitTime=900;
            var cmd = await item.SendCommand('R')
            probe.reading = await cmd.toString('ascii',1);
            probe.lastReading = new Date()
            log('     Temp Reading:'+probe.reading);
        }
    }//);
    
    log("All Complete")
    params.lasttestinglog=params.testinglog
}



module.exports = {initialise,testingPoll}