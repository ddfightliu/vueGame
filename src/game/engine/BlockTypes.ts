import * as THREE from 'three';

export interface BlockType {
  id: string;
  name: string;
  texture: string;
  hardness: number;
  transparent: boolean;
  placeable: boolean;
  soundCategory: 'soft' | 'hard' | 'metal';
}

export const BLOCK_TYPES: Record<string, BlockType> = {
  grass: {
    id: 'grass',
    name: 'Grass Block',
    texture: '/textures/grass.png',
    hardness: 0.6,
    transparent: false,
    placeable: true,
    soundCategory: 'soft'
  },
  dirt: {
    id: 'dirt',
    name: 'Dirt',
    texture: '/textures/dirt.png',
    hardness: 0.5,
    transparent: false,
    placeable: true,
    soundCategory: 'soft'
  },
  stone: {
    id: 'stone',
    name: 'Stone',
    texture: '/textures/stone.png',
    hardness: 1.5,
    transparent: false,
    placeable: true,
    soundCategory: 'hard'
  },
  glass: {
    id: 'glass',
    name: 'Glass',
    texture: '/textures/glass.png',
    hardness: 0.3,
    transparent: true,
    placeable: true,
    soundCategory: 'hard'
  },
  metal: {
    id: 'metal',
    name: 'Metal Block',
    texture: '/textures/metal.png',
    hardness: 2.0,
    transparent: false,
    placeable: true,
    soundCategory: 'metal'
  }
};