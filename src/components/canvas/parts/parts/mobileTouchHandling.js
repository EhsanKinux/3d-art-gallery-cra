export function mobileTouchHandling(camera, render, howMany, interactionManager, scrollPercent, squares, plane) {
  let startY = 0;
  let accumulatedY = 0;

  // Ensure plane is defined and accessible here
  if (!plane || !plane.position) {
    console.error("Plane is not defined or does not have a position.");
    return;
  }

  // touch sensitivity and the scale factor for touch-to-scroll translation
  const touchSensitivity = 0.2;

  document.addEventListener(
    "touchstart",
    function (e) {
      startY = e.touches[0].clientY;
    },
    false
  );

  document.addEventListener(
    "touchmove",
    function (e) {
      const currentY = e.touches[0].clientY;
      const deltaY = startY - currentY;
      startY = currentY;
      accumulatedY += deltaY;

      // Simulate scroll based on touch movement
      scrollPercent -= deltaY * touchSensitivity;

      // Update the camera and scene based on the simulated scroll
      playScrollAnimation();
      squareChecker(camera.position.z);

      e.preventDefault();
    },
    { passive: false }
  );

  document.addEventListener("touchend", function () {
    if (accumulatedY !== 0) {
      accumulatedY = 0; // Resetting accumulatedY after the touch ends
    }
    interactionManager.update();
  });

  function playScrollAnimation() {
    camera.lookAt(plane?.position);
    camera.position.z = -scrollPercent / howMany;
    render();
    interactionManager.update();
  }

  function squareChecker(zCamera) {
    let minimalDistance = 1;
    squares.forEach((square) => {
      const { x, y, z } = square?.position;
      const deltaZ = zCamera - z;
      if (deltaZ <= minimalDistance && deltaZ > 0) {
        const diffZ = 2 * (minimalDistance - deltaZ);
        square.position.x = square.initX >= 0 ? square.initX + diffZ : square.initX - diffZ;
        square.position.y = square.initY >= 0 ? square.initY + diffZ : square.initY - diffZ;
      }
    });
  }
}
