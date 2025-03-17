import * as THREE from 'three';

import { monoShader } from './monoPass';
import { RenderPass, RenderPixelatedPass, ShaderPass } from 'three/examples/jsm/Addons.js';
import { EffectComposer } from 'three/examples/jsm/Addons.js';

import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/Addons.js';
import { UltraHDRLoader } from 'three/addons/loaders/UltraHDRLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// the currently viewed part
let currentlyViewedPart: any;

// the root of all the parts
let partsRoot: any;

let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer;
let composer: EffectComposer;
let bw: ShaderPass;
let pixel: RenderPixelatedPass;
let orbit: OrbitControls;

// MATERIALS
const hover = new THREE.MeshBasicMaterial({ color: 0x00eeff })
const hidden = new THREE.MeshBasicMaterial({ color: 0x00eeff, transparent: true, opacity: .1,})
const hiddenhover = new THREE.MeshBasicMaterial({ color: 0x00eeff, transparent: true, opacity: .1,})
const mat = new THREE.MeshStandardMaterial({ metalness: .8, roughness: .6 })

export const childNames: { value: Array<string> } = $state({ value: [] })
export const parentName: { value: string } = $state({ value: "" })

export function childButton(node: HTMLElement, i: number) {
  node.addEventListener("mouseenter", () => currentlyViewedPart.children[i].traverse(c => {c.material = hover}));
  node.addEventListener("mouseleave", () => currentlyViewedPart.children[i].traverse(c => c.material = mat));
  node.addEventListener("click", () => selectChild(i));
}

export function parentButton(node: HTMLElement) {
  node.addEventListener("click", () => selectParent());
}
function selectParent() {
  console.log("old current", currentlyViewedPart.name);
  currentlyViewedPart = currentlyViewedPart.parent;
  console.log("new block", currentlyViewedPart.name);

  currentlyViewedPart.traverse((c: THREE.Mesh) => c.material = mat);

  positionCameraOnGeometry(currentlyViewedPart)

  // repopulate child buttons
  childNames.value = [];
  currentlyViewedPart.children.forEach((c: THREE.Mesh) => childNames.value.push(c.name));

  parentName.value = currentlyViewedPart.parent.name;
}

function selectChild(i: number) {

  currentlyViewedPart.material = hidden;
  // show only selected child
  currentlyViewedPart.traverse((c: THREE.Mesh, j: number) => { if (j != i) c.material = hidden; else c.material = mat; });

  parentName.value = currentlyViewedPart.name;


  console.log("old current", currentlyViewedPart.name);
  currentlyViewedPart = currentlyViewedPart.children[i];
  console.log("new current", currentlyViewedPart.name);

  currentlyViewedPart.traverse(c => c.material = mat);

  positionCameraOnGeometry(currentlyViewedPart)


  // repopulate child buttons
  childNames.value = [];
  if (currentlyViewedPart.children)
    currentlyViewedPart.children.forEach((c: THREE.Mesh) => childNames.value.push(c.name));

}

function selectPartByName(name: String) {
  function checkChild(part: any, found: Boolean) {
    if (found === false && part.name === name) {
      currentlyViewedPart = part;
      positionCameraOnGeometry(currentlyViewedPart);
    }
    found = found || part.name === name;
    part.visible = found;
    part.children.forEach(c =>
      checkChild(c, found)
    );
  }
  checkChild(partsRoot, false);
}

function createPartsManifest(): Map<String, Array<number>> {
  const manifest: Map<String, Array<number>> = new Map();
  function searchChild(part: any, path: Array<number>) {
    const partName = part.name.split('0')[0];
    manifest.set(partName, path);
    part.children?.forEach((c, i) =>
      searchChild(c, [...path, i]))
  }
  searchChild(partsRoot, []);
  return manifest;
}

function positionCameraOnGeometry(m: THREE.Mesh) {
  console.log(m)
  let center = new THREE.Vector3();

  const boundingBox = new THREE.Box3();
  const tempBox = new THREE.Box3();

  // Traverse all children of the group
  m.traverse((c: any) => {
    if (c.isMesh) {
      c.geometry.computeBoundingBox();
      tempBox.copy(c.geometry.boundingBox);
      tempBox.applyMatrix4(c.matrixWorld);
      boundingBox.union(tempBox);
    }
  });

  boundingBox.getCenter(center);
  orbit.target = center;
  orbit.maxDistance = 2;
  orbit.minDistance = 2;

}


export function init(node: HTMLCanvasElement) {

  // RENDERER
  renderer = new THREE.WebGLRenderer({ powerPreference: 'high-performance', depth: false, antialias: false, canvas: node, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // CAMERA
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);

  // ORBIT
  orbit = new OrbitControls(camera, node)
  orbit.enableZoom = false;
  orbit.enablePan = false;
  orbit.autoRotate = true;

  // SCENE
  scene = new THREE.Scene();

  // HDRI
  // convert to gainmap using
  // https://gainmap-creator.monogrid.com/
  const loader = new UltraHDRLoader();
  loader.setDataType(THREE.FloatType);
  loader.load('3.jpg', t => {
    t.mapping = THREE.EquirectangularReflectionMapping;
    t.needsUpdate = true;

    scene.environment = t;
    scene.environmentRotation = new THREE.Euler(3.14 / 6, 0, 0)
    t.dispose();
  });

  // OBJECT
  const objLoader = new GLTFLoader();
  objLoader.load('piston.glb', (root) => {
    partsRoot = root.scene.children[0]
    console.log(partsRoot);

    partsRoot.scale.set(.4, .4, .4);
    partsRoot.rotation.z += 1;
    partsRoot.traverse((c: any) => { if (c.isMesh) c.material = mat; });

    currentlyViewedPart = partsRoot
    scene.add(currentlyViewedPart);

    console.log(createPartsManifest());
    currentlyViewedPart.children.forEach(c => { childNames.value.push(c.name); });
    setTimeout(() => positionCameraOnGeometry(currentlyViewedPart), 100);
  });

  renderer.setAnimationLoop(animate);

  // EFFECTS
  composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));

  pixel = new RenderPixelatedPass(5, scene, camera)
  pixel.normalEdgeStrength = .2
  composer.addPass(pixel)

  bw = new ShaderPass(monoShader);
  bw.uniforms.u_resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
  composer.addPass(bw);

  window.addEventListener('resize', onWindowResize);
}

// RESIZE
function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  bw.uniforms.u_resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
  pixel.setSize(window.innerWidth, window.innerHeight);

  renderer.setSize(window.innerWidth, window.innerHeight);

}

// ANIMATE
function animate() {

  orbit.update();

  composer.render();

}
