
import { Dimensions } from 'react-native';
import { CarSkin, WorldSkin, CoinPackage } from '@/types/gameTypes';

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
  
  // Player car - positioned 1/4 from bottom
  CAR_WIDTH: 50,
  CAR_HEIGHT: 80,
  CAR_START_Y: SCREEN_HEIGHT * 0.75 - 40, // 1/4 from bottom (75% down the screen)
  
  // Obstacles
  OBSTACLE_WIDTH: 50,
  OBSTACLE_HEIGHT: 80,
  OBSTACLE_SPAWN_INTERVAL: 800, // ms - spawn more frequently
  MIN_OBSTACLE_DISTANCE: 200,
  
  // Pickups
  PICKUP_WIDTH: 40,
  PICKUP_HEIGHT: 40,
  PICKUP_SPAWN_INTERVAL: 1500, // ms
  COIN_SPAWN_INTERVAL: 600, // ms - coins spawn more frequently
  
  // Game mechanics
  INITIAL_SPEED: 5,
  MAX_SPEED: 15,
  SPEED_INCREMENT: 0.001,
  INITIAL_FUEL: 100,
  FUEL_DRAIN_RATE: 0.06,
  FUEL_PICKUP_AMOUNT: 30,
  SPEED_BOOST_DURATION: 5000, // ms
  SPEED_BOOST_MULTIPLIER: 1.5,
  
  // Scoring
  DISTANCE_SCORE_MULTIPLIER: 1,
  PICKUP_SCORE: 50,
  COIN_VALUE: 1,
  COIN_SCORE: 10,
  CLOSE_CALL_SCORE: 100,
  CLOSE_CALL_DISTANCE: 100,
  COINS_PER_100M: 5, // Earn 5 coins per 100 meters traveled
  
  // Difficulty
  DIFFICULTY_INCREASE_INTERVAL: 8000, // ms
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
  coin: '#FFD700',
  text: '#212121',
  textLight: '#757575',
  background: '#E0E0E0',
};

export const CAR_SKINS: CarSkin[] = [
  {
    id: 'default',
    name: 'Classic Blue',
    color: '#2962FF',
    price: 0,
    unlocked: true,
  },
  {
    id: 'red_racer',
    name: 'Red Racer',
    color: '#F44336',
    price: 500,
    unlocked: false,
  },
  {
    id: 'green_machine',
    name: 'Green Machine',
    color: '#4CAF50',
    price: 500,
    unlocked: false,
  },
  {
    id: 'purple_beast',
    name: 'Purple Beast',
    color: '#9C27B0',
    price: 750,
    unlocked: false,
  },
  {
    id: 'golden_legend',
    name: 'Golden Legend',
    color: '#FFD700',
    price: 1000,
    unlocked: false,
  },
  {
    id: 'midnight_shadow',
    name: 'Midnight Shadow',
    color: '#212121',
    price: 1000,
    unlocked: false,
  },
  {
    id: 'neon_pink',
    name: 'Neon Pink',
    color: '#E91E63',
    price: 750,
    unlocked: false,
  },
  {
    id: 'cyber_cyan',
    name: 'Cyber Cyan',
    color: '#00BCD4',
    price: 750,
    unlocked: false,
  },
];

export const WORLD_SKINS: WorldSkin[] = [
  {
    id: 'default',
    name: 'Classic Road',
    roadColor: '#424242',
    roadLineColor: '#FFFFFF',
    backgroundColor: '#E0E0E0',
    price: 0,
    unlocked: true,
  },
  {
    id: 'desert',
    name: 'Desert Highway',
    roadColor: '#8D6E63',
    roadLineColor: '#FFF9C4',
    backgroundColor: '#FFECB3',
    price: 800,
    unlocked: false,
  },
  {
    id: 'night',
    name: 'Night City',
    roadColor: '#263238',
    roadLineColor: '#FFD54F',
    backgroundColor: '#37474F',
    price: 800,
    unlocked: false,
  },
  {
    id: 'snow',
    name: 'Snowy Road',
    roadColor: '#90A4AE',
    roadLineColor: '#FFFFFF',
    backgroundColor: '#ECEFF1',
    price: 1000,
    unlocked: false,
  },
  {
    id: 'neon',
    name: 'Neon Streets',
    roadColor: '#1A237E',
    roadLineColor: '#00E5FF',
    backgroundColor: '#311B92',
    price: 1200,
    unlocked: false,
  },
  {
    id: 'sunset',
    name: 'Sunset Boulevard',
    roadColor: '#5D4037',
    roadLineColor: '#FFE082',
    backgroundColor: '#FF6F00',
    price: 1000,
    unlocked: false,
  },
];

export const COIN_PACKAGES: CoinPackage[] = [
  {
    id: 'small',
    name: 'Small Bag',
    coins: 100,
    price: 19.99,
    priceRands: 'R 19.99',
  },
  {
    id: 'medium',
    name: 'Medium Bag',
    coins: 300,
    price: 49.99,
    priceRands: 'R 49.99',
  },
  {
    id: 'large',
    name: 'Large Bag',
    coins: 700,
    price: 99.99,
    priceRands: 'R 99.99',
  },
  {
    id: 'mega',
    name: 'Mega Bag',
    coins: 1500,
    price: 199.99,
    priceRands: 'R 199.99',
  },
  {
    id: 'ultimate',
    name: 'Ultimate Bag',
    coins: 5000,
    price: 499.99,
    priceRands: 'R 499.99',
  },
];
