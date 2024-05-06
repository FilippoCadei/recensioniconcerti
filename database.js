const mysql = require('mysql2');
const { HOST, USERNAME, PASSWORD, DBNAME, PORT } = process.env;
console.log();
const connpool = mysql.createPool({
    host: "10.20.2.174",
    user: "tps",
    password: "ttppss",
    database: "recensioniconcerti"
}, { debug: true });

connpool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('Db is connected - The solution is: ', results[0].solution);
});


module.exports = connpool;