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
       this.Gpio



       var LED = new Gpio(4, 'out'); //use GPIO pin 4, and specify that it is output
       var blinkInterval = setInterval(blinkLED, 250); //run the blinkLED function every 250ms
       
       function blinkLED() { //function to start blinking
         if (LED.readSync() === 0) { //check the pin state, if the state is 0 (or off)
           LED.writeSync(1); //set pin state to 1 (turn LED on)
         } else {
           LED.writeSync(0); //set pin state to 0 (turn LED off)
         }
       }
       
       function endBlink() { //function to stop blinking
         clearInterval(blinkInterval); // Stop blink intervals
         LED.writeSync(0); // Turn LED off
         LED.unexport(); // Unexport GPIO to free resources
       }
       
       setTimeout(endBlink, 5000); //stop blinking after 5 seconds
       



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
    }

    relayOn() {
        console.log(this.name + " Relay ON")
        this.relayState=true
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