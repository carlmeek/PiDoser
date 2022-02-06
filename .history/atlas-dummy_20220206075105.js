async function FindAllDevices() {
    console.log("Dummy FindAllDevices() START")
    return new Promise((resolve, reject) => {
        console.log("Dummy FindAllDevices() INSIDE")
        var DevicesArray = [ new DummyAtlasORP(),
                            new DummyAtlasORP(), ]
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