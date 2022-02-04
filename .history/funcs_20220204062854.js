const moment = require("moment")

function formatDate(d) {
    var m = new moment(d)
    return m.format("Do MMMM YYYY, HH:mm:ss");
}
function ago(d) {
    var m = new moment(d)
    var n = new moment(new Date())
    var diffInMinutes = n.diff(m, 'minutes');
}
module.exports = {formatDate}