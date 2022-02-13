class oled
{
    constructor() {
        console.log("@OLED constructor")
    }
    clearDisplay() {
        console.log("@OLED clear display")
    }
    drawPixel() {
        console.log("@OLED draw pixel")
    }
    setCursor() {
        console.log("@OLED set cursor")
    }
    writeString() {
        console.log("@OLED write string")
    }
}
module.exports=oled