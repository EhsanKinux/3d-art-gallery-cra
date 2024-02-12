export function mobileTouchHandling(camera, render) {
  let startY = 0;
  let accumulatedY = 0;

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
      accumulatedY += startY - currentY;
      startY = currentY;
    },
    { passive: false }
  );

  document.addEventListener("touchend", function () {
    if (accumulatedY !== 0) {
      animateTouchScroll(accumulatedY);
      accumulatedY = 0;
    }
  });

  function animateTouchScroll(accumulatedY) {
    const sensitivity = 0.01; // Adjust this based on testing
    const targetPositionZ = camera.position.z + accumulatedY * sensitivity;

    const animate = () => {
      camera.position.z += (targetPositionZ - camera.position.z) * 0.1;
      if (Math.abs(camera.position.z - targetPositionZ) > 0.01) {
        requestAnimationFrame(animate);
      } else {
        camera.position.z = targetPositionZ;
      }
      render();
    };
    animate();
  }
}
