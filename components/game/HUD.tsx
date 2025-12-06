
import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity, Modal } from 'react-native';
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
  onExitToHome,
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleExitToHome = () => {
    setShowProfileMenu(false);
    if (onExitToHome) {
      onExitToHome();
    }
  };

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

      {/* Profile icon in top right */}
      <TouchableOpacity 
        style={styles.profileButton}
        onPress={() => setShowProfileMenu(true)}
      >
        <Text style={styles.profileIcon}>👤</Text>
      </TouchableOpacity>

      {/* Profile menu modal */}
      <Modal
        visible={showProfileMenu}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowProfileMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowProfileMenu(false)}
        >
          <View style={styles.profileMenu}>
            <Text style={styles.menuTitle}>PROFILE MENU</Text>
            
            <View style={styles.menuStats}>
              <Text style={styles.menuStatText}>Current Score: {formatScore(score)}</Text>
              <Text style={styles.menuStatText}>Distance: {formatDistance(distance)}</Text>
              <Text style={styles.menuStatText}>Coins: 💰 {coins}</Text>
            </View>

            <TouchableOpacity 
              style={styles.menuButton}
              onPress={handleExitToHome}
            >
              <Text style={styles.menuButtonText}>🏠 EXIT TO HOME</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.menuButton, styles.cancelButton]}
              onPress={() => setShowProfileMenu(false)}
            >
              <Text style={styles.menuButtonText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

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
  profileButton: {
    position: 'absolute',
    top: 0,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
    elevation: 3,
  },
  profileIcon: {
    fontSize: 28,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileMenu: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    width: '80%',
    maxWidth: 350,
    alignItems: 'center',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
    elevation: 5,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 20,
  },
  menuStats: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  menuStatText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  menuButton: {
    width: '100%',
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: colors.textSecondary,
  },
  menuButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
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
