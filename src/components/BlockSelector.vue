<template>
  <div class="block-selector">
    <div class="block-list">
      <button
        v-for="blockType in blockTypes"
        :key="blockType.id"
        :class="['block-item', { active: selectedBlock === blockType.id }]"
        @click="selectBlock(blockType)"
      >
        <img :src="blockType.texture" :alt="blockType.name" />
        <span class="block-name">{{ blockType.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { BLOCK_TYPES, type BlockType } from '../game/engine/BlockTypes';

const props = defineProps<{
  selectedBlock: string;
}>();

const emit = defineEmits<{
  (e: 'select', blockType: BlockType): void;
}>();

const blockTypes = computed(() => Object.values(BLOCK_TYPES));

function selectBlock(blockType: BlockType) {
  emit('select', blockType);
}
</script>

<style scoped>
.block-selector {
  @apply fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800/80 rounded-lg p-2;
}

.block-list {
  @apply flex gap-2;
}

.block-item {
  @apply flex flex-col items-center p-2 rounded-lg hover:bg-gray-700/80 transition-colors;
}

.block-item.active {
  @apply bg-blue-600/80;
}

.block-item img {
  @apply w-12 h-12 object-contain;
}

.block-name {
  @apply text-white text-sm mt-1;
}
</style>