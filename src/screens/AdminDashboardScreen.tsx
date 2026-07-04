import React, { useCallback, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList, Alert, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { APP_NAME } from '../constants/branding';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import {
  db, AdminDonation, Volunteer, DonationStatus, formatDonationDate,
} from '../services/database';
import { useIsDesktop } from '../hooks/useIsDesktop';

const STATUS_FILTERS: { key: DonationStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All Requests' },
  { key: 'pending', label: 'Pending' },
  { key: 'collected', label: 'Collected' },
  { key: 'distributed', label: 'Distributed' },
  { key: 'completed', label: 'Completed' },
];

const STATUS_OPTIONS: DonationStatus[] = ['pending', 'collected', 'distributed', 'completed'];

export default function AdminDashboardScreen({ navigation, route }: any) {
  const isDesktop = useIsDesktop();
  const admin = route.params?.admin;
  const [donations, setDonations] = useState<AdminDonation[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [filter, setFilter] = useState<DonationStatus | 'all'>('all');
  const [selected, setSelected] = useState<AdminDonation | null>(null);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const [d, v] = await Promise.all([
      db.getAllDonationsForAdmin(filter),
      db.getVolunteers(),
    ]);
    setDonations(d);
    setVolunteers(v);
    setRefreshing(false);
  }, [filter]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const handleAssign = async (volunteerId: string) => {
    if (!selected) return;
    try {
      await db.assignVolunteer(selected.id, volunteerId);
      setShowVolunteerModal(false);
      setSelected(null);
      load();
      Alert.alert('Assigned', 'Volunteer has been assigned successfully.');
    } catch {
      Alert.alert('Error', 'Failed to assign volunteer.');
    }
  };

  const handleStatusUpdate = async (status: DonationStatus) => {
    if (!selected) return;
    try {
      await db.updateDonationStatus(selected.id, status);
      setShowStatusModal(false);
      setSelected(null);
      load();
      Alert.alert('Updated', `Status changed to ${status}.`);
    } catch {
      Alert.alert('Error', 'Failed to update status.');
    }
  };

  const handleAccept = async (donation: AdminDonation) => {
    try {
      await db.acceptDonation(donation.id);
      load();
      Alert.alert('Accepted', 'Donation request accepted.');
    } catch {
      Alert.alert('Error', 'Failed to accept donation.');
    }
  };

  if (!isDesktop) {
    return (
      <View style={styles.blocked}>
        <Ionicons name="laptop-outline" size={64} color={COLORS.primary} />
        <Text style={styles.blockedTitle}>Desktop Only</Text>
        <Text style={styles.blockedText}>Admin dashboard requires a laptop or desktop browser.</Text>
      </View>
    );
  }

  const pendingCount = donations.filter(d => d.status === 'pending').length;

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.brand}>
          <Ionicons name="shield-checkmark" size={28} color={COLORS.white} />
          <View>
            <Text style={styles.brandTitle}>{APP_NAME} Admin</Text>
            <Text style={styles.brandSub}>Donation Management Portal</Text>
          </View>
        </View>
        <View style={styles.topActions}>
          <View style={styles.statPill}>
            <Text style={styles.statPillValue}>{pendingCount}</Text>
            <Text style={styles.statPillLabel}>Pending</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statPillValue}>{volunteers.length}</Text>
            <Text style={styles.statPillLabel}>Volunteers</Text>
          </View>
          <Text style={styles.adminName}>{admin?.name || 'Admin'}</Text>
          <TouchableOpacity onPress={() => navigation.replace('AdminLogin')} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filterRow}>
        {STATUS_FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        horizontal
        style={styles.tableScroll}
        contentContainerStyle={styles.tableContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
      >
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            {['ID', 'Donor', 'Category', 'Items', 'Pickup', 'Status', 'Volunteer', 'Actions'].map((h) => (
              <Text key={h} style={styles.th}>{h}</Text>
            ))}
          </View>
          {donations.map((d) => (
            <View key={d.id} style={styles.tableRow}>
              <Text style={[styles.td, styles.tdId]}>{d.id}</Text>
              <View style={styles.td}>
                <Text style={styles.donorName}>{d.donor_name}</Text>
                <Text style={styles.donorEmail}>{d.donor_email}</Text>
                {d.donor_phone && <Text style={styles.donorPhone}>{d.donor_phone}</Text>}
              </View>
              <View style={styles.td}>
                <View style={[styles.catBadge, { backgroundColor: d.category_color + '20' }]}>
                  <Text style={[styles.catText, { color: d.category_color }]}>{d.category_name}</Text>
                </View>
              </View>
              <Text style={styles.td}>{d.quantity} · {d.condition}</Text>
              <View style={styles.td}>
                <Text style={styles.pickupText}>{d.pickup_date || '—'}</Text>
                <Text style={styles.pickupSub}>{d.pickup_time || ''}</Text>
                <Text style={styles.pickupSub} numberOfLines={2}>{d.pickup_address}</Text>
              </View>
              <View style={styles.td}><StatusBadge status={d.status} small /></View>
              <View style={styles.td}>
                {d.volunteer_name ? (
                  <>
                    <Text style={styles.volName}>{d.volunteer_name}</Text>
                    <Text style={styles.volPhone}>{d.volunteer_phone}</Text>
                  </>
                ) : (
                  <Text style={styles.unassigned}>Unassigned</Text>
                )}
              </View>
              <View style={[styles.td, styles.actions]}>
                {d.status === 'pending' && !d.volunteer_name && (
                  <TouchableOpacity style={styles.actionBtn} onPress={() => handleAccept(d)}>
                    <Ionicons name="checkmark-circle" size={18} color={COLORS.primary} />
                    <Text style={styles.actionText}>Accept</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => { setSelected(d); setShowVolunteerModal(true); }}
                >
                  <Ionicons name="person-add" size={18} color={COLORS.info} />
                  <Text style={[styles.actionText, { color: COLORS.info }]}>Assign</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionBtn}
                  onPress={() => { setSelected(d); setShowStatusModal(true); }}
                >
                  <Ionicons name="swap-horizontal" size={18} color={COLORS.secondary} />
                  <Text style={[styles.actionText, { color: COLORS.secondary }]}>Status</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
          {donations.length === 0 && (
            <View style={styles.emptyRow}>
              <Text style={styles.emptyText}>No donation requests found</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <Modal visible={showVolunteerModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Assign Volunteer</Text>
            <Text style={styles.modalSub}>Request: {selected?.id}</Text>
            <FlatList
              data={volunteers}
              keyExtractor={(v) => v.id}
              style={styles.volList}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.volItem} onPress={() => handleAssign(item.id)}>
                  <View style={styles.volAvatar}>
                    <Text style={styles.volInitial}>{item.name.charAt(0)}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.volItemName}>{item.name}</Text>
                    <Text style={styles.volItemPhone}>{item.phone}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={COLORS.textLight} />
                </TouchableOpacity>
              )}
            />
            <Button title="Cancel" variant="outline" onPress={() => setShowVolunteerModal(false)} fullWidth />
          </View>
        </View>
      </Modal>

      <Modal visible={showStatusModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Update Status</Text>
            <Text style={styles.modalSub}>{selected?.id} · {selected?.category_name}</Text>
            {STATUS_OPTIONS.map((s) => (
              <TouchableOpacity
                key={s}
                style={[styles.statusOption, selected?.status === s && styles.statusOptionActive]}
                onPress={() => handleStatusUpdate(s)}
              >
                <StatusBadge status={s} small />
                {selected?.status === s && <Ionicons name="checkmark" size={20} color={COLORS.primary} />}
              </TouchableOpacity>
            ))}
            <Button title="Cancel" variant="outline" onPress={() => setShowStatusModal(false)} fullWidth style={{ marginTop: SPACING.md }} />
          </View>
        </View>
      </Modal>
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
  adminName: { fontSize: FONT_SIZE.md, color: COLORS.white, fontWeight: '500' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: SPACING.sm },
  logoutText: { color: COLORS.white, fontSize: FONT_SIZE.sm, fontWeight: '600' },
  filterRow: { flexDirection: 'row', padding: SPACING.lg, gap: SPACING.sm, flexWrap: 'wrap' },
  filterChip: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: BORDER_RADIUS.round, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border },
  filterChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { fontSize: FONT_SIZE.sm, fontWeight: '500', color: COLORS.textMedium },
  filterTextActive: { color: COLORS.white },
  tableScroll: { flex: 1 },
  tableContent: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xxl },
  table: { backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.lg, overflow: 'hidden', ...SHADOWS.medium, minWidth: 1100 },
  tableHeader: { flexDirection: 'row', backgroundColor: COLORS.primaryPale, paddingVertical: SPACING.md, paddingHorizontal: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  th: { flex: 1, minWidth: 100, fontSize: FONT_SIZE.xs, fontWeight: '700', color: COLORS.textMedium, textTransform: 'uppercase', letterSpacing: 0.5 },
  tableRow: { flexDirection: 'row', paddingVertical: SPACING.md, paddingHorizontal: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight, alignItems: 'center' },
  td: { flex: 1, minWidth: 100, fontSize: FONT_SIZE.sm, color: COLORS.textDark },
  tdId: { fontWeight: '600', fontSize: FONT_SIZE.xs },
  donorName: { fontWeight: '600', fontSize: FONT_SIZE.sm },
  donorEmail: { fontSize: FONT_SIZE.xs, color: COLORS.textLight },
  donorPhone: { fontSize: FONT_SIZE.xs, color: COLORS.textMedium },
  catBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 4, borderRadius: BORDER_RADIUS.sm, alignSelf: 'flex-start' },
  catText: { fontSize: FONT_SIZE.xs, fontWeight: '600' },
  pickupText: { fontWeight: '500' },
  pickupSub: { fontSize: FONT_SIZE.xs, color: COLORS.textLight },
  volName: { fontWeight: '600', fontSize: FONT_SIZE.sm },
  volPhone: { fontSize: FONT_SIZE.xs, color: COLORS.textLight },
  unassigned: { fontSize: FONT_SIZE.xs, color: COLORS.pending, fontStyle: 'italic' },
  actions: { flexDirection: 'column', gap: 4 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 2 },
  actionText: { fontSize: FONT_SIZE.xs, fontWeight: '600', color: COLORS.primary },
  emptyRow: { padding: SPACING.xxl, alignItems: 'center' },
  emptyText: { fontSize: FONT_SIZE.md, color: COLORS.textLight },
  modalOverlay: { flex: 1, backgroundColor: COLORS.overlay, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  modalCard: { backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.xl, padding: SPACING.xl, width: '100%', maxWidth: 440, maxHeight: '70%', ...SHADOWS.large },
  modalTitle: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.textDark },
  modalSub: { fontSize: FONT_SIZE.sm, color: COLORS.textMedium, marginBottom: SPACING.lg },
  volList: { maxHeight: 300, marginBottom: SPACING.md },
  volItem: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  volAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primaryLighter, alignItems: 'center', justifyContent: 'center' },
  volInitial: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.primary },
  volItemName: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.textDark },
  volItemPhone: { fontSize: FONT_SIZE.sm, color: COLORS.textMedium },
  statusOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.md, borderRadius: BORDER_RADIUS.md, marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.borderLight },
  statusOptionActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryLighter },
  blocked: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SPACING.xxl },
  blockedTitle: { fontSize: FONT_SIZE.xxl, fontWeight: '700', marginTop: SPACING.lg },
  blockedText: { fontSize: FONT_SIZE.md, color: COLORS.textMedium, textAlign: 'center', marginTop: SPACING.md },
});
