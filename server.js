// BASIC INFO FOR PLAYER
function Survivor(id_, name_, x_, y_, size_) {
    this.id = id_;
    this.name = name_;
    this.x = x_;
    this.y = y_;
    this.size = size_;
}

function Item(x_, y_) {
    this.x = x_;
    this.y = y_;
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
var gameState = {
    survivors: [],
    items: {
        rolls: [],
        germs: []
    }
}
var survivors = [];

io.on('connection', function (socket) {
    // HANDLES NEW PLAYERS GETTING CONNECTED
    socket.on('new player', (data) => {
        console.log("New player!", socket.id);
        var survivor = new Survivor(socket.id, data.name, data.loc.x, data.loc.y, data.size)
        gameState.survivors.push(survivor);
    });

    // HANDLES ALL THE PLAYER MOUVEMENTS AND UPDATES
    socket.on('update', function (data) {
        gameState.survivors.forEach(survivor => {
            if (socket.id == survivor.id) {
                survivor.x = data.loc.x;
                survivor.y = data.loc.y;
                survivor.size = data.size;
            }
        });

        gameState.items.rolls.forEach(roll => {

        })
    });

    // HANDLES THE PLAYER DISCONNECT
    socket.on('disconnect', function () {
        console.log('Client has disconnected');
        survivors.pop(socket.id)
    });
});

//SENDS PLAYER LIST TO CLIENTS
setInterval(() => {
    // io.sockets.emit('state', gameState.survivors);
    io.sockets.emit('state', gameState);
}, 1000 / 60);

var itemSpawner = setInterval(() => {
    if(gameState.items.rolls.length < 5){
        // console.log("ADDING")
        var newRoll = new Item(getRandomInt(600), getRandomInt(600))
        gameState.items.rolls.push(newRoll);
    }

    if(gameState.items.germs.length < 5){
        var newGerm = new Item(getRandomInt(600), getRandomInt(600));
        gameState.items.germs.push(newGerm);
    }
}, 1000 / 60);

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}