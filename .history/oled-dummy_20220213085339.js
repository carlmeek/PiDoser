class oled
{
    debug = false

    constructor() {
        if (debug) console.log("@OLED constructor")
    }
    clearDisplay() {
        if (this.debug) console.log("@OLED clear display")
    }
    drawPixel() {
        if (this.debug) console.log("@OLED draw pixel")
    }
    setCursor() {
        if (this.debug) console.log("@OLED set cursor")
    }
    writeString() {
        if (this.debug) console.log("@OLED write string")
    }
    fillRect() {
        if (this.debug) console.log("@OLED fill rect")
    }
}
module.exports=oled