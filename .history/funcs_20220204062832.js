const moment = require("moment")

function formatDate(d) {
    var m = new moment(d)
    return m.format("Do MMMM YYYY, HH:mm:ss");
}
function ago(d)
module.exports = {formatDate}