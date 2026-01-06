
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
  type: 'fuel' | 'speedBoost' | 'shield' | 'coin';
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
  coins: number;
  crashCount: number;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  distance: number;
  date: string;
}

export interface CarSkin {
  id: string;
  name: string;
  color: string;
  price: number;
  unlocked: boolean;
  isAdUnlock?: boolean; // New: Mark if this car is unlocked via ad
}

export interface WorldSkin {
  id: string;
  name: string;
  roadColor: string;
  roadLineColor: string;
  backgroundColor: string;
  price: number;
  unlocked: boolean;
}

export interface CoinPackage {
  id: string;
  name: string;
  coins: number;
  price: number;
  priceRands: string;
}

export interface PlayerInventory {
  coins: number;
  selectedCarSkin: string;
  selectedWorldSkin: string;
  unlockedCarSkins: string[];
  unlockedWorldSkins: string[];
  dailyAdWatchCount: number; // New: Track daily ad watches for coins
  lastAdWatchDate: string; // New: Track last ad watch date (YYYY-MM-DD format)
}
