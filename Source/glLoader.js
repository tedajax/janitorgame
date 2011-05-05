var gl;
function initGL(canvas)
{
	try
	{
		gl = canvas.getContext("experimental-webgl");
		gl.viewportWidth = canvas.width;
		gl.viewportHeight = canvas.height;
	}
	catch (e)
	{
		
	}
	if (!gl)
	{
		alert("Could not initilize WebGL");
	}
};

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
 
 
var shaderProgram;
function initShaders() 
{
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
	
	shaderProgram.textureCoordAttribute = gl.getAttribLocation(shaderProgram, "aTextureCoord");
	gl.enableVertexAttribArray(shaderProgram.textureCoordAttribute);
	
	shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
	
	//lighting parameters
	shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
	shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uLightingDirection");
	shaderProgram.directionalColorUniform = gl.getUniformLocation(shaderProgram, "uDirectionalColor");
	shaderProgram.specularColorUniform = gl.getUniformLocation(shaderProgram, "uSpecularColor");
	shaderProgram.cameraPositionUniform = gl.getUniformLocation(shaderProgram, "uCameraPos");
	
	//texture samplers
	shaderProgram.samplerUniform0 = gl.getUniformLocation(shaderProgram, "uTexSampler0");
	shaderProgram.samplerUniform1 = gl.getUniformLocation(shaderProgram, "uTexSampler1");
	shaderProgram.samplerUniform2 = gl.getUniformLocation(shaderProgram, "uTexSampler2");
	shaderProgram.samplerUniform3 = gl.getUniformLocation(shaderProgram, "uTexSampler3");
	
	shaderProgram.heightTexturingUniform = gl.getUniformLocation(shaderProgram, "uUseHeightTexturing");
	
	shaderProgram.maxTerrainHeight = gl.getUniformLocation(shaderProgram, "uMaxHeight");
	
	shaderProgram.enableLightingUniform = gl.getUniformLocation(shaderProgram, "uEnableLighting");
};
 
 
var mvMatrix;
 
function loadIdentity() 
{
	mvMatrix = Matrix.I(4);
};
 
function multMatrix(m) 
{
	mvMatrix = mvMatrix.x(m);
};
  
function mvTranslate(v) 
{
	var m = Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4();
	multMatrix(m);
};

function mvRotate(theta, v)
{
	var rad = theta * Math.PI / 180.0;
	var m = Matrix.Rotation(rad, $V([v[0], v[1], v[2]])).ensure4x4();
	multMatrix(m);
};

function mvScale(v)
{
	var m = $M([[v[0],	0,		0,		0],
	            [0,		v[1],	0,		0],
	            [0,		0,		v[2],	0],		
	            [0,		0,		0,		1]]);
	multMatrix(m);
};
 
var nMatrix;
var pMatrix;
function perspective(fovy, aspect, znear, zfar) 
{
	pMatrix = makePerspective(fovy, aspect, znear, zfar);
};

function ortho(left, right, bottom, top, znear, zfar)
{
	pMatrix = makeOrtho(left, right, bottom, top, znear, zfar);
};

var vMatrix;
function lookAt(ex, ey, ez, cx, cy, cz, ux, uy, uz)
{
	vMatrix = makeLookAt(ex, ey, ez, cx, cy, cz, ux, uy, uz);
	
	multMatrix(vMatrix);
};
 
function setMatrixUniforms() 
{
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, new Float32Array(pMatrix.flatten()));
	gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, new Float32Array(mvMatrix.flatten()));
};

function webGLStart()
{
	var canvas = document.getElementById("glcanvas");
	
	initGL(canvas);
	initShaders();
	
	gl.clearColor(0.0, 0.5, 0.7, 1.0);
	gl.clearDepth(1.0);
	
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
};