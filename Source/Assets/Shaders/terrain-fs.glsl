#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uTexSampler0;
uniform sampler2D uTexSampler1;
uniform sampler2D uTexSampler2;
uniform sampler2D uTexSampler3;

uniform float uMaxHeight;

varying vec3 vLightWeighting;
varying vec2 vTextureCoord;
varying vec3 vVertexPosition;
varying vec4 vFogColor;
varying float vFogWeight;

void main(void) 
{
	vec4 texCol;

	vec4 texCol0 = texture2D(uTexSampler0, vec2(vTextureCoord.s, vTextureCoord.t));
	vec4 texCol1 = texture2D(uTexSampler1, vec2(vTextureCoord.s, vTextureCoord.t));
	vec4 texCol2 = texture2D(uTexSampler2, vec2(vTextureCoord.s, vTextureCoord.t));
	vec4 texCol3 = texture2D(uTexSampler3, vec2(vTextureCoord.s, vTextureCoord.t));

	//Scale the vertex position by the max height
	float vy = vVertexPosition.y / uMaxHeight;

	if (vy < 0.292)
		texCol = texCol0;
	else if (vy < 0.3125)
		texCol = mix(texCol0, texCol1, (vy - 0.292) / 0.021);
	else if (vy < 0.333)
		texCol = texCol1;
	else if (vy < 0.666)
		texCol = mix(texCol1, texCol2, (vy - 0.333) / 0.333); 
	else if (vy < 0.833)
		texCol = mix(texCol2, texCol3, (vy - 0.666) / 0.166);
	else
		texCol = texCol3;
		
	//vFogColor.a = vFogWeight;
		
	texCol.rgb = texCol.rgb * vLightWeighting;
	texCol = mix(texCol, vFogColor, vFogWeight);

	gl_FragColor = vec4(texCol.rgb, 1.0);
}