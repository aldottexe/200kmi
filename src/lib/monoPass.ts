import { Vector3 } from "three";

export const monoShader = {

	name: 'monoShader',

	uniforms: {

		'tDiffuse': { value: null },
		'u_resolution': {value: null},
		'u_color': {value: new Vector3(0.6, 0.6, 0.6)},

	},

	vertexShader: /* glsl */`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,

	fragmentShader: /* glsl */`

		uniform sampler2D tDiffuse;
		uniform vec2 u_resolution;
		varying vec2 vUv;
		uniform vec3 u_color;

		void main() {
				vec2 grid = step(vec2(0.0), sin((vUv.xy * u_resolution.xy * 3.141592) / 2.5 + 1.0) - 0.3);

				vec2 pvUv = vUv * u_resolution.xy;
				pvUv = pvUv - mod(pvUv, vec2(5.0)) + 2.0;
				pvUv = pvUv / u_resolution.xy;

		    vec4 texel = texture2D( tDiffuse, pvUv);

		    float gray = dot(texel.rgb, vec3(0.229, 0.587, 0.114));
		    gray = gray - mod(gray, 0.05);

		    float o = min(1.0 - gray, texel.a + .1);
				o = min(o, 1.0 - max(grid.x, grid.y));

		    gl_FragColor = vec4(texel.rgb, 1) * o;
		}`,
};
