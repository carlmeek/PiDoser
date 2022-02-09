class i2cwrapper
{
    constructor() {
        var i2c
        if (os.arch() == 'arm') {
            i2c = require('i2c-bus');
        } else {
            i2c = require('./i2c-dummy.js');
        }
        
    }

}
module.exports = ic2rapper