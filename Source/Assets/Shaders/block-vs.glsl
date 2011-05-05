 attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

uniform vec3 uCameraPos;
  
uniform float uFogMaxDist;
uniform float uFogMinDist;
uniform vec3 uFogColor;
uniform bool uFogEnabled;
 
varying vec2 vTextureCoord;
varying vec3 vVertexPosition;
varying vec4 vFogColor;
varying float vFogWeight;

void main(void)
{
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

	float d = distance(aVertexPosition, uCameraPos);
	
	if (uFogEnabled)
	{
		if (d < uFogMinDist)
		{
			vFogWeight = 0.0;
		}
		else if (d < uFogMaxDist)
		{
			vFogWeight = (d - uFogMinDist) / (uFogMaxDist - uFogMinDist);
		}
		else
		{
			vFogWeight = 1.0;
		}
	}
	else
		vFogWeight = 0.0;
		
	vFogColor = vec4(uFogColor, 1.0);

	vTextureCoord = aTextureCoord;
	vVertexPosition = aVertexPosition;
}