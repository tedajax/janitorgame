/***************************************************************************************************
//File:					shaderUtils.js
//Original author:		Mike McClish
//Author:				Evan Pittfield
//Date:					3-24-2011
//Purpose:				Initialize, get, and make shaders.
***************************************************************************************************/

function getShader(gl, id) 
{
	var shaderScript = document.getElementById(id);
	if (!shaderScript) 
	{
		return null;
	}

	var str = "";
	var k = shaderScript.firstChild;
	while (k) 
	{
		if (k.nodeType == 3) 
		{
			str += k.textContent;
		}
		k = k.nextSibling;
	}

	str = shaderScript.innerHTML; 

	var shader;
	if (shaderScript.type == "x-shader/x-fragment") 
	{
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} 
	else if (shaderScript.type == "x-shader/x-vertex") 
	{
		shader = gl.createShader(gl.VERTEX_SHADER);
	} 
	else 
	{
		return null;
	}
 
	gl.shaderSource(shader, str);
	gl.compileShader(shader);
 
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) 
	{
		alert(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}

function initShaders() {
	//Shader for heightmap
	var fragmentShader = getShader(gl, "shader-fs");
	var vertexShader = getShader(gl, "shader-vs");
 
	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);
 
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
	{
		alert("Could not initialise shaders");
	}
 
	gl.useProgram(shaderProgram);
 
	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

	shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "aVertexNormal");
	gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);

	shaderProgram.vertexTextureCoordsAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
	gl.enableVertexAttribArray(shaderProgram.vertexTextureCoordsAttribute);
 
	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.vMatrixUniform = gl.getUniformLocation(shaderProgram, "uVMatrix");
	shaderProgram.mMatrixUniform = gl.getUniformLocation(shaderProgram, "uMMatrix");
	shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");

	shaderProgram.samplerUniformA = gl.getUniformLocation(shaderProgram, "uSamplerA");
	shaderProgram.samplerUniformB = gl.getUniformLocation(shaderProgram, "uSamplerB");
	shaderProgram.samplerUniformC = gl.getUniformLocation(shaderProgram, "uSamplerC");

	shaderProgram.lightPositionUniform = gl.getUniformLocation(shaderProgram, "lightPosition");
	shaderProgram.viewerPositionUniform = gl.getUniformLocation(shaderProgram, "viewerPosition");
	
	
	//Depth shader
	var fragDepthShader = getShader(gl, "shader-fs-depth");
	var vertDepthShader = getShader(gl, "shader-vs-depth");

	depthProgram = gl.createProgram();
	gl.attachShader(depthProgram, vertDepthShader);
	gl.attachShader(depthProgram, fragDepthShader);
	gl.linkProgram(depthProgram);

	if (!gl.getProgramParameter(depthProgram, gl.LINK_STATUS))
	{
		alert("Could not initialise depth shader!");
	}

	gl.useProgram(depthProgram);

	depthProgram.vertexPositionAttribute = gl.getAttribLocation(depthProgram, "aVertexPosition");
	gl.enableVertexAttribArray(depthProgram.vertexPositionAttribute);

	depthProgram.vertexNormalAttribute = gl.getAttribLocation(depthProgram, "aVertexNormal");
	gl.disableVertexAttribArray(depthProgram.vertexNormalAttribute);

	depthProgram.vertexTextureCoordsAttribute = gl.getAttribLocation(depthProgram, "aTextureCoord");
	gl.enableVertexAttribArray(depthProgram.vertexTextureCoordsAttribute);

	depthProgram.samplerUniform = gl.getUniformLocation(depthProgram, "uSampler");

	depthProgram.pMatrixUniform = gl.getUniformLocation(depthProgram, "uPMatrix");
	depthProgram.mMatrixUniform = gl.getUniformLocation(depthProgram, "uMMatrix");
	depthProgram.vMatrixUniform = gl.getUniformLocation(depthProgram, "uVMatrix");
	depthProgram.nMatrixUniform = gl.getUniformLocation(depthProgram, "uNMatrix");





	//Primitive shader
	var fragPrimitiveShader = getShader(gl, "shader-fs-primitive");
	var vertPrimitiveShader = getShader(gl, "shader-vs-primitive");

	primitiveProgram = gl.createProgram();
	gl.attachShader(primitiveProgram, vertPrimitiveShader);
	gl.attachShader(primitiveProgram, fragPrimitiveShader);
	gl.linkProgram(primitiveProgram);

	if (!gl.getProgramParameter(primitiveProgram, gl.LINK_STATUS))
	{
		alert("Could not initialise primitive shader!");
	}

	gl.useProgram(primitiveProgram);

	primitiveProgram.vertexPositionAttribute = gl.getAttribLocation(primitiveProgram, "aVertexPosition");
	gl.enableVertexAttribArray(primitiveProgram.vertexPositionAttribute);

	primitiveProgram.colorUniform = gl.getUniformLocation(primitiveProgram, "uColor");
	primitiveProgram.pMatrixUniform = gl.getUniformLocation(primitiveProgram, "uPMatrix");
	primitiveProgram.mMatrixUniform = gl.getUniformLocation(primitiveProgram, "uMMatrix");
	primitiveProgram.vMatrixUniform = gl.getUniformLocation(primitiveProgram, "uVMatrix");
	primitiveProgram.nMatrixUniform = gl.getUniformLocation(primitiveProgram, "uNMatrix");

	//Skybox shader
	var fragSkyboxShader = getShader(gl, "shader-fs-skybox");
	var vertSkyboxShader = getShader(gl, "shader-vs-skybox");

	skyboxProgram = gl.createProgram();
	gl.attachShader(skyboxProgram, vertSkyboxShader);
	gl.attachShader(skyboxProgram, fragSkyboxShader);
	gl.linkProgram(skyboxProgram);

	if (!gl.getProgramParameter(skyboxProgram, gl.LINK_STATUS))
	{
		alert("Could not initialise skybox shader!");
	}

	gl.useProgram(skyboxProgram);

	skyboxProgram.vertexPositionAttribute = gl.getAttribLocation(skyboxProgram, "aVertexPosition");
	gl.enableVertexAttribArray(skyboxProgram.vertexPositionAttribute);

	skyboxProgram.vertexNormalAttribute = gl.getAttribLocation(skyboxProgram, "aVertexNormal");
	gl.enableVertexAttribArray(skyboxProgram.vertexNormalAttribute);

	skyboxProgram.pMatrixUniform = gl.getUniformLocation(skyboxProgram, "uPMatrix");
	skyboxProgram.mMatrixUniform = gl.getUniformLocation(skyboxProgram, "uMMatrix");
	skyboxProgram.vMatrixUniform = gl.getUniformLocation(skyboxProgram, "uVMatrix");
	skyboxProgram.nMatrixUniform = gl.getUniformLocation(skyboxProgram, "uNMatrix");

	skyboxProgram.samplerUniform = gl.getUniformLocation(skyboxProgram, "uSampler");

	skyboxProgram.lightPositionUniform = gl.getUniformLocation(skyboxProgram, "lightPosition");
	skyboxProgram.viewerPositionUniform = gl.getUniformLocation(skyboxProgram, "viewerPosition");


	//Standard shader to use
	var fragShaderStandard = getShader(gl, "shader-fs-standard");
	var vertShaderStandard = getShader(gl, "shader-vs-standard");
 
	shaderProgramStandard = gl.createProgram();
	gl.attachShader(shaderProgramStandard, vertShaderStandard);
	gl.attachShader(shaderProgramStandard, fragShaderStandard);
	gl.linkProgram(shaderProgramStandard);
 
	if (!gl.getProgramParameter(shaderProgramStandard, gl.LINK_STATUS))
	{
		alert("Could not initialise standard shader!");
	}
 
	gl.useProgram(shaderProgramStandard);

	shaderProgramStandard.vertexPositionAttribute = gl.getAttribLocation(shaderProgramStandard, "aVertexPosition");
	gl.enableVertexAttribArray(shaderProgramStandard.vertexPositionAttribute);

	shaderProgramStandard.vertexNormalAttribute = gl.getAttribLocation(shaderProgramStandard, "aVertexNormal");
	gl.enableVertexAttribArray(shaderProgramStandard.vertexNormalAttribute);

	shaderProgramStandard.vertexTextureCoordsAttribute = gl.getAttribLocation(shaderProgramStandard, "aTextureCoord");
	gl.enableVertexAttribArray(shaderProgramStandard.vertexTextureCoordsAttribute);
 
	shaderProgramStandard.pMatrixUniform = gl.getUniformLocation(shaderProgramStandard, "uPMatrix");
	shaderProgramStandard.vMatrixUniform = gl.getUniformLocation(shaderProgramStandard, "uVMatrix");
	shaderProgramStandard.mMatrixUniform = gl.getUniformLocation(shaderProgramStandard, "uMMatrix");
	shaderProgramStandard.nMatrixUniform = gl.getUniformLocation(shaderProgramStandard, "uNMatrix");

	shaderProgramStandard.samplerUniform = gl.getUniformLocation(shaderProgramStandard, "uSampler");

	shaderProgramStandard.lightPositionUniform = gl.getUniformLocation(shaderProgramStandard, "lightPosition");
	shaderProgramStandard.viewerPositionUniform = gl.getUniformLocation(shaderProgramStandard, "viewerPosition");

	//shaderProgramStandard.cameraRotationUniform = gl.getUniformLocation(shaderProgramStandard, "cameraRotation");
	
	//Set shader program to the standard tonal program in index.html
	shaderProgramStandard.tonalShadeUniform = gl.getUniformLocation(shaderProgramStandard, "tonal");
	
	//Get location for the shader to sample from.
	shaderProgramStandard.t1Uniform = gl.getUniformLocation(shaderProgramStandard, "u_t1");
	shaderProgramStandard.t2Uniform = gl.getUniformLocation(shaderProgramStandard, "u_t2");
	shaderProgramStandard.t3Uniform = gl.getUniformLocation(shaderProgramStandard, "u_t3");
	shaderProgramStandard.t4Uniform = gl.getUniformLocation(shaderProgramStandard, "u_t4");
	shaderProgramStandard.t5Uniform = gl.getUniformLocation(shaderProgramStandard, "u_t5");
	shaderProgramStandard.t6Uniform = gl.getUniformLocation(shaderProgramStandard, "u_t6");
}


function setGlobalUniforms(shader)
{
	gl.useProgram(shader);

	gl.uniformMatrix4fv(shader.pMatrixUniform, false, new Float32Array(pMatrix.flatten()));
	gl.uniformMatrix4fv(shader.vMatrixUniform, false, new Float32Array(vMatrix.flatten()));

	var normalMatrix = vMatrix.inverse();
	normalMatrix = normalMatrix.transpose();
	gl.uniformMatrix4fv(shader.nMatrixUniform, false, new Float32Array(normalMatrix.flatten()));

	//Transform the light
	var t = vMatrix.x($V([lightPos[0], lightPos[1], lightPos[2], 1.0]));	

	gl.uniform3f(shader.lightPositionUniform, t.e(1), t.e(2), t.e(3));
//	gl.uniform3f(shader.lightPositionUniform, lightPos[0], lightPos[1], lightPos[2]);

	//Transform the camera
	t = vMatrix.x($V([cameraPos[0], cameraPos[1], cameraPos[2], 1.0]));

//	gl.uniform3f(shader.viewerPositionUniform, t.e(1), t.e(2), t.e(3));
	gl.uniform3f(shader.viewerPositionUniform, cameraPos[0], cameraPos[1], cameraPos[2]);	

	//Set tonal global uniform.
	gl.uniform1i(shader.tonalShadeUniform, tonalShade);

}