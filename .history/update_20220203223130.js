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
            startApp();
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
    console.log("Start App...")

    process.on('SIGINT', () => {
        console.log('Received SIGINT. Press Control-D to exit.');
        process.exit(0);
    });
    process.on("exit", function (exitCode) {

        //  Resolve the `child_process` module, and `spawn` 
        //  a new process.
        //  The `child_process` module lets us
        //  access OS functionalities by running any bash command.`.
        console.log("APP ON EXIT("+exitCode+")...")

        if (exitCode==99) {
            spawn(
                process.argv.shift(),
                process.argv,
                {
                cwd: process.cwd(),
                detached: true,
                stdio: "inherit"
                }
            );
        }
        
      });
      process.exit(99);

      /*

    child = spawn('node', ['app.js']);
    child.stdout.setEncoding('utf8');
    child.stdout.on('data', function (data) {
        var str = data.toString()
        console.log('Child App: '+str);
    });
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', function(data) {
        console.log('Child App ERR: ' + data);
    });
    child.on('close', function (code) {
        console.log("Child App Closed")
        console.log('process exit code ' + code);
    });
    process.exit(0)
    */
}


module.exports = {update}