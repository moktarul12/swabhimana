import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { LOCAL_IMAGES } from '../constants/images';
import {
  APP_NAME, APP_TAGLINE, APP_URL, MOTTO, VISION, MISSION,
  ABOUT_INTRO, ABOUT_PARAGRAPHS, ABOUT_PILLARS, ABOUT_VALUES, CONTACT,
} from '../constants/branding';

type AboutPanelProps = {
  compact?: boolean;
  showContact?: boolean;
  onDonatePress?: () => void;
};

export function AboutPanel({ compact, showContact = true, onDonatePress }: AboutPanelProps) {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.content, compact && styles.contentCompact]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <Image source={LOCAL_IMAGES.homeFamily} style={styles.heroImage} />
        <LinearGradient colors={['rgba(13,59,18,0.2)', 'rgba(13,59,18,0.88)']} style={styles.heroOverlay} />
        <View style={styles.heroContent}>
          <View style={styles.heroBadge}>
            <Ionicons name="heart" size={14} color={COLORS.white} />
            <Text style={styles.heroBadgeText}>About Us</Text>
          </View>
          <Text style={styles.heroTitle}>{APP_NAME}</Text>
          <Text style={styles.heroTagline}>{APP_TAGLINE}</Text>
        </View>
      </View>

      <View style={[styles.introCard, compact && styles.introCardCompact]}>
        <Text style={styles.introLead}>{ABOUT_INTRO}</Text>
      </View>

      {ABOUT_PARAGRAPHS.map((para, i) => (
        <Text key={i} style={styles.paragraph}>{para}</Text>
      ))}

      <View style={styles.valuesRow}>
        {ABOUT_VALUES.map((v) => (
          <View key={v.label} style={styles.valueChip}>
            <Ionicons name={v.icon} size={16} color={COLORS.primary} />
            <Text style={styles.valueLabel}>{v.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.highlightCards}>
        <LinearGradient colors={['#1B5E20', '#2E7D32']} style={styles.highlightCard}>
          <Ionicons name="eye-outline" size={28} color={COLORS.white} />
          <Text style={styles.highlightTitle}>Our Vision</Text>
          <Text style={styles.highlightBody}>{VISION}</Text>
        </LinearGradient>

        <View style={[styles.highlightCard, styles.highlightCardLight]}>
          <Ionicons name="rocket-outline" size={28} color={COLORS.primary} />
          <Text style={[styles.highlightTitle, styles.highlightTitleDark]}>Our Mission</Text>
          <Text style={[styles.highlightBody, styles.highlightBodyDark]}>{MISSION}</Text>
        </View>
      </View>

      <LinearGradient colors={['#E8F5E9', '#C8E6C9']} style={styles.mottoBanner}>
        <Ionicons name="chatbubble-ellipses-outline" size={24} color={COLORS.primary} />
        <Text style={styles.mottoText}>{MOTTO}</Text>
      </LinearGradient>

      {!compact && (
        <>
          <Text style={styles.sectionTitle}>What We Support</Text>
          <View style={styles.pillarGrid}>
            {ABOUT_PILLARS.map((p) => (
              <View key={p.title} style={styles.pillarCard}>
                <View style={styles.pillarIcon}>
                  <Ionicons name={p.icon} size={22} color={COLORS.primary} />
                </View>
                <Text style={styles.pillarTitle}>{p.title}</Text>
                <Text style={styles.pillarDesc}>{p.desc}</Text>
              </View>
            ))}
          </View>

          <View style={styles.imageStrip}>
            <Image source={LOCAL_IMAGES.programEducation} style={styles.stripImage} />
            <Image source={LOCAL_IMAGES.programFood} style={styles.stripImage} />
            <Image source={LOCAL_IMAGES.splashChildren} style={styles.stripImage} />
          </View>
        </>
      )}

      {showContact && (
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Reach Us</Text>
          <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL(`tel:+91${CONTACT.phoneRaw}`)}>
            <View style={styles.contactIcon}><Ionicons name="call" size={18} color={COLORS.primary} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactLabel}>{CONTACT.name}</Text>
              <Text style={styles.contactValue}>{CONTACT.phone}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL(`mailto:${CONTACT.email}`)}>
            <View style={styles.contactIcon}><Ionicons name="mail" size={18} color={COLORS.primary} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>{CONTACT.email}</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.contactRow}
            onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(CONTACT.address)}`)}
          >
            <View style={styles.contactIcon}><Ionicons name="location" size={18} color={COLORS.primary} /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactLabel}>Address</Text>
              <Text style={styles.contactValue}>{CONTACT.address}</Text>
            </View>
          </TouchableOpacity>
          {Platform.OS === 'web' && (
            <TouchableOpacity style={styles.websiteBtn} onPress={() => Linking.openURL(APP_URL)}>
              <Ionicons name="globe-outline" size={18} color={COLORS.white} />
              <Text style={styles.websiteBtnText}>{APP_URL.replace('https://', '')}</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {onDonatePress && (
        <TouchableOpacity style={styles.donateBtn} onPress={onDonatePress} activeOpacity={0.9}>
          <LinearGradient colors={['#1B5E20', '#2E7D32']} style={styles.donateBtnGradient}>
            <Ionicons name="gift" size={20} color={COLORS.white} />
            <Text style={styles.donateBtnText}>Start Donating</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { paddingBottom: SPACING.xxxl },
  contentCompact: { paddingBottom: SPACING.xl },
  hero: { height: 220, position: 'relative', marginBottom: SPACING.lg },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  heroOverlay: { ...StyleSheet.absoluteFill },
  heroContent: { position: 'absolute', bottom: SPACING.lg, left: SPACING.lg, right: SPACING.lg },
  heroBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: SPACING.sm, paddingVertical: 4,
    borderRadius: BORDER_RADIUS.round, marginBottom: SPACING.sm,
  },
  heroBadgeText: { color: COLORS.white, fontSize: FONT_SIZE.xs, fontWeight: '600' },
  heroTitle: { fontSize: FONT_SIZE.huge, fontWeight: '800', color: COLORS.white },
  heroTagline: { fontSize: FONT_SIZE.md, color: 'rgba(255,255,255,0.9)', marginTop: 4 },
  introCard: {
    marginHorizontal: SPACING.lg, marginBottom: SPACING.lg, padding: SPACING.lg,
    backgroundColor: COLORS.primaryPale, borderRadius: BORDER_RADIUS.lg,
    borderLeftWidth: 4, borderLeftColor: COLORS.primary,
  },
  introCardCompact: { marginHorizontal: 0 },
  introLead: { fontSize: FONT_SIZE.lg, fontWeight: '600', color: COLORS.textDark, lineHeight: 28 },
  paragraph: {
    fontSize: FONT_SIZE.md, color: COLORS.textMedium, lineHeight: 26,
    paddingHorizontal: SPACING.lg, marginBottom: SPACING.md,
  },
  valuesRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm,
    paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg,
  },
  valueChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.white, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round, borderWidth: 1, borderColor: COLORS.borderLight, ...SHADOWS.small,
  },
  valueLabel: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.primary },
  highlightCards: { paddingHorizontal: SPACING.lg, gap: SPACING.md, marginBottom: SPACING.lg },
  highlightCard: { borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg, ...SHADOWS.medium },
  highlightCardLight: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.borderLight },
  highlightTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.white, marginTop: SPACING.sm, marginBottom: SPACING.sm },
  highlightTitleDark: { color: COLORS.textDark },
  highlightBody: { fontSize: FONT_SIZE.md, color: 'rgba(255,255,255,0.92)', lineHeight: 24 },
  highlightBodyDark: { color: COLORS.textMedium },
  mottoBanner: {
    marginHorizontal: SPACING.lg, borderRadius: BORDER_RADIUS.lg, padding: SPACING.lg,
    flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.xl,
  },
  mottoText: { flex: 1, fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.primary, fontStyle: 'italic', lineHeight: 24 },
  sectionTitle: {
    fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.textDark,
    paddingHorizontal: SPACING.lg, marginBottom: SPACING.md,
  },
  pillarGrid: {
    flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: SPACING.lg, gap: SPACING.sm, marginBottom: SPACING.lg,
  },
  pillarCard: {
    width: '48%', backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md, borderWidth: 1, borderColor: COLORS.borderLight, ...SHADOWS.small,
  },
  pillarIcon: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primaryLighter,
    alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.sm,
  },
  pillarTitle: { fontSize: FONT_SIZE.sm, fontWeight: '700', color: COLORS.textDark },
  pillarDesc: { fontSize: FONT_SIZE.xs, color: COLORS.textMedium, marginTop: 4, lineHeight: 16 },
  imageStrip: { flexDirection: 'row', gap: SPACING.sm, paddingHorizontal: SPACING.lg, marginBottom: SPACING.xl },
  stripImage: { flex: 1, height: 90, borderRadius: BORDER_RADIUS.md, resizeMode: 'cover' },
  contactSection: { paddingHorizontal: SPACING.lg, marginBottom: SPACING.lg },
  contactRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: SPACING.md,
    backgroundColor: COLORS.white, padding: SPACING.md, borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.borderLight, ...SHADOWS.small,
  },
  contactIcon: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primaryLighter,
    alignItems: 'center', justifyContent: 'center',
  },
  contactLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textLight, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  contactValue: { fontSize: FONT_SIZE.md, color: COLORS.textDark, marginTop: 2, lineHeight: 22 },
  websiteBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.primary, padding: SPACING.md, borderRadius: BORDER_RADIUS.md, marginTop: SPACING.sm,
  },
  websiteBtnText: { color: COLORS.white, fontWeight: '600', fontSize: FONT_SIZE.md },
  donateBtn: { marginHorizontal: SPACING.lg, borderRadius: BORDER_RADIUS.lg, overflow: 'hidden', ...SHADOWS.medium },
  donateBtnGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm, padding: SPACING.lg },
  donateBtnText: { color: COLORS.white, fontSize: FONT_SIZE.lg, fontWeight: '700' },
});
