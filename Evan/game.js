var testTerrain;
var teapot;
var vData;

var Bullets = new Array();
var engine = new Engine();

var enemy1 = new Enemy();
var enemy2 = new Enemy();
var enemy3 = new Enemy();;


var tempscale = 0.1;

var bulletFired = false;

//Textures class which stores all the textures
function textures()
{
	textures.teapot;
	
	textures.grass;
	textures.rock;
	textures.snow;
	textures.sand;
	
	textures.shrub;
	
	textures.pink;
	
	textures.loaded = false;
};

//Checks if the textures are all loaded and sets texture loaded status accordingly
function checkLoadedTextures()
{
	if (!textures.loaded)
	{
		if (!textures.grass.loaded) return false;
		if (!textures.rock.loaded) return false;
		if (!textures.snow.loaded) return false;
		if (!textures.sand.loaded) return false;
		if (!textures.shrub.loaded) return false;
		if (!textures.pink.loaded) return false;
	}
	
	textures.loaded = true;
	return true;
};

function lightingAndNormals()
{
	var nMatrix = mvMatrix.inverse();
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
	
	gl.useProgram(shaderProgram);
	drawSkybox();
	drawTerrain();
	drawBullets();
	drawTeapot();
	
	enemy1.draw();
	enemy2.draw();
	enemy3.draw();
	
	drawShrubs();	
	
	drawHUD();
};

function drawTerrain()
{
	if (terrain.loaded && textures.loaded)
	{		
		//set textures
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, textures.sand);
		gl.uniform1i(shaderProgram.samplerUniform0, 0);
		
		gl.activeTexture(gl.TEXTURE1);
		gl.bindTexture(gl.TEXTURE_2D, textures.grass);
		gl.uniform1i(shaderProgram.samplerUniform1, 1);
		
		gl.activeTexture(gl.TEXTURE2);
		gl.bindTexture(gl.TEXTURE_2D, textures.rock);
		gl.uniform1i(shaderProgram.samplerUniform2, 2);
		
		gl.activeTexture(gl.TEXTURE3);
		gl.bindTexture(gl.TEXTURE_2D, textures.snow);
		gl.uniform1i(shaderProgram.samplerUniform3, 3);
		
		gl.uniform1i(shaderProgram.heightTexturingUniform, true);
		gl.uniform1i(shaderProgram.enableLightingUniform, true);
		gl.uniform1f(shaderProgram.maxTerrainHeight, terrain.maxHeight);
		
		//bind vertices
		gl.bindBuffer(gl.ARRAY_BUFFER, terrain.vertexBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, terrain.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		//bind normals
		gl.bindBuffer(gl.ARRAY_BUFFER, terrain.normalBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, terrain.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		//bind texture coordinates
		gl.bindBuffer(gl.ARRAY_BUFFER, terrain.texCoordBuffer);
		gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, terrain.texCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
		
		setMatrixUniforms();
		lightingAndNormals();
		
		//bind indices and draw with them
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, terrain.indexBuffer);
		gl.drawElements(gl.TRIANGLE_STRIP, terrain.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	}
};

function drawSkybox()
{
};

function drawTeapot()
{
	if (teapot.loaded)
	{
		var storeMV = mvMatrix;
		
		mvTranslate([0, 20, 0]);
		mvRotate(yaw, [0, 1, 0]);
		mvScale([tempscale, tempscale, tempscale]);
		
		gl.uniform1i(shaderProgram.heightTexturingUniform, false);
		gl.uniform1i(shaderProgram.enableLightingUniform, false);
		
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, textures.teapot);
		gl.uniform1i(shaderProgram.samplerUniform0, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, teapot.vertexObject);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, teapot.normalObject);
		gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);

		setMatrixUniforms();
		lightingAndNormals();
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, teapot.indexObject);
		gl.drawElements(gl.TRIANGLES, teapot.numIndices, gl.UNSIGNED_SHORT, 0);
		
		mvMatrix = storeMV;		
	}
};

function drawShrubs()
{
	if (textures.loaded)
	{
		for (var i = 0; i < vegData.COUNT; i++)
		{
			var storeMV = mvMatrix;
			
			mvTranslate([vegData.locations[i * 2], getTerrainHeight(vegData.locations[i * 2], vegData.locations[i * 2 + 1]) + 1.0, vegData.locations[i * 2 + 1]]);
			mvScale([5.0, 5.0, 5.0]);
			
			gl.blendFunc (gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);//, gl.SRC_ALPHA, gl.ONE);
			gl.enable(gl.BLEND);
			
			gl.uniform1i(shaderProgram.heightTexturingUniform, false);
			gl.uniform1i(shaderProgram.enableLightingUniform, false);
			
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, textures.shrub);
			gl.uniform1i(shaderProgram.samplerUniform0, 0);
			
			//bind vertices
			gl.bindBuffer(gl.ARRAY_BUFFER, vegetation.vertexBuffer);
			gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, vegetation.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
			
			//bind normals
			gl.bindBuffer(gl.ARRAY_BUFFER, vegetation.normalBuffer);
			gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, vegetation.vertexBuffer.itemSize, gl.FLOAT, false, 0, 0);
			
			//bind texture coordinates
			gl.bindBuffer(gl.ARRAY_BUFFER, vegetation.texCoordBuffer);
			gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, vegetation.texCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
			setMatrixUniforms();
			lightingAndNormals();
			
			//bind indices and draw with them
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vegetation.indexBuffer);
			gl.drawElements(gl.TRIANGLES, vegetation.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
			
			gl.disable(gl.BLEND);
			
			mvMatrix = storeMV;
		}
	}
};

function drawBullets()
{
	for (var i = 0; i < Bullets.length; i++)
	{
		Bullets[i].draw();
	}
};

function drawHUD()
{
	engine.hud.draw();
};

function dist(bullet, enemy)
{
	var xdiff = bullet.position[0] - enemy.position[0];
	//var ydiff = bullet.position[1] - enemy.position[1];
	var ydiff = 0; 
	var zdiff = bullet.position[2] - enemy.position[2];
	
	return Math.sqrt((xdiff * xdiff) + (ydiff * ydiff) + (zdiff * zdiff));
};

function checkCollisions()
{
	for (var i = 0; i < Bullets.length; i++)
	{
		if (Bullets[i].display)
		{
			if (enemy1.display)
			{
				if (dist(Bullets[i], enemy1) < 10.0)
				{
					Bullets[i].display = false;
					enemy1.display = false;
				}
			}
			if (enemy2.display)
			{
				if (dist(Bullets[i], enemy2) < 20.0)
				{
					Bullets[i].display = false;
					enemy2.display = false;
				}
			}
			if (enemy3.display)
			{
				if (dist(Bullets[i], enemy3) < 10.0)
				{
					Bullets[i].display = false;
					enemy3.display = false;
				}
			}
		}
	}
};

function update()
{
	for (var i = 0; i < Bullets.length; i++)
	{
		Bullets[i].update();
	}
	
	enemy1.update();
	enemy2.update();
	enemy3.update();
	
	checkCollisions();
}

function tick()
{
	if (engine.healthVal < 0.0) engine.healthVal = 0.0;
	
	checkLoadedTextures();
	handleKeys();
	drawScene();
	moveCamera();
	update();
}

function gameStart()
{
	webGLStart();
	enableServer();
	
	testTerrain = new terrain();
	vData = new vegData();
	teapot = loadObj("teapot.obj");
	CreateVegetation();
	
	loadTextures();
	loadModels();
	
	document.onkeydown = handleKeyDown;
	document.onkeyup = handleKeyUp;
		
	engine.init();
	enemy1.initialize();
	enemy2.initialize();
	enemy3.initialize();
	
	enemy1.setModel(Models.enemy1);
	enemy2.setModel(Models.enemy2);
	enemy3.setModel(Models.enemy3);
	
	enemy1.setTexture(textures.snow);
	enemy2.setTexture(textures.sand);
	enemy3.setTexture(textures.pink);
	
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
