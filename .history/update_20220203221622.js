const { spawn } = require('child_process');
var child

function update() {
    restartApp()
}

function restartApp()
{
    var RunNPM = true

    console.log("Spawning GIT PULL...")
    var gitchild = spawn('git', ['pull','--rebase']);   // git pull
    gitchild.stdout.setEncoding('utf8');
    gitchild.stdout.on('data', function(data) {
        console.log('GIT PULL: ' + data);
        if (data.indexOf("Already up to date.")!=-1) {
            RunNPM=false 
        }
    });

    gitchild.stderr.setEncoding('utf8');
    gitchild.stderr.on('data', function(data) {
        console.log('GIT PULL ERR: ' + data);
    });
    gitchild.on('close', function() {
        if (RunNPM) {
            updateNPM();
        }
    })
}

function updateNPM() {

    console.log("Spawning NPM INSTALL...")
    var npmchild=spawn('npm', ['install'])
    
    npmchild.stdout.setEncoding('utf8');
    npmchild.stdout.on('data', function(data) {
        console.log('GIT PULL: ' + data);
    });
    npmchild.stderr.setEncoding('utf8');
    npmchild.stderr.on('data', function(data) {
        console.log('GIT PULL ERR: ' + data);
    });

    npmchild.on('close', function() {
        //spawn('coffee', ['-c', './routes/coffee.coffee']).on('close', function() {
            if (child) {
                child.kill();
            }
            startApp();
        //});
    });
}


function startApp()
{
    child = spawn('node', ['app.js']);
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function (data) {
        var str = data.toString()
        console.log(str);
    });
    child.on('close', function (code) {
        console.log('process exit code ' + code);
    });
}


module.exports = {update}