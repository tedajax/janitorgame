attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;
  
uniform vec3 uAmbientColor;
  
uniform vec3 uLightingDirection;
uniform vec3 uDirectionalColor;
uniform vec3 uSpecularColor;
uniform vec3 uCameraPos;
  
uniform float uFogMaxDist;
uniform float uFogMinDist;
uniform vec3 uFogColor;
uniform bool uFogEnabled;
  
varying vec3 vLightWeighting;
varying vec2 vTextureCoord;
varying vec3 vVertexPosition;
varying vec4 vFogColor;
varying float vFogWeight;

void main(void)
{
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);

	vec4 transformedNormal = uNMatrix * normalize(vec4(aVertexNormal, 1.0));
	float directionalLightWeighting = max(dot(transformedNormal.xyz, uLightingDirection), 0.0);

	vec4 point = uMVMatrix * vec4(aVertexPosition, 1.0);
	vec3 cameraVec = (uMVMatrix * vec4(uCameraPos, 1.0) - point).xyz;
	cameraVec = normalize(cameraVec);
	vec3 h = uLightingDirection + cameraVec;
	h = normalize(h);
	float specularLightWeighting = max(pow(dot(transformedNormal.xyz, h), 8.0), 0.0);

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
	
	vLightWeighting = uAmbientColor + uDirectionalColor * directionalLightWeighting + uSpecularColor * specularLightWeighting;

	vTextureCoord = aTextureCoord;
	vVertexPosition = aVertexPosition;
}