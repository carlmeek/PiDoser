async function FindAllDevices() {
    console.log("Dummy FindAllDevices() START")
    return new Promise((resolve, reject) => {
        console.log("Dummy FindAllDevices() INSIDE")
        var dummyitem = new dummyi2c
        resolve(dummyitem)
    })
}

module.exports={  }