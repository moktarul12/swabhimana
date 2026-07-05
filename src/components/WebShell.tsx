import React from 'react';
import { View, Text, StyleSheet, Platform, useWindowDimensions, Image, Linking, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { LOCAL_IMAGES } from '../constants/images';
import { AboutPanel } from './AboutPanel';
import { APP_NAME, APP_TAGLINE, APP_URL, MOTTO, CONTACT } from '../constants/branding';

const LAPTOP_MIN = 1024;

function isAdminRoute(): boolean {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return false;
  return window.location.pathname.includes('/admin');
}

function WebTopBar() {
  return (
    <View style={styles.topBar}>
      <View style={styles.topBarLeft}>
        <Image source={LOCAL_IMAGES.logoMark} style={styles.topLogo} resizeMode="contain" />
        <View>
          <Text style={styles.topBrand}>{APP_NAME}</Text>
          <Text style={styles.topTagline}>{APP_TAGLINE}</Text>
        </View>
      </View>
      <View style={styles.topBarRight}>
        <TouchableOpacity style={styles.topLink} onPress={() => Linking.openURL(APP_URL)}>
          <Ionicons name="globe-outline" size={16} color={COLORS.primary} />
          <Text style={styles.topLinkText}>ManavSathis.com</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.adminLink}
          onPress={() => { if (typeof window !== 'undefined') window.location.href = '/admin'; }}
        >
          <Ionicons name="shield-outline" size={16} color={COLORS.white} />
          <Text style={styles.adminLinkText}>Admin</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function WebShell({ children }: { children: React.ReactNode }) {
  const { width, height } = useWindowDimensions();

  if (Platform.OS !== 'web') return <>{children}</>;

  if (isAdminRoute()) {
    return <View style={styles.adminRoot}>{children}</View>;
  }

  const isLaptop = width >= LAPTOP_MIN;

  if (!isLaptop) {
    return <View style={styles.mobileWebRoot}>{children}</View>;
  }

  return (
    <View style={styles.laptopRoot}>
      <WebTopBar />
      <View style={[styles.splitLayout, { minHeight: (height - 64) as any }]}>
        <View style={styles.aboutColumn}>
          <AboutPanel compact showContact />
        </View>
        <View style={styles.appColumn}>
          <View style={styles.appCard}>
            <View style={styles.appCardHeader}>
              <Ionicons name="phone-portrait-outline" size={16} color={COLORS.textLight} />
              <Text style={styles.appCardHeaderText}>Use the app</Text>
            </View>
            <View style={styles.appViewport}>{children}</View>
          </View>
          <View style={styles.appFooter}>
            <Text style={styles.footerMotto}>{MOTTO}</Text>
            <Text style={styles.footerContact}>{CONTACT.name} · {CONTACT.phone}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  adminRoot: { flex: 1, minHeight: '100vh' as any, backgroundColor: COLORS.white },
  mobileWebRoot: { flex: 1, minHeight: '100vh' as any, backgroundColor: COLORS.white, width: '100%' },
  laptopRoot: { flex: 1, minHeight: '100vh' as any, backgroundColor: '#F0F4F0' },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: COLORS.white, paddingHorizontal: SPACING.xxl, paddingVertical: SPACING.md,
    borderBottomWidth: 1, borderBottomColor: COLORS.borderLight, ...SHADOWS.small,
  },
  topBarLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  topLogo: { width: 40, height: 40 },
  topBrand: { fontSize: FONT_SIZE.xl, fontWeight: '800', color: COLORS.primary },
  topTagline: { fontSize: FONT_SIZE.xs, color: COLORS.textMedium },
  topBarRight: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  topLink: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  topLinkText: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.primary },
  adminLink: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.primary, paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
  },
  adminLinkText: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.white },
  splitLayout: { flex: 1, flexDirection: 'row', maxWidth: 1400, width: '100%', alignSelf: 'center', padding: SPACING.xl, gap: SPACING.xl },
  aboutColumn: {
    flex: 1, maxWidth: 560, backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl, overflow: 'hidden', ...SHADOWS.medium,
    maxHeight: 'calc(100vh - 120px)' as any,
  },
  appColumn: { width: 420, flexShrink: 0, alignItems: 'center' },
  appCard: {
    flex: 1, width: '100%', backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl, overflow: 'hidden', ...SHADOWS.large,
    maxHeight: 'calc(100vh - 180px)' as any,
  },
  appCardHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: SPACING.sm, backgroundColor: COLORS.primaryPale,
    borderBottomWidth: 1, borderBottomColor: COLORS.borderLight,
  },
  appCardHeaderText: { fontSize: FONT_SIZE.xs, color: COLORS.textLight, fontWeight: '500' },
  appViewport: { flex: 1, overflow: 'hidden' as any },
  appFooter: { alignItems: 'center', paddingTop: SPACING.md, paddingHorizontal: SPACING.md },
  footerMotto: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.primary, fontStyle: 'italic', textAlign: 'center' },
  footerContact: { fontSize: FONT_SIZE.xs, color: COLORS.textLight, marginTop: 4, textAlign: 'center' },
});
