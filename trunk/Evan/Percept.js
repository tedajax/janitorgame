function Percept()
{
	this.actor = new Object();
	this.target = new Object();

	this.actor.position = Vector.create([0.0, 0.0, 0.0]);
	this.actor.rotation = 0;
	this.actor.state = 0;
	
	this.target.position = Vector.create([0.0, 0.0, 0.0]);
	this.target.rotation = 0;
};