
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const GAME_CONFIG = {
  // Screen dimensions
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  
  // Game area
  GAME_WIDTH: Math.min(SCREEN_WIDTH, 400),
  GAME_HEIGHT: SCREEN_HEIGHT,
  
  // Lanes
  NUM_LANES: 3,
  LANE_WIDTH: Math.min(SCREEN_WIDTH, 400) / 3,
  
  // Player car
  CAR_WIDTH: 50,
  CAR_HEIGHT: 80,
  CAR_START_Y: SCREEN_HEIGHT - 200,
  
  // Obstacles
  OBSTACLE_WIDTH: 50,
  OBSTACLE_HEIGHT: 80,
  OBSTACLE_SPAWN_INTERVAL: 1500, // ms
  MIN_OBSTACLE_DISTANCE: 200,
  
  // Pickups
  PICKUP_WIDTH: 40,
  PICKUP_HEIGHT: 40,
  PICKUP_SPAWN_INTERVAL: 3000, // ms
  
  // Game mechanics
  INITIAL_SPEED: 3,
  MAX_SPEED: 12,
  SPEED_INCREMENT: 0.0005,
  INITIAL_FUEL: 100,
  FUEL_DRAIN_RATE: 0.05,
  FUEL_PICKUP_AMOUNT: 30,
  SPEED_BOOST_DURATION: 5000, // ms
  SPEED_BOOST_MULTIPLIER: 1.5,
  
  // Scoring
  DISTANCE_SCORE_MULTIPLIER: 1,
  PICKUP_SCORE: 50,
  CLOSE_CALL_SCORE: 100,
  CLOSE_CALL_DISTANCE: 100,
  
  // Difficulty
  DIFFICULTY_INCREASE_INTERVAL: 10000, // ms
  OBSTACLE_FREQUENCY_INCREASE: 0.9, // multiplier
  
  // Animation
  FRAME_RATE: 60,
  FRAME_INTERVAL: 1000 / 60,
};

export const COLORS = {
  road: '#424242',
  roadLine: '#FFFFFF',
  grass: '#4CAF50',
  car: '#2962FF',
  obstacle: '#F44336',
  fuel: '#4CAF50',
  speedBoost: '#FFD54F',
  shield: '#00BCD4',
  text: '#212121',
  textLight: '#757575',
  background: '#E0E0E0',
};
