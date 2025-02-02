export interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string;
  created_at: string;
}

export interface GameState {
  user_id: string;
  resources: {
    coins: number;
    minerals: number;
    wood: number;
  };
  buildings: Building[];
  tech_progress: TechProgress[];
}

export interface Building {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  production_rate: number;
  efficiency: number;
}

export interface TechProgress {
  tech_id: string;
  unlocked: boolean;
  progress: number;
}