export function squareChecker(zCamera, squares) {
  let minimalDistance = 1;
  squares.forEach((square, index) => {
    const { z } = square.position;
    const deltaZ = zCamera - z;
    if (deltaZ <= minimalDistance && deltaZ > 0) {
      const diffZ = 3 * (minimalDistance - deltaZ);
      // Determine the corner for this square
      const corner = index % 4; // This will give us a value from 0 to 3
      let targetX, targetY;
      switch (corner) {
        case 0: // Top-left
          targetX = square.initX - diffZ;
          targetY = square.initY + diffZ;
          break;
        case 1: // Top-right
          targetX = square.initX + diffZ;
          targetY = square.initY + diffZ;
          break;
        case 2: // Bottom-left
          targetX = square.initX - diffZ;
          targetY = square.initY - diffZ;
          break;
        case 3: // Bottom-right
          targetX = square.initX + diffZ;
          targetY = square.initY - diffZ;
          break;
        default:
          targetX = square.initX;
          targetY = square.initY;
          console.warn(`Unexpected corner value: ${corner}. Resetting square to initial position.`);
          break;
      }

      // Apply the calculated target positions
      square.position.x = targetX;
      square.position.y = targetY;
    }
  });
}
