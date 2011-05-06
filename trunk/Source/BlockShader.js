engine.createInheritance(BlockShader, Shader);

function BlockShader()
{
	this.Shader();
	
	this.pMatrix = Matrix.I(4);
	this.mvMatrix = Matrix.I(4);
	
	this.cameraPosition = Vector.create([0.0, 0.0, 0.0]);
	
	this.texture1 = 0;
	
	this.minFogDist = 20.0;
	this.maxFogDist = 50.0;
	this.fogColor = Vector.create([0.5, 0.5, 0.8]);
	this.fogEnabled = true;
	
	this.initLocales();
};

BlockShader.prototype.fragFileString = function()
{
	return engine.getFileString(Shader.SHADER_DIR + "block-fs.glsl");
};

BlockShader.prototype.vertFileString = function()
{
	return engine.getFileString(Shader.SHADER_DIR + "block-vs.glsl");
};

BlockShader.prototype.initLocales = function()
{
	this.program.vertexPositionAttribute = gl.getAttribLocation(this.program, "aVertexPosition");
	gl.enableVertexAttribArray(this.program.vertexPositionAttribute);
	
	this.program.textureCoordAttribute = gl.getAttribLocation(this.program, "aTextureCoord");
	gl.enableVertexAttribArray(this.program.textureCoordAttribute);
	
	this.program.pMatrixUniform = gl.getUniformLocation(this.program, "uPMatrix");
	this.program.mvMatrixUniform = gl.getUniformLocation(this.program, "uMVMatrix");
	
	this.program.cameraPositionUniform = gl.getUniformLocation(this.program, "uCameraPos");
	
	this.program.samplerUniform0 = gl.getUniformLocation(this.program, "uTexSampler0");
	
	this.program.minFogDist = gl.getUniformLocation(this.program, "uFogMinDist");
	this.program.maxFogDist = gl.getUniformLocation(this.program, "uFogMaxDist");
	this.program.fogColor = gl.getUniformLocation(this.program, "uFogColor");
	this.program.fogEnabled = gl.getUniformLocation(this.program, "uFogEnabled");
};

BlockShader.prototype.drawSetup = function()
{
	gl.uniformMatrix4fv(this.program.pMatrixUniform, false, new Float32Array(this.pMatrix.flatten()));
	gl.uniformMatrix4fv(this.program.mvMatrixUniform, false, new Float32Array(this.mvMatrix.flatten()));
	
	gl.uniform3f(this.program.cameraPositionUniform, this.cameraPosition.e(1), this.cameraPosition.e(2), this.cameraPosition.e(3));
	
	gl.uniform1i(this.program.samplerUniform0, 0);
	
	gl.uniform1f(this.program.minFogDist, this.minFogDist);
	gl.uniform1f(this.program.maxFogDist, this.maxFogDist);
	gl.uniform3f(this.program.fogColor, this.fogColor.e(1), this.fogColor.e(2), this.fogColor.e(3));
	gl.uniform1i(this.program.fogEnabled, this.fogEnabled);
};