const moment = require("moment")

function formatDate(d) {
    var m = new moment(d)
    return m.format("Do MMMM YYYY, HH:mm:ss");
}
function ago(d,shortformat,noago) {
    var m = new moment(d)
    var n = new moment(new Date())
    var secs = n.diff(m, 'seconds');
    if (secs>86400) {
        return Math.round(secs/86400,0) + " Days"+(noago?"":" Ago")
    } else if (secs>3600) {
        return Math.round(secs/3600,0) + " Hours"+(noago?"":" Ago")
    } else if (secs>60) {
        return Math.round(secs/60,0) + " "+(shortformat?'Mins':'Minutes')+(noago?"":" Ago")
    } else {
        return secs + " "+(shortformat?'Secs':'Seconds')+(noago?"":" Ago")
    }
}
module.exports = {formatDate,ago}