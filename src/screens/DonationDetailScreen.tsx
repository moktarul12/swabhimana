import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../components/ScreenHeader';
import { StatusBadge } from '../components/StatusBadge';
import { Button } from '../components/Button';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants/theme';
import { db, ItemDonation } from '../services/database';
import { resolveImage } from '../constants/images';

export default function DonationDetailScreen({ navigation, route }: any) {
  const [donation, setDonation] = useState<ItemDonation | null>(null);

  useEffect(() => {
    if (route.params?.id) db.getItemDonationById(route.params.id).then(setDonation);
  }, [route.params?.id]);

  if (!donation) return <View style={styles.container}><ScreenHeader title="Donation Details" onBack={() => navigation.goBack()} /></View>;

  return (
    <View style={styles.container}>
      <ScreenHeader title="Donation Details" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.idRow}>
          <Text style={styles.donationId}>{donation.id}</Text>
          <StatusBadge status={donation.status} />
        </View>

        <Text style={styles.sectionTitle}>Item Details</Text>
        <View style={styles.section}>
          <View style={styles.itemRow}>
            <Image source={resolveImage(donation.image_key)} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <DetailPair label="Category" value={donation.category_name} />
              <DetailPair label="Condition" value={donation.condition} />
              <DetailPair label="Quantity" value={`${donation.quantity} Items`} />
            </View>
          </View>
          {donation.description ? (
            <View style={styles.descBlock}>
              <Text style={styles.descLabel}>Description</Text>
              <Text style={styles.descValue}>{donation.description}</Text>
            </View>
          ) : null}
        </View>

        <Text style={styles.sectionTitle}>Pickup Details</Text>
        <View style={styles.section}>
          <IconRow icon="calendar-outline" label="Picked up on" value={`${donation.pickup_date}${donation.pickup_time ? `, ${donation.pickup_time}` : ''}`} />
          <IconRow icon="location-outline" label="Address" value={donation.pickup_address} />
          {donation.volunteer_name && (
            <View style={styles.iconRow}>
              <View style={styles.iconWrap}><Ionicons name="person-outline" size={18} color={COLORS.primary} /></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rowLabel}>Volunteer</Text>
                <Text style={styles.rowValue}>{donation.volunteer_name}</Text>
                {donation.volunteer_phone ? <Text style={styles.rowValueSub}>{donation.volunteer_phone}</Text> : null}
              </View>
              {donation.volunteer_phone && (
                <TouchableOpacity style={styles.callBtn} onPress={() => Linking.openURL(`tel:${donation.volunteer_phone}`)}>
                  <Ionicons name="call" size={20} color={COLORS.white} />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {donation.delivery_date && (
          <>
            <Text style={styles.sectionTitle}>Delivery Details</Text>
            <View style={styles.section}>
              <IconRow icon="checkmark-done-outline" label="Distributed on" value={donation.delivery_date} />
            </View>
          </>
        )}
      </ScrollView>
      <View style={styles.footer}>
        <Button title="View Photos" onPress={() => navigation.navigate('DonationPhotos', { id: donation.id })} fullWidth size="lg" />
      </View>
    </View>
  );
}

function DetailPair({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.pairRow}>
      <Text style={styles.pairLabel}>{label}</Text>
      <Text style={styles.pairValue}>{value}</Text>
    </View>
  );
}

function IconRow({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) {
  return (
    <View style={styles.iconRow}>
      <View style={styles.iconWrap}><Ionicons name={icon} size={18} color={COLORS.primary} /></View>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { padding: SPACING.lg, paddingBottom: 100 },
  idRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  donationId: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.textDark },
  sectionTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.textDark, marginBottom: SPACING.md },
  section: { backgroundColor: COLORS.backgroundGray, borderRadius: BORDER_RADIUS.md, padding: SPACING.lg, marginBottom: SPACING.lg },
  itemRow: { flexDirection: 'row', gap: SPACING.md },
  itemImage: { width: 72, height: 72, borderRadius: BORDER_RADIUS.sm },
  itemInfo: { flex: 1, justifyContent: 'center' },
  pairRow: { flexDirection: 'row', marginBottom: 4 },
  pairLabel: { width: 90, fontSize: FONT_SIZE.sm, color: COLORS.textMedium },
  pairValue: { flex: 1, fontSize: FONT_SIZE.sm, fontWeight: '500', color: COLORS.textDark },
  descBlock: { marginTop: SPACING.md, paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border },
  descLabel: { fontSize: FONT_SIZE.sm, color: COLORS.textMedium, marginBottom: 2 },
  descValue: { fontSize: FONT_SIZE.md, color: COLORS.textDark, lineHeight: 20 },
  iconRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: SPACING.md, gap: SPACING.md },
  iconWrap: { width: 34, height: 34, borderRadius: 17, backgroundColor: COLORS.primaryLighter, alignItems: 'center', justifyContent: 'center' },
  rowLabel: { fontSize: FONT_SIZE.sm, color: COLORS.textMedium },
  rowValue: { fontSize: FONT_SIZE.md, fontWeight: '500', color: COLORS.textDark, marginTop: 1 },
  rowValueSub: { fontSize: FONT_SIZE.sm, color: COLORS.textMedium, marginTop: 1 },
  callBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: SPACING.lg, backgroundColor: COLORS.white, borderTopWidth: 1, borderTopColor: COLORS.borderLight },
});
