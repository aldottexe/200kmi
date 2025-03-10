export const monoShader = {

	name: 'monoShader',

	uniforms: {

		'tDiffuse': { value: null },
		'opacity': { value: 1.0 }

	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

		    vec4 texel = texture2D( tDiffuse, vUv );
		    float gray = dot(texel.rgb, vec3(0.229, 0.587, 0.114));
		    gray = gray - mod(gray, 0.1);
		    float o = min(1.0 - gray, texel.a);
		    gl_FragColor = vec4(vec3(gray), texel.a);

		}`

};
