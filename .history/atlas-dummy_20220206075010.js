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

class DummyAtlasDevice {
    SendCommand(X) {
        return "BLAH"
    }
}

module.exports={ FindAllDevices,pH,ORP }