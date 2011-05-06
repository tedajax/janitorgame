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
 

function webGLStart()
{
	var canvas = document.getElementById("canvas");
	
	initGL(canvas);
	
	gl.clearColor(0.0, 0.5, 0.7, 1.0);
	gl.clearDepth(1.0);
	
	gl.enable(gl.DEPTH_TEST);
	gl.depthFunc(gl.LEQUAL);
};