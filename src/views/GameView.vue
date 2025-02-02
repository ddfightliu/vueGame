<template>
  <div class="game-container">
    <div ref="gameCanvas" class="game-canvas"></div>
    <div class="game-ui">
      <BlockSelector
        :selected-block="selectedBlockId"
        @select="onBlockSelect"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { GameScene } from '../game/engine/Scene';
import BlockSelector from '../components/BlockSelector.vue';
import type { BlockType } from '../game/engine/BlockTypes';

const gameCanvas = ref<HTMLElement | null>(null);
const selectedBlockId = ref('stone');
let gameScene: GameScene | null = null;

onMounted(() => {
  if (gameCanvas.value) {
    gameScene = new GameScene(gameCanvas.value);
  }
});

onUnmounted(() => {
  if (gameScene) {
    gameScene.dispose();
  }
});

function onBlockSelect(blockType: BlockType) {
  selectedBlockId.value = blockType.id;
  if (gameScene) {
    gameScene.setSelectedBlockType(blockType);
  }
}
</script>

<style scoped>
.game-container {
  @apply w-full h-full relative;
}

.game-canvas {
  @apply w-full h-full absolute top-0 left-0;
}

.game-ui {
  @apply absolute top-0 left-0 w-full h-full pointer-events-none;
}

.game-ui > * {
  @apply pointer-events-auto;
}
</style>