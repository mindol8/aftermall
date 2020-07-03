var mysql = require('mysql2');
var connection = mysql.createConnection({
    host:'127.0.0.1',
    port:3306,
    user:'admin',
    password:'autoin1020#',
    database:'autoinmall'
});

module.exports = connection;