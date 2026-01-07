
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { GameObject, LeaderboardEntry, PlayerInventory } from '@/types/gameTypes';
import { GAME_CONFIG } from '@/constants/gameConstants';

// Collision detection
export const checkCollision = (obj1: GameObject, obj2: GameObject): boolean => {
  return (
    obj1.position.x < obj2.position.x + obj2.width &&
    obj1.position.x + obj1.width > obj2.position.x &&
    obj1.position.y < obj2.position.y + obj2.height &&
    obj1.position.y + obj1.height > obj2.position.y
  );
};

// Get lane position
export const getLanePosition = (lane: number): number => {
  return lane * GAME_CONFIG.LANE_WIDTH + (GAME_CONFIG.LANE_WIDTH - GAME_CONFIG.CAR_WIDTH) / 2;
};

// Generate unique ID
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Get random lane
export const getRandomLane = (): number => {
  return Math.floor(Math.random() * GAME_CONFIG.NUM_LANES);
};

// Play haptic feedback
export const playHapticFeedback = () => {
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }
};

// Format distance
export const formatDistance = (distance: number): string => {
  return `${Math.floor(distance)}m`;
};

// Format score
export const formatScore = (score: number): string => {
  return score.toLocaleString();
};

// ============================================
// PROGRESSIVE DIFFICULTY SYSTEM
// ============================================

/**
 * Calculate speed multiplier based on distance traveled
 * Speed increases progressively as the player travels further
 * @param distance - Total distance traveled in the game
 * @returns Speed multiplier (1.0 to MAX_SPEED_MULTIPLIER)
 */
export const calculateSpeedMultiplier = (distance: number): number => {
  const multiplier = 1 + (distance * GAME_CONFIG.SPEED_INCREASE_RATE);
  return Math.min(multiplier, GAME_CONFIG.MAX_SPEED_MULTIPLIER);
};

/**
 * Calculate obstacle spawn interval based on distance traveled
 * Obstacles spawn more frequently as the player travels further
 * @param distance - Total distance traveled in the game
 * @returns Spawn interval in milliseconds
 */
export const calculateObstacleInterval = (distance: number): number => {
  const reduction = distance * GAME_CONFIG.OBSTACLE_FREQUENCY_INCREASE_RATE;
  const interval = GAME_CONFIG.BASE_OBSTACLE_SPAWN_INTERVAL - (reduction * 1000);
  return Math.max(interval, GAME_CONFIG.MIN_OBSTACLE_SPAWN_INTERVAL);
};

/**
 * Calculate current game speed based on base speed and distance
 * @param baseSpeed - The base speed of the game
 * @param distance - Total distance traveled
 * @returns Current speed value
 */
export const calculateCurrentSpeed = (baseSpeed: number, distance: number): number => {
  const multiplier = calculateSpeedMultiplier(distance);
  return baseSpeed * multiplier;
};

// ============================================
// LEADERBOARD FUNCTIONS
// ============================================

const LEADERBOARD_KEY = 'leaderboard';

export const saveLeaderboard = async (leaderboard: LeaderboardEntry[]) => {
  try {
    await AsyncStorage.setItem(LEADERBOARD_KEY, JSON.stringify(leaderboard));
  } catch (e) {
    console.error("Error saving leaderboard", e);
  }
};

export const loadLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(LEADERBOARD_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error("Error loading leaderboard", e);
    return [];
  }
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
      playerName,
      score,
      distance,
      date: new Date().toISOString(),
    };
    
    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    
    await saveLeaderboard(updatedLeaderboard);
    return updatedLeaderboard;
  } catch (e) {
    console.error("Error adding score to leaderboard", e);
    return [];
  }
};

// ============================================
// INVENTORY FUNCTIONS
// ============================================

const INVENTORY_KEY = 'playerInventory';

export const saveInventory = async (inventory: PlayerInventory) => {
  try {
    await AsyncStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory));
  } catch (e) {
    console.error("Error saving inventory", e);
  }
};

export const loadInventory = async (): Promise<PlayerInventory> => {
  try {
    const jsonValue = await AsyncStorage.getItem(INVENTORY_KEY);
    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    }
    
    // Default inventory
    return {
      coins: 0,
      selectedCarSkin: 'default',
      selectedWorldSkin: 'default',
      unlockedCarSkins: ['default'],
      unlockedWorldSkins: ['default'],
      dailyAdWatchCount: 0,
      lastAdWatchDate: '',
    };
  } catch (e) {
    console.error("Error loading inventory", e);
    return {
      coins: 0,
      selectedCarSkin: 'default',
      selectedWorldSkin: 'default',
      unlockedCarSkins: ['default'],
      unlockedWorldSkins: ['default'],
      dailyAdWatchCount: 0,
      lastAdWatchDate: '',
    };
  }
};
