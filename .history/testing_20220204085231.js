var params

function initialise(passparams) {
    params=passparams
}

function testingPoll() {
    console.log('Testing Poll...');
    params.lastTestingPoll=new Date()
}

module.exports = {initialise,testingPoll}