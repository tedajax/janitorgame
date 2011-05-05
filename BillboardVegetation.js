//Cross method vegatation class and functions

function BillboardVegetation()
{
	this.genGeom();
};

BillboardVegetation.prototype.genGeom = function()
{
	this.vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	
	//vertices will just be two planes
	var vertices = [ -1.0, -1.0, 0.0,
	                 -1.0,  1.0, 0.0,
	                  1.0,  1.0, 0.0,
	                  1.0, -1.0, 0.0,
	                 
	                  0.0, -1.0, -1.0,
	                  0.0,  1.0, -1.0,
	                  0.0,  1.0,  1.0,
	                  0.0, -1.0,  1.0 ];
 	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.vertexBuffer.itemSize = 3;
	this.vertexBuffer.numItems = 8;
	
	this.normalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
	
	var normals = [ 0.0, 0.0, 1.0,
	                0.0, 0.0, 1.0,
	                0.0, 0.0, 1.0,
	                0.0, 0.0, 1.0,
	                
	                1.0, 0.0, 0.0,
	                1.0, 0.0, 0.0,
	                1.0, 0.0, 0.0,
	                1.0, 0.0, 0.0 ];
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	this.normalBuffer.itemSize = 3;
	this.normalBuffer.numItems = 8;
	
	this.texCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
	
	var texCoords = [ 0.0, 0.0,
	                  0.0, 1.0,
	                  1.0, 1.0,
	                  1.0, 0.0,
	                  
	                  0.0, 0.0,
	                  0.0, 1.0,
	                  1.0, 1.0,
	                  1.0, 0.0 ];
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);
	this.texCoordBuffer.itemSize = 2;
	this.texCoordBuffer.numItems = 8;
	
	this.indexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	var indices = [ 1, 3, 0,
	                1, 2, 3,
	                
	                5, 7, 4,
	                5, 6, 7 ];
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
	this.indexBuffer.itemSize = 1;
	this.indexBuffer.numItems = 12;	
};

function vegData()
{
	vegData.locations = new Array();
	vegData.COUNT = 100;
	
	for (var i = 0; i < vegData.COUNT; i++)
	{
		vegData.locations.push(Math.floor(Math.random() * 256));
		vegData.locations.push(Math.floor(Math.random() * 256));
	}
};

function CreateVegetation()
{
	vegetation = new BillboardVegetation();
};
