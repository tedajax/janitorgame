var testTerrain;
var tempscale = 0.1;
var aManager;

var blocktest;

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
	blocktest.draw();
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
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;
	testTerrain = new Terrain();
	
	engine.init();
	
	blocktest = new Block();
	blocktest.setTexture(aManager.getTexture("./Assets/Textures/sand.png"));
	
	setInterval(tick, 16);
};

