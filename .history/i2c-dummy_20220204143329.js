function openPromisified() {
    console.log("Dummy openPromisified")
    return new Promise((resolve, reject) => {
    })
}

module.exports={ openPromisified }