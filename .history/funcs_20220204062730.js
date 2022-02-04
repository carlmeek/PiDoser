const moment = require("moment")

function formatDate(d) {
    var m = new moment(d)
    return m.format("Do MMMM YYYY, HH:mm:ss");
}
module.exports = {formatDate}