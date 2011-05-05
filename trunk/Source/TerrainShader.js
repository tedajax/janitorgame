engine.createInheritance(TerrainShader, Shader);

function TerrainShader()
{
	this.Shader();
	
	this.pMatrix = Matrix.I(4);
	this.mvMatrix = Matrix.I(4);
	this.nMatrix = Matrix.I(4);
	
	this.cameraPosition = Vector.create([0.0, 0.0, 0.0]);
	
	this.ambientColor = Vector.create([0.2, 0.2, 0.2]);
	this.lightingDirection = Vector.create([-0.25, -0.25, -1.0]);
	this.directionalColor = Vector.create([0.6, 0.6, 0.6]);
	this.specularColor = Vector.create([0.4, 0.4, 0.4]);
	
	this.texture1 = 0;
	this.texture2 = 1;
	this.texture3 = 2;
	this.texture4 = 3;
	
	this.maxHeight = 64.0;
	
	this.minFogDist = 20.0;
	this.maxFogDist = 50.0;
	this.fogColor = Vector.create([0.8, 0.8, 0.8]);
	this.fogEnabled = true;
	
	this.initLocales();
};

TerrainShader.prototype.fragFileString = function()
{
	return engine.getFileString(Shader.SHADER_DIR + "terrain-fs.glsl");
};

TerrainShader.prototype.vertFileString = function()
{
	return engine.getFileString(Shader.SHADER_DIR + "terrain-vs.glsl");
};

TerrainShader.prototype.initLocales = function()
{
	this.program.vertexPositionAttribute = gl.getAttribLocation(this.program, "aVertexPosition");
	gl.enableVertexAttribArray(this.program.vertexPositionAttribute);
	
	this.program.vertexNormalAttribute = gl.getAttribLocation(this.program, "aVertexNormal");
	gl.enableVertexAttribArray(this.program.vertexNormalAttribute);
	
	this.program.textureCoordAttribute = gl.getAttribLocation(this.program, "aTextureCoord");
	gl.enableVertexAttribArray(this.program.textureCoordAttribute);
	
	this.program.pMatrixUniform = gl.getUniformLocation(this.program, "uPMatrix");
	this.program.mvMatrixUniform = gl.getUniformLocation(this.program, "uMVMatrix");
	this.program.nMatrixUniform = gl.getUniformLocation(this.program, "uNMatrix");
	
	this.program.ambientColorUniform = gl.getUniformLocation(this.program, "uAmbientColor");
	this.program.lightingDirectionUniform = gl.getUniformLocation(this.program, "uLightingDirection");
	this.program.directionalColorUniform = gl.getUniformLocation(this.program, "uDirectionalColor");
	this.program.specularColorUniform = gl.getUniformLocation(this.program, "uSpecularColor");
	this.program.cameraPositionUniform = gl.getUniformLocation(this.program, "uCameraPos");
	
	this.program.samplerUniform0 = gl.getUniformLocation(this.program, "uTexSampler0");
	this.program.samplerUniform1 = gl.getUniformLocation(this.program, "uTexSampler1");
	this.program.samplerUniform2 = gl.getUniformLocation(this.program, "uTexSampler2");
	this.program.samplerUniform3 = gl.getUniformLocation(this.program, "uTexSampler3");
	
	this.program.maxTerrainHeight = gl.getUniformLocation(this.program, "uMaxHeight");
	
	this.program.minFogDist = gl.getUniformLocation(this.program, "uFogMinDist");
	this.program.maxFogDist = gl.getUniformLocation(this.program, "uFogMaxDist");
	this.program.fogColor = gl.getUniformLocation(this.program, "uFogColor");
	this.program.fogEnabled = gl.getUniformLocation(this.program, "uFogEnabled");
};

TerrainShader.prototype.drawSetup = function()
{
	gl.uniformMatrix4fv(this.program.pMatrixUniform, false, new Float32Array(this.pMatrix.flatten()));
	gl.uniformMatrix4fv(this.program.mvMatrixUniform, false, new Float32Array(this.mvMatrix.flatten()));
	gl.uniformMatrix4fv(this.program.nMatrixUniform, false, new Float32Array(this.nMatrix.flatten()));
	
	gl.uniform3f(this.program.cameraPositionUniform, this.cameraPosition.e(1), this.cameraPosition.e(2), this.cameraPosition.e(3));
	
	var lightDir = Vector.create([this.lightingDirection.e(1), this.lightingDirection.e(2), this.lightingDirection.e(3)]);
	var ld = Vector.create([lightDir.e(1), 
							lightDir.e(2),
							lightDir.e(3),
							1.0]);
	ld = this.nMatrix.multiply(ld);
	lightDir = Vector.create([ld.e(1), ld.e(2), ld.e(3)]);
	var adjustedLD = lightDir.toUnitVector().x(-1);
	var flatLD = adjustedLD.flatten();
	gl.uniform3fv(this.program.lightingDirectionUniform, flatLD);
	
	gl.uniform3f(this.program.ambientColorUniform, this.ambientColor.e(1), 
	            this.ambientColor.e(2), this.ambientColor.e(3));
	gl.uniform3f(this.program.directionalColorUniform, this.directionalColor.e(1), 
	            this.directionalColor.e(2), this.directionalColor.e(3));
	gl.uniform3f(this.program.specularColorUniform, this.specularColor.e(1), 
	            this.specularColor.e(2), this.specularColor.e(3));			
				
	gl.uniform1i(this.program.samplerUniform0, 0);
	gl.uniform1i(this.program.samplerUniform1, 1);
	gl.uniform1i(this.program.samplerUniform2, 2);
	gl.uniform1i(this.program.samplerUniform3, 3);
	
	gl.uniform1f(this.program.maxTerrainHeight, this.maxHeight);
	
	gl.uniform1f(this.program.minFogDist, this.minFogDist);
	gl.uniform1f(this.program.maxFogDist, this.maxFogDist);
	gl.uniform3f(this.program.fogColor, this.fogColor.e(1), this.fogColor.e(2), this.fogColor.e(3));
	gl.uniform1i(this.program.fogEnabled, this.fogEnabled);
};