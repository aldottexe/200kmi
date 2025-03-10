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

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {
				ivec2 size = textureSize(tDiffuse, 0);

				vec2 grid = sin((vUv * vec2(size) * 3.14) / 2.5);

		    vec4 texel = texture2D( tDiffuse, vUv );

		    float gray = dot(texel.rgb, vec3(0.229, 0.587, 0.114));

		    gray = gray - mod(gray, 0.05);

		    float o = min(1.0 - gray, texel.a + .1);
				o = min(o, 1.0-max(step(grid.x, 0.0) , step(grid.y, 0.0)));
		    gl_FragColor = vec4(vec3(.6), 1) * o;
		}`,
};
