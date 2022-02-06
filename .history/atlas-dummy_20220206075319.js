async function FindAllDevices() {
    console.log("Dummy FindAllDevices() START")
    return new Promise((resolve, reject) => {
        console.log("Dummy FindAllDevices() INSIDE")
        var DevicesArray = [ new orp(),
                            new pH(),
                            new tds(),
                            new temp() ]
        resolve(DevicesArray)
    })
}

function getpH() {
    return {}
}

function getORP() {
    return {}
}

class orp {
    SendCommand(X) {
        return "740"
    }
}
class pH {
    SendCommand(X) {
        return "7.4"
    }
}
class tds {
    SendCommand(X) {
        return "1000"
    }
}
class temp {
    SendCommand(X) {
        return "33.4"
    }
}

module.exports={ FindAllDevices,pH,orp,tds,temp }