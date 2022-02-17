var params
var logic
var oled
var os = require('os')
var moment = require('moment')
const { EZODevice } = require('atlas-scientific-i2c')

var atlas
if (os.arch() == 'arm') {
    atlas = require('atlas-scientific-i2c');
} else {
    atlas = require('./atlas-dummy.js')
}


function initialise(passparams,passlogic,passoled) {
    params=passparams
    logic=passlogic
    oled=passoled
    logic.initialise(passparams)
}

function log(txt,probe) {
    console.log("TESTING:" + txt)
    var n = new moment(new Date())
    var txt=n.format("HH:mm:ss")+' - '+txt+'<br>'
    if (probe==null) {
        params.testinglog+=txt
    } else {
        probe.testingLog+=txt
    }
}


async function testingPoll() {

    params.testinglog=''
    log('Testing Poll...');
    params.lastTestingPoll=new Date()

    if (typeof(params.settings)=='undefined') {
        log("Settings are not available, aborting testing routine")
        return;
    }

    //i2c scan
    log("Scanning i2c Bus...")
    var founddevs = await params.i2cbus.scan()
    if (typeof(founddevs)=='undefined') {
        log("Bus results undefined")
    } else {
        for (var i=0; i<founddevs.length; i++) {
            var item=founddevs[i]
            log("*SCAN i2cBus finds "+item)

            switch (item) {
                case 98:
                    var device = new ORP(i2c_bus,item,info)
                    probe=params.probes.orp
                    probe.testingLog=''
                    log("Found ORP Device",probe)
                    probe.reading = await device.GetReading();
                    if (probe.reading=="@") probe.reading=0
                    probe.lastReading = new Date()
                    log('ORP reading:'+probe.reading,probe);
                    break;
                case 99:
                    var device = new pH(i2c_bus,item,info)
                    probe=params.probes.ph
                    probe.lastTestingLog=probe.testingLog
                    probe.testingLog=''
                    log("Found pH Device",probe)
                    probe.reading = await device.GetReading();
                    if (probe.reading=="@") probe.reading=0
                    probe.lastReading = new Date()
                    log('pH reading:'+probe.reading,probe);

                    probe.calibration = device.IsCalibrated()
                    log("pH Calibration is "+await probe.calibration,probe)

                    var temperature = params.probes.temp.reading
                    log("Temperature for compensation is "+temperature,probe)
                    device.SetTemperatureCompensation(temperature, false)

                    device.GetSlope().then((slope) => {
                        probe.slope = slope
                        log("pH Slope is "+probe.slope,probe)
                    }).catch(error => function() {
                        params.addError('Type:Error getting pH slope<br>Error:'+error);
                        probe.slope="ERROR"
                    });
                    break;
                case 100:
                    var device = new EC(i2c_bus,item,info)
                    probe=params.probes.tds
                    if (probe.reading=="@") probe.reading=0
                    probe.testingLog=''
                    log("Found EC (TDS) Device",probe)
                    probe.reading = await device.GetReading();
                    probe.lastReading = new Date()
                    log('EC reading:'+probe.reading,probe);

                    probe.calibration = device.IsCalibrated()
                    log("EC TDS Calibration is "+probe.calibration,probe)
                    break;
                case 102:
                    var device = new EZODevice(i2c_bus,item,info)
                    probe=params.probes.temp
                    probe.testingLog=''
                    log("Found (assumed) RTD Temperature Device",probe)
                    device.waitTime=900;
                    var cmd = await device.SendCommand('R')
                    probe.reading = await cmd.toString('ascii',1);
                    probe.lastReading = new Date()
                    log('Temp Reading:'+probe.reading,probe);
                    break;
            }
        }
    }

    /*
    //find all EZO devices
    log("Find All Devices...")
    const devs=await atlas.FindAllDevices(params.i2cbus);

    //Loop through the list, using 'instanceof' to find the pH chip, and pull a reading from it.
    log("Looping Devices..." + devs.length)
    for (const item of devs) {
        var probe
        if(item instanceof atlas.pH){
            


        } else if(item instanceof atlas.ORP){
            //probe.calibration = item.IsCalibrated()
            //log("ORP Calibration is "+await probe.calibration,probe)
        } else if(item instanceof atlas.EC){
            
        }else{
            
        }
        log('After converting to Float: '+probe.reading,probe)
        probe.reading=parseFloat(probe.reading)
        if (isNaN(probe.reading)) probe.reading=0;

        probe.count ++
        probe.total += probe.reading
        if (probe.reading < probe.min) probe.min=probe.reading
        if (probe.reading > probe.max) probe.max=probe.reading
        log('Final Count:'+probe.count,probe)
        log('Final Total:'+probe.total,probe)
        log('Final Min:'+probe.min,probe)
        log('Final Max:'+probe.max,probe)
        log('Final Average:'+probe.average(),probe)

        probe.lastTestingLog=probe.testingLog
    }//);
    
    log("All Complete, now running Logic...")
    params.lasttestinglog=params.testinglog

    logic.logic()

    log("Finally updating OLED")
    oled.update();
}



module.exports = {initialise,testingPoll}