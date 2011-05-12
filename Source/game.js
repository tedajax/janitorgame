//var engine = new Engine();
var testTerrain;
var terrain;
var tempscale = 0.1;
var controller;
var testLevel;
var camera;
var player;
var isLoaded;
var loadingScreen;
var boss;
var perc;

function initGL(canvas) {
	try {
		gl = canvas.getContext("experimental-webgl");
	} catch(e) {
	}
	if(!gl) {
		alert("Could not initialize WebGL");
	}

};

function Init() {
	isLoaded = false;
	var canvas = document.getElementById("canvas");	
	initGL(canvas);	
//	canvas.style.zIndex = '0';
	canvas.width = 800;
	canvas.height = 600;
	engine.init();
	
	loadIdentity();
	
	var assets = new Array();
	assets.push(new AssetHolder("sand.png", 2));
	assets.push(new AssetHolder("grass.png", 2));
	assets.push(new AssetHolder("rock.png", 2));
	assets.push(new AssetHolder("snow.png", 2));
	assets.push(new AssetHolder("Column.obj", 3));
	assets.push(new AssetHolder("SlimeKing.png", 2));
	engine.aManager.BulkLoad(assets);

	camera = new Camera();
	
	controller = new Controller();
	player = new Player();
	
	boss = new Boss();
	perc = new Percept();
	
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
	gl.clearColor(0.0, 0.5, 0.7, 1.0);
	gl.clearDepth(1.0);	
	
	document.onkeydown = controller.handleKeyDown;
	document.onkeyup = controller.handleKeyUp;
	terrain = new Terrain();
	loadingScreen = new LoadingScreen();
	setInterval(tick, 16);
};

function update()
{
	if(!isLoaded) 
	{
		if(engine.aManager.isLoaded && terrain.isLoaded) {
			isLoaded = true;
			loadingScreen.clearScreen();
		}
		console.log(engine.aManager.CheckStatus());
		loadingScreen.update(engine.aManager.CheckStatus());
	} 
	else 
	{
		player.Update(engine.getDeltaTime());
		
		perc.target.position = player.position;
		perc.target.rotation = player.rotation;
			
		boss.update(perc);
	}
};

function drawScene() 
{ 
	if(isLoaded) //Draw game
	{  
		var cont=canvas.parentNode;
		if ((canvas.width!=cont.clientWidth)||(canvas.height!=cont.clientHeight))
		{
			canvas.width=cont.clientWidth;
			canvas.height=cont.clientHeight;
		}
		gl.viewport(0, 0, canvas.width, canvas.height);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	 
		perspective(70, canvas.width / canvas.height, 0.1, 10000.0);
		loadIdentity();
		
		camera.Transforms();	
		terrain.draw();
		boss.draw();
	} 
	else 
	{ //Draw progress bar
		loadingScreen.draw();
	}
	
};

function tick()
{
	update();
	drawScene();	
};



