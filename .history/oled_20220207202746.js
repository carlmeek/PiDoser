var oled

if (os.arch() == 'arm') {
    i2c = require('i2c-bus');
    atlas = require('atlas-scientific-i2c');
} else {
    i2c = require('./i2c-dummy.js');
    atlas = require('./atlas-dummy.js')
}


oled = require('rpi-oled');
var myoled

function initialise() {
 
    var opts = {
      width: 128,
      height: 64,
    };
     
    myoled = new oled(opts);

    oled.clearDisplay();

    oled.drawPixel([
        [128, 1, 1],
        [128, 32, 1],
        [128, 16, 1],
        [64, 16, 1]
    ]);
}


module.exports = {initialise}