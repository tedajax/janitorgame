engine.createInheritance(Boss, GameObject);

function Boss()
{
	this.GameObject();
	
	Boss.IDLE_STATE = 0;
	Boss.FOLLOW_STATE = 1;
	Boss.JUMP_BACK_STATE = 2;
	Boss.JUMP_STATE = 3;
	Boss.JUMP_HOVER_STATE = 4;
	Boss.JUMP_SLAM_STATE = 5;
	
	this.state = 1;
	this.percept = new Percept();
	
	this.shader;
	
	this.jumpHeight = 0;
	this.collisionRadius = 20;
	this.health = 100000;
	this.initialize();
};

Boss.prototype.initialize = function()
{
	this.model = engine.aManager.getModel("Column.obj");
	this.texture = engine.aManager.getTexture("SlimeKing.png");
	
	this.shader = new ObjectShader();
	
	this.position = Vector.create([170, 0.0, 170]);
	
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
	var thght;
	console.log(this.health);
	this.percept.actor.position = this.position;
	this.percept.actor.rotation = this.rotation;
	this.percept.actor.state = this.state;
	this.percept.actor.velocity = this.velocity;
	this.percept.target.position = newPerc.target.position;
	this.percept.target.rotation = newPerc.target.rotation;
	
	thght = terrain.getHeight(this.position.e(1), this.position.e(3));
	
	this.percept.thght = thght;
	
	this.position.elements[1] = thght;
	this.position.elements[1] += this.jumpHeight;
	
	this.state = GetBossState(this.percept);
		
	if (this.position.e(1) < 68) this.position.elements[0] = 68;
	if (this.position.e(1) > 184) this.position.elements[0] = 184;
	if (this.position.e(3) < 68) this.position.elements[2] = 68;
	if (this.position.e(3) > 184) this.position.elements[2] = 184;
		
	switch (this.state)
	{
		default:
		case Boss.IDLE_STATE:
			this.jumpHeight = 0.0;
			break;
			
		case Boss.FOLLOW_STATE:
			this.jumpHeight = 0.0;
			this.velocity = this.percept.target.position.subtract(this.position);
			this.velocity.toUnitVector();
			
			this.velocity = this.velocity.x(0.005);			
			this.position = this.position.add(this.velocity);
			
			this.rotation = Math.atan2(this.percept.target.position.e(1) - this.position.e(1),
									   this.percept.target.position.e(3) - this.position.e(3));
			this.rotation *= (180 / Math.PI);
			this.rotation += 270;
			//console.log(this.rotation);
			//this.rotation += 1.0;
			
			break;
		case Boss.JUMP_BACK_STATE:

			var tempVY = this.velocity.e(2);
			this.velocity = this.percept.target.position.subtract(this.position);
			this.velocity.toUnitVector();
			
			this.velocity = this.velocity.x(-0.02);			
			this.position = this.position.add(this.velocity);
			
			this.rotation = Math.atan2(this.percept.target.position.e(1) - this.position.e(1),
									   this.percept.target.position.e(3) - this.position.e(3));
			this.rotation *= (180 / Math.PI);
			this.rotation += 270;
			this.velocity.elements[1] = tempVY;
		
			if (this.position.elements[1] <= thght + 0.1 && this.velocity.elements[1] >= 0.0)
				this.velocity.elements[1] = 3.0;
				
			this.jumpHeight += this.velocity.elements[1];
				
			this.velocity.elements[1] -= 0.1;
			break;
			
		case Boss.JUMP_STATE:
			if (this.position.elements[1] <= thght + 0.1 && this.velocity.elements[1] >= 0.0)
				this.velocity.elements[1] = 5.0;
				
			this.jumpHeight += this.velocity.elements[1];
				
			this.velocity.elements[1] -= 0.1;		
			this.percept.timer = 200;
			break;
			
		case Boss.JUMP_HOVER_STATE:
			this.percept.timer -= 1;
			break;
			
		case Boss.JUMP_SLAM_STATE:
			this.jumpHeight -= 2.0;
			break;
	}	
	
	if (this.position.elements[1] < thght)
		this.position.elements[1] = thght;
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

Boss.prototype.Health = function(i) {
	this.health += i;
	console.log(this.health);
};

Boss.prototype.getCollisionRadius = function(){
	return this.collisionRadius;
};
