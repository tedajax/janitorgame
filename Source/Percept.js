function Percept()
{
	this.actor = new Object();
	this.target = new Object();

	this.thght = 0;
	this.timer = 0;
	
	this.actor.position = Vector.create([0.0, 0.0, 0.0]);
	this.actor.rotation = 0;
	this.actor.velocity = Vector.create([0.0, 0.0, 0.0]);
	this.actor.state = 0;
	
	this.target.position = Vector.create([0.0, 0.0, 0.0]);
	this.target.rotation = 0;
};