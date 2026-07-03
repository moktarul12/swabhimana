import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONT_SIZE, BORDER_RADIUS, SPACING } from '../constants/theme';
import { DonationStatus } from '../services/database';

const STATUS_CONFIG: Record<DonationStatus, { label: string; bg: string; color: string }> = {
  completed: { label: 'Completed', bg: '#E8F5E9', color: COLORS.primary },
  collected: { label: 'Collected', bg: '#E3F2FD', color: COLORS.collected },
  distributed: { label: 'Distributed', bg: '#F3E5F5', color: COLORS.distributed },
  pending: { label: 'Pending', bg: '#FFF3E0', color: COLORS.pending },
};

interface StatusBadgeProps {
  status: DonationStatus;
  small?: boolean;
}

export function StatusBadge({ status, small }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <View style={[styles.badge, { backgroundColor: config.bg }, small && styles.badgeSmall]}>
      <Text style={[styles.text, { color: config.color }, small && styles.textSmall]}>
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  badgeSmall: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
  },
  text: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
  },
  textSmall: {
    fontSize: FONT_SIZE.xs,
  },
});
