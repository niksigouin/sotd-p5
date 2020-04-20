var socket;
var survivor;
var gameSurvivors = [];
var gameRolls = [];
var gameGerms = [];


function setup() {
	createCanvas(600, 600);
	// Connects to the game
	socket = io.connect();
	survivor = new Survivor(socket.id, "", windowHeight / 2, windowHeight / 2, 50)

	socket.emit('new player', survivor.data());


	// itemHandler = new ItemHandler();
	// itemHandler.spawnRolls(10);
	// itemHandler.spawnGerms(10);

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
	socket.emit('update items', gameRolls);
	// console.log(survivor.data());
}