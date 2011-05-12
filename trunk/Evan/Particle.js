engine.createInheritance(Particle, GameObject);

function Particle()
{
	this.GameObject();
	
	this.shader = new ParticleShader();
	
	this.vertexBuffer = gl.createBuffer();
	this.texCoordBuffer = gl.createBuffer();
	this.indexBuffer = gl.createBuffer();
	
	this.texture;
	
	this.createBuffers();
};

Particle.prototype.createBuffers = function()
{
	var vertices = [ -1.0,  1.0,  0.0,
					 -1.0, -1.0,  0.0,
					  1.0, -1.0,  0.0,
					  1.0,  1.0,  0.0 ];
					  
	var texCoords = [ 0.0, 0.0,
					  0.0, 1.0,
					  1.0, 1.0,
					  1.0, 0.0 ];
					 
	var indices = [ 3, 2, 1,
					0, 3, 1 ];
					
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.vertexBuffer.itemSize = 3;
	this.vertexBuffer.numItems = 4;
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
	this.texCoordBuffer.itemSize = 2;
	this.texCoordBuffer.numItems = 4;
	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	this.indexBuffer.itemSize = 1;
	this.indexBuffer.numItems = 6;	
};

Particle.prototype.update = function()
{
	
};

Particle.prototype.setupShader = function()
{
	gl.useProgram(this.shader.program);
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	
	this.shader.pMatrix = pMatrix;
	this.shader.mvMatrix = mvMatrix;
	
	this.shader.drawSetup();
};

Particle.prototype.draw = function()
{
	this.setupShader();
	
	var storeMV = mvMatrix;
	
	this.rotation = Math.atan2(camera.X - this.position.e(1),
							   camera.Z - this.position.e(3));
	this.rotation += Math.PI;
	this.rotation *= (180 / Math.PI);
	
	mvTranslate([this.position.e(1), this.position.e(2), this.position.e(3)]);
	mvRotate(this.rotation, [0, 1, 0]);
	mvScale([this.scale.e(1), this.scale.e(2), this.scale.e(3)]);
	
	this.setupShader();
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.vertexAttribPointer(this.shader.program.vertexPositionAttribute,
						   this.vertexBuffer.itemSize,
						   gl.FLOAT, 
						   false,
						   0,
						   0);
						   
	gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
	gl.vertexAttribPointer(this.shader.program.textureCoordAttribute,
						   this.texCoordBuffer.itemSize,
						   gl.FLOAT,
						   false,
						   0,
						   0);
						   
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	gl.drawElements(gl.TRIANGLES, this.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	
	mvMatrix = storeMV;
};