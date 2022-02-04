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

async function testingPoll() {
    console.log('Testing Poll...');
    params.lastTestingPoll=new Date()

    //open the i2c bus
    console.log("Open i2c Bus...")
    const bus = await i2c.openPromisified(1);

    //find all EZO devices
    console.log("Find All Devices...")
    const devs=await atlas.FindAllDevices(bus);

    //print out all detected devices
    console.log("Devices Found:")
    console.log(devs);
    //Loop through the list, using 'instanceof' to find the pH chip, and pull a reading from it.

    console.log("Looping Devices...")
    devs.forEach(async item=>{
            if(item instanceof atlas.pH){
                console.log(">> Found pH Device:")
                const r = await item.GetReading();
                console.log('pH reading:'+r);
            }else{
                console.log(">> Found Other Device:")
                    //for everything else, print out the device's class
                console.log(item.constructor.name);
                console.log(">> Get Reading...")

                item.waitTime=900;
                const Cmd=await item.SendCommand('R')
                console.log(Cmd)

                const r=await Cmd.toString('ascii',1);

                console.log('Reading:'+r);

            }
    });
    
    /*

    const TEMP_REG = 0x01;

    i2c.openPromisified(1).
        then(i2c1 => i2c1.readWord(params.tempProbeAddress, TEMP_REG).
        then(rawData => console.log(toCelsius(rawData))).
        then(_ => i2c1.close())
        ).catch(console.log);

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
       console.log('Name is :'+ this.name);
    }

}

module.exports = {initialise,testingPoll}