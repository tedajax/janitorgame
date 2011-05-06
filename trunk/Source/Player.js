engine.createInheritance(Player, GameObject);
var piOver180 = Math.PI / 180;

function Player() { 
	this.height = 4;
	this.position = Vector.create([50.0, 50.0, 50.0]);
	this.yaw = 90;
	this.pitch = 0;
	this.speed = 20;
	this.forward = 0;
	this.side = 0;
	this.yrot = 0;
	this.prot = 0;
	this.useController = true;
	
	this.Init();
};

Player.prototype.Init = function() {
	camera.SetPosition(this.position);
	camera.SetRotation(this.yaw, this.pitch);
};

Player.prototype.Update = function(dTime) {
	//console.log("Player Update");
	this.CheckInput();
	this.MovePlayer(dTime);
	this.Reset();
	camera.SetPosition(this.position);
	camera.SetRotation(this.yaw, this.pitch);
};

Player.prototype.Draw = function() {

};

Player.prototype.CheckInput = function() {
	if(this.useController) {
		if(controller.StickX() < controller.LowerDZ()){
			this.side = -1;
		} else if(controller.StickX() > controller.UpperDZ()) {
			this.side = 1;
		}
		
		if(controller.StickY() < controller.LowerDZ()){
			this.forward = 1;
		} else if(controller.StickY() > controller.UpperDZ()) {
			this.forward = -1;
		}
		
		if(!(controller.PadLB() && controller.PadRB())) {
			if(controller.PadLB()) { this.yrot = -1; }
			if(controller.PadRB()) { this.yrot = 1; }
		}
		
		if(controller.PadA()) {
			//this.Jump();
			console.log("Jump");
		}
		
		if(controller.PadB()) {
			//this.Shoop();
			console.log("Shoot");
		}
	} else {
		if(controller.KeyPressed(87)) { //W
			this.forward = this.forward = 1;
		} else if(controller.KeyPressed(83)) { //S
			this.forward = this.forward = -1;
		}

		if(controller.KeyPressed(68)) { //D
			this.side = this.side = 1;
		} else if(controller.KeyPressed(65)) { //A
			this.side = this.side = -1;
		}


		if(controller.KeyPressed(39)) { //Right
			this.yrot = 1;
		} else if(controller.KeyPressed(37)) { //Left
			this.yrot = -1;
		}

		if(controller.KeyPressed(38)) { //Up
			this.prot = -1;
		} else if(controller.KeyPressed(40)) { //Down
			this.prot = 1;
		}
	}
};

Player.prototype.MovePlayer = function(dTime) {
	var x = this.position.e(1);
	var y = this.position.e(2);
	var z = this.position.e(3);
	if(this.forward != 0) {
		x += Math.cos((this.yaw - 90) * piOver180) * this.forward * this.speed * dTime;
		z += Math.sin((this.yaw - 90) * piOver180) * this.forward * this.speed * dTime;
	}
	
	if(this.side != 0) {
		x += Math.cos(this.yaw * piOver180) * this.side * this.speed * dTime;
		z += Math.sin(this.yaw * piOver180) * this.side * this.speed * dTime;
	}
	if(this.yrot != 0) {
		this.yaw += this.yrot * this.speed * dTime;
	}
	if(this.prot != 0) {
		this.pitch += this.prot * this.speed * dTime;
	}
	
	y = testTerrain.getHeight(x,z) + 10;
	this.position = Vector.create([x,y,z]);
};

Player.prototype.Reset = function() {
	this.forward = 0;
	this.side = 0;
	this.yrot = 0;
	this.prot = 0;
};