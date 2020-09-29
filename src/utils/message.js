const moment = require('moment')

function generateMessage(text, username = 'System') {
    const timestamp = Date.now()
    return {
        text,
        username,
        createdAt: moment(timestamp).format('h:mm:ss a'),
        timestamp
    }
}

module.exports = {
    generateMessage
}