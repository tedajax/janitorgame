function Shader()
{
	Shader.SHADER_DIR = "Assets/Shaders/";
	
	this.program;
	this.initialize();
};

Shader.prototype.initialize = function()
{
	var fragmentShader = this.getFragShader();
	var vertexShader = this.getVertShader();
	
	this.program = gl.createProgram();
	gl.attachShader(this.program, vertexShader);
	gl.attachShader(this.program, fragmentShader);
	gl.linkProgram(this.program);
	
	if (!gl.getProgramParameter(this.program, gl.LINK_STATUS))
	{
		alert("Shaders are broked");
	}
	
	gl.useProgram(this.program);
};
Shader.prototype.getFragShader = function()
{
	var shadeStr = this.fragFileString();
	
	var shader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(shader, shadeStr);
	gl.compileShader(shader);
	
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
	{
		alert(gl.getShaderInfoLog(shader));
		return null;
	}
	
	return shader;
};

Shader.prototype.getVertShader = function()
{
	var shadeStr = this.vertFileString();
	
	var shader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(shader, shadeStr);
	gl.compileShader(shader);
	
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
	{
		alert(gl.getShaderInfoLog(shader));
		return null;
	}
	
	return shader;
};

Shader.prototype.fragFileString = function()
{
	return engine.getFileString(Shader.SHADER_DIR + "basic-fs.glsl");
};

Shader.prototype.vertFileString = function()
{
	return engine.getFileString(Shader.SHADER_DIR + "basic-vs.glsl");
};

//called before use with objects which use this shader
Shader.prototype.drawSetup = function()
{

};

Shader.prototype.initLocales = function()
{
	
};
