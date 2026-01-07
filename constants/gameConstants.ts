
import { CarSkin, WorldSkin, CoinPackage } from '@/types/gameTypes';
import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Game configuration
export const GAME_CONFIG = {
  // Screen dimensions
  GAME_WIDTH: SCREEN_WIDTH,
  GAME_HEIGHT: SCREEN_HEIGHT,

  // Lane configuration
  NUM_LANES: 3,
  LANE_WIDTH: SCREEN_WIDTH / 3,

  // Car configuration
  CAR_WIDTH: 60,
  CAR_HEIGHT: 100,
  CAR_START_Y: SCREEN_HEIGHT * 0.75, // Car positioned 3/4 down the screen

  // Obstacle configuration
  OBSTACLE_WIDTH: 60,
  OBSTACLE_HEIGHT: 100,
  MIN_OBSTACLE_DISTANCE: 300, // Minimum distance between obstacles

  // Pickup configuration
  PICKUP_WIDTH: 40,
  PICKUP_HEIGHT: 40,

  // Speed configuration - PROGRESSIVE SPEED SYSTEM
  INITIAL_SPEED: 5,
  BASE_SPEED: 5,
  SPEED_INCREMENT: 0.001, // Gradual speed increase per frame (legacy system)
  MAX_SPEED: 15,
  SPEED_BOOST_MULTIPLIER: 1.5,
  SPEED_BOOST_DURATION: 3000,
  
  // Progressive speed scaling
  SPEED_INCREASE_RATE: 0.0005, // Speed increases by 0.05% per unit distance
  MAX_SPEED_MULTIPLIER: 3, // Cap at 3x base speed

  // Fuel configuration
  INITIAL_FUEL: 100,
  FUEL_DRAIN_RATE: 0.05,
  FUEL_PICKUP_AMOUNT: 30,

  // Spawn intervals - PROGRESSIVE OBSTACLE FREQUENCY SYSTEM
  BASE_OBSTACLE_SPAWN_INTERVAL: 2200, // Base spawn interval in ms
  MIN_OBSTACLE_SPAWN_INTERVAL: 800, // Fastest spawn rate in ms
  OBSTACLE_FREQUENCY_INCREASE_RATE: 0.0003, // Obstacle frequency increases with distance
  
  PICKUP_SPAWN_INTERVAL: 3000,
  COIN_SPAWN_INTERVAL: 1500,

  // Scoring
  DISTANCE_SCORE_MULTIPLIER: 1,
  PICKUP_SCORE: 50,
  COIN_SCORE: 10,
  COIN_VALUE: 1,
  COINS_PER_100M: 2, // Coins earned per 100m traveled

  // Game loop
  FRAME_INTERVAL: 16, // ~60 FPS

  // Ad rewards
  AD_COIN_REWARD: 10,
  DAILY_AD_COIN_LIMIT: 3,
};

// Car skins
export const CAR_SKINS: CarSkin[] = [
  { id: 'default', name: 'Classic Red', color: '#FF4444', price: 0, unlocked: true },
  { id: 'blue', name: 'Ocean Blue', color: '#4444FF', price: 0, unlocked: false, isAdUnlock: true },
  { id: 'green', name: 'Forest Green', color: '#44FF44', price: 0, unlocked: false, isAdUnlock: true },
  { id: 'yellow', name: 'Sunshine Yellow', color: '#FFFF44', price: 100, unlocked: false },
  { id: 'purple', name: 'Royal Purple', color: '#AA44FF', price: 150, unlocked: false },
  { id: 'orange', name: 'Sunset Orange', color: '#FF8844', price: 200, unlocked: false },
  { id: 'pink', name: 'Bubblegum Pink', color: '#FF44AA', price: 250, unlocked: false },
  { id: 'cyan', name: 'Electric Cyan', color: '#44FFFF', price: 300, unlocked: false },
];

// World skins
export const WORLD_SKINS: WorldSkin[] = [
  {
    id: 'default',
    name: 'Classic Road',
    roadColor: '#555555',
    roadLineColor: '#FFFFFF',
    backgroundColor: '#88CC88',
    price: 0,
    unlocked: true,
  },
  {
    id: 'desert',
    name: 'Desert Highway',
    roadColor: '#8B7355',
    roadLineColor: '#FFE4B5',
    backgroundColor: '#F4A460',
    price: 200,
    unlocked: false,
  },
  {
    id: 'night',
    name: 'Night City',
    roadColor: '#2C2C2C',
    roadLineColor: '#FFD700',
    backgroundColor: '#1A1A2E',
    price: 300,
    unlocked: false,
  },
  {
    id: 'snow',
    name: 'Winter Road',
    roadColor: '#E0E0E0',
    roadLineColor: '#4169E1',
    backgroundColor: '#B0E0E6',
    price: 400,
    unlocked: false,
  },
];

// Coin packages
export const COIN_PACKAGES: CoinPackage[] = [
  { id: 'small', name: 'Small Bag', coins: 100, price: 0.99, priceRands: 'R 15' },
  { id: 'medium', name: 'Medium Bag', coins: 300, price: 2.49, priceRands: 'R 40' },
  { id: 'large', name: 'Large Bag', coins: 700, price: 4.99, priceRands: 'R 80' },
  { id: 'mega', name: 'Mega Bag', coins: 1500, price: 9.99, priceRands: 'R 160' },
  { id: 'ultimate', name: 'Ultimate Bag', coins: 5000, price: 24.99, priceRands: 'R 400' },
];
