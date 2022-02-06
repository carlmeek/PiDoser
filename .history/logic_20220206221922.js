var params

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

    params.lastlogiclog=params.logiclog
}



module.exports = {initialise,logic}