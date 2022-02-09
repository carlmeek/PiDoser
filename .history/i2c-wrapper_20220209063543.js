class i2cwrapper
{
    i2c
    params

    constructor(params) {
        if (os.arch() == 'arm') {
            this.i2c = require('i2c-bus');
            this.i2c = await i2c.openPromisified(1)
        } else {
            this.i2c = require('./i2c-dummy.js');
        }
    }
    function initialise(passparams) {
        params=passparams
    }
}
module.exports = ic2rapper