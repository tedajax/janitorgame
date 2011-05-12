engine.createInheritance(Boss, GameObject);

function Boss()
{
	this.GameObject();
	
	Boss.IDLE_STATE = 0;
	Boss.FOLLOW_STATE = 1;
	
	this.state = 1;
	this.percept = new Percept();
	
	this.shader;
	
	this.jumpHeight = 0;
	
	this.initialize();
};

Boss.prototype.initialize = function()
{
	this.model = engine.aManager.getModel("Column.obj");
	this.texture = engine.aManager.getTexture("SlimeKing.png");
	
	this.shader = new ObjectShader();
	
	this.position = Vector.create([100, 0.0, 100]);
	
	this.scale = Vector.create([60.0, 40.0, 60.0]);
};

Boss.prototype.loadModel = function()
{
	//do nothing for now
};

Boss.prototype.updateShader = function()
{
	gl.useProgram(this.shader.program);
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	
	this.shader.pMatrix = pMatrix;
	this.shader.mvMatrix = mvMatrix;
	
	this.shader.pos = this.position;
	
	this.shader.drawSetup();
};

Boss.prototype.update = function(newPerc)
{
	this.percept.actor.position = this.position;
	this.percept.actor.rotation = this.rotation;
	this.percept.actor.state = this.state;
	this.percept.target.position = newPerc.target.position;
	this.percept.target.rotation = newPerc.target.rotation;
	
	this.position.elements[1] = terrain.getHeight(this.position.e(1), this.position.e(3));
	//this.position.elements[1] += this.jumpHeight;

	switch (this.state)
	{
		default:
		case Boss.IDLE_STATE:
			break;
			
		case Boss.FOLLOW_STATE:
			this.velocity = this.percept.target.position.subtract(this.position);
			this.velocity.toUnitVector();
			this.velocity = this.velocity.x(0.01);			
			this.position = this.position.add(this.velocity);
			break;
	}	
};

Boss.prototype.draw = function()
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
