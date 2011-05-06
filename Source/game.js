var testTerrain;
var tempscale = 0.1;
var controller;

var testLevel;

//var aManager;
//var engine;
var testBlock;
var camera;
var player;

function drawScene() 
{ 
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
 
	perspective(70, gl.viewportWidth / gl.viewportHeight, 0.1, 10000.0);
	loadIdentity();
	
	camera.Transforms();	
	testTerrain.draw();
	
	testLevel.draw();
};


function update()
{
	player.Update(engine.getDeltaTime());
}

function tick()
{
	update();
	drawScene();	
}

function gameStart()
{
	engine.init();
	camera = new Camera();
	webGLStart();
	controller = new Controller();
	player = new Player();
	testBlock = new Block();
	testBlock.setTexture(engine.aManager.getTexture("Assets/Textures/grass.png"));
	
	testLevel = new Level();
	testLevel.loadLevel("Test.lvl");
	
	document.onkeydown = controller.handleKeyDown;
	document.onkeyup = controller.handleKeyUp;
	testTerrain = new Terrain();
	
	setInterval(tick, 16);
};

