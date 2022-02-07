var os = require('os');
var moment = require('moment')
const { logic } = require('./logic.js');
var Gpio
if (os.arch() == 'arm') {
    Gpio = require('onoff').Gpio;
} else {
    Gpio = require('./gpio-dummy.js').Gpio;
}

class Probe{

    calibration
    logicLog
    testingLog
    logic
    direction  //true means UP (orp) and false means down (ph)
    params
    name
    title
    desc
    lastReading = 'Never'
    reading = 0
    relayState = false
    relayStateSince = null

    constructor(passparams,name,passlogic){
       this.name = name
       this.params = passparams
       this.logic = passlogic
       
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
        var accumulated = this.params.today.runtime[this.name]
        //now add in current
        if (this.relayState) {
            var m = new moment(this.relayStateSince)
            var nowMoment = new moment(new Date())
            var minutes = nowMoment.diff(m, 'minutes');
            accumulated += minutes
        }

        return accumulated
    }
    lastMaxRun() {
        return this.params.today.lastmaxrun[this.name]
    }

    relaySet(val) {
        var changing = (val!=this.relayState)
        var settings = this.settings()
        var pin = settings.gpio

        console.log(this.name + " Relay "+(val?'ON':'OFF')+" (pin "+pin+')')

        var gpio = new Gpio(pin,'out')
        gpio.writeSync(val?0:1);

        if (changing) {
            this.relayState=val
            this.relayStateSince=new Date()
        }
    }

    relayOff() {
        //Was it ON? If so - accumulate daily total.
        if (this.relayState) {
            var m = new moment(this.relayStateSince)
            var nowMoment = new moment(new Date())
            var minutes = nowMoment.diff(m, 'minutes');
            this.params.today.runtime[this.name]+=minutes
            logic.writeToday()
        }
        this.relaySet(false)
    }

    relayOn() {
        this.relaySet(true)
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

        if (typeof(this.calibration)!='undefined') {
            qs += '&' + this.name + 'cal=' + his.calibration
        }
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