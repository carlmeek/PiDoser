var AutoGitUpdate = require('auto-git-update')

const updaterConfig = {
    repository: 'https://carlmeek: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@github.com/carlmeek/PiDoser.git',
    tempLocation: './tmp',
    ignoreFiles: [],
    executeOnComplete: './run.sh',
    exitOnComplete: true,
    token: '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'
}

function update() {
    const updater = new AutoGitUpdate(updaterConfig);
    updater.autoUpdate();
}


module.exports = {update}