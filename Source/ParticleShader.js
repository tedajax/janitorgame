engine.createInheritance(ParticleShader, Shader);

function ParticleShader()
{
	this.Shader();
	
	this.pMatrix = Matrix.I(4);
	this.mvMatrix = Matrix.I(4);
	
	this.texture = 0;
	
	this.time = 0;
	
	this.color = Vector.create([1.0, 1.0, 1.0, 1.0]);
	
	this.initLocales();
};

ParticleShader.prototype.fragFileString = function()
{
	return engine.getFileString(Shader.SHADER_DIR + "pointsprite-fs.glsl");
};

ParticleShader.prototype.vertFileString = function()
{
	return engine.getFileString(Shader.SHADER_DIR + "pointsprite-vs.glsl");
};

ParticleShader.prototype.initLocales = function()
{
	this.program.lifetimeAttribute = gl.getAttribLocation(this.program, "aLifetime");
	gl.enableVertexAttribArray(this.program.lifetimeAttribute);
	
	this.program.startPositionAttribute = gl.getAttribLocation(this.program, "aStartPosition");
	gl.enableVertexAttribArray(this.program.startPositionAttribute);
	
	this.program.endPositionAttribute = gl.getAttribLocation(this.program, "aEndPosition");
	gl.enableVertexAttribArray(this.program.endPositionAttribute);
	
	//TODO: add pMatrix and mvMatrix
	
	this.program.samplerUniform = gl.getUniformLocation(this.program, "uTexSampler");
	
	this.program.timeUniform = gl.getUniformLocation(this.program, "uTime");
	
	this.program.colorUniform = gl.getUniformLocation(this.program, "uColor");
};

ParticleShader.prototype.drawSetup = function()
{
	//TODO: pMatrix/mvMatrix stuff
	
	gl.uniform1i(this.program.samplerUniform, this.texture);
	gl.uniform1f(this.program.timeUniform, this.time);
	gl.uniform4f(this.program.colorUniform, this.color);
};