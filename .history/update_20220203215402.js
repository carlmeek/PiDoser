
function update() {

    console.log("Spawning GIT PULL...")
    spawn('git', ['pull']);

    console.log("Killing Child App...")
    child.kill();

    console.log("Starting App...")
    startApp();
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
}


module.exports = {update}