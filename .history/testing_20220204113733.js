var params

if os.arch() == 'arm' 
    const i2c = require('i2c-bus');
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