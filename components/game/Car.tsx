
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { GAME_CONFIG } from '@/constants/gameConstants';

interface CarProps {
  x: number;
  y: number;
  hasShield: boolean;
}

export const Car: React.FC<CarProps> = ({ x, y, hasShield }) => {
  return (
    <View style={[styles.container, { left: x, top: y }]}>
      {hasShield && <View style={styles.shield} />}
      <View style={styles.car}>
        <View style={styles.carTop} />
        <View style={styles.carBody} />
        <View style={styles.carBottom} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: GAME_CONFIG.CAR_WIDTH,
    height: GAME_CONFIG.CAR_HEIGHT,
  },
  shield: {
    position: 'absolute',
    width: GAME_CONFIG.CAR_WIDTH + 10,
    height: GAME_CONFIG.CAR_HEIGHT + 10,
    left: -5,
    top: -5,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: colors.shield,
    backgroundColor: 'rgba(0, 188, 212, 0.2)',
  },
  car: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  carTop: {
    width: '70%',
    height: '25%',
    backgroundColor: colors.primary,
    alignSelf: 'center',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  carBody: {
    width: '100%',
    height: '50%',
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  carBottom: {
    width: '100%',
    height: '10%',
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
});
