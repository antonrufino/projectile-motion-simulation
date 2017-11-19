var canvas, ctx;
var mx, my;
var Simulation;
var particles = [];

//CONSTANTS
var ACCELERATION_GRAVITY = 0.098;

function Particle() 
{
	this.x = 0;
	this.y = canvas.height;
	
	var r = Math.round(Math.random() * 255);
	var g = Math.round(Math.random() * 255);
	var b = Math.round(Math.random() * 255);
	this.color = 'rgb(' + r + ',' + g + ',' + b + ')'
	
	var vx = Simulation.velocity * Math.cos(Simulation.angle);
	this.getVX = function()
	{
		return vx;
	}
	
	var vy = Simulation.velocity * Math.sin(Simulation.angle);
	this.getVY = function()
	{
		vy += ACCELERATION_GRAVITY;
		return vy;		
	}
	
}

function setUpCanvas() 
{
	canvas = document.getElementById('world');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	if (canvas.getContext) {
		ctx = canvas.getContext('2d');
	}
	
	canvas.addEventListener('mousemove', mouseMoveHandler, false);
	canvas.addEventListener('click', clickHandler, false);
}

function mouseMoveHandler(e)
{
	mx = e.clientX;
	my = e.clientY;
}

function clickHandler(e)
{
		particles.push(new Particle());
}

function Engine() 
{
	setUpCanvas();
	
	this.velocity = 10;
	this.angle = 0.0;

	this.init = function() 
	{
		run();
	}	
}

function handlePhysics() 
{
	for (var i = 0; i < particles.length; ++i) {
		particles[i].x += particles[i].getVX();
		particles[i].y += particles[i].getVY();
		
		if (particles[i].x > canvas.width || particles[i].y > canvas.height) {
			particles.splice(i, 1);
		}
	}
}

function animateFrame()
{
	var LINE_WIDTH = 100;

	ctx.fillStyle = "#2d3539";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	var dx = mx;
	var dy = my - canvas.height;
	var dist = Math.sqrt(dx * dx + dy * dy);
	Simulation.angle = Math.atan2(dy, dx);
	
	ctx.strokeStyle = "#fff";
	ctx.beginPath();
	ctx.moveTo(0, canvas.height);
	ctx.lineTo(LINE_WIDTH * Math.cos(Simulation.angle), LINE_WIDTH * Math.sin(Simulation.angle) + canvas.height);
	ctx.closePath();
	ctx.stroke();
	
	handlePhysics();
	for (var i = 0; i < particles.length; ++i) {
		ctx.beginPath();
		ctx.fillStyle = particles [i].color;
		ctx.arc(particles[i].x, particles[i].y, 10, Math.PI * 2, false);
		ctx.fill();
	}
}

function run()
{
	animateFrame();
	requestAnimationFrame(run);
}

function setGUI()
{
	var gui = new dat.GUI();
	
	gui.add(Simulation, 'velocity');
	gui.add(Simulation, 'angle').listen();
}

window.addEventListener('load', function()
{
	Simulation = new Engine();
	Simulation.init();
	
	setGUI();
}, false);