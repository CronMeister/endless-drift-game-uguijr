
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '@/styles/commonStyles';

interface BannerAdProps {
  onAdLoaded?: () => void;
}

export const BannerAd: React.FC<BannerAdProps> = ({ onAdLoaded }) => {
  React.useEffect(() => {
    // Simulate ad loading
    setTimeout(() => {
      onAdLoaded?.();
    }, 100);
  }, [onAdLoaded]);

  return (
    <View style={styles.bannerContainer}>
      <Text style={styles.adText}>AdMob Banner Ad</Text>
      <Text style={styles.adSubtext}>(Placeholder - Integrate with real AdMob)</Text>
    </View>
  );
};

interface InterstitialAdProps {
  onAdClosed: () => void;
}

export const InterstitialAd: React.FC<InterstitialAdProps> = ({ onAdClosed }) => {
  return (
    <View style={styles.interstitialContainer}>
      <View style={styles.interstitialContent}>
        <Text style={styles.interstitialTitle}>Interstitial Ad</Text>
        <Text style={styles.interstitialText}>
          This is a placeholder for AdMob interstitial ad
        </Text>
        <TouchableOpacity style={styles.closeButton} onPress={onAdClosed}>
          <Text style={styles.closeButtonText}>Close Ad</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

interface RewardedAdProps {
  onAdClosed: (rewarded: boolean) => void;
}

export const RewardedAd: React.FC<RewardedAdProps> = ({ onAdClosed }) => {
  const [countdown, setCountdown] = React.useState(5);

  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleClose = () => {
    onAdClosed(countdown === 0);
  };

  return (
    <View style={styles.rewardedContainer}>
      <View style={styles.rewardedContent}>
        <Text style={styles.rewardedTitle}>Rewarded Video Ad</Text>
        <Text style={styles.rewardedText}>
          Watch the full ad to continue playing
        </Text>
        <Text style={styles.countdown}>
          {countdown > 0 ? `${countdown}s` : 'Ad Complete!'}
        </Text>
        <TouchableOpacity
          style={[styles.closeButton, countdown > 0 && styles.disabledButton]}
          onPress={handleClose}
          disabled={countdown > 0}
        >
          <Text style={styles.closeButtonText}>
            {countdown > 0 ? 'Please wait...' : 'Continue'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: colors.card,
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  adText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  adSubtext: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  interstitialContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  interstitialContent: {
    width: '80%',
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },
  interstitialTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 15,
  },
  interstitialText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  rewardedContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
  },
  rewardedContent: {
    width: '80%',
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
  },
  rewardedTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 15,
  },
  rewardedText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  countdown: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  disabledButton: {
    backgroundColor: colors.textSecondary,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
