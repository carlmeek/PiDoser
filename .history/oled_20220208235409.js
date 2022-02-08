var oled
var params
var os = require('os')

if (os.arch() == 'arm') {
    oled = require('rpi-oled');
} else {
    oled = require('./oled-dummy.js')
}

var myoled

function initialise(passparams) {
    console.log("Initialise OLED...")
    params=passparams
 
    var opts = {
      width: 128,
      height: 64,
    };
     
    myoled = new oled(opts);

    console.log("Clear OLED...")
    myoled.clearDisplay();

    myoled.drawPixel([
        [128, 1, 1],
        [128, 32, 1],
        [128, 16, 1],
        [64, 16, 1]
    ]);
}


module.exports = {initialise}