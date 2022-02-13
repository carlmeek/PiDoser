var oled
var params
var os = require('os')
const FontPack = require('oled-font-pack');
var funcs = require ('./funcs.js')
var lastInitialise

if (os.arch() == 'arm') {
    //oled = require('oled-i2c-bus');
    oled = require('./oled-library.js');
} else {
    oled = require('./oled-dummy.js')
}

var opts = {
    width: 128,
    height: 64,
    address: 0x3C,
  };

var myoled

function initialise(passparams) {
    console.log("Initialise OLED...")
    params=passparams
 
    myoled = new oled(params.i2cbus,opts);

    console.log("Clear OLED...")
    myoled.clearDisplay(true);

    let font = FontPack.hallfetica_normal_16x16 //arial_normal_16x16
    spaceText(font,1,1,"Pool Doser",12)
    writeStringAt(font,1,20,"Startup")

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

    myoled = new oled(params.i2cbus,opts);

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