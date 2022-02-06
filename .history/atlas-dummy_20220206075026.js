async function FindAllDevices() {
    console.log("Dummy FindAllDevices() START")
    return new Promise((resolve, reject) => {
        console.log("Dummy FindAllDevices() INSIDE")
        var DevicesArray = [ new DummyAtlasDevice() ]
        resolve(DevicesArray)
    })
}



function pH() {
    return {}
}

function ORP() {
    return {}
}

class DummyAtlasORP {
    SendCommand(X) {
        return "740"
    }
}
class DummyAtlaspH {
    SendCommand(X) {
        return "7.4"
    }
}

module.exports={ FindAllDevices,pH,ORP }