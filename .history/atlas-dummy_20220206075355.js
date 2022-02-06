async function FindAllDevices() {
    console.log("Dummy FindAllDevices() START")
    return new Promise((resolve, reject) => {
        console.log("Dummy FindAllDevices() INSIDE")
        var DevicesArray = [ new ORP(),
                            new pH(),
                            new tds(),
                            new temp() ]
        resolve(DevicesArray)
    })
}

class ORP {
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

module.exports={ FindAllDevices,pH,ORP,tds,temp }