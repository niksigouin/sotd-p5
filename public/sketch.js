var socket;
var survivor;
var survivors = [];


function setup() {
	createCanvas(600, 600);
	// Connects to the game
	socket = io.connect();
	survivor = new Survivor(socket.id, "", windowHeight / 2, windowHeight / 2, 50)
	
	socket.emit('new player', survivor.data());
	
	// ### IF NOT ALREADY IN THE LIST CREATE A NEW PLAYER INSTANCE
	// ### MAYBE USE A CLASS INSTANCE IN THE SERVER FILE IT SELF?? (CHECK ONLINE GAME)
	socket.on('state', (data) => {
		survivors = data;
	});
	
}

function draw() {
	background(106);

	// LOCAL PLAYER
	survivor.display();
	survivor.update();

	// DRAW/UPDATE CONNECTED CLIENTS
	survivors.forEach(surv => {
		if (surv.id !== socket.id) {
			var themSurvivors = new Survivor(surv.id, surv.name, surv.x, surv.y, surv.size);
			themSurvivors.display();
			themSurvivors.update();
		}
	});

	push();
	translate(0, height - 50)
	textSize(40);
	textAlign(LEFT, BOTTOM)
	text(survivors.length, 0, 0);
	pop();
	
	// SEND MY DATA TO THE SERVER
	socket.emit('update', survivor.data())
	// console.log(survivor.data());
}
