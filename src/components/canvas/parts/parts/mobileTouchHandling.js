import { Vector2 } from "three/src/math/Vector2";
import { Raycaster } from "three/src/core/Raycaster";

export function mobileTouchHandling(
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
) {
  let array = useAppContext.state.data;
  let raycaster = new Raycaster();
  let touchPosition = new Vector2();
  let startY = 0;
  let accumulatedY = 0;
  const maxScroll = 100;

  // Ensure plane is defined and accessible here
  if (!plane || !plane.position) {
    console.error("Plane is not defined or does not have a position.");
    return;
  }

  // touch sensitivity and the scale factor for touch-to-scroll translation
  const touchSensitivity = 0.05;

  document.addEventListener(
    "touchstart",
    function (e) {
      // Prevent the window from scrolling
      e.preventDefault();

      startY = e.touches[0].clientY;

      // Calculate touch position in normalized device coordinates (-1 to +1) for both axes
      touchPosition.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
      touchPosition.y = -(e.touches[0].clientY / window.innerHeight) * 2 + 1;

      // Update the raycaster with the camera and touch position
      raycaster.setFromCamera(touchPosition, camera);

      // Attempt to intersect the objects currently in the scene
      const intersects = raycaster.intersectObjects(scene.children);

      for (let i = 0; i < intersects.length; i++) {
        if (squares.some((sq) => sq.id === intersects[i].object.id)) {
          // The object touched is one of our squares, perform necessary action
          const touchedSquare = squares.find((sq) => sq.id === intersects[i].object.id);
          useAppContext.updateState("layer", true);
          navigation(`/${touchedSquare.id}`);
        }
      }
    },
    false
  );

  document.addEventListener(
    "touchmove",
    function (e) {
      e.preventDefault();
      const currentY = e.touches[0].clientY;
      const deltaY = startY - currentY;
      startY = currentY;
      accumulatedY += deltaY;

      // Calculate new scroll percent based on touch movement
      let newScrollPercent = scrollPercent - deltaY * touchSensitivity;

      // Ensure newScrollPercent is within boundaries
      if (newScrollPercent < 0) {
        newScrollPercent = 0;
      } else if (newScrollPercent > maxScroll) {
        newScrollPercent = maxScroll;
      }

      // Apply the bounded newScrollPercent
      scrollPercent = newScrollPercent;

      // Update the camera and scene based on the simulated scroll
      render();
      function animate() {
        requestAnimationFrame(animate);
        playScrollAnimation();
        render();
        interactionManager.update();
      }
      animate();
    },
    { passive: false }
  );

  // document.addEventListener("touchend", function () {
  //   if (accumulatedY !== 0) {
  //     accumulatedY = 0; // Resetting accumulatedY after the touch ends
  //   }
  //   interactionManager.update();
  // });

  function playScrollAnimation() {
    camera.lookAt(plane.position);
    camera.position.z = -scrollPercent / 2 / howMany;
    squareChecker(camera.position.z);

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
      const { z } = square?.position;
      const deltaZ = zCamera - z;
      if (deltaZ <= minimalDistance && deltaZ > 0) {
        const diffZ = 2 * (minimalDistance - deltaZ);
        square.position.x = square.initX >= 0 ? square.initX + diffZ : square.initX - diffZ;
        square.position.y = square.initY >= 0 ? square.initY + diffZ : square.initY - diffZ;
      }
    });
  }
}
