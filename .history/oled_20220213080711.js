var oled
var params
var os = require('os')
const FontPack = require('oled-font-pack');

if (os.arch() == 'arm') {
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
    //myoled.drawLine(1, 1, 128, 32, 1);
    //myoled.fillRect(1, 1, 10, 20, 1);
    //myoled.drawBitmap(image.data);
    //myoled.startscroll('left', 0, 15); // this will scroll an entire 128 x 32 screen
    //myoled.stopscroll();
    console.log("cursor...")
    myoled.setCursor(1, 1);

    console.log("font")
    //FONTS http://www.rinkydinkelectronics.com/r_fonts.php
    let font3x5 = FontPack.oled_3x5;
    // Load the legacy oled-font-5x7;
    let font5x7 = FontPack.oled_5x7;

    let font = FontPack.Calibri32x64GR

    // sets cursor to x = 1, y = 1
    myoled.setCursor(1, 1);
    console.log("string")
    myoled.writeString(font, 1, 'Cats and dogs are really cool animals, you know.', 1, true);

    console.log("OLED Done")
}


module.exports = {initialise}