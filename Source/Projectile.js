// /* ***************************************************
// *						Projectile					 *
// *************************************************** */

// function Projectile(position, velocity) {
	// this.position = position;
	// this.velocity = velocity;
	// this.isDead = false;
// };

// function ProjectileList() {
	// this.particle = new Particle();
	// this.isDead = false;
	// this.speed = 0.01;
	// this.cRadius = 1;
	// this.pList = new Array();
	// this.particle.texture = engine.aManager.getTexture("greenparticle.png");
// };

// ProjectileList.prototype.add = new function(position, velocity) {
	// this.pList.push(new Projectile(position, velocity));
// };

// ProjectileList.prototype.update = function() {
	// // for(var i = 0; i < this.pList.length; i++) {
		// // this.particle.position = this.pList[i].position;
	// // }
// };

// ProjectileList.prototype.draw = function() {
	// for(var i = 0; i < this.pList.length; i++) {
		// this.particle.position = this.pList[i].position;
		// this.particle.draw();
	// }
// };

function Projectile(position, direction) {
	this.position = position;
	this.direction = direction;
	this.dead = false;
}

function ProjectileList() {
	this.particle = new Particle();
	this.dead = false;
	this.speed = 0.01;	
	this.collisionRadius = 1
	this.pArray = new Array();
	this.particle.texture = engine.aManager.getTexture("greenparticle.png");
};

ProjectileList.prototype.Add = function(position, direction) {
	this.pArray.push(new Projectile(position, direction));
};

ProjectileList.prototype.Update = function(timeElapsed) {
	//var tempSpeed = timeElapsed * this.speed / 60;
	var tempSpeed = 1.5;
	for(var x = 0; x < this.pArray.length; x++) {
		this.pArray[x].position.elements[0] += tempSpeed * this.pArray[x].direction.e(1);
		this.pArray[x].position.elements[1] = 25;		
		this.pArray[x].position.elements[2] += tempSpeed * this.pArray[x].direction.e(3);
		
		if(this.pArray[x].position.elements[0] < 68) { this.pArray[x].dead = true; }
		if(this.pArray[x].position.elements[0] > 184) { this.pArray[x].dead = true; }
		if(this.pArray[x].position.elements[2] < 68) { this.pArray[x].dead = true; }
		if(this.pArray[x].position.elements[2] > 184) { this.pArray[x].dead = true; }
	}
	this.CheckCollision();
};

ProjectileList.prototype.Draw = function() {
	for(var x = 0; x < this.pArray.length; x++) {
		if(!this.pArray[x].dead) {
			//mvTranslate(this.pArray[x].position);
			this.particle.position = this.pArray[x].position;
			//mvScale([0.03, 0.03, 0.03]);
			this.particle.draw();
			//mvMatrix = mvMatrix_bak;
		}
	}
};

ProjectileList.prototype.CheckCollision = function() {	
	for(var x = 0; x < this.pArray.length; x++) {
		var bossPos = boss.position;
	
		var dx = this.pArray[x].position.e(1) - bossPos.e(1);
		var dy = (this.pArray[x].position.e(2) - bossPos.e(2)) / 2;
		var dz = this.pArray[x].position.e(3) - bossPos.e(3);
	
		var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2));
		var sumradius = this.collisionRadius + boss.getCollisionRadius();
		if(distance < sumradius) { 
			boss.Health(-1); 
			this.pArray[x].dead = true;
		}
	}
}; 	