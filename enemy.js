engine.createInheritance(Enemy, GameObject);

function Enemy()
{
	this.GameObject();
	
	this.texture;
};

Enemy.prototype.initialize = function()
{
	this.position = [Math.random() * 256, 0.0, Math.random() * 256];
	this.velocity = [0.0, 0.0, 0.0];
	this.rotation = 0.0;
	this.scale = [1, 1, 1];
	
	this.setNewTarget();
	
	this.collRadius = 1.0;

	this.display = true;
	
	this.loadModel();
};

Enemy.prototype.loadModel = function()
{
	this.model = Models.enemy2;
};

Enemy.prototype.setModel = function(model)
{
	this.model = model;
};

Enemy.prototype.setTexture = function(texture)
{
	this.texture = texture;
};

Enemy.prototype.setNewTarget = function()
{
	this.target = [Math.random() * 128 + 64, 0.0, Math.random() * 128 + 64];
};

Enemy.prototype.distToTarget = function()
{
	var xdiff = this.position[0] - this.target[0];
	var zdiff = this.position[2] - this.target[2];
	
	return Math.sqrt((xdiff * xdiff) + (zdiff * zdiff));
};

Enemy.prototype.update = function()
{
	var ato = Math.atan2(this.position[0] - this.target[0], this.position[2] - this.target[2]);
	this.velocity = [Math.sin(ato - 180), 0, Math.cos(ato - 180)];
	this.rotation = ato * 180 / Math.PI + 90;
	
	var d = this.distToTarget();
	if (d < 10.0)
		this.setNewTarget();
	
	if (d > 30)
	{
		this.position[0] += this.velocity[0];
		this.position[1] += this.velocity[1];
		this.position[2] += this.velocity[2];
	}
	else
	{
		this.position[0] += this.velocity[0] * 0.5;
		this.position[1] += this.velocity[1] * 0.5;
		this.position[2] += this.velocity[2] * 0.5;
	}
	
	this.position[1] = getTerrainHeight(this.position[0], this.position[2]);
	
	if (this.model == Models.enemy1)
		this.position[1] += 10;
	else if (this.model == Models.enemy2)
		this.position[1] += 0;
	else
		this.position[1] += -10;
	
	
};

Enemy.prototype.draw = function()
{
	if (this.model.loaded && this.display)
	{
		var storeMV = mvMatrix;
		
		mvTranslate([this.position[0], this.position[1], this.position[2]]);
		mvRotate(this.rotation, [0, 1, 0]);
		mvScale([this.scale[0], this.scale[1], this.scale[2]]);
		
		gl.uniform1i(shaderProgram.heightTexturingUniform, false);
		gl.uniform1i(shaderProgram.enableLightingUniform, false);
		
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.texture);
		gl.uniform1i(shaderProgram.samplerUniform0, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.model.vertexObject);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	
		gl.bindBuffer(gl.ARRAY_BUFFER, this.model.normalObject);
		gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
	
		setMatrixUniforms();
		//lightingAndNormals();
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.model.indexObject);
		gl.drawElements(gl.TRIANGLES, this.model.numIndices, gl.UNSIGNED_SHORT, 0);
		
		mvMatrix = storeMV;
	}
};

