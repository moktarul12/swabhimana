import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { ItemDonation, formatDonationDate } from '../services/database';
import { resolveImage } from '../constants/images';
import { StatusBadge } from './StatusBadge';

const STATUS_PROGRESS: Record<string, number> = {
  pending: 25,
  collected: 50,
  distributed: 75,
  completed: 100,
};

interface DonationCardProps {
  donation: ItemDonation;
  onPress?: () => void;
  compact?: boolean;
}

export function DonationCard({ donation, onPress, compact }: DonationCardProps) {
  const progress = STATUS_PROGRESS[donation.status] ?? 0;

  return (
    <TouchableOpacity
      style={[styles.card, compact && styles.cardCompact]}
      onPress={onPress}
      activeOpacity={0.88}
      disabled={!onPress}
    >
      <View style={styles.topRow}>
        <View style={[styles.categoryIcon, { backgroundColor: donation.category_color + '20' }]}>
          <Ionicons name={donation.category_icon as any} size={22} color={donation.category_color} />
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.categoryName}>{donation.category_name}</Text>
          <Text style={styles.donationId}>{donation.id}</Text>
        </View>
        <StatusBadge status={donation.status} small />
      </View>

      <View style={styles.bodyRow}>
        <Image source={resolveImage(donation.image_key)} style={styles.thumbnail} />
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Ionicons name="cube-outline" size={14} color={COLORS.textLight} />
            <Text style={styles.detailText}>{donation.quantity} items · {donation.condition}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={14} color={COLORS.textLight} />
            <Text style={styles.detailText}>{formatDonationDate(donation.created_at)}</Text>
          </View>
          {donation.pickup_date && (
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={14} color={COLORS.textLight} />
              <Text style={styles.detailText}>{donation.pickup_date} · {donation.pickup_time}</Text>
            </View>
          )}
          {donation.volunteer_name && (
            <View style={styles.volunteerRow}>
              <Ionicons name="person-circle-outline" size={14} color={COLORS.primary} />
              <Text style={styles.volunteerText}>{donation.volunteer_name}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressTrack}>
          <LinearGradient
            colors={[donation.category_color, COLORS.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${progress}%` }]}
          />
        </View>
        <Text style={styles.progressLabel}>{progress}% complete</Text>
      </View>

      {onPress && (
        <View style={styles.footer}>
          <Text style={styles.viewDetails}>View details</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.primary} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.medium,
  },
  cardCompact: { padding: SPACING.md },
  topRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  categoryIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  headerContent: { flex: 1 },
  categoryName: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.textDark },
  donationId: { fontSize: FONT_SIZE.xs, color: COLORS.textLight, marginTop: 2 },
  bodyRow: { flexDirection: 'row', gap: SPACING.md },
  thumbnail: { width: 72, height: 72, borderRadius: BORDER_RADIUS.md },
  details: { flex: 1, gap: 6 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  detailText: { fontSize: FONT_SIZE.sm, color: COLORS.textMedium, flex: 1 },
  volunteerRow: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.primaryLighter, paddingHorizontal: SPACING.sm, paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm, alignSelf: 'flex-start',
  },
  volunteerText: { fontSize: FONT_SIZE.xs, fontWeight: '600', color: COLORS.primary },
  progressSection: { marginTop: SPACING.md },
  progressTrack: { height: 6, backgroundColor: COLORS.borderLight, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  progressLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textLight, marginTop: 4, textAlign: 'right' },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: SPACING.sm, gap: 4 },
  viewDetails: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.primary },
});
