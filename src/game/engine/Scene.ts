import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { PerlinNoise } from './Noise';
import { BLOCK_TYPES, BlockType } from './BlockTypes';
import { SoundManager } from './SoundManager';
import { PhysicsSystem } from './Physics';

export class GameScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private terrain: THREE.Group;
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private blockGeometry: THREE.BoxGeometry;
  private materials: Record<string, THREE.Material>;
  private noise: PerlinNoise;
  private terrainData: Map<string, THREE.Mesh>;
  private selectedBlock: THREE.Mesh | null = null;
  private highlightMesh: THREE.Mesh;
  private soundManager: SoundManager;
  private selectedBlockType: BlockType;
  private textureLoader: THREE.TextureLoader;
  private blockTextures: Map<string, THREE.Texture>;

  constructor(container: HTMLElement) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87CEEB);
    
    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.camera.position.set(10, 10, 10);
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    
    this.noise = new PerlinNoise();
    this.terrain = new THREE.Group();
    this.terrainData = new Map();
    this.scene.add(this.terrain);

    this.blockGeometry = new THREE.BoxGeometry(1, 1, 1);
    this.materials = {
      grass: new THREE.MeshStandardMaterial({ color: 0x3d8e3d }),
      dirt: new THREE.MeshStandardMaterial({ color: 0x8b4513 }),
      stone: new THREE.MeshStandardMaterial({ color: 0x808080 }),
      highlight: new THREE.MeshBasicMaterial({
        color: 0xffffff,
        opacity: 0.5,
        transparent: true,
        wireframe: true
      })
    };

    this.soundManager = new SoundManager();
    this.selectedBlockType = BLOCK_TYPES.stone;
    this.textureLoader = new THREE.TextureLoader();
    this.blockTextures = new Map();

    this.highlightMesh = new THREE.Mesh(
      this.blockGeometry,
      this.materials.highlight
    );
    this.highlightMesh.visible = false;
    this.scene.add(this.highlightMesh);

    this.loadTextures();
    this.setupLighting();
    this.generateTerrain();
    this.setupEventListeners(container);
    this.animate();
  }

  private setupEventListeners(container: HTMLElement): void {
    container.addEventListener('mousemove', (event) => {
      this.mouse.x = (event.offsetX / container.clientWidth) * 2 - 1;
      this.mouse.y = -(event.offsetY / container.clientHeight) * 2 + 1;
    });

    container.addEventListener('click', (event) => {
      if (this.selectedBlock) {
        if (event.button === 0) {
          this.destroyBlock(this.selectedBlock);
        }
      } else if (this.highlightMesh.visible) {
        if (event.button === 2) {
          this.placeBlock(this.highlightMesh.position);
        }
      }
    });

    container.addEventListener('contextmenu', (e) => e.preventDefault());
    window.addEventListener('resize', () => this.onWindowResize(container));
  }

  private getBlockKey(position: THREE.Vector3): string {
    return `${Math.round(position.x)},${Math.round(position.y)},${Math.round(position.z)}`;
  }

  private generateTerrain(): void {
    const CHUNK_SIZE = 16;
    const AMPLITUDE = 10;
    const SCALE = 0.05;

    for (let x = -CHUNK_SIZE; x < CHUNK_SIZE; x++) {
      for (let z = -CHUNK_SIZE; z < CHUNK_SIZE; z++) {
        const height = Math.floor(
          (this.noise.noise(x * SCALE, z * SCALE) + 1) * 0.5 * AMPLITUDE
        );

        for (let y = 0; y <= height; y++) {
          const position = new THREE.Vector3(x, y, z);
          const material = y === height ? this.materials.grass :
                          y > height - 3 ? this.materials.dirt :
                          this.materials.stone;
          
          const block = new THREE.Mesh(this.blockGeometry, material);
          block.position.copy(position);
          this.terrain.add(block);
          this.terrainData.set(this.getBlockKey(position), block);
        }
      }
    }
  }

  private async loadTextures() {
    for (const blockType of Object.values(BLOCK_TYPES)) {
      const texture = await this.textureLoader.loadAsync(blockType.texture);
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;
      this.blockTextures.set(blockType.id, texture);
      
      this.materials[blockType.id] = new THREE.MeshStandardMaterial({
        map: texture,
        transparent: blockType.transparent,
        opacity: blockType.transparent ? 0.8 : 1
      });
    }
  }

  private placeBlock(position: THREE.Vector3): void {
    const roundedPos = position.clone().round();
    const key = this.getBlockKey(roundedPos);
    
    if (PhysicsSystem.canPlaceBlock(roundedPos, this.terrainData, this.camera.position)) {
      if (!this.terrainData.has(key)) {
        const block = new THREE.Mesh(
          this.blockGeometry,
          this.materials[this.selectedBlockType.id]
        );
        block.position.copy(roundedPos);
        this.terrain.add(block);
        this.terrainData.set(key, block);
        
        this.soundManager.playSound(`place_${this.selectedBlockType.soundCategory}`);
      }
    } else {
      this.soundManager.playSound('error');
    }
  }

  private destroyBlock(block: THREE.Mesh): void {
    if (PhysicsSystem.canBreakBlock(block, this.camera.position)) {
      const key = this.getBlockKey(block.position);
      const blockType = this.getBlockType(block);
      
      this.terrainData.delete(key);
      this.terrain.remove(block);
      
      this.soundManager.playSound(`break_${blockType.soundCategory}`);
    } else {
      this.soundManager.playSound('error');
    }
  }

  private getBlockType(block: THREE.Mesh): BlockType {
    const material = block.material as THREE.MeshStandardMaterial;
    const texture = material.map;
    
    for (const blockType of Object.values(BLOCK_TYPES)) {
      if (this.blockTextures.get(blockType.id) === texture) {
        return blockType;
      }
    }
    
    return BLOCK_TYPES.stone;
  }

  private updateRaycaster(): void {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.terrain.children);

    if (intersects.length > 0) {
      const intersect = intersects[0];
      this.selectedBlock = intersect.object as THREE.Mesh;
      
      const normal = intersect.face!.normal;
      const position = intersect.point.add(normal.multiplyScalar(0.5)).round();
      this.highlightMesh.position.copy(position);
      this.highlightMesh.visible = true;
    } else {
      this.selectedBlock = null;
      this.highlightMesh.visible = false;
    }
  }

  private animate = (): void => {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.updateRaycaster();
    this.renderer.render(this.scene, this.camera);
  };

  public setSelectedBlockType(blockType: BlockType) {
    this.selectedBlockType = blockType;
  }

  private setupLighting(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(10, 20, 0);
    this.scene.add(directionalLight);
  }

  private onWindowResize(container: HTMLElement): void {
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  }

  public dispose(): void {
    this.renderer.dispose();
    this.blockGeometry.dispose();
    Object.values(this.materials).forEach(material => material.dispose());
    window.removeEventListener('resize', () => this.onWindowResize);
  }
}