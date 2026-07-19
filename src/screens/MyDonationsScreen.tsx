import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants/theme';
import { db, ItemDonation } from '../services/database';
import { DonationCard } from '../components/DonationCard';
import { useAuth } from '../context/AuthContext';
import { GuestGate } from '../components/GuestGate';

type TabKey = 'all' | 'pending' | 'completed';
const TABS: { key: TabKey; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'all', label: 'All', icon: 'layers-outline' },
  { key: 'pending', label: 'In Progress', icon: 'time-outline' },
  { key: 'completed', label: 'Completed', icon: 'checkmark-circle-outline' },
];

export default function MyDonationsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user, isSignedIn } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [donations, setDonations] = useState<ItemDonation[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user) {
      setDonations([]);
      setRefreshing(false);
      return;
    }
    const data = await db.getItemDonations(user.id, activeTab);
    setDonations(data);
    setRefreshing(false);
  }, [user, activeTab]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const pendingCount = donations.filter(d => d.status !== 'completed').length;

  if (!isSignedIn) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#F1F8F1', COLORS.white]} style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
          <Text style={styles.headerTitle}>My Donations</Text>
          <Text style={styles.headerSub}>Track every item you've shared with love</Text>
        </LinearGradient>
        <GuestGate
          title="Login to see your donations"
          message="Your donation history and tracking appear here after you sign in."
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#F1F8F1', COLORS.white]} style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
        <Text style={styles.headerTitle}>My Donations</Text>
        <Text style={styles.headerSub}>Track every item you've shared with love</Text>
        {activeTab === 'all' && pendingCount > 0 && (
          <View style={styles.summaryPill}>
            <Ionicons name="hourglass-outline" size={14} color={COLORS.pending} />
            <Text style={styles.summaryText}>{pendingCount} in progress</Text>
          </View>
        )}
      </LinearGradient>

      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity key={tab.key} style={styles.tabWrap} onPress={() => setActiveTab(tab.key)}>
            <Text style={[styles.tab, activeTab === tab.key && styles.tabActive]}>
              <Ionicons name={tab.icon} size={14} color={activeTab === tab.key ? COLORS.primary : COLORS.textLight} />
              {'  '}{tab.label}
            </Text>
            {activeTab === tab.key && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={donations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DonationCard
            donation={item}
            onPress={() => navigation.getParent()?.navigate('DonationDetail', { id: item.id })}
          />
        )}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} colors={[COLORS.primary]} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="gift-outline" size={48} color={COLORS.primary} />
            </View>
            <Text style={styles.emptyTitle}>No donations yet</Text>
            <Text style={styles.emptyText}>Start your giving journey — every item makes a difference!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg },
  headerTitle: { fontSize: FONT_SIZE.xxxl, fontWeight: '700', color: COLORS.textDark },
  headerSub: { fontSize: FONT_SIZE.md, color: COLORS.textMedium, marginTop: 4 },
  summaryPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
    backgroundColor: '#FFF3E0', paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round, marginTop: SPACING.sm,
  },
  summaryText: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.pending },
  tabs: { flexDirection: 'row', paddingHorizontal: SPACING.lg, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight, backgroundColor: COLORS.white },
  tabWrap: { marginRight: SPACING.xl, paddingVertical: SPACING.md },
  tab: { fontSize: FONT_SIZE.md, fontWeight: '500', color: COLORS.textLight },
  tabActive: { color: COLORS.primary, fontWeight: '700' },
  tabIndicator: { height: 3, backgroundColor: COLORS.primary, borderRadius: 2, marginTop: SPACING.sm },
  list: { padding: SPACING.lg, paddingBottom: 100 },
  empty: { alignItems: 'center', paddingVertical: SPACING.xxxl * 2 },
  emptyIcon: { width: 88, height: 88, borderRadius: 44, backgroundColor: COLORS.primaryLighter, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.lg },
  emptyTitle: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.textDark },
  emptyText: { fontSize: FONT_SIZE.md, color: COLORS.textMedium, textAlign: 'center', marginTop: SPACING.sm, paddingHorizontal: SPACING.xxl },
});
