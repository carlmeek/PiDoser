var params

function initialise(passparams) {
    params=passparams
}

function log(txt) {
    console.log(txt)
    var n = new moment(new Date())
    params.logicglog+=n.format("HH:mm:ss")+' - '+txt+'<br>'
}

async function logic() {
    
}



module.exports = {initialise,logic}