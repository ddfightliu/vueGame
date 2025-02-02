import * as THREE from 'three';

export class PhysicsSystem {
  private static readonly MAX_BUILD_HEIGHT = 256;
  private static readonly MIN_BUILD_HEIGHT = -64;
  private static readonly MAX_REACH_DISTANCE = 5;

  public static canPlaceBlock(
    position: THREE.Vector3,
    terrainData: Map<string, THREE.Mesh>,
    playerPosition: THREE.Vector3
  ): boolean {
    // Check height limits
    if (position.y > this.MAX_BUILD_HEIGHT || position.y < this.MIN_BUILD_HEIGHT) {
      return false;
    }

    // Check reach distance
    if (position.distanceTo(playerPosition) > this.MAX_REACH_DISTANCE) {
      return false;
    }

    // Check if space is occupied
    const key = `${Math.round(position.x)},${Math.round(position.y)},${Math.round(position.z)}`;
    if (terrainData.has(key)) {
      return false;
    }

    // Check if block has support (at least one adjacent block)
    const hasSupport = this.checkBlockSupport(position, terrainData);
    return hasSupport;
  }

  private static checkBlockSupport(
    position: THREE.Vector3,
    terrainData: Map<string, THREE.Mesh>
  ): boolean {
    const adjacentPositions = [
      new THREE.Vector3(0, -1, 0), // Below
      new THREE.Vector3(0, 1, 0),  // Above
      new THREE.Vector3(1, 0, 0),  // Right
      new THREE.Vector3(-1, 0, 0), // Left
      new THREE.Vector3(0, 0, 1),  // Front
      new THREE.Vector3(0, 0, -1), // Back
    ];

    for (const offset of adjacentPositions) {
      const checkPos = position.clone().add(offset);
      const key = `${Math.round(checkPos.x)},${Math.round(checkPos.y)},${Math.round(checkPos.z)}`;
      if (terrainData.has(key)) {
        return true;
      }
    }

    return false;
  }

  public static canBreakBlock(
    block: THREE.Mesh,
    playerPosition: THREE.Vector3
  ): boolean {
    // Check reach distance
    return block.position.distanceTo(playerPosition) <= this.MAX_REACH_DISTANCE;
  }
}