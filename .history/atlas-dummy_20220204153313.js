async function FindAllDevices() {
    console.log("Dummy FindAllDevices() START")
    return new Promise((resolve, reject) => {
        console.log("Dummy FindAllDevices() INSIDE")
        var DevicesArray = ["TEST"]
        resolve(DevicesArray)
    })
}

module.exports={ FindAllDevices,pH }