import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { GameState, Building, TechProgress } from '../types/supabase';
import { gameState } from '../services/supabase';

export const useGameStore = defineStore('game', () => {
  const resources = ref({
    coins: 0,
    minerals: 0,
    wood: 0,
  });

  const buildings = ref<Building[]>([]);
  const techProgress = ref<TechProgress[]>([]);
  const userId = ref<string | null>(null);

  const totalProduction = computed(() => {
    return buildings.value.reduce((total, building) => {
      return total + building.production_rate * building.efficiency;
    }, 0);
  });

  async function loadGameState(id: string) {
    userId.value = id;
    const { data, error } = await gameState.getGameState(id);
    if (data && !error) {
      resources.value = data.resources;
      buildings.value = data.buildings;
      techProgress.value = data.tech_progress;
    }
  }

  async function saveGameState() {
    if (!userId.value) return;
    
    const state: GameState = {
      user_id: userId.value,
      resources: resources.value,
      buildings: buildings.value,
      tech_progress: techProgress.value,
    };
    
    await gameState.updateGameState(userId.value, state);
  }

  function addResource(type: keyof typeof resources.value, amount: number) {
    resources.value[type] += amount;
  }

  function addBuilding(building: Building) {
    buildings.value.push(building);
  }

  function updateTechProgress(techId: string, progress: number) {
    const tech = techProgress.value.find(t => t.tech_id === techId);
    if (tech) {
      tech.progress = progress;
      if (progress >= 100) {
        tech.unlocked = true;
      }
    }
  }

  return {
    resources,
    buildings,
    techProgress,
    totalProduction,
    loadGameState,
    saveGameState,
    addResource,
    addBuilding,
    updateTechProgress,
  };
});