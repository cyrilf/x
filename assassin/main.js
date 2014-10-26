var container = document.getElementById('container');
var width	    = window.innerWidth;
var height	  = window.innerHeight;

var scene    = new THREE.Scene();
var renderer = new THREE.CanvasRenderer();
var camera   = new THREE.PerspectiveCamera(75, width/height, 1, 10000);
var distance = 1000;
var geometry = new THREE.Geometry();

var moving;
var isAutoMoving = true;

var curMouseX = 0, curMouseY = 0;
var oldMouseX = 0, oldMouseY = 0;
var adjust = false, adjustValueX = 0, adjustValueY = 0;

init();
play();

// Create the scene, camera, particles, lines
function init() {
	renderer.setSize(width, height);
	container.appendChild(renderer.domElement);
	scene.add(camera);

	// Colors by default Black x3, Grey x3 and red
	var colors = [0x000000, 0x000000, 0x000000, 0xCCCCCC, 0xCCCCCC, 0xCCCCCC, 0xBD0400];
	// We create all the particles
	var i = 0;
	for(; i < 150; i++) {
		var rand     = Math.floor((Math.random() * colors.length));
		var particle = new THREE.Particle(new THREE.ParticleCanvasMaterial({
				color : colors[rand],
				opacity : 1,
				program: drawCircle
		}));

		particle.position.x = Math.random() * distance * 2 - distance;
		particle.position.y = Math.random() * distance * 2 - distance;
		particle.position.z = Math.random() * distance * 2 - distance;
		particle.scale.x = particle.scale.y = Math.random() * 12 + 5;
		scene.add(particle);

		// We create the "path" to draw the line later
		geometry.vertices.push(new THREE.Vector3(particle.position.x, particle.position.y, particle.position.z));
	}

	//We draw the line
	var line = new THREE.Line(geometry, new THREE.LineBasicMaterial({
		color : 0x000000,
		opacity:0.05
	}));
	scene.add(line);

	camera.position.z = distance;
	camera.lookAt(scene.position);

	renderer.render(scene, camera);
}

function drawCircle(context) {
	context.beginPath();
	context.arc(0,0,1,0, Math.PI * 2, true);
	context.closePath();
	context.fill();
}

// Launch the animation and the checker
function play() {
	moving = setInterval(function(){move();},24);
	setInterval(function(){checker();},500);
}

// Move automaticaly the camera
function move() {
	adjust = true;
	if(curMouseX <= 0) {
		curMouseX++; xUp = true;
	} else if(curMouseX >= width || !xUp) {
	 curMouseX--; xUp = false;
	} else {
		curMouseX++;
	}

	if(curMouseY <= 0) {
		curMouseY++;
		yUp = true;
	}	else if(curMouseY >= height || !yUp) {
		curMouseY--;
		yUp = false;
	} else {
		curMouseY++;
	}

	render(curMouseX,curMouseY);
}

document.addEventListener('mousemove', onMouseMove, false);
function onMouseMove(e) {
	// We stop automatic move
	clearInterval(moving);
	isAutoMoving = false;

	// We adjust the shift between mouse position(e.clientX) and the last "x" position (from automove)
	// It usefull to avoid a "jump" effect from the camera.
	if(adjust) {
		adjustValueX = e.clientX - curMouseX;
		adjustValueY = e.clientY - curMouseY;
		adjust       = false;
	}

	// We move camera with new coordinates
	curMouseX  = (event.clientX - adjustValueX);
	curMouseY  = (event.clientY - adjustValueY);
	render(curMouseX, curMouseY);
}

// Move the camera and render the scene
function render(x,y) {
	camera.position.x = Math.sin(((x - width/2)/width/2) * Math.PI) * distance;
	camera.position.y = -Math.sin(((y - height/2)/height/2) * Math.PI) * distance;
	camera.lookAt(scene.position);
	renderer.render(scene, camera);
}

// Checker is used to see if the cursor move or not
// If the cursor hasn't change his position, we launch autoMove
function checker() {
	if(curMouseX==oldMouseX && curMouseY==oldMouseY && !isAutoMoving) {
		moving       = setInterval(function(){move();},25);
		isAutoMoving = true;
	}
	oldMouseX = curMouseX;
	oldMouseY = curMouseY;
}