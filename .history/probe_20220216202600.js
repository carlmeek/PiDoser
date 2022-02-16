var os = require('os');
var moment = require('moment')

//var Gpio
//if (os.arch() == 'arm') {
//    Gpio = require('onoff').Gpio;
//} else {
//    Gpio = require('./gpio-dummy.js').Gpio;
//}

class Probe{

    calibration
    logicLog
    testingLog
    logic
    direction  //true means UP (orp) and false means down (ph)
    params
    name
    title
    short
    desc
    count = 0
    min = 999999
    max = -999999
    total = 0
    lastReading = 'Never'
    reading = 0
    relayState = false
    relayStateSince = new Date()
    pcf

    constructor(passparams,name,passlogic,passpcf){
       this.name = name
       this.params = passparams
       this.logic = passlogic
       this.pcf = passpcf
       
       switch (name){
           case 'orp' : { this.title = 'ORP'         ; this.short = 'ORP'  ; this.desc='Oxygen Redux Potential' ; this.direction=true; break }
           case 'ph'  : { this.title = 'pH'          ; this.short = 'pH'   ; this.desc='Acidity'                ; this.direction=false; break }
           case 'tds' : { this.title = 'TDS'         ; this.short = 'TDS'  ; this.desc='Total Dissolved Solids' ; this.direction=false; break }
           case 'temp': { this.title = 'Temperature' ; this.short = 'Temp' ; this.desc='Temperature'            ; this.direction=true; break }
       }
    }

    average() {
        if (this.count>0 && this.total>0) {
            return this.total/this.count
        } else {
            return 0
        }
    }

    settings() {
        if (typeof(this.params.settings)=='undefined') {
            return null
        }
        switch (this.name){
            case 'orp' : { return this.params.settings.orp }
            case 'ph'  : { return this.params.settings.ph }
            case 'tds' : { return this.params.settings.tds }
            case 'temp': { return this.params.settings.temp }
        }       
    }

    runTimeToday() {
        var accumulated = 0
        if (typeof(this.params.today)!='undefined' && typeof(this.params.today.runtime)!='undefined') {
            accumulated = this.params.today.runtime[this.name]
        }
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

        if (typeof(settings)=='undefined') {
            console.log(this.name + " Relay cannot be set as settings is undefined")
            return
        }

        console.log(this.name + " Relay "+(val?'ON':'OFF')+" (pin "+pin+')')

        /*
        var pin = settings.gpio


        var gpio = new Gpio(pin,'out')
        gpio.writeSync(val?0:1);
        */

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
            this.logic.writeToday()
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
        if (typeof(this.params.settings)=='undefined') {
            return ''
        }

        var qs = '&' + this.name + '=' + escape(this.average())
        qs += '&' + this.name + 'target=' + escape(this.settings().target)
        qs += '&' + this.name + 'on=' + (this.relayState?1:0)

        if (typeof(this.calibration)!='undefined') {
            qs += '&' + this.name + 'cal=' + this.calibration
        }
        if (typeof(this.slope)!='undefined') {
            qs += '&' + this.name + 'slope=' + this.slope
        }

        qs += '&' + this.name + 'dosedtoday=' +this.runTimeToday()
        qs += '&' + this.name + 'count=' +this.count
        qs += '&' + this.name + 'low=' +this.min
        qs += '&' + this.name + 'high=' +this.max

        this.logic.writeToday()

        this.count=0
        this.total=0
        this.min=99999
        this.max=-99999

        return qs
    }
   
    print(){
       log('Name is :'+ this.name);
    }

}

module.exports={Probe}