
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { Pickup as PickupType } from '@/types/gameTypes';

interface PickupProps {
  pickup: PickupType;
}

export const Pickup: React.FC<PickupProps> = ({ pickup }) => {
  const getPickupColor = () => {
    switch (pickup.type) {
      case 'fuel':
        return colors.fuel;
      case 'speedBoost':
        return colors.speedBoost;
      case 'shield':
        return colors.shield;
      case 'coin':
        return colors.coin;
      default:
        return colors.primary;
    }
  };

  const renderPickup = () => {
    switch (pickup.type) {
      case 'fuel':
        return (
          <View style={[styles.fuel, { backgroundColor: getPickupColor() }]}>
            <View style={styles.fuelInner} />
          </View>
        );
      case 'speedBoost':
        return (
          <View style={[styles.speedBoost, { backgroundColor: getPickupColor() }]}>
            <View style={styles.arrow} />
          </View>
        );
      case 'shield':
        return (
          <View style={[styles.shield, { borderColor: getPickupColor() }]}>
            <View style={[styles.shieldInner, { backgroundColor: getPickupColor() }]} />
          </View>
        );
      case 'coin':
        return (
          <View style={[styles.coin, { backgroundColor: getPickupColor() }]}>
            <Text style={styles.coinText}>$</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          left: pickup.position.x,
          top: pickup.position.y,
          width: pickup.width,
          height: pickup.height,
        },
      ]}
    >
      {renderPickup()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  fuel: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fuelInner: {
    width: '50%',
    height: '70%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 5,
  },
  speedBoost: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'rgba(33, 33, 33, 0.8)',
  },
  shield: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shieldInner: {
    width: '60%',
    height: '60%',
    borderRadius: 15,
    opacity: 0.5,
  },
  coin: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFA000',
    boxShadow: '0px 0px 8px rgba(255, 215, 0, 0.6)',
    elevation: 4,
  },
  coinText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFA000',
  },
});
