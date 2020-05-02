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

// LOCAL SURVIVOR INSTANCE
var survivor;
var canvas;

// MAP
var thisMap;

function setup() {
    canvas = createCanvas(1280, 720);
    canvas.parent('sketch-holder');
    socket = io.connect();

    // DISPLAY CURRENT MAP
    thisMap = new map0();

    // CREATES PLAYER INSTANCE
    survivor = new player("ID", "NAME", width / 2, height / 2, 50);
    
}

function draw() {
    background(106);

    thisMap.display();

    // IF USER IS ACTIVE (HAS JOINED), DISPLAY AND UPDATE PLAYER ON SCREEN
    if (survivor.active) {
        survivor.display();
        survivor.update();
        // survivor.getInput();
    }


    // socket.emit('update', survivor)
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


function keyPressed(){
    // GET USER INPUT DATA AS A VECTOR
    // var inputForce = createVector(0, 0);
    // //CHECKS LEFT AND RIGHT FORCE
    // if (keyCode == 65) { // A
    //     inputForce.x = -1;
    // } else if (keyCode == 68) { // D
    //     inputForce.x = 1;
    // }

    // // CHECKS UP AND DOWN FORCE
    // if (keyCode == 87) { // W
    //     inputForce.y = -1;
    // } else if (keyCode == 83) { // S
    //     inputForce.y = 1;
    // }

    if (keyCode == 32) {
        // survivor.sneeze();
        console.log("SNEEZE")
	}

    // survivor.applyForce(inputForce);
}