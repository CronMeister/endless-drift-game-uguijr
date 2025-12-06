
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { GAME_CONFIG } from '@/constants/gameConstants';

interface CarProps {
  x: number;
  y: number;
  hasShield: boolean;
  carColor?: string;
}

export const Car: React.FC<CarProps> = ({ x, y, hasShield, carColor = colors.car }) => {
  return (
    <View style={[styles.container, { left: x, top: y }]}>
      {hasShield && <View style={styles.shield} />}
      <View style={styles.car}>
        {/* Car roof/windshield */}
        <View style={[styles.carRoof, { backgroundColor: carColor }]}>
          <View style={styles.windshield} />
        </View>
        
        {/* Car body */}
        <View style={[styles.carBody, { backgroundColor: carColor }]}>
          {/* Headlights */}
          <View style={styles.headlightsContainer}>
            <View style={styles.headlight} />
            <View style={styles.headlight} />
          </View>
          
          {/* Side windows */}
          <View style={styles.sideWindows}>
            <View style={styles.sideWindow} />
            <View style={styles.sideWindow} />
          </View>
          
          {/* Wheels */}
          <View style={styles.wheelsContainer}>
            <View style={styles.wheel} />
            <View style={styles.wheel} />
          </View>
        </View>
        
        {/* Car bumper */}
        <View style={[styles.carBumper, { backgroundColor: carColor }]} />
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
  carRoof: {
    width: '70%',
    height: '22%',
    alignSelf: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
    elevation: 2,
  },
  windshield: {
    width: '80%',
    height: '70%',
    backgroundColor: 'rgba(135, 206, 250, 0.6)',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  carBody: {
    width: '100%',
    height: '60%',
    borderRadius: 6,
    justifyContent: 'space-between',
    paddingVertical: 4,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
    elevation: 3,
  },
  headlightsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  headlight: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFEB3B',
    boxShadow: '0px 0px 4px rgba(255, 235, 59, 0.8)',
  },
  sideWindows: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },
  sideWindow: {
    width: 16,
    height: 20,
    backgroundColor: 'rgba(135, 206, 250, 0.5)',
    borderRadius: 3,
  },
  wheelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: -2,
  },
  wheel: {
    width: 12,
    height: 16,
    backgroundColor: '#212121',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#757575',
  },
  carBumper: {
    width: '100%',
    height: '10%',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.3)',
    elevation: 2,
  },
});
