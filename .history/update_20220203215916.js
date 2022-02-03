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
        //Here is where the output goes
    
        console.log('stdout: ' + data);
    
        data=data.toString();
        scriptOutput+=data;
    });
    
    gitchild.stderr.setEncoding('utf8');
    gitchild.stderr.on('data', function(data) {
        //Here is where the error output goes
    
        console.log('stderr: ' + data);
    
        data=data.toString();
        scriptOutput+=data;
    });

    console.log("Spawning NPM INSTALL...")
    spawn('npm', ['install']).on('close', function() {
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