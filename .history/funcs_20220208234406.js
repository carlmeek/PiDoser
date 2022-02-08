const moment = require("moment")

function formatDate(d) {
    var m = new moment(d)
    return m.format("Do MMMM YYYY, HH:mm:ss");
}
function ago(d) {
    var m = new moment(d)
    var n = new moment(new Date())
    var secs = n.diff(m, 'seconds');
    if secs>60
    return secs + " Seconds Ago"
}
module.exports = {formatDate,ago}