var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO

class Probe{

    params
    name
    title
    desc
    lastReading = 'Never'
    reading = 0
    relayState = false
    Gpio

    constructor(passparams,name){
       this.name = name
       this.params = passparams
       this.Gpio(this.settings().gpiopin,'out')

       switch (name){
           case 'orp' : { this.title = 'ORP'         ; this.desc='Oxygen Redux Potential' ; break }
           case 'ph'  : { this.title = 'pH'          ; this.desc='Acidity'                ; break }
           case 'tds' : { this.title = 'TDS'         ; this.desc='Total Dissolved Solids' ; break }
           case 'temp': { this.title = 'Temperature' ; this.desc='Temperature'            ; break }
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

    relayOff() {
        console.log(this.name + " Relay OFF")
        this.relayState=false
        this.gpio.writeSync(0);
    }

    relayOn() {
        console.log(this.name + " Relay ON")
        this.relayState=true
        this.gpio.writeSync(0);
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