class i2cwrapper
{
    i2c
    params
    
    constructor() {
        if (os.arch() == 'arm') {
            this.i2c = require('i2c-bus');
            this.i2c = await i2c.openPromisified(1)
        } else {
            this.i2c = require('./i2c-dummy.js');
        }
    }

}
module.exports = ic2rapper