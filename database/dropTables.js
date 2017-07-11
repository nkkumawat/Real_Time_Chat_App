/**
 * Created by sonu on 11/7/17.
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

    var sql= "DROP TABLE message";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("table removed");
    });
});

