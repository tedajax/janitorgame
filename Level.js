function Command()
{
	this.command = "";
	this.argcount = 0;
	this.args = new Array();
};

function Level()
{
	this.blocks;
	this.triggers;
	
	this.blockcount = 0;
	this.triggercount = 0;
	
	this.levelString = "";
	
	this.addingBlock = false;
	this.currentBlock = 0;
	
	Level.LEVEL_DIR = "./Assets/Levels/";
	
	this.initialize();
};

Level.prototype.initialize = function()
{
	this.blocks = new Array();
	this.triggers = new Array();
};

Level.prototype.update = function()
{
	for (var b in this.blocks)
	{
		b.update();
	}
};

Level.prototype.draw = function()
{
	for (var b in this.blocks)
	{
		this.blocks[b].draw();
	}
};

Level.prototype.processCommand = function(command)
{
	if (command.command == "block")
	{
		if (this.addingBlock)
			alert("Cannot load level file, error in command: " + command.command);
		
		this.addingBlock = true;
		this.currentBlock = command.args[0];
		this.blocks[this.currentBlock] = new Block();
	}
	else if (command.command == "position")
	{
		if (!this.addingBlock)
			alert("Cannot load level file, error in command: " + command.command);
			
		this.blocks[this.currentBlock].position = Vector.create([command.args[0], command.args[1], command.args[2]]);
	}
	else if (command.command == "texture")
	{
		if (!this.addingBlock)
			alert("Cannot load level file, error in command: " + command.command);
			
		this.blocks[this.currentBlock].textureName = command.args[0];
		this.blocks[this.currentBlock].loadTextureName();
	}
	else if (command.command == "end")
	{
		if (!this.addingBlock)
			alert("Cannot load level file, error in command: " + command.command);
			
		this.currentBlock = 0;
		this.addingBlock = false;
		this.blockcount++;
	}
};

Level.prototype.getCommand = function(line)
{
	var tokens = line.split(" ");
	var command = tokens[0];
	
	var c = new Command();
	c.command = command.slice(1).toLowerCase();
	c.argcount = tokens.length - 1;
	c.args = tokens.slice(1);
	
	return c;
};

Level.prototype.loadLevel = function(url)
{
	levelString = engine.getFileString(Level.LEVEL_DIR + url);
	
	var lines = levelString.split("\n");
	for (var index in lines)
	{
		var line = lines[index];
		if (line[0] == '#')
		{
			this.processCommand(this.getCommand(line));
		}
	}
};