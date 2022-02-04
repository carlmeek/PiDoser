const moment = require("moment")

function formatDate(d) {
    var m = new moment(d)
    return m.format("LLL");
}
module.exports = {formatDate}