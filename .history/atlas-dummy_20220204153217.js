async function FindAllDevices() {
    console.log("Dummy FindAllDevices() START")
    return new Promise((resolve, reject) => {
        console.log("Dummy openPromisified() INSIDE")
        var dummyitem = new dummyi2c
        resolve(dummyitem)
    })
}

module.exports={  }