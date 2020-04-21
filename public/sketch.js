var socket;
var survivor;
var gameSurvivors = [];
var gameRolls = [];
var gameGerms = [];

var cnv;

function centerCanvas() {
	var x = (windowWidth - width) / 2;
	var y = (windowHeight - height) / 2;
	cnv.position(x, y);
}

function windowResized() {
	centerCanvas();
}

function setup() {
	cnv = createCanvas(900, 600)
	cnv.parent('sketch-holder');
	centerCanvas();
	// CanvasGradient.parent('sketch-holder');
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
	});
}

function draw() {
	background(106);

	// LOCAL PLAYER
	survivor.display();
	survivor.update();
	survivor.displayInfo();
	survivor.getInput();

	// DRAW/UPDATE CONNECTED CLIENTS
	gameSurvivors.forEach(surv => {
		if (surv.id !== socket.id) {
			var themSurvivors = new Survivor(surv.id, surv.name, surv.x, surv.y, surv.size);
			themSurvivors.displayInfo();
			themSurvivors.display();
			themSurvivors.update();
		}
	});

	// DISPLAYS ALL THE TOILET ROLLS ON THE MAP
	gameRolls.forEach(roll => {
		var newRoll = new Roll(roll.id, roll.x, roll.y);
		newRoll.display();
		// console.log(p5.Vector.dist(newRoll.loc, survivor.loc) < survivor.size /2 + newRoll.size /2)
		if (survivor.collect(newRoll)) {
			// console.log("Collected", roll)
			roll.collected = true;
		}
	});

	gameGerms.forEach(germ => {
		var newGerm = new Germ(germ.id, germ.x, germ.y);
		newGerm.display();
		// console.log(p5.Vector.dist(newRoll.loc, survivor.loc) < survivor.size /2 + newRoll.size /2)
		if (survivor.collect(newGerm)) {
			// console.log("Collected", roll)
			germ.collected = true;
		}
	});

	push();
	translate(0, height)
	textSize(20);
	textAlign(LEFT, BOTTOM)
	text("Survivors: " + gameSurvivors.length + " Rolls: " + gameRolls.length, 0, 0);
	pop();

	// SEND MY DATA TO THE SERVER
	socket.emit('update', survivor.data());
	socket.emit('update items', { gameRolls, gameGerms });
	// console.log(survivor.data());
}

// function keyPressed() {
// 	var force = createVector(0, 0);

// 	if (keyIsDown(65)) { // A
// 		force.x = -1;
// 	} else if (keyIsDown(68)) { // D
// 		force.x = 1;
// 	} else {
// 		force.x = 0;
// 	}

// 	if (keyIsDown(87)) { // W
// 		force.y = -1;
// 	} else if (keyIsDown(83)) { // S
// 		force.y = 1;
// 	} else {
// 		force.y = 0;
// 	}

// 	survivor.setDirForce(force);
// 	// console.log(force);
// }

// function keyPressed() {
// 	var force = { x: 0, y: 0 }

// 	// if (keyCode === 65 || keyCode === 68) {

// 	// }

// 	if (keyIsDown(65)) { // A
// 		force.x = -1;
// 	} else if (keyIsDown(68)) { // D
// 		force.x = 1;
// 	}
// 	// else if (!keyIsDown(65) && !keyIsDown(68)){
// 	// 	force.x = 0;
// 	// }

// 	if (keyIsDown(87)) { // W
// 		force.y = 1;
// 	} else if (keyIsDown(83)) { // S
// 		force.y = -1;
// 	} else {
// 		force.y = 0;
// 	}

// 	function keyReleased() {
// 		if (keyCode === 65 || keyCode === 68) {
// 			force.x = 0;
// 		}
// 	}


// 	console.log(force);
// 	// survivor.setDirForce() = force;
// 	// return false;
// }

