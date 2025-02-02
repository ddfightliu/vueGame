import { defineStore } from 'pinia';
import { ref } from 'vue';
import { auth, profiles } from '../services/supabase';
import type { UserProfile } from '../types/supabase';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserProfile | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function login(email: string, password: string) {
    loading.value = true;
    error.value = null;
    
    try {
      const { data, error: authError } = await auth.signIn(email, password);
      if (authError) throw authError;
      
      if (data.user) {
        const { data: profile } = await profiles.getProfile(data.user.id);
        user.value = profile;
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'An error occurred during login';
    } finally {
      loading.value = false;
    }
  }

  async function register(email: string, password: string) {
    loading.value = true;
    error.value = null;
    
    try {
      const { data, error: authError } = await auth.signUp(email, password);
      if (authError) throw authError;
      
      if (data.user) {
        const { data: profile } = await profiles.getProfile(data.user.id);
        user.value = profile;
      }
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'An error occurred during registration';
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    const { error: logoutError } = await auth.signOut();
    if (!logoutError) {
      user.value = null;
    }
  }

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
  };
});