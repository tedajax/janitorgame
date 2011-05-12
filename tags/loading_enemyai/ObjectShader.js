engine.createInheritance(ObjectShader, Shader);

function ObjectShader()
{
	this.Shader();
	
	this.pMatrix = Matrix.I(4);
	this.mvMatrix = Matrix.I(4);
	
	this.pos = Vector.create([0.0, 0.0, 0.0]);
	
	this.cameraPosition = Vector.create([0.0, 0.0, 0.0]);
	
	this.texture1 = 0;
	
	this.minFogDist = 30.0;
	this.maxFogDist = 100.0;
	this.fogColor = Vector.create([0.5, 0.5, 0.1]);
	this.fogEnabled = true;
	
	this.initLocales();
};

ObjectShader.prototype.fragFileString = function()
{
	return engine.getFileString(Shader.SHADER_DIR + "object-fs.glsl");
};

ObjectShader.prototype.vertFileString = function()
{
	return engine.getFileString(Shader.SHADER_DIR + "object-vs.glsl");
};

ObjectShader.prototype.initLocales = function()
{
	this.program.vertexPositionAttribute = gl.getAttribLocation(this.program, "aVertexPosition");
	gl.enableVertexAttribArray(this.program.vertexPositionAttribute);
	
	this.program.textureCoordAttribute = gl.getAttribLocation(this.program, "aTextureCoord");
	gl.enableVertexAttribArray(this.program.textureCoordAttribute);
	
	this.program.pMatrixUniform = gl.getUniformLocation(this.program, "uPMatrix");
	this.program.mvMatrixUniform = gl.getUniformLocation(this.program, "uMVMatrix");
	
	this.program.cameraPositionUniform = gl.getUniformLocation(this.program, "uCameraPos");
	this.program.objectPositionUniform = gl.getUniformLocation(this.program, "uObjPos");
	
	this.program.samplerUniform0 = gl.getUniformLocation(this.program, "uTexSampler0");
	
	this.program.minFogDist = gl.getUniformLocation(this.program, "uFogMinDist");
	this.program.maxFogDist = gl.getUniformLocation(this.program, "uFogMaxDist");
	this.program.fogColor = gl.getUniformLocation(this.program, "uFogColor");
	this.program.fogEnabled = gl.getUniformLocation(this.program, "uFogEnabled");
};

ObjectShader.prototype.drawSetup = function()
{
	gl.uniformMatrix4fv(this.program.pMatrixUniform, false, new Float32Array(this.pMatrix.flatten()));
	gl.uniformMatrix4fv(this.program.mvMatrixUniform, false, new Float32Array(this.mvMatrix.flatten()));
	
	gl.uniform3f(this.program.cameraPositionUniform, camera.X, camera.Y, camera.Z);
	gl.uniform3f(this.program.objectPositionUniform, this.pos.e(1), this.pos.e(2), this.pos.e(3));
	
	gl.uniform1i(this.program.samplerUniform0, 0);
	
	gl.uniform1f(this.program.minFogDist, this.minFogDist);
	gl.uniform1f(this.program.maxFogDist, this.maxFogDist);
	gl.uniform3f(this.program.fogColor, this.fogColor.e(1), this.fogColor.e(2), this.fogColor.e(3));
	gl.uniform1i(this.program.fogEnabled, this.fogEnabled);
};