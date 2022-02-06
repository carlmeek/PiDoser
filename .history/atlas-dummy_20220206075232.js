async function FindAllDevices() {
    console.log("Dummy FindAllDevices() START")
    return new Promise((resolve, reject) => {
        console.log("Dummy FindAllDevices() INSIDE")
        var DevicesArray = [ new orp(),
                            new DummyAtlaspH(),
                            new DummyAtlasTDS(),
                            new DummyAtlasTemp() ]
        resolve(DevicesArray)
    })
}

function pH() {
    return {}
}

function ORP() {
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
class DummyAtlasTDS {
    SendCommand(X) {
        return "1000"
    }
}
class DummyAtlasTemp {
    SendCommand(X) {
        return "33.4"
    }
}

module.exports={ FindAllDevices,pH,ORP }