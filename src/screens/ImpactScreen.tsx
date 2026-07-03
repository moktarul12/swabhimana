import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { db, ImpactStats } from '../services/database';

const IMPACT_ITEMS = [
  { key: 'families_helped' as const, icon: 'people-outline' as const, label: 'Families Helped', color: '#E65100' },
  { key: 'items_donated' as const, icon: 'cube-outline' as const, label: 'Items Donated', color: '#7B1FA2' },
  { key: 'lives_impacted' as const, icon: 'heart-outline' as const, label: 'Lives Impacted', color: '#00897B' },
  { key: 'communities_reached' as const, icon: 'globe-outline' as const, label: 'Communities Reached', color: '#1B5E20' },
];

export default function ImpactScreen() {
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState<ImpactStats | null>(null);

  useEffect(() => { db.getImpactStats().then(setStats); }, []);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
          <Text style={styles.headerTitle}>Our Impact</Text>
        </View>
        <View style={styles.heroCard}>
          <Ionicons name="heart" size={40} color={COLORS.white} style={styles.heroIcon} />
          <Text style={styles.heroText}>Together, we are creating a better world!</Text>
        </View>
        <View style={styles.statsList}>
          {IMPACT_ITEMS.map((item) => (
            <View key={item.key} style={styles.statCard}>
              <View style={[styles.statIconWrap, { backgroundColor: item.color + '18' }]}>
                <Ionicons name={item.icon} size={28} color={item.color} />
              </View>
              <View style={styles.statContent}>
                <Text style={[styles.statValue, { color: item.color }]}>{stats ? stats[item.key] : '—'}</Text>
                <Text style={styles.statLabel}>{item.label}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.md },
  headerTitle: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.textDark },
  heroCard: { marginHorizontal: SPACING.lg, backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xxl, alignItems: 'center', ...SHADOWS.medium },
  heroIcon: { marginBottom: SPACING.md },
  heroText: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.white, textAlign: 'center', lineHeight: 28 },
  statsList: { padding: SPACING.lg, gap: SPACING.md },
  statCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.backgroundGray, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, gap: SPACING.lg, ...SHADOWS.small },
  statIconWrap: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  statContent: { flex: 1 },
  statValue: { fontSize: FONT_SIZE.xxl, fontWeight: '700' },
  statLabel: { fontSize: FONT_SIZE.md, color: COLORS.textMedium, marginTop: 2 },
});
