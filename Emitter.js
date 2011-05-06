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
};

//position - the position for the explosion to occur
//radius - the radius of the explosion
//count - the number of particles in the explosion
Emitter.prototype.createExplosion = function(position, radius, count)
{
	
};