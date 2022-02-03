const { spawn } = require('child_process');
var child

function update() {
    restartApp()
}

function restartApp()
{
    console.log("Spawning GIT PULL...")
    var gitchild = spawn('git', ['pull']);   // git pull
    gitchild.stdout.on('data', function(data) {
        console.log('GIT PULL: ' + data);
    });
    gitchild.stderr.setEncoding('utf8');
    gitchild.stderr.on('data', function(data) {
        console.log('GIT PULL ERR: ' + data);
    });

    console.log("Spawning NPM INSTALL...")
    var npmchild=spawn('npm', ['install'])
    
    gitchild.stdout.on('data', function(data) {
        console.log('GIT PULL: ' + data);
    });
    gitchild.stderr.setEncoding('utf8');
    gitchild.stderr.on('data', function(data) {
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