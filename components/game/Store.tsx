
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { CAR_SKINS, WORLD_SKINS, COIN_PACKAGES } from '@/constants/gameConstants';
import { PlayerInventory, CarSkin, WorldSkin, CoinPackage } from '@/types/gameTypes';

interface StoreProps {
  inventory: PlayerInventory;
  onPurchaseCarSkin: (skinId: string) => void;
  onPurchaseWorldSkin: (skinId: string) => void;
  onPurchaseCoins: (packageId: string) => void;
  onWatchAdForCoins: (packageId: string) => void;
  onSelectCarSkin: (skinId: string) => void;
  onSelectWorldSkin: (skinId: string) => void;
  onClose: () => void;
}

export const Store: React.FC<StoreProps> = ({
  inventory,
  onPurchaseCarSkin,
  onPurchaseWorldSkin,
  onPurchaseCoins,
  onWatchAdForCoins,
  onSelectCarSkin,
  onSelectWorldSkin,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'cars' | 'worlds' | 'coins'>('cars');

  const handlePurchaseCarSkin = (skin: CarSkin) => {
    if (inventory.unlockedCarSkins.includes(skin.id)) {
      onSelectCarSkin(skin.id);
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

  const handlePurchaseCoins = (pkg: CoinPackage, index: number) => {
    // First two packages are "Watch Ad to Redeem"
    if (index < 2) {
      Alert.alert(
        'Watch Ad',
        `Watch a video ad to receive ${pkg.coins} coins for free!`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Watch Ad', onPress: () => onWatchAdForCoins(pkg.id) },
        ]
      );
    } else {
      Alert.alert(
        'Purchase Coins',
        `Buy ${pkg.coins} coins for ${pkg.priceRands}?\n\n(This is a placeholder - real IAP would be integrated here)`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Buy', onPress: () => onPurchaseCoins(pkg.id) },
        ]
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
              {COIN_PACKAGES.map((pkg, index) => {
                const isAdReward = index < 2;
                return (
                  <TouchableOpacity
                    key={pkg.id}
                    style={[
                      styles.coinPackageCard,
                      isAdReward && styles.adRewardCard,
                    ]}
                    onPress={() => handlePurchaseCoins(pkg, index)}
                  >
                    {isAdReward && (
                      <View style={styles.adBadge}>
                        <Text style={styles.adBadgeText}>📺 WATCH AD</Text>
                      </View>
                    )}
                    <Text style={styles.packageName}>{pkg.name}</Text>
                    <Text style={styles.packageCoins}>💰 {pkg.coins} Coins</Text>
                    <View style={[
                      styles.packagePriceTag,
                      isAdReward && styles.adPriceTag,
                    ]}>
                      <Text style={styles.packagePriceText}>
                        {isAdReward ? 'Watch Ad to Redeem' : pkg.priceRands}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
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
  coinsGrid: {
    paddingBottom: 20,
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
  adRewardCard: {
    borderColor: colors.speedBoost,
    backgroundColor: 'rgba(255, 213, 79, 0.1)',
  },
  adBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.speedBoost,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
    elevation: 3,
  },
  adBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.text,
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
  adPriceTag: {
    backgroundColor: colors.speedBoost,
  },
  packagePriceText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
