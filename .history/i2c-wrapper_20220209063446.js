class i2cwrapper
{
    i2c

    constructor() {
        if (os.arch() == 'arm') {
            this.i2c = require('i2c-bus');
        } else {
            this.i2c = require('./i2c-dummy.js');
        }
        params.i2cbus = await i2c.openPromisified(1)

    }

}
module.exports = ic2rapper