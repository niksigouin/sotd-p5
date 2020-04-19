var socket;
var survivor;
var gameSurvivors = [];
var gameRolls = [];
var gameGerms = [];
var itemHandler 


function setup() {
	createCanvas(600, 600);
	// Connects to the game
	socket = io.connect();
	survivor = new Survivor(socket.id, "", windowHeight / 2, windowHeight / 2, 50)
	
	socket.emit('new player', survivor.data());
	
	

	// thatRoll = new ToiletRoll(width/2, height/2);
	// ITEMS
	// ih.displayRolls();
	itemHandler = new ItemHandler();
	// itemHandler.spawnRolls(10);
	// itemHandler.spawnGerms(10);

	// ### IF NOT ALREADY IN THE LIST CREATE A NEW PLAYER INSTANCE
	// ### MAYBE USE A CLASS INSTANCE IN THE SERVER FILE IT SELF?? (CHECK ONLINE GAME)
	socket.on('state', (data) => {
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
	// itemHandler.displayRolls();
	// itemHandler.displayGerms();

	// DRAW/UPDATE CONNECTED CLIENTS
	gameSurvivors.forEach(surv => {
		if (surv.id !== socket.id) {
			var themSurvivors = new Survivor(surv.id, surv.name, surv.x, surv.y, surv.size);
			themSurvivors.display();
			themSurvivors.update();
		}
	});

	gameRolls.forEach(roll => {
		var newRoll = new ToiletRoll(roll.x, roll.y);
		newRoll.display();
		// newRoll.update();
	});

	gameGerms.forEach(germ => {
		var newGerm = new Germ(germ.x, germ.y);
		newGerm.display();
		// newRoll.update();
	});

	

	push();
	translate(0, height)
	textSize(20);
	textAlign(LEFT, BOTTOM)
	text("Survivors: " + gameSurvivors.length + " Rolls: " + gameRolls.length, 0, 0);
	pop();
	
	// SEND MY DATA TO THE SERVER
	socket.emit('update', survivor.data());
	// console.log(survivor.data());
}
