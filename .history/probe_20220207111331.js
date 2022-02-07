var os = require('os')
var Gpio
if (os.arch() == 'arm') {
    Gpio = require('onoff').Gpio;
} else {
    Gpio = require('./gpio-dummy.js').Gpio;
}

class Probe{

    direction  //true means UP (orp) and false means down (ph)
    params
    name
    title
    desc
    lastReading = 'Never'
    reading = 0
    relayState = false
    relayStateSince = null

    constructor(passparams,name){
       this.name = name
       this.params = passparams
       
       switch (name){
           case 'orp' : { this.title = 'ORP'         ; this.desc='Oxygen Redux Potential' ; this.direction=true; break }
           case 'ph'  : { this.title = 'pH'          ; this.desc='Acidity'                ; this.direction=false; break }
           case 'tds' : { this.title = 'TDS'         ; this.desc='Total Dissolved Solids' ; this.direction=false; break }
           case 'temp': { this.title = 'Temperature' ; this.desc='Temperature'            ; this.direction=true; break }
       }
    }

    settings() {
        switch (this.name){
            case 'orp' : { return this.params.settings.orp }
            case 'ph'  : { return this.params.settings.ph }
            case 'tds' : { return this.params.settings.tds }
            case 'temp': { return this.params.settings.temp }
        }       
    }

    runTimeToday() {
        return this.params.today.runtime[this.name]
    }

    relaySet(val) {
        var changing = (val!=this.relayState)
        var settings = this.settings()
        var pin = settings.gpio

        console.log(this.name + " Relay "+(val?'ON':'OFF')+"" (pin "+pin+')')

        var gpio = new Gpio(pin,'out')
        gpio.writeSync(val?1:0);

        this.relayState=false
        this.relayStateSince=new Date()
    }

    relayOff() {
    }

    relayOn() {

        var settings = this.settings()
        var pin = settings.gpio

        console.log(this.name + " Relay ON (pin "+pin+')')
        var gpio = new Gpio(pin,'out')
        gpio.writeSync(1);

        this.relayState=true
        this.relayStateSince=new Date()
    }

    formatReading() {
        switch (this.name){
            case 'orp' : { return this.reading }
            case 'ph'  : { return this.reading }
            case 'tds' : { return this.reading }
            case 'temp': { return this.reading + "&deg;C" }
        }
    }

    queryString() {

        var qs = '&' + this.name + '=' + escape(this.reading)
        qs += '&' + this.name + 'target=' + escape(this.settings().target)
        qs += '&' + this.name + 'on=' + (this.relayState?1:0)
        //dosedtoday
        //count
        //low
        //high
        return qs
    }
   
    print(){
       log('Name is :'+ this.name);
    }

}

module.exports={Probe}