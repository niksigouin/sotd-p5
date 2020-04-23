// BASIC INFO FOR PLAYER
function Survivor(id_, name_, x_, y_, size_) {
    this.id = id_;
    this.name = name_;
    this.x = x_;
    this.y = y_;
    this.size = size_;
    this.rolls = 0;
    this.germs = 0;
    this.isAttacked = false;
    this.attack = false;
    this.rot = 0;
    this.attackRange = 0;
    this.mass = 1;
    this.velx = 0,
    this.vely = 0,
    this.totalRolls = 0;
}

function Item(id_, x_, y_) {
    this.id = id_;
    this.x = x_;
    this.y = y_;
    this.collected = false;
}

const Timer = require('./Timer.js')
var express = require('express');
var app = express();
var server = app.listen(process.env.PORT || 3000, listen);
app.use(express.static('public'));
// app.use(express.static('public'));
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
    msg: "Waiting for more players to start...",
    timer: 00,
    round: 0,
    score: ""
}

io.on('connection', function (socket) {
    // HANDLES NEW PLAYERS GETTING CONNECTED
    socket.on('new player', (data) => {
        console.log("Player connected:", socket.id);
        var survivor = new Survivor(socket.id, data.name, data.loc.x, data.loc.y, data.size)
        gameState.survivors.push(survivor);

        // TEST SPAWN ITEMS
        // spawnItemsRandom(100, 100);

        // CHECKS IF ENOUGH PLAYERS TO START THE GAME
        if (enoughPlayers() && gameState.state == false) {
            startGame();
        }
    });

    // HANDLES ALL THE PLAYER MOUVEMENTS AND UPDATES
    socket.on('update', function (data) {
        // socket.broadcast.emit('player', data)
        // console.log(data);
        gameState.survivors.forEach(survivor => {
            if (socket.id == survivor.id) {
                survivor.id = socket.id;
                survivor.x = data.loc.x;
                survivor.y = data.loc.y;
                survivor.size = data.size;
                survivor.rolls = data.rolls
                survivor.germs = data.germs;
                survivor.attack = data.attack;
                survivor.isAttacked = data.isAttacked;
                survivor.rot = data.rot;
                survivor.attackRange = data.attackRange;
                survivor.mass = data.mass;
                survivor.velx = data.velx;
                survivor.vely = data.vely;
                survivor.totalRolls = data.totalRolls;
            }
        });
    });

    // HANDLES ITEMS ON MAP (INTERGRATE INTO UPDATE METHOD INSTEAD OF ALONE)
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
    });

    socket.on('drop rolls', (data) => {
        // console.log(data.x, data.y, data.size);
        // spawnItems();
        spawnRollAround(data.rolls, data.size, data.x, data.y);
        // console.log(data.rolls)
    });

    // HANDLES THE PLAYER DISCONNECT
    socket.on('disconnect', function () {

        console.log('Player disconnected', socket.id);
        gameState.survivors.pop(socket.id)
        // ChECKS IF ENOUGH PLAYERS TO START THE GAME
        // if(!enoughPlayers()){
        //     gameState.state = false;
        // }
    });
});

//SENDS GAME INFO TO THE CLIENTS EVERY FRAME
setInterval(() => {
    io.sockets.emit('state', gameState);
    // console.log(gameState.state)
}, 1 / 60 * 1000);

// METHOD THAT CHECKS IF MINIMUM PLAYERS ARE PLAYING
function enoughPlayers() {
    if (gameState.survivors.length >= 2 && gameState.state == false) {
        // gameState.state = true;
        // startGame();
        return true;
    } else if (gameState.survivors.length < 2 && gameState.state == true) {
        // gameState.state = false;
        return false;
    }
}

// GAME START METHOD
var startGame = function () {
    gameState.round++;
    gameState.state = true;
    var preTimer = new Timer(10);

    var roundOneTimer = new Timer(10);
    var roundTwoTimer = new Timer(10);
    var roundThreeTimer = new Timer(10);

    var postTimer = new Timer(10);

    // Initial
    preTimer.start();

    preTimer.oncount = () => {
        gameState.msg = "Store opening in: " + preTimer.toString();
    }

    preTimer.oncomplete = () => {
        // gameState.round++;
        switch (gameState.round) {
            case 1:
                roundOneTimer.start();
                spawnItemsRandom(10, 10); // AMOUNT OF ITEMS FOR FIRST ROUND
                break;
            case 2:
                roundTwoTimer.start();
                spawnItemsRandom(10, 10); // AMOUNT OF ITEMS FOR SECOND ROUND
                break;
            case 3:
                roundThreeTimer.start();
                spawnItemsRandom(10, 10); // // AMOUNT OF ITEMS FOR THIRD ROUND
                break;
            default:
                break;
        }

    }

    roundOneTimer.oncount = () => {
        gameState.msg = "The store is open!"
        gameState.timer = roundOneTimer.toString();
        // itemSpawner = setInterval(function () { spawnItems(100, 100) }, 1000); //spawnItems(100, 100)
    }

    roundOneTimer.oncomplete = () => {
        getScore();
        clearRolls();
        gameState.msg = "The store is closed! Moving to the second!";
        gameState.items.rolls = [];
        gameState.items.germs = [];
        setTimeout(() => {
            gameState.round++;
            preTimer.start()
        }, 2000)
    }

    roundTwoTimer.oncount = () => {
        gameState.msg = "The store is open!"
        gameState.timer = roundTwoTimer.toString();
        // itemSpawner = setInterval(function () { spawnItems(100, 100) }, 1000); //spawnItems(100, 100)
    }

    roundTwoTimer.oncomplete = () => {
        getScore();
        gameState.msg = "The store is closed! Moving to the last store!";
        gameState.items.rolls = [];
        gameState.items.germs = [];

        clearRolls();

        setTimeout(() => {
            gameState.round++;
            preTimer.start()
        }, 2000)
    }

    roundThreeTimer.oncount = () => {
        gameState.msg = "The store is open!"
        gameState.timer = roundThreeTimer.toString();
        // itemSpawner = setInterval(function () { spawnItems(100, 100) }, 1000); //spawnItems(100, 100)
    }

    roundThreeTimer.oncomplete = () => {
        getScore();
        gameState.round = 0;
        gameState.state = false;
        gameState.msg = "All the stores are closed!";
        gameState.items.rolls = [];
        gameState.items.germs = [];
        setTimeout(() => {
            if (enoughPlayers()) {
                postTimer.start()
            } else if (!enoughPlayers()) {
                gameState.msg = "Waiting for more players to start..."
            }

            // console.log(enoughPlayers())

        }, 2000)
    }

    postTimer.oncount = () => {
        // gameState.round = 0;
        gameState.msg = "Game resarting in " + postTimer.toString();
    };

    postTimer.oncomplete = () => {
        gameState.round = 1;
        preTimer.start();
    }
}

function getScore() {
    var max = gameState.survivors.reduce(function (prev, current) {
        return (prev.totalRolls > current.totalRolls) ? prev : current
    });

    gameState.score = max.id + " is the dubest survivor with " + max.totalRolls + " total rools of TP!"
    console.log(gameState.score);
}

function clearRolls() {
    gameState.survivors.forEach(surv => {
        surv.rolls = [];
    });
}

// METHOD THAT HANDLES SPAWNING ITEMS ON THE MAP RANDOMLY
function spawnItemsRandom(rolls, germs) {
    for (let i = 0; i < rolls; i++) {
        var id = getRandomId();
        var newRoll = new Item(id, getRandomInt(1280), getRandomInt(720));
        gameState.items.rolls.push(newRoll);
    }

    for (let i = 0; i < germs; i++) {
        var id = getRandomId();
        var newGerm = new Item(id, getRandomInt(1280), getRandomInt(720));
        gameState.items.germs.push(newGerm);
    }
}

// METHOD THAT HANDLES SPAWNING ROLLS ON THE MAP PRECISELY (SQUARE CORNER SPAWNING ISH)
function spawnRollAround(rolls, size, x, y) {
    var range = size * 1.5;
    var buffer = size * 3;

    for (let i = 0; i < rolls; i++) {
        var id = getRandomId();

        var randX = (x + (random((size / 2) + buffer, range) * random(-1, 1)));
        var randY = (y + (random((size / 2) + buffer, range) * random(-1, 1)));

        var newRoll = new Item(id, randX, randY);
        gameState.items.rolls.push(newRoll);
    }
}

// GENERATES RANDOM INTEGER
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

// GENERATES RANDOM ID FROM INT
function getRandomId() {
    return Math.floor(Math.random() * 90000) + 10000;
}

// GENERATES RANDOM NUMBER FROM MIN AND MAX
function random(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    var output = Math.floor(Math.random() * (max - min)) + min;
    if (output === 0) {
        return output + 1;
    } else {
        return output;
    }

}