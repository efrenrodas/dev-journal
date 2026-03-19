const db = require('../db');

async function getSettings() {
    return db.get('SELECT * FROM settings WHERE id = 1');
}

async function updateSettings(startTime, breakTime, endTime) {
    await db.run('UPDATE settings SET start_time = ?, break_time = ?, end_time = ? WHERE id = 1', [startTime, breakTime, endTime]);
    return getSettings();
}


module.exports = {
    getSettings,
    updateSettings,
};
