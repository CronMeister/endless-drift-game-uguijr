
import { GameObject, Position } from '@/types/gameTypes';
import { GAME_CONFIG } from '@/constants/gameConstants';

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
