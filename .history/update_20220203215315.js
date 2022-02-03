
function update() {

    function restartApp(req, res)
    {
        console.log("Spawning GIT PULL...")
        spawn('git', ['pull']);
        console.log("Spawning GIT PULL...")
        child.kill();
        startApp();
        res.send('ok.');
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