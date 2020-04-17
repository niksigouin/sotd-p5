var socket;

function setup() {
	createCanvas(windowWidth, windowHeight);
	socket = io.connect('http://localhost:8080')
}

function draw() {
	background(255);
	rect(mouseX, mouseY, 50, 50);
}