import React from 'react';
import { View, Text, StyleSheet, Platform, useWindowDimensions, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { LOCAL_IMAGES } from '../constants/images';
import { APP_NAME, APP_TAGLINE, MOTTO, CONTACT } from '../constants/branding';

const LAPTOP_MIN = 768;

function isAdminRoute(): boolean {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return false;
  return window.location.pathname.includes('/admin');
}

function SidePanel({ side }: { side: 'left' | 'right' }) {
  if (side === 'left') {
    return (
      <ScrollView style={styles.sidePanel} contentContainerStyle={styles.sideContent}>
        <LinearGradient colors={['#0D3B12', '#1B5E20']} style={styles.sideHero}>
          <Image source={LOCAL_IMAGES.homeFamily} style={styles.sideHeroImage} />
          <View style={styles.sideHeroOverlay} />
          <Text style={styles.sideHeroTitle}>{APP_NAME}</Text>
          <Text style={styles.sideHeroTagline}>{APP_TAGLINE}</Text>
        </LinearGradient>
        <Text style={styles.sideMotto}>{MOTTO}</Text>
        <View style={styles.sideFeature}>
          <Ionicons name="heart" size={20} color={COLORS.primary} />
          <Text style={styles.sideFeatureText}>Every act of kindness changes a life</Text>
        </View>
        <View style={styles.sideFeature}>
          <Ionicons name="people" size={20} color={COLORS.primary} />
          <Text style={styles.sideFeatureText}>Connect helpers with those in need</Text>
        </View>
        <View style={styles.sideFeature}>
          <Ionicons name="shield-checkmark" size={20} color={COLORS.primary} />
          <Text style={styles.sideFeatureText}>Transparency, trust & dignity</Text>
        </View>
        <Image source={LOCAL_IMAGES.programEducation} style={styles.sideImage} />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.sidePanel} contentContainerStyle={styles.sideContent}>
      <Image source={LOCAL_IMAGES.splashChildren} style={styles.sideImageTop} />
      <Text style={styles.sideSectionTitle}>Get in Touch</Text>
      <View style={styles.contactCard}>
        <Ionicons name="person" size={18} color={COLORS.primary} />
        <Text style={styles.contactText}>{CONTACT.name}</Text>
      </View>
      <View style={styles.contactCard}>
        <Ionicons name="call" size={18} color={COLORS.primary} />
        <Text style={styles.contactText}>{CONTACT.phone}</Text>
      </View>
      <View style={styles.contactCard}>
        <Ionicons name="location" size={18} color={COLORS.primary} />
        <Text style={styles.contactText}>{CONTACT.address}</Text>
      </View>
      <Image source={LOCAL_IMAGES.programFood} style={styles.sideImage} />
      <Image source={LOCAL_IMAGES.programHealth} style={styles.sideImage} />
    </ScrollView>
  );
}

export function WebShell({ children }: { children: React.ReactNode }) {
  const { width } = useWindowDimensions();

  if (Platform.OS !== 'web') return <>{children}</>;

  if (isAdminRoute()) {
    return <View style={styles.adminRoot}>{children}</View>;
  }

  const isMobileWeb = width < LAPTOP_MIN;
  const isLaptop = width >= LAPTOP_MIN;

  if (isMobileWeb) {
    return <View style={styles.mobileWebRoot}>{children}</View>;
  }

  return (
    <LinearGradient colors={['#E8F5E9', '#F5F5F5', '#E8F5E9']} style={styles.laptopRoot}>
      <View style={styles.laptopLayout}>
        <SidePanel side="left" />
        <View style={styles.phoneFrame}>
          <View style={styles.phoneNotch} />
          <View style={styles.phoneScreen}>{children}</View>
        </View>
        <SidePanel side="right" />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  adminRoot: { flex: 1, minHeight: '100vh' as any },
  mobileWebRoot: {
    flex: 1,
    minHeight: '100vh' as any,
    backgroundColor: COLORS.white,
    width: '100%',
  },
  mobileWebFrame: { flex: 1, width: '100%' },
  laptopRoot: { flex: 1, minHeight: '100vh' as any },
  laptopLayout: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.xl,
    minHeight: '100vh' as any,
  },
  sidePanel: { flex: 1, maxWidth: 320, maxHeight: '90vh' as any },
  sideContent: { paddingBottom: SPACING.xxl },
  sideHero: { borderRadius: BORDER_RADIUS.lg, overflow: 'hidden', height: 180, justifyContent: 'flex-end', padding: SPACING.lg, marginBottom: SPACING.lg },
  sideHeroImage: { ...StyleSheet.absoluteFill, width: '100%', height: '100%', resizeMode: 'cover' },
  sideHeroOverlay: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(13,59,18,0.65)' },
  sideHeroTitle: { fontSize: FONT_SIZE.xxl, fontWeight: '800', color: COLORS.white, zIndex: 1 },
  sideHeroTagline: { fontSize: FONT_SIZE.sm, color: 'rgba(255,255,255,0.9)', zIndex: 1, marginTop: 4 },
  sideMotto: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.primary, fontStyle: 'italic', marginBottom: SPACING.lg, lineHeight: 22 },
  sideFeature: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.md },
  sideFeatureText: { flex: 1, fontSize: FONT_SIZE.sm, color: COLORS.textMedium, lineHeight: 20 },
  sideSectionTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.textDark, marginBottom: SPACING.md, marginTop: SPACING.sm },
  contactCard: { flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.sm, marginBottom: SPACING.md, backgroundColor: COLORS.white, padding: SPACING.md, borderRadius: BORDER_RADIUS.md, ...SHADOWS.small },
  contactText: { flex: 1, fontSize: FONT_SIZE.sm, color: COLORS.textMedium, lineHeight: 20 },
  sideImage: { width: '100%', height: 120, borderRadius: BORDER_RADIUS.md, marginTop: SPACING.md, resizeMode: 'cover' },
  sideImageTop: { width: '100%', height: 140, borderRadius: BORDER_RADIUS.lg, marginBottom: SPACING.lg, resizeMode: 'cover' },
  phoneFrame: {
    width: 390,
    maxHeight: '90vh' as any,
    backgroundColor: '#1A1A1A',
    borderRadius: 40,
    padding: 10,
    ...SHADOWS.large,
    shadowOpacity: 0.25,
  },
  phoneNotch: {
    width: 120,
    height: 24,
    backgroundColor: '#1A1A1A',
    borderRadius: 12,
    alignSelf: 'center',
    marginBottom: 4,
    marginTop: -2,
  },
  phoneScreen: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 32,
    overflow: 'hidden',
    minHeight: 680,
    maxHeight: '85vh' as any,
  },
});
