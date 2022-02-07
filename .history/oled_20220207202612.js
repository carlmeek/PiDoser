var oled = require('rpi-oled');
var myoled

function initialise() {
    
 
    var opts = {
      width: 128,
      height: 64,
    };
     
    var oled = new oled(opts);

    oled.clearDisplay();
}


module.exports = {initialise}