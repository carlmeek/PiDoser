var params
os = require('os')

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

    //print out all detected devices
    log("Devices Found:")
    log(devs);
    //Loop through the list, using 'instanceof' to find the pH chip, and pull a reading from it.

    log("Looping Devices...")
    devs.forEach(async item=>{
            if(item instanceof atlas.pH){
                log(">> Found pH Device:")
                const r = await item.GetReading();
                log('pH reading:'+r);
            } else if(item instanceof atlas.ORP){
                log(">> Found ORP Device:")
                const r = await item.GetReading();
                log('ORP reading:'+r);
            }else{
                log(">> Found Temperature Device:")
                    //for everything else, print out the device's class
                log(item.constructor.name);
                log(">> Get Reading...")

                item.waitTime=900;
                const Cmd=await item.SendCommand('R')
                log(Cmd)

                const r=await Cmd.toString('ascii',1);

                log('Reading:'+r);

            }
    });
    
    /*

    const TEMP_REG = 0x01;

    i2c.openPromisified(1).
        then(i2c1 => i2c1.readWord(params.tempProbeAddress, TEMP_REG).
        then(rawData => log(toCelsius(rawData))).
        then(_ => i2c1.close())
        ).catch(log);

        */
}

const toCelsius = rawData => {
    rawData = (rawData >> 8) + ((rawData & 0xff) << 8);
    let celsius = (rawData & 0x0fff) / 16;
    if (rawData & 0x1000) {
      celsius -= 256;
    }
    return celsius;
  };





class Probe{

    constructor(name){
       this.name = name ;
    }
   
    print(){
       log('Name is :'+ this.name);
    }

}

module.exports = {initialise,testingPoll}