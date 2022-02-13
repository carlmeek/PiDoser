var oled
var params
var os = require('os')

//if (os.arch() == 'arm') {
    //oled = require('oled-i2c-bus');
    oled = require('./oled-library.js');
//} else {
//    oled = require('./oled-dummy.js')
//}

var myoled

function initialise(passparams) {
    console.log("Initialise OLED...")
    params=passparams
 
    var opts = {
      width: 128,
      height: 64,
      address: 0x3C,
    };
     
    myoled = new oled(params.i2cbus,opts);

    console.log("Clear OLED...")
    myoled.clearDisplay();

    console.log("Draw Pixel OLED...")
    myoled.drawPixel([
        [128, 1, 1],
        [128, 32, 1],
        [128, 16, 1],
        [64, 16, 1]
    ]);
    //oled.drawLine(1, 1, 128, 32, 1);
    //oled.fillRect(1, 1, 10, 20, 1);
    //oled.drawBitmap(image.data);
    //oled.startscroll('left', 0, 15); // this will scroll an entire 128 x 32 screen
    //oled.stopscroll();
    oled.setCursor(1, 1);

    var font = require('oled-font-5x7');

    // sets cursor to x = 1, y = 1
    oled.setCursor(1, 1);
    oled.writeString(font, 1, 'Cats and dogs are really cool animals, you know.', 1, true);
}


module.exports = {initialise}