class i2cwrapper
{
    var i2c
    constructor() {
        if (os.arch() == 'arm') {
            i2c = require('i2c-bus');
        } else {
            i2c = require('./i2c-dummy.js');
        }
        
    }

}
module.exports = ic2rapper