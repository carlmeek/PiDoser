var params
const e = require('express')
var moment = require('moment')
var fs = require('fs')
const { profileEnd } = require('console')

function initialise(passparams) {
    params=passparams
}

function log(txt) {
    console.log(txt)
    var n = new moment(new Date())
    params.logiclog+=n.format("HH:mm:ss")+' - '+txt+'<br>'
}

function writeToday() {
    log("Writing Today File")
    fs.writeFile(params.todayFile, JSON.stringify(params.today, null, 4), err => {
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
    var probeSettings = probe.settings()
    var nowMoment = new moment(new Date())

    log("*** Logic for "+probe.name+" ***")

    //check last reading ever existed
    if (probe.lastReading=='Never') {
        log("...Never had a reading. Turning Relay Off.")
        probe.relayOff()
        return
    }

    //Check last reading not too long ago
    var m = new moment(probe.lastReading)
    var secs = nowMoment.diff(m, 'seconds');
    if (secs>60) {
        log("...No reading for "+secs+" Seconds. Turning Relay Off.")
        probe.relayOff()
        return
    }

    //Manually set dose until
    if (typeof(probeSettings.doseuntil)!='undefined' && probeSettings.doseuntil!="" && probeSettings.doseuntil!="0") {
        var doseuntil = new moment(probeSettings.doseuntil)
        log("...Dose Until is "+doseuntil.format("Do MMMM YYYY, HH:mm:ss"))
        if (doseuntil>nowMoment) {
            log("...Turning Relay ON")
            probe.relayOn()
            return
        } else {
            log("...which is in the past, so ignoring.")
        }
    }

    //Now consider the reading and whether to turn on or not
    var diff = probeSettings.target-probe.reading
    if (!probe.direction) diff=diff*-1
    log("Reading is "+probe.reading+". Target "+probeSettings.target+". Diff is "+diff)
    if (diff > 0) {
        log("Consider dosing...")
        log("Today runtime is "+probe.runTimeToday()+" Max Run Per Day is "+probeSettings.maxrunperday)
        if (probe.runTimeToday() >= probeSettings.maxrunperday) {
            log("MAX RUN HIT FOR TODAY")
            probe.relayOff()
            return;
        }
        log("Relay currently showing as "+(probe.relayState?'ON':'OFF')+" Since "+probe.relayStateSince)

        if(probe.relayState) {
            //Already ON
            var m = new moment(probe.relayStateSince)
            var n = new moment(new Date()) 
            var mins = n.diff(m, 'minutes');
            log("Relay Already On Since "+probe.relayStateSince+" for "+mins+" Minutes")
            log("Max Run for Relay is "+probeSettings.maxruntime)

            if(mins >= probeSettings.maxruntime) {
                log("MAX RUN HIT")
                probe.relayOff()
                params.today.lastmaxrun[probe.name]
            }
        } else {
            //Turn ON
            log("Turning Relay On")
            probe.relayOn()
            log("Relay now showing as "+(probe.relayState?'ON':'OFF')+" Since "+probe.relayStateSince)
        }
    }
    
    //End action - we got to here and nothing turned it on, so turn it off.
    log("...No reason to turn on. Turning Relay Off.")
    probe.relayOff()
}



module.exports = {initialise,logic}