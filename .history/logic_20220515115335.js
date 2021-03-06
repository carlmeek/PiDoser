var params
const e = require('express')
var moment = require('moment')
var fs = require('fs')
const { profileEnd } = require('console')

function initialise(passparams) {
    params=passparams
}

function log(txt,probe) {
    console.log("LOGIC:"+txt)
    var n = new moment(new Date())
    var txt=n.format("HH:mm:ss")+' - '+txt+'<br>'
    if (probe==null) {
        params.logiclog+=txt
    } else {
        probe.logicLog+=txt
    }
}

function writeToday() {
    log("Writing Today File")
    var json = JSON.stringify(params.today, null, 4)
    log("JSON text to write is type: "+typeof(json))
    log("Today file is "+json.length+" bytes")
    fs.writeFileSync(params.todayFile, json, err => {
        if (err) {
          console.error(err)
          return
        }
    })
}

async function logic() {
    params.logiclog=''

    log("Running Logic")

    var dateformat='yyyy-MM-DD'
    var todayformatted=new moment(params.today.date).format(dateformat)
    var nowformatted=new moment(new Date()).format(dateformat)
    log("Checking TODAY... Date is "+todayformatted+" Actual is "+nowformatted)
    if (todayformatted!=nowformatted) {
        log("Dumping today and starting fresh")
        params.today={
            date:new Date(),
            runtime:{
                orp:0,
                ph:0,
                tds:0,
                floc:0,
                temp:0
            },
            lastmaxrun:{
                orp:null,
                ph:null,
                tds:null,
                floc:null,
                temp:null
            }
        }
        writeToday()
    }

    for (const [key,probe] of Object.entries(params.probes)) {
        await probelogic(probe)
    }

    log("All probe logic done")

    params.lastlogiclog=params.logiclog
}


async function probelogic(probe) {
    probe.logicLog=''

    var probeSettings = probe.settings()
    var nowMoment = new moment(new Date())

    //check probe settings found
    if (typeof(probeSettings)=='undefined') {
        log("...Probe Settings Undefined. Turning Relay Off.",probe)
        log("Relay Result: "+probe.relayOff(),probe)
        return
    }
    
    //check last reading ever existed
    if (probe.lastReading=='Never') {
        log("...Never had a reading. Turning Relay Off.",probe)
        log("Relay Result: "+probe.relayOff(),probe)
        return
    }

    //Check last reading not too long ago
    var m = new moment(probe.lastReading)
    var secs = nowMoment.diff(m, 'seconds');
    if (secs>60) {
        log("...No reading for "+secs+" Seconds. Turning Relay Off.",probe)
        log("Relay Result: "+probe.relayOff(),probe)
        return
    } else {
        log("...Last reading was "+secs+" Seconds ago.",probe)
    }

    //Pause
    if (probeSettings.pause=="1") {
        log("PAUSED in settings. Turning Relay Off.",probe)
        log("Relay Result: "+probe.relayOff(),probe)
        return
    }

    //Manually set dose until
    if (typeof(probeSettings.doseuntil)!='undefined' && probeSettings.doseuntil!="" && probeSettings.doseuntil!="0") {
        log("...Raw Dose Until is "+probeSettings.doseuntil),probe)
        var doseuntil = new moment(probeSettings.doseuntil)
        log("...Dose Until is "+doseuntil.format("Do MMMM YYYY, HH:mm:ss"),probe)
        if (doseuntil>nowMoment) {
            log("...Turning Relay ON",probe)
            log("Relay Result: "+probe.relayOn(),probe)
            return
        } else {
            log("...which is in the past, so ignoring.",probe)
        }
    }

    //Now consider the reading and whether to turn on or not
    var diff = probeSettings.target-probe.reading
    if (!probe.direction) diff=diff*-1
    log("Reading is "+probe.reading+". Target "+probeSettings.target+". Diff is "+diff,probe)
    if (diff > 0) {
        log("Consider dosing...",probe)
        log("Today runtime is "+probe.runTimeToday()+" Max Run Per Day is "+probeSettings.maxrunperday,probe)
        if (probe.runTimeToday() >= probeSettings.maxrunperday) {
            log("MAX RUN HIT FOR TODAY",probe)
            log("Relay Result: "+probe.relayOff(),probe)
            return;
        }
        log("Relay currently showing as "+(probe.relayState?'ON':'OFF')+" Since "+probe.relayStateSince,probe)

        if(probe.relayState) {
            //Already ON
            var m = new moment(probe.relayStateSince)
            var n = new moment(new Date()) 
            var mins = n.diff(m, 'minutes');
            log("Relay Already On Since "+probe.relayStateSince+" for "+mins+" Minutes",probe)

            log("Max Run for Relay is "+probeSettings.maxruntime,probe)
            if (typeof(probeSettings.maxruntime)!='undefined') {
                if(mins >= probeSettings.maxruntime) {
                    log("MAX RUN HIT",probe)
                    log("Relay Result: "+probe.relayOff(),probe)
                    params.today.lastmaxrun[probe.name]=new Date()
                    return
                }
            }
            //its already on, but send command anyway
            log("Relay Result: "+probe.relayOn(),probe)
            return
        } else {
            //Check max run release
            if (probe.lastMaxRun()!=null) {
                log("Last Max run is "+probe.lastMaxRun(),probe)
                var m = new moment(probe.lastMaxRun())
                var n = new moment(new Date()) 
                var mins = n.diff(m, 'minutes');
                log("Minutes since last max run hit: "+mins,probe)
                if (mins>probeSettings.maxrunrelease) {
                    log("Release",probe)
                    params.today.lastmaxrun[probe.name]=null
                } else {
                    log("Not released from max run yet",probe)
                    log("Relay Result: "+probe.relayOff(),probe)
                    return
                }
            }
            //Turn ON
            log("Turning Relay On",probe)
            log("Relay Result: "+probe.relayOn(),probe)
            log("Relay now showing as "+(probe.relayState?'ON':'OFF')+" Since "+probe.relayStateSince,probe)
            return
        }
    }
    
    //End action - we got to here and nothing turned it on, so turn it off.
    log("...No reason to turn on. Turning Relay Off.",probe)
    log("Relay Result: "+probe.relayOff(),probe)
}



module.exports = {initialise,logic,writeToday}