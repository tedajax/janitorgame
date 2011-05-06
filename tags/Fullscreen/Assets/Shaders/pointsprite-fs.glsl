#ifdef GL_ES
precision highp float;
#endif

uniform vec4 uColor;
varying float vLifetime;

uniform sampler2D uTexSampler;

void main(void)
{
	vec4 texCol;
	texCol = texture2D(uTexSampler, gl_PointCoord);
	gl_FragColor = vec4(uColor) * texColor;
	gl_FragColor.a *= vLifetime;
}