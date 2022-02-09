//This dummy class shims ASYNC + SYNC functions together
//because atlas needs Async and OLED needs sync functions

function openPromisified() {
    return new dummyi2c
}

class dummyi2c {
    readWord() {
        return new Promise((resolve, reject) => {
            console.log("Dummy I2C Read Word")
            resolve(123)
        })
    }
    close() {
        console.log("Dummy I2C Close")
    }
    write
}

module.exports={ openPromisified }