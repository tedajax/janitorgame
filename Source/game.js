//var engine = new Engine();
var testTerrain;
var tempscale = 0.1;
var controller;
var testLevel;
var camera;
var player;
var menuManager;


function initGL(canvas) {
	try {
		gl = canvas.getContext("experimental-webgl");
	} catch(e) {
	}
	if(!gl) {
		alert("Could not initialize WebGL");
	}
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
};

function Init() {
	var canvas = document.getElementById("canvas");	
	initGL(canvas);	
	canvas.width = 800;
	canvas.height = 600;
	engine.init();
	camera = new Camera();
	
	controller = new Controller();
	player = new Player();
	
	menuManager = new MenuManager();
	
	var menuScreen = new Menu("Game Menu", false);
	menuScreen.addBackgroundImage("./Assets/Textures/janitor.png");
	menuScreen.addItem('Play Game', 25, 75, 'bold 20pt Papyrus', 'rgb(255,255,255)');
	menuManager.addMenu(menuScreen);

	testLevel = new Level();
	testLevel.loadLevel("Test.lvl");
	
	
	document.onkeydown = controller.handleKeyDown;
	document.onkeyup = controller.handleKeyUp;
	testTerrain = new Terrain();
	
	gl.clearColor(0.0, 0.5, 0.7, 1.0);
	gl.clearDepth(1.0);	
	
	setInterval(tick, 16);
};
// function lightingAndNormals()
// {
	// nMatrix = mvMatrix.inverse();
	// nMatrix = nMatrix.transpose();
	// gl.uniformMatrix4fv(shaderProgram.nMatrixUniform, false, new Float32Array(nMatrix.flatten()));
	
	// gl.uniform3f(shaderProgram.ambientColorUniform, 0.2, 0.2, 0.2);
	
	// var lightingDirection = Vector.create([-0.25, -0.25, -1.0]);
	// var ld = Vector.create([lightingDirection.e(1), lightingDirection.e(2), lightingDirection.e(3), 1.0]);
	// ld = nMatrix.multiply(ld);
	// lightingDirection = Vector.create([ld.e(1),ld.e(2),ld.e(3)]);
	// var adjustedLD = lightingDirection.toUnitVector().x(-1);
	// var flatLD = adjustedLD.flatten();
	// gl.uniform3fv(shaderProgram.lightingDirectionUniform, flatLD);

	// gl.uniform3f(shaderProgram.directionalColorUniform, 0.6, 0.6, 0.6);
	// gl.uniform3f(shaderProgram.specularColorUniform, 0.4, 0.4, 0.4);
	// gl.uniform3f(shaderProgram.cameraPositionUniform, camera.X, camera.Y, camera.Z);
	
	// //gl.uniform3f(shaderProgram.lightingEnabledUniform, true);
// };

function drawScene() 
{ 
	var cont=canvas.parentNode;
	if ((canvas.width!=cont.clientWidth)||(canvas.height!=cont.clientHeight))
	{
		canvas.width=cont.clientWidth;
		canvas.height=cont.clientHeight;
	}
//	gl.viewportWidth = document.innerWidth;
//	gl.viewportHeight = document.innerHeight;
	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
 
	perspective(70, canvas.width / canvas.height, 0.1, 10000.0);
	loadIdentity();
	
	camera.Transforms();	
	testTerrain.draw();
	
	testLevel.draw();
};


function update()
{
	player.Update(engine.getDeltaTime());
};

function tick()
{
	update();
	drawScene();	
};

// function gameStart()
// {
	// engine.init();
	// camera = new Camera();
	// webGLStart();
	// controller = new Controller();
	// player = new Player();
	// testBlock = new Block();
	// testBlock.setTexture(engine.aManager.getTexture("Assets/Textures/grass.png"));
	
	// testLevel = new Level();
	// testLevel.loadLevel("Test.lvl");
	
	// document.onkeydown = controller.handleKeyDown;
	// document.onkeyup = controller.handleKeyUp;
	// testTerrain = new Terrain();
	
	// setInterval(tick, 16);
// };

