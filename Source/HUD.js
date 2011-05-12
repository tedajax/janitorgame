function HUD() {
	this.canvas = document.getElementById("hudCanvas");
	this.ctx = this.canvas.getContext('2d');
	this.canvas.style.visiability = "visible";
	this.canvas.style.position = "absolute";
	this.canvas.style.top = "0px";
	this.canvas.style.left = "0px";
	
	this.t1XPercent = 0.02;
	this.t1YPercent = 0.05;
	
	this.tX = 0;
	this.tY = 0;
		
	this.pHealth;
	this.eHealth;
};

HUD.prototype.update = function(pHealth, eHealth) {
	this.pHealth = pHealth;
	this.eHealth = eHealth;

	var cont=this.canvas.parentNode;
	if ((this.canvas.width!=cont.clientWidth)||(this.canvas.height!=cont.clientHeight))
	{
		this.canvas.width=cont.clientWidth;
		this.canvas.height=cont.clientHeight;
	}
	
	this.tX = this.canvas.width * this.t1XPercent;
	this.tY = this.canvas.height * this.t1YPercent;
		
};

HUD.prototype.draw = function() {
	this.ctx.fillStyle = "rgba(255, 0, 0, 1)";
			this.ctx.font = 'bold 20px courier';
			this.ctx.textBaseLine = 'top';
			this.ctx.fillText("Health:" + this.pHealth, this.tX, this.tY);
}

