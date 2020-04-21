var socket;
var survivor;
var gameSurvivors = [];
var gameRolls = [];
var gameGerms = [];
var gameState;
var gameMessage;
var gameTimer;
var gameRound;

var cnv;

function centerCanvas() {
	var x = (windowWidth - width) / 2;
	var y = (windowHeight - height) / 2;
	cnv.position(x, y);
}

// function windowResized() {
// 	centerCanvas();
// }

function setup() {
	cnv = createCanvas(1280, 720)
	cnv.parent('sketch-holder');
	// centerCanvas();
	// Connects to the game
	socket = io.connect();
	survivor = new Survivor(socket.id, "", windowHeight / 2, windowHeight / 2, 50)

	socket.emit('new player', survivor.data());

	// ### IF NOT ALREADY IN THE LIST CREATE A NEW PLAYER INSTANCE
	// ### MAYBE USE A CLASS INSTANCE IN THE SERVER FILE IT SELF?? (CHECK ONLINE GAME)
	socket.on('state', (data) => {
		// console.log(data)
		gameSurvivors = data.survivors;
		gameRolls = data.items.rolls;
		gameGerms = data.items.germs;
		gameState = data.state;
		gameMessage = data.msg;
		gameTimer = data.timer;
		gameRound = data.round;
	});
}

function draw() {
	background(106);
	gameUI();

	// LOCAL PLAYER
	survivor.display();
	survivor.update();
	survivor.displayInfo();
	survivor.getInput();
	// survivor.sneeze();

	// DRAW/UPDATE CONNECTED CLIENTS
	gameSurvivors.forEach(surv => {
		if (surv.id !== socket.id) {
			var themSurvivors = new Survivor(surv.id, surv.name, surv.x, surv.y, surv.size);
			themSurvivors.rolls.length = surv.rolls;
			themSurvivors.germs.length = surv.germs;
			themSurvivors.attackRange = surv.attackRange;
			themSurvivors.attack = surv.attack;
			themSurvivors.isAttacked = surv.isAttacked;
			themSurvivors.rot = surv.rot;

			
			themSurvivors.displayInfo();
			themSurvivors.display();
			themSurvivors.update();

			survivor.checkAttacked(surv);
		}
	});

	// DISPLAYS ALL THE TOILET ROLLS ON THE MAP
	gameRolls.forEach(roll => {
		var newRoll = new Roll(roll.id, roll.x, roll.y);
		newRoll.display();
		if (survivor.collect(newRoll)) {
			roll.collected = true;
		}
	});

	gameGerms.forEach(germ => {
		var newGerm = new Germ(germ.id, germ.x, germ.y);
		newGerm.display();
		if (survivor.collect(newGerm)) {
			germ.collected = true;
		}
	});

	// SEND MY DATA TO THE SERVER
	// #### MAKE THE UPDATE CONTAIN ONE OBJECT ARRAY
	socket.emit('update', survivor.data());
	socket.emit('update items', { gameRolls, gameGerms });
	// console.log(survivor.data());
}

function gameUI() {
	// PLAYER AND ITEM INFO
	push();
	translate(0, height)
	textSize(20);
	textAlign(LEFT, BOTTOM)
	text("Survivors: " + gameSurvivors.length + " Rolls: " + gameRolls.length, 0, 0);
	textAlign(RIGHT, BOTTOM)
	text(gameState, width, 0);
	pop();

	// GAME MESSAGE
	push();
	translate(width / 2, 20);
	textAlign(CENTER, TOP);
	textSize(20);
	text(gameMessage, 0, 0);
	pop();

	// GAME TIMER
	push();
	translate(width, 0);
	textAlign(RIGHT, TOP)
	textSize(20);
	var timer = "Store is closing in: " + gameTimer;
	text(timer, -20, 20)
	pop();

	// GAME ROUND
	push();
	translate(0, 0);
	textAlign(LEFT, TOP)
	textSize(20);
	var round = "Store " + gameRound + " of 3";
	text(round, 20, 20)
	pop();
}

function keyPressed() {
	if (keyCode == 32) {
		survivor.sneeze();
	}
}