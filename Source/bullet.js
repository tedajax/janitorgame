createInheritance(Bullet, GameObject);

function Bullet()
{
	this.GameObject();
};

Bullet.prototype.initialize = function()
{
	this.position = [eyeX, eyeY, eyeZ];
	this.velocity = [0.0, 0.0, 0.0];
	this.rotation = yaw - 90;
	this.scale = [0.1, 0.1, 0.1];
	
	this.collRadius = 1.0;
	
	this.velocity = [Math.cos(this.rotation * Math.PI / 180), 0, Math.sin(this.rotation * Math.PI / 180)];
	
	this.position[0] += this.velocity[0];
	this.position[1] += this.velocity[1];
	this.position[2] += this.velocity[2];
	
	this.velocity[0] *= 5.0;
	this.velocity[2] *= 5.0;

	this.display = true;
	
	this.loadModel();
};

Bullet.prototype.loadModel = function()
{
	this.model = Models.bullet;
};

Bullet.prototype.update = function()
{
	this.position[0] += this.velocity[0];
	this.position[1] += this.velocity[1];
	this.position[2] += this.velocity[2];
	
	if (this.position[0] < 0 || this.position[0] > 256 || this.position[2] < 0 || this.position[2] > 256)
		this.display = false;
	
	var terrHeight = getTerrainHeight(this.position[0], this.position[2]);
	if (this.position[1] < terrHeight)
		this.display = false;
};

Bullet.prototype.draw = function()
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
		gl.bindTexture(gl.TEXTURE_2D, textures.snow);
		gl.uniform1i(shaderProgram.samplerUniform0, 0);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.model.vertexObject);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	
		gl.bindBuffer(gl.ARRAY_BUFFER, this.model.normalObject);
		gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
	
		setMatrixUniforms();
		lightingAndNormals();
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.model.indexObject);
		gl.drawElements(gl.TRIANGLES, this.model.numIndices, gl.UNSIGNED_SHORT, 0);
		
		mvMatrix = storeMV;
	}
};

