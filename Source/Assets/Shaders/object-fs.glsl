#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D uTexSampler0;

varying vec2 vTextureCoord;
varying vec3 vVertexPosition;
varying vec4 vFogColor;
varying float vFogWeight;

void main(void) 
{
	vec4 texCol = texture2D(uTexSampler0, vec2(vTextureCoord.s, vTextureCoord.t));

	gl_FragColor = vec4(mix(texCol, vFogColor, vFogWeight).rgb, 1.0);
}