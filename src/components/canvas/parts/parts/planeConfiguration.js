import { Mesh } from "three/src/objects/Mesh";
import { MeshBasicMaterial } from "three/src/materials/MeshBasicMaterial";
import { PlaneGeometry } from "three/src/geometries/PlaneGeometry";

export function createPlane({ width, height, divisions, devisions2, color, wireframe, position, rotation }) {
  const geometry = new PlaneGeometry(width, height, divisions, devisions2);
  const material = new MeshBasicMaterial({ color, wireframe });
  const plane = new Mesh(geometry, material);
  plane.position.set(...position);
  if (rotation) {
    plane.rotation.x = rotation.x || 0;
    plane.rotation.y = rotation.y || 0;
    plane.rotation.z = rotation.z || 0;
  }
  return plane;
}

export function generatePlaneConfigs(howMany) {
  const gridColor = "#00ff73";
  const howLong = howMany * 0.85;
  const backPlaneDimension = 5;
  const littleSquares = backPlaneDimension * 2;

  return [
    {
      width: backPlaneDimension,
      height: backPlaneDimension,
      divisions: howLong * 2,
      devisions2: littleSquares,
      color: gridColor,
      wireframe: true,
      position: [0, 0, -howLong / 2],
      rotation: {},
    },
    {
      width: howLong,
      height: 5,
      divisions: howLong * 2,
      devisions2: littleSquares,
      color: gridColor,
      wireframe: true,
      position: [2.5, 0, 0],
      rotation: { y: -Math.PI / 2 },
    },
    {
      width: howLong,
      height: 5,
      divisions: howLong * 2,
      devisions2: littleSquares,
      color: gridColor,
      wireframe: true,
      position: [-2.5, 0, 0],
      rotation: { y: Math.PI / 2 },
    },
    {
      width: howLong,
      height: 5,
      divisions: howLong * 2,
      devisions2: littleSquares,
      color: gridColor,
      wireframe: true,
      position: [0, 2.5, 0],
      rotation: { x: Math.PI / 2, z: Math.PI / 2 },
    },
    {
      width: howLong,
      height: 5,
      divisions: howLong * 2,
      devisions2: littleSquares,
      color: gridColor,
      wireframe: true,
      position: [0, -2.5, 0],
      rotation: { x: Math.PI / 2, z: Math.PI / 2 },
    },
  ];
}
