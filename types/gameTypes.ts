
export interface Position {
  x: number;
  y: number;
}

export interface GameObject {
  id: string;
  position: Position;
  width: number;
  height: number;
  lane: number;
}

export interface Obstacle extends GameObject {
  type: 'vehicle' | 'roadblock' | 'pothole';
}

export interface Pickup extends GameObject {
  type: 'fuel' | 'speedBoost' | 'shield';
}

export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  score: number;
  distance: number;
  speed: number;
  fuel: number;
  hasShield: boolean;
  speedBoostActive: boolean;
  speedBoostTimer: number;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  distance: number;
  date: string;
}
