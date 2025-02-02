import { createClient } from '@supabase/supabase-js';
import type { UserProfile, GameState } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const auth = {
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },
};

export const profiles = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data: data as UserProfile | null, error };
  },

  async updateProfile(userId: string, updates: Partial<UserProfile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId);
    return { data, error };
  },
};

export const gameState = {
  async getGameState(userId: string) {
    const { data, error } = await supabase
      .from('game_states')
      .select('*')
      .eq('user_id', userId)
      .single();
    return { data: data as GameState | null, error };
  },

  async updateGameState(userId: string, state: Partial<GameState>) {
    const { data, error } = await supabase
      .from('game_states')
      .update(state)
      .eq('user_id', userId);
    return { data, error };
  },
};