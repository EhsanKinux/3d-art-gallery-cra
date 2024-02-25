import { initScene } from "./parts/initScene";
import "../../../index.css";
import { mobileTouchHandling } from "./parts/mobileTouchHandling";
import { LoadingManager } from "three/src/loaders/LoadingManager";
import { Scene } from "three/src/scenes/Scene";
import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera";
import { WebGLRenderer } from "three/src/renderers/WebGLRenderer";
import { TextureLoader } from "three/src/loaders/TextureLoader";
import { Mesh } from "three/src/objects/Mesh";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry";
import { InteractionManager } from "three.interactive";
// import { LinearFilter } from "three/src/constants";
import { Vector3 } from "three/src/math/Vector3";
import { createPlane, generatePlaneConfigs } from "./parts/planeConfiguration";
import { setupInitialScroll, setupScrollbar } from "./parts/scrollbarSetup";
import { squareChecker } from "./parts/squareMovementPosition";

export function callThreeJS(useAppContext, howMany, navigation) {
  let damping;
  if (window.innerWidth < 1000) damping = 0.05;
  else damping = 0.1;

  let fixedHeader = document.querySelector("#header");
  let fixedCanvas = document.querySelector("#three-canvas");
  let fixedLayer = document.querySelector("#layer");
  let fixedPresentation = document.querySelector("#presentation");
  const progressBar = document.querySelector("#progress-bar");
  // const loading = document.querySelector("#loading");
  // let fixedFooter = document.querySelector("#footer");
  let scrollPercent = 0;
  let zCamera;
  let scrolling = false;
  let savedScroll = 0;

  // let loadedPlanes = 0; // Tracks the total number of planes loaded
  // const planesPerBatch = 4; // Number of planes to load per batch
  // let lastLoadedPlaneZ = 0; // Z position of the last loaded plane
  // let initialBatchLoaded = false;

  // Loading progress bar
  const manager = new LoadingManager();
  manager.onLoad = function () {
    // Apply the fade-out animation class
    fixedPresentation.classList.add("fade-out");

    // Remove the presentation from display after animation
    setTimeout(() => {
      fixedPresentation.style.display = "none";
    }, 4000);
  };

  manager.onProgress = function (url, itemsLoaded, itemsTotal) {
    progressBar.value = (itemsLoaded / itemsTotal) * 100;
  };

  // SMOOTHNESS
  let scrollbar = setupScrollbar(damping);

  // First scroll to start the app
  setupInitialScroll(useAppContext, scrollbar, scrolling);

  // initialize the scene
  const { scene, camera, renderer } = initScene(Scene, PerspectiveCamera, WebGLRenderer);

  let array = useAppContext.state.data;

  // New object

  // *********** ROOM

  // Textures
  const loader = new TextureLoader(manager);

  // Creating and adding planes to the scene
  const planeConfigs = generatePlaneConfigs(howMany);
  const planes = planeConfigs.map((config) => createPlane(config));
  planes.forEach((plane) => scene.add(plane));

  // ** Three Interactive
  const interactionManager = new InteractionManager(renderer, camera, renderer.domElement, [
    { treatTouchEventsAsMouseEvents: true },
  ]);

  // Utility function to adjust texture properties
  // function configureTexture(texture) {
  //   // texture.minFilter = LinearFilter;
  //   // texture.magFilter = LinearFilter;
  //   if (renderer) {
  //     texture.anisotropy = 4;
  //   }
  // }

  // ******* SQUARES
  let squares = [];
  let squarestStart = -1;
  array.forEach((item, indexPosition) => {
    const aspect = item.width / item.height;
    let planeWidth;
    let planeHeight;
    if (aspect >= 1) {
      planeHeight = 1;
      planeWidth = aspect;
    } else {
      planeWidth = 1;
      planeHeight = 1 / aspect;
    }
    let square = new Mesh(
      new PlaneGeometry(planeWidth, planeHeight, planeWidth, planeHeight),
      new MeshBasicMaterial({
        map: loader.load(item.url),
      })
    );
    let xRandom = Math.round(Math.random());
    let yRandom = Math.round(Math.random());
    let randomMath = [Math.random() / 3, -Math.random() / 3];
    const yPosition = randomMath[xRandom];
    const xPosition = randomMath[yRandom];
    const zPosition = (-1 * indexPosition) / 5 + squarestStart;

    square.position.set(xPosition, yPosition, zPosition);
    squares.push({ ...square, ...{ initX: square.position.x, initY: square.position.y, initZ: square.position.z } });
    scene.add(square);
    interactionManager.add(square);
    square.addEventListener("click", (e) => {
      e.stopPropagation();
      useAppContext.updateState("layer", true);
      navigation(`/${item.id}`);
    });
    square.addEventListener("mouseover", () => {
      document.body.style.cursor = "pointer";
    });
    square.addEventListener("mouseout", () => {
      document.body.style.cursor = "default";
    });

    // square.addEventListener("touchstart", (e) => {
    //   e.stopPropagation();
    //   useAppContext.updateState("layer", true);
    //   navigation(`/${item.id}`);
    // });
  });

  // Camera Position
  camera.position.set(0, 0, 0);
  camera.lookAt(new Vector3(...planeConfigs[0].position));

  // Animate function
  render();
  function animate() {
    requestAnimationFrame(animate);
    playScrollAnimation();
    render();
    interactionManager.update();
  }
  animate();

  function playScrollAnimation() {
    camera.lookAt(new Vector3(...planeConfigs[0].position));
    camera.position.z = -scrollPercent / howMany;
    // Check if it's time to load more planes
    zCamera = camera.position.z;
    squareChecker(zCamera, squares);

    // const loadThreshold = 0.5;
    // if (!initialBatchLoaded || (camera.position.z <= lastLoadedPlaneZ + loadThreshold && loadedPlanes < array.length)) {
    //   loadPlaneBatches().then();
    //   initialBatchLoaded = true; // Mark the initial batch as loaded
    // }
  }

  // Make sure the initial batch of planes is loaded when the application starts
  // if (!initialBatchLoaded) {
  //   loadPlaneBatches().then(); // This will load the first batch of planes
  //   initialBatchLoaded = false; // Ensure we don't load it again unintentionally
  // }

  // scrollPercent updater based on scrolling
  scrollbar.addListener((status) => {
    // Indicate it is scrolling so render can Execute
    scrolling = true;
    // scroll calculation
    scrollPercent =
      ((scrollbar.offset.y / (scrollbar.size.content.height - document.documentElement.clientHeight)) * 100) / 2;
    // console.log(scrollPercent);
    // Checking stopped scroll
    if (Math.abs(scrollPercent.toFixed(4) - savedScroll.toFixed(4)) <= 0.01) {
      scrolling = false;
      // console.log('pause', scrollPercent.toFixed(4), savedScroll.toFixed(4));
    }
    if (scrollPercent === 0) scrolling = false;
    if (scrollPercent === 100) scrolling = false;

    // smooth-scrollbar fixings
    const offset = status.offset;
    fixedHeader.style.top = offset.y + "px";
    fixedCanvas.style.top = offset.y + "px";
    fixedLayer.style.top = offset.y + "px";
    fixedPresentation.style.top = offset.y + "px";
    progressBar.style.top = offset.y + "px";
    // loading.style.top = offset.y + "px";
    // fixedFooter.style.top = offset.y + "px";

    savedScroll = scrollPercent;
  });

  // Touch handling for mobile devices
  if (planeConfigs) {
    mobileTouchHandling(
      camera,
      render,
      howMany,
      interactionManager,
      savedScroll,
      squares,
      planeConfigs,
      useAppContext,
      navigation,
      scene,
      // initialBatchLoaded,
      // lastLoadedPlaneZ,
      // loadedPlanes,
      // loadPlaneBatches
    );
  }

  // Resizing
  window.addEventListener("resize", onWindowResize, true);
  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
  }

  function render() {
    renderer.render(scene, camera);
  }
}
