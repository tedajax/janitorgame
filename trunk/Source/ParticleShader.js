engine.createInheritance(ParticleShader, Shader);

function ParticleShader()
{
	this.Shader();
	
	this.pMatrix = Matrix.I(4);
	this.mvMatrix = Matrix.I(4);
	
	this.texture = 0;
	
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
	this.program.vertexPositionAttribute = gl.getAttribLocation(this.program, "aVertexPosition");
	gl.enableVertexAttribArray(this.program.vertexPositionAttribute);
	
	this.program.textureCoordAttribute = gl.getAttribLocation(this.program, "aTextureCoord");
	gl.enableVertexAttribArray(this.program.textureCoordAttribute);
	
	this.program.pMatrixUniform = gl.getUniformLocation(this.program, "uPMatrix");
	this.program.mvMatrixUniform = gl.getUniformLocation(this.program, "uMVMatrix");
	
	this.program.samplerUniform = gl.getUniformLocation(this.program, "uTexSampler");
	this.program.colorUniform = gl.getUniformLocation(this.program, "uColor");
};

ParticleShader.prototype.drawSetup = function()
{
	gl.uniformMatrix4fv(this.program.pMatrixUniform, false, new Float32Array(this.pMatrix.flatten()));
	gl.uniformMatrix4fv(this.program.mvMatrixUniform, false, new Float32Array(this.mvMatrix.flatten()));
	
	gl.uniform1i(this.program.samplerUniform, 0);
	
	gl.uniform4f(this.program.colorUniform, this.color);
};