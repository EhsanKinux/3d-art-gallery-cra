export function initScene(Scene, PerspectiveCamera, WebGLRenderer) {
  let FOV;
  if (window.innerWidth < 720) FOV = 130;
  else FOV = 100;

  // Add your scene setup here (camera, renderer, initial objects)
  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 100);

  const renderer = new WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  document.querySelector("#three-canvas").appendChild(renderer.domElement);

  return { scene, camera, renderer };
}
