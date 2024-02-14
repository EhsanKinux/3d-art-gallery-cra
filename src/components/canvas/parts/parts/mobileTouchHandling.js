export function mobileTouchHandling(camera, render, howMany, interactionManager, scrollPercent, squares, plane) {
  let startY = 0;
  let accumulatedY = 0;
  const maxScroll = 100;

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
