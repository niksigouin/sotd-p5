var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
    // Gets random ID for connected user
    var user = Math.floor(Math.random() * 90000) + 10000;

    //Adds user ID to list and prints it
    console.log("connected", socket.id);
    

    

    // Disconnects player when the leave the web page
    socket.on('disconnect', function () {
        // Removes disconnected user from list
        console.log("disconnected");
    });
});

http.listen(8080, function () {
    console.log('Connect to localhost');
});