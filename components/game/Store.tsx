
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { CAR_SKINS, WORLD_SKINS, COIN_PACKAGES, GAME_CONFIG } from '@/constants/gameConstants';
import { PlayerInventory, CarSkin, WorldSkin, CoinPackage } from '@/types/gameTypes';

interface StoreProps {
  inventory: PlayerInventory;
  onPurchaseCarSkin: (skinId: string) => void;
  onPurchaseWorldSkin: (skinId: string) => void;
  onPurchaseCoins: (packageId: string) => void;
  onWatchAdForCar: (skinId: string) => void;
  onWatchAdForDailyCoins: () => void;
  onSelectCarSkin: (skinId: string) => void;
  onSelectWorldSkin: (skinId: string) => void;
  onClose: () => void;
}

export const Store: React.FC<StoreProps> = ({
  inventory,
  onPurchaseCarSkin,
  onPurchaseWorldSkin,
  onPurchaseCoins,
  onWatchAdForCar,
  onWatchAdForDailyCoins,
  onSelectCarSkin,
  onSelectWorldSkin,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'cars' | 'worlds' | 'coins'>('cars');

  // Check if daily ad limit reached
  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD format
  };

  const canWatchDailyAd = () => {
    const today = getTodayDateString();
    if (inventory.lastAdWatchDate !== today) {
      return true; // New day, reset count
    }
    return inventory.dailyAdWatchCount < GAME_CONFIG.DAILY_AD_COIN_LIMIT;
  };

  const getRemainingDailyAds = () => {
    const today = getTodayDateString();
    if (inventory.lastAdWatchDate !== today) {
      return GAME_CONFIG.DAILY_AD_COIN_LIMIT; // New day
    }
    return GAME_CONFIG.DAILY_AD_COIN_LIMIT - inventory.dailyAdWatchCount;
  };

  const handlePurchaseCarSkin = (skin: CarSkin) => {
    if (inventory.unlockedCarSkins.includes(skin.id)) {
      onSelectCarSkin(skin.id);
    } else if (skin.isAdUnlock) {
      // Ad-unlocked car
      Alert.alert(
        'Watch Ad to Unlock',
        `Watch a video ad to unlock ${skin.name} for free!`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Watch Ad', onPress: () => onWatchAdForCar(skin.id) },
        ]
      );
    } else if (inventory.coins >= skin.price) {
      Alert.alert(
        'Purchase Car',
        `Do you want to buy ${skin.name} for ${skin.price} coins?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Buy', onPress: () => onPurchaseCarSkin(skin.id) },
        ]
      );
    } else {
      Alert.alert('Not Enough Coins', `You need ${skin.price - inventory.coins} more coins!`);
    }
  };

  const handlePurchaseWorldSkin = (skin: WorldSkin) => {
    if (inventory.unlockedWorldSkins.includes(skin.id)) {
      onSelectWorldSkin(skin.id);
    } else if (inventory.coins >= skin.price) {
      Alert.alert(
        'Purchase World',
        `Do you want to buy ${skin.name} for ${skin.price} coins?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Buy', onPress: () => onPurchaseWorldSkin(skin.id) },
        ]
      );
    } else {
      Alert.alert('Not Enough Coins', `You need ${skin.price - inventory.coins} more coins!`);
    }
  };

  const handlePurchaseCoins = (pkg: CoinPackage) => {
    Alert.alert(
      'Purchase Coins',
      `Buy ${pkg.coins} coins for ${pkg.priceRands}?\n\n(This is a placeholder - real IAP would be integrated here)`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Buy', onPress: () => onPurchaseCoins(pkg.id) },
      ]
    );
  };

  const handleDailyAdClick = () => {
    if (canWatchDailyAd()) {
      Alert.alert(
        'Watch Ad for Coins',
        `Watch a video ad to receive ${GAME_CONFIG.AD_COIN_REWARD} coins!\n\nRemaining today: ${getRemainingDailyAds()}/${GAME_CONFIG.DAILY_AD_COIN_LIMIT}`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Watch Ad', onPress: onWatchAdForDailyCoins },
        ]
      );
    } else {
      Alert.alert(
        'Daily Limit Reached',
        `You've watched the maximum ${GAME_CONFIG.DAILY_AD_COIN_LIMIT} ads for today. Come back tomorrow for more free coins!`
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>STORE</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Coins display */}
        <View style={styles.coinsDisplay}>
          <Text style={styles.coinIcon}>💰</Text>
          <Text style={styles.coinsText}>{inventory.coins} Coins</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'cars' && styles.activeTab]}
            onPress={() => setActiveTab('cars')}
          >
            <Text style={[styles.tabText, activeTab === 'cars' && styles.activeTabText]}>
              Cars
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'worlds' && styles.activeTab]}
            onPress={() => setActiveTab('worlds')}
          >
            <Text style={[styles.tabText, activeTab === 'worlds' && styles.activeTabText]}>
              Worlds
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'coins' && styles.activeTab]}
            onPress={() => setActiveTab('coins')}
          >
            <Text style={[styles.tabText, activeTab === 'coins' && styles.activeTabText]}>
              Buy Coins
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {activeTab === 'cars' && (
            <View style={styles.itemsGrid}>
              {CAR_SKINS.map((skin) => {
                const isUnlocked = inventory.unlockedCarSkins.includes(skin.id);
                const isSelected = inventory.selectedCarSkin === skin.id;
                return (
                  <TouchableOpacity
                    key={skin.id}
                    style={[
                      styles.itemCard,
                      isSelected && styles.selectedCard,
                    ]}
                    onPress={() => handlePurchaseCarSkin(skin)}
                  >
                    <View style={[styles.carPreview, { backgroundColor: skin.color }]} />
                    <Text style={styles.itemName}>{skin.name}</Text>
                    {isSelected ? (
                      <View style={styles.selectedBadge}>
                        <Text style={styles.selectedBadgeText}>EQUIPPED</Text>
                      </View>
                    ) : isUnlocked ? (
                      <View style={styles.unlockedBadge}>
                        <Text style={styles.unlockedBadgeText}>TAP TO EQUIP</Text>
                      </View>
                    ) : skin.isAdUnlock ? (
                      <View style={styles.adUnlockTag}>
                        <Text style={styles.adUnlockText}>📺 WATCH AD</Text>
                      </View>
                    ) : (
                      <View style={styles.priceTag}>
                        <Text style={styles.priceText}>💰 {skin.price}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {activeTab === 'worlds' && (
            <View style={styles.itemsGrid}>
              {WORLD_SKINS.map((skin) => {
                const isUnlocked = inventory.unlockedWorldSkins.includes(skin.id);
                const isSelected = inventory.selectedWorldSkin === skin.id;
                return (
                  <TouchableOpacity
                    key={skin.id}
                    style={[
                      styles.itemCard,
                      isSelected && styles.selectedCard,
                    ]}
                    onPress={() => handlePurchaseWorldSkin(skin)}
                  >
                    <View style={styles.worldPreview}>
                      <View style={[styles.worldRoad, { backgroundColor: skin.roadColor }]}>
                        <View style={[styles.worldLine, { backgroundColor: skin.roadLineColor }]} />
                      </View>
                    </View>
                    <Text style={styles.itemName}>{skin.name}</Text>
                    {isSelected ? (
                      <View style={styles.selectedBadge}>
                        <Text style={styles.selectedBadgeText}>EQUIPPED</Text>
                      </View>
                    ) : isUnlocked ? (
                      <View style={styles.unlockedBadge}>
                        <Text style={styles.unlockedBadgeText}>TAP TO EQUIP</Text>
                      </View>
                    ) : (
                      <View style={styles.priceTag}>
                        <Text style={styles.priceText}>💰 {skin.price}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {activeTab === 'coins' && (
            <View style={styles.coinsGrid}>
              {/* Daily Ad for Coins - At the top */}
              <TouchableOpacity
                style={[
                  styles.dailyAdCard,
                  !canWatchDailyAd() && styles.dailyAdCardDisabled,
                ]}
                onPress={handleDailyAdClick}
              >
                <View style={styles.dailyAdHeader}>
                  <Text style={styles.dailyAdTitle}>📺 Watch Ad for Coins</Text>
                  <View style={styles.dailyAdBadge}>
                    <Text style={styles.dailyAdBadgeText}>
                      {getRemainingDailyAds()}/{GAME_CONFIG.DAILY_AD_COIN_LIMIT} Today
                    </Text>
                  </View>
                </View>
                <Text style={styles.dailyAdCoins}>💰 {GAME_CONFIG.AD_COIN_REWARD} Coins</Text>
                <View style={[
                  styles.dailyAdButton,
                  !canWatchDailyAd() && styles.dailyAdButtonDisabled,
                ]}>
                  <Text style={styles.dailyAdButtonText}>
                    {canWatchDailyAd() ? 'Watch Ad' : 'Limit Reached'}
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Separator */}
              <View style={styles.separator}>
                <View style={styles.separatorLine} />
                <Text style={styles.separatorText}>OR BUY COINS</Text>
                <View style={styles.separatorLine} />
              </View>

              {/* Coin Packages */}
              {COIN_PACKAGES.map((pkg) => (
                <TouchableOpacity
                  key={pkg.id}
                  style={styles.coinPackageCard}
                  onPress={() => handlePurchaseCoins(pkg)}
                >
                  <Text style={styles.packageName}>{pkg.name}</Text>
                  <Text style={styles.packageCoins}>💰 {pkg.coins} Coins</Text>
                  <View style={styles.packagePriceTag}>
                    <Text style={styles.packagePriceText}>{pkg.priceRands}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
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
    width: '95%',
    maxWidth: 500,
    height: '90%',
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.textSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  coinsDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.coin,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  coinIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  coinsText: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: colors.background,
    borderRadius: 15,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  itemCard: {
    width: '48%',
    backgroundColor: colors.background,
    borderRadius: 15,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(41, 98, 255, 0.1)',
  },
  carPreview: {
    width: 60,
    height: 80,
    borderRadius: 10,
    marginBottom: 8,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
    elevation: 2,
  },
  worldPreview: {
    width: '100%',
    height: 80,
    borderRadius: 10,
    marginBottom: 8,
    overflow: 'hidden',
  },
  worldRoad: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  worldLine: {
    width: 4,
    height: '100%',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  priceTag: {
    backgroundColor: colors.coin,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '800',
    color: colors.text,
  },
  selectedBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  selectedBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  unlockedBadge: {
    backgroundColor: colors.fuel,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  unlockedBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  adUnlockTag: {
    backgroundColor: colors.speedBoost,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  adUnlockText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.text,
  },
  coinsGrid: {
    paddingBottom: 20,
  },
  dailyAdCard: {
    backgroundColor: 'rgba(255, 213, 79, 0.2)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.speedBoost,
    boxShadow: '0px 4px 8px rgba(255, 213, 79, 0.3)',
    elevation: 5,
  },
  dailyAdCardDisabled: {
    opacity: 0.5,
    borderColor: colors.textSecondary,
  },
  dailyAdHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 12,
  },
  dailyAdTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  dailyAdBadge: {
    backgroundColor: colors.speedBoost,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  dailyAdBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.text,
  },
  dailyAdCoins: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.coin,
    marginBottom: 12,
  },
  dailyAdButton: {
    backgroundColor: colors.speedBoost,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  dailyAdButtonDisabled: {
    backgroundColor: colors.textSecondary,
  },
  dailyAdButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.textSecondary,
  },
  separatorText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    marginHorizontal: 10,
  },
  coinPackageCard: {
    backgroundColor: colors.background,
    borderRadius: 15,
    padding: 20,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.coin,
  },
  packageName: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  packageCoins: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.coin,
    marginBottom: 12,
  },
  packagePriceTag: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  packagePriceText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
