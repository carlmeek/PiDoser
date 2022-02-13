class oled
{
    debug = false

    constructor() {
        if (debug) console.log("@OLED constructor")
    }
    clearDisplay() {
        if (debug) console.log("@OLED clear display")
    }
    drawPixel() {
        if (debug) console.log("@OLED draw pixel")
    }
    setCursor() {
        if (debug) console.log("@OLED set cursor")
    }
    writeString() {
        if (debug) console.log("@OLED write string")
    }
    fillRect() {
        if (debug) console.log("@OLED fill rect")
    }
}
module.exports=oled