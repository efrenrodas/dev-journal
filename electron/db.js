const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(process.cwd(), 'dev-journal.db');
let dbPromise;

function getConnection() {
    if (!dbPromise) {
        dbPromise = new Promise((resolve, reject) => {
            const db = new sqlite3.Database(dbPath, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(db);
            });
        });
    }
    return dbPromise;
}

async function run(sql, params = []) {
    const db = await getConnection();
    return new Promise((resolve, reject) => {
        db.run(sql, params, function onRun(err) {
            if (err) {
                reject(err);
                return;
            }
            resolve({ lastID: this.lastID, changes: this.changes });
        });
    });
}

async function get(sql, params = []) {
    const db = await getConnection();
    return new Promise((resolve, reject) => {
        db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row);
        });
    });
}

async function all(sql, params = []) {
    const db = await getConnection();
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
}

async function init() {
    await run(`
        CREATE TABLE IF NOT EXISTS entries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT NOT NULL,
            hour_init DATETIME DEFAULT CURRENT_TIMESTAMP,
            hour_end DATETIME,
            status TEXT DEFAULT 'in_progress'
        )
    `);

    await run(`
        CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            start_time TEXT DEFAULT '08:00',
            break_time TEXT DEFAULT '12:00',
            end_time TEXT DEFAULT '17:00'
        )
    `);

    await run(`
        INSERT OR IGNORE INTO settings (id, start_time, break_time, end_time)
        VALUES (1, '08:00', '12:00', '17:00')
    `);
}

module.exports = {
    init,
    run,
    get,
    all
};