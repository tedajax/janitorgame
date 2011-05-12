function GameObject()
{
	this.position = Vector.create([0.0, 0.0, 0.0]);
	this.velocity = Vector.create([0.0, 0.0, 0.0]);;
	this.rotation = 0.0;
	this.scale = Vector.create([1.0, 1.0, 1.0]);;
	
	this.model;
	this.texture;
	
	this.worldMatrix = Matrix.I(4);
	
	this.collRadius;
	this.initialize();
};

GameObject.prototype.initialize = function()
{

};

GameObject.prototype.loadModel = function()
{
	
};

GameObject.prototype.update = function()
{
	
};

GameObject.prototype.draw = function()
{

};