
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { LeaderboardEntry } from '@/types/gameTypes';
import { formatScore } from '@/utils/gameUtils';

interface MainMenuProps {
  onStartGame: () => void;
  leaderboard: LeaderboardEntry[];
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStartGame, leaderboard }) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>ENDLESS DRIFT</Text>
        <Text style={styles.subtitle}>Race as far as you can!</Text>

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>HOW TO PLAY</Text>
          <Text style={styles.instructionText}>• Swipe left/right to change lanes</Text>
          <Text style={styles.instructionText}>• Avoid obstacles and collect pickups</Text>
          <Text style={styles.instructionText}>• Don&apos;t run out of fuel!</Text>
          <Text style={styles.instructionText}>• Speed increases over time</Text>
        </View>

        <View style={styles.pickupsContainer}>
          <Text style={styles.pickupsTitle}>PICKUPS</Text>
          <View style={styles.pickupItem}>
            <View style={[styles.pickupIcon, { backgroundColor: colors.fuel }]} />
            <Text style={styles.pickupText}>Fuel - Restores energy</Text>
          </View>
          <View style={styles.pickupItem}>
            <View style={[styles.pickupIcon, { backgroundColor: colors.speedBoost }]} />
            <Text style={styles.pickupText}>Speed Boost - Temporary speed increase</Text>
          </View>
          <View style={styles.pickupItem}>
            <View style={[styles.pickupIcon, { backgroundColor: colors.shield }]} />
            <Text style={styles.pickupText}>Shield - Protects from 1 collision</Text>
          </View>
        </View>

        <View style={styles.leaderboardContainer}>
          <Text style={styles.leaderboardTitle}>TOP SCORES</Text>
          <ScrollView style={styles.leaderboardScroll}>
            {leaderboard.slice(0, 5).map((entry, index) => (
              <View key={entry.id} style={styles.leaderboardItem}>
                <Text style={styles.leaderboardRank}>#{index + 1}</Text>
                <Text style={styles.leaderboardName}>{entry.playerName}</Text>
                <Text style={styles.leaderboardScore}>{formatScore(entry.score)}</Text>
              </View>
            ))}
            {leaderboard.length === 0 && (
              <Text style={styles.emptyLeaderboard}>No scores yet! Be the first!</Text>
            )}
          </ScrollView>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={onStartGame}>
          <Text style={styles.startButtonText}>START GAME</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 30,
    textAlign: 'center',
  },
  instructionsContainer: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  instructionText: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 5,
  },
  pickupsContainer: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  pickupsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  pickupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pickupIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  pickupText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  leaderboardContainer: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    maxHeight: 200,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  leaderboardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  leaderboardScroll: {
    maxHeight: 120,
  },
  leaderboardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 8,
    marginBottom: 5,
  },
  leaderboardRank: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
    width: 40,
  },
  leaderboardName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  leaderboardScore: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  emptyLeaderboard: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: 10,
  },
  startButton: {
    width: '100%',
    backgroundColor: colors.primary,
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
    elevation: 4,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
