const moment = require("moment")

function formatDate(d) {
    var m = new moment(d)
    return m.format("Do MMMM YYYY, HH:mm:ss");
}
function ago(d) {
    var m = new moment(d)
    var n = new moment(new Date())
    var secs = n.diff(m, 'seconds');
    if (secs>3600) {
        return Math.round(secs/60/60,0) + " Minutes Ago"
    } else if (secs>60) {
        return Math.round(secs/60,0) + " Minutes Ago"
    } else {
        return secs + " Seconds Ago"
    }
}
module.exports = {formatDate,ago}