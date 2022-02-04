const moment = require("moment")

function formatDate(d) {
    var m = new moment(d)
    return m.format(""dddd, MMMM Do YYYY, h:mm:ss a");
}
module.exports = {formatDate}