const sqlite3 = require('better-sqlite3');

const db = new sqlite3('/var/data/database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err)
        console.error("Failed to create/open DB file. " + err);
    else
        console.log("Successfully created/opened DB file.");
});

init_database();

function init_database()
{
    db.exec(`CREATE TABLE IF NOT EXISTS Keys (
        entry_id INTEGER PRIMARY KEY AUTOINCREMENT,
        location_id TEXT UNIQUE NOT NULL,
        refresh_token TEXT NOT NULL
        );`);
}

function add_refresh_token(location_id, refresh_token) {
    db.prepare(`INSERT INTO Keys VALUES (NULL, ?, ?)`).run(location_id, refresh_token);
}

function get_refresh_token(location_id) {
    return db.prepare(`SELECT * FROM Keys WHERE location_id = ?`).bind(location_id).get();
}

module.exports = { init_database, add_refresh_token, get_refresh_token };