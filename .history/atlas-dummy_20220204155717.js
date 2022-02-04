async function FindAllDevices() {
    console.log("Dummy FindAllDevices() START")
    return new Promise((resolve, reject) => {
        console.log("Dummy FindAllDevices() INSIDE")
        var DevicesArray = [ new DummyAtlasDevice]
        resolve(DevicesArray)
    })
}



function pH() {
    return {}
}

class DummyAtlasDevice {
    SendCommand(X) {

    }
}

module.exports={ FindAllDevices,pH }