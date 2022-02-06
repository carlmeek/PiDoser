async function FindAllDevices() {
    console.log("Dummy FindAllDevices() START")
    return new Promise((resolve, reject) => {
        console.log("Dummy FindAllDevices() INSIDE")
        var DevicesArray = [ new ORP(),
                            new pH(),
                            new EC(),
                            new temp() ]
        resolve(DevicesArray)
    })
}

class ORP {
    GetReading() {
        return "740"
    }
}
class pH {
    GetReading() {
        return "7.4"
    }
}
class EC {
    GetReading() {
        return "1000"
    }
}
class temp {
    SendCommand(X) {
        return "33.4"
    }
}

module.exports={ FindAllDevices,pH,ORP,EC,temp }