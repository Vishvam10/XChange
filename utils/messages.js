const moment = require('moment');

function formatMessage(username, textMsg) {
    return {
        username, 
        textMsg,
        time: moment().format('h:mm a')
    }
}

module.exports = formatMessage;