const moment = require("moment")

function formatDate(d) {
    var m = new moment(d)
    return m.format();
}
module.exports = {formatDate}