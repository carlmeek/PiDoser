var params
var moment = require('moment')

function initialise(passparams) {
    params=passparams
}

function log(txt) {
    console.log(txt)
    var n = new moment(new Date())
    params.logiclog+=n.format("HH:mm:ss")+' - '+txt+'<br>'
}

async function logic() {
    params.logiclog=''

    log("Running Logic")

    for (const [key,probe] of Object.entries(params.probes)) {
        await probelogic(probe)
    }

    log("All probe logic done")

    params.lastlogiclog=params.logiclog
}


async function probelogic(probe) {
    var probeSettings = probe.settings()
    var nowMoment = new moment(new Date())

    log("Logic for "+probe.name+"...")

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
 //       var midnight = nowMoment.format("yyyy-MM-dd 00:00")
        var doseuntil = new moment(probeSettings.doseuntil)
        log("Dose Until is "+doseuntil)
        if (doseuntil>nowMoment) {
            log("...Turning Relay ON")
        }
    }
    
    //End action - we got to here and nothing turned it on, so turn it off.
    log("...No reason to turn on. Turning Relay Off.")
    probe.relayOff()
}



module.exports = {initialise,logic}