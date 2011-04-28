function Models()
{
	Models.bullet;
	Models.enemy1;
	Models.enemy2;
	Models.enemy3;
};

function loadModels()
{
	Models.bullet = loadObj("teapot.obj");
	Models.enemy1 = loadObj("teapot.obj");
	Models.enemy2 = loadObj("trex.obj");
	Models.enemy3 = loadObj("Statue.obj");
};

function GameObject()
{
	this.position;
	this.velocity;
	this.rotation;
	this.scale;
	
	this.model;
	
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