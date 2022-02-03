var AutoGitUpdate = require('auto-git-update')

//    token: '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'

function update() {

    const updaterConfig = {
        repository: 'https://github.com/carlmeek/PiDoser',
        tempLocation: __dirname.substring(0,__dirname.lastIndexOf("/"))+'/tmp-updater',
        ignoreFiles: [],
        executeOnComplete: './run.sh',
        exitOnComplete: true
    }

    console.log("Temp Location: "+updaterConfig.tempLocation)
    const updater = new AutoGitUpdate(updaterConfig);
    updater.autoUpdate();
}


module.exports = {update}