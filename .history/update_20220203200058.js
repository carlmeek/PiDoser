import AutoGitUpdate from 'auto-git-update';

const updaterConfig = {
    repository: 'https://github.com/carlmeek/PiDoser.git',
    tempLocation: './tmp',
    ignoreFiles: [],
    executeOnComplete: './run.sh',
    exitOnComplete: true
}

function update() {
}


module.exports = {update}