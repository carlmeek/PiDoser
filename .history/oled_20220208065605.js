var oled
var params

if (os.arch() == 'arm') {
    oled = require('rpi-oled');
} else {
    oled = require('./oled-dummy.js')
}


var myoled

function initialise(passparams) {
    params=passparams
 
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