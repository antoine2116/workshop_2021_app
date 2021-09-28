let mysql = require('mysql');
exports.db = mysql.createConnection({
    host     : 'localhost',
    user     : 'keil6704_admin',
    password : '1aqw2zsx3edc',
    database : 'keil6704_chat'
});
