
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  GestureResponderEvent,
  Platform,
  Alert,
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { GAME_CONFIG, CAR_SKINS, WORLD_SKINS } from '@/constants/gameConstants';
import { GameState, Obstacle, Pickup, LeaderboardEntry, PlayerInventory } from '@/types/gameTypes';
import {
  checkCollision,
  getLanePosition,
  generateId,
  getRandomLane,
  playHapticFeedback,
  saveInventory,
  loadInventory,
} from '@/utils/gameUtils';
import { Road } from '@/components/game/Road';
import { Car } from '@/components/game/Car';
import { Obstacle as ObstacleComponent } from '@/components/game/Obstacle';
import { Pickup as PickupComponent } from '@/components/game/Pickup';
import { HUD } from '@/components/game/HUD';
import { GameOverScreen } from '@/components/game/GameOverScreen';
import { MainMenu } from '@/components/game/MainMenu';
import { Store } from '@/components/game/Store';
import { BannerAd, InterstitialAd, RewardedAd } from '@/components/game/AdMobPlaceholder';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function EndlessDriftGame() {
  // Player inventory
  const [inventory, setInventory] = useState<PlayerInventory>({
    coins: 0,
    selectedCarSkin: 'default',
    selectedWorldSkin: 'default',
    unlockedCarSkins: ['default'],
    unlockedWorldSkins: ['default'],
  });

  // Game state
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    score: 0,
    distance: 0,
    speed: GAME_CONFIG.INITIAL_SPEED,
    fuel: GAME_CONFIG.INITIAL_FUEL,
    hasShield: false,
    speedBoostActive: false,
    speedBoostTimer: 0,
    coins: 0,
    crashCount: 0,
  });

  // Player state
  const [playerLane, setPlayerLane] = useState(1);
  const [playerX, setPlayerX] = useState(getLanePosition(1));
  const playerY = GAME_CONFIG.CAR_START_Y;

  // Game objects
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [scrollOffset, setScrollOffset] = useState(0);

  // UI state
  const [showStore, setShowStore] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [gamesPlayed, setGamesPlayed] = useState(0);

  // Ad state
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [showRewarded, setShowRewarded] = useState(false);

  // Refs
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);
  const lastObstacleSpawnTime = useRef(0);
  const lastPickupSpawnTime = useRef(0);
  const lastCoinSpawnTime = useRef(0);
  const touchStartX = useRef(0);
  const crashPosition = useRef<{ lane: number; obstacles: Obstacle[]; pickups: Pickup[]; distance: number } | null>(null);

  // Load inventory on mount
  useEffect(() => {
    loadInventory().then(setInventory);
    console.log('Game initialized - automatic sign-in would happen here');
    console.log('Note: Game Center (iOS) and Google Play Games (Android) require native modules not available in current setup');
  }, []);

  // Get selected skins
  const selectedCarSkin = CAR_SKINS.find(s => s.id === inventory.selectedCarSkin) || CAR_SKINS[0];
  const selectedWorldSkin = WORLD_SKINS.find(s => s.id === inventory.selectedWorldSkin) || WORLD_SKINS[0];

  // Initialize game
  const initGame = useCallback(() => {
    setGameState({
      isPlaying: true,
      isPaused: false,
      isGameOver: false,
      score: 0,
      distance: 0,
      speed: GAME_CONFIG.INITIAL_SPEED,
      fuel: GAME_CONFIG.INITIAL_FUEL,
      hasShield: false,
      speedBoostActive: false,
      speedBoostTimer: 0,
      coins: 0,
      crashCount: 0,
    });
    setPlayerLane(1);
    setPlayerX(getLanePosition(1));
    setObstacles([]);
    setPickups([]);
    setScrollOffset(0);
    crashPosition.current = null;
    lastObstacleSpawnTime.current = 0;
    lastPickupSpawnTime.current = 0;
    lastCoinSpawnTime.current = 0;
  }, []);

  // Start game
  const startGame = useCallback(() => {
    console.log('Starting game...');
    initGame();
  }, [initGame]);

  // Restart game
  const restartGame = useCallback(() => {
    console.log('Restarting game...');
    const newGamesPlayed = gamesPlayed + 1;
    setGamesPlayed(newGamesPlayed);
    
    // Show interstitial ad every 3 games
    if (newGamesPlayed % 3 === 0) {
      setShowInterstitial(true);
      setTimeout(() => {
        setShowInterstitial(false);
        initGame();
      }, 3000);
    } else {
      initGame();
    }
  }, [gamesPlayed, initGame]);

  // Continue from crash (after watching ad)
  const continueFromCrash = useCallback(() => {
    if (crashPosition.current) {
      console.log('Continuing from crash...');
      setGameState(prev => ({
        ...prev,
        isGameOver: false,
        isPlaying: true,
        hasShield: true,
        fuel: Math.max(prev.fuel, 50),
        crashCount: prev.crashCount + 1,
      }));
      setPlayerLane(crashPosition.current.lane);
      setPlayerX(getLanePosition(crashPosition.current.lane));
      setObstacles(crashPosition.current.obstacles);
      setPickups(crashPosition.current.pickups);
      crashPosition.current = null;
    }
  }, []);

  // Watch ad to continue
  const watchAdToContinue = useCallback(() => {
    setShowRewarded(true);
  }, []);

  // Handle rewarded ad close
  const handleRewardedAdClose = useCallback((rewarded: boolean) => {
    setShowRewarded(false);
    if (rewarded) {
      continueFromCrash();
    }
  }, [continueFromCrash]);

  // Go to main menu
  const goToMainMenu = useCallback(() => {
    // Calculate coins earned from distance
    const distanceCoins = Math.floor(gameState.distance / 100) * GAME_CONFIG.COINS_PER_100M;
    const totalCoins = gameState.coins + distanceCoins;
    
    console.log(`Distance: ${gameState.distance}m, Coins from pickups: ${gameState.coins}, Coins from distance: ${distanceCoins}, Total: ${totalCoins}`);
    
    // Save coins to inventory
    setInventory(prev => {
      const updated = { ...prev, coins: prev.coins + totalCoins };
      saveInventory(updated);
      return updated;
    });
    setGameState(prev => ({ ...prev, isPlaying: false, isGameOver: false }));
  }, [gameState.coins, gameState.distance]);

  // Store handlers
  const handleOpenStore = useCallback(() => {
    setShowStore(true);
  }, []);

  const handleCloseStore = useCallback(() => {
    setShowStore(false);
  }, []);

  const handlePurchaseCarSkin = useCallback((skinId: string) => {
    const skin = CAR_SKINS.find(s => s.id === skinId);
    if (!skin) return;

    setInventory(prev => {
      if (prev.coins >= skin.price) {
        const updated = {
          ...prev,
          coins: prev.coins - skin.price,
          unlockedCarSkins: [...prev.unlockedCarSkins, skinId],
          selectedCarSkin: skinId,
        };
        saveInventory(updated);
        Alert.alert('Success!', `You purchased ${skin.name}!`);
        return updated;
      }
      return prev;
    });
  }, []);

  const handlePurchaseWorldSkin = useCallback((skinId: string) => {
    const skin = WORLD_SKINS.find(s => s.id === skinId);
    if (!skin) return;

    setInventory(prev => {
      if (prev.coins >= skin.price) {
        const updated = {
          ...prev,
          coins: prev.coins - skin.price,
          unlockedWorldSkins: [...prev.unlockedWorldSkins, skinId],
          selectedWorldSkin: skinId,
        };
        saveInventory(updated);
        Alert.alert('Success!', `You purchased ${skin.name}!`);
        return updated;
      }
      return prev;
    });
  }, []);

  const handlePurchaseCoins = useCallback((packageId: string) => {
    // In a real app, this would trigger IAP
    // For now, just simulate the purchase
    const packages = {
      small: 100,
      medium: 300,
      large: 700,
      mega: 1500,
      ultimate: 5000,
    };
    
    const coins = packages[packageId as keyof typeof packages] || 0;
    setInventory(prev => {
      const updated = { ...prev, coins: prev.coins + coins };
      saveInventory(updated);
      Alert.alert('Purchase Successful!', `You received ${coins} coins!`);
      return updated;
    });
  }, []);

  const handleSelectCarSkin = useCallback((skinId: string) => {
    setInventory(prev => {
      const updated = { ...prev, selectedCarSkin: skinId };
      saveInventory(updated);
      return updated;
    });
  }, []);

  const handleSelectWorldSkin = useCallback((skinId: string) => {
    setInventory(prev => {
      const updated = { ...prev, selectedWorldSkin: skinId };
      saveInventory(updated);
      return updated;
    });
  }, []);

  // Handle swipe
  const handleTouchStart = (event: GestureResponderEvent) => {
    touchStartX.current = event.nativeEvent.pageX;
  };

  const handleTouchEnd = (event: GestureResponderEvent) => {
    if (!gameState.isPlaying || gameState.isGameOver) return;

    const touchEndX = event.nativeEvent.pageX;
    const diff = touchEndX - touchStartX.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && playerLane < GAME_CONFIG.NUM_LANES - 1) {
        // Swipe right
        const newLane = playerLane + 1;
        setPlayerLane(newLane);
        setPlayerX(getLanePosition(newLane));
        playHapticFeedback();
      } else if (diff < 0 && playerLane > 0) {
        // Swipe left
        const newLane = playerLane - 1;
        setPlayerLane(newLane);
        setPlayerX(getLanePosition(newLane));
        playHapticFeedback();
      }
    }
  };

  // Spawn obstacle
  const spawnObstacle = useCallback(() => {
    const now = Date.now();
    if (now - lastObstacleSpawnTime.current < GAME_CONFIG.OBSTACLE_SPAWN_INTERVAL) {
      return;
    }

    const lane = getRandomLane();
    const types: ('vehicle' | 'roadblock' | 'pothole')[] = ['vehicle', 'roadblock', 'pothole'];
    const type = types[Math.floor(Math.random() * types.length)];

    const newObstacle: Obstacle = {
      id: generateId(),
      position: {
        x: getLanePosition(lane),
        y: -GAME_CONFIG.OBSTACLE_HEIGHT,
      },
      width: GAME_CONFIG.OBSTACLE_WIDTH,
      height: GAME_CONFIG.OBSTACLE_HEIGHT,
      lane,
      type,
    };

    setObstacles(prev => [...prev, newObstacle]);
    lastObstacleSpawnTime.current = now;
    console.log(`Spawned ${type} obstacle in lane ${lane}`);
  }, []);

  // Spawn pickup
  const spawnPickup = useCallback(() => {
    const now = Date.now();
    if (now - lastPickupSpawnTime.current < GAME_CONFIG.PICKUP_SPAWN_INTERVAL) {
      return;
    }

    const lane = getRandomLane();
    const types: ('fuel' | 'speedBoost' | 'shield')[] = ['fuel', 'speedBoost', 'shield'];
    const type = types[Math.floor(Math.random() * types.length)];

    const newPickup: Pickup = {
      id: generateId(),
      position: {
        x: getLanePosition(lane) + (GAME_CONFIG.LANE_WIDTH - GAME_CONFIG.PICKUP_WIDTH) / 2,
        y: -GAME_CONFIG.PICKUP_HEIGHT,
      },
      width: GAME_CONFIG.PICKUP_WIDTH,
      height: GAME_CONFIG.PICKUP_HEIGHT,
      lane,
      type,
    };

    setPickups(prev => [...prev, newPickup]);
    lastPickupSpawnTime.current = now;
    console.log(`Spawned ${type} pickup in lane ${lane}`);
  }, []);

  // Spawn coin
  const spawnCoin = useCallback(() => {
    const now = Date.now();
    if (now - lastCoinSpawnTime.current < GAME_CONFIG.COIN_SPAWN_INTERVAL) {
      return;
    }

    const lane = getRandomLane();

    const newCoin: Pickup = {
      id: generateId(),
      position: {
        x: getLanePosition(lane) + (GAME_CONFIG.LANE_WIDTH - GAME_CONFIG.PICKUP_WIDTH) / 2,
        y: -GAME_CONFIG.PICKUP_HEIGHT,
      },
      width: GAME_CONFIG.PICKUP_WIDTH,
      height: GAME_CONFIG.PICKUP_HEIGHT,
      lane,
      type: 'coin',
    };

    setPickups(prev => [...prev, newCoin]);
    lastCoinSpawnTime.current = now;
    console.log(`Spawned coin in lane ${lane}`);
  }, []);

  // Game loop
  useEffect(() => {
    if (!gameState.isPlaying || gameState.isGameOver) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    // Main game loop
    gameLoopRef.current = setInterval(() => {
      setGameState(prev => {
        // Update speed boost timer
        let newSpeedBoostTimer = prev.speedBoostTimer;
        let newSpeedBoostActive = prev.speedBoostActive;
        if (prev.speedBoostActive) {
          newSpeedBoostTimer = Math.max(0, prev.speedBoostTimer - GAME_CONFIG.FRAME_INTERVAL);
          if (newSpeedBoostTimer <= 0) {
            newSpeedBoostActive = false;
          }
        }

        // Calculate current speed
        const currentSpeed = newSpeedBoostActive
          ? prev.speed * GAME_CONFIG.SPEED_BOOST_MULTIPLIER
          : prev.speed;

        // Update distance and score
        const newDistance = prev.distance + currentSpeed;
        const newScore = prev.score + Math.floor(currentSpeed * GAME_CONFIG.DISTANCE_SCORE_MULTIPLIER);

        // Drain fuel
        const newFuel = Math.max(0, prev.fuel - GAME_CONFIG.FUEL_DRAIN_RATE);

        // Check if out of fuel
        if (newFuel <= 0) {
          console.log('Out of fuel! Game over.');
          crashPosition.current = {
            lane: playerLane,
            obstacles: [...obstacles],
            pickups: [...pickups],
            distance: newDistance,
          };
          return { ...prev, isGameOver: true, fuel: 0, distance: newDistance, crashCount: prev.crashCount + 1 };
        }

        // Gradually increase speed
        const newSpeed = Math.min(GAME_CONFIG.MAX_SPEED, prev.speed + GAME_CONFIG.SPEED_INCREMENT);

        return {
          ...prev,
          distance: newDistance,
          score: newScore,
          fuel: newFuel,
          speed: newSpeed,
          speedBoostTimer: newSpeedBoostTimer,
          speedBoostActive: newSpeedBoostActive,
        };
      });

      // Update scroll offset
      setScrollOffset(prev => prev + gameState.speed);

      // Update obstacles
      setObstacles(prev => {
        const updated = prev
          .map(obstacle => ({
            ...obstacle,
            position: {
              ...obstacle.position,
              y: obstacle.position.y + gameState.speed,
            },
          }))
          .filter(obstacle => obstacle.position.y < GAME_CONFIG.GAME_HEIGHT + 100);

        return updated;
      });

      // Update pickups
      setPickups(prev => {
        const updated = prev
          .map(pickup => ({
            ...pickup,
            position: {
              ...pickup.position,
              y: pickup.position.y + gameState.speed,
            },
          }))
          .filter(pickup => pickup.position.y < GAME_CONFIG.GAME_HEIGHT + 100);

        return updated;
      });

      // Spawn obstacles
      spawnObstacle();

      // Spawn pickups
      spawnPickup();

      // Spawn coins
      spawnCoin();
    }, GAME_CONFIG.FRAME_INTERVAL);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [gameState.isPlaying, gameState.isGameOver, gameState.speed, spawnObstacle, spawnPickup, spawnCoin, playerLane, obstacles, pickups]);

  // Check collisions
  useEffect(() => {
    if (!gameState.isPlaying || gameState.isGameOver) return;

    const playerObj = {
      id: 'player',
      position: { x: playerX, y: playerY },
      width: GAME_CONFIG.CAR_WIDTH,
      height: GAME_CONFIG.CAR_HEIGHT,
      lane: playerLane,
    };

    // Check obstacle collisions
    for (const obstacle of obstacles) {
      if (checkCollision(playerObj, obstacle)) {
        if (gameState.hasShield) {
          console.log('Shield absorbed collision!');
          playHapticFeedback();
          setGameState(prev => ({ ...prev, hasShield: false }));
          setObstacles(prev => prev.filter(o => o.id !== obstacle.id));
        } else {
          console.log('Collision! Game over.');
          playHapticFeedback();
          crashPosition.current = {
            lane: playerLane,
            obstacles: [...obstacles],
            pickups: [...pickups],
            distance: gameState.distance,
          };
          setGameState(prev => ({ ...prev, isGameOver: true, crashCount: prev.crashCount + 1 }));
        }
        break;
      }
    }

    // Check pickup collisions
    for (const pickup of pickups) {
      if (checkCollision(playerObj, pickup)) {
        console.log(`Collected ${pickup.type}!`);
        playHapticFeedback();
        
        setGameState(prev => {
          let updates: Partial<GameState> = {
            score: prev.score + (pickup.type === 'coin' ? GAME_CONFIG.COIN_SCORE : GAME_CONFIG.PICKUP_SCORE),
          };

          switch (pickup.type) {
            case 'coin':
              updates.coins = prev.coins + GAME_CONFIG.COIN_VALUE;
              break;
            case 'fuel':
              updates.fuel = Math.min(100, prev.fuel + GAME_CONFIG.FUEL_PICKUP_AMOUNT);
              break;
            case 'speedBoost':
              updates.speedBoostActive = true;
              updates.speedBoostTimer = GAME_CONFIG.SPEED_BOOST_DURATION;
              break;
            case 'shield':
              updates.hasShield = true;
              break;
          }

          return { ...prev, ...updates };
        });

        setPickups(prev => prev.filter(p => p.id !== pickup.id));
        break;
      }
    }
  }, [gameState.isPlaying, gameState.isGameOver, gameState.hasShield, gameState.distance, playerX, playerLane, obstacles, pickups]);

  // Save score to leaderboard and calculate distance coins
  useEffect(() => {
    if (gameState.isGameOver && gameState.score > 0) {
      // Calculate coins earned from distance
      const distanceCoins = Math.floor(gameState.distance / 100) * GAME_CONFIG.COINS_PER_100M;
      const totalCoins = gameState.coins + distanceCoins;
      
      console.log('Game over! Final score:', gameState.score, 'Distance:', gameState.distance, 'Coins from pickups:', gameState.coins, 'Coins from distance:', distanceCoins, 'Total coins:', totalCoins);
    }
  }, [gameState.isGameOver, gameState.score, gameState.distance, gameState.coins]);

  // Render store
  if (showStore) {
    return (
      <View style={styles.container}>
        <Store
          inventory={inventory}
          onPurchaseCarSkin={handlePurchaseCarSkin}
          onPurchaseWorldSkin={handlePurchaseWorldSkin}
          onPurchaseCoins={handlePurchaseCoins}
          onSelectCarSkin={handleSelectCarSkin}
          onSelectWorldSkin={handleSelectWorldSkin}
          onClose={handleCloseStore}
        />
      </View>
    );
  }

  // Render main menu
  if (!gameState.isPlaying && !gameState.isGameOver) {
    return (
      <View style={[styles.container, { backgroundColor: selectedWorldSkin.backgroundColor }]}>
        <BannerAd />
        <MainMenu 
          onStartGame={startGame} 
          onOpenStore={handleOpenStore}
          leaderboard={leaderboard} 
          coins={inventory.coins}
        />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: selectedWorldSkin.backgroundColor }]}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <BannerAd />
      
      {/* Game area */}
      <View style={styles.gameArea}>
        <Road 
          scrollOffset={scrollOffset} 
          roadColor={selectedWorldSkin.roadColor}
          roadLineColor={selectedWorldSkin.roadLineColor}
        />
        
        {/* Obstacles */}
        {obstacles.map(obstacle => (
          <ObstacleComponent key={obstacle.id} obstacle={obstacle} />
        ))}
        
        {/* Pickups */}
        {pickups.map(pickup => (
          <PickupComponent key={pickup.id} pickup={pickup} />
        ))}
        
        {/* Player car */}
        <Car 
          x={playerX} 
          y={playerY} 
          hasShield={gameState.hasShield}
          carColor={selectedCarSkin.color}
        />
      </View>

      {/* HUD */}
      <HUD
        score={gameState.score}
        distance={gameState.distance}
        fuel={gameState.fuel}
        speedBoostActive={gameState.speedBoostActive}
        speedBoostTimer={gameState.speedBoostTimer}
        coins={gameState.coins}
      />

      {/* Game over screen */}
      {gameState.isGameOver && (
        <GameOverScreen
          score={gameState.score}
          distance={gameState.distance}
          coins={gameState.coins + Math.floor(gameState.distance / 100) * GAME_CONFIG.COINS_PER_100M}
          crashCount={gameState.crashCount}
          onRestart={restartGame}
          onWatchAd={watchAdToContinue}
          onMainMenu={goToMainMenu}
          leaderboard={leaderboard}
        />
      )}

      {/* Interstitial ad */}
      {showInterstitial && (
        <InterstitialAd onAdClosed={() => setShowInterstitial(false)} />
      )}

      {/* Rewarded ad */}
      {showRewarded && (
        <RewardedAd onAdClosed={handleRewardedAdClose} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gameArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
