var oled
var params
var os = require('os')
const FontPack = require('oled-font-pack');

if (os.arch() == 'arm') {
    //oled = require('oled-i2c-bus');
    oled = require('./oled-library.js');
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
      address: 0x3C,
    };
     
    myoled = new oled(params.i2cbus,opts);

    console.log("Clear OLED...")
    myoled.clearDisplay();

    //console.log("Draw Pixel OLED...")
    //myoled.drawPixel([
    //    [128, 1, 1],
    //    [128, 32, 1],
    //    [128, 16, 1],
    //    [64, 16, 1]
    //]);
    //myoled.drawLine(1, 1, 128, 32, 1);
    //myoled.fillRect(1, 1, 10, 20, 1);
    //myoled.drawBitmap(image.data);
    //myoled.startscroll('left', 0, 15); // this will scroll an entire 128 x 32 screen
    //myoled.stopscroll();
    console.log("cursor...")
    myoled.setCursor(1, 1);

    console.log("font")
    //FONTS LIST HERE https://github.com/lynniemagoo/oled-font-pack/blob/master/index.js
    //FONTS shown http://www.rinkydinkelectronics.com/r_fonts.php
    //let font3x5 = FontPack.oled_3x5;
    // Load the legacy oled-font-5x7;
    //let font5x7 = FontPack.oled_5x7;

    let font = FontPack.hallfetica_normal_16x16 //arial_normal_16x16
    spaceText(font,1,1,"Pool Doser",12)
    writeStringAt(font,1,20,"Startup")

    // sets cursor to x = 1, y = 1
    //console.log("string")

    //Writestring params:
    //obj font - font object in JSON format (see note below on sourcing a font)
    //int size - font size, as multiplier. Eg. 2 would double size, 3 would triple etc.
    //string text - the actual text you want to show on the display.
    //int color - color of text. Can be specified as either 0 for 'off' or black, and 1 or 255 for 'on' or white.
    //bool wrapping - true applies word wrapping at the screen limit, false for no wrapping. If a long string without spaces is supplied as the text, just letter wrapping will apply instead.
    //writeStringAt(font,1,1,"P")
    //writeStringAt(font,1,16,"o")

//    myoled.writeString(font, 1, 'Cats and dogs are really cool animals, you know.', 1, true);

    console.log("OLED Done")
}

function spaceText(font,x,y,text,space) {
    for (var i=0;i<text.length;i++) {
        writeStringAt(font,x,y,text[i])
        x+=space
    }
}

function writeStringAt(font,x,y,text) {
    myoled.setCursor(x, y);
    myoled.writeString(font, 1, text, 1, false);
}

function update() {
    console.log("OLED Update...")

    myoled.fillRect(1, 1, 10, 20, 1);

    let font = FontPack.oled_5x7;
    writeStringAt(font,1,25,"ORP:"+params.probes.orp.reading)
    writeStringAt(font,1,35,"pH:"+params.probes.ph.reading)

    <%- include('includes/param.ejs',{key:"Last Network Poll",value:funcs.ago(params.lastNetworkPoll)}) %>
<%- include('includes/param.ejs',{key:"Last Network Status",value:params.lastNetworkStatus}) %>

    
}


module.exports = {initialise,update}