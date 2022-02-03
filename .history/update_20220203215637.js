const { spawn } = require('child_process');
var child

function update() {
    restartApp()
}

function restartApp()
{
    spawn('git', ['pull']);   // git pull
    spawn('npm', ['install']).on('close', function() {
        spawn('coffee', ['-c', './routes/coffee.coffee']).on('close', function() {
            if (child) {
                child.kill();
            }
            startApp();
            if (res) {
                res.send('ok.');
            }
        });
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