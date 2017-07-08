/**
 * Created by sonu on 7/7/17.
 */
var express         = require('express');
var path            = require('path');
var app             = express();
var server          = require('http').createServer(app);
var io              = require('socket.io').listen(server);
var bodyParser      = require('body-parser');
// ======================Mysql DataBase ========================
var mysql           = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "NodeDataBase"
});
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});
// =========================================================
users = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log("Server Runnig.. on port 3000");
app.use(express.static(path.join(__dirname, 'www')));
app.get('/' , function (req , res) {
    res.sendFile(__dirname + 'www/index.html')
})

// ===================================Sockets starts  =========================
io.sockets.on('connection' , function (socket) {
    connections.push(socket);
    console.log("Connected:  %s Socket running" , connections.length);
    

// ====================Disconnect==========================================
    socket.on('disconnect' , function (data) {
        connections.splice(connections.indexOf(data), 1);
        console.log('Disconnected : %s sockets running' , connections.length);
    })

// ==================initilize data and show================================

    socket.on('initial-messages' , function (data) {
        var sql = "SELECT message FROM message ";
        con.query(sql, function (err, result , fields) {
            // if (err) {
            //     callback("error", err)
            // } else {
            //     callback("success", result)
            // }
            var jsonMessages = JSON.stringify(result);
            io.sockets.emit('initial-message' , {msg : jsonMessages});
        });
    })

//   ============== Send and Save Messages=====================================
    
    socket.on('send-message' , function (data) {
        var sql = "INSERT INTO message (message) VALUES ('" + data + "')";
        con.query(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");
        });
        io.sockets.emit('new-message' , {msg : data});
    })

});




