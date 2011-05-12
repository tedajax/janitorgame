//A point sprite emitter class
//Creates point buffers and renders them

function Emitter()
{
	//buffers that send data to the shader
	this.pointStartBuffer = gl.createBuffer();
	this.pointEndBuffer = gl.createBuffer();
	this.pointLifeBuffer = gl.createBuffer();
	
	//Values for calculating buffers 
	this.startPosition = Vector.create([0.0, 0.0, 0.0]);	//Starting origin for all points
	this.endPosition = Vector.create([0.0, 0.0, 0.0]);		//ending origin for all points
	
	this.startRadius = 0.0;									//Radius from emitter origin points can spawn
	this.endRadius = 0.0;									//Desired end radius from origin
	
	this.lifeTime = 0.0;									//Time in milliseconds for emitter to change from start to end state
	
	this.texture;											//Sprite texture to use
	
	this.repeat = false;									//specifies if the emitter will repeat or not
	
	this.shader = new ParticleShader();						//The shader to draw things with
	
	this.time = 0;
	
	this.createExplosion(1.0, 10.0, 100);
};

//position - the position for the explosion to occur
//radius - the radius of the explosion
//count - the number of particles in the explosion
Emitter.prototype.createExplosion = function(position, radius, count)
{
	var startpos = new Array();
	var endpos = new Array();
	var lifetimes = new Array();
	
	for (var i = 0; i < count; i++)
	{
		var lifetime = (Math.random() *0.75) + 0.25;
		
		lifetimes.push(lifetime);
		
		startpos.push((Math.random() * 0.25) - 0.125);
		startpos.push((Math.random() * 0.25) - 0.125);
		startpos.push((Math.random() * 0.25) - 0.125);
		
		endpos.push((Math.random() * 2) - 1);
		endpos.push((Math.random() * 2) - 1);
		endpos.push((Math.random() * 2) - 1);
	}
	
	this.pointLifeBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.pointLifeBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lifetimes), gl.STATIC_DRAW);
	this.pointLifeBuffer.itemSize = 1;
	this.pointLifeBuffer.numitems = count;
	
	this.pointStartBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.pointStartBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(startpos), gl.STATIC_DRAW);
	this.pointStartBuffer.itemSize = 3;
	this.pointStartBuffer.numitems = count;
	
	this.pointEndBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.pointEndBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(endpos), gl.STATIC_DRAW);
	this.pointEndBuffer.itemSize = 3;
	this.pointEndBuffer.numitems = count;
};

Emitter.prototype.draw = function()
{
	if (!this.texture.isLoaded)
		return;

	gl.bindBuffer(gl.ARRAY_BUFFER, this.pointLifeBuffer);
	gl.vertexAttribPointer(this.shader.program.lifetimeAttribute,
						   this.pointLifeBuffer.itemSize,
						   gl.FLOAT,
						   false,
						   0,
						   0);
						   
	gl.bindBuffer(gl.ARRAY_BUFFER, this.pointStartBuffer);
	gl.vertexAttribPointer(this.shader.program.startPositionAttribute,
						   this.pointStartBuffer.itemSize,
						   gl.FLOAT,
						   false,
						   0,
						   0);
						   
	gl.bindBuffer(gl.ARRAY_BUFFER, this.pointEndBuffer);
	gl.vertexAttribPointer(this.shader.program.endPositionAttribute,
						   this.pointEndBuffer.itemSize,
						   gl.FLOAT,
						   false,
						   0,
						   0);
						   
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, this.texture);
	gl.uniform1i(this.shader.program.samplerUniform, 0);
	
	gl.uniform4f(this.shader.program.colorUniform, 1.0, 1.0, 1.0, 1.0);
	gl.uniform1f(this.shader.program.timeUniform, this.time);
	
	gl.drawArrays(gl.POINTS, 0, this.pointLifeBuffer.numItems);
};

Emitter.prototype.update = function()
{
	this.time += 0.02;
	
	if (this.time >= 1.0)
		this.time = 0.0;
};