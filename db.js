'use strict';

const sqlite = require('sqlite3').verbose();

const DBSOURCE = './groundart.db';

const db = new sqlite.Database(DBSOURCE, (err) => {
    if (err) {
        // cannot open database
        console.err(err.message);
        throw err;
    } else console.log('Database opened correctly');
});

db.exec('PRAGMA foreign_keys = ON;', function(err) {
    if (err) {
        console.error("Pragma statement didn't work.");
        throw err;
    } else console.log('Foreign keys turned on');
});

module.exports = db;