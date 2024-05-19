import * as THREE from "https://cdn.skypack.dev/three@0.134.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.134.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.134.0/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "https://cdn.skypack.dev/three@0.134.0/examples/jsm/loaders/RGBELoader.js";

// Mapping container class names to model paths and scale values
const modelPaths = {
  "canvas-container-coke": { path: "./assets/models/cola.glb", scale: 5 },
  "canvas-container-sprite": { path: "./assets/models/sprite.glb", scale: 1 },
  "canvas-container-fanta": { path: "./assets/models/fanta.glb", scale: 13 },
};

export function initModelViewer(containerClass) {
  const modelConfig = modelPaths[containerClass];
  if (!modelConfig) {
    console.error(`No model path found for container class: ${containerClass}`);
    return;
  }
  console.log("Initializing model viewer for container class:", containerClass);

  const scene = new THREE.Scene();
  let model;

  const camera = new THREE.PerspectiveCamera(
    95,
    window.innerWidth / window.innerHeight,
    0.1,
    5000
  );
  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.querySelector(`.${containerClass}`).appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff, 2);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);

  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight2.position.set(1, 1, -1).normalize();
  scene.add(directionalLight2);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.minPolarAngle = Math.PI / 2;
  controls.maxPolarAngle = Math.PI / 2;
  controls.enableZoom = false;

  new RGBELoader().load(
    "https://res.cloudinary.com/dutzpli8z/raw/upload/v1715801358/cbtu0qentrhp1i87fkyd.hdr",
    function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;

      const modelLoader = new GLTFLoader();
      modelLoader.load(modelConfig.path, function (gltf) {
        console.log("Model loaded:", modelConfig.path);
        model = gltf.scene;
        model.scale.set(
          modelConfig.scale,
          modelConfig.scale,
          modelConfig.scale
        );
        model.rotation.set(0, 0, 0);
        model.position.set(0, -2.5, 0);
        if (window.innerWidth < 500) {
          model.scale.set(
            modelConfig.scale - 1,
            modelConfig.scale - 1,
            modelConfig.scale - 1
          );
        }
        scene.add(model);

        document.getElementById("loadingText").style.display = "none";
      });
    }
  );

  function animate() {
    requestAnimationFrame(animate);
    if (model) {
      model.rotation.y += 0.01;
    }
    controls.update();
    renderer.render(scene, camera);
  }

  animate();

  function onWindowResize() {
    const canvasDiv = document.querySelector(`.${containerClass}`);
    camera.aspect = canvasDiv.clientWidth / canvasDiv.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasDiv.clientWidth, canvasDiv.clientHeight);
  }

  window.addEventListener("resize", onWindowResize, false);
  onWindowResize();
}

// Automatically initialize model viewers for all relevant containers
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded event");
  [
    "canvas-container-coke",
    "canvas-container-sprite",
    "canvas-container-fanta",
  ].forEach((containerClass) => {
    if (document.querySelector(`.${containerClass}`)) {
      initModelViewer(containerClass);
    }
  });
});
