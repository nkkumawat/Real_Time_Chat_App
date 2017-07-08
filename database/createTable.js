/**
 * Created by sonu on 2/7/17.
 */

var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "NodeDataBase"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");

    var sql = "CREATE TABLE IF NOT EXISTS  message (id INTEGER(10), message VARCHAR(2550))";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Table created");
    });


});


module.exports = con.connection;
