/**
 * Created by sonu on 7/7/17.
 */
var express         = require('express');
var path            = require('path');
var app             = express();
var server          = require('http').Server(app);
var io              = require('socket.io')(server);
var bodyParser      = require('body-parser');
var session = require('express-session');
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
var username;



app.use(express.static(path.join(__dirname, 'www')));
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: true}));
app.use(session({secret: 'tom-riddle'}));


app.get('/' , function (req , res) {
    authenticate(req , res);
});

app.get('/chat_start' , function (req , res) {
    authenticate(req , res);
});


app.get('/login' , function (req , res) {
    authenticate(req , res);
});

app.post('/login' , function (req , res) {
    login(req , res);
});
app.get('/logout', function (req, res) {
    delete req.session.user;
    res.redirect('/login');
});

function chat_start() {
// ===================================Sockets starts  =========================
    io.sockets.on('connection', function (socket) {
        connections.push(socket);
        console.log("Connected:  %s Socket running", connections.length);
// ====================Disconnect==========================================
        socket.on('disconnect', function (data) {
            connections.splice(connections.indexOf(data), 1);
            console.log('Disconnected : %s sockets running', connections.length);
        });
// ==================initilize data and show================================
        socket.on('initial-messages', function (data) {
            var sql = "SELECT * FROM message ";
            con.query(sql, function (err, result, fields) {
                var jsonMessages = JSON.stringify(result);
                // console.log(jsonMessages);
                io.sockets.emit('initial-message', {msg: jsonMessages});
            });
        });
        socket.on('username', function (data) {
            io.sockets.emit('username', {username: username});
        });

//   ============== Send and Save Messages=====================================
        socket.on('send-message', function (data) {
            var sql = "INSERT INTO message (message , user) VALUES ('" + data+ "' , '"+username+"')";
            con.query(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
            });
            io.sockets.emit('new-message', {msg: data , username : username});
        })
    })
}
chat_start();


function login(req,res){
    var post = req.body;
     username  = post.user;
    var password = post.password;
    console.log(username);
    var sql = "SELECT * FROM login WHERE username='" + username+"'";
    con.query(sql, function (err, result, fields) {
        var jsonString = JSON.stringify(result);
        var jsonData = JSON.parse(jsonString);
        if(jsonData[0].password === password) {
            console.log("User Identified");
            req.session.user = post.user;
            username = post.user;
            res.redirect("/chat_start");
        }else  {
            console.log("user not Identified");
            res.redirect("/login");
        }
    })
}

function authenticate(req,res){
    console.log("authenticate called");
    if (!req.session.user) {
        res.sendFile(__dirname + '/www/login.html');
    }
    else {
        console.log(req.session.user);
        username = req.session.user;
        res.sendFile(__dirname + '/www/chat.html');
    }
}
server.listen(3000, function(){
    console.log('listening on *:3000');
});



