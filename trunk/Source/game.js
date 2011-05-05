var testTerrain;
//var terrShader;
var tempscale = 0.1;
var aManager;


//Textures class which stores all the textures
function textures()
{
	textures.grass;
	textures.rock;
	textures.snow;
	textures.sand;
		
	textures.loaded = false;
};



function lightingAndNormals()
{
	nMatrix = mvMatrix.inverse();
	nMatrix = nMatrix.transpose();
	gl.uniformMatrix4fv(shaderProgram.nMatrixUniform, false, new Float32Array(nMatrix.flatten()));
	
	gl.uniform3f(shaderProgram.ambientColorUniform, 0.2, 0.2, 0.2);
	
	var lightingDirection = Vector.create([-0.25, -0.25, -1.0]);
	var ld = Vector.create([lightingDirection.e(1), lightingDirection.e(2), lightingDirection.e(3), 1.0]);
	ld = nMatrix.multiply(ld);
	lightingDirection = Vector.create([ld.e(1),ld.e(2),ld.e(3)]);
	var adjustedLD = lightingDirection.toUnitVector().x(-1);
	var flatLD = adjustedLD.flatten();
	gl.uniform3fv(shaderProgram.lightingDirectionUniform, flatLD);

	gl.uniform3f(shaderProgram.directionalColorUniform, 0.6, 0.6, 0.6);
	gl.uniform3f(shaderProgram.specularColorUniform, 0.4, 0.4, 0.4);
	gl.uniform3f(shaderProgram.cameraPositionUniform, eyeX, eyeY, eyeZ);
	
	//gl.uniform3f(shaderProgram.lightingEnabledUniform, true);
};

function drawScene() 
{ 
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
 
	perspective(70, gl.viewportWidth / gl.viewportHeight, 0.1, 10000.0);
	loadIdentity();
	
	camTransforms();
	
	testTerrain.draw();
};


function update()
{
	
}

function tick()
{
	handleKeys();
	drawScene();
	moveCamera();
	update();
}

function gameStart()
{
	webGLStart();
	
	
	aManager = new AssetManager();
	loadTextures();
	loadModels();
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;
	testTerrain = new Terrain();
//	terrShader = new TerrainShader();
	engine.init();
	
	setInterval(tick, 16);
};

function loadTextures()
{
	textures.teapot = loadTexture("teapot.png");
	textures.grass = loadTexture("grass.png");
	textures.rock = loadTexture("rock.png");
	textures.snow = loadTexture("snow.png");
	textures.sand = loadTexture("sand.png");
	textures.shrub = loadTexture("bush.png");
	textures.pink = loadTexture("pink.png");
};
