
class dummyi2c {
    openPromisified()
    {

    }
    readWord() {
        return new Promise((resolve, reject) => {
            console.log("Dummy I2C Read Word")
            resolve(123)
        })
    }
    close() {
        console.log("Dummy I2C Close")
    }
}

module.exports={ openPromisified }