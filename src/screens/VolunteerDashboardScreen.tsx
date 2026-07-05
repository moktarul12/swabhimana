import React, { useCallback, useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, RefreshControl, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { APP_NAME } from '../constants/branding';
import { StatusBadge } from '../components/StatusBadge';
import { db, AdminDonation, Volunteer, clearVolunteerSession, getVolunteerSession } from '../services/database';
import { useIsDesktop } from '../hooks/useIsDesktop';

export default function VolunteerDashboardScreen({ navigation, route }: any) {
  const isDesktop = useIsDesktop();
  const [volunteer, setVolunteer] = useState<Volunteer | undefined>(route.params?.volunteer);
  const [assignments, setAssignments] = useState<AdminDonation[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!volunteer) {
      (async () => {
        const id = await getVolunteerSession();
        if (id) {
          const vol = (await db.getVolunteers()).find(v => v.id === id);
          if (vol) setVolunteer(vol);
          else navigation.replace('VolunteerLogin');
        } else {
          navigation.replace('VolunteerLogin');
        }
      })();
    }
  }, [volunteer, navigation]);

  const load = useCallback(async () => {
    if (!volunteer?.id) return;
    const data = await db.getDonationsForVolunteer(volunteer.id);
    setAssignments(data);
    setRefreshing(false);
  }, [volunteer?.id]);

  useFocusEffect(useCallback(() => { if (volunteer?.id) load(); }, [load, volunteer?.id]));

  const handleLogout = async () => {
    await clearVolunteerSession();
    navigation.replace('VolunteerLogin');
  };

  const handleMarkCollected = async (donation: AdminDonation) => {
    try {
      await db.updateDonationStatus(donation.id, 'collected');
      load();
      Alert.alert('Updated', 'Marked as collected.');
    } catch {
      Alert.alert('Error', 'Could not update status.');
    }
  };

  if (!isDesktop) {
    return (
      <View style={styles.blocked}>
        <Ionicons name="laptop-outline" size={64} color={COLORS.primary} />
        <Text style={styles.blockedTitle}>Desktop Only</Text>
        <Text style={styles.blockedText}>Volunteer dashboard requires a desktop browser.</Text>
      </View>
    );
  }

  if (!volunteer) return null;

  const active = assignments.filter(a => a.status === 'pending' || a.status === 'collected');
  const completed = assignments.filter(a => a.status === 'distributed' || a.status === 'completed');

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.brand}>
          <Ionicons name="people" size={28} color={COLORS.white} />
          <View>
            <Text style={styles.brandTitle}>{APP_NAME} Volunteer</Text>
            <Text style={styles.brandSub}>Assigned pickup requests</Text>
          </View>
        </View>
        <View style={styles.topActions}>
          <View style={styles.statPill}>
            <Text style={styles.statPillValue}>{active.length}</Text>
            <Text style={styles.statPillLabel}>Active</Text>
          </View>
          <Text style={styles.volName}>{volunteer?.name}</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
      >
        <Text style={styles.sectionTitle}>Active Assignments</Text>
        {active.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="checkmark-done-circle-outline" size={48} color={COLORS.textLight} />
            <Text style={styles.emptyText}>No active pickups assigned</Text>
          </View>
        ) : (
          active.map((d) => (
            <View key={d.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardId}>{d.id}</Text>
                <StatusBadge status={d.status} small />
              </View>
              <Text style={styles.cardCategory}>{d.category_name} · {d.quantity} items · {d.condition}</Text>
              <View style={styles.cardRow}>
                <Ionicons name="person-outline" size={16} color={COLORS.textMedium} />
                <Text style={styles.cardRowText}>{d.donor_name} · {d.donor_phone || d.contact_number}</Text>
              </View>
              <View style={styles.cardRow}>
                <Ionicons name="location-outline" size={16} color={COLORS.textMedium} />
                <Text style={styles.cardRowText}>{d.pickup_address}</Text>
              </View>
              <View style={styles.cardRow}>
                <Ionicons name="calendar-outline" size={16} color={COLORS.textMedium} />
                <Text style={styles.cardRowText}>{d.pickup_date || '—'} · {d.pickup_time || ''}</Text>
              </View>
              <View style={styles.cardActions}>
                {d.donor_phone && (
                  <TouchableOpacity style={styles.actionBtn} onPress={() => Linking.openURL(`tel:${d.donor_phone}`)}>
                    <Ionicons name="call" size={16} color={COLORS.primary} />
                    <Text style={styles.actionText}>Call Donor</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(d.pickup_address)}`)}
                >
                  <Ionicons name="map" size={16} color={COLORS.info} />
                  <Text style={[styles.actionText, { color: COLORS.info }]}>Map</Text>
                </TouchableOpacity>
                {d.status === 'pending' && (
                  <TouchableOpacity style={styles.collectBtn} onPress={() => handleMarkCollected(d)}>
                    <Ionicons name="checkmark-circle" size={16} color={COLORS.white} />
                    <Text style={styles.collectText}>Mark Collected</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
        )}

        {completed.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: SPACING.xxl }]}>Completed</Text>
            {completed.map((d) => (
              <View key={d.id} style={[styles.card, styles.cardDone]}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardId}>{d.id}</Text>
                  <StatusBadge status={d.status} small />
                </View>
                <Text style={styles.cardCategory}>{d.category_name} · {d.quantity} items</Text>
                <Text style={styles.cardRowText}>{d.donor_name} · {d.pickup_date}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4F0' },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.primary, paddingHorizontal: SPACING.xxl, paddingVertical: SPACING.lg,
  },
  brand: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  brandTitle: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.white },
  brandSub: { fontSize: FONT_SIZE.sm, color: 'rgba(255,255,255,0.8)' },
  topActions: { flexDirection: 'row', alignItems: 'center', gap: SPACING.lg },
  statPill: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.md },
  statPillValue: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.white },
  statPillLabel: { fontSize: FONT_SIZE.xs, color: 'rgba(255,255,255,0.8)' },
  volName: { fontSize: FONT_SIZE.md, color: COLORS.white, fontWeight: '500' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: SPACING.sm },
  logoutText: { color: COLORS.white, fontSize: FONT_SIZE.sm, fontWeight: '600' },
  scroll: { flex: 1 },
  scrollContent: { padding: SPACING.xxl, maxWidth: 900, width: '100%', alignSelf: 'center' },
  sectionTitle: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.textDark, marginBottom: SPACING.lg },
  emptyCard: { backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.lg, padding: SPACING.xxxl, alignItems: 'center', ...SHADOWS.small },
  emptyText: { fontSize: FONT_SIZE.md, color: COLORS.textLight, marginTop: SPACING.md },
  card: { backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.md, ...SHADOWS.medium },
  cardDone: { opacity: 0.85 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.sm },
  cardId: { fontSize: FONT_SIZE.sm, fontWeight: '700', color: COLORS.textDark },
  cardCategory: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.primary, marginBottom: SPACING.sm },
  cardRow: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm, marginBottom: 6 },
  cardRowText: { flex: 1, fontSize: FONT_SIZE.sm, color: COLORS.textMedium, lineHeight: 20 },
  cardActions: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginTop: SPACING.md },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.round, borderWidth: 1, borderColor: COLORS.border },
  actionText: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.primary },
  collectBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.round, backgroundColor: COLORS.primary },
  collectText: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.white },
  blocked: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xxl },
  blockedTitle: { fontSize: FONT_SIZE.xxl, fontWeight: '700', marginTop: SPACING.lg },
  blockedText: { fontSize: FONT_SIZE.md, color: COLORS.textMedium, textAlign: 'center', marginTop: SPACING.md },
});
