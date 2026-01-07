
import { GameObject, Position, PlayerInventory, LeaderboardEntry } from '@/types/gameTypes';
import { GAME_CONFIG } from '@/constants/gameConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkCollision = (obj1: GameObject, obj2: GameObject): boolean => {
  return (
    obj1.position.x < obj2.position.x + obj2.width &&
    obj1.position.x + obj1.width > obj2.position.x &&
    obj1.position.y < obj2.position.y + obj2.height &&
    obj1.position.y + obj1.height > obj2.position.y
  );
};

export const isCloseCall = (obj1: GameObject, obj2: GameObject): boolean => {
  const distance = Math.abs(obj1.position.y - obj2.position.y);
  return distance < GAME_CONFIG.CLOSE_CALL_DISTANCE && obj1.lane === obj2.lane;
};

export const getLanePosition = (lane: number): number => {
  return lane * GAME_CONFIG.LANE_WIDTH + (GAME_CONFIG.LANE_WIDTH - GAME_CONFIG.CAR_WIDTH) / 2;
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const getRandomLane = (): number => {
  return Math.floor(Math.random() * GAME_CONFIG.NUM_LANES);
};

export const formatDistance = (distance: number): string => {
  return `${Math.floor(distance)}m`;
};

export const formatScore = (score: number): string => {
  return score.toString().padStart(6, '0');
};

export const playHapticFeedback = async () => {
  try {
    const Haptics = await import('expo-haptics');
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch (error) {
    console.log('Haptics not available:', error);
  }
};

const INVENTORY_KEY = '@endless_drift_inventory';
const LEADERBOARD_KEY = '@endless_drift_leaderboard';

export const saveInventory = async (inventory: PlayerInventory): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(inventory);
    await AsyncStorage.setItem(INVENTORY_KEY, jsonValue);
    console.log('Inventory saved:', inventory);
  } catch (error) {
    console.error('Error saving inventory:', error);
  }
};

export const loadInventory = async (): Promise<PlayerInventory> => {
  try {
    const jsonValue = await AsyncStorage.getItem(INVENTORY_KEY);
    if (jsonValue != null) {
      const inventory = JSON.parse(jsonValue);
      console.log('Inventory loaded:', inventory);
      return inventory;
    }
  } catch (error) {
    console.error('Error loading inventory:', error);
  }
  
  // Return default inventory
  return {
    coins: 0,
    selectedCarSkin: 'default',
    selectedWorldSkin: 'default',
    unlockedCarSkins: ['default'],
    unlockedWorldSkins: ['default'],
    dailyAdWatchCount: 0,
    lastAdWatchDate: '',
  };
};

// Leaderboard functions
export const saveLeaderboard = async (leaderboard: LeaderboardEntry[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(leaderboard);
    await AsyncStorage.setItem(LEADERBOARD_KEY, jsonValue);
    console.log('Leaderboard saved:', leaderboard);
  } catch (error) {
    console.error('Error saving leaderboard:', error);
  }
};

export const loadLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(LEADERBOARD_KEY);
    if (jsonValue != null) {
      const leaderboard = JSON.parse(jsonValue);
      console.log('Leaderboard loaded:', leaderboard);
      return leaderboard;
    }
  } catch (error) {
    console.error('Error loading leaderboard:', error);
  }
  
  return [];
};

export const addScoreToLeaderboard = async (
  playerName: string,
  score: number,
  distance: number
): Promise<LeaderboardEntry[]> => {
  try {
    const leaderboard = await loadLeaderboard();
    
    const newEntry: LeaderboardEntry = {
      id: generateId(),
      playerName: playerName.trim() || 'Anonymous',
      score,
      distance,
      date: new Date().toISOString(),
    };
    
    // Add new entry and sort by score (descending)
    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Keep only top 10
    
    await saveLeaderboard(updatedLeaderboard);
    console.log('Score added to leaderboard:', newEntry);
    
    return updatedLeaderboard;
  } catch (error) {
    console.error('Error adding score to leaderboard:', error);
    return [];
  }
};
