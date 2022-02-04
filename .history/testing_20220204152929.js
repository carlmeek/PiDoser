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

function testingPoll() {
    console.log('Testing Poll...');
    params.lastTestingPoll=new Date()

    const TEMP_REG = 0x01;

    i2c.openPromisified(1).
        then(i2c1 => i2c1.readWord(params.tempProbeAddress, TEMP_REG).
        then(rawData => console.log(toCelsius(rawData))).
        then(_ => i2c1.close())
        ).catch(console.log);
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