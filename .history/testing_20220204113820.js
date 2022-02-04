var params
os = require('os')

var i2c
if (os.arch() == 'arm') {
    i2c = require('i2c-bus');
} else {
    i2c = require('i2c-bus');
}

function initialise(passparams) {
    params=passparams
}

function testingPoll() {
    console.log('Testing Poll...');
    params.lastTestingPoll=new Date()
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