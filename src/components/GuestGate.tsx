import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { useAuth } from '../context/AuthContext';

type Props = {
  title?: string;
  message?: string;
  compact?: boolean;
};

export function GuestGate({
  title = 'Sign in to continue',
  message = 'Create a free account or log in to donate items, track pickups, and manage your profile.',
  compact = false,
}: Props) {
  const navigation = useNavigation<any>();
  const { isGuest, isSignedIn } = useAuth();

  if (isSignedIn || !isGuest) return null;

  const goLogin = () => {
    const root = navigation.getParent?.() || navigation;
    root.navigate('Login');
  };

  const goSignUp = () => {
    const root = navigation.getParent?.() || navigation;
    root.navigate('SignUp');
  };

  if (compact) {
    return (
      <TouchableOpacity style={styles.compactBanner} onPress={goLogin} activeOpacity={0.9}>
        <Ionicons name="lock-closed-outline" size={16} color={COLORS.primary} />
        <Text style={styles.compactText}>Sign in to unlock this feature</Text>
        <Text style={styles.compactCta}>Login</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Ionicons name="people-outline" size={36} color={COLORS.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity style={styles.primaryBtn} onPress={goLogin} activeOpacity={0.9}>
        <Ionicons name="log-in-outline" size={18} color={COLORS.white} />
        <Text style={styles.primaryText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryBtn} onPress={goSignUp} activeOpacity={0.9}>
        <Text style={styles.secondaryText}>Create free account</Text>
      </TouchableOpacity>
      <Text style={styles.hint}>You can still browse impact, stories, and about us as a guest.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: SPACING.lg,
    padding: SPACING.xxl,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.medium,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primaryLighter,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  title: { fontSize: FONT_SIZE.xl, fontWeight: '800', color: COLORS.textDark, textAlign: 'center' },
  message: {
    fontSize: FONT_SIZE.md,
    color: COLORS.textMedium,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.round,
    width: '100%',
    justifyContent: 'center',
  },
  primaryText: { color: COLORS.white, fontWeight: '700', fontSize: FONT_SIZE.md },
  secondaryBtn: {
    marginTop: SPACING.md,
    paddingVertical: SPACING.md,
    width: '100%',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.round,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  secondaryText: { color: COLORS.primary, fontWeight: '700', fontSize: FONT_SIZE.md },
  hint: { fontSize: FONT_SIZE.xs, color: COLORS.textLight, textAlign: 'center', marginTop: SPACING.lg },
  compactBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    backgroundColor: COLORS.primaryPale,
    borderRadius: BORDER_RADIUS.round,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  compactText: { flex: 1, fontSize: FONT_SIZE.sm, color: COLORS.textDark, fontWeight: '500' },
  compactCta: { fontSize: FONT_SIZE.sm, fontWeight: '700', color: COLORS.primary },
});
