var params
os = require('os')

var i2c
if (os.arch() == 'arm') {
    i2c = require('i2c-bus');
} else {
    i2c = require('./i2c-dummy.js');
}

const as_dev=require('atlas-scientific-i2c');


function initialise(passparams) {
    params=passparams
}

async function testingPoll() {
    console.log('Testing Poll...');
    params.lastTestingPoll=new Date()

    //open the i2c bus
    const bus = await i2c.openPromisified(1);

    //find all EZO devices
    const devs=await as_dev.FindAllDevices(bus);
    
    //print out all detected devices
    console.log(devs);
    //Loop through the list, using 'instanceof' to find the pH chip, and pull a reading from it.
    devs.forEach(async item=>{
            if(item instanceof as_dev.pH){
                    const r = await item.GetReading();
                    console.log('pH reading:'+r);
            }else{
                    //for everything else, print out the device's class
                    console.log(item.constructor.name);
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