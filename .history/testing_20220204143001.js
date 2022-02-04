var params
os = require('os')

var i2c
if (os.arch() == 'arm') {
    i2c = require('i2c-bus');
} else {
    i2c = require('./i2c-dummy.js');
}

function initialise(passparams) {
    params=passparams
}

function testingPoll() {
    console.log('Testing Poll...');
    params.lastTestingPoll=new Date()

    i2c.openPromisified(1).
        then(i2c1 => i2c1.readWord(TEMP_PROBE_ADDRESS, TEMP_REG).
        then(rawData => console.log(toCelsius(rawData))).
        then(_ => i2c1.close())
        ).catch(console.log);
}

class Probe{

    constructor(name){
       this.name = name ;
    }
   
    print(){
       console.log('Name is :'+ this.name);
    }

}

module.exports = {initialise,testingPoll}