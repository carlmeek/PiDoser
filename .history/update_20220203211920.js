var AutoGitUpdate = require('auto-git-update')

const updaterConfig = {
    repository: 'https://github.com/carlmeek/PiDoser',
    tempLocation: __dirname.substring(__dirname.lastIndexOf("/"))+'/tmp-updater',
    ignoreFiles: [],
    executeOnComplete: './run.sh',
    exitOnComplete: true
}
//    token: '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'

function update() {
    const updater = new AutoGitUpdate(updaterConfig);
    updater.autoUpdate();
}


module.exports = {update}