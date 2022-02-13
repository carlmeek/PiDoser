var oled
var params
var os = require('os')
const FontPack = require('oled-font-pack');
var funcs = require ('./funcs.js')

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
    myoled.turnOffDisplay();
    myoled.turnOnDisplay();
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
    myoled.LETTERSPACING=0
    writeStringAt(font,1,1,"Pool Doser")
    //spaceText(font,1,1,"Pool Doser",12)
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

    myoled.clearDisplay();
    let bigfont = FontPack.hallfetica_normal_16x16 //arial_normal_16x16
    spaceText(bigfont,1,1, (params.title?params.title:'Pool Doser') ,12)

    //myoled.fillRect(1, 20, 128,64,0)

    let font = FontPack.oled_5x7;
    doProbe(font,20,params.probes.temp)
    doProbe(font,29,params.probes.orp)
    doProbe(font,38,params.probes.ph)
    writeStringAt(font,1,47,"Net:"+params.lastNetworkStatus+" "+funcs.ago(params.lastNetworkPoll,true,true))    
    
    if (params.lastError!=null) {
        writeStringAt(font,1,56,"Error "+funcs.ago(params.lastError,true,true))
    }
}

function doProbe(font,y,probe) {
    var txt = probe.short
    txt += ":"
    txt += probe.reading
    writeStringAt(font,1,y,txt)

    txt=(probe.relayState?"ON":"OFF")
    txt += " " + funcs.ago(probe.relayStateSince,true,true)
    writeStringAt(font,78,y,txt)
}

module.exports = {initialise,update}