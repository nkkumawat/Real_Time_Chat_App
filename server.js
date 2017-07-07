/**
 * Created by sonu on 7/7/17.
 */
var express = require('express');
var path = require('path');
var app = express();
var server = require('http').createServer(app);

var io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 3000);

console.log("Server Runnig.. on port 3000");


app.use(express.static(path.join(__dirname, 'www')));
app.get('/' , function (req , res) {
    res.sendFile(__dirname + 'www/index.html')
})


io.sockets.on('connection' , function (socket) {
    connections.push(socket);
    console.log("Connected:  %s Socket running" , connections.length);
    
    
    //Disconnect
    socket.on('disconnect' , function (data) {
        connections.splice(connections.indexOf(data), 1);
        console.log('Disconnected : %s sockets running' , connections.length);
    })
    
//    Send Message
    
    socket.on('send-message' , function (data) {
        io.sockets.emit('new-message' , {msg : data});
    })


    
});




