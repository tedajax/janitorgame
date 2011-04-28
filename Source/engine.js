function Engine()
{
	this.hud;
	this.healthVal;
};

Engine.prototype.init = function()
{
	this.hud = new HUD();
	this.healthVal = 100.0;
};

Engine.prototype.fireBullet = function()
{
	//var Bullet b = new Bullet();
	//b.initialize();
	//Bullets.push(b);
	
	Bullets.push(new Bullet());
};