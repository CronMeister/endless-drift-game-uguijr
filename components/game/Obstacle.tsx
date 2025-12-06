
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { GAME_CONFIG } from '@/constants/gameConstants';
import { Obstacle as ObstacleType } from '@/types/gameTypes';

interface ObstacleProps {
  obstacle: ObstacleType;
}

export const Obstacle: React.FC<ObstacleProps> = ({ obstacle }) => {
  const renderObstacle = () => {
    switch (obstacle.type) {
      case 'vehicle':
        return (
          <View style={styles.vehicle}>
            <View style={styles.vehicleTop} />
            <View style={styles.vehicleBody} />
          </View>
        );
      case 'roadblock':
        return (
          <View style={styles.roadblock}>
            <View style={styles.roadblockStripe} />
            <View style={styles.roadblockStripe} />
          </View>
        );
      case 'pothole':
        return <View style={styles.pothole} />;
      default:
        return null;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          left: obstacle.position.x,
          top: obstacle.position.y,
          width: obstacle.width,
          height: obstacle.height,
        },
      ]}
    >
      {renderObstacle()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  vehicle: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  vehicleTop: {
    width: '70%',
    height: '25%',
    backgroundColor: colors.obstacle,
    alignSelf: 'center',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  vehicleBody: {
    width: '100%',
    height: '70%',
    backgroundColor: colors.obstacle,
    borderRadius: 5,
  },
  roadblock: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFA000',
    borderRadius: 5,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  roadblockStripe: {
    width: '80%',
    height: 8,
    backgroundColor: '#212121',
  },
  pothole: {
    width: '100%',
    height: '100%',
    backgroundColor: '#212121',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: '#757575',
  },
});
