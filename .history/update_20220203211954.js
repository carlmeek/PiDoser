var AutoGitUpdate = require('auto-git-update')

//    token: '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'

function update() {
    console.log("Temp Location: "+updaterConfig.tempLocation)
    const updater = new AutoGitUpdate(updaterConfig);
    updater.autoUpdate();
}


module.exports = {update}