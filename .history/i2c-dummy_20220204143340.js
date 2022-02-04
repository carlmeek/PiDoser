function openPromisified() {
    console.log("Dummy openPromisified()")
    return new Promise((resolve, reject) => {
        console.log("Dummy openPromisified()")
    })
}

module.exports={ openPromisified }