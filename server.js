// BASIC INFO FOR PLAYER
function Survivor(id_, name_, x_, y_, size_) {
    this.id = id_;
    this.name = name_;
    this.x = x_;
    this.y = y_;
    this.size = size_;
    this.rolls;
    this.germs;
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
    state: false,
    survivors: [],
    items: {
        rolls: [],
        germs: []
    },
    map: 0,
    msg: "Not enough players"
}

io.on('connection', function (socket) {
    // enoughPlayers();
    // HANDLES NEW PLAYERS GETTING CONNECTED
    socket.on('new player', (data) => {
        console.log("Player connected:", socket.id);
        var survivor = new Survivor(socket.id, data.name, data.loc.x, data.loc.y, data.size)
        gameState.survivors.push(survivor);
        // ChECKS IF ENOUGH PLAYERS TO START THE GAME
        enoughPlayers();
    });

    // HANDLES ALL THE PLAYER MOUVEMENTS AND UPDATES
    socket.on('update', function (data) {
        // socket.broadcast.emit('player', data)
        // console.log(data);
        gameState.survivors.forEach(survivor => {
            if (socket.id == survivor.id) {
                survivor.x = data.loc.x;
                survivor.y = data.loc.y;
                survivor.size = data.size;
                survivor.rolls = data.rolls
                survivor.germs = data.germs;
            }
        });
    });


    socket.on('update items', (data) => {
        // console.log(data.gameRolls)
        // CHECKS THE PROPERTIES OF SAID ITEM
        for (const roll in gameState.items.rolls) {
            if (gameState.items.rolls.hasOwnProperty(roll)) {
                const e = gameState.items.rolls[roll];
                for (const rolld in data.gameRolls) {
                    if (data.gameRolls.hasOwnProperty(rolld)) {
                        const f = data.gameRolls[rolld];
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

        for (const germ in gameState.items.germs) {
            if (gameState.items.germs.hasOwnProperty(germ)) {
                const e = gameState.items.germs[germ];
                for (const germd in data.gameGerms) {
                    if (data.gameGerms.hasOwnProperty(germd)) {
                        const f = data.gameGerms[germd];
                        if (e.id == f.id) {
                            e.collected = f.collected;
                            if (e.collected) {
                                gameState.items.germs.splice(germ, 1);
                            }
                        }
                    }
                }
            }
        }
    })

    // HANDLES THE PLAYER DISCONNECT
    socket.on('disconnect', function () {
        
        console.log('Player disconnected', socket.id);
        gameState.survivors.pop(socket.id)
        // ChECKS IF ENOUGH PLAYERS TO START THE GAME
        enoughPlayers();
    });
});

//SENDS GAME INFO TO THE CLIENTS EVERY 33 ms
setInterval(() => {
    io.sockets.emit('state', gameState);
}, 33);

var itemSpawner;

var startGame = function () {
    console.log("YES")
    gameState.msg = "May the dumbest win!"
    itemSpawner = setInterval(function () { spawnItems(100, 100) }, 1000); //spawnItems(100, 100)
}

var stopGame = () => {
    console.log("NO")
    gameState.msg = "Not enough players!";
    clearInterval(itemSpawner);
    gameState.items.rolls = [];
    gameState.items.germs = [];
}

function enoughPlayers(){
    if (gameState.survivors.length >= 2) {
        gameState.state = true;
        startGame();
        return true;
    } else {
        gameState.state = false;
        stopGame();
        return false;
    }
}

// SPAWN ITEMS ON THE MAP
function spawnItems(rolls, germs) {
    // SPAWNS NEW TOILET ROLLS INTO THE GAME
    if (gameState.items.rolls.length < rolls) {
        var id = getRandomId();
        var newRoll = new Item(id, getRandomInt(600), getRandomInt(600));
        gameState.items.rolls.push(newRoll);
    }

    if (gameState.items.germs.length < germs) {
        var id = getRandomId();
        var newGerm = new Item(id, getRandomInt(600), getRandomInt(600));
        gameState.items.germs.push(newGerm);
    }
    console.log("SPAWNING ITEMS")
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function getRandomId() {
    return Math.floor(Math.random() * 90000) + 10000;
}