// BASIC INFO FOR PLAYER
function Survivor(id_, name_, x_, y_, size_) {
    this.id = id_;
    this.name = name_;
    this.x = x_;
    this.y = y_;
    this.size = size_;
}

var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 3000, listen);
app.use(express.static('public'));
app.use(express.static('public'));
var io = require('socket.io')(server);

function listen() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening at http://' + host + ':' + port);
}

// PLAYERS IN GAME
var survivors = [];

io.on('connection', function (socket) {
    // HANDLES NEW PLAYERS GETTING CONNECTED
    socket.on('new player', (data) => {
        console.log("New player!", socket.id);
        var survivor = new Survivor(socket.id, data.name, data.loc.x, data.loc.y, data.size)
        survivors.push(survivor);
    });

    // HANDLES ALL THE PLAYER MOUVEMENTS AND UPDATES
    socket.on('update', function (data) {
        survivors.forEach(survivor => {
            if (socket.id == survivor.id) {
                survivor.x = data.loc.x;
                survivor.y = data.loc.y;
                survivor.size = data.size;
            }
        });
    });

    // HANDLES THE PLAYER DISCONNECT
    socket.on('disconnect', function () {
        console.log('Client has disconnected');
        survivors.pop(socket.id)
    });
});

//SENDS PLAYER LIST TO CLIENTS
setInterval(() => {
    io.sockets.emit('state', survivors);
}, 1000 / 60);
