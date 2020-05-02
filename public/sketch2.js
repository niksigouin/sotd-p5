/*
 * Titre: EDM4600 Travail final: "Survival of the dumbest"
 * Auteur: Nikolas Sigouin
 * Version: 0.1.5
 * Instructions: [WASD] pour bouger le personnage et [ESPACE] pour attacker.
 * Description du projet
 * Notes: Ce jeu encore en developpement, donc beaucoup de fonctionnalité est encore a venir.
 * 			De plus, il y a enocre beaucoup de bug (problemes de collision, etc)
 * Lien: https://sotd-p5.herokuapp.com/.
 */

// SURVER SHIT
var socket;
var gameState;

// LOCAL SURVIVOR INSTANCE
var survivor;
var canvas;

// MAP
var thisMap;

function setup() {
    canvas = createCanvas(1280, 720);
    canvas.parent('sketch-holder');
    socket = io.connect();

    // HOOKS MESSAGE EVENT FOR GAMESTATE UPDATE
    socket.on('state', (data) => {
        gameState = data;
        // console.log(gameState)
    });

    // DISPLAY CURRENT MAP
    thisMap = new map0();

    // CREATES PLAYER INSTANCE
    survivor = new player("ID", "NAME", width / 2, height / 2, 50);
}

function draw() {
    background(106);

    // DISPLAY MAP
    thisMap.display();

    
    

    // IF USER IS ACTIVE (HAS JOINED), DISPLAY AND UPDATE PLAYER ON SCREEN
    if (survivor.active) {
        survivor.display();
        survivor.update();
        // survivor.getInput();
    }
    // socket.emit('update', survivor)

    // DISPLAY UI
    if(gameState !== undefined){
        gameUI();
    }
}

function joinGame() {
    let playerName = select("#name").value();

    // IF PLAYER PASSES TESTS
    if (playerName.length >= 3) {
        // SET PLAYER INFO
        survivor.id = socket.id;
        survivor.name = playerName;
        survivor.activate();

        // SEND NEW PLAYER INFO TO SERVER
        socket.emit('join', survivor);

        // HANDLE DOM ELEMENTS
        document.getElementById('joinGame').disabled = true;
        document.getElementById('leaveGame').disabled = false;
        document.getElementById('name').disabled = true;
    } else {
        alert("Please enter a valid name")
    }
}

function leaveGame() {
    // SET ACTIVE STATE TO FALSE
    survivor.deactivate();

    // EMIT TO THE SERVER THAT THE PLAYER HAS LEFT THE GAME
    socket.emit('leave', survivor);

    // HANDLE DOM ELEMENTS
    document.getElementById('joinGame').disabled = false;
    document.getElementById('leaveGame').disabled = true;
    document.getElementById('name').disabled = false;
}

function gameUI() {
    // PLAYER AND ITEM INFO
	push();
	translate(0, height)
	textSize(20);
	textAlign(LEFT, BOTTOM)
	text("Survivors: " + gameState.players.length + " Rolls: " + gameState.items.rolls.length, 0, 0);
	textAlign(RIGHT, BOTTOM)
	text(gameState.state, width, 0);
	pop();

	// GAME MESSAGE
	push();
	translate(width / 2, 20);
	textAlign(CENTER, TOP);
	textSize(20);
	text(gameState.msg, 0, 0);
	pop();

	// GAME TIMER
	push();
	translate(width, 0);
	textAlign(RIGHT, TOP)
	textSize(20);
	var timer = "Store is closing in: " + gameState.timer;
	text(timer, -20, 20)
	pop();

	// GAME ROUND
	push();
	translate(0, 0);
	textAlign(LEFT, TOP)
	textSize(20);
	var round = "Store " + gameState.round + " of 3";
	text(round, 20, 20)
	pop();
}

function keyPressed(){
    // GET USER INPUT 
    if (keyCode == 32) {
        // survivor.sneeze();
        console.log("SNEEZE")
	}
}