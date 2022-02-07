var params
var logic
var os = require('os')
var moment = require('moment')

var i2c
var atlas
if (os.arch() == 'arm') {
    i2c = require('i2c-bus');
    atlas = require('atlas-scientific-i2c');
} else {
    i2c = require('./i2c-dummy.js');
    atlas = require('./atlas-dummy.js')
}


function initialise(passparams,passlogic) {
    params=passparams
    logic=passlogic
    logic.initialise(passparams)
}

function log(txt,probe) {
    console.log(txt)
    var n = new moment(new Date())
    var txt=n.format("HH:mm:ss")+' - '+txt+'<br>'
    if (probe==null) {
        params.testinglog+=txt
    } else {
        probe.testingLog+=txt
    }
}


async function testingPoll() {

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
        if(item instanceof atlas.pH){
            probe=params.probes.ph
            probe.testingLog=''
            log(">> Found pH Device",probe)
            probe.reading = await item.GetReading();
            probe.lastReading = new Date()
            log('     pH reading:'+probe.reading,probe);
        } else if(item instanceof atlas.ORP){
            probe=params.probes.orp
            probe.testingLog=''
            log(">> Found ORP Device",probe)
            probe.reading = await item.GetReading();
            probe.lastReading = new Date()
            log('     ORP reading:'+probe.reading,probe);
        } else if(item instanceof atlas.EC){
            probe=params.probes.tds
            probe.testingLog=''
            log(">> Found EC (TDS) Device",probe)
            probe.reading = await item.GetReading();
            probe.lastReading = new Date()
            log('     EC reading:'+probe.reading,probe);
        }else{
            probe=params.probes.temp
            log(">> Found (assumed) RTD Temperature Device",probe)
            item.waitTime=900;
            var cmd = await item.SendCommand('R')
            probe.reading = await cmd.toString('ascii',1);
            probe.lastReading = new Date()
            log('     Temp Reading:'+probe.reading,probe);
        }
        log('    After converting to Float: '+probe.reading,probe)
        probe.reading=parseFloat(probe.reading)
    }//);
    
    log("All Complete, now running Logic...")
    params.lasttestinglog=params.testinglog

    logic.logic()
}



module.exports = {initialise,testingPoll}