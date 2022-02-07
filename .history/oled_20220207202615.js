var oled = require('rpi-oled');
var myoled

function initialise() {
    
 
    var opts = {
      width: 128,
      height: 64,
    };
     
    myoled = new oled(opts);

    oled.clearDisplay();
}


module.exports = {initialise}