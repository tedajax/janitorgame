engine.createInheritance(Block, GameObject);

function Block()
{
	this.GameObject();
	
	this.texture;
};

Block.prototype.initialize = function()
{
	this.shader = new BlockShader();
};

Block.prototype.loadModel = function()
{
	this.model.vertexBuffer = BlockGeom.vertexBuffer;
	this.model.texCoordBuffer = BlockGeom.texCoordBuffer;
	this.model.indexBuffer = BlockGeom.indexBuffer;
};

Block.prototype.setTexture = function(tex)
{
	this.texture = tex;
};

Block.prototype.update = function()
{
};

Block.prototype.updateShader = function()
{
	gl.useProgram(this.shader);
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	
	this.shader.pMatrix = pMatrix;
	this.shader.mvMatrix = mvMatrix;
	
	this.shader.drawSetup();
};

Block.prototype.draw = function()
{
	var storeMV = mvMatrix;
	
	mvTranslate([this.position.e(1), this.position.e(2), this.position.e(3)]);
	mvRotate(this.rotation, [0, 1, 0]);
	mvScale([this.scale.e(1), this.scale.e(2), this.scale.e(3)]);
	
	this.updateShader();
	
	gl.bindBuffer(gl.ARRAY_BUFFER, this.model.vertexBuffer);
	gl.vertexAttribPointer(this.shader.program.vertexPositionAttribute,
						   this.model.vertexBuffer.itemSize,
						   gl.FLOAT, 
						   false,
						   0,
						   0);
						   
	gl.bindBuffer(gl.ARRAY_BUFFER, this.model.texCoordBuffer);
	gl.vertexAttribPointer(this.shader.program.textureCoordAttribute,
						   this.model.texCoordBuffer.itemSize,
						   gl.FLOAT,
						   false,
						   0,
						   0);
						   
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.model.indexBuffer);
	gl.drawElements(gl.TRIANGLE_STRIP, this.model.indexBuffer.numItems, gl.UNSIGNED_SHORT, 0);
	
	mvMatrix = storeMV;
};