function openPromisified() {
    console.log("Dummy openPromisified() START")
    return new Promise((resolve, reject) => {
        console.log("Dummy openPromisified() INSIDE")
        var dummyitem = new dummyi2c
        resolve(dummyitem)
    })
}

class dummyi2c {
    readWord() {
        return new Promise((resolve, reject) => {
            console.log("Dummy I2C Read Word")
    }
}

module.exports={ openPromisified }