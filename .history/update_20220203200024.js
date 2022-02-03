function update() {
}

const updaterConfig = {
    repository: 'https://github.com/carlmeek/PiDoser.git',
    tempLocation: './tmp',
    ignoreFiles: [],
    executeOnComplete: './run.sh',
    exitOnComplete: true
}


module.exports = {update}