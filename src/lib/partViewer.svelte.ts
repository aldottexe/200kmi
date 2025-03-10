import * as THREE from 'three';

import { monoShader } from './monoPass';
import { OutputPass, RenderPass, RenderPixelatedPass, ShaderPass } from 'three/examples/jsm/Addons.js';
import { EffectComposer } from 'three/examples/jsm/Addons.js';

import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer;
let composer: EffectComposer;
let piston: any;

export function init(node: HTMLCanvasElement) {

	// RENDERER
	renderer = new THREE.WebGLRenderer({powerPreference:'high-performance', depth: false, antialias: false, canvas: node, alpha: true});
	// renderer.setPixelRatio(.25);
	renderer.setSize(window.innerWidth, window.innerHeight);

	// CAMERA
	camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
	camera.position.z = 2;

	const orbit = new OrbitControls(camera, node)
	orbit.enableZoom = false;
	orbit.enablePan = false;

	// SCENE
	scene = new THREE.Scene();
	// scene.background = new THREE.Color("#eee")

	// HDRI
	// convert to gainmap using
	// https://gainmap-creator.monogrid.com/
	const loader = new UltraHDRLoader();
	loader.setDataType(THREE.FloatType);
	loader.load('3.jpg', t => {
		console.log(t);
		t.mapping = THREE.EquirectangularReflectionMapping;
		t.needsUpdate = true;

		// scene.background = t;
		scene.environment = t;
	});

	// OBJECT
	const objLoader = new OBJLoader();
	objLoader.load('piston.obj', (root) => {
		piston = root
		piston.scale.set(.4, .4, .4);
		scene.add(piston);
		piston.rotation.z += 1;

		const mat = new THREE.MeshStandardMaterial({ metalness: .8, roughness: .6 })
		piston.children.forEach((c: THREE.Mesh) => c.material = mat);
	});

	renderer.setAnimationLoop(animate);

	// EFFECTS
	composer = new EffectComposer(renderer);
	composer.addPass(new RenderPass(scene, camera));

	const pixel = new RenderPixelatedPass(5, scene, camera)
	pixel.normalEdgeStrength = .2
	composer.addPass(pixel)

	const bw = new ShaderPass(monoShader);
	// bw.uniforms = {
	// 	u_resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
	// };
	composer.addPass(bw);

	// const outputPass = new OutputPass();
	// composer.addPass( outputPass );

	window.addEventListener('resize', onWindowResize);
}

// RESIZE
function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

// ANIMATE
function animate() {

	if (piston) {
		piston.rotation.y += 0.005;
	}

	composer.render();

}
