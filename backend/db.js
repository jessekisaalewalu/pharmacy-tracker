// Simple SQLite helper: creates DB and table if not exists
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'pharmacies.db');


const db = new sqlite3.Database(dbPath, (err) => {
if (err) return console.error('DB open error', err);
console.log('Connected to SQLite DB at', dbPath);
});


const init = () => {
const sql = `
CREATE TABLE IF NOT EXISTS pharmacies (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL,
contact TEXT,
address TEXT,
latitude REAL,
longitude REAL,
description TEXT,
created_at TEXT DEFAULT (datetime('now','localtime'))
);
`;
db.run(sql);
};


module.exports = { db, init };