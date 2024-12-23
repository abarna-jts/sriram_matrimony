// models/database.js
const mysql = require('mysql2');
require('dotenv').config();
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERS,
    password: process.env.DB_PASSWORD|| "",
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to the database');
    }
});
const promiseDb = db.promise();
module.exports = promiseDb;
