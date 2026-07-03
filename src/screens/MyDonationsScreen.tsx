import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { db, ItemDonation, formatDonationDate } from '../services/database';
import { resolveImage } from '../constants/images';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';

type TabKey = 'all' | 'pending' | 'completed';
const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
];

export default function MyDonationsScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [donations, setDonations] = useState<ItemDonation[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    const data = await db.getItemDonations(user.id, activeTab);
    setDonations(data);
    setRefreshing(false);
  }, [user, activeTab]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const renderItem = ({ item }: { item: ItemDonation }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.getParent()?.navigate('DonationDetail', { id: item.id })}>
      <Image source={resolveImage(item.image_key)} style={styles.thumbnail} />
      <View style={styles.cardContent}>
        <Text style={styles.cardId}>{item.id}</Text>
        <Text style={styles.cardCategory}>{item.category_name} - {item.quantity} Items</Text>
        <Text style={styles.cardDate}>{formatDonationDate(item.created_at)}</Text>
      </View>
      <StatusBadge status={item.status} small />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
        <Text style={styles.headerTitle}>My Donations</Text>
      </View>
      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <TouchableOpacity key={tab.key} style={[styles.tab, activeTab === tab.key && styles.tabActive]} onPress={() => setActiveTab(tab.key)}>
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={donations}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
        ListEmptyComponent={<View style={styles.empty}><Text style={styles.emptyText}>No donations found</Text></View>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  headerTitle: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.textDark },
  tabs: { flexDirection: 'row', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md, gap: SPACING.sm },
  tab: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.round, backgroundColor: COLORS.backgroundGray },
  tabActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: FONT_SIZE.sm, fontWeight: '500', color: COLORS.textMedium },
  tabTextActive: { color: COLORS.white },
  list: { padding: SPACING.lg, paddingBottom: 100 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.borderLight, gap: SPACING.md, ...SHADOWS.small },
  thumbnail: { width: 56, height: 56, borderRadius: BORDER_RADIUS.sm },
  cardContent: { flex: 1 },
  cardId: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.textDark },
  cardCategory: { fontSize: FONT_SIZE.sm, color: COLORS.textMedium, marginTop: 2 },
  cardDate: { fontSize: FONT_SIZE.xs, color: COLORS.textLight, marginTop: 2 },
  empty: { alignItems: 'center', paddingVertical: SPACING.xxxl },
  emptyText: { fontSize: FONT_SIZE.md, color: COLORS.textLight },
});
