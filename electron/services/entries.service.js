const db = require('../db');


function getActiveEntry() {
    return db.prepare("SELECT * FROM entries WHERE status = 'in_progress'").get();
}

function getEntries(timeframe = 'day') {
    const timeframeFilter = {
        day: "datetime(hour_init) >= datetime('now', 'localtime', 'start of day')",
        week: "datetime(hour_init) >= datetime('now', 'localtime', '-6 days', 'start of day')",
        month: "datetime(hour_init) >= datetime('now', 'localtime', 'start of month')"
    };

    const whereClause = timeframeFilter[timeframe] || timeframeFilter.day;

    return db
        .prepare(`
            SELECT id, text, hour_init, hour_end, status
            FROM entries
            WHERE ${whereClause}
            ORDER BY datetime(hour_init) DESC
        `)
        .all();
}

function completeActiveEntry() {
    db.prepare("UPDATE entries SET status = 'completed', hour_end = CURRENT_TIMESTAMP WHERE status = 'in_progress'").run();
}

function startEntry(text) {
    completeActiveEntry();
    const info = db.prepare("INSERT INTO entries (text) VALUES (?)").run(text);
    return db.prepare('SELECT * FROM entries WHERE id = ?').get(info.lastInsertRowid);
}

module.exports = {
    getActiveEntry,
    getEntries,
    completeActiveEntry,
    startEntry
};
