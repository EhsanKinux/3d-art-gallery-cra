import { initScene } from "./parts/initScene";
import Scrollbar from "smooth-scrollbar";
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
import { LinearFilter } from "three/src/constants";

export function callThreeJS(useAppContext, howMany, navigation) {
  let damping;
  if (window.innerWidth < 1000) damping = 0.05;
  else damping = 0.1;

  let fixedHeader = document.querySelector("#header");
  let fixedCanvas = document.querySelector("#three-canvas");
  let fixedLayer = document.querySelector("#layer");
  let fixedPresentation = document.querySelector("#presentation");
  const progressBar = document.querySelector("#progress-bar");
  // let fixedFooter = document.querySelector("#footer");
  // const progressBarContainer = document.querySelector(".progress-bar-container");
  let scrollPercent = 0;
  let zCamera;
  let scrolling = false;
  let savedScroll = 0;

  let loadedPlanes = 0; // Tracks the total number of planes loaded
  const planesPerBatch = 4; // Number of planes to load per batch
  let lastLoadedPlaneZ = 0; // Z position of the last loaded plane
  let initialBatchLoaded = false;

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
  function setupScrollbar(damping) {
    let scrollbar = Scrollbar.init(document.body, { renderByPixels: true, continuousScrolling: true, damping });
    // Limiting x scrolling
    scrollbar.limit.x = 0;
    return scrollbar;
  }

  // First scroll to start the app
  setupInitialScroll(useAppContext, scrollbar);
  function setupInitialScroll(useAppContext, scrollbar) {
    if (useAppContext.state.data.length > 0) {
      setTimeout(() => {
        scrollbar.scrollTo(0, 5, 10);
        setTimeout(() => {
          scrolling = false;
        }, 1000);
      }, 2000);
    }
  }

  // initialize the scene
  const { scene, camera, renderer } = initScene(Scene, PerspectiveCamera, WebGLRenderer);

  let array = useAppContext.state.data;

  // New object

  // *********** ROOM

  // Textures
  const gridColor = "#00ff73";
  const howLong = howMany * 0.85;
  const loader = new TextureLoader(manager);
  const backPlaneDimension = 5;
  const littleSquares = backPlaneDimension * 2;

  const plane = new Mesh(
    new PlaneGeometry(backPlaneDimension, backPlaneDimension, littleSquares, littleSquares),
    new MeshBasicMaterial({ color: gridColor, wireframe: true })
  );
  const rightPlane = new Mesh(
    new PlaneGeometry(howLong, 5, howLong * 2, littleSquares),
    new MeshBasicMaterial({ color: gridColor, wireframe: true })
  );
  const leftPlane = new Mesh(
    new PlaneGeometry(howLong, 5, howLong * 2, littleSquares),
    new MeshBasicMaterial({ color: gridColor, wireframe: true })
  );
  const topPlane = new Mesh(
    new PlaneGeometry(howLong, 5, howLong * 2, littleSquares),
    new MeshBasicMaterial({ color: gridColor, wireframe: true })
  );
  const bottomPlane = new Mesh(
    new PlaneGeometry(howLong, 5, howLong * 2, littleSquares),
    new MeshBasicMaterial({ color: gridColor, wireframe: true })
  );

  scene.add(plane, rightPlane, leftPlane, topPlane, bottomPlane);

  // ** Three Interactive
  const interactionManager = new InteractionManager(renderer, camera, renderer.domElement, [
    { treatTouchEventsAsMouseEvents: true },
  ]);

  // Utility function to adjust texture properties
  function configureTexture(texture) {
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    if (renderer) {
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    }
  }

  // ******* SQUARES
  let squares = [];
  function loadPlaneBatches() {
    const batchStartIndex = loadedPlanes; // Start index for the new batch
    const batchEndIndex = Math.min(batchStartIndex + planesPerBatch, array.length); // Ensure we do not exceed the array
    let squarestStart = -1;
    for (let i = batchStartIndex; i < batchEndIndex; i++) {
      const item = array[i];
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
      const texture = loader.load(item.url, configureTexture);
      let square = new Mesh(
        new PlaneGeometry(planeWidth, planeHeight, planeWidth, planeHeight),
        new MeshBasicMaterial({
          map: texture,
        })
      );
      let xRandom = Math.round(Math.random());
      let yRandom = Math.round(Math.random());
      let randomMath = [Math.random() / 3, -Math.random() / 3];
      const yPosition = randomMath[xRandom];
      const xPosition = randomMath[yRandom];
      const zPosition = (-1 * i) / 5 + squarestStart;

      // Update 'lastLoadedPlaneZ' with the Z position of the newest loaded plane
      lastLoadedPlaneZ = zPosition;

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
      square.addEventListener("touchstart", (e) => {
        e.stopPropagation();
        useAppContext.updateState("layer", true);
        navigation(`/${item.id}`);
      });
      loadedPlanes++; // Increment the count of loaded planes
    }
  }

  // Camera Position
  camera.position.set(0, 0, 0);
  camera.lookAt(plane.position);
  // First plane position
  plane.position.set(0, 0, -howLong / 2);
  // Right plane position
  rightPlane.position.set(2.5, 0, 0);
  rightPlane.rotation.y = -90 * ((2 * Math.PI) / 360);
  // Left plane position
  leftPlane.position.set(-2.5, 0, 0);
  leftPlane.rotation.y = 90 * ((2 * Math.PI) / 360);
  // Top plane position
  topPlane.position.set(0, 2.5, 0);
  topPlane.rotation.x = 90 * ((2 * Math.PI) / 360);
  topPlane.rotation.z = 90 * ((2 * Math.PI) / 360);
  // Bottom plane position
  bottomPlane.position.set(0, -2.5, 0);
  bottomPlane.rotation.x = 90 * ((2 * Math.PI) / 360);
  bottomPlane.rotation.z = 90 * ((2 * Math.PI) / 360);

  // Animate function
  render();
  function animate() {
    requestAnimationFrame(animate);
    playScrollAnimation();
    if (scrolling) render();
    interactionManager.update();
  }
  animate();

  function playScrollAnimation() {
    camera.lookAt(plane.position);
    camera.position.z = -scrollPercent / howMany;
    // Check if it's time to load more planes
    zCamera = camera.position.z;
    squareChecker(zCamera);

    const loadThreshold = 0.5;
    if (!initialBatchLoaded || (camera.position.z <= lastLoadedPlaneZ + loadThreshold && loadedPlanes < array.length)) {
      loadPlaneBatches();
      initialBatchLoaded = true; // Mark the initial batch as loaded
    }
  }

  // Make sure the initial batch of planes is loaded when the application starts
  if (!initialBatchLoaded) {
    loadPlaneBatches(); // This will load the first batch of planes
    initialBatchLoaded = true; // Ensure we don't load it again unintentionally
  }

  function squareChecker(zCamera) {
    let minimalDistance = 1;
    squares.forEach((square) => {
      const { z } = square.position;
      const deltaZ = zCamera - z;
      if (deltaZ <= minimalDistance && deltaZ > 0) {
        const diffZ = 2 * (minimalDistance - deltaZ);
        square.position.x = square.initX >= 0 ? square.initX + diffZ : square.initX - diffZ;
        square.position.y = square.initY >= 0 ? square.initY + diffZ : square.initY - diffZ;
      }
    });
  }

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
    // fixedFooter.style.top = offset.y + "px";

    savedScroll = scrollPercent;
  });

  // Touch handling for mobile devices
  if (plane) {
    mobileTouchHandling(
      camera,
      render,
      howMany,
      interactionManager,
      scrollPercent,
      squares,
      plane,
      useAppContext,
      navigation,
      scene,
      initialBatchLoaded,
      lastLoadedPlaneZ,
      loadedPlanes,
      loadPlaneBatches
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
