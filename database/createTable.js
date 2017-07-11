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

    var sql = "CREATE TABLE IF NOT EXISTS  message (id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, message VARCHAR(2550) , user VARCHAR(250))";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("message Table created");
    });
    var sql = "CREATE TABLE IF NOT EXISTS  login (id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, username VARCHAR(250) , password VARCHAR(250))";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("login Table created");
    });




});


module.exports = con.connection;
