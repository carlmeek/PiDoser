class i2cwrapper
{
    i2c
    params

    constructor(params) {
        if (os.arch() == 'arm') {
            this.i2c = require('i2c-bus');
        } else {
            this.i2c = require('./i2c-dummy.js');
        }
    }

    initialise(passparams) {
        this.params=passparams
        this.i2c = await i2c.openPromisified(1)
    }
}
module.exports = ic2rapper