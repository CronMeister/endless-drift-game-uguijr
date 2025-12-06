
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { formatDistance, formatScore } from '@/utils/gameUtils';

interface HUDProps {
  score: number;
  distance: number;
  fuel: number;
  speedBoostActive: boolean;
  speedBoostTimer: number;
  coins: number;
  onExitToHome?: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  score,
  distance,
  fuel,
  speedBoostActive,
  speedBoostTimer,
  coins,
}) => {
  return (
    <View style={styles.container}>
      {/* Top HUD */}
      <View style={styles.topHUD}>
        <View style={styles.scoreContainer}>
          <Text style={styles.label}>SCORE</Text>
          <Text style={styles.score}>{formatScore(score)}</Text>
        </View>
        <View style={styles.coinsContainer}>
          <Text style={styles.coinIcon}>💰</Text>
          <Text style={styles.coins}>{coins}</Text>
        </View>
        <View style={styles.distanceContainer}>
          <Text style={styles.label}>DISTANCE</Text>
          <Text style={styles.distance}>{formatDistance(distance)}</Text>
        </View>
      </View>

      {/* Fuel bar */}
      <View style={styles.fuelBarContainer}>
        <Text style={styles.fuelLabel}>FUEL</Text>
        <View style={styles.fuelBarBackground}>
          <View
            style={[
              styles.fuelBar,
              {
                width: `${Math.max(0, Math.min(100, fuel))}%`,
                backgroundColor: fuel > 30 ? colors.fuel : fuel > 15 ? colors.speedBoost : colors.obstacle,
              },
            ]}
          />
        </View>
        <Text style={styles.fuelText}>{Math.floor(fuel)}%</Text>
      </View>

      {/* Speed boost indicator */}
      {speedBoostActive && (
        <View style={styles.speedBoostContainer}>
          <Text style={styles.speedBoostText}>
            ⚡ SPEED BOOST! {Math.ceil(speedBoostTimer / 1000)}s
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 48 : 60,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    zIndex: 100,
  },
  topHUD: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  scoreContainer: {
    alignItems: 'flex-start',
  },
  coinsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.9)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
    elevation: 3,
  },
  coinIcon: {
    fontSize: 20,
    marginRight: 4,
  },
  coins: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  distanceContainer: {
    alignItems: 'flex-end',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  score: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  distance: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
  },
  fuelBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 10,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
    elevation: 3,
  },
  fuelLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    marginRight: 10,
  },
  fuelBarBackground: {
    flex: 1,
    height: 20,
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
  },
  fuelBar: {
    height: '100%',
    borderRadius: 10,
  },
  fuelText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 10,
    minWidth: 40,
    textAlign: 'right',
  },
  speedBoostContainer: {
    marginTop: 10,
    backgroundColor: colors.speedBoost,
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
    elevation: 3,
  },
  speedBoostText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
});
