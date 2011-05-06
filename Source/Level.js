function Level()
{
	this.blocks;
	this.triggers;
	
	this.blockcount = 0;
	this.triggercount = 0;
	
	this.initialize();
};

Level.prototype.initialize = function()
{
	this.blocks = new Array();
	this.triggers = new Array();
};

Level.prototype.loadLevel = function(url)
{
	
};