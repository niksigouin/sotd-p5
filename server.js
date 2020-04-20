// BASIC INFO FOR PLAYER
function Survivor(id_, name_, x_, y_, size_) {
    this.id = id_;
    this.name = name_;
    this.x = x_;
    this.y = y_;
    this.size = size_;
}

function Item(id_, x_, y_) {
    this.id = id_;
    this.x = x_;
    this.y = y_;
    this.collected = false;
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
// var survivors = [];

io.on('connection', function (socket) {
    // HANDLES NEW PLAYERS GETTING CONNECTED
    socket.on('new player', (data) => {
        console.log("New player!", socket.id);
        var survivor = new Survivor(socket.id, data.name, data.loc.x, data.loc.y, data.size)
        gameState.survivors.push(survivor);
    });

    // HANDLES ALL THE PLAYER MOUVEMENTS AND UPDATES
    socket.on('update', function (data) {
        // console.log(data);
        // socket.broadcast.emit('player', data)
        gameState.survivors.forEach(survivor => {
            if (socket.id == survivor.id) {
                survivor.x = data.loc.x;
                survivor.y = data.loc.y;
                survivor.size = data.size;
            }
        });


    });


    socket.on('update items', (data) => {
        // CHECKS THE PROPERTIES OF SAID ITEM
        for (const roll in gameState.items.rolls) {
            if (gameState.items.rolls.hasOwnProperty(roll)) {
                const e = gameState.items.rolls[roll];
                for (const rolld in data) {
                    if (data.hasOwnProperty(rolld)) {
                        const f = data[rolld];
                        if (e.id == f.id) {
                            e.collected = f.collected;
                            if (e.collected) {
                                gameState.items.rolls.splice(roll, 1);
                            }
                        }
                    }
                }
            }
        }
    })

    // HANDLES THE PLAYER DISCONNECT
    socket.on('disconnect', function () {
        console.log('Client has disconnected');
        gameState.survivors.pop(socket.id)
        // console.log(gameState.survivors);
    });
});

//SENDS PLAYER LIST TO CLIENTS
setInterval(() => {
    // io.sockets.emit('state', gameState.survivors);
    io.sockets.emit('state', gameState);
}, 33);

var itemSpawner = setInterval(() => {
    // SPAWNS NEW TOILET ROLLS INTO THE GAME
    if (gameState.items.rolls.length < 5) {
        var id = getRandomId();
        var newRoll = new Item(id, getRandomInt(600), getRandomInt(600));
        gameState.items.rolls.push(newRoll);
    } 
    
    if (gameState.items.germs.length < 5) {
        var id = getRandomId();
        var newGerm = new Item(id, getRandomInt(600), getRandomInt(600));
        gameState.items.germs.push(newGerm);
    }

}, 500);

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function getRandomId() {
    return Math.floor(Math.random() * 90000) + 10000;
}