import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppLogo } from '../components/AppLogo';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';
import { LOCAL_IMAGES, resolveImage } from '../constants/images';
import { APP_NAME, APP_TAGLINE, MOTTO } from '../constants/branding';
import { useAuth } from '../context/AuthContext';
import { db, ImpactStats, Story } from '../services/database';

const STEPS = [
  {
    num: '01',
    title: 'Upload unused items',
    body: 'Clothes, food, books, toys — anything in good condition that someone else can use.',
    icon: 'cloud-upload-outline' as const,
    color: '#1B5E20',
    image: LOCAL_IMAGES.donationClothes,
  },
  {
    num: '02',
    title: 'Send it to us',
    body: 'Schedule a free pickup. Our volunteer comes to your door — no travel, no cost.',
    icon: 'bicycle-outline' as const,
    color: '#E65100',
    image: LOCAL_IMAGES.collectedPhoto,
  },
  {
    num: '03',
    title: 'We distribute with care',
    body: 'Every item reaches a family in need. You get updates from pickup to delivery.',
    icon: 'heart-outline' as const,
    color: '#7B1FA2',
    image: LOCAL_IMAGES.deliveryPhoto,
  },
];

const HISTORY_FALLBACK = [
  { title: 'Clothes distributed', detail: '15 warm outfits reached a family in Koramangala', image: LOCAL_IMAGES.donationClothes, tag: 'Completed' },
  { title: 'Food ration shared', detail: '5 food packs delivered to families in need', image: LOCAL_IMAGES.donationFood, tag: 'Collected' },
  { title: 'Books for children', detail: '20 storybooks opened a classroom door', image: LOCAL_IMAGES.donationBooks, tag: 'Distributed' },
];

export default function WelcomeScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { user, continueAsGuest } = useAuth();
  const [stats, setStats] = useState<ImpactStats | null>(null);
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    db.getImpactStats().then(setStats).catch(() => {});
    db.getStories().then((s) => setStories(s.slice(0, 3))).catch(() => {});
  }, []);

  const exploreAsGuest = async () => {
    if (!user) await continueAsGuest();
    navigation.replace('Main');
  };

  const goDonate = () => {
    if (user) navigation.replace('Main', { screen: 'DonateTab' });
    else navigation.navigate('Login');
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + SPACING.xxxl }}
      >
        {/* HERO */}
        <LinearGradient colors={['#0D3B12', '#1B5E20', '#2E7D32']} style={styles.hero}>
          <View style={styles.heroTop}>
            <AppLogo size="sm" direction="row" color={COLORS.white} />
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.heroLogin}>
              <Text style={styles.heroLoginText}>Login</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.heroEyebrow}>A simple way to help</Text>
          <Text style={styles.heroTitle}>
            Don't throw it away.{'\n'}
            <Text style={styles.heroTitleAccent}>Pass it on.</Text>
          </Text>
          <Text style={styles.heroSub}>
            Upload your unused food & items. Send them to {APP_NAME}. We collect and distribute to people who need them most.
          </Text>
          <Image source={LOCAL_IMAGES.homeFamily} style={styles.heroImage} />
        </LinearGradient>

        {/* CONCEPT STEPS */}
        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>How it works</Text>
          <Text style={styles.sectionTitle}>Three steps. Real impact.</Text>
          <Text style={styles.sectionSub}>From your cupboard to someone's smile — we handle the middle.</Text>

          {STEPS.map((step, i) => (
            <View key={step.num} style={styles.stepCard}>
              <View style={styles.stepLeft}>
                <View style={[styles.stepNum, { backgroundColor: step.color + '18' }]}>
                  <Text style={[styles.stepNumText, { color: step.color }]}>{step.num}</Text>
                </View>
                {i < STEPS.length - 1 && <View style={styles.stepLine} />}
              </View>
              <View style={styles.stepBody}>
                <View style={styles.stepHeader}>
                  <View style={[styles.stepIcon, { backgroundColor: step.color }]}>
                    <Ionicons name={step.icon} size={20} color={COLORS.white} />
                  </View>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                </View>
                <Text style={styles.stepDesc}>{step.body}</Text>
                <Image source={step.image} style={styles.stepImage} />
              </View>
            </View>
          ))}
        </View>

        {/* WHAT WE ACCEPT */}
        <View style={styles.acceptStrip}>
          {[
            { icon: 'shirt-outline' as const, label: 'Clothes' },
            { icon: 'fast-food-outline' as const, label: 'Food' },
            { icon: 'book-outline' as const, label: 'Books' },
            { icon: 'game-controller-outline' as const, label: 'Toys' },
            { icon: 'bed-outline' as const, label: 'Furniture' },
          ].map((item) => (
            <View key={item.label} style={styles.acceptChip}>
              <Ionicons name={item.icon} size={18} color={COLORS.primary} />
              <Text style={styles.acceptLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* IMPACT STATS */}
        <LinearGradient colors={['#F1F8F1', '#E8F5E9']} style={styles.statsBanner}>
          <Text style={styles.statsTitle}>Together, we already changed lives</Text>
          <View style={styles.statsRow}>
            {[
              { value: stats?.items_donated || '18,750+', label: 'Items shared' },
              { value: stats?.families_helped || '8,320+', label: 'Families helped' },
              { value: stats?.lives_impacted || '6,980+', label: 'Lives touched' },
            ].map((s) => (
              <View key={s.label} style={styles.statItem}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* RECENT HISTORY */}
        <View style={styles.section}>
          <Text style={styles.sectionEyebrow}>Recent journeys</Text>
          <Text style={styles.sectionTitle}>What we did recently</Text>
          <Text style={styles.sectionSub}>Real donations that left a cupboard and arrived as hope.</Text>

          {(stories.length > 0
            ? stories.map((s) => ({
                title: s.title,
                detail: s.excerpt,
                image: resolveImage(s.image_key),
                tag: s.category,
              }))
            : HISTORY_FALLBACK
          ).map((item, i) => (
            <View key={i} style={styles.historyCard}>
              <Image source={item.image} style={styles.historyImage} />
              <View style={styles.historyBody}>
                <View style={styles.historyTag}>
                  <Text style={styles.historyTagText}>{item.tag}</Text>
                </View>
                <Text style={styles.historyTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.historyDetail} numberOfLines={2}>{item.detail}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* MOTTO BANNER */}
        <View style={styles.mottoCard}>
          <Ionicons name="chatbubble-ellipses" size={28} color={COLORS.primary} />
          <Text style={styles.mottoText}>{MOTTO}</Text>
          <Text style={styles.mottoSub}>{APP_TAGLINE}</Text>
        </View>

        {/* CTAS */}
        <View style={styles.ctaBlock}>
          <TouchableOpacity style={styles.ctaPrimary} onPress={goDonate} activeOpacity={0.9}>
            <Ionicons name="cloud-upload" size={20} color={COLORS.white} />
            <Text style={styles.ctaPrimaryText}>Upload & Donate Now</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctaSecondary} onPress={exploreAsGuest} activeOpacity={0.9}>
            <Ionicons name="compass-outline" size={18} color={COLORS.primary} />
            <Text style={styles.ctaSecondaryText}>Explore as Guest</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.signupLink}>
            <Text style={styles.signupText}>
              New here? <Text style={styles.signupBold}>Create a free account</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.white },

  hero: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxxl,
    borderBottomLeftRadius: BORDER_RADIUS.xxxl,
    borderBottomRightRadius: BORDER_RADIUS.xxxl,
    overflow: 'hidden',
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: SPACING.xl },
  heroLogin: {
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)',
  },
  heroLoginText: { color: COLORS.white, fontWeight: '700', fontSize: FONT_SIZE.sm },
  heroEyebrow: {
    fontSize: FONT_SIZE.sm, fontWeight: '700', color: 'rgba(255,255,255,0.75)',
    textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: SPACING.sm,
  },
  heroTitle: { fontSize: 34, lineHeight: 40, fontWeight: '800', color: COLORS.white },
  heroTitleAccent: { color: '#A5D6A7' },
  heroSub: {
    fontSize: FONT_SIZE.md, color: 'rgba(255,255,255,0.9)', lineHeight: 24,
    marginTop: SPACING.md, marginBottom: SPACING.xl, maxWidth: 340,
  },
  heroImage: {
    width: '100%', height: 180, borderRadius: BORDER_RADIUS.xl, resizeMode: 'cover',
    ...(Platform.OS === 'web' ? { boxShadow: '0 12px 40px rgba(0,0,0,0.25)' } as any : SHADOWS.large),
  },

  section: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.xxxl },
  sectionEyebrow: {
    fontSize: FONT_SIZE.xs, fontWeight: '700', color: COLORS.primary,
    textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: SPACING.xs,
  },
  sectionTitle: { fontSize: FONT_SIZE.xxl, fontWeight: '800', color: COLORS.textDark, marginBottom: SPACING.xs },
  sectionSub: { fontSize: FONT_SIZE.md, color: COLORS.textMedium, lineHeight: 22, marginBottom: SPACING.xl },

  stepCard: { flexDirection: 'row', marginBottom: SPACING.lg },
  stepLeft: { alignItems: 'center', width: 44, marginRight: SPACING.md },
  stepNum: {
    width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
  },
  stepNumText: { fontSize: FONT_SIZE.sm, fontWeight: '800' },
  stepLine: { flex: 1, width: 2, backgroundColor: COLORS.borderLight, marginVertical: 4, minHeight: 40 },
  stepBody: { flex: 1, paddingBottom: SPACING.md },
  stepHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm },
  stepIcon: {
    width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center',
  },
  stepTitle: { flex: 1, fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.textDark },
  stepDesc: { fontSize: FONT_SIZE.md, color: COLORS.textMedium, lineHeight: 22, marginBottom: SPACING.md },
  stepImage: { width: '100%', height: 120, borderRadius: BORDER_RADIUS.lg, resizeMode: 'cover' },

  acceptStrip: {
    flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm,
    paddingHorizontal: SPACING.xl, paddingTop: SPACING.lg, justifyContent: 'center',
  },
  acceptChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: COLORS.primaryPale, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round, borderWidth: 1, borderColor: COLORS.borderLight,
  },
  acceptLabel: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.primary },

  statsBanner: {
    marginHorizontal: SPACING.xl, marginTop: SPACING.xxxl, borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl, ...SHADOWS.small,
  },
  statsTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.textDark, textAlign: 'center', marginBottom: SPACING.lg },
  statsRow: { flexDirection: 'row' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: FONT_SIZE.xl, fontWeight: '800', color: COLORS.primary },
  statLabel: { fontSize: FONT_SIZE.xs, color: COLORS.textMedium, marginTop: 4, textAlign: 'center' },

  historyCard: {
    flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.borderLight, ...SHADOWS.small,
  },
  historyImage: { width: 96, height: 96, resizeMode: 'cover' },
  historyBody: { flex: 1, padding: SPACING.md, justifyContent: 'center' },
  historyTag: {
    alignSelf: 'flex-start', backgroundColor: COLORS.primaryLighter,
    paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: BORDER_RADIUS.sm, marginBottom: 4,
  },
  historyTagText: { fontSize: 10, fontWeight: '700', color: COLORS.primary, textTransform: 'uppercase' },
  historyTitle: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.textDark },
  historyDetail: { fontSize: FONT_SIZE.sm, color: COLORS.textMedium, marginTop: 2, lineHeight: 18 },

  mottoCard: {
    marginHorizontal: SPACING.xl, marginTop: SPACING.xl, padding: SPACING.xl,
    backgroundColor: COLORS.primaryPale, borderRadius: BORDER_RADIUS.xl, alignItems: 'center',
  },
  mottoText: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.primary, textAlign: 'center', fontStyle: 'italic', marginTop: SPACING.md, lineHeight: 26 },
  mottoSub: { fontSize: FONT_SIZE.sm, color: COLORS.textMedium, marginTop: SPACING.sm },

  ctaBlock: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.xxxl, gap: SPACING.md },
  ctaPrimary: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm,
    backgroundColor: COLORS.primary, paddingVertical: SPACING.lg, borderRadius: BORDER_RADIUS.round, ...SHADOWS.medium,
  },
  ctaPrimaryText: { color: COLORS.white, fontWeight: '800', fontSize: FONT_SIZE.lg },
  ctaSecondary: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: SPACING.sm,
    paddingVertical: SPACING.lg, borderRadius: BORDER_RADIUS.round,
    borderWidth: 1.5, borderColor: COLORS.primary, backgroundColor: COLORS.white,
  },
  ctaSecondaryText: { color: COLORS.primary, fontWeight: '700', fontSize: FONT_SIZE.md },
  signupLink: { alignItems: 'center', paddingVertical: SPACING.sm },
  signupText: { fontSize: FONT_SIZE.sm, color: COLORS.textMedium },
  signupBold: { color: COLORS.primary, fontWeight: '700' },
});
