var AutoGitUpdate = require('auto-git-update')

const updaterConfig = {
    repository: 'https://github.com/carlmeek/PiDoser.git',
    tempLocation: './tmp',
    ignoreFiles: [],
    executeOnComplete: './run.sh',
    exitOnComplete: true
}

function update() {
    const updater = new AutoGitUpdate(config);
    updater.autoUpdate();
}


module.exports = {update}