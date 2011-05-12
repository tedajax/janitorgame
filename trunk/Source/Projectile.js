/* ***************************************************
*						Projectile					 *
*************************************************** */

function Projectile(position, direction) {
	this.position = position;
	this.direction = direction;
	this.dead = false;
}

function ProjectileList(position) {
	this.model = new Model("../Assets/Models/banana.obj", "../Assets/Textures/banana.bmp");
	this.dead = false;
	this.speed = 0.01;	
	// this.scale = [0.01,0.01,0.01];
	this.scale = [0.001,0.001,0.001];
	this.collisionRadius = 1 * this.scale[0];
	this.pArray = new Array();
};

ProjectileList.prototype.Add = function(position, direction) {
	this.pArray.push(new Projectile(position, direction));
};

ProjectileList.prototype.Update = function(timeElapsed) {
	var tempSpeed = timeElapsed * this.speed / 60;
	for(var x = 0; x < this.pArray.length; x++) {
		this.pArray[x].position.e(1) += tempSpeed * this.pArray[x].direction.e(1);
		this.pArray[x].position.e(2) = 15;		
		this.pArray[x].position.e(3) += tempSpeed * this.pArray[x].direction.e(3);
		
		if(this.pArray[x].position.e(1) < 68) { this.pArray[x].dead = true; }
		if(this.pArray[x].position.e(1) > 184) { this.pArray[x].dead = true; }
		if(this.pArray[x].position.e(3) < 68) { this.pArray[x].dead = true; }
		if(this.pArray[x].position.e(3) > 184) { this.pArray[x].dead = true; }


	}
	this.CheckCollision();
};

ProjectileList.prototype.Draw = function() {
	for(var x = 0; x < this.pArray.length; x++) {
		if(!this.pArray[x].dead) {
			mvTranslate(this.pArray[x].position);
			mvScale([0.03, 0.03, 0.03]);
			this.model.Draw();
			mvMatrix = mvMatrix_bak;
		}
	}
};

ProjectileList.prototype.CheckCollision = function() {	
	for(var x = 0; x < this.pArray.length; x++) {
		var enemyPos = enemy.getPosition();
	
		var dx = this.pArray[x].position.e(1) - enemyPos.e(1);
		var dy = this.pArray[x].position.e(2) - enemyPos.e(2);
		var dz = this.pArray[x].position.e(3) - enemyPos.e(3);
	
		var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2));
		var sumradius = this.collisionRadius + enemy.getCollisionRadius();
		if(distance < sumradius) { 
			enemy.Health(-1); 
			this.pArray[x].dead = true;
		}
	}
};