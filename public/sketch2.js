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

var cP;
var players = ['Nik', 'Angie', 'Ed']

// LOCAL SURVIVOR INSTANCE
var survivor;
var cnv;

// NAME INPUT
let input, button;
let hasJoined = false;

// MAP
var thisMap;

function windowResized() {
    // cnv.position((windowWidth - width) / 2);
}

function setup() {

    cnv = createCanvas(1280, 720);
    cnv.parent('sketch-holder');
    socket = io.connect();

    // DISPLAY CURRENT MAP
    thisMap = new map0();

    survivor = new player("ID", "NAME", width / 2, height / 2, 50);
    // socket.emit('new player', survivor);
    // getName();
    // displayPlayerNames();
}

function draw() {
    background(106);

    thisMap.display();

    if (survivor.isJoined) {
        survivor.display();
        survivor.update();
    }



    // socket.emit('update', survivor)
    // console.log(survivor.id);
    // noLoop();
    // console.log(hasJoined);
}

function joinGame() {
    let playerName = select("#name").value();

    // SET PLAYER INFO
    survivor.id = socket.id;
    survivor.name = playerName;
    survivor.isJoined = true;

    // SEND NEW PLAYER INFO TO SERVER
    socket.emit('join', survivor);

    // HANDLE DOM ELEMENTS
    document.getElementById('joinGame').disabled = true;
    document.getElementById('leaveGame').disabled = false; 
    document.getElementById('name').disabled = true;
}

function leaveGame() {
    survivor.isJoined = false;
    socket.emit('leave', survivor);

    document.getElementById('joinGame').disabled = false;
    document.getElementById('leaveGame').disabled = true;
    document.getElementById('name').disabled = false;
}


