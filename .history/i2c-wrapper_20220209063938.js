var os = require('os')

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

    async initialise(passparams) {
        this.params=passparams
        this.i2c = await this.i2c.openPromisified(1)
    }
}
module.exports = i2cwrapper