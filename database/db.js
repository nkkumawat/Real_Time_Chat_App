/**
 * Created by sonu on 2/7/17.
 */


var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: ""
});
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");

    con.query("CREATE DATABASE IF NOT EXISTS NodeDataBase", function (err, result) {
        if (err) throw err;
        console.log("Database created");
    });
});


module.exports = con.connection;