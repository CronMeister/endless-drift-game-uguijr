
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { GAME_CONFIG } from '@/constants/gameConstants';

interface RoadProps {
  scrollOffset: number;
}

export const Road: React.FC<RoadProps> = ({ scrollOffset }) => {
  const lineHeight = 40;
  const lineGap = 20;
  const totalLineHeight = lineHeight + lineGap;
  const numLines = Math.ceil(GAME_CONFIG.GAME_HEIGHT / totalLineHeight) + 2;

  const renderLines = () => {
    const lines = [];
    for (let i = 0; i < numLines; i++) {
      const yPos = (i * totalLineHeight - (scrollOffset % totalLineHeight)) % (GAME_CONFIG.GAME_HEIGHT + totalLineHeight);
      lines.push(
        <View
          key={i}
          style={[
            styles.line,
            {
              top: yPos,
              height: lineHeight,
            },
          ]}
        />
      );
    }
    return lines;
  };

  return (
    <View style={styles.container}>
      {/* Lane dividers */}
      <View style={[styles.divider, { left: GAME_CONFIG.LANE_WIDTH }]}>
        {renderLines()}
      </View>
      <View style={[styles.divider, { left: GAME_CONFIG.LANE_WIDTH * 2 }]}>
        {renderLines()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: GAME_CONFIG.GAME_WIDTH,
    height: GAME_CONFIG.GAME_HEIGHT,
    backgroundColor: colors.road,
  },
  divider: {
    position: 'absolute',
    width: 4,
    height: '100%',
  },
  line: {
    position: 'absolute',
    width: 4,
    backgroundColor: colors.roadLine,
  },
});
