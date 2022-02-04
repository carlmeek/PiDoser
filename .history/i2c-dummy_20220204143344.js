function openPromisified() {
    console.log("Dummy openPromisified() START")
    return new Promise((resolve, reject) => {
        console.log("Dummy openPromisified() INSIDE")
    })
}

module.exports={ openPromisified }