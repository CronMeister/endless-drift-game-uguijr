
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { formatDistance, formatScore } from '@/utils/gameUtils';
import { LeaderboardEntry } from '@/types/gameTypes';
import { GAME_CONFIG } from '@/constants/gameConstants';

interface GameOverScreenProps {
  score: number;
  distance: number;
  coins: number;
  crashCount: number;
  onRestart: () => void;
  onWatchAd: () => void;
  onMainMenu: () => void;
  leaderboard: LeaderboardEntry[];
  onSaveScore: (playerName: string) => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  distance,
  coins,
  crashCount,
  onRestart,
  onWatchAd,
  onMainMenu,
  leaderboard,
  onSaveScore,
}) => {
  const [playerName, setPlayerName] = useState('');
  const [nameSaved, setNameSaved] = useState(false);

  const handleSaveName = () => {
    if (playerName.trim()) {
      setNameSaved(true);
      onSaveScore(playerName);
      console.log('Saving score:', { playerName, score, distance });
    }
  };

  // Only show "Watch Ad to Continue" after the first crash
  const showAdContinue = crashCount === 1;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>GAME OVER</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>FINAL SCORE</Text>
            <Text style={styles.statValue}>{formatScore(score)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>DISTANCE</Text>
            <Text style={styles.statValue}>{formatDistance(distance)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>COINS EARNED</Text>
            <Text style={[styles.statValue, { color: colors.coin }]}>💰 {coins}</Text>
          </View>
        </View>

        {!nameSaved ? (
          <View style={styles.nameInputContainer}>
            <Text style={styles.nameLabel}>Enter your name for leaderboard:</Text>
            <TextInput
              style={styles.nameInput}
              value={playerName}
              onChangeText={setPlayerName}
              placeholder="Your Name"
              placeholderTextColor={colors.textSecondary}
              maxLength={20}
            />
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSaveName}
            >
              <Text style={styles.buttonText}>SAVE SCORE</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={styles.savedText}>✅ Score saved to leaderboard!</Text>
        )}

        <View style={styles.leaderboardContainer}>
          <Text style={styles.leaderboardTitle}>🏆 LEADERBOARD</Text>
          <ScrollView style={styles.leaderboardScroll}>
            {leaderboard.slice(0, 5).map((entry, index) => (
              <View key={entry.id} style={styles.leaderboardItem}>
                <Text style={styles.leaderboardRank}>#{index + 1}</Text>
                <Text style={styles.leaderboardName}>{entry.playerName}</Text>
                <Text style={styles.leaderboardScore}>{formatScore(entry.score)}</Text>
              </View>
            ))}
            {leaderboard.length === 0 && (
              <Text style={styles.emptyLeaderboard}>No scores yet!</Text>
            )}
          </ScrollView>
        </View>

        <View style={styles.buttonContainer}>
          {showAdContinue && (
            <TouchableOpacity
              style={[styles.button, styles.adButton]}
              onPress={onWatchAd}
            >
              <Text style={styles.buttonText}>📺 WATCH AD TO CONTINUE</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.button, styles.restartButton]}
            onPress={onRestart}
          >
            <Text style={styles.buttonText}>🔄 RESTART</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.menuButton]}
            onPress={onMainMenu}
          >
            <Text style={styles.buttonText}>🏠 RETURN HOME</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  content: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 20,
  },
  statsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.primary,
  },
  nameInputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  nameLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  nameInput: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  saveButton: {
    backgroundColor: colors.primary,
  },
  savedText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.fuel,
    marginBottom: 20,
  },
  leaderboardContainer: {
    width: '100%',
    marginBottom: 20,
  },
  leaderboardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  leaderboardScroll: {
    maxHeight: 150,
  },
  leaderboardItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 10,
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
    padding: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 10,
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  adButton: {
    backgroundColor: colors.accent,
  },
  restartButton: {
    backgroundColor: colors.primary,
  },
  menuButton: {
    backgroundColor: colors.textSecondary,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
